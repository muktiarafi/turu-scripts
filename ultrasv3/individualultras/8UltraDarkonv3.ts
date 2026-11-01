/*
name: UltraDarkonv3
description: Ultra Darkon v3 — turn-based dual taunter with sync file coordination and army sync.
tags: null
*/
// Port of Scripts/Ultrasv3/IndividualUltras/8UltraDarkonv3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, type EventMap } from "turu";
import { Core } from "../../core/CoreBots";
import { CancellationTokenSource, ManualResetEvent } from "../../core/CoreTasks";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { GetScrolls } from "../dependenciesultras/GetScrolls";
import { UltraAsync } from "../dependenciesultras/UltraAsync";
import { UltraCustomClassSync } from "../dependenciesultras/UltraCustomClassSync";
import { RetryCounter, UltraDeath } from "../dependenciesultras/UltraDeath";
import { UltraEnhancements } from "../dependenciesultras/UltraEnhancements";
import { UltraGeneral } from "../dependenciesultras/UltraGeneral";
import { UltraPotions } from "../dependenciesultras/UltraPotions";
import { UltraWaitForArmy } from "../dependenciesultras/UltraWaitForArmy";

const Engine = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();
const Enh = new UltraEnhancements();
const Pots = new UltraPotions();
const Scrolls = new GetScrolls();

export class UltraDarkonv3 {
    private static readonly taunter1 = "Verus DoomKnight";
    private static readonly taunter2 = "Lord of Order";
    // DPS classes
    private static readonly dps1 = "StoneCrusher";
    private static readonly dps2 = "King's Echo";

    private static readonly ultraClassesByRole: string[][] = [
        [UltraDarkonv3.taunter1],
        [UltraDarkonv3.taunter2],
        [UltraDarkonv3.dps1],
        [UltraDarkonv3.dps2],
    ];

    private _tauntCts: CancellationTokenSource = new CancellationTokenSource();
    private _wipeCts: CancellationTokenSource = new CancellationTokenSource();
    private _retreatComplete: ManualResetEvent = new ManualResetEvent(false);
    private _deathRetries: RetryCounter = new RetryCounter();
    private static readonly maxDeathRetries = 10;
    private fightStartTime: number = 0;

    runBoss(): void {
        Core.setOptions(true);

        try {
            while (this._deathRetries.value < UltraDarkonv3.maxDeathRetries) {
                Engine.boot();
                this._tauntCts?.cancel();
                this._tauntCts = new CancellationTokenSource();
                this._wipeCts = new CancellationTokenSource();
                this._retreatComplete.reset();
                bot.events.off("scriptStopping", this.stopTauntEvent);
                bot.events.on("scriptStopping", this.stopTauntEvent);

                // Start background wipe monitor (also handles individual death signaling)
                UltraDeath.startWipeMonitor(Core, 4, this._wipeCts, this._retreatComplete, () =>
                    UltraDeath.performRetreat(
                        Core,
                        4,
                        UltraDarkonv3.maxDeathRetries,
                        this._deathRetries,
                        "UltraDarkonRetreat.sync",
                    ),
                );

                this.prep();
                this.fight();
            }
        } finally {
            bot.events.off("scriptStopping", this.stopTauntEvent);
            this._tauntCts.cancel();
            this._wipeCts.cancel();

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
        return className === UltraDarkonv3.taunter1 || className === UltraDarkonv3.taunter2;
    }

    private equipPresetClasses(): void {
        const armySize = 4;
        const allowDuplicates = armySize > UltraDarkonv3.ultraClassesByRole.length;

        Core.logger(`[UltraDarkon-v3] Equipping role-based ultra classes for army size ${armySize}.`);
        const classSlots = new Array(armySize).fill(null);

        for (let i = 0; i < armySize; i++) {
            classSlots[i] =
                i < UltraDarkonv3.ultraClassesByRole.length
                    ? UltraDarkonv3.ultraClassesByRole[i]
                    : UltraDarkonv3.ultraClassesByRole[0];
        }

        UltraCustomClassSync.customClassSync(
            Ultra,
            bot,
            classSlots,
            armySize,
            "ultra_darkon_class-v3.sync",
            allowDuplicates,
        );
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        Enh.applyDarkon();

        const className = bot.player.currentClass;
        Core.logger(`[UltraDarkon-v3] Role: ${className}`);
    }

    private fight(): void {
        const map = "ultradarkon";
        const boss = "Darkon the Conductor";
        const bossDefeatedTemp = "Darkon the Conductor Defeated";

        const waitSyncFile = "Ultra_Darkon.sync";
        const fightTimeSyncFile = "UltraDarkonFightTime.sync";
        const completionSyncFile = "UltraDarkonCompletion.sync";
        const armySize = 4;

        const questId = 8746;

        // Prerequisite quest check
        if (!Core.isCompletedBefore(8733)) {
            bot.quests.updateQuest(8733);
        }

        if (!UltraGeneral.isQuestGreen(bot, questId)) {
            UltraGeneral.ensureAcceptOnce(bot, questId);
        }

        Ultra.clearSyncFile(Ultra.resolveSyncPath(fightTimeSyncFile));
        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));

        const skipThird = this.isTaunter();
        Pots.ensureRecommendedPotions(undefined, skipThird);
        Scrolls.getScrollOfEnrage();

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        Pots.useRecommendedPotions(undefined, skipThird, undefined, false);

        if (skipThird) {
            Core.logger("[UltraDarkon-v3] Taunter detected, equipping Scroll of Enrage.");
            Engine.equipEnrage();
        }

        Engine.join(map);
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, true);

        Engine.chooseBestCell(boss);
        bot.player.setSpawnPoint();
        bot.sleep(2000);

        // Pre-seed completion sync file so all 4 entries exist before the loop starts.
        const _username = bot.player.username;
        const _className = bot.player.currentClass;
        if (!!_username?.trim() && !!_className?.trim()) {
            const _myKey = `${_username}|${_className}`.replaceAll(":", "-");
            Ultra.updateEntry(Ultra.resolveSyncPath(completionSyncFile), _myKey, "0");
        }

        const fightTimeSyncPath = Ultra.resolveSyncPath(fightTimeSyncFile);

        // Set or retrieve fight start time, then launch the appropriate taunter loop
        const className = bot.player.currentClass;
        if (className === UltraDarkonv3.taunter1) {
            Core.logger("[UltraDarkon-v3] Taunter1 (Primary) — setting fight start time.");
            this.fightStartTime = UltraAsync.setFightTime(Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(
                bot,
                Core,
                Engine,
                this.fightStartTime,
                0,
                undefined,
                undefined,
                undefined,
                this._tauntCts.token,
            );
        } else if (className === UltraDarkonv3.taunter2) {
            Core.logger("[UltraDarkon-v3] Taunter2 (Secondary) — reading fight start time.");
            this.fightStartTime = UltraAsync.getFightTime(Ultra, Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(
                bot,
                Core,
                Engine,
                this.fightStartTime,
                1,
                undefined,
                undefined,
                undefined,
                this._tauntCts.token,
            );
        }

        while (!bot.shouldExit && !this._wipeCts.isCancellationRequested) {
            if (!bot.player.alive) {
                // Death is signaled by the background wipe monitor
                // Wait for respawn and keep fighting
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (Ultra.checkArmyProgressBool(() => bot.tempInv.contains(bossDefeatedTemp, 1), completionSyncFile)) {
                Core.logger("Darkon the Conductor defeated. Finishing quest.");
                bot.events.off("scriptStopping", this.stopTauntEvent);
                this._tauntCts.cancel();
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                this._deathRetries.value = UltraDarkonv3.maxDeathRetries;
                break;
            }

            bot.combat.attack(boss);
            Pots.activateEquippedPotion();

            bot.sleep(500);
        }

        // If retreat is still in progress (background), wait for it
        if (this._wipeCts.isCancellationRequested) {
            this._retreatComplete.waitOne(120 * 1000);
        }
    }
}

export default function main(): void {
    const script = new UltraDarkonv3();
    script.runBoss();
    bot.stop();
}
