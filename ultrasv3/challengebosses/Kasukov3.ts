/*
name: Kasukov3
description: Kasuko challenge boss v3 — 2 taunters taunt Kasuko and attack Whirlpool. Army sync with taunt loop via UltraAsync.
tags: kasuko, challenge boss
*/
// Port of Scripts/Ultrasv3/ChallengeBosses/Kasukov3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, type EventMap, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CancellationTokenSource } from "../../core/CoreTasks";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { GetScrolls } from "../dependenciesultras/GetScrolls";
import { UltraAsync } from "../dependenciesultras/UltraAsync";
import { UltraEnhancements } from "../dependenciesultras/UltraEnhancements";
import { UltraGeneral } from "../dependenciesultras/UltraGeneral";
import { UltraPotions } from "../dependenciesultras/UltraPotions";
import { UltraWaitForArmy } from "../dependenciesultras/UltraWaitForArmy";

const Engine = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();
const Enh = new UltraEnhancements();
const Pots = new UltraPotions();
const Scrolls = new GetScrolls();

export class Kasukov3 {
    // ── Boss & Map Data ──────────────────────────────────────────
    // Monsters on lavarockshore (2 total):
    // "Whirlpool" [MapID: 1, HP: 1,000,000] — add / priority target for taunters
    // "Kasuko"    [MapID: 2, HP: 5,000,000] — main boss
    private static readonly whirlpoolMapID = 1;
    static readonly kasukoMapID = 2;

    // ── Taunter Role Names ──────────────────────────────────────
    private static readonly taunter1AttackWhirlpool1 = "Taunter1AttackWhirlpool1";
    private static readonly taunter2AttackWhirlpool2 = "Taunter2AttackWhirlpool2";

    usePotions: boolean = false;
    private _tauntCts: CancellationTokenSource = new CancellationTokenSource();
    private fightStartTime: number = 0;
    private _role = "";

    runBoss(): void {
        Core.setOptions(true);

        Engine.boot();
        this._tauntCts = new CancellationTokenSource();
        bot.events.off("scriptStopping", this.stopTauntEvent);
        bot.events.on("scriptStopping", this.stopTauntEvent);

        try {
            this.prep();
            this.fight();
        } finally {
            bot.events.off("scriptStopping", this.stopTauntEvent);
            this._tauntCts.cancel();

            Engine.disableSkills();
            Core.setOptions(false);
        }
    }

    private stopTauntEvent = (e: EventMap["scriptStopping"]): boolean => {
        this._tauntCts.cancel();
        return true;
    };

    private isTaunter(): boolean {
        const className = bot.player.currentClass;
        return (
            className === bot.config!.get<string>("Taunter1Class") ||
            className === bot.config!.get<string>("Taunter2Class")
        );
    }

    private myTaunterIndex(): number {
        const className = bot.player.currentClass;
        if (className === bot.config!.get<string>("Taunter1Class")) {
            return 0;
        }
        if (className === bot.config!.get<string>("Taunter2Class")) {
            return 1;
        }
        return -1;
    }

    private equipPresetClasses(): void {
        UltraGeneral.equipPresetClasses(Ultra, bot, "kasukov3_class-v3.sync");
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        this.usePotions = bot.config!.get<boolean>("UsePotions");

        // Determine role based on equipped class
        const className = bot.player.currentClass;
        if (className === bot.config!.get<string>("Taunter1Class")) {
            this._role = Kasukov3.taunter1AttackWhirlpool1;
        } else if (className === bot.config!.get<string>("Taunter2Class")) {
            this._role = Kasukov3.taunter2AttackWhirlpool2;
        }
        Core.logger(`[Kasukov3] Role: ${this._role} (${className})`);

        if (bot.config!.get<boolean>("DoEnh")) {
            Enh.apply();
        }

        const skipThird = this.isTaunter();
        const potionQuant = bot.config!.get<number>("PotionQuantity");
        if (this.usePotions) {
            Pots.ensureRecommendedPotions(potionQuant, skipThird);
            Pots.useRecommendedPotions(potionQuant, skipThird, undefined, false);
        }

        bot.sleep(2500);
    }

    private fight(): void {
        const map = "lavarockshore";
        const boss = "Kasuko";
        const bossDefeatedTemp = "Molten Heart";

        const waitSyncFile = "kasukov3.sync";
        const completionSyncFile = "Kasukov3Completion.sync";
        const armySize = Math.max(1, bot.config!.get<number>("ArmySize"));

        const questId = 9254;

        if (!UltraGeneral.isQuestGreen(bot, questId)) {
            UltraGeneral.ensureAcceptOnce(bot, questId);
        }

        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));

        const skipThird = this.isTaunter();
        const potionQuant = bot.config!.get<number>("PotionQuantity");
        if (this.usePotions) {
            Pots.ensureRecommendedPotions(potionQuant, skipThird);
        }
        Scrolls.getScrollOfEnrage();

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        if (this.usePotions) {
            Pots.useRecommendedPotions(potionQuant, skipThird, undefined, false);
        }

        if (skipThird) {
            Core.logger("[Kasukov3] Taunter detected, equipping Scroll of Enrage.");
            Engine.equipEnrage();
        }

        Engine.join(map);
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, true);

        Engine.chooseBestCell(boss);
        bot.player.setSpawnPoint();

        // ── Taunt loop setup ────────────────────────────────────
        const fightTimeSyncPath = Ultra.resolveSyncPath("Kasukov3FightTime.sync");
        if (this._role === Kasukov3.taunter1AttackWhirlpool1) {
            Core.logger("[Kasukov3] Taunter1 (Primary) — setting fight start time.");
            this.fightStartTime = UltraAsync.setFightTime(Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(
                bot,
                Core,
                Engine,
                this.fightStartTime,
                0,
                2,
                undefined,
                undefined,
                this._tauntCts.token,
            );
        } else if (this._role === Kasukov3.taunter2AttackWhirlpool2) {
            Core.logger("[Kasukov3] Taunter2 — reading fight start time.");
            this.fightStartTime = UltraAsync.getFightTime(Ultra, Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(
                bot,
                Core,
                Engine,
                this.fightStartTime,
                1,
                2,
                undefined,
                undefined,
                this._tauntCts.token,
            );
        }

        bot.sleep(2000);

        // Pre-seed completion sync file so all entries exist before the loop starts.
        const _username = bot.player.username;
        const _className = bot.player.currentClass;
        if (!!_username?.trim() && !!_className?.trim()) {
            const _myKey = `${_username}|${_className}`.replaceAll(":", "-");
            Ultra.updateEntry(Ultra.resolveSyncPath(completionSyncFile), _myKey, "0");
        }

        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (Ultra.checkArmyProgressBool(() => bot.tempInv.contains(bossDefeatedTemp, 1), completionSyncFile)) {
                Core.logger("Kasuko defeated. Finishing quest.");
                bot.events.off("scriptStopping", this.stopTauntEvent);
                this._tauntCts.cancel();
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                break;
            }

            // ── Dynamic targeting ─────────────────────────────────
            // Taunters: attack Whirlpool normally, switch to Kasuko during
            //           taunt pulse window (~1s before to ~3s after) to land the taunt.
            //           Pattern from UltraNulgathv3 Taunter3AttackBlade.
            // Non-taunters: Whirlpool (MapID 1) → Kasuko (MapID 2)
            if (this.isTaunter()) {
                const elapsed = (Date.now() - this.fightStartTime) / 1000;
                const pulseInterval = 5;
                const cycleLength = 2 * pulseInterval;
                // 10s cycle for 2 taunters
                const timeInCycle = elapsed % cycleLength;
                const myFireTime = this.myTaunterIndex() * pulseInterval;
                const startWindow = (myFireTime - 1 + cycleLength) % cycleLength;
                const endWindow = (myFireTime + 3) % cycleLength;

                let inTauntWindow: boolean;
                if (startWindow < endWindow) {
                    inTauntWindow = timeInCycle >= startWindow && timeInCycle <= endWindow;
                } else {
                    inTauntWindow = timeInCycle >= startWindow || timeInCycle <= endWindow;
                }

                if (inTauntWindow) {
                    // During taunt window — target Kasuko to land the taunt
                    if (bot.player.target?.name !== boss) {
                        bot.combat.attack(boss);
                    }
                } else {
                    // Outside taunt window — attack Whirlpool if alive, else Kasuko
                    if (
                        bot.monsters.currentAvailableMonsters.some(
                            (x) => x != null && x.mapId === Kasukov3.whirlpoolMapID && x.hp > 0,
                        )
                    ) {
                        if (bot.player.target?.mapId !== Kasukov3.whirlpoolMapID) {
                            bot.combat.attack(Kasukov3.whirlpoolMapID);
                        }
                    } else if (bot.player.target?.name !== boss) {
                        bot.combat.attack(boss);
                    }
                }
            } else {
                // Non-taunter — Whirlpool first, then Kasuko
                if (
                    bot.monsters.currentAvailableMonsters.some(
                        (x) => x != null && x.mapId === Kasukov3.whirlpoolMapID && x.hp > 0,
                    )
                ) {
                    if (bot.player.target?.mapId !== Kasukov3.whirlpoolMapID) {
                        bot.combat.attack(Kasukov3.whirlpoolMapID);
                    }
                } else if (bot.player.target?.name !== boss) {
                    bot.combat.attack(boss);
                }
            }

            if (this.usePotions) {
                Pots.activateEquippedPotion();
            }
            bot.sleep(500);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "Kasukov3",
    [
        option.int("ArmySize", "Army Size", "How many players are in your army (including yourself).", 4),
        option.text(
            "Taunter1Class",
            "Taunter 1 Class (Primary)",
            "Class name for Taunter1 — taunts Kasuko and attacks Whirlpool.",
            "Verus DoomKnight",
        ),
        option.text(
            "Taunter2Class",
            "Taunter 2 Class (Secondary)",
            "Class name for Taunter2 — taunts Kasuko and attacks Whirlpool.",
            "Lord of Order",
        ),
        option.text(
            "Class1",
            "Class 1",
            "Preset class 1 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "Verus DoomKnight",
        ),
        option.text(
            "Class2",
            "Class 2",
            "Preset class 2 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "Lord of Order",
        ),
        option.text(
            "Class3",
            "Class 3",
            "Preset class 3 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "StoneCrusher",
        ),
        option.text(
            "Class4",
            "Class 4",
            "Preset class 4 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "King's Echo",
        ),
        option.text(
            "Class5",
            "Class 5",
            "Preset class 5 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "",
        ),
        option.text(
            "Class6",
            "Class 6",
            "Preset class 6 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "",
        ),
        option.text(
            "Class7",
            "Class 7",
            "Preset class 7 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "",
        ),
        option.bool("DoEnh", "Do Enhancements", "Auto-Enhance Gear properly for the fight", true),
        option.bool("UsePotions", "Use Potions", "Enable buying and consuming recommended potions.", true),
        option.int("PotionQuantity", "Potion Quantity", "How many potions to keep stocked.", 10),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new Kasukov3();
    script.runBoss();
    bot.stop();
}
