/*
name: AstralEmpyreanv3 no options
description: Three-taunter strategy for Astral Empyrean with aura-based taunting and army synchronization. No config needed. Run 4 accounts.
tags: null
*/
// Port of Scripts/Ultrasv3/DependenciesDailies/AstralEmpyreanNoOptionv3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, type EventMap } from "turu";
import { Core } from "../../core/CoreBots";
import { CancellationTokenSource } from "../../core/CoreTasks";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { GetScrolls } from "../dependenciesultras/GetScrolls";
import { UltraAsync } from "../dependenciesultras/UltraAsync";
import { UltraCustomClassSync } from "../dependenciesultras/UltraCustomClassSync";
import { UltraEnhancements } from "../dependenciesultras/UltraEnhancements";
import { UltraGeneral } from "../dependenciesultras/UltraGeneral";
import { UltraPotions } from "../dependenciesultras/UltraPotions";
import { UltraWaitForArmy } from "../dependenciesultras/UltraWaitForArmy";

const Engine = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();
const Enh = new UltraEnhancements();
const Pots = new UltraPotions();
const Scrolls = new GetScrolls();

export class AstralEmpyreanNoOpv3 {
    private static readonly taunter1 = "Verus DoomKnight";
    private static readonly taunter2 = "Lord of Order";
    private static readonly taunter3 = "ArchPaladin";
    private static readonly dps1 = "StoneCrusher";

    private static readonly ultraClassesByRole: string[][] = [
        [AstralEmpyreanNoOpv3.taunter1],
        [AstralEmpyreanNoOpv3.taunter2],
        [AstralEmpyreanNoOpv3.taunter3],
        [AstralEmpyreanNoOpv3.dps1],
    ];

    private _tauntCts: CancellationTokenSource = new CancellationTokenSource();
    private fightStartTime: number = 0;
    private _role = "";
    private _deathRetries = 0;
    private static readonly maxDeathRetries = 10;

    runBoss(): void {
        Core.setOptions(true);

        if (!bot.quests.isUnlocked(9803)) {
            Core.logger("Quest not unlocked: Asterism's Toll, we'll continue anyway");
            bot.quests.updateQuest(9803);
        }

        try {
            while (this._deathRetries < AstralEmpyreanNoOpv3.maxDeathRetries) {
                Engine.boot();
                this._tauntCts?.cancel();
                this._tauntCts = new CancellationTokenSource();
                bot.events.off("scriptStopping", this.stopTauntEvent);
                bot.events.on("scriptStopping", this.stopTauntEvent);

                this.prep();
                this.fight();
            }
        } finally {
            bot.events.off("scriptStopping", this.stopTauntEvent);
            this._tauntCts.cancel();

            Engine.disableSkills();
            Core.setOptions(false);
        }
    }

    private equipPresetClasses(): void {
        const armySize = 4;
        const allowDuplicates = armySize > AstralEmpyreanNoOpv3.ultraClassesByRole.length;

        Core.logger(`[AstralEmpyreanv3] Equipping role-based ultra classes for army size ${armySize}.`);
        const classSlots = new Array(armySize).fill(null);

        for (let i = 0; i < armySize; i++) {
            classSlots[i] =
                i < AstralEmpyreanNoOpv3.ultraClassesByRole.length
                    ? AstralEmpyreanNoOpv3.ultraClassesByRole[i]
                    : AstralEmpyreanNoOpv3.ultraClassesByRole[0];
        }

        UltraCustomClassSync.customClassSync(
            Ultra,
            bot,
            classSlots,
            armySize,
            "astralempyreanv3_class-v3.sync",
            allowDuplicates,
        );
    }

    private stopTauntEvent = (e: EventMap["scriptStopping"]): boolean => {
        this._tauntCts.cancel();
        return true;
    };

    private isTaunter(): boolean {
        return this._role === "Taunter1" || this._role === "Taunter2" || this._role === "Taunter3";
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        const className = bot.player.currentClass;
        if (className === AstralEmpyreanNoOpv3.taunter1) {
            this._role = "Taunter1";
        } else if (className === AstralEmpyreanNoOpv3.taunter2) {
            this._role = "Taunter2";
        } else if (className === AstralEmpyreanNoOpv3.taunter3) {
            this._role = "Taunter3";
        } else {
            this._role = "Dps1";
        }
        Core.logger(`[AstralEmpyreanv3] Role: ${this._role} (${className})`);

        Enh.applyAstralEmpyrean();

        bot.quests.updateQuest(9802);
        bot.sleep(2500);
    }

    private fight(): void {
        const map = "astralshrine";
        const boss = "Astral Empyrean";
        const bossDefeatedTemp = "Astral's Supernova";

        const waitSyncFile = "AstralEmpyreanv3.sync";
        const completionSyncFile = "AstralEmpyreanv3Completion.sync";
        const wipeSyncFile = "AstralEmpyreanWipe.sync";
        const armySize = 4;

        const questId = 9803;

        if (!UltraGeneral.isQuestGreen(bot, questId)) {
            UltraGeneral.ensureAcceptOnce(bot, questId);
        }

        Ultra.clearSyncFile(Ultra.resolveSyncPath(wipeSyncFile));
        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));

        const skipThird = this.isTaunter();
        Pots.ensureRecommendedPotions(30, skipThird, "AstralEmpyrean");
        Scrolls.getScrollOfEnrage();

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        Pots.useRecommendedPotions(30, skipThird, "AstralEmpyrean", false);

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

        bot.events.on("extensionPacket", this.astralZoneListener);
        bot.sleep(2000);

        // Pre-seed completion sync file so all 4 entries exist before the loop starts.
        const _username = bot.player.username;
        const _className = bot.player.currentClass;
        if (!!_username?.trim() && !!_className?.trim()) {
            const _myKey = `${_username}|${_className}`.replaceAll(":", "-");
            Ultra.updateEntry(Ultra.resolveSyncPath(completionSyncFile), _myKey, "0");
        }

        while (!bot.shouldExit) {
            // Army-wipe check: all players (alive or dead) report their state.
            if (UltraGeneral.isWholeArmyDead(Ultra, bot, Ultra.resolveSyncPath(wipeSyncFile))) {
                this._deathRetries++;
                Core.logger(
                    `[AstralEmpyreanv3] Army wipe detected (${this._deathRetries}/${AstralEmpyreanNoOpv3.maxDeathRetries}). Retreating to house.`,
                );
                bot.events.off("extensionPacket", this.astralZoneListener);
                bot.events.off("scriptStopping", this.stopTauntEvent);
                this._tauntCts.cancel();
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                if (this._deathRetries >= AstralEmpyreanNoOpv3.maxDeathRetries) {
                    Core.logger(`${AstralEmpyreanNoOpv3.maxDeathRetries} wipes reached. Stopping the bot.`, undefined, {
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

            if (Ultra.checkArmyProgressBool(() => bot.tempInv.contains(bossDefeatedTemp, 1), completionSyncFile)) {
                Core.logger("Boss defeated. Finishing quest.");
                bot.events.off("extensionPacket", this.astralZoneListener);
                bot.events.off("scriptStopping", this.stopTauntEvent);
                this._tauntCts.cancel();
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                this._deathRetries = AstralEmpyreanNoOpv3.maxDeathRetries;
                break;
            }

            // Default — attack the boss
            if (bot.player.target?.name !== boss) {
                bot.combat.attack(boss);
            }

            Pots.activateEquippedPotion();
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

export default function main(): void {
    const script = new AstralEmpyreanNoOpv3();
    script.runBoss();
    bot.stop();
}
