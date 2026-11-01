/*
name: AstralEmpyreanv3
description: Two-taunter strategy for Astral Empyrean with aura-based taunting and army synchronization.
tags: null
*/
// Port of Scripts/Ultrasv3/ChallengeBosses/AstralEmpyreanv3.cs.
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

export class AstralEmpyreanv3 {
    usePotions: boolean = false;
    private _tauntCts: CancellationTokenSource = new CancellationTokenSource();
    private fightStartTime: number = 0;
    private _role = "";
    private _deathRetries = 0;
    private static readonly maxDeathRetries = 10;

    static readonly selectDrops = [
        option.bool(
            "NovaEmpyreanGuard",
            "Nova Empyrean Guard",
            "Farm Nova Empyrean Guard from Astral Empyrean.",
            false,
        ),
    ];

    private get doDailyOnly(): boolean {
        return bot.config!.get<boolean>("DoDailyOnly");
    }

    private hasSelectedDrops(): boolean {
        if (bot.config!.get<boolean>("SelectDrops", "NovaEmpyreanGuard")) {
            if (!Core.checkInventory("Nova Empyrean Guard", 1)) {
                return false;
            }
        }
        return true;
    }

    runBoss(): void {
        Core.setOptions(true);

        if (!bot.quests.isUnlocked(9803)) {
            Core.logger("Quest not unlocked: Asterism's Toll, we'll continue anyway");
            bot.quests.updateQuest(9803);
        }

        try {
            const dailyOnly = this.doDailyOnly;

            if (dailyOnly) {
                // Daily mode: existing death-retry loop with quest completion
                while (this._deathRetries < AstralEmpyreanv3.maxDeathRetries) {
                    Engine.boot();
                    this._tauntCts?.cancel();
                    this._tauntCts = new CancellationTokenSource();
                    bot.events.off("scriptStopping", this.stopTauntEvent);
                    bot.events.on("scriptStopping", this.stopTauntEvent);
                    this.prep();
                    this.fight();
                }
            } else {
                // Drop-farm mode: cycle kills until Nova Empyrean Guard collected
                if (bot.config!.get<boolean>("SelectDrops", "NovaEmpyreanGuard")) {
                    Core.addDrop("Nova Empyrean Guard");
                }

                while (!bot.shouldExit && !this.hasSelectedDrops()) {
                    const current = bot.inventory.getQuantity("Nova Empyrean Guard");
                    Core.logger(`Nova Empyrean Guard: ${current}/1`);

                    Engine.boot();
                    this._tauntCts?.cancel();
                    this._tauntCts = new CancellationTokenSource();
                    bot.events.off("scriptStopping", this.stopTauntEvent);
                    bot.events.on("scriptStopping", this.stopTauntEvent);
                    this.prep();
                    this.fight();

                    Engine.enableSkills();
                    bot.sleep(1000);
                }

                if (!bot.shouldExit) {
                    Core.logger("Nova Empyrean Guard collected. Farm complete.");
                }
            }
        } finally {
            bot.events.off("scriptStopping", this.stopTauntEvent);
            this._tauntCts.cancel();

            Engine.disableSkills();
            Core.setOptions(false);
        }
    }

    private equipPresetClasses(): void {
        UltraGeneral.equipPresetClasses(Ultra, bot, "astralempyreanv3_class-v3.sync");
    }

    private stopTauntEvent = (e: EventMap["scriptStopping"]): boolean => {
        this._tauntCts.cancel();
        return true;
    };

    private isTaunter(): boolean {
        const className = bot.player.currentClass;
        return (
            className === bot.config!.get<string>("Taunter1Class") ||
            className === bot.config!.get<string>("Taunter2Class") ||
            className === bot.config!.get<string>("Taunter3Class")
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
        if (className === bot.config!.get<string>("Taunter3Class")) {
            return 2;
        }
        return -1;
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        this.usePotions = bot.config!.get<boolean>("UsePotions");

        const className = bot.player.currentClass;
        if (className === bot.config!.get<string>("Taunter1Class")) {
            this._role = "Taunter1";
        } else if (className === bot.config!.get<string>("Taunter2Class")) {
            this._role = "Taunter2";
        } else if (className === bot.config!.get<string>("Taunter3Class")) {
            this._role = "Taunter3";
        }
        Core.logger(`[AstralEmpyreanv3] Role: ${this._role} (${className})`);

        if (bot.config!.get<boolean>("DoEnh")) {
            this.doEnhs();
        }

        if (!this.doDailyOnly) {
            if (bot.config!.get<boolean>("SelectDrops", "NovaEmpyreanGuard")) {
                Core.addDrop("Nova Empyrean Guard");
            }
        }

        const potionQuant = bot.config!.get<number>("PotionQuantity");
        if (this.usePotions) {
            Pots.ensureRecommendedPotions(potionQuant, this.isTaunter(), "AstralEmpyrean");
            Pots.useRecommendedPotions(potionQuant, this.isTaunter(), "AstralEmpyrean", false);
        }

        bot.quests.updateQuest(9802);
        bot.sleep(2500);
    }

    doEnhs(): void {
        Enh.applyAstralEmpyrean();
    }

    private fight(): void {
        const map = "astralshrine";
        const boss = "Astral Empyrean";
        const bossDefeatedTemp = "Astral's Supernova";

        const waitSyncFile = "AstralEmpyreanv3.sync";
        const completionSyncFile = "AstralEmpyreanv3Completion.sync";
        const killSyncFile = "AstralEmpyreanKill.sync";
        const wipeSyncFile = "AstralEmpyreanWipe.sync";
        const armySize = Math.max(1, bot.config!.get<number>("ArmySize"));

        const questId = 9803;

        const dailyOnly = this.doDailyOnly;

        if (dailyOnly) {
            if (!UltraGeneral.isQuestGreen(bot, questId)) {
                UltraGeneral.ensureAcceptOnce(bot, questId);
            }
        } else {
            Ultra.clearSyncFile(Ultra.resolveSyncPath(killSyncFile));
        }

        Ultra.clearSyncFile(Ultra.resolveSyncPath(wipeSyncFile));
        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));

        const skipThird = this.isTaunter();
        const potionQuant = bot.config!.get<number>("PotionQuantity");
        if (this.usePotions) {
            Pots.ensureRecommendedPotions(potionQuant, skipThird, "AstralEmpyrean");
        }
        Scrolls.getScrollOfEnrage();

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        if (this.usePotions) {
            Pots.useRecommendedPotions(potionQuant, skipThird, "AstralEmpyrean", false);
        }

        if (skipThird) {
            Core.logger("[AstralEmpyreanv3] Taunter detected, equipping Scroll of Enrage.");
            Engine.equipEnrage();
        }

        Engine.join(map);
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, true);

        Engine.chooseBestCell(boss);
        bot.player.setSpawnPoint();

        const fightTimeSyncPath = Ultra.resolveSyncPath("AstralEmpyreanFightTime.sync");
        if (this._role === "Taunter1") {
            Core.logger("[AstralEmpyreanv3] Taunter1 (Primary) — setting fight start time.");
            this.fightStartTime = UltraAsync.setFightTime(Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(
                bot,
                Core,
                Engine,
                this.fightStartTime,
                0,
                3,
                undefined,
                undefined,
                this._tauntCts.token,
            );
        } else if (this._role === "Taunter2") {
            Core.logger("[AstralEmpyreanv3] Taunter2 — reading fight start time.");
            this.fightStartTime = UltraAsync.getFightTime(Ultra, Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(
                bot,
                Core,
                Engine,
                this.fightStartTime,
                1,
                3,
                undefined,
                undefined,
                this._tauntCts.token,
            );
        } else if (this._role === "Taunter3") {
            Core.logger("[AstralEmpyreanv3] Taunter3 — reading fight start time.");
            this.fightStartTime = UltraAsync.getFightTime(Ultra, Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(
                bot,
                Core,
                Engine,
                this.fightStartTime,
                2,
                3,
                undefined,
                undefined,
                this._tauntCts.token,
            );
        }

        // Zone listener must be active in BOTH modes — the zone mechanic (A/B safe boxes)
        // applies whether we're doing the daily or farming drops. Dying to the zone
        // mechanic fails the fight either way.
        bot.events.on("extensionPacket", this.astralZoneListener);
        bot.sleep(2000);

        // Pre-seed completion sync file so all 4 entries exist before the loop starts.
        const _username = bot.player.username;
        const _className = bot.player.currentClass;
        if (!!_username?.trim() && !!_className?.trim()) {
            const _myKey = `${_username}|${_className}`.replaceAll(":", "-");
            Ultra.updateEntry(Ultra.resolveSyncPath(completionSyncFile), _myKey, "0");
        }

        let bossWasEngaged = false;

        while (!bot.shouldExit) {
            // Army-wipe check: all players (alive or dead) report their state.
            // IsWholeArmyDead writes !bot.Player.Alive and checks if ALL entries are "1".
            if (UltraGeneral.isWholeArmyDead(Ultra, bot, Ultra.resolveSyncPath(wipeSyncFile))) {
                this._deathRetries++;
                Core.logger(
                    `[AstralEmpyreanv3] Army wipe detected (${this._deathRetries}/${AstralEmpyreanv3.maxDeathRetries}). Retreating to house.`,
                );
                bot.events.off("extensionPacket", this.astralZoneListener);
                bot.events.off("scriptStopping", this.stopTauntEvent);
                this._tauntCts.cancel();
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                if (this._deathRetries >= AstralEmpyreanv3.maxDeathRetries) {
                    Core.logger(`${AstralEmpyreanv3.maxDeathRetries} wipes reached. Stopping the bot.`, undefined, {
                        messageBox: true,
                        stopBot: true,
                    });
                    break;
                }
                bot.sleep(3000);
                return;
            }

            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (dailyOnly) {
                // Daily: check boss temp item → complete quest
                if (Ultra.checkArmyProgressBool(() => bot.tempInv.contains(bossDefeatedTemp, 1), completionSyncFile)) {
                    Core.logger("Boss defeated. Finishing quest.");
                    bot.events.off("scriptStopping", this.stopTauntEvent);
                    this._tauntCts.cancel();
                    Engine.disableSkills();
                    Engine.join(map);
                    Ultra.persistentJoinHouse();
                    bot.events.off("extensionPacket", this.astralZoneListener);
                    UltraGeneral.completeQuest(bot, questId);
                    bot.sleep(3000);
                    this._deathRetries = AstralEmpyreanv3.maxDeathRetries;
                    break;
                }
            } else {
                // Drop-farm mode: detect boss death by target state
                if (bot.player.hasTarget && bot.player.target?.name === boss) {
                    bossWasEngaged = true;
                }

                if (bossWasEngaged && (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0)) {
                    const key = `${bot.player.username}|kill`;
                    Ultra.updateEntry(Ultra.resolveSyncPath(killSyncFile), key, "1");

                    const lines = Ultra.readLines(Ultra.resolveSyncPath(killSyncFile));
                    const killCount = lines.filter((l) => l.includes(":1:")).length;
                    Core.logger(`Boss kill signal: ${killCount}/${armySize}`);

                    if (killCount >= armySize) {
                        Core.logger("All players confirmed boss kill. Retreating to house.");
                        this._deathRetries = 0;
                        bot.events.off("scriptStopping", this.stopTauntEvent);
                        this._tauntCts.cancel();
                        Engine.disableSkills();
                        Engine.join(map);
                        Ultra.persistentJoinHouse();
                        bot.events.off("extensionPacket", this.astralZoneListener);
                        bot.sleep(3000);
                        break;
                    }
                }
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

    astralZoneListener = (packet: EventMap["extensionPacket"]): void => {
        if (packet?.["params"]?.type?.toString() !== "json") {
            return;
        }
        if (!bot.player.alive) {
            return;
        }
        const data = packet["params"].dataObj;
        if (data?.cmd?.toString() !== "event") {
            return;
        }
        const zoneSet = data?.args?.zoneSet?.toString();
        if (!zoneSet) {
            return;
        }

        let x = 0,
            y = 0;

        switch (zoneSet.toUpperCase()) {
            case "B":
                // Red on bottom - GO UP — center of safe box
                x = 240;
                y = 200;
                break;
            case "A":
                // Red on top - GO DOWN — center of safe box
                x = 600;
                y = 429;
                break;
            default:
                return;
        }

        // C#: `_ = Task.Run(() => Bot.Player.WalkTo(x, y))`; a listener already runs on the script thread.
        bot.player.walkTo(x, y);
    };
}

export const scriptOptions = defineScriptOptions(
    "AstralEmpyreanv3",
    [
        option.int("ArmySize", "Army Size", "How many players are in your army (including yourself).", 4),
        option.bool(
            "DoDailyOnly",
            "Do Daily Only",
            "True: do the daily quest only. False: farm selected drops instead.",
            true,
        ),
        option.text(
            "Taunter1Class",
            "Taunter 1 Class (Primary)",
            "Class name for Taunter 1 (sets fight start time).",
            "Verus DoomKnight",
        ),
        option.text("Taunter2Class", "Taunter 2 Class (Secondary)", "Class name for Taunter 2.", "Lord of Order"),
        option.text("Taunter3Class", "Taunter 3 Class (Tertiary)", "Class name for Taunter 3.", "ArchPaladin"),
        option.text(
            "Class1",
            "Class 1",
            "Preset class 1 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "ArchPaladin",
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
            "Verus DoomKnight",
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
    {
        SelectDrops: AstralEmpyreanv3.selectDrops,
    },
);

export default function main(): void {
    const script = new AstralEmpyreanv3();
    script.runBoss();
    bot.stop();
}
