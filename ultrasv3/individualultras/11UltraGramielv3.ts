/*
name: UltraGramielv3
description: Ultra Gramiel v3 — two-phase fight (crystals then Gramiel) with chat-driven crystal taunt warnings and pulse-driven taunt rotation.
tags: null
*/
// Port of Scripts/Ultrasv3/IndividualUltras/11UltraGramielv3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.
//
// Turu: C#'s fire-and-forget `async Task`s are tasks of core/CoreTasks.ts.

import { bot, type EventMap } from "turu";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { CancellationTokenSource, ManualResetEvent, tasks, type TaskStep } from "../../core/CoreTasks";
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

export class UltraGramielv3 {
    // Crystal taunter roles — 2 groups (T1 and T2) across 2 crystals (left and right)
    private static readonly leftCrystalT1 = "StoneCrusher";
    private static readonly rightCrystalT1 = "ArchPaladin";
    private static readonly leftCrystalT2 = "Lord of Order";
    private static readonly rightCrystalT2 = "ArchFiend";

    private static readonly ultraClassesByRole: string[][] = [
        [UltraGramielv3.leftCrystalT1],
        [UltraGramielv3.rightCrystalT1],
        [UltraGramielv3.leftCrystalT2],
        [UltraGramielv3.rightCrystalT2],
    ];

    private _tauntCts: CancellationTokenSource = new CancellationTokenSource();
    private _wipeCts: CancellationTokenSource = new CancellationTokenSource();
    private _retreatComplete: ManualResetEvent = new ManualResetEvent(false);
    private _deathRetries: RetryCounter = new RetryCounter();
    private static readonly maxDeathRetries = 10;
    fightStartTime: number = 0;
    private _gramielFightStart: number = 0;
    private _gramielTaunterIndex = 0;
    private _gramielTauntLaunched = false;
    private crystalMapId = 2;
    private isT1Taunter = true;

    // Chat-driven crystal state (Speaker-style: message → fire async)
    private tauntCounter = 0;
    private lastCycleTime: number = 0;
    private _attackCrystal: boolean = false;

    runBoss(): void {
        Core.setOptions(true);

        try {
            while (this._deathRetries.value < UltraGramielv3.maxDeathRetries) {
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
                        UltraGramielv3.maxDeathRetries,
                        this._deathRetries,
                        "UltraGramielRetreat.sync",
                    ),
                );

                bot.events.on("extensionPacket", this.gramielMessageListener);
                try {
                    this.prep();
                    this.fight();
                } finally {
                    bot.events.off("extensionPacket", this.gramielMessageListener);
                }
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
        return (
            className === UltraGramielv3.leftCrystalT1 ||
            className === UltraGramielv3.rightCrystalT1 ||
            className === UltraGramielv3.leftCrystalT2 ||
            className === UltraGramielv3.rightCrystalT2
        );
    }

    private applyTaunterClasses(): void {
        const className = bot.player.currentClass ?? "";

        if (className.toLowerCase() === UltraGramielv3.leftCrystalT1.toLowerCase()) {
            this.crystalMapId = 2;
            this.isT1Taunter = true;
            this._gramielTaunterIndex = 0;
            Core.logger(`[UltraGramiel-v3] Assigned to taunt LEFT crystal (mapId=2) - T1 (Gramiel taunter index 0)`);
        } else if (className.toLowerCase() === UltraGramielv3.leftCrystalT2.toLowerCase()) {
            this.crystalMapId = 2;
            this.isT1Taunter = false;
            this._gramielTaunterIndex = 1;
            Core.logger(`[UltraGramiel-v3] Assigned to taunt LEFT crystal (mapId=2) - T2 (Gramiel taunter index 1)`);
        } else if (className.toLowerCase() === UltraGramielv3.rightCrystalT1.toLowerCase()) {
            this.crystalMapId = 3;
            this.isT1Taunter = true;
            this._gramielTaunterIndex = 2;
            Core.logger(`[UltraGramiel-v3] Assigned to taunt RIGHT crystal (mapId=3) - T1 (Gramiel taunter index 2)`);
        } else if (className.toLowerCase() === UltraGramielv3.rightCrystalT2.toLowerCase()) {
            this.crystalMapId = 3;
            this.isT1Taunter = false;
            this._gramielTaunterIndex = 3;
            Core.logger(`[UltraGramiel-v3] Assigned to taunt RIGHT crystal (mapId=3) - T2 (Gramiel taunter index 3)`);
        } else {
            this.crystalMapId = 2;
            this.isT1Taunter = true;
            this._gramielTaunterIndex = 0;
            Core.logger(`[UltraGramiel-v3] Class '${className}' not a taunter, defaulting to LEFT crystal DPS.`);
        }
    }

    private equipPresetClasses(): void {
        const armySize = 4;
        const allowDuplicates = armySize > UltraGramielv3.ultraClassesByRole.length;

        Core.logger(`[UltraGramiel-v3] Equipping role-based ultra classes for army size ${armySize}.`);
        const classSlots = new Array(armySize).fill(null);

        for (let i = 0; i < armySize; i++) {
            classSlots[i] =
                i < UltraGramielv3.ultraClassesByRole.length
                    ? UltraGramielv3.ultraClassesByRole[i]
                    : UltraGramielv3.ultraClassesByRole[0];
        }

        UltraCustomClassSync.customClassSync(
            Ultra,
            bot,
            classSlots,
            armySize,
            "ultra_gramiel_class-v3.sync",
            allowDuplicates,
        );
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);
        this.applyTaunterClasses();

        this.tauntCounter = 0;
        this.lastCycleTime = 0;
        this.fightStartTime = 0;
        this._gramielFightStart = 0;
        this._gramielTauntLaunched = false;

        Enh.applyGramiel();

        Core.logger(`[UltraGramiel-v3] Class: ${bot.player.currentClass ?? "None"} | IsTaunter: ${this.isTaunter()}`);
    }

    private fight(): void {
        const map = "ultragramiel";
        const boss = "Gramiel the Graceful";
        const bossDefeatedTemp = "Gramiel the Graceful Vanquished";

        const waitSyncFile = "ultra_gramiel.sync";
        const gramielFightTimeSyncFile = "UltraGramielFightTime.sync";
        const completionSyncFile = "UltraGramielCompletion.sync";
        const armySize = 4;

        const questId = 10301;

        if (!UltraGeneral.isQuestGreen(bot, questId)) {
            UltraGeneral.ensureAcceptOnce(bot, questId);
        }

        Ultra.clearSyncFile(Ultra.resolveSyncPath(gramielFightTimeSyncFile));
        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));

        const skipThird = this.isTaunter();
        Pots.ensureRecommendedPotions(undefined, skipThird, "Gramiel");
        Scrolls.getScrollOfEnrage();

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        Pots.useRecommendedPotions(undefined, skipThird, "Gramiel", false);

        if (skipThird) {
            Core.logger("[UltraGramiel-v3] Taunter detected, equipping Scroll of Enrage.");
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

        this.fightStartTime = Date.now();

        while (!bot.shouldExit && !this._wipeCts.isCancellationRequested) {
            if (!bot.player.alive) {
                // Death is signaled by the background wipe monitor
                // Wait for respawn and keep fighting
                bot.wait.forTrue(() => bot.player.alive, 20);
                bot.sleep(500);
                continue;
            }

            if (Ultra.checkArmyProgressBool(() => bot.tempInv.contains(bossDefeatedTemp, 1), completionSyncFile)) {
                Core.logger("Gramiel the Graceful defeated. Finishing quest.");
                bot.events.off("scriptStopping", this.stopTauntEvent);
                this._tauntCts.cancel();
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                this._deathRetries.value = UltraGramielv3.maxDeathRetries;
                break;
            }

            Pots.activateEquippedPotion();

            // Detect phase: crystals alive → crystal phase, else Gramiel phase
            const anyCrystalAlive = bot.monsters.currentAvailableMonsters.some(
                (x) => x != null && x.hp > 0 && x.state > 0 && (x.mapId === 2 || x.mapId === 3),
            );

            if (anyCrystalAlive) {
                // === CRYSTAL PHASE (chat-driven) ===
                // Pure event-driven: GramielMessageListener fires _ = CrystalTauntAsync() on message.
                // This loop handles targeting.

                let targetCrystalMapId = this.getAliveCrystalTarget(this.crystalMapId);

                if (targetCrystalMapId === 0) {
                    bot.combat.attack(1);
                    bot.sleep(500);
                    continue;
                }

                // HP readings — needed for both lockout override and normal balancing
                const otherCrystalMapId = this.crystalMapId === 2 ? 3 : 2;
                const myHP =
                    bot.monsters.currentAvailableMonsters
                        .filter((x) => x != null && x.hp > 0 && x.state > 0 && x.mapId === this.crystalMapId)
                        .map((x) => x.hp)[0] ?? null;
                const otherHP =
                    bot.monsters.currentAvailableMonsters
                        .filter((x) => x != null && x.hp > 0 && x.state > 0 && x.mapId === otherCrystalMapId)
                        .map((x) => x.hp)[0] ?? null;

                // HP balancing: keep both crystals within 30 HP of each other.
                // When one dies too far ahead, the remaining one goes Unstable and
                // explodes after 5s, instant party wipe.
                // Strategy: if either crystal is low (< 50), everyone attacks the higher-HP one
                // to converge HP. Otherwise, use the 30-HP deadband.
                const lowHP = (myHP > 0 && myHP < 50) || (otherHP > 0 && otherHP < 50);
                if (myHP > 0 && otherHP > 0) {
                    if (lowHP && otherHP > myHP) {
                        // Getting low — converge on the higher-HP crystal
                        targetCrystalMapId = otherCrystalMapId;
                    } else if (!lowHP && otherHP > myHP + 30) {
                        // Normal deadband: switch if other is >30 ahead
                        targetCrystalMapId = otherCrystalMapId;
                    }
                }

                // When _attackCrystal is active (7s after a crystal taunt), stay on assigned crystal
                // — EXCEPT during low-HP convergence, which already set targetCrystalMapId above.
                if (this._attackCrystal) {
                    bot.combat.attack(targetCrystalMapId);
                    bot.sleep(500);
                    continue;
                }

                bot.combat.attack(targetCrystalMapId);
                bot.sleep(500);
                continue;
            }

            // === GRAMIEL PHASE (all crystals dead) ===
            bot.combat.attack(boss);

            if (!this._gramielTauntLaunched) {
                this._gramielTauntLaunched = true;
                Core.logger("[UltraGramiel-v3] All crystals dead. Launching Gramiel pulse taunt rotation.");

                const gramielFightTimeSyncPath = Ultra.resolveSyncPath(gramielFightTimeSyncFile);
                if (this._gramielTaunterIndex === 0) {
                    Core.logger("[UltraGramiel-v3] Gramiel Taunter (Primary) — setting fight start time.");
                    this._gramielFightStart = UltraAsync.setFightTime(Core, gramielFightTimeSyncPath);
                    UltraAsync.startTauntLoop(
                        bot,
                        Core,
                        Engine,
                        this._gramielFightStart,
                        0,
                        4,
                        undefined,
                        undefined,
                        this._tauntCts.token,
                    );
                } else {
                    Core.logger(
                        `[UltraGramiel-v3] Gramiel Taunter (Index ${this._gramielTaunterIndex}) — reading fight start time.`,
                    );
                    this._gramielFightStart = UltraAsync.getFightTime(Ultra, Core, gramielFightTimeSyncPath);
                    UltraAsync.startTauntLoop(
                        bot,
                        Core,
                        Engine,
                        this._gramielFightStart,
                        this._gramielTaunterIndex,
                        4,
                        undefined,
                        undefined,
                        this._tauntCts.token,
                    );
                }

                Core.logger(
                    `[UltraGramiel-v3] Gramiel fight started — ${bot.player.currentClass} taunting on pulse ${this._gramielTaunterIndex} of 4.`,
                );
            }

            bot.combat.attack(1);

            bot.sleep(500);
        }

        // If retreat is still in progress (background), wait for it
        if (this._wipeCts.isCancellationRequested) {
            this._retreatComplete.waitOne(120 * 1000);
        }
    }

    private getAliveCrystalTarget(preferredCrystalMapId: number): number {
        const otherCrystalMapId = preferredCrystalMapId === 2 ? 3 : 2;

        const preferredAlive = bot.monsters.currentAvailableMonsters.some(
            (x) => x != null && x.hp > 0 && x.state > 0 && x.mapId === preferredCrystalMapId,
        );
        if (preferredAlive) {
            return preferredCrystalMapId;
        }

        const otherAlive = bot.monsters.currentAvailableMonsters.some(
            (x) => x != null && x.hp > 0 && x.state > 0 && x.mapId === otherCrystalMapId,
        );
        return otherAlive ? otherCrystalMapId : 0;
    }

    private *crystalTauntAsync(targetMapId: number): Generator<TaskStep, void, boolean> {
        Core.logger(
            `[UltraGramiel-v3] CrystalTauntAsync started — 1s buffer, then 40 presses on mapId ${targetMapId}.`,
        );

        yield 1000;

        for (let i = 0; i < 60 && !bot.shouldExit; i++) {
            if (!bot.player.alive) {
                break;
            }

            // Re-acquire target if lost, dead, or targeting the wrong crystal.
            if (
                !bot.player.hasTarget ||
                bot.player.target == null ||
                !(bot.player.target.hp > 0 && bot.player.target.state > 0) ||
                bot.player.target.mapId !== targetMapId
            ) {
                bot.combat.attack(targetMapId);
            }

            Engine.cast(5);
            yield 25;
        }
    }

    private *attackCrystalAsync(targetMapId: number): Generator<TaskStep, void, boolean> {
        Core.logger(`[UltraGramiel-v3] AttackCrystalAsync started — keeping target on mapId ${targetMapId} for 7s.`);
        yield 7000;
        this._attackCrystal = false;
        Core.logger("[UltraGramiel-v3] AttackCrystalAsync done — returning to normal targeting.");
    }

    private gramielMessageListener = (packet: EventMap["extensionPacket"]): void => {
        try {
            const type = packet["params"].type;
            if (!(type === "json")) {
                return;
            }

            if (!bot.player.alive) {
                return;
            }

            const data = packet["params"].dataObj;
            const cmd = String(data.cmd);

            if (cmd !== "ct") {
                return;
            }

            if (data.anims == null) {
                return;
            }

            for (const anim of data.anims) {
                if (anim === null || anim.msg == null) {
                    continue;
                }

                const message = anim.msg;
                if (
                    !message
                        .toLowerCase()
                        .includes("The Grace Crystal prepares a defense shattering attack!".toLowerCase())
                ) {
                    continue;
                }

                const sinceLastCycle = Date.now() - this.lastCycleTime;
                if (sinceLastCycle / 1000 < 10) {
                    continue;
                }

                this.lastCycleTime = Date.now();
                this.tauntCounter++;

                const currentlyT1Turn = this.tauntCounter % 2 === 1;
                const shouldTauntNow = (this.isT1Taunter && currentlyT1Turn) || (!this.isT1Taunter && !currentlyT1Turn);

                Core.logger(
                    `[UltraGramiel-v3] Crystal warning #${this.tauntCounter}, turn=${currentlyT1Turn ? "T1" : "T2"}, shouldTauntNow=${shouldTauntNow}`,
                );

                if (shouldTauntNow) {
                    const targetCrystal = this.getAliveCrystalTarget(this.crystalMapId);
                    if (targetCrystal !== 0) {
                        this._attackCrystal = true;
                        Core.logger(
                            `[UltraGramiel-v3] Firing CrystalTauntAsync + AttackCrystalAsync on mapId ${targetCrystal}.`,
                        );
                        tasks.start("UltraGramielCrystalTaunt", () => this.crystalTauntAsync(targetCrystal));
                        tasks.start("UltraGramielAttackCrystal", () => this.attackCrystalAsync(targetCrystal));
                    }
                }
            }
        } catch (error) {
            rethrowIfStopped(error);
        }
    };
}

export default function main(): void {
    const script = new UltraGramielv3();
    script.runBoss();
    bot.stop();
}
