/*
name: UltraDagev3
description: Ultra Dage v3 — pulse-driven dual taunter with zone movement handler and army sync.
tags: null
*/
// Port of Scripts/Ultrasv3/IndividualUltras/9UltraDagev3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.
//
// Turu: C#'s `Task.Run` walks and `DecayAsync` are tasks of core/CoreTasks.ts.

import { bot, type EventMap } from "turu";
import { Core } from "../../core/CoreBots";
import { CancellationTokenSource, type TaskStep, tasks, until } from "../../core/CoreTasks";
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

export class UltraDagev3 {
    private static readonly taunter1 = "Verus DoomKnight";
    private static readonly taunter2 = "ArchPaladin";
    private static readonly decayer = "Lord of Order";
    // DPS classes
    private static readonly dps1 = "King's Echo";

    private static readonly ultraClassesByRole: string[][] = [
        [UltraDagev3.taunter1],
        [UltraDagev3.taunter2],
        [UltraDagev3.decayer],
        [UltraDagev3.dps1],
    ];

    private _tauntCts: CancellationTokenSource = new CancellationTokenSource();
    private fightStartTime: number = 0;

    runBoss(): void {
        Core.setOptions(true);

        Engine.boot();
        this._tauntCts = new CancellationTokenSource();
        bot.events.off("scriptStopping", this.stopTauntEvent);
        bot.events.on("scriptStopping", this.stopTauntEvent);

        try {
            bot.events.on("extensionPacket", this.ultraDageListener);
            try {
                this.prep();
                this.fight();
            } finally {
                bot.events.off("extensionPacket", this.ultraDageListener);
            }
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
        return className === UltraDagev3.taunter1 || className === UltraDagev3.taunter2;
    }

    private isDecayer(): boolean {
        const className = bot.player.currentClass;
        return className === UltraDagev3.decayer;
    }

    private equipPresetClasses(): void {
        const armySize = 4;
        const allowDuplicates = armySize > UltraDagev3.ultraClassesByRole.length;

        Core.logger(`[UltraDage-v3] Equipping role-based ultra classes for army size ${armySize}.`);
        const classSlots = new Array(armySize).fill(null);

        for (let i = 0; i < armySize; i++) {
            classSlots[i] =
                i < UltraDagev3.ultraClassesByRole.length
                    ? UltraDagev3.ultraClassesByRole[i]
                    : UltraDagev3.ultraClassesByRole[0];
        }

        UltraCustomClassSync.customClassSync(
            Ultra,
            bot,
            classSlots,
            armySize,
            "ultra_dage_class-v3.sync",
            allowDuplicates,
        );
    }

    private prep(): void {
        if (!Core.isCompletedBefore(793)) {
            bot.quests.updateQuest(793);
        }

        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        Enh.applyDage();

        const className = bot.player.currentClass;
        Core.logger(`[UltraDage-v3] Role: ${className}`);
    }

    private fight(): void {
        const map = "ultradage";
        const boss = "Dage the Dark Lord";
        const bossDefeatedTemp = "Dage the Dark Lord Defeated";

        const waitSyncFile = "ultra_dage.sync";
        const fightTimeSyncFile = "UltraDageFightTime.sync";
        const completionSyncFile = "UltraDageCompletion.sync";
        const armySize = 4;

        const questId = 8547;

        if (!UltraGeneral.isQuestGreen(bot, questId)) {
            UltraGeneral.ensureAcceptOnce(bot, questId);
        }

        Ultra.clearSyncFile(Ultra.resolveSyncPath(fightTimeSyncFile));
        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));

        const skipThird = this.isTaunter();
        Pots.ensureRecommendedPotions(undefined, skipThird, "Dage");
        Scrolls.getScrollOfEnrage();
        Scrolls.getScrollOfDecay();

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        Pots.useRecommendedPotions(undefined, skipThird, "Dage", false);

        if (skipThird) {
            Core.logger("[UltraDage-v3] Taunter detected, equipping Scroll of Enrage.");
            Engine.equipEnrage();
        }

        if (this.isDecayer()) {
            Core.logger("[UltraDage-v3] Decayer detected, equipping Scroll of Decay.");

            Engine.equipDecay();
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
        if (className === UltraDagev3.taunter1) {
            Core.logger("[UltraDage-v3] Taunter1 (Primary) — setting fight start time.");
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
        } else if (className === UltraDagev3.taunter2) {
            Core.logger("[UltraDage-v3] Taunter2 (Secondary) — reading fight start time.");
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

        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (Ultra.checkArmyProgressBool(() => bot.tempInv.contains(bossDefeatedTemp, 1), completionSyncFile)) {
                Core.logger("Dage the Dark Lord defeated. Finishing quest.");
                bot.events.off("scriptStopping", this.stopTauntEvent);
                this._tauntCts.cancel();
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                break;
            }

            bot.combat.attack(boss);
            Pots.activateEquippedPotion();

            // Decayer logic — Verus DoomKnight spams skill 5 when Legionnaire aura is active
            if (this.isDecayer() && Engine.hasAura("Legionnaire") && Engine.left("Legionnaire", 12)) {
                // C# fires a new DecayAsync on each pass; one at a time here.
                if (!tasks.running("UltraDageDecay")) tasks.start("UltraDageDecay", () => this.decayAsync(boss));
            }

            bot.sleep(500);
        }
    }

    ultraDageListener = (packet: EventMap["extensionPacket"]): void => {
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

        if (!!zoneSet) {
            const targetX =
                zoneSet.toLowerCase() === "A".toLowerCase()
                    ? 122
                    : zoneSet.toLowerCase() === "B".toLowerCase()
                      ? 856
                      : 0;

            if (targetX !== 0) {
                tasks.start("UltraDageZone", function* () {
                    bot.player.walkTo(targetX, 420);

                    yield until(() => Math.abs(bot.player.x - targetX) < 40, 10);

                    yield 2000;
                });

                return;
            }
        }

        if (!zoneSet) {
            tasks.start("UltraDageZone", function* () {
                yield 5000;

                const middleX = 500;

                bot.player.walkTo(middleX, 420);

                yield until(() => Math.abs(bot.player.x - middleX) < 40, 10);
            });

            return;
        }
    };

    private *decayAsync(bossName: string): Generator<TaskStep, void, boolean> {
        for (let i = 0; i < 60 && !bot.shouldExit; i++) {
            if (!bot.player.alive) {
                break;
            }

            if (!bot.player.hasTarget) {
                bot.combat.attack(bossName);
            }

            Engine.cast(5);
            yield 50;
        }
    }
}

export default function main(): void {
    const script = new UltraDagev3();
    script.runBoss();
    bot.stop();
}
