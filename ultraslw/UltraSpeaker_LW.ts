/*
name: Ultra Speaker LW
description: Four-player Ultra Speaker Army script using CoreLoneWolf.
tags: ultra, speaker, army, corelonewolf
*/
// Port of UltraSpeaker_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, ref } from "./LWRef";
import { bot, choices, defineScriptOptions, type EventMap, option } from "turu";
import { CapeSpecial, HelmSpecial } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";
import { type ClassPreset, CoreLoneWolf, UltraRunResult } from "./CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum FightResult {
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export enum ArmyComposition {
    Default = 0,
    Reliable = 1,
    Pay2Win = 2,
    Fast = 5,
}

export class SpeakerStep {
    warning!: string;
    owner!: number;
    fresh!: boolean;
    skillOwner!: number;
    skill!: number;

    constructor(warning: string, owner: number, fresh: boolean, skillOwner = 0, skill = 0) {
        this.warning = warning;
        this.owner = owner;
        this.fresh = fresh;
        this.skillOwner = skillOwner;
        this.skill = skill;
    }
}

export class UltraSpeaker_LW {
    private static readonly logPrefix = "Ultra Speaker LW";
    private static readonly syncFileName = "UltraSpeaker_LW.sync";
    private static readonly mapName = "ultraspeaker";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly bossCell = "Boss";
    private static readonly bossPad = "Left";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly sanctityAura = "Sanctity";
    private static readonly righteousSealAura = "Righteous Seal";
    private static readonly truthMessage = "I will make you see the truth.";
    private static readonly listenMessage = "You shall listen.";
    private static readonly ultraQuestId = 9173;
    private static readonly prerequisiteQuestId = 9125;
    private static readonly prerequisiteQuestName = "Your Hero";
    private static readonly minimumLevel = 90;
    private static readonly speakerMapId = 1;
    private static readonly safeX = 890;
    private static readonly safeY = 395;
    private static readonly redX = 731;
    private static readonly redY = 380;
    private static readonly coordinateTolerance = 20;
    private static readonly walkSpeed = 8;
    private static readonly movementRetryDelay = 500;
    private static readonly righteousSealSkillFourWindow = 1000;
    private static readonly fightPollDelay = 100;
    private static readonly maxFightAttempts = 3;

    private static readonly openingSteps: SpeakerStep[] = [
        new SpeakerStep(UltraSpeaker_LW.truthMessage, 1, true),
        new SpeakerStep(UltraSpeaker_LW.listenMessage, 4, true),
    ];

    private static readonly sectionOneSteps: SpeakerStep[] = [
        new SpeakerStep(UltraSpeaker_LW.truthMessage, 3, true, 3, 3),
        new SpeakerStep(UltraSpeaker_LW.listenMessage, 2, true),
        new SpeakerStep(UltraSpeaker_LW.truthMessage, 2, false, 4, 4),
    ];

    private static readonly sectionTwoSteps: SpeakerStep[] = [
        new SpeakerStep(UltraSpeaker_LW.listenMessage, 1, true),
        new SpeakerStep(UltraSpeaker_LW.truthMessage, 1, false, 3, 3),
        new SpeakerStep(UltraSpeaker_LW.truthMessage, 4, true),
        new SpeakerStep(UltraSpeaker_LW.listenMessage, 4, false),
    ];

    private static readonly pay2WinOpeningSteps: SpeakerStep[] = [
        new SpeakerStep(UltraSpeaker_LW.truthMessage, 3, true),
        new SpeakerStep(UltraSpeaker_LW.listenMessage, 2, true),
    ];

    private static readonly pay2WinSectionOneSteps: SpeakerStep[] = [
        new SpeakerStep(UltraSpeaker_LW.truthMessage, 4, true, 4, 3),
        new SpeakerStep(UltraSpeaker_LW.listenMessage, 2, true),
        new SpeakerStep(UltraSpeaker_LW.truthMessage, 2, false),
    ];

    private static readonly pay2WinSectionTwoSteps: SpeakerStep[] = [
        new SpeakerStep(UltraSpeaker_LW.listenMessage, 3, true),
        new SpeakerStep(UltraSpeaker_LW.truthMessage, 3, false, 4, 3),
        new SpeakerStep(UltraSpeaker_LW.truthMessage, 2, true),
        new SpeakerStep(UltraSpeaker_LW.listenMessage, 2, false),
    ];

    private static readonly pay2WinSectionThreeSteps: SpeakerStep[] = [
        new SpeakerStep(UltraSpeaker_LW.truthMessage, 4, true, 4, 3),
        new SpeakerStep(UltraSpeaker_LW.listenMessage, 3, true),
        new SpeakerStep(UltraSpeaker_LW.truthMessage, 3, false),
    ];

    private static readonly pay2WinSectionFourSteps: SpeakerStep[] = [
        new SpeakerStep(UltraSpeaker_LW.listenMessage, 2, true),
        new SpeakerStep(UltraSpeaker_LW.truthMessage, 2, false, 4, 3),
        new SpeakerStep(UltraSpeaker_LW.truthMessage, 3, true),
        new SpeakerStep(UltraSpeaker_LW.listenMessage, 2, true),
    ];

    private static readonly zoneOwners: number[] = [2, 1, 3, 4];
    private static readonly pay2WinZoneOwners: number[] = [1, 3, 4, 2];

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = ArmyComposition.Default;
    private masterMode: boolean = false;
    private runResult: UltraRunResult = UltraRunResult.Failed;
    private bruteForceMethod: boolean = false;
    private privateRoomNumber: number = 0;
    private equalizeDetectionCount: number = 0;

    runFromMaster(): UltraRunResult {
        this.masterMode = true;
        this.runResult = UltraRunResult.Failed;
        bot.skills.stop();
        bot.options.infiniteRange = true;

        try {
            this.run();
        } finally {
            this.stopFightSystems();
            this.masterMode = false;
        }

        return this.runResult;
    }

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (this.bruteForceMethod) {
            Core.logger(
                "Brute Force Method is enabled. This is only used when Ultra Speaker is bugged. The script will fail if used incorrectly.",
                UltraSpeaker_LW.logPrefix,
                { messageBox: true },
            );
        }

        if (!LoneWolf.startArmySync(UltraSpeaker_LW.syncFileName, 4, this.masterMode ? "Setup" : null)) {
            return;
        }

        if (
            !LoneWolf.validateUltraAccess(
                UltraSpeaker_LW.ultraQuestId,
                UltraSpeaker_LW.prerequisiteQuestId,
                UltraSpeaker_LW.prerequisiteQuestName,
                UltraSpeaker_LW.minimumLevel,
                UltraSpeaker_LW.logPrefix,
                this.getClassPreset().className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        const preset = this.getClassPreset();

        if (this.isTaunter()) {
            preset.combatPotion = null;
        }

        Core.logger(
            `${UltraSpeaker_LW.logPrefix} started as ${this.playerAlias} using ${ArmyComposition[this.armyComposition]} composition.`,
        );

        LoneWolf.acceptUltraQuest(UltraSpeaker_LW.ultraQuestId);

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        if (!this.runFightAttempts(preset) || !this.sync("BOSS_DEFEATED")) {
            return;
        }

        Core.jump(UltraSpeaker_LW.safeCell, UltraSpeaker_LW.safePad);
        LoneWolf.completeUltraQuest(UltraSpeaker_LW.ultraQuestId);

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
        this.runResult = UltraRunResult.Completed;
    }

    private runFightAttempts(preset: ClassPreset): boolean {
        for (
            let fightAttempt = 1;
            fightAttempt <= UltraSpeaker_LW.maxFightAttempts && !bot.shouldExit;
            fightAttempt++
        ) {
            Core.join(
                `${UltraSpeaker_LW.mapName}-${this.privateRoomNumber}`,
                UltraSpeaker_LW.safeCell,
                UltraSpeaker_LW.safePad,
            );

            if (!this.prepareSafeRoom(preset) || !this.sync("FIGHT_READY")) {
                return false;
            }

            if (!this.startFightSystems(preset)) {
                return false;
            }

            let result: FightResult;
            try {
                Core.jump(UltraSpeaker_LW.bossCell, UltraSpeaker_LW.bossPad);

                if (bot.shouldExit || !this.sync("START_FIGHT")) {
                    return false;
                }

                result = this.fight(fightAttempt);
            } finally {
                this.stopFightSystems();
            }

            if (result === FightResult.Defeated) {
                return true;
            }

            if (result !== FightResult.Reset || !this.handleFightReset(fightAttempt)) {
                return false;
            }

            if (fightAttempt >= UltraSpeaker_LW.maxFightAttempts) {
                this.stopArmyAfterFailedAttempts();
                this.runResult = UltraRunResult.AttemptsExhausted;
                return false;
            }
        }

        return false;
    }

    private validateOptions(): boolean {
        this.armyComposition = this.getUltraOption("UltraSpeakerComposition", "ArmyComposition");
        this.bruteForceMethod = this.getUltraOption("UltraSpeakerBruteForceMethod", "BruteForceMethod");
        this.privateRoomNumber = this.getSetupOption("PrivateRoomNumber");
        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${UltraSpeaker_LW.logPrefix} ${this.playerAlias} starting setup.`);

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
            if (preset.className === "StoneCrusher") {
                preset.elixir = LoneWolf.getDivineElixir(preset, this.playerAlias, UltraSpeaker_LW.logPrefix);
            }

            LoneWolf.preparePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (this.isTaunter()) {
            LoneWolf.prepareScrolls(UltraSpeaker_LW.enrageScroll);
        }

        if (bot.shouldExit) {
            return false;
        }

        Core.logger(`${UltraSpeaker_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareSafeRoom(preset: ClassPreset): boolean {
        if (this.getSetupOption("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (this.isTaunter()) {
            LoneWolf.equipScroll(UltraSpeaker_LW.enrageScroll);
        }

        LoneWolf.genericPrebuff();
        return !bot.shouldExit;
    }

    private startFightSystems(preset: ClassPreset): boolean {
        if (
            !LoneWolf.startPacketChoiceDetector(
                "ct",
                [UltraSpeaker_LW.truthMessage, UltraSpeaker_LW.listenMessage],
                UltraSpeaker_LW.listenMessage,
                true,
            )
        ) {
            Core.logger("Speaker packet detector could not be started.", "StartFightSystems", {
                messageBox: true,
                stopBot: true,
            });
            return false;
        }

        this.equalizeDetectionCount = 0;
        bot.events.off("runToArea", this.onRunToArea);
        bot.events.on("runToArea", this.onRunToArea);

        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            this.isTaunter(),
            UltraSpeaker_LW.logPrefix,
            preset.skillMode,
            undefined,
            this.getSetupOption("UsePotions") ? preset.combatPotion : null,
        );
        return true;
    }

    stopFightSystems(): void {
        bot.events.off("runToArea", this.onRunToArea);
        this.equalizeDetectionCount = 0;
        LoneWolf.stopPacketDetector();
        LoneWolf.stopSkillEngine();
    }

    private onRunToArea = ({ zone }: EventMap["runToArea"]): void => {
        if (zone === "A") {
            ++this.equalizeDetectionCount;
        }
    };

    private fight(fightAttempt: number): FightResult {
        let currentSection = 0;
        let currentStep = 0;
        let nextWarningDetection = 1;
        let nextEqualizeDetection = 1;
        let equalizeCycle = 0;
        let bossObserved = false;
        let playerWasDead = false;
        let localChartInvalid = false;
        let chartFailureSent = false;
        let chartResetSent = false;
        let nextChartFailureSender = 1;
        let righteousSealSkillFourQueued = false;
        const zoneState = new ZoneState();

        this.startInitialMovement(zoneState);

        Core.logger(`${UltraSpeaker_LW.logPrefix} ${this.playerAlias} started fighting attempt ${fightAttempt}.`);

        while (!bot.shouldExit) {
            if (this.isInBossRoom()) {
                if (LoneWolf.isMonsterAlive(UltraSpeaker_LW.speakerMapId)) {
                    bossObserved = true;
                } else if (bossObserved) {
                    return FightResult.Defeated;
                }
            }

            if (!this.bruteForceMethod && LoneWolf.shouldResetFight(fightAttempt)) {
                return FightResult.Reset;
            }

            if (!localChartInvalid) {
                let warningMismatch: string = undefined!;
                const warningChartValid = this.processWarningDetections(
                    ref(
                        () => currentSection,
                        (v) => (currentSection = v),
                    ),
                    ref(
                        () => currentStep,
                        (v) => (currentStep = v),
                    ),
                    ref(
                        () => nextWarningDetection,
                        (v) => (nextWarningDetection = v),
                    ),
                    ref(
                        () => righteousSealSkillFourQueued,
                        (v) => (righteousSealSkillFourQueued = v),
                    ),
                    ref(
                        () => warningMismatch,
                        (v) => (warningMismatch = v),
                    ),
                );

                if (
                    !warningChartValid &&
                    !this.reportChartFailure(
                        fightAttempt,
                        warningMismatch,
                        ref(
                            () => localChartInvalid,
                            (v) => (localChartInvalid = v),
                        ),
                        ref(
                            () => chartFailureSent,
                            (v) => (chartFailureSent = v),
                        ),
                    )
                ) {
                    return FightResult.Stopped;
                }

                let equalizeMismatch: string = undefined!;

                if (
                    !localChartInvalid &&
                    !this.processEqualizeDetections(
                        fightAttempt,
                        zoneState,
                        ref(
                            () => currentSection,
                            (v) => (currentSection = v),
                        ),
                        ref(
                            () => currentStep,
                            (v) => (currentStep = v),
                        ),
                        ref(
                            () => nextEqualizeDetection,
                            (v) => (nextEqualizeDetection = v),
                        ),
                        ref(
                            () => equalizeCycle,
                            (v) => (equalizeCycle = v),
                        ),
                        ref(
                            () => equalizeMismatch,
                            (v) => (equalizeMismatch = v),
                        ),
                    ) &&
                    !this.reportChartFailure(
                        fightAttempt,
                        equalizeMismatch,
                        ref(
                            () => localChartInvalid,
                            (v) => (localChartInvalid = v),
                        ),
                        ref(
                            () => chartFailureSent,
                            (v) => (chartFailureSent = v),
                        ),
                    )
                ) {
                    return FightResult.Stopped;
                }
            }

            if (
                !this.publishChartResetIfRequested(
                    fightAttempt,
                    ref(
                        () => chartResetSent,
                        (v) => (chartResetSent = v),
                    ),
                    ref(
                        () => nextChartFailureSender,
                        (v) => (nextChartFailureSender = v),
                    ),
                )
            ) {
                return FightResult.Stopped;
            }

            if (this.hasChartResetSignal(fightAttempt)) {
                return FightResult.Reset;
            }

            if (!bot.player.alive) {
                if (!playerWasDead) {
                    playerWasDead = true;
                    Core.logger(`${UltraSpeaker_LW.logPrefix} ${this.playerAlias} died.`);
                }

                bot.sleep(UltraSpeaker_LW.fightPollDelay);
                continue;
            }

            if (playerWasDead) {
                playerWasDead = false;
                Core.logger(`${UltraSpeaker_LW.logPrefix} ${this.playerAlias} respawned.`);

                if (!this.isInBossRoom()) {
                    Core.jump(UltraSpeaker_LW.bossCell, UltraSpeaker_LW.bossPad);
                }

                if (bot.shouldExit) {
                    break;
                }

                this.restoreZonePositionAfterDeath(zoneState, fightAttempt, equalizeCycle);
            }

            if (!this.processZoneState(zoneState, fightAttempt)) {
                return FightResult.Stopped;
            }

            if (this.isInBossRoom()) {
                LoneWolf.maintainTarget(UltraSpeaker_LW.speakerMapId);

                if (!this.bruteForceMethod) {
                    this.maintainArchPaladinRighteousSeal(
                        ref(
                            () => righteousSealSkillFourQueued,
                            (v) => (righteousSealSkillFourQueued = v),
                        ),
                    );
                }
            }

            bot.sleep(UltraSpeaker_LW.fightPollDelay);
        }

        return FightResult.Stopped;
    }

    private processWarningDetections(
        currentSection: Ref<number>,
        currentStep: Ref<number>,
        nextDetection: Ref<number>,
        righteousSealSkillFourQueued: Ref<boolean>,
        mismatch: Ref<string>,
    ): boolean {
        mismatch.value = "";

        while (LoneWolf.hasPacketDetection(nextDetection.value)) {
            const detectedWarning = LoneWolf.getPacketDetectorChoice();
            const steps = this.getSectionSteps(currentSection.value);

            if (currentStep.value >= steps.length) {
                mismatch.value = `Unexpected ${this.getWarningName(detectedWarning)} before the next Equalize.`;
                return false;
            }

            const expected = steps[currentStep.value];
            if (!(detectedWarning === expected.warning)) {
                mismatch.value = `Expected ${this.getWarningName(expected.warning)} but detected ${this.getWarningName(detectedWarning)}.`;
                return false;
            }

            nextDetection.value++;
            currentStep.value++;

            const localFreshOwner = expected.fresh && LoneWolf.isArmyPlayer(expected.owner);

            if (localFreshOwner) {
                LoneWolf.requestAbsolutePriorityTaunt(UltraSpeaker_LW.speakerMapId);

                Core.logger(
                    `${UltraSpeaker_LW.logPrefix} ${this.playerAlias} requested Fresh ${this.getWarningName(expected.warning)} taunt.`,
                );
            } else if (!expected.fresh) {
                Core.logger(
                    `${UltraSpeaker_LW.logPrefix} ${this.playerAlias} processed Covered ${this.getWarningName(expected.warning)}.`,
                );
            }

            if (!localFreshOwner) {
                LoneWolf.resumeSkillEngine();
            }

            if (!this.bruteForceMethod && expected.skill > 0 && LoneWolf.isArmyPlayer(expected.skillOwner)) {
                LoneWolf.requestPrioritySkill(expected.skill);

                if (expected.skillOwner === this.getArchPaladinPlayer() && expected.skill === 3) {
                    righteousSealSkillFourQueued.value = false;
                }

                Core.logger(`${UltraSpeaker_LW.logPrefix} ${this.playerAlias} queued chart skill ${expected.skill}.`);
            }
        }

        return true;
    }

    private processEqualizeDetections(
        fightAttempt: number,
        zoneState: ZoneState,
        currentSection: Ref<number>,
        currentStep: Ref<number>,
        nextDetection: Ref<number>,
        equalizeCycle: Ref<number>,
        mismatch: Ref<string>,
    ): boolean {
        mismatch.value = "";

        while (this.equalizeDetectionCount >= nextDetection.value) {
            if (currentStep.value !== this.getSectionStepCount(currentSection.value)) {
                mismatch.value = `Equalize arrived before ${this.getPortionName(currentSection.value)} completed.`;
                return false;
            }

            const cycle = nextDetection.value++;
            const owner = this.getZoneOwner(cycle);
            if (!this.bruteForceMethod) {
                if (LoneWolf.isArmyPlayer(owner) && !this.isAtCoordinate(UltraSpeaker_LW.redX, UltraSpeaker_LW.redY)) {
                    mismatch.value = `Equalize cycle ${cycle} owner was not in the red zone.`;
                    return false;
                }
            }

            equalizeCycle.value = cycle;
            currentSection.value = ((cycle - 1) % 4) + 1;
            currentStep.value = 0;

            if (!this.bruteForceMethod) {
                if (LoneWolf.isArmyPlayer(owner)) {
                    zoneState.waitingForSanctityCycle = cycle;
                }

                const nextOwner = this.getZoneOwner(cycle + 1);
                if (LoneWolf.isArmyPlayer(nextOwner)) {
                    zoneState.waitingForClearCycle = cycle;
                }
            }

            Core.logger(
                `${UltraSpeaker_LW.logPrefix} ${this.playerAlias} entered Equalize cycle ${cycle} section ${currentSection.value}.`,
            );
        }

        return true;
    }

    private processZoneState(state: ZoneState, fightAttempt: number): boolean {
        if (!bot.player.alive || !this.isInBossRoom()) {
            return true;
        }

        if (state.moving) {
            if (Date.now() < state.confirmMovementAt) {
                return true;
            }

            if (!this.isAtCoordinate(state.targetX, state.targetY)) {
                this.issueMovement(state);
                return true;
            }

            state.moving = false;
            if (state.arrivalSignal.length === 0) {
                return true;
            }

            const signal = state.arrivalSignal;
            state.arrivalSignal = "";
            if (!LoneWolf.sendArmySignal(signal)) {
                Core.logger(
                    `${UltraSpeaker_LW.logPrefix} ${this.playerAlias} could not send ${signal}.`,
                    "ProcessZoneState",
                    { messageBox: true, stopBot: true },
                );
                return false;
            }

            Core.logger(`${UltraSpeaker_LW.logPrefix} ${this.playerAlias} sent ${signal}.`);
            return true;
        }

        if (this.bruteForceMethod) {
            return true;
        }

        if (state.waitingForSanctityCycle > 0) {
            if (bot.self.getAura(UltraSpeaker_LW.sanctityAura) == null) {
                return true;
            }

            const cycle = state.waitingForSanctityCycle;
            state.waitingForSanctityCycle = 0;
            this.startMovement(
                state,
                UltraSpeaker_LW.safeX,
                UltraSpeaker_LW.safeY,
                this.getZoneClearSignal(fightAttempt, cycle),
            );
            Core.logger(
                `${UltraSpeaker_LW.logPrefix} ${this.playerAlias} resolved Sanctity cycle ${cycle} and moved safe.`,
            );
            return true;
        }

        if (state.waitingForClearCycle > 0) {
            const cycle = state.waitingForClearCycle;
            const owner = this.getZoneOwner(cycle);
            const clearSignal = this.getZoneClearSignal(fightAttempt, cycle);
            if (!LoneWolf.hasArmySignal(clearSignal, owner)) {
                return true;
            }

            state.waitingForClearCycle = 0;
            this.startMovement(state, UltraSpeaker_LW.redX, UltraSpeaker_LW.redY, "");
            Core.logger(
                `${UltraSpeaker_LW.logPrefix} ${this.playerAlias} received ${clearSignal} and moved into the red zone.`,
            );
        }

        return true;
    }

    private startInitialMovement(state: ZoneState): void {
        if (this.bruteForceMethod) {
            this.startMovement(state, UltraSpeaker_LW.safeX, UltraSpeaker_LW.safeY, "");
        } else if (LoneWolf.isArmyPlayer(this.getZoneOwner(1))) {
            this.startMovement(state, UltraSpeaker_LW.redX, UltraSpeaker_LW.redY, "");
        } else {
            this.startMovement(state, UltraSpeaker_LW.safeX, UltraSpeaker_LW.safeY, "");
        }
    }

    private restoreZonePositionAfterDeath(state: ZoneState, fightAttempt: number, equalizeCycle: number): void {
        state.moving = false;
        state.arrivalSignal = "";
        state.confirmMovementAt = 0;
        state.waitingForSanctityCycle = 0;
        state.waitingForClearCycle = 0;

        if (this.bruteForceMethod) {
            this.startMovement(state, UltraSpeaker_LW.safeX, UltraSpeaker_LW.safeY, "");
            return;
        }

        const nextCycle = equalizeCycle + 1;
        if (!LoneWolf.isArmyPlayer(this.getZoneOwner(nextCycle))) {
            this.startMovement(state, UltraSpeaker_LW.safeX, UltraSpeaker_LW.safeY, "");
            return;
        }

        if (equalizeCycle === 0) {
            this.startMovement(state, UltraSpeaker_LW.redX, UltraSpeaker_LW.redY, "");
            return;
        }

        const clearSignal = this.getZoneClearSignal(fightAttempt, equalizeCycle);
        const clearOwner = this.getZoneOwner(equalizeCycle);
        if (LoneWolf.hasArmySignal(clearSignal, clearOwner)) {
            this.startMovement(state, UltraSpeaker_LW.redX, UltraSpeaker_LW.redY, "");
        } else {
            this.startMovement(state, UltraSpeaker_LW.safeX, UltraSpeaker_LW.safeY, "");
            state.waitingForClearCycle = equalizeCycle;
        }
    }

    private startMovement(state: ZoneState, x: number, y: number, arrivalSignal: string): void {
        state.moving = true;
        state.targetX = x;
        state.targetY = y;
        state.arrivalSignal = arrivalSignal;
        this.issueMovement(state);
    }

    private issueMovement(state: ZoneState): void {
        bot.flash.call("walkTo", state.targetX, state.targetY, UltraSpeaker_LW.walkSpeed);
        state.confirmMovementAt = Date.now() + UltraSpeaker_LW.movementRetryDelay;
    }

    private reportChartFailure(
        fightAttempt: number,
        reason: string,
        localChartInvalid: Ref<boolean>,
        chartFailureSent: Ref<boolean>,
    ): boolean {
        localChartInvalid.value = true;
        Core.logger(`${UltraSpeaker_LW.logPrefix} ${this.playerAlias} chart mismatch: ${reason}`);

        if (chartFailureSent.value) {
            return true;
        }

        const signal = this.getChartFailureSignal(fightAttempt);
        if (!LoneWolf.sendArmySignal(signal)) {
            Core.logger(
                `${UltraSpeaker_LW.logPrefix} ${this.playerAlias} could not send ${signal}.`,
                "ReportChartFailure",
                { messageBox: true, stopBot: true },
            );
            return false;
        }

        chartFailureSent.value = true;
        Core.logger(`${UltraSpeaker_LW.logPrefix} ${this.playerAlias} sent ${signal}.`);
        return true;
    }

    private publishChartResetIfRequested(
        fightAttempt: number,
        chartResetSent: Ref<boolean>,
        nextFailureSender: Ref<number>,
    ): boolean {
        if (!LoneWolf.isArmyPlayer(1) || chartResetSent.value) {
            return true;
        }

        const failureSignal = this.getChartFailureSignal(fightAttempt);
        const failureReported = LoneWolf.hasArmySignal(failureSignal, nextFailureSender.value);
        nextFailureSender.value = (nextFailureSender.value % 4) + 1;
        if (!failureReported) {
            return true;
        }

        const signal = this.getChartResetSignal(fightAttempt);
        if (!LoneWolf.sendArmySignal(signal)) {
            Core.logger(
                `${UltraSpeaker_LW.logPrefix} playerOne could not send ${signal}.`,
                "PublishChartResetIfRequested",
                { messageBox: true, stopBot: true },
            );
            return false;
        }

        chartResetSent.value = true;
        Core.logger(`${UltraSpeaker_LW.logPrefix} playerOne sent ${signal}.`);
        return true;
    }

    private hasChartResetSignal(fightAttempt: number): boolean {
        return LoneWolf.hasArmySignal(this.getChartResetSignal(fightAttempt), 1);
    }

    private maintainArchPaladinRighteousSeal(skillFourQueued: Ref<boolean>): void {
        if (!LoneWolf.isArmyPlayer(this.getArchPaladinPlayer())) {
            return;
        }

        const righteousSeal = bot.target.getAura(UltraSpeaker_LW.righteousSealAura);
        if (righteousSeal == null) {
            skillFourQueued.value = false;
            return;
        }

        if (skillFourQueued.value || LoneWolf.hasPendingPrioritySkill()) {
            return;
        }

        const remaining = righteousSeal.expiresAt - Date.now();
        if (remaining <= 0 || remaining > UltraSpeaker_LW.righteousSealSkillFourWindow) {
            return;
        }

        LoneWolf.requestPrioritySkill(4);
        skillFourQueued.value = true;
        Core.logger(`${UltraSpeaker_LW.logPrefix} ${this.playerAlias} queued skill 4 for Righteous Seal.`);
    }

    private handleFightReset(fightAttempt: number): boolean {
        this.stopFightSystems();
        bot.combat.cancelTarget();

        while (!bot.shouldExit && !bot.player.alive) {
            LoneWolf.shouldResetFight(fightAttempt);
            bot.sleep(UltraSpeaker_LW.fightPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightAttempt);
        Core.jump(UltraSpeaker_LW.safeCell, UltraSpeaker_LW.safePad);

        if (!this.isInSafeRoom()) {
            Core.logger(
                `${UltraSpeaker_LW.logPrefix} ${this.playerAlias} could not reach the safe room after reset.`,
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
                `${UltraSpeaker_LW.logPrefix} failed after ${UltraSpeaker_LW.maxFightAttempts} fight attempts.`,
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
            `${UltraSpeaker_LW.logPrefix} failed after ${UltraSpeaker_LW.maxFightAttempts} fight attempts.`,
            "RunFightAttempts",
            { messageBox: true, stopBot: true },
        );
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

    private getSectionSteps(section: number): SpeakerStep[] {
        if (this.usesPay2WinComposition()) {
            return section === 0
                ? UltraSpeaker_LW.pay2WinOpeningSteps
                : section === 1
                  ? UltraSpeaker_LW.pay2WinSectionOneSteps
                  : section === 2
                    ? UltraSpeaker_LW.pay2WinSectionTwoSteps
                    : section === 3
                      ? UltraSpeaker_LW.pay2WinSectionThreeSteps
                      : section === 4
                        ? UltraSpeaker_LW.pay2WinSectionFourSteps
                        : [];
        }

        return section === 0
            ? UltraSpeaker_LW.openingSteps
            : section === 1 || section === 3
              ? UltraSpeaker_LW.sectionOneSteps
              : section === 2 || section === 4
                ? UltraSpeaker_LW.sectionTwoSteps
                : [];
    }

    private getSectionStepCount(section: number): number {
        return this.getSectionSteps(section).length;
    }

    private getZoneOwner(cycle: number): number {
        const zoneOwners =
            this.armyComposition === ArmyComposition.Pay2Win
                ? UltraSpeaker_LW.pay2WinZoneOwners
                : this.armyComposition === ArmyComposition.Fast
                  ? UltraSpeaker_LW.pay2WinZoneOwners
                  : UltraSpeaker_LW.zoneOwners;
        return zoneOwners[(cycle - 1) % zoneOwners.length];
    }

    private getArchPaladinPlayer(): number {
        return this.armyComposition === ArmyComposition.Pay2Win
            ? 4
            : this.armyComposition === ArmyComposition.Fast
              ? 4
              : 3;
    }

    private isTaunter(): boolean {
        return !this.usesPay2WinComposition() || !LoneWolf.isArmyPlayer(1);
    }

    private usesPay2WinComposition(): boolean {
        return this.armyComposition === ArmyComposition.Pay2Win || this.armyComposition === ArmyComposition.Fast;
    }

    private isAtCoordinate(x: number, y: number): boolean {
        return (
            Math.abs(bot.player.x - x) <= UltraSpeaker_LW.coordinateTolerance &&
            Math.abs(bot.player.y - y) <= UltraSpeaker_LW.coordinateTolerance
        );
    }

    private isInBossRoom(): boolean {
        return bot.player.cell === UltraSpeaker_LW.bossCell && bot.player.pad === UltraSpeaker_LW.bossPad;
    }

    private isInSafeRoom(): boolean {
        return bot.player.cell?.toLowerCase() === UltraSpeaker_LW.safeCell?.toLowerCase();
    }

    private getWarningName(warning: string): string {
        return warning === UltraSpeaker_LW.truthMessage
            ? "Truth"
            : warning === UltraSpeaker_LW.listenMessage
              ? "Listen"
              : "Unknown";
    }

    private getPortionName(section: number): string {
        return section === 0 ? "Opening" : `Section ${section}`;
    }

    private getZoneClearSignal(fightAttempt: number, cycle: number): string {
        return `SPEAKER_ZONE_${fightAttempt}_${cycle}_CLEAR`;
    }

    private getChartFailureSignal(fightAttempt: number): string {
        return `SPEAKER_CHART_FAILURE_${fightAttempt}`;
    }

    private getChartResetSignal(fightAttempt: number): string {
        return `SPEAKER_CHART_RESET_${fightAttempt}`;
    }

    private getClassPreset(): ClassPreset {
        if (LoneWolf.isArmyPlayer(1)) {
            if (this.armyComposition === ArmyComposition.Fast) {
                return LoneWolf.martialArtist();
            }

            if (this.armyComposition === ArmyComposition.Pay2Win) {
                return LoneWolf.guardian();
            }

            const preset = this.usesReliableComposition() ? LoneWolf.verusDoomKnight() : LoneWolf.legionRevenant();
            preset.capeEnhancement = CapeSpecial.Penitence;

            if (!this.usesReliableComposition()) {
                preset.helmEnhancement = HelmSpecial.None;
            }

            return preset;
        }

        if (LoneWolf.isArmyPlayer(2)) {
            const preset = LoneWolf.stoneCrusher();
            preset.capeEnhancement =
                this.armyComposition === ArmyComposition.Fast ? CapeSpecial.Absolution : CapeSpecial.Penitence;
            preset.elixir = "Divine Elixir";
            return preset;
        }

        if (LoneWolf.isArmyPlayer(3)) {
            if (this.usesPay2WinComposition()) {
                const legionRevenant = LoneWolf.legionRevenant();
                legionRevenant.capeEnhancement = CapeSpecial.Penitence;
                legionRevenant.helmEnhancement = HelmSpecial.None;
                return legionRevenant;
            }

            const preset = LoneWolf.archPaladin();
            preset.capeEnhancement = CapeSpecial.Penitence;

            if (!this.bruteForceMethod) {
                preset.skills = [2, 1];
            }

            return preset;
        }

        if (this.usesPay2WinComposition()) {
            const archPaladin = LoneWolf.archPaladin();
            archPaladin.capeEnhancement = CapeSpecial.Penitence;

            if (!this.bruteForceMethod) {
                archPaladin.skills = [2, 1];
            }

            return archPaladin;
        }

        const lordOfOrder = LoneWolf.lordOfOrder();

        if (!this.bruteForceMethod) {
            lordOfOrder.skills = [2, 3, 1];
        }

        return lordOfOrder;
    }

    private usesReliableComposition(): boolean {
        return this.armyComposition === ArmyComposition.Reliable;
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
        Core.logger(`${UltraSpeaker_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${UltraSpeaker_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${UltraSpeaker_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${UltraSpeaker_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${UltraSpeaker_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${UltraSpeaker_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export class ZoneState {
    moving: boolean = false;
    targetX: number = 0;
    targetY: number = 0;
    arrivalSignal: string = "";
    confirmMovementAt: number = null!;
    waitingForSanctityCycle: number = 0;
    waitingForClearCycle: number = 0;
}

export const scriptOptions = defineScriptOptions(
    "UltraSpeaker_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nPay2Win: Guardian / SC / LR / AP\nFast: Martial Artist / SC / LR / AP",
            choices(ArmyComposition),
            ArmyComposition[ArmyComposition.Default],
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadout.", true),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadout.", true),
        option.bool(
            "BruteForceMethod",
            "Brute Force Method",
            "Keep every player in the safe zone and ignore Equalize movement.",
            false,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new UltraSpeaker_LW();
    bot.skills.stop();
    bot.options.infiniteRange = true;
    LoneWolf.setAntiLag();
    bot.config?.configure();

    try {
        script.run();
    } finally {
        script.stopFightSystems();
    }
}
