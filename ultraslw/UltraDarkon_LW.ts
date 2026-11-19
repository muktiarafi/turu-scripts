/*
name: Ultra Darkon LW
description: Four-player CoreLoneWolf Army script for Ultra Darkon.
tags: ultra, darkon, weekly, army, corelonewolf
*/
// Port of UltraDarkon_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, ref } from "./LWRef";
import { bot, choices, defineScriptOptions, option } from "turu";
import { CapeSpecial, HelmSpecial } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";
import { type ClassPreset, CoreLoneWolf, UltraRunResult } from "./CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = 0,
    Stable = 1,
    Reliable = 2,
    Optimized = 3,
    Pay2Win = 4,
}

export enum FightResult {
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export class UltraDarkon_LW {
    private static readonly logPrefix = "Ultra Darkon LW";
    private static readonly syncFileName = "UltraDarkon_LW.sync";
    private static readonly mapName = "ultradarkon";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly bossCell = "r2";
    private static readonly bossPad = "Left";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly packetCommand = "ct";
    private static readonly bossCasterMarker = '"cInf":"m:1"';
    private static readonly attack2Marker = '"animStr":"Attack2"';
    private static readonly attack3Marker = '"animStr":"Attack3"';
    private static readonly ariaAura = "Aria";
    private static readonly aMajorAura = "A Major";
    private static readonly righteousSealAura = "Righteous Seal";
    private static readonly ultraQuestId = 8746;
    private static readonly prerequisiteQuestId = 8733;
    private static readonly prerequisiteQuestName = "The World";
    private static readonly minimumLevel = 90;
    private static readonly darkonMapId = 1;
    private static readonly looHoldHealth = 10000000;
    private static readonly looReleaseHealth = 4500000;
    private static readonly tauntDelay = 1250;
    private static readonly apExtraHealWindowStartDelay = 5000;
    private static readonly apExtraHealWindowDuration = 1500;
    private static readonly requiredHealDelay = 250;
    private static readonly righteousSealSkillFourWindow = 1500;
    private static readonly fightPollDelay = 100;
    private static readonly respawnPollDelay = 500;
    private static readonly maxFightAttempts = 3;

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private masterMode: boolean = false;
    private runResult: UltraRunResult = UltraRunResult.Failed;
    private isTaunterValue: boolean = false;
    private privateRoomNumber: number = 0;

    runFromMaster(): UltraRunResult {
        this.masterMode = true;
        this.runResult = UltraRunResult.Failed;
        bot.skills.stop();
        bot.options.infiniteRange = true;

        try {
            this.run();
        } finally {
            LoneWolf.stopPacketDetector();
            LoneWolf.stopSkillEngine();
            this.masterMode = false;
        }

        return this.runResult;
    }

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (!LoneWolf.startArmySync(UltraDarkon_LW.syncFileName, 4, this.masterMode ? "Setup" : null)) {
            return;
        }

        if (
            !LoneWolf.validateUltraAccess(
                UltraDarkon_LW.ultraQuestId,
                UltraDarkon_LW.prerequisiteQuestId,
                UltraDarkon_LW.prerequisiteQuestName,
                UltraDarkon_LW.minimumLevel,
                UltraDarkon_LW.logPrefix,
                this.getClassPreset().className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        this.isTaunterValue = this.isTaunter();

        const preset = this.getClassPreset();
        if (this.isTaunterValue) {
            preset.combatPotion = null;
        }

        Core.logger(
            `${UltraDarkon_LW.logPrefix} started as ${this.playerAlias} using ${ArmyComposition[this.armyComposition]} composition.`,
        );
        LoneWolf.acceptUltraQuest(UltraDarkon_LW.ultraQuestId);

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        if (!this.runFightAttempts(preset) || !this.sync("BOSS_DEFEATED")) {
            return;
        }

        Core.jump(UltraDarkon_LW.safeCell, UltraDarkon_LW.safePad);
        LoneWolf.completeUltraQuest(UltraDarkon_LW.ultraQuestId);

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
        this.runResult = UltraRunResult.Completed;
    }

    private runFightAttempts(preset: ClassPreset): boolean {
        for (let fightAttempt = 1; fightAttempt <= UltraDarkon_LW.maxFightAttempts && !bot.shouldExit; fightAttempt++) {
            Core.join(
                `${UltraDarkon_LW.mapName}-${this.privateRoomNumber}`,
                UltraDarkon_LW.safeCell,
                UltraDarkon_LW.safePad,
            );

            if (!this.prepareSafeRoom(preset) || !this.startDarkonPacketDetector()) {
                return false;
            }

            if (!this.sync("FIGHT_READY")) {
                return false;
            }

            Core.jump(UltraDarkon_LW.bossCell, UltraDarkon_LW.bossPad);

            if (bot.shouldExit || !this.sync("START_FIGHT")) {
                return false;
            }

            const result = this.fight(preset, fightAttempt);
            LoneWolf.stopPacketDetector();

            if (result === FightResult.Defeated) {
                return true;
            }

            if (result !== FightResult.Reset || !this.handleFightReset(fightAttempt)) {
                return false;
            }

            if (fightAttempt >= UltraDarkon_LW.maxFightAttempts) {
                this.stopArmyAfterFailedAttempts();
                this.runResult = UltraRunResult.AttemptsExhausted;
                return false;
            }
        }

        return false;
    }

    private validateOptions(): boolean {
        this.armyComposition = this.getUltraOption("UltraDarkonComposition", "ArmyComposition");
        this.privateRoomNumber = this.getSetupOption("PrivateRoomNumber");
        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${UltraDarkon_LW.logPrefix} ${this.playerAlias} starting setup.`);

        LoneWolf.equipClass(preset);
        if (bot.shouldExit) {
            return false;
        }

        if (this.getSetupOption("UseEnhancements")) {
            LoneWolf.prepareEnhancements(
                preset.baseEnhancement,
                preset.capeEnhancement,
                preset.helmEnhancement,
                preset.weaponEnhancement,
                undefined,
                preset.weaponEnhancementFallbacks,
            );
        }

        if (this.getSetupOption("UsePotions")) {
            LoneWolf.preparePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (this.isTaunterValue) {
            LoneWolf.prepareScrolls(UltraDarkon_LW.enrageScroll);
        }

        if (bot.shouldExit) {
            return false;
        }

        this.warnIfVaingloryCapeIsEquipped();
        Core.logger(`${UltraDarkon_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private warnIfVaingloryCapeIsEquipped(): void {
        for (const item of bot.inventory.items) {
            if (
                !item.equipped ||
                !(item.category?.toLowerCase() === "Cape"?.toLowerCase()) ||
                item.enhancementPatternId !== CapeSpecial.Vainglory
            ) {
                continue;
            }

            Core.logger("Vainglory is enhanced on the cape. Ultra Darkon will fail.", "Prepare", { messageBox: true });
            return;
        }
    }

    private prepareSafeRoom(preset: ClassPreset): boolean {
        if (this.getSetupOption("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (this.isTaunterValue) {
            LoneWolf.equipScroll(UltraDarkon_LW.enrageScroll);
        }

        LoneWolf.genericPrebuff();
        return !bot.shouldExit;
    }

    private startDarkonPacketDetector(): boolean {
        const detectsAttack2 = this.usesRelayedAttack2() ? LoneWolf.isArmyPlayer(1) : this.isArchPaladinPlayer();
        const animationMarker = detectsAttack2 ? UltraDarkon_LW.attack2Marker : UltraDarkon_LW.attack3Marker;

        if (
            LoneWolf.startPacketDetector(UltraDarkon_LW.packetCommand, [
                UltraDarkon_LW.bossCasterMarker,
                animationMarker,
            ])
        ) {
            return true;
        }

        Core.logger("The Darkon packet detector could not be started.", "RunFightAttempts", {
            messageBox: true,
            stopBot: true,
        });
        return false;
    }

    private fight(preset: ClassPreset, fightAttempt: number): FightResult {
        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            this.isTaunterValue,
            UltraDarkon_LW.logPrefix,
            preset.skillMode,
            !(this.armyComposition === ArmyComposition.Stable && LoneWolf.isArmyPlayer(1)),
            !this.isTaunterValue && this.getSetupOption("UsePotions") ? preset.combatPotion : null,
            this.armyComposition === ArmyComposition.Stable ? 25 : 12,
            undefined,
            undefined,
            this.armyComposition === ArmyComposition.Pay2Win && LoneWolf.isArmyPlayer(1) ? 4 : 0,
            this.armyComposition === ArmyComposition.Pay2Win && LoneWolf.isArmyPlayer(1)
                ? UltraDarkon_LW.aMajorAura
                : "",
        );
        Core.logger(`${UltraDarkon_LW.logPrefix} ${this.playerAlias} started fighting.`);

        let bossObserved = LoneWolf.isMonsterAlive(UltraDarkon_LW.darkonMapId);
        let tauntScheduled = false;
        let looHoldLogged = false;
        let looSkillFourRequested = false;
        let looSkillFourReleased = false;
        let nextDetection = 1;
        let nextAttack2Signal = 1;
        let scheduledTauntCycle = 0;
        let apExtraHealCycle = 0;
        let delayedHealCycle = 0;
        let delayedHealAttack = "";
        let tauntAt = 0;
        let apExtraHealWindowStart = 0;
        let delayedHealAt = 0;
        let apPhaseThreeConfigured = false;
        let apSkillThreeBlocked = false;
        const handlesAttack2Signals = this.usesRelayedAttack2() && this.isArchPaladinPlayer();

        while (!bot.shouldExit) {
            if (LoneWolf.isMonsterAlive(UltraDarkon_LW.darkonMapId)) {
                bossObserved = true;
            } else if (bossObserved) {
                break;
            }

            if (LoneWolf.shouldResetFight(fightAttempt)) {
                LoneWolf.stopSkillEngine();
                return FightResult.Reset;
            }

            if (!bot.player.alive) {
                Core.logger(`${UltraDarkon_LW.logPrefix} ${this.playerAlias} died.`);
                tauntScheduled = false;
                looSkillFourRequested = false;
                apExtraHealCycle = 0;
                apExtraHealWindowStart = 0;
                delayedHealCycle = 0;
                delayedHealAttack = "";
                delayedHealAt = 0;
                LoneWolf.setOrdinarySkillsSuppressed(false);

                while (!bot.shouldExit && !bot.player.alive) {
                    if (LoneWolf.shouldResetFight(fightAttempt)) {
                        LoneWolf.stopSkillEngine();
                        return FightResult.Reset;
                    }

                    bot.sleep(UltraDarkon_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    break;
                }

                if (!LoneWolf.isMonsterAlive(UltraDarkon_LW.darkonMapId) && bossObserved) {
                    break;
                }

                if (LoneWolf.shouldResetFight(fightAttempt)) {
                    LoneWolf.stopSkillEngine();
                    return FightResult.Reset;
                }

                Core.logger(`${UltraDarkon_LW.logPrefix} ${this.playerAlias} respawned.`);

                if (!this.isInBossRoom()) {
                    Core.jump(UltraDarkon_LW.bossCell, UltraDarkon_LW.bossPad);
                }

                LoneWolf.maintainTarget(UltraDarkon_LW.darkonMapId);
                this.advanceDetections(
                    ref(
                        () => nextDetection,
                        (v) => (nextDetection = v),
                    ),
                );
                if (handlesAttack2Signals) {
                    this.advanceAttack2Signals(
                        fightAttempt,
                        ref(
                            () => nextAttack2Signal,
                            (v) => (nextAttack2Signal = v),
                        ),
                    );
                }
                continue;
            }

            LoneWolf.maintainTarget(UltraDarkon_LW.darkonMapId);

            if (LoneWolf.isArmyPlayer(4)) {
                this.releaseLooSkillFour(
                    ref(
                        () => looHoldLogged,
                        (v) => (looHoldLogged = v),
                    ),
                    ref(
                        () => looSkillFourRequested,
                        (v) => (looSkillFourRequested = v),
                    ),
                    ref(
                        () => looSkillFourReleased,
                        (v) => (looSkillFourReleased = v),
                    ),
                );
            }

            if (
                !this.handlePacketDetections(
                    fightAttempt,
                    ref(
                        () => nextDetection,
                        (v) => (nextDetection = v),
                    ),
                    ref(
                        () => tauntScheduled,
                        (v) => (tauntScheduled = v),
                    ),
                    ref(
                        () => scheduledTauntCycle,
                        (v) => (scheduledTauntCycle = v),
                    ),
                    ref(
                        () => tauntAt,
                        (v) => (tauntAt = v),
                    ),
                    ref(
                        () => apExtraHealCycle,
                        (v) => (apExtraHealCycle = v),
                    ),
                    ref(
                        () => apExtraHealWindowStart,
                        (v) => (apExtraHealWindowStart = v),
                    ),
                    ref(
                        () => delayedHealCycle,
                        (v) => (delayedHealCycle = v),
                    ),
                    ref(
                        () => delayedHealAttack,
                        (v) => (delayedHealAttack = v),
                    ),
                    ref(
                        () => delayedHealAt,
                        (v) => (delayedHealAt = v),
                    ),
                )
            ) {
                LoneWolf.stopSkillEngine();
                return FightResult.Stopped;
            }

            if (handlesAttack2Signals) {
                this.handleAttack2Signals(
                    fightAttempt,
                    ref(
                        () => nextAttack2Signal,
                        (v) => (nextAttack2Signal = v),
                    ),
                    ref(
                        () => apExtraHealCycle,
                        (v) => (apExtraHealCycle = v),
                    ),
                    ref(
                        () => apExtraHealWindowStart,
                        (v) => (apExtraHealWindowStart = v),
                    ),
                    ref(
                        () => delayedHealCycle,
                        (v) => (delayedHealCycle = v),
                    ),
                    ref(
                        () => delayedHealAttack,
                        (v) => (delayedHealAttack = v),
                    ),
                    ref(
                        () => delayedHealAt,
                        (v) => (delayedHealAt = v),
                    ),
                );
            }

            this.tryQueueDelayedPacketHeal(
                ref(
                    () => delayedHealCycle,
                    (v) => (delayedHealCycle = v),
                ),
                ref(
                    () => delayedHealAttack,
                    (v) => (delayedHealAttack = v),
                ),
                ref(
                    () => delayedHealAt,
                    (v) => (delayedHealAt = v),
                ),
            );

            this.handleArchPaladin(
                ref(
                    () => apPhaseThreeConfigured,
                    (v) => (apPhaseThreeConfigured = v),
                ),
                ref(
                    () => apSkillThreeBlocked,
                    (v) => (apSkillThreeBlocked = v),
                ),
            );

            if (this.isArchPaladinPlayer()) {
                this.tryQueueApExtraHeal(
                    apPhaseThreeConfigured,
                    ref(
                        () => apExtraHealCycle,
                        (v) => (apExtraHealCycle = v),
                    ),
                    ref(
                        () => apExtraHealWindowStart,
                        (v) => (apExtraHealWindowStart = v),
                    ),
                );
            }

            if (tauntScheduled && Date.now() >= tauntAt) {
                const waitsForLooSkillFour =
                    this.armyComposition === ArmyComposition.Pay2Win &&
                    LoneWolf.isArmyPlayer(4) &&
                    (looSkillFourRequested || LoneWolf.hasPendingAbsolutePrioritySkill());

                if (!waitsForLooSkillFour) {
                    LoneWolf.requestAbsolutePriorityTaunt(UltraDarkon_LW.darkonMapId);

                    Core.logger(
                        `${UltraDarkon_LW.logPrefix} ${this.playerAlias} requested Darkon taunt cycle ${scheduledTauntCycle}.`,
                    );
                    tauntScheduled = false;
                }
            }

            if (LoneWolf.isArmyPlayer(4)) {
                this.useLooSkillFourNormally(looSkillFourReleased);
            }

            bot.sleep(UltraDarkon_LW.fightPollDelay);
        }

        LoneWolf.stopSkillEngine();

        if (bot.shouldExit) {
            return FightResult.Stopped;
        }

        Core.logger(`${UltraDarkon_LW.logPrefix} ${this.playerAlias} confirmed Ultra Darkon defeated.`);
        return FightResult.Defeated;
    }

    private handlePacketDetections(
        fightAttempt: number,
        nextDetection: Ref<number>,
        tauntScheduled: Ref<boolean>,
        scheduledTauntCycle: Ref<number>,
        tauntAt: Ref<number>,
        apExtraHealCycle: Ref<number>,
        apExtraHealWindowStart: Ref<number>,
        delayedHealCycle: Ref<number>,
        delayedHealAttack: Ref<string>,
        delayedHealAt: Ref<number>,
    ): boolean {
        while (LoneWolf.hasPacketDetection(nextDetection.value)) {
            const cycle = nextDetection.value++;

            if (!this.usesRelayedAttack2() && this.isArchPaladinPlayer()) {
                this.schedulePacketHeal("Attack2", cycle, delayedHealCycle, delayedHealAttack, delayedHealAt);
                this.scheduleApExtraHeal(cycle, apExtraHealCycle, apExtraHealWindowStart);
                continue;
            }

            if (this.usesRelayedAttack2() && LoneWolf.isArmyPlayer(1)) {
                const signal = UltraDarkon_LW.getAttack2Signal(fightAttempt, cycle);
                if (!LoneWolf.sendArmySignal(signal)) {
                    Core.logger(
                        `${UltraDarkon_LW.logPrefix} playerOne could not send ${signal}.`,
                        "HandlePacketDetections",
                        { messageBox: true, stopBot: true },
                    );
                    return false;
                }

                Core.logger(`${UltraDarkon_LW.logPrefix} playerOne sent ${signal}.`);
                continue;
            }

            if (this.isTaunterValue) {
                const openingOwner = this.isOpeningTauntOwner();
                const ownsCycle = openingOwner ? cycle % 2 === 1 : cycle % 2 === 0;

                if (ownsCycle) {
                    scheduledTauntCycle.value = cycle;
                    tauntAt.value = Date.now() + UltraDarkon_LW.tauntDelay;
                    tauntScheduled.value = true;
                    Core.logger(
                        `${UltraDarkon_LW.logPrefix} ${this.playerAlias} detected owned Attack3 cycle ${cycle}.`,
                    );
                }
            }
            if (LoneWolf.isArmyPlayer(4)) {
                if (cycle === 1 || cycle % 2 === 0) {
                    this.schedulePacketHeal("Attack3", cycle, delayedHealCycle, delayedHealAttack, delayedHealAt);
                }
            }
        }

        return true;
    }

    private handleAttack2Signals(
        fightAttempt: number,
        nextSignal: Ref<number>,
        extraHealCycle: Ref<number>,
        extraHealWindowStart: Ref<number>,
        delayedHealCycle: Ref<number>,
        delayedHealAttack: Ref<string>,
        delayedHealAt: Ref<number>,
    ): void {
        while (LoneWolf.hasArmySignal(UltraDarkon_LW.getAttack2Signal(fightAttempt, nextSignal.value), 1)) {
            this.schedulePacketHeal("Attack2", nextSignal.value, delayedHealCycle, delayedHealAttack, delayedHealAt);
            this.scheduleApExtraHeal(nextSignal.value, extraHealCycle, extraHealWindowStart);

            nextSignal.value++;
        }
    }

    private scheduleApExtraHeal(cycle: number, extraHealCycle: Ref<number>, extraHealWindowStart: Ref<number>): void {
        extraHealCycle.value = cycle;
        extraHealWindowStart.value = Date.now() + UltraDarkon_LW.apExtraHealWindowStartDelay;
    }

    private tryQueueApExtraHeal(phaseThreeConfigured: boolean, cycle: Ref<number>, windowStart: Ref<number>): void {
        if (cycle.value <= 0) {
            return;
        }

        const now = Date.now();
        if (now < windowStart.value) {
            return;
        }

        if (phaseThreeConfigured) {
            const phaseThreeCycle = cycle.value;
            cycle.value = 0;
            windowStart.value = 0;
            LoneWolf.requestPrioritySkill(2);
            Core.logger(
                `${UltraDarkon_LW.logPrefix} ${this.playerAlias} queued its mandatory Phase 3 midpoint heal for cycle.value ${phaseThreeCycle}.`,
            );
            return;
        }

        if (now >= windowStart.value + UltraDarkon_LW.apExtraHealWindowDuration) {
            cycle.value = 0;
            windowStart.value = 0;
            return;
        }

        if (!bot.player.alive || LoneWolf.hasPendingPrioritySkill() || !bot.skills.canUseSkill(2)) {
            return;
        }

        const scheduledCycle = cycle.value;
        cycle.value = 0;
        windowStart.value = 0;
        LoneWolf.requestPrioritySkill(2);
        Core.logger(
            `${UltraDarkon_LW.logPrefix} ${this.playerAlias} queued its optional Attack2 heal for cycle.value ${scheduledCycle}.`,
        );
    }

    private schedulePacketHeal(
        attack: string,
        cycle: number,
        delayedCycle: Ref<number>,
        delayedAttack: Ref<string>,
        delayedAt: Ref<number>,
    ): void {
        delayedCycle.value = cycle;
        delayedAttack.value = attack;
        delayedAt.value = Date.now() + UltraDarkon_LW.requiredHealDelay;
        LoneWolf.setOrdinarySkillsSuppressed(true);
        Core.logger(`${UltraDarkon_LW.logPrefix} ${this.playerAlias} scheduled its ${attack} heal for cycle ${cycle}.`);
    }

    private tryQueueDelayedPacketHeal(cycle: Ref<number>, attack: Ref<string>, dueAt: Ref<number>): void {
        if (cycle.value <= 0 || Date.now() < dueAt.value) {
            return;
        }

        const scheduledCycle = cycle.value;
        const scheduledAttack = attack.value;
        cycle.value = 0;
        attack.value = "";
        dueAt.value = 0;
        LoneWolf.requestPrioritySkill(2);
        LoneWolf.setOrdinarySkillsSuppressed(false);
        Core.logger(
            `${UltraDarkon_LW.logPrefix} ${this.playerAlias} queued its delayed ${scheduledAttack} heal for cycle.value ${scheduledCycle}.`,
        );
    }

    private handleArchPaladin(phaseThreeConfigured: Ref<boolean>, skillThreeBlocked: Ref<boolean>): void {
        if (
            !this.isArchPaladinPlayer() ||
            !bot.player.alive ||
            !bot.player.hasTarget ||
            bot.player.target?.mapId !== UltraDarkon_LW.darkonMapId ||
            bot.player.target?.hp <= 0
        ) {
            return;
        }

        let phaseThreeChanged = false;
        if (!phaseThreeConfigured.value && bot.target.getAura(UltraDarkon_LW.ariaAura) != null) {
            phaseThreeConfigured.value = true;
            phaseThreeChanged = true;
            Core.logger(`${UltraDarkon_LW.logPrefix} ${this.playerAlias} switched to its Phase 3 skill array.`);
        }

        const shouldBlockSkillThree = bot.target.getAura(UltraDarkon_LW.aMajorAura) != null;
        const skillThreeBlockChanged = shouldBlockSkillThree !== skillThreeBlocked.value;
        if (phaseThreeChanged || skillThreeBlockChanged) {
            const skills = phaseThreeConfigured.value
                ? shouldBlockSkillThree
                    ? [1]
                    : [1, 3]
                : shouldBlockSkillThree
                  ? [1, 4]
                  : [3, 1, 4];

            LoneWolf.setSkillEngineSkills(skills);
            skillThreeBlocked.value = shouldBlockSkillThree;
            if (skillThreeBlockChanged) {
                Core.logger(
                    shouldBlockSkillThree
                        ? `${UltraDarkon_LW.logPrefix} ${this.playerAlias} blocked skill 3 for A Major.`
                        : `${UltraDarkon_LW.logPrefix} ${this.playerAlias} restored skill 3 after A Major.`,
                );
            }
        }

        if (!phaseThreeConfigured.value) {
            return;
        }

        const righteousSeal = bot.target.getAura(UltraDarkon_LW.righteousSealAura);
        const righteousSealRemaining = righteousSeal != null ? righteousSeal.expiresAt - Date.now() : 0;
        if (
            righteousSeal == null ||
            righteousSealRemaining <= 0 ||
            righteousSealRemaining > UltraDarkon_LW.righteousSealSkillFourWindow ||
            LoneWolf.hasPendingPrioritySkill() ||
            !bot.skills.canUseSkill(4)
        ) {
            return;
        }

        LoneWolf.requestPrioritySkill(4);
        Core.logger(`${UltraDarkon_LW.logPrefix} ${this.playerAlias} queued skill 4 for Righteous Seal.`);
    }

    private releaseLooSkillFour(
        holdLogged: Ref<boolean>,
        skillFourRequested: Ref<boolean>,
        skillFourReleased: Ref<boolean>,
    ): void {
        if (
            !bot.player.hasTarget ||
            bot.player.target?.mapId !== UltraDarkon_LW.darkonMapId ||
            bot.player.target?.hp <= 0 ||
            skillFourReleased.value
        ) {
            return;
        }

        if (skillFourRequested.value) {
            if (LoneWolf.hasPendingAbsolutePrioritySkill()) {
                return;
            }

            skillFourRequested.value = false;
            skillFourReleased.value = true;
            Core.logger(`${UltraDarkon_LW.logPrefix} playerFour released held skill 4.`);
            return;
        }

        if (bot.target.getAura(UltraDarkon_LW.ariaAura) != null) {
            return;
        }

        const health = bot.player.target?.hp ?? 0;
        if (health <= UltraDarkon_LW.looHoldHealth && !holdLogged.value) {
            holdLogged.value = true;
            Core.logger(`${UltraDarkon_LW.logPrefix} playerFour is holding skill 4.`);
        }

        if (health <= UltraDarkon_LW.looReleaseHealth) {
            LoneWolf.requestAbsolutePrioritySkill(4);
            skillFourRequested.value = true;
            Core.logger(`${UltraDarkon_LW.logPrefix} playerFour queued held skill 4 with absolute priority.`);
        }
    }

    private useLooSkillFourNormally(skillFourReleased: boolean): void {
        if (
            LoneWolf.hasPendingPrioritySkill() ||
            !bot.player.hasTarget ||
            bot.player.target?.mapId !== UltraDarkon_LW.darkonMapId ||
            bot.player.target?.hp <= 0
        ) {
            return;
        }

        const aria = bot.target.getAura(UltraDarkon_LW.ariaAura) != null;
        const health = bot.player.target?.hp ?? 0;

        if (!aria && (health <= UltraDarkon_LW.looHoldHealth || skillFourReleased)) {
            return;
        }

        if (bot.skills.canUseSkill(4)) {
            bot.skills.useSkill(4);
        }
    }

    private advanceDetections(nextDetection: Ref<number>): void {
        while (LoneWolf.hasPacketDetection(nextDetection.value)) {
            nextDetection.value++;
        }
    }

    private advanceAttack2Signals(fightAttempt: number, nextSignal: Ref<number>): void {
        while (LoneWolf.hasArmySignal(UltraDarkon_LW.getAttack2Signal(fightAttempt, nextSignal.value), 1)) {
            nextSignal.value++;
        }
    }

    private static getAttack2Signal(fightAttempt: number, cycle: number): string {
        return `DARKON_ATTACK2_${fightAttempt}_${cycle}`;
    }

    private handleFightReset(fightAttempt: number): boolean {
        LoneWolf.stopPacketDetector();
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();

        while (!bot.shouldExit && !bot.player.alive) {
            LoneWolf.shouldResetFight(fightAttempt);
            bot.sleep(UltraDarkon_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightAttempt);
        Core.jump(UltraDarkon_LW.safeCell, UltraDarkon_LW.safePad);

        if (!this.isInSafeRoom()) {
            Core.logger(
                `${UltraDarkon_LW.logPrefix} ${this.playerAlias} could not reach the safe room after reset.`,
                "HandleFightReset",
                { messageBox: true, stopBot: true },
            );
            return false;
        }

        return this.sync(`FIGHT_RESET_${fightAttempt}_SAFE`);
    }

    private stopArmyAfterFailedAttempts(): void {
        if (this.masterMode) {
            if (LoneWolf.isArmyPlayer(1)) {
                LoneWolf.stopArmySync("ATTEMPTS_EXHAUSTED");
            } else {
                LoneWolf.syncArmy("STOP_CHECK");
            }

            Core.logger(
                `${UltraDarkon_LW.logPrefix} failed after ${UltraDarkon_LW.maxFightAttempts} fight attempts.`,
                "RunFightAttempts",
            );
            return;
        }

        if (LoneWolf.isArmyPlayer(1)) {
            LoneWolf.stopArmySync("ATTEMPTS_EXHAUSTED");
        } else {
            LoneWolf.syncArmy("STOP_CHECK");
        }

        Core.logger(
            `${UltraDarkon_LW.logPrefix} failed after ${UltraDarkon_LW.maxFightAttempts} fight attempts.`,
            "RunFightAttempts",
            { messageBox: true, stopBot: true },
        );
    }

    private isInSafeRoom(): boolean {
        return bot.player.cell?.toLowerCase() === UltraDarkon_LW.safeCell?.toLowerCase();
    }

    private getSetupOption<T extends string | number | boolean>(optionName: string): T {
        return (this.masterMode ? bot.config!.get<T>("Setup", optionName) : bot.config!.get<T>(optionName))!;
    }

    private getUltraOption<T extends string | number | boolean>(
        masterOptionName: string,
        standaloneOptionName: string,
    ): T {
        return (
            this.masterMode
                ? bot.config!.get<T>("Weekly_Ultras", masterOptionName)
                : bot.config!.get<T>(standaloneOptionName)
        )!;
    }

    private isInBossRoom(): boolean {
        return bot.player.cell === UltraDarkon_LW.bossCell && bot.player.pad === UltraDarkon_LW.bossPad;
    }

    private usesPlayerOneAndTwoTaunters(): boolean {
        return this.armyComposition === ArmyComposition.Default || this.armyComposition === ArmyComposition.Reliable;
    }

    private usesRelayedAttack2(): boolean {
        return this.armyComposition === ArmyComposition.Stable || this.armyComposition === ArmyComposition.Optimized;
    }

    private isTaunter(): boolean {
        return this.armyComposition === ArmyComposition.Pay2Win
            ? LoneWolf.isArmyPlayer(2) || LoneWolf.isArmyPlayer(4)
            : this.usesPlayerOneAndTwoTaunters()
              ? LoneWolf.isArmyPlayer(1) || LoneWolf.isArmyPlayer(2)
              : LoneWolf.isArmyPlayer(2) || LoneWolf.isArmyPlayer(3);
    }

    private isArchPaladinPlayer(): boolean {
        return LoneWolf.isArmyPlayer(3);
    }

    private isOpeningTauntOwner(): boolean {
        return this.usesPlayerOneAndTwoTaunters() ? LoneWolf.isArmyPlayer(1) : LoneWolf.isArmyPlayer(2);
    }

    private getClassPreset(): ClassPreset {
        let preset: ClassPreset;

        if (LoneWolf.isArmyPlayer(1)) {
            if (this.armyComposition === ArmyComposition.Pay2Win) {
                preset = LoneWolf.guardian();
            } else if (this.armyComposition === ArmyComposition.Reliable) {
                preset = LoneWolf.verusDoomKnight();
                preset.capeEnhancement = CapeSpecial.Penitence;
            } else if (this.armyComposition === ArmyComposition.Stable) {
                preset = LoneWolf.kingsEcho();
                preset.capeEnhancement = CapeSpecial.Penitence;
                preset.helmEnhancement = HelmSpecial.Forge;
            } else if (this.armyComposition === ArmyComposition.Optimized) {
                preset = LoneWolf.lightCaster();
            } else {
                preset = LoneWolf.legionRevenant();
                preset.capeEnhancement = CapeSpecial.Lament;
            }
        } else if (LoneWolf.isArmyPlayer(2)) {
            preset = LoneWolf.stoneCrusher();
            preset.capeEnhancement = CapeSpecial.Absolution;
        } else if (LoneWolf.isArmyPlayer(3)) {
            preset = LoneWolf.archPaladin();
            preset.skills = [3, 1, 4];
            preset.capeEnhancement = CapeSpecial.Lament;
        } else {
            preset = LoneWolf.lordOfOrder();
            preset.skills = [3, 1];
            preset.capeEnhancement = CapeSpecial.Absolution;
        }

        if (preset.capeEnhancement === CapeSpecial.Lament) {
            preset.capeEnhancement = CapeSpecial.Penitence;
        }

        return preset;
    }

    private getPlayerAlias(): string {
        if (LoneWolf.isArmyPlayer(1)) {
            return "playerOne";
        }

        if (LoneWolf.isArmyPlayer(2)) {
            return "playerTwo";
        }

        if (LoneWolf.isArmyPlayer(3)) {
            return "playerThree";
        }

        return "playerFour";
    }

    private sync(step: string): boolean {
        Core.logger(`${UltraDarkon_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${UltraDarkon_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${UltraDarkon_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${UltraDarkon_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${UltraDarkon_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${UltraDarkon_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "UltraDarkon_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nOptimized: LC / SC / AP / LOO\nPay2Win: Guardian / SC / AP / LOO",
            choices(ArmyComposition),
            ArmyComposition[ArmyComposition.Default],
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadout.", true),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadout.", true),
    ],
    true,
);

export default function main(): void {
    const script = new UltraDarkon_LW();
    bot.skills.stop();
    bot.options.infiniteRange = true;
    LoneWolf.setAntiLag();
    bot.config?.configure();

    try {
        script.run();
    } finally {
        LoneWolf.stopPacketDetector();
        LoneWolf.stopSkillEngine();
    }
}
