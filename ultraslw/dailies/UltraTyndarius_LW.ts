/*
name: Ultra Tyndarius LW
description: Four-player CoreLoneWolf Army script for Ultra Tyndarius.
tags: ultra, tyndarius, army, corelonewolf
*/
// Port of Dailies/UltraTyndarius_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, discard, ref } from "../LWRef";
import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { type ClassPreset, CoreLoneWolf, UltraRunResult } from "../CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Stable = "Stable",
    Reliable = "Reliable",
    Fast = "Fast",
    Pay2Win = "Pay2Win",
    Test = "Test",
    Abyssal = "Abyssal",
}

export enum FightResult {
    Continue = "Continue",
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export class UltraTyndarius_LW {
    private static readonly logPrefix = "Ultra Tyndarius LW";
    private static readonly syncFileName = "UltraTyndarius_LW.sync";
    private static readonly mapName = "ultratyndarius";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly bossCell = "Boss";
    private static readonly bossPad = "Left";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly righteousSealAura = "Righteous Seal";
    private static readonly focusAura = "Focus";
    private static readonly righteousSealSignalPrefix = "RIGHTEOUS_SEAL_READY_";
    private static readonly tauntSignalPrefix = "TYNDARIUS_TAUNT_";
    private static readonly ultraQuestId = 8245;
    private static readonly prerequisiteQuestId = 8243;
    private static readonly prerequisiteQuestName = "Avatar of Fire";
    private static readonly minimumLevel = 61;
    private static readonly firstAddMapId = 1;
    private static readonly mainBossMapId = 2;
    private static readonly secondAddMapId = 3;
    private static readonly focusRefreshMilliseconds = 1500;
    private static readonly fightPollDelay = 150;
    private static readonly respawnPollDelay = 500;
    private static readonly maxFightAttempts = 3;

    private playerAlias: string = "";
    private isTaunter: boolean = false;
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
            LoneWolf.stopSkillEngine();
            this.masterMode = false;
        }

        return this.runResult;
    }

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (!LoneWolf.startArmySync(UltraTyndarius_LW.syncFileName, 4, this.masterMode ? "Setup" : null)) {
            return;
        }

        if (
            !LoneWolf.validateUltraAccess(
                UltraTyndarius_LW.ultraQuestId,
                UltraTyndarius_LW.prerequisiteQuestId,
                UltraTyndarius_LW.prerequisiteQuestName,
                UltraTyndarius_LW.minimumLevel,
                UltraTyndarius_LW.logPrefix,
                this.getClassPreset().className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        const preset = this.getClassPreset();
        this.isTaunter = this.isTaunterRole();

        if (this.isTaunter) {
            preset.combatPotion = null;
        }

        Core.logger(
            `${UltraTyndarius_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        LoneWolf.acceptUltraQuest(UltraTyndarius_LW.ultraQuestId);

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        if (!this.runFightAttempts(preset) || !this.sync("BOSS_DEFEATED")) {
            return;
        }

        LoneWolf.completeUltraQuest(UltraTyndarius_LW.ultraQuestId);

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
        this.runResult = UltraRunResult.Completed;
    }

    private runFightAttempts(preset: ClassPreset): boolean {
        for (
            let fightAttempt = 1;
            fightAttempt <= UltraTyndarius_LW.maxFightAttempts && !bot.shouldExit;
            fightAttempt++
        ) {
            Core.join(
                `${UltraTyndarius_LW.mapName}-${this.privateRoomNumber}`,
                UltraTyndarius_LW.safeCell,
                UltraTyndarius_LW.safePad,
            );

            if (!this.prepareSafeRoom(preset) || !this.sync("FIGHT_READY")) {
                return false;
            }

            const archPaladinPlayerNumber = this.getArchPaladinPlayerNumber();
            if (LoneWolf.isArmyPlayer(archPaladinPlayerNumber)) {
                if (!this.prepareRighteousSeal() || !this.sendRighteousSealSignal(fightAttempt)) {
                    return false;
                }
            } else {
                if (!this.waitForRighteousSealSignal(fightAttempt) || !this.moveToBossRoom(true)) {
                    return false;
                }
            }

            const result = this.fight(preset, fightAttempt);
            if (result === FightResult.Defeated) {
                return true;
            }

            if (result !== FightResult.Reset || !this.handleFightReset(fightAttempt)) {
                return false;
            }

            if (fightAttempt >= UltraTyndarius_LW.maxFightAttempts) {
                this.stopArmyAfterFailedAttempts();
                this.runResult = UltraRunResult.AttemptsExhausted;
                return false;
            }
        }

        return false;
    }

    private validateOptions(): boolean {
        this.armyComposition = this.getUltraOption("UltraTyndariusComposition", "ArmyComposition");
        this.privateRoomNumber = this.getSetupOption("PrivateRoomNumber");
        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} starting setup.`);

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

        if (this.isTaunter) {
            LoneWolf.prepareScrolls(UltraTyndarius_LW.enrageScroll);
        }

        if (bot.shouldExit) {
            return false;
        }

        Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareSafeRoom(preset: ClassPreset): boolean {
        if (this.getSetupOption("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.equipScroll(UltraTyndarius_LW.enrageScroll);
        }

        LoneWolf.genericPrebuff();
        return !bot.shouldExit;
    }

    private prepareRighteousSeal(): boolean {
        Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} starting Righteous Seal preparation.`);

        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                Core.logger(
                    `${UltraTyndarius_LW.logPrefix} ${this.playerAlias} died during Righteous Seal preparation.`,
                );

                while (!bot.shouldExit && !bot.player.alive) {
                    bot.sleep(UltraTyndarius_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    return false;
                }

                Core.logger(
                    `${UltraTyndarius_LW.logPrefix} ${this.playerAlias} respawned and is retrying preparation.`,
                );
            }

            if (!this.moveToBossRoom(true)) {
                return false;
            }

            if (!LoneWolf.isMonsterAlive(UltraTyndarius_LW.mainBossMapId)) {
                return true;
            }

            LoneWolf.maintainTarget(UltraTyndarius_LW.mainBossMapId);

            if (bot.target.getAura(UltraTyndarius_LW.righteousSealAura) != null) {
                Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} confirmed Righteous Seal.`);
                return true;
            }

            if (bot.skills.canUseSkill(3)) {
                bot.skills.useSkill(3);
            }

            bot.sleep(UltraTyndarius_LW.fightPollDelay);
        }

        return !bot.shouldExit;
    }

    private sendRighteousSealSignal(fightAttempt: number): boolean {
        const signal = UltraTyndarius_LW.getRighteousSealSignal(fightAttempt);
        if (!LoneWolf.sendArmySignal(signal)) {
            return false;
        }

        Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} sent ${signal}.`);
        return true;
    }

    private waitForRighteousSealSignal(fightAttempt: number): boolean {
        const signal = UltraTyndarius_LW.getRighteousSealSignal(fightAttempt);
        Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} waiting for ${signal}.`);

        while (!bot.shouldExit) {
            if (LoneWolf.hasArmySignal(signal, this.getArchPaladinPlayerNumber())) {
                Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} received ${signal}.`);
                return true;
            }

            bot.sleep(UltraTyndarius_LW.fightPollDelay);
        }

        return false;
    }

    private static getRighteousSealSignal(fightAttempt: number): string {
        return `${UltraTyndarius_LW.righteousSealSignalPrefix}${fightAttempt}`;
    }

    private moveToBossRoom(useDirectFlash = false): boolean {
        if (bot.player.cell === UltraTyndarius_LW.bossCell && bot.player.pad === UltraTyndarius_LW.bossPad) {
            return true;
        }

        if (useDirectFlash) {
            bot.flash.call("jumpCorrectRoom", UltraTyndarius_LW.bossCell, UltraTyndarius_LW.bossPad, false, false);

            while (
                !bot.shouldExit &&
                (bot.player.cell !== UltraTyndarius_LW.bossCell || bot.player.pad !== UltraTyndarius_LW.bossPad)
            ) {
                bot.sleep(UltraTyndarius_LW.fightPollDelay);
            }
        } else {
            Core.jump(UltraTyndarius_LW.bossCell, UltraTyndarius_LW.bossPad);
        }

        return (
            !bot.shouldExit &&
            bot.player.cell === UltraTyndarius_LW.bossCell &&
            bot.player.pad === UltraTyndarius_LW.bossPad
        );
    }

    private fight(preset: ClassPreset, fightAttempt: number): FightResult {
        const archPaladinPlayerNumber = this.getArchPaladinPlayerNumber();
        const bossTauntPartnerPlayerNumber = this.armyComposition === ArmyComposition.Pay2Win ? 3 : 4;
        if (LoneWolf.isArmyPlayer(archPaladinPlayerNumber)) {
            return this.fightBossTaunter(preset, fightAttempt, true, bossTauntPartnerPlayerNumber);
        }

        if (LoneWolf.isArmyPlayer(bossTauntPartnerPlayerNumber)) {
            return this.fightBossTaunter(preset, fightAttempt, false, archPaladinPlayerNumber);
        }

        if (this.armyComposition === ArmyComposition.Test) {
            return this.fightRightAddThenBoss(preset, fightAttempt, LoneWolf.isArmyPlayer(2));
        }

        if (this.usesFastFightRoles()) {
            return this.fightDamageDealer(
                preset,
                fightAttempt,
                this.armyComposition === ArmyComposition.Pay2Win ? LoneWolf.isArmyPlayer(4) : LoneWolf.isArmyPlayer(3),
            );
        }

        if (!this.usesDefaultFightRoles()) {
            return this.fightDamageDealer(preset, fightAttempt);
        }

        const tauntMapId = LoneWolf.isArmyPlayer(1)
            ? UltraTyndarius_LW.firstAddMapId
            : UltraTyndarius_LW.secondAddMapId;
        return this.fightAddTaunter(preset, fightAttempt, tauntMapId);
    }

    private fightAddTaunter(preset: ClassPreset, fightAttempt: number, tauntMapId: number): FightResult {
        this.startSkillEngine(preset);
        Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} started fighting.`);

        while (!bot.shouldExit) {
            const result = this.recoverFromDeath(fightAttempt, discard());
            if (result !== FightResult.Continue) {
                return this.finishFight(result);
            }

            const immediateTauntAccepted =
                LoneWolf.isMonsterAlive(tauntMapId) && LoneWolf.requestImmediateTaunt(tauntMapId);

            if (!immediateTauntAccepted) {
                LoneWolf.maintainTarget(this.getPriorityTarget());
            }

            bot.sleep(UltraTyndarius_LW.fightPollDelay);
        }

        return this.finishFight(FightResult.Stopped);
    }

    private fightRightAddThenBoss(preset: ClassPreset, fightAttempt: number, tauntLeftAdd: boolean): FightResult {
        this.startSkillEngine(preset);
        Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} started fighting.`);
        let bossLocked = false;

        while (!bot.shouldExit) {
            const result = this.recoverFromDeath(fightAttempt, discard());
            if (result !== FightResult.Continue) {
                return this.finishFight(result);
            }

            const immediateTauntAccepted =
                tauntLeftAdd &&
                LoneWolf.isMonsterAlive(UltraTyndarius_LW.firstAddMapId) &&
                LoneWolf.requestImmediateTaunt(UltraTyndarius_LW.firstAddMapId);

            if (!immediateTauntAccepted) {
                const targetMapId = bossLocked
                    ? UltraTyndarius_LW.mainBossMapId
                    : LoneWolf.isMonsterAlive(UltraTyndarius_LW.secondAddMapId)
                      ? UltraTyndarius_LW.secondAddMapId
                      : UltraTyndarius_LW.mainBossMapId;

                if (targetMapId === UltraTyndarius_LW.mainBossMapId) {
                    bossLocked = true;
                }

                LoneWolf.maintainTarget(targetMapId);
            }

            bot.sleep(UltraTyndarius_LW.fightPollDelay);
        }

        return this.finishFight(FightResult.Stopped);
    }

    private fightDamageDealer(preset: ClassPreset, fightAttempt: number, tauntLeftAdd = false): FightResult {
        this.startSkillEngine(preset);
        Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} started fighting.`);
        let bossLocked = false;

        while (!bot.shouldExit) {
            const result = this.recoverFromDeath(fightAttempt, discard());
            if (result !== FightResult.Continue) {
                return this.finishFight(result);
            }

            const immediateTauntAccepted =
                tauntLeftAdd &&
                LoneWolf.isMonsterAlive(UltraTyndarius_LW.firstAddMapId) &&
                LoneWolf.requestImmediateTaunt(UltraTyndarius_LW.firstAddMapId);

            if (!immediateTauntAccepted) {
                const targetMapId = bossLocked ? UltraTyndarius_LW.mainBossMapId : this.getPriorityTarget();

                if (targetMapId === UltraTyndarius_LW.mainBossMapId) {
                    bossLocked = true;
                }

                LoneWolf.maintainTarget(targetMapId);
            }

            bot.sleep(UltraTyndarius_LW.fightPollDelay);
        }

        return this.finishFight(FightResult.Stopped);
    }

    private fightBossTaunter(
        preset: ClassPreset,
        fightAttempt: number,
        isArchPaladin: boolean,
        partnerPlayerNumber: number,
    ): FightResult {
        this.startSkillEngine(preset);
        Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} started fighting.`);

        let ownsFocusCycle = false;
        let waitingForOwnFocus = isArchPaladin;
        let partnerDeathObserved = false;
        let nextSignalNumber = 1;
        let focusBaseline = this.getFocusExpiry();
        const partnerName = this.getSetupOption<string>(`player${partnerPlayerNumber}`).trim();
        const partnerAlias = UltraTyndarius_LW.getPlayerAlias(partnerPlayerNumber);

        if (isArchPaladin) {
            this.requestBossTaunt(false);
            Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} requested the first boss taunt.`);
        }

        while (!bot.shouldExit) {
            let recovered: boolean = undefined!;
            const result = this.recoverFromDeath(
                fightAttempt,
                ref(
                    () => recovered,
                    (v) => (recovered = v),
                ),
            );
            if (result !== FightResult.Continue) {
                return this.finishFight(result);
            }

            LoneWolf.maintainTarget(UltraTyndarius_LW.mainBossMapId);

            if (recovered) {
                nextSignalNumber = UltraTyndarius_LW.alignSignalNumber(nextSignalNumber, isArchPaladin);
                ownsFocusCycle = false;
                waitingForOwnFocus = true;
                focusBaseline = this.getFocusExpiry();
                this.requestBossTaunt(false);
                Core.logger(
                    `${UltraTyndarius_LW.logPrefix} ${this.playerAlias} owns the next boss taunt after returning.`,
                );
            }

            let partnerDead: boolean = undefined!;

            let partnerInBossRoom: boolean = undefined!;

            const partnerFound = this.tryGetPartnerState(
                partnerName,
                ref(
                    () => partnerDead,
                    (v) => (partnerDead = v),
                ),
                ref(
                    () => partnerInBossRoom,
                    (v) => (partnerInBossRoom = v),
                ),
            );

            if (partnerFound && partnerDead && !partnerDeathObserved) {
                const expectedSignal = UltraTyndarius_LW.getTauntSignalName(fightAttempt, nextSignalNumber);
                if (
                    !ownsFocusCycle &&
                    !waitingForOwnFocus &&
                    LoneWolf.hasArmySignal(expectedSignal, partnerPlayerNumber)
                ) {
                    nextSignalNumber++;
                }

                partnerDeathObserved = true;
                ownsFocusCycle = false;
                waitingForOwnFocus = false;
                Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} detected its taunt partner died.`);
            }

            if (partnerDeathObserved) {
                if (partnerFound && !partnerDead && partnerInBossRoom) {
                    partnerDeathObserved = false;
                    nextSignalNumber = UltraTyndarius_LW.alignSignalNumber(nextSignalNumber, !isArchPaladin);
                    ownsFocusCycle = false;
                    waitingForOwnFocus = false;
                    Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} restored alternating boss taunts.`);
                } else {
                    this.requestBossTaunt(true);
                    bot.sleep(UltraTyndarius_LW.fightPollDelay);
                    continue;
                }
            }

            const focus = bot.target.getAura(UltraTyndarius_LW.focusAura);
            if (waitingForOwnFocus && focus != null && focus.expiresAt > focusBaseline) {
                focusBaseline = focus.expiresAt;
                waitingForOwnFocus = false;
                ownsFocusCycle = true;
                Core.logger(
                    `${UltraTyndarius_LW.logPrefix} ${this.playerAlias} confirmed its Focus and owns the taunt cycle.`,
                );
            }

            if (waitingForOwnFocus) {
                if (focus == null) {
                    this.requestBossTaunt(true);
                }
            } else if (ownsFocusCycle && focus == null) {
                ownsFocusCycle = false;
                waitingForOwnFocus = true;
                focusBaseline = 0;
                this.requestBossTaunt(true);
            } else if (
                ownsFocusCycle &&
                focus != null &&
                focus.expiresAt - Date.now() <= UltraTyndarius_LW.focusRefreshMilliseconds
            ) {
                const signal = UltraTyndarius_LW.getTauntSignalName(fightAttempt, nextSignalNumber);
                if (LoneWolf.sendArmySignal(signal)) {
                    Core.logger(
                        `${UltraTyndarius_LW.logPrefix} ${this.playerAlias} sent ${signal} to ${partnerAlias}.`,
                    );
                    nextSignalNumber++;
                    ownsFocusCycle = false;
                }
            } else if (!ownsFocusCycle && !waitingForOwnFocus) {
                const signal = UltraTyndarius_LW.getTauntSignalName(fightAttempt, nextSignalNumber);
                if (LoneWolf.hasArmySignal(signal, partnerPlayerNumber)) {
                    nextSignalNumber++;
                    focusBaseline = this.getFocusExpiry();
                    waitingForOwnFocus = true;
                    this.requestBossTaunt(false);
                    Core.logger(
                        `${UltraTyndarius_LW.logPrefix} ${this.playerAlias} received ${signal} and requested its scheduled boss taunt.`,
                    );
                }
            }

            bot.sleep(UltraTyndarius_LW.fightPollDelay);
        }

        return this.finishFight(FightResult.Stopped);
    }

    private requestBossTaunt(immediate: boolean): void {
        if (immediate) {
            LoneWolf.requestImmediateTaunt(UltraTyndarius_LW.mainBossMapId);
        } else {
            LoneWolf.requestTaunt(UltraTyndarius_LW.mainBossMapId);
        }
    }

    private static getTauntSignalName(fightAttempt: number, signalNumber: number): string {
        return `${UltraTyndarius_LW.tauntSignalPrefix}${fightAttempt}_${signalNumber}`;
    }

    private static alignSignalNumber(signalNumber: number, senderIsArchPaladin: boolean): number {
        const signalIsArchPaladin = signalNumber % 2 !== 0;
        return signalIsArchPaladin === senderIsArchPaladin ? signalNumber : signalNumber + 1;
    }

    private startSkillEngine(preset: ClassPreset): void {
        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            this.isTaunter,
            UltraTyndarius_LW.logPrefix,
            preset.skillMode,
            undefined,
            !this.isTaunter && this.getSetupOption("UsePotions") ? preset.combatPotion : null,
        );
    }

    private getPriorityTarget(): number {
        if (LoneWolf.isMonsterAlive(UltraTyndarius_LW.secondAddMapId)) {
            return UltraTyndarius_LW.secondAddMapId;
        }

        if (LoneWolf.isMonsterAlive(UltraTyndarius_LW.firstAddMapId)) {
            return UltraTyndarius_LW.firstAddMapId;
        }

        return UltraTyndarius_LW.mainBossMapId;
    }

    private getFightResult(fightAttempt: number): FightResult {
        if (!LoneWolf.isMonsterAlive(UltraTyndarius_LW.mainBossMapId)) {
            return FightResult.Defeated;
        }

        return LoneWolf.shouldResetFight(fightAttempt) ? FightResult.Reset : FightResult.Continue;
    }

    private recoverFromDeath(fightAttempt: number, recovered: Ref<boolean>): FightResult {
        recovered.value = false;

        if (bot.player.alive) {
            return this.getFightResult(fightAttempt);
        }

        Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} died.`);

        while (!bot.shouldExit && !bot.player.alive) {
            if (LoneWolf.shouldResetFight(fightAttempt)) {
                return FightResult.Reset;
            }

            bot.sleep(UltraTyndarius_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return FightResult.Stopped;
        }

        const result = this.getFightResult(fightAttempt);
        if (result !== FightResult.Continue) {
            return result;
        }

        Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} respawned.`);

        if (!this.moveToBossRoom()) {
            return FightResult.Stopped;
        }

        recovered.value = true;
        return FightResult.Continue;
    }

    private tryGetPartnerState(partnerName: string, dead: Ref<boolean>, inBossRoom: Ref<boolean>): boolean {
        dead.value = false;
        inBossRoom.value = false;

        const players = bot.map.players;
        if (players == null) {
            return false;
        }

        for (const player of players) {
            if (!(player.name?.toLowerCase() === partnerName?.toLowerCase())) {
                continue;
            }

            dead.value = player.state === 0;
            inBossRoom.value = !dead.value && player.cell?.toLowerCase() === UltraTyndarius_LW.bossCell?.toLowerCase();
            return true;
        }

        return false;
    }

    private getFocusExpiry(): number {
        return bot.target.getAura(UltraTyndarius_LW.focusAura)?.expiresAt ?? 0;
    }

    private finishFight(result: FightResult): FightResult {
        LoneWolf.stopSkillEngine();

        if (result !== FightResult.Defeated) {
            return result;
        }

        Core.jump(UltraTyndarius_LW.safeCell, UltraTyndarius_LW.safePad);
        Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} confirmed Ultra Tyndarius defeated.`);
        return FightResult.Defeated;
    }

    private handleFightReset(fightAttempt: number): boolean {
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();

        while (!bot.shouldExit && !bot.player.alive) {
            LoneWolf.shouldResetFight(fightAttempt);
            bot.sleep(UltraTyndarius_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightAttempt);
        Core.jump(UltraTyndarius_LW.safeCell, UltraTyndarius_LW.safePad);

        if (!this.isInSafeRoom()) {
            Core.logger(
                `${UltraTyndarius_LW.logPrefix} ${this.playerAlias} could not reach the safe room after reset.`,
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
                `${UltraTyndarius_LW.logPrefix} failed after ${UltraTyndarius_LW.maxFightAttempts} fight attempts.`,
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
            `${UltraTyndarius_LW.logPrefix} failed after ${UltraTyndarius_LW.maxFightAttempts} fight attempts.`,
            "RunFightAttempts",
            { messageBox: true, stopBot: true },
        );
    }

    private isInSafeRoom(): boolean {
        return bot.player.cell?.toLowerCase() === UltraTyndarius_LW.safeCell?.toLowerCase();
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
                ? bot.config!.get<T>("Daily_Ultras", masterOptionName)
                : bot.config!.get<T>(standaloneOptionName)
        )!;
    }

    private getClassPreset(): ClassPreset {
        if (LoneWolf.isArmyPlayer(1) && this.armyComposition === ArmyComposition.Abyssal) {
            return LoneWolf.kathoolAdept(true);
        }

        if (LoneWolf.isArmyPlayer(1)) {
            if (this.armyComposition === ArmyComposition.Pay2Win) {
                return LoneWolf.guardian();
            }

            return this.armyComposition === ArmyComposition.Stable
                ? LoneWolf.kingsEcho()
                : this.armyComposition === ArmyComposition.Reliable
                  ? LoneWolf.verusDoomKnight()
                  : this.armyComposition === ArmyComposition.Fast
                    ? LoneWolf.arcanaInvoker()
                    : LoneWolf.legionRevenant();
        }

        if (LoneWolf.isArmyPlayer(2)) {
            return this.usesFastFightRoles() ? LoneWolf.archPaladin() : LoneWolf.stoneCrusher();
        }

        if (LoneWolf.isArmyPlayer(3)) {
            if (this.usesFastFightRoles()) {
                return LoneWolf.legionRevenant();
            }

            return LoneWolf.archPaladin();
        }

        return LoneWolf.lordOfOrder();
    }

    private usesDefaultFightRoles(): boolean {
        return (
            this.armyComposition === ArmyComposition.Default ||
            this.armyComposition === ArmyComposition.Abyssal ||
            this.armyComposition === ArmyComposition.Reliable
        );
    }

    private usesFastFightRoles(): boolean {
        return this.armyComposition === ArmyComposition.Fast || this.armyComposition === ArmyComposition.Pay2Win;
    }

    private isTaunterRole(): boolean {
        if (this.usesFastFightRoles()) {
            return LoneWolf.isArmyPlayer(2) || LoneWolf.isArmyPlayer(3) || LoneWolf.isArmyPlayer(4);
        }

        return (
            this.usesDefaultFightRoles() ||
            LoneWolf.isArmyPlayer(3) ||
            LoneWolf.isArmyPlayer(4) ||
            (this.armyComposition === ArmyComposition.Test && LoneWolf.isArmyPlayer(2))
        );
    }

    private getArchPaladinPlayerNumber(): number {
        return this.usesFastFightRoles() ? 2 : 3;
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

    private static getPlayerAlias(playerNumber: number): string {
        return playerNumber === 1
            ? "playerOne"
            : playerNumber === 2
              ? "playerTwo"
              : playerNumber === 3
                ? "playerThree"
                : "playerFour";
    }

    private sync(step: string): boolean {
        Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${UltraTyndarius_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${UltraTyndarius_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${UltraTyndarius_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "UltraTyndarius_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nFast: AI / AP / LR / LOO\nPay2Win: Guardian / AP / LR / LOO\nTest: LR / SC / AP / LOO\nAbyssal: Kathool Adept / SC / AP / LOO",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadout.", true),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadout.", true),
    ],
    true,
);

export default function main(): void {
    const script = new UltraTyndarius_LW();
    bot.skills.stop();
    bot.options.infiniteRange = true;
    LoneWolf.setAntiLag();
    bot.config?.configure();

    try {
        script.run();
    } finally {
        LoneWolf.stopSkillEngine();
    }
}
