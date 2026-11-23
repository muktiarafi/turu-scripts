/*
name: Ultra Gramiel LW
description: Four-player CoreLoneWolf Ultra Gramiel script.
tags: ultra, gramiel, weekly, army, corelonewolf
*/
// Port of UltraGramiel_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, ref } from "./LWRef";
import { bot, choices, defineScriptOptions, option } from "turu";
import { CapeSpecial, EnhancementType, HelmSpecial, WeaponSpecial } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";
import { type ClassPreset, CoreLoneWolf, SkillEngineMode, UltraRunResult } from "./CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = 0,
    Optimized = 1,
    Reliable = 2,
    Pay2Win = 3,
    Abyssal,
}

export enum PhaseResult {
    Completed = "Completed",
    Reset = "Reset",
    Stopped = "Stopped",
}

export enum PhaseTwoDetectorState {
    Attacks = "Attacks",
    Liberator = "Liberator",
    ChargeTwo = "ChargeTwo",
    ChargeAttackTwo = "ChargeAttackTwo",
    WaitingForInvulnerableEnd = "WaitingForInvulnerableEnd",
    Finished = "Finished",
}

export class UltraGramiel_LW {
    private static readonly logPrefix = "Ultra Gramiel LW";
    private static readonly syncFileName = "UltraGramiel_LW.sync";
    private static readonly mapName = "ultragramiel";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly fightCell = "r2";
    private static readonly fightPad = "Down";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly packetCommand = "ct";
    private static readonly crystalChargeMessage = "The Grace Crystal prepares a defense shattering attack!";
    private static readonly chargeAnimationMarker = '"animStr":"Charge"';
    private static readonly crystalACasterMarker = '"cInf":"m:2"';
    // C# matches these in GetMonsterAura's raw JSON; Turu's getMonsterAura gives the auras.
    private static readonly safeguardAura = "Safeguard";
    private static readonly graceGivenAura = "Grace Given";
    private static readonly gramielCasterMarker = '"cInf":"m:1"';
    private static readonly attackAnimationMarker = '"animStr":"Attack';
    private static readonly chargeTwoAnimationMarker = '"animStr":"Charge2"';
    private static readonly chargeAttackTwoAnimationMarker = '"animStr":"ChargeAttack2"';
    private static readonly liberatorMarker = "Liberator";
    private static readonly invulnerableAura = "Invulnerable";
    private static readonly ultraQuestId = 10301;
    private static readonly prerequisiteQuestId = 9986;
    private static readonly prerequisiteQuestName = "Isa, Reversed - Realized";
    private static readonly minimumLevel = 80;
    private static readonly gramielMapId = 1;
    private static readonly crystalAMapId = 2;
    private static readonly crystalBMapId = 3;
    private static readonly balanceStartDifference = 20;
    private static readonly balanceStopDifference = 2;
    private static readonly tauntTargetHold = 1500;
    private static readonly fightPollDelay = 100;
    private static readonly respawnPollDelay = 500;
    private static readonly maxFightAttempts = 3;
    private static readonly gramielNukeCount = 3;

    private playerAlias: string = "";
    private privateRoomNumber: number = 0;
    private armyComposition: ArmyComposition = null!;
    private masterMode: boolean = false;
    private runResult: UltraRunResult = UltraRunResult.Failed;

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

        if (!LoneWolf.startArmySync(UltraGramiel_LW.syncFileName, 4, this.masterMode ? "Setup" : null)) {
            return;
        }

        if (
            !LoneWolf.validateUltraAccess(
                UltraGramiel_LW.ultraQuestId,
                UltraGramiel_LW.prerequisiteQuestId,
                UltraGramiel_LW.prerequisiteQuestName,
                UltraGramiel_LW.minimumLevel,
                UltraGramiel_LW.logPrefix,
                this.getClassPreset().className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        const preset = this.getClassPreset();
        preset.combatPotion = null;

        Core.logger(
            `${UltraGramiel_LW.logPrefix} started as ${this.playerAlias} using ${ArmyComposition[this.armyComposition]} composition.`,
        );
        LoneWolf.acceptUltraQuest(UltraGramiel_LW.ultraQuestId);

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        if (!this.runFightAttempts(preset) || !this.sync("BOSS_DEFEATED")) {
            return;
        }

        Core.jump(UltraGramiel_LW.safeCell, UltraGramiel_LW.safePad);
        LoneWolf.completeUltraQuest(UltraGramiel_LW.ultraQuestId);

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
        this.runResult = UltraRunResult.Completed;
    }

    private runFightAttempts(preset: ClassPreset): boolean {
        for (
            let fightAttempt = 1;
            fightAttempt <= UltraGramiel_LW.maxFightAttempts && !bot.shouldExit;
            fightAttempt++
        ) {
            Core.join(
                `${UltraGramiel_LW.mapName}-${this.privateRoomNumber}`,
                UltraGramiel_LW.safeCell,
                UltraGramiel_LW.safePad,
            );

            if (!this.prepareSafeRoom(preset) || !this.startCrystalPacketDetector()) {
                return false;
            }

            if (!this.sync("FIGHT_READY")) {
                return false;
            }

            Core.jump(UltraGramiel_LW.fightCell, UltraGramiel_LW.fightPad);

            let result = this.fightPhaseOne(preset, fightAttempt);
            if (result === PhaseResult.Completed) {
                result = this.fightPhaseTwo(preset, fightAttempt);
                if (result === PhaseResult.Completed) {
                    return true;
                }
            }

            if (result !== PhaseResult.Reset || !this.handleFightReset(fightAttempt)) {
                return false;
            }

            if (fightAttempt >= UltraGramiel_LW.maxFightAttempts) {
                this.stopArmyAfterFailedAttempts();
                this.runResult = UltraRunResult.AttemptsExhausted;
                return false;
            }
        }

        return false;
    }

    private validateOptions(): boolean {
        // Turu: a choice option is read back as its member name ("Stable"), not the enum's number, so
        // look the member up; comparing the name with the numeric members never matched.
        this.armyComposition =
            ArmyComposition[
                this.getUltraOption<string>(
                    "UltraGramielComposition",
                    "ArmyComposition",
                ) as keyof typeof ArmyComposition
            ] ?? ArmyComposition.Default;
        this.privateRoomNumber = this.getSetupOption("PrivateRoomNumber");
        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${UltraGramiel_LW.logPrefix} ${this.playerAlias} starting setup.`);

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
                this.isShamanPlayer(),
                preset.weaponEnhancementFallbacks,
            );
        }

        if (this.getSetupOption("UsePotions")) {
            LoneWolf.preparePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        LoneWolf.prepareScrolls(UltraGramiel_LW.enrageScroll);

        if (bot.shouldExit) {
            return false;
        }

        Core.logger(`${UltraGramiel_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareSafeRoom(preset: ClassPreset): boolean {
        if (this.getSetupOption("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        LoneWolf.equipScroll(UltraGramiel_LW.enrageScroll);
        LoneWolf.genericPrebuff();
        return !bot.shouldExit;
    }

    private startCrystalPacketDetector(): boolean {
        if (
            LoneWolf.startPacketDetector(UltraGramiel_LW.packetCommand, [
                UltraGramiel_LW.crystalChargeMessage,
                UltraGramiel_LW.chargeAnimationMarker,
                UltraGramiel_LW.crystalACasterMarker,
            ])
        ) {
            return true;
        }

        Core.logger("The crystal packet detector could not be started.", "RunFightAttempts", {
            messageBox: true,
            stopBot: true,
        });
        return false;
    }

    private fightPhaseOne(preset: ClassPreset, fightAttempt: number): PhaseResult {
        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            true,
            UltraGramiel_LW.logPrefix,
            this.isShamanPlayer() ? SkillEngineMode.Simple : preset.skillMode,
            undefined,
            undefined,
            undefined,
            this.isReliableVerusDoomKnight() ? 4 : 0,
            undefined,
            undefined,
            undefined,
            this.isReliableVerusDoomKnight() ? "Safeguard" : "",
        );
        Core.logger(`${UltraGramiel_LW.logPrefix} ${this.playerAlias} started Phase 1.`);

        let nextDetection = 1;
        let emergencyTarget = 0;
        let crystalBalancing = false;
        let crystalsObserved = false;
        let safeguardActive = false;
        let tauntTargetUntil = 0;
        let shamanOpeningSkillFourQueued = false;
        let shamanSafeguardSkillFourQueued = false;

        while (!bot.shouldExit) {
            let crystalAHealth = LoneWolf.getMonsterHP(UltraGramiel_LW.crystalAMapId);
            let crystalBHealth = LoneWolf.getMonsterHP(UltraGramiel_LW.crystalBMapId);

            if (LoneWolf.shouldResetFight(fightAttempt)) {
                return this.finishPhaseOne(PhaseResult.Reset);
            }

            if (!bot.player.alive) {
                Core.logger(`${UltraGramiel_LW.logPrefix} ${this.playerAlias} died.`);
                crystalBalancing = false;
                safeguardActive = false;
                tauntTargetUntil = 0;

                while (!bot.shouldExit && !bot.player.alive) {
                    if (LoneWolf.shouldResetFight(fightAttempt)) {
                        return this.finishPhaseOne(PhaseResult.Reset);
                    }

                    bot.sleep(UltraGramiel_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    break;
                }

                crystalAHealth = LoneWolf.getMonsterHP(UltraGramiel_LW.crystalAMapId);
                crystalBHealth = LoneWolf.getMonsterHP(UltraGramiel_LW.crystalBMapId);

                if (LoneWolf.shouldResetFight(fightAttempt)) {
                    return this.finishPhaseOne(PhaseResult.Reset);
                }

                Core.logger(`${UltraGramiel_LW.logPrefix} ${this.playerAlias} respawned.`);

                if (!this.isInFightRoom()) {
                    Core.jump(UltraGramiel_LW.fightCell, UltraGramiel_LW.fightPad);
                }

                this.advanceDetections(
                    ref(
                        () => nextDetection,
                        (v) => (nextDetection = v),
                    ),
                );
                continue;
            }

            if (!crystalsObserved) {
                if (crystalAHealth > 0 && crystalBHealth > 0) {
                    crystalsObserved = true;
                    Core.logger(`${UltraGramiel_LW.logPrefix} ${this.playerAlias} observed both Grace Crystals.`);
                } else {
                    bot.sleep(UltraGramiel_LW.fightPollDelay);
                    continue;
                }
            }

            if (crystalAHealth <= 0 && crystalBHealth <= 0) {
                break;
            }

            const bothCrystalsAlive = crystalAHealth > 0 && crystalBHealth > 0;

            this.handleCrystalDetections(
                bothCrystalsAlive,
                ref(
                    () => nextDetection,
                    (v) => (nextDetection = v),
                ),
                ref(
                    () => tauntTargetUntil,
                    (v) => (tauntTargetUntil = v),
                ),
            );

            const shamanSkillFourPending = this.isShamanPlayer() && LoneWolf.hasPendingTargetedPrioritySkill();
            if (!shamanSkillFourPending) {
                this.maintainPhaseOneTarget(
                    crystalAHealth,
                    crystalBHealth,
                    ref(
                        () => crystalBalancing,
                        (v) => (crystalBalancing = v),
                    ),
                    ref(
                        () => safeguardActive,
                        (v) => (safeguardActive = v),
                    ),
                    tauntTargetUntil,
                    ref(
                        () => emergencyTarget,
                        (v) => (emergencyTarget = v),
                    ),
                );
            }

            this.maintainPhaseOneShamanSkillFour(
                bothCrystalsAlive,
                safeguardActive,
                tauntTargetUntil,
                ref(
                    () => shamanOpeningSkillFourQueued,
                    (v) => (shamanOpeningSkillFourQueued = v),
                ),
                ref(
                    () => shamanSafeguardSkillFourQueued,
                    (v) => (shamanSafeguardSkillFourQueued = v),
                ),
            );

            bot.sleep(UltraGramiel_LW.fightPollDelay);
        }

        if (bot.shouldExit) {
            return this.finishPhaseOne(PhaseResult.Stopped);
        }

        Core.logger(`${UltraGramiel_LW.logPrefix} ${this.playerAlias} confirmed both Grace Crystals defeated.`);
        return this.finishPhaseOne(PhaseResult.Completed);
    }

    private fightPhaseTwo(preset: ClassPreset, fightAttempt: number): PhaseResult {
        const normalSkills = this.getPhaseTwoSkills(preset);
        LoneWolf.startSkillEngine(
            normalSkills,
            this.playerAlias,
            true,
            UltraGramiel_LW.logPrefix,
            preset.skillMode,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            this.isPay2WinGuardian() ? 4 : 0,
            this.isPay2WinGuardian() ? UltraGramiel_LW.invulnerableAura : "",
        );

        Core.logger(`${UltraGramiel_LW.logPrefix} ${this.playerAlias} started Phase 2.`);

        let graceGivenObserved = false;
        let gramielObserved = false;
        let nukeCycle = 1;
        let nextAttack = 1;
        const ownedAttack = this.getPhaseTwoTauntAttack();
        let detectorState = PhaseTwoDetectorState.Attacks;
        let damageHold = false;
        let guardianHealingMode = false;
        let shamanInvulnerableSkillThreeBlocked = false;

        while (!bot.shouldExit) {
            if (LoneWolf.shouldResetFight(fightAttempt)) {
                return this.finishPhaseTwo(PhaseResult.Reset);
            }

            if (!bot.player.alive) {
                Core.logger(`${UltraGramiel_LW.logPrefix} ${this.playerAlias} died during Phase 2.`);

                while (!bot.shouldExit && !bot.player.alive) {
                    if (LoneWolf.shouldResetFight(fightAttempt)) {
                        return this.finishPhaseTwo(PhaseResult.Reset);
                    }

                    bot.sleep(UltraGramiel_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    break;
                }

                if (LoneWolf.shouldResetFight(fightAttempt)) {
                    return this.finishPhaseTwo(PhaseResult.Reset);
                }

                Core.logger(`${UltraGramiel_LW.logPrefix} ${this.playerAlias} respawned during Phase 2.`);

                if (!this.isInFightRoom()) {
                    Core.jump(UltraGramiel_LW.fightCell, UltraGramiel_LW.fightPad);
                }
            }

            const gramielHealth = LoneWolf.getMonsterHP(UltraGramiel_LW.gramielMapId);
            if (gramielHealth > 0) {
                gramielObserved = true;
            } else if (gramielObserved) {
                Core.logger(`${UltraGramiel_LW.logPrefix} ${this.playerAlias} confirmed Gramiel defeated.`);
                return this.finishPhaseTwo(PhaseResult.Completed);
            }

            if (damageHold) {
                if (
                    !bot.player.hasTarget ||
                    bot.player.target?.mapId !== UltraGramiel_LW.gramielMapId ||
                    bot.player.target?.hp <= 0
                ) {
                    LoneWolf.maintainTarget(UltraGramiel_LW.gramielMapId);
                }

                bot.combat.cancelAutoAttack();
            } else {
                LoneWolf.maintainTarget(UltraGramiel_LW.gramielMapId);
            }

            if (this.isShamanPlayer()) {
                const gramielInvulnerable = bot.target
                    .getMonsterAura(UltraGramiel_LW.gramielMapId)
                    .some((aura) => aura.name === UltraGramiel_LW.invulnerableAura);

                if (gramielInvulnerable && !shamanInvulnerableSkillThreeBlocked) {
                    LoneWolf.setShamanSkillThreeEnabled(false);
                    shamanInvulnerableSkillThreeBlocked = true;
                    Core.logger(
                        `${UltraGramiel_LW.logPrefix} playerOne disabled skill 3 while Gramiel has Invulnerable.`,
                    );
                } else if (!gramielInvulnerable && shamanInvulnerableSkillThreeBlocked) {
                    LoneWolf.setShamanSkillThreeEnabled(true);
                    shamanInvulnerableSkillThreeBlocked = false;
                    Core.logger(
                        `${UltraGramiel_LW.logPrefix} playerOne restored skill 3 after Gramiel's Invulnerable ended.`,
                    );
                }
            }

            if (!graceGivenObserved) {
                if (
                    !bot.target
                        .getMonsterAura(UltraGramiel_LW.gramielMapId)
                        .some((aura) => aura.name === UltraGramiel_LW.graceGivenAura)
                ) {
                    bot.sleep(UltraGramiel_LW.fightPollDelay);
                    continue;
                }

                graceGivenObserved = true;
                if (!this.startPhaseTwoAttackDetector()) {
                    return this.finishPhaseTwo(PhaseResult.Stopped);
                }

                Core.logger(
                    `${UltraGramiel_LW.logPrefix} ${this.playerAlias} detected Grace Given and armed nuke cycle 1.`,
                );
            }

            if (
                !damageHold &&
                (detectorState === PhaseTwoDetectorState.Attacks ||
                    (detectorState === PhaseTwoDetectorState.Liberator && !LoneWolf.hasPacketDetection(1))) &&
                this.getGramielHealthPercentage() <= this.getHealingHoldThreshold(nukeCycle)
            ) {
                if (this.isPay2WinGuardian() || this.suppressPlayerOneDuringHealingHold()) {
                    LoneWolf.setOrdinarySkillsSuppressed(true);
                } else {
                    LoneWolf.setSkillEngineSkills(this.getHealingHoldSkills());
                }

                bot.combat.cancelAutoAttack();
                damageHold = true;
                Core.logger(
                    `${UltraGramiel_LW.logPrefix} ${this.playerAlias} started the nuke cycle ${nukeCycle} healing hold at ${this.getHealingHoldThreshold(nukeCycle)} percent Gramiel HP.`,
                );
            }

            switch (detectorState) {
                case PhaseTwoDetectorState.Attacks:
                    while (LoneWolf.hasPacketDetection(nextAttack)) {
                        const attack = nextAttack++;

                        if (attack === ownedAttack) {
                            LoneWolf.maintainTarget(UltraGramiel_LW.gramielMapId);
                            this.requestGramielTaunt(UltraGramiel_LW.gramielMapId);
                            Core.logger(
                                `${UltraGramiel_LW.logPrefix} ${this.playerAlias} requested Gramiel taunt on nuke cycle ${nukeCycle}, attack ${attack}.`,
                            );
                        }

                        if (attack !== 7) {
                            continue;
                        }

                        if (!this.startLiberatorPacketDetector()) {
                            return this.finishPhaseTwo(PhaseResult.Stopped);
                        }

                        detectorState = PhaseTwoDetectorState.Liberator;
                        Core.logger(
                            `${UltraGramiel_LW.logPrefix} ${this.playerAlias} reached attack 7 and started waiting for Liberator.`,
                        );

                        break;
                    }
                    break;
                case PhaseTwoDetectorState.Liberator:
                    if (!LoneWolf.hasPacketDetection(1)) {
                        break;
                    }
                    if (this.suppressPlayerOneDuringHealingHold()) {
                        LoneWolf.setOrdinarySkillsSuppressed(false);
                    } else if (!this.isPay2WinGuardian()) {
                        LoneWolf.setSkillEngineSkills(normalSkills);
                    }
                    damageHold = false;
                    LoneWolf.maintainTarget(UltraGramiel_LW.gramielMapId);
                    Core.logger(
                        `${UltraGramiel_LW.logPrefix} ${this.playerAlias} detected Liberator in a ${LoneWolf.getPacketDetectorCommand()} packet.`,
                    );
                    if (!this.startChargeTwoPacketDetector()) {
                        return this.finishPhaseTwo(PhaseResult.Stopped);
                    }
                    detectorState = PhaseTwoDetectorState.ChargeTwo;
                    break;
                case PhaseTwoDetectorState.ChargeTwo:
                    if (!LoneWolf.hasPacketDetection(1)) {
                        break;
                    }
                    this.logGramielProtection(nukeCycle);
                    if (!this.startChargeAttackTwoPacketDetector()) {
                        return this.finishPhaseTwo(PhaseResult.Stopped);
                    }
                    detectorState = PhaseTwoDetectorState.ChargeAttackTwo;
                    break;
                case PhaseTwoDetectorState.ChargeAttackTwo:
                    if (!LoneWolf.hasPacketDetection(1)) {
                        break;
                    }
                    bot.sleep(UltraGramiel_LW.fightPollDelay);
                    LoneWolf.stopPacketDetector();
                    Core.logger(
                        `${UltraGramiel_LW.logPrefix} ${this.playerAlias} handled ChargeAttack2 for nuke cycle ${nukeCycle}.`,
                    );
                    detectorState = PhaseTwoDetectorState.WaitingForInvulnerableEnd;
                    break;
                case PhaseTwoDetectorState.WaitingForInvulnerableEnd:
                    if (bot.self.hasActiveAura(UltraGramiel_LW.invulnerableAura)) {
                        break;
                    }
                    Core.logger(
                        `${UltraGramiel_LW.logPrefix} ${this.playerAlias} detected Invulnerable ended after nuke cycle ${nukeCycle}.`,
                    );
                    if (nukeCycle >= UltraGramiel_LW.gramielNukeCount) {
                        LoneWolf.setSkillEngineSkills(normalSkills);
                        damageHold = false;
                        detectorState = PhaseTwoDetectorState.Finished;
                        Core.logger(
                            `${UltraGramiel_LW.logPrefix} ${this.playerAlias} completed all three Gramiel nuke cycles.`,
                        );
                        break;
                    }
                    nukeCycle++;
                    nextAttack = 1;
                    LoneWolf.setSkillEngineSkills(normalSkills);
                    damageHold = false;
                    if (!this.startPhaseTwoAttackDetector()) {
                        return this.finishPhaseTwo(PhaseResult.Stopped);
                    }
                    detectorState = PhaseTwoDetectorState.Attacks;
                    Core.logger(
                        `${UltraGramiel_LW.logPrefix} ${this.playerAlias} armed Gramiel nuke cycle ${nukeCycle}.`,
                    );
                    break;
                case PhaseTwoDetectorState.Finished:
                    break;
            }

            if (this.isPay2WinGuardian()) {
                if (guardianHealingMode !== damageHold) {
                    LoneWolf.setOrdinarySkillsSuppressed(true);
                    if (!LoneWolf.hasPendingAbsolutePriorityTaunt()) {
                        this.restartPhaseTwoSkillEngine(
                            damageHold ? this.getHealingHoldSkills() : normalSkills,
                            damageHold ? SkillEngineMode.Simple : preset.skillMode,
                        );
                        guardianHealingMode = damageHold;
                    }
                } else {
                    LoneWolf.setOrdinarySkillsSuppressed(false);
                }
            }

            bot.sleep(UltraGramiel_LW.fightPollDelay);
        }

        return this.finishPhaseTwo(PhaseResult.Stopped);
    }

    private startPhaseTwoAttackDetector(): boolean {
        return this.startPhaseTwoPacketDetector(
            [UltraGramiel_LW.packetCommand],
            [UltraGramiel_LW.gramielCasterMarker, UltraGramiel_LW.attackAnimationMarker],
            "Attack2/Attack3",
        );
    }

    private startLiberatorPacketDetector(): boolean {
        return this.startPhaseTwoPacketDetector(
            [UltraGramiel_LW.packetCommand],
            [UltraGramiel_LW.liberatorMarker],
            "Liberator",
        );
    }

    private startChargeTwoPacketDetector(): boolean {
        return this.startPhaseTwoPacketDetector(
            [UltraGramiel_LW.packetCommand],
            [UltraGramiel_LW.gramielCasterMarker, UltraGramiel_LW.chargeTwoAnimationMarker],
            "Charge2",
        );
    }

    private startChargeAttackTwoPacketDetector(): boolean {
        return this.startPhaseTwoPacketDetector(
            [UltraGramiel_LW.packetCommand],
            [UltraGramiel_LW.gramielCasterMarker, UltraGramiel_LW.chargeAttackTwoAnimationMarker],
            "ChargeAttack2",
        );
    }

    private startPhaseTwoPacketDetector(commands: string[], markers: string[], detectorName: string): boolean {
        if (LoneWolf.startPacketDetector(commands, markers)) {
            return true;
        }

        Core.logger(`The Phase 2 ${detectorName} packet detector could not be started.`, "FightPhaseTwo", {
            messageBox: true,
            stopBot: true,
        });
        return false;
    }

    private logGramielProtection(nukeCycle: number): void {
        Core.logger(
            bot.self.hasActiveAura(UltraGramiel_LW.invulnerableAura)
                ? `${UltraGramiel_LW.logPrefix} ${this.playerAlias} entered nuke cycle ${nukeCycle} protected by Invulnerable.`
                : `${UltraGramiel_LW.logPrefix} ${this.playerAlias} entered nuke cycle ${nukeCycle} without Invulnerable.`,
        );
    }

    private getPhaseTwoSkills(preset: ClassPreset): number[] {
        return LoneWolf.isArmyPlayer(1) && this.armyComposition === ArmyComposition.Default
            ? [3, 4, 2, 1]
            : preset.skills;
    }

    private getHealingHoldSkills(): number[] {
        if (this.usesPay2WinCompositionBehavior()) {
            if (LoneWolf.isArmyPlayer(1)) {
                return [1];
            }

            if (LoneWolf.isArmyPlayer(2)) {
                return [3];
            }

            if (LoneWolf.isArmyPlayer(3)) {
                return [2];
            }

            return [2];
        }

        return LoneWolf.isArmyPlayer(1) || LoneWolf.isArmyPlayer(2) ? [3] : [2];
    }

    private restartPhaseTwoSkillEngine(skills: number[], mode: SkillEngineMode): void {
        LoneWolf.stopSkillEngine();
        LoneWolf.startSkillEngine(
            skills,
            this.playerAlias,
            true,
            UltraGramiel_LW.logPrefix,
            mode,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            this.isPay2WinGuardian() ? 4 : 0,
            this.isPay2WinGuardian() ? UltraGramiel_LW.invulnerableAura : "",
        );
    }

    private getGramielHealthPercentage(): number {
        const monsters = bot.monsters?.mapMonsters;
        if (monsters == null) {
            return 100;
        }

        for (const monster of monsters) {
            if (monster != null && monster.mapId === UltraGramiel_LW.gramielMapId && monster.maxHp > 0) {
                return (monster.hp * 100) / monster.maxHp;
            }
        }

        return 100;
    }

    private getHealingHoldThreshold(nukeCycle: number): number {
        return nukeCycle === 1 ? 75 : nukeCycle === 2 ? 45 : 15;
    }

    private getPhaseTwoTauntAttack(): number {
        if (LoneWolf.isArmyPlayer(1)) {
            return 1;
        }

        if (LoneWolf.isArmyPlayer(2)) {
            return 3;
        }

        if (LoneWolf.isArmyPlayer(3)) {
            return 5;
        }

        return 7;
    }

    private finishPhaseTwo(result: PhaseResult): PhaseResult {
        LoneWolf.stopPacketDetector();
        LoneWolf.stopSkillEngine();
        return bot.shouldExit ? PhaseResult.Stopped : result;
    }

    private handleCrystalDetections(
        bothCrystalsAlive: boolean,
        nextDetection: Ref<number>,
        tauntTargetUntil: Ref<number>,
    ): void {
        while (LoneWolf.hasPacketDetection(nextDetection.value)) {
            const cycle = nextDetection.value++;
            const ownsCycle = this.ownsTauntCycle(cycle);
            const crystalMapId = this.getAssignedCrystalMapId();

            if (!bothCrystalsAlive || !ownsCycle) {
                continue;
            }

            LoneWolf.maintainTarget(crystalMapId);
            this.requestGramielTaunt(crystalMapId);

            if (
                LoneWolf.isArmyPlayer(2) ||
                LoneWolf.isArmyPlayer(3) ||
                LoneWolf.isArmyPlayer(4) ||
                this.isShamanPlayer() ||
                this.isReliableVerusDoomKnight() ||
                this.isPay2WinGuardian()
            ) {
                tauntTargetUntil.value = Date.now() + UltraGramiel_LW.tauntTargetHold;
            }

            Core.logger(
                `${UltraGramiel_LW.logPrefix} ${this.playerAlias} requested crystal taunt cycle ${cycle} on MapID ${crystalMapId}.`,
            );
        }
    }

    private maintainPhaseOneShamanSkillFour(
        bothCrystalsAlive: boolean,
        safeguardActive: boolean,
        tauntTargetUntil: number,
        openingSkillFourQueued: Ref<boolean>,
        safeguardSkillFourQueued: Ref<boolean>,
    ): void {
        if (!this.isShamanPlayer()) {
            return;
        }

        if (!safeguardActive) {
            safeguardSkillFourQueued.value = false;
        }

        if (
            !bothCrystalsAlive ||
            Date.now() < tauntTargetUntil ||
            LoneWolf.hasPendingTargetedPrioritySkill() ||
            !bot.skills.canUseSkill(4)
        ) {
            return;
        }

        const openingCast = !openingSkillFourQueued.value;
        const safeguardCast = openingSkillFourQueued.value && safeguardActive && !safeguardSkillFourQueued.value;
        if (!openingCast && !safeguardCast) {
            return;
        }

        if (!LoneWolf.requestTargetedPrioritySkill(4, UltraGramiel_LW.gramielMapId, UltraGramiel_LW.gramielMapId)) {
            return;
        }

        if (openingCast) {
            openingSkillFourQueued.value = true;
        } else {
            safeguardSkillFourQueued.value = true;
        }

        Core.logger(
            openingCast
                ? `${UltraGramiel_LW.logPrefix} playerOne queued opening Phase 1 skill 4 on Gramiel.`
                : `${UltraGramiel_LW.logPrefix} playerOne queued Safeguard Phase 1 skill 4 on Gramiel.`,
        );
    }

    private maintainPhaseOneTarget(
        crystalAHealth: number,
        crystalBHealth: number,
        crystalBalancing: Ref<boolean>,
        safeguardActive: Ref<boolean>,
        tauntTargetUntil: number,
        emergencyTarget: Ref<number>,
    ): void {
        if (crystalAHealth <= 0 || crystalBHealth <= 0) {
            const survivingCrystal = crystalAHealth > 0 ? UltraGramiel_LW.crystalAMapId : UltraGramiel_LW.crystalBMapId;

            if (emergencyTarget.value !== survivingCrystal) {
                emergencyTarget.value = survivingCrystal;
                Core.logger(
                    `${UltraGramiel_LW.logPrefix} ${this.playerAlias} focusing surviving Crystal MapID ${survivingCrystal}.`,
                );
            }

            crystalBalancing.value = false;
            safeguardActive.value = false;
            LoneWolf.maintainTarget(survivingCrystal);
            return;
        }

        emergencyTarget.value = 0;
        const assignedCrystal = this.getAssignedCrystalMapId();
        const safeguardAttacker = this.usesDefaultCompositionBehavior()
            ? LoneWolf.isArmyPlayer(2) || LoneWolf.isArmyPlayer(3)
            : true;

        if (safeguardAttacker) {
            const currentSafeguard = bot.target
                .getMonsterAura(UltraGramiel_LW.gramielMapId)
                .some((aura) => aura.name === UltraGramiel_LW.safeguardAura);

            if (currentSafeguard !== safeguardActive.value) {
                safeguardActive.value = currentSafeguard;
                Core.logger(
                    currentSafeguard
                        ? `${UltraGramiel_LW.logPrefix} ${this.playerAlias} detected Safeguard on Gramiel.`
                        : `${UltraGramiel_LW.logPrefix} ${this.playerAlias} detected Safeguard ended.`,
                );
            }

            if (Date.now() < tauntTargetUntil || currentSafeguard) {
                LoneWolf.maintainTarget(Date.now() < tauntTargetUntil ? assignedCrystal : UltraGramiel_LW.gramielMapId);
                return;
            }
        }

        const crystalBalancer =
            this.armyComposition === ArmyComposition.Reliable || this.armyComposition === ArmyComposition.Pay2Win
                ? LoneWolf.isArmyPlayer(2) || LoneWolf.isArmyPlayer(4)
                : this.usesDefaultCompositionBehavior()
                  ? LoneWolf.isArmyPlayer(4)
                  : LoneWolf.isArmyPlayer(1) || LoneWolf.isArmyPlayer(2);
        if (!crystalBalancer) {
            LoneWolf.maintainTarget(assignedCrystal);
            return;
        }

        if (Date.now() < tauntTargetUntil) {
            LoneWolf.maintainTarget(assignedCrystal);
            return;
        }

        const difference = Math.abs(crystalAHealth - crystalBHealth);
        if (!crystalBalancing.value && difference > UltraGramiel_LW.balanceStartDifference) {
            crystalBalancing.value = true;
            Core.logger(
                `${UltraGramiel_LW.logPrefix} ${this.playerAlias} started crystal balancing at ${crystalAHealth}/${crystalBHealth} HP.`,
            );
        }

        if (!crystalBalancing.value) {
            LoneWolf.maintainTarget(assignedCrystal);
            return;
        }

        if (difference <= UltraGramiel_LW.balanceStopDifference) {
            crystalBalancing.value = false;
            Core.logger(
                `${UltraGramiel_LW.logPrefix} ${this.playerAlias} finished crystal balancing at ${crystalAHealth}/${crystalBHealth} HP.`,
            );
            LoneWolf.maintainTarget(assignedCrystal);
            return;
        }

        LoneWolf.maintainTarget(
            crystalAHealth >= crystalBHealth ? UltraGramiel_LW.crystalAMapId : UltraGramiel_LW.crystalBMapId,
        );
    }

    private ownsTauntCycle(cycle: number): boolean {
        const openingOwner = LoneWolf.isArmyPlayer(1) || LoneWolf.isArmyPlayer(3);
        return openingOwner ? cycle % 2 === 1 : cycle % 2 === 0;
    }

    private getAssignedCrystalMapId(): number {
        if (this.usesPay2WinCompositionBehavior()) {
            return LoneWolf.isArmyPlayer(1) || LoneWolf.isArmyPlayer(4)
                ? UltraGramiel_LW.crystalAMapId
                : UltraGramiel_LW.crystalBMapId;
        }

        return LoneWolf.isArmyPlayer(1) || LoneWolf.isArmyPlayer(2)
            ? UltraGramiel_LW.crystalAMapId
            : UltraGramiel_LW.crystalBMapId;
    }

    private advanceDetections(nextDetection: Ref<number>): void {
        while (LoneWolf.hasPacketDetection(nextDetection.value)) {
            nextDetection.value++;
        }
    }

    private finishPhaseOne(result: PhaseResult): PhaseResult {
        LoneWolf.stopPacketDetector();
        LoneWolf.stopSkillEngine();
        return bot.shouldExit ? PhaseResult.Stopped : result;
    }

    private handleFightReset(fightAttempt: number): boolean {
        LoneWolf.stopPacketDetector();
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();

        while (!bot.shouldExit && !bot.player.alive) {
            LoneWolf.shouldResetFight(fightAttempt);
            bot.sleep(UltraGramiel_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightAttempt);
        Core.jump(UltraGramiel_LW.safeCell, UltraGramiel_LW.safePad);

        if (!this.isInSafeRoom()) {
            Core.logger(
                `${UltraGramiel_LW.logPrefix} ${this.playerAlias} could not reach the safe room after reset.`,
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
                `${UltraGramiel_LW.logPrefix} fight failed after ${UltraGramiel_LW.maxFightAttempts} attempts.`,
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
            `${UltraGramiel_LW.logPrefix} fight failed after ${UltraGramiel_LW.maxFightAttempts} attempts.`,
            "RunFightAttempts",
            { messageBox: true, stopBot: true },
        );
    }

    private isInSafeRoom(): boolean {
        return bot.player.cell?.toLowerCase() === UltraGramiel_LW.safeCell?.toLowerCase();
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

    private isInFightRoom(): boolean {
        return bot.player.cell === UltraGramiel_LW.fightCell && bot.player.pad === UltraGramiel_LW.fightPad;
    }

    private usesDefaultCompositionBehavior(): boolean {
        return this.armyComposition === ArmyComposition.Default || this.armyComposition === ArmyComposition.Abyssal;
    }

    private getClassPreset(): ClassPreset {
        if (LoneWolf.isArmyPlayer(1)) {
            if (this.armyComposition === ArmyComposition.Abyssal) {
                const kathool = LoneWolf.kathoolAdept(true);
                kathool.weaponEnhancement = WeaponSpecial.Elysium;
                kathool.helmEnhancement = HelmSpecial.Forge;
                kathool.capeEnhancement = CapeSpecial.Absolution;
                return kathool;
            }

            if (this.usesPay2WinCompositionBehavior()) {
                return LoneWolf.guardian();
            }

            if (this.armyComposition === ArmyComposition.Reliable) {
                return LoneWolf.verusDoomKnight();
            }

            if (this.armyComposition === ArmyComposition.Optimized) {
                const shaman = LoneWolf.shaman();
                shaman.baseEnhancement = EnhancementType.Wizard;
                shaman.weaponEnhancement = WeaponSpecial.Elysium;
                shaman.helmEnhancement = HelmSpecial.None;
                shaman.capeEnhancement = CapeSpecial.Absolution;
                shaman.tonic = "Sage Tonic";
                shaman.elixir = "Potent Malevolence Elixir";
                return shaman;
            }

            const preset = LoneWolf.legionRevenant();
            preset.skills = [3, 4, 2];
            preset.capeEnhancement = CapeSpecial.Penitence;
            return preset;
        }

        if (LoneWolf.isArmyPlayer(2)) {
            return LoneWolf.stoneCrusher();
        }

        if (LoneWolf.isArmyPlayer(3)) {
            const preset = LoneWolf.archPaladin();
            preset.capeEnhancement = CapeSpecial.Penitence;
            return preset;
        }

        return LoneWolf.lordOfOrder();
    }

    private isOptimizedShaman(): boolean {
        return this.armyComposition === ArmyComposition.Optimized && LoneWolf.isArmyPlayer(1);
    }

    private isReliableVerusDoomKnight(): boolean {
        return this.armyComposition === ArmyComposition.Reliable && LoneWolf.isArmyPlayer(1);
    }

    private usesPay2WinCompositionBehavior(): boolean {
        return this.armyComposition === ArmyComposition.Pay2Win;
    }

    private isPay2WinGuardian(): boolean {
        return this.usesPay2WinCompositionBehavior() && LoneWolf.isArmyPlayer(1);
    }

    private suppressPlayerOneDuringHealingHold(): boolean {
        return (
            this.isOptimizedShaman() ||
            this.isReliableVerusDoomKnight() ||
            (this.armyComposition === ArmyComposition.Abyssal && LoneWolf.isArmyPlayer(1))
        );
    }

    private requestGramielTaunt(mapId: number): void {
        LoneWolf.requestAbsolutePriorityTaunt(mapId);
    }

    private isShamanPlayer(): boolean {
        return this.isOptimizedShaman();
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
        Core.logger(`${UltraGramiel_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${UltraGramiel_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${UltraGramiel_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${UltraGramiel_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${UltraGramiel_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${UltraGramiel_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "UltraGramiel_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO\nOptimized: Shaman / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nPay2Win: Guardian / SC / AP / LOO\nAbyssal: Kathool Adept / SC / AP / LOO",
            choices(ArmyComposition),
            ArmyComposition[ArmyComposition.Default],
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned tonic and elixir.", true),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadout.", true),
    ],
    true,
);

export default function main(): void {
    const script = new UltraGramiel_LW();
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
