/*
name: UltraAvatarTyndariusv3
description: Ultra Avatar Tyndarius v3 — Ball1TaunterAttackBall2 + Ball2TaunterAttackBall2 + Ball2Attacker1 + Ball2Attacker2 with pulse-driven targeting.
tags: null
*/
// Port of Scripts/Ultrasv3/IndividualUltras/4UltraAvatarTyndariusv3.cs.
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

export class UltraAvatarTyndariusv3 {
    private static readonly ball1TaunterAttackBall2 = "Verus DoomKnight";
    private static readonly ball2TaunterAttackBall2 = "Lord of Order";
    private static readonly ball2Attacker1 = "StoneCrusher";
    private static readonly ball2Attacker2 = "King's Echo";

    private static readonly ultraClassesByRole: string[][] = [
        [UltraAvatarTyndariusv3.ball1TaunterAttackBall2],
        [UltraAvatarTyndariusv3.ball2TaunterAttackBall2],
        [UltraAvatarTyndariusv3.ball2Attacker1],
        [UltraAvatarTyndariusv3.ball2Attacker2],
    ];

    private _tauntCts: CancellationTokenSource = new CancellationTokenSource();
    private _wipeCts: CancellationTokenSource = new CancellationTokenSource();
    private _retreatComplete: ManualResetEvent = new ManualResetEvent(false);
    private _deathRetries: RetryCounter = new RetryCounter();
    private static readonly maxDeathRetries = 10;
    private fightStartTime: number = 0;
    private _role = "";

    runBoss(): void {
        Core.setOptions(true);

        try {
            while (this._deathRetries.value < UltraAvatarTyndariusv3.maxDeathRetries) {
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
                        UltraAvatarTyndariusv3.maxDeathRetries,
                        this._deathRetries,
                        "UltraAvatarTyndariusRetreat.sync",
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

    private equipPresetClasses(): void {
        const armySize = 4;
        const allowDuplicates = armySize > UltraAvatarTyndariusv3.ultraClassesByRole.length;

        Core.logger(`[UltraAvatarTyndarius-v3] Equipping role-based ultra classes for army size ${armySize}.`);
        const classSlots = new Array(armySize).fill(null);

        for (let i = 0; i < armySize; i++) {
            classSlots[i] =
                i < UltraAvatarTyndariusv3.ultraClassesByRole.length
                    ? UltraAvatarTyndariusv3.ultraClassesByRole[i]
                    : UltraAvatarTyndariusv3.ultraClassesByRole[0];
        }

        UltraCustomClassSync.customClassSync(
            Ultra,
            bot,
            classSlots,
            armySize,
            "ultra_tyndarius_class-v3.sync",
            allowDuplicates,
        );
    }

    private isTaunter(): boolean {
        return this._role === "Ball1TaunterAttackBall2" || this._role === "Ball2TaunterAttackBall2";
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        const className = bot.player.currentClass;
        if (className === UltraAvatarTyndariusv3.ball1TaunterAttackBall2) {
            this._role = "Ball1TaunterAttackBall2";
        } else if (className === UltraAvatarTyndariusv3.ball2TaunterAttackBall2) {
            this._role = "Ball2TaunterAttackBall2";
        } else if (className === UltraAvatarTyndariusv3.ball2Attacker1) {
            this._role = "Ball2Attacker1";
        } else {
            this._role = "Ball2Attacker2";
        }

        Enh.applyTyndarius();

        Core.logger(`[UltraAvatarTyndarius-v3] Role: ${this._role} (${className})`);
    }

    private fight(): void {
        const map = "ultratyndarius";
        const boss = "Ultra Avatar Tyndarius";
        const bossDefeatedTemp = "Ultra Avatar Tyndarius Defeated";

        const waitSyncFile = "ultra_tyndarius.sync";
        const fightTimeSyncFile = "UltraAvatarTyndariusFightTime.sync";
        const completionSyncFile = "UltraAvatarTyndariusCompletion.sync";
        const armySize = 4;

        const questId = 8245;

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
            Core.logger("[UltraAvatarTyndarius-v3] Taunter detected, equipping Scroll of Enrage.");
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
        if (this._role === "Ball1TaunterAttackBall2") {
            Core.logger("[UltraAvatarTyndarius-v3] Ball1TaunterAttackBall2 (Primary) — setting fight start time.");
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
        } else if (this._role === "Ball2TaunterAttackBall2") {
            Core.logger("[UltraAvatarTyndarius-v3] Ball2TaunterAttackBall2 — reading fight start time.");
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

        while (!bot.shouldExit && !this._wipeCts.isCancellationRequested) {
            if (!bot.player.alive) {
                // Death is signaled by the background wipe monitor
                // Wait for respawn and keep fighting
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (Ultra.checkArmyProgressBool(() => bot.tempInv.contains(bossDefeatedTemp, 1), completionSyncFile)) {
                Core.logger("Ultra Avatar Tyndarius defeated. Finishing quest.");
                bot.events.off("scriptStopping", this.stopTauntEvent);
                this._tauntCts.cancel();
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                this._deathRetries.value = UltraAvatarTyndariusv3.maxDeathRetries;
                break;
            }

            // All roles: ball2 (MapID 3) → ball1 (MapID 1) → Tyndarius (MapID 2)
            if (bot.monsters.currentAvailableMonsters.some((x) => x != null && x.mapId === 3 && x.hp > 0)) {
                if (bot.player.target?.mapId !== 3) {
                    bot.combat.attack(3);
                }
            } else if (bot.monsters.currentAvailableMonsters.some((x) => x != null && x.mapId === 1 && x.hp > 0)) {
                if (bot.player.target?.mapId !== 1) {
                    bot.combat.attack(1);
                }
            } else if (bot.player.target?.mapId !== 2) {
                bot.combat.attack(2);
            }

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
    const script = new UltraAvatarTyndariusv3();
    script.runBoss();
    bot.stop();
}
