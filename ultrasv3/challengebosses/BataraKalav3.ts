/*
name: BataraKala
description: Batara Kala v3 — 2-taunter fight flow with pulse-driven taunts and army sync. Farms Kala Insignia (Ultra Kala).
tags: batara, kala, ultra kala, insignia
*/
// Port of Scripts/Ultrasv3/ChallengeBosses/BataraKalav3.cs.
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

export class BataraKalav3 {
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

    private equipPresetClasses(): void {
        UltraGeneral.equipPresetClasses(Ultra, bot, "batarakala_class-v3.sync");
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

    myTaunterIndex(): number {
        const className = bot.player.currentClass;
        if (className === bot.config!.get<string>("Taunter1Class")) {
            return 0;
        }
        if (className === bot.config!.get<string>("Taunter2Class")) {
            return 1;
        }
        return -1;
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
            this._role = "Taunter1";
        } else if (className === bot.config!.get<string>("Taunter2Class")) {
            this._role = "Taunter2";
        }
        Core.logger(`[BataraKala] Role: ${this._role} (${className})`);

        if (bot.config!.get<boolean>("DoEnh")) {
            this.doEnhs();
        }

        const skipThird = this.isTaunter();
        const potionQuant = bot.config!.get<number>("PotionQuantity");
        if (this.usePotions) {
            Pots.ensureRecommendedPotions(potionQuant, skipThird);
            Pots.useRecommendedPotions(potionQuant, skipThird, undefined, false);
        }

        bot.sleep(2500);
    }

    doEnhs(): void {
        Enh.apply();
    }

    private fight(): void {
        const map = "ultrakala";
        const boss = "Batara Kala";
        const bossDefeatedTemp = "Kala Batara Defeated";

        const waitSyncFile = "batarakalav3.sync";
        const completionSyncFile = "BataraKalaCompletion.sync";
        const fightTimeSyncFile = "BataraKalaFightTime.sync";
        const armySize = Math.max(1, bot.config!.get<number>("ArmySize"));

        const questId = 8216;

        if (!UltraGeneral.isQuestGreen(bot, questId)) {
            UltraGeneral.ensureAcceptOnce(bot, questId);
        }

        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));
        Ultra.clearSyncFile(Ultra.resolveSyncPath(fightTimeSyncFile));

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
            Core.logger("[BataraKala] Taunter detected, equipping Scroll of Enrage.");
            Engine.equipEnrage();
        }

        Engine.join(map);
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, true);

        Engine.chooseBestCell(boss);
        bot.player.setSpawnPoint();

        // ── Taunt loop setup ────────────────────────────────────
        const fightTimeSyncPath = Ultra.resolveSyncPath(fightTimeSyncFile);
        if (this._role === "Taunter1") {
            Core.logger("[BataraKala] Taunter1 (Primary) — setting fight start time.");
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
        } else if (this._role === "Taunter2") {
            Core.logger("[BataraKala] Taunter2 (Secondary) — reading fight start time.");
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

        // Pre-seed completion sync file so all 4 entries exist before the loop starts.
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
                Core.logger("Boss defeated. Finishing quest.");
                bot.events.off("scriptStopping", this.stopTauntEvent);
                this._tauntCts.cancel();
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                break;
            }

            // Default — attack the boss
            if (bot.player.target?.name !== boss) {
                bot.combat.attack(boss);
            }

            if (this.usePotions) {
                Pots.activateEquippedPotion();
            }
            bot.sleep(500);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "BataraKala",
    [
        option.int("ArmySize", "Army Size", "How many players are in your army (including yourself).", 4),
        option.text(
            "Taunter1Class",
            "Taunter 1 Class (Primary)",
            "Class name for Taunter 1 (sets fight start time).",
            "Verus DoomKnight",
        ),
        option.text("Taunter2Class", "Taunter 2 Class (Secondary)", "Class name for Taunter 2.", "Lord of Order"),
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
    const script = new BataraKalav3();
    script.runBoss();
    bot.stop();
}
