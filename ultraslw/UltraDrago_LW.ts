/*
name: Ultra Drago LW
description: Four-player CoreLoneWolf Army script for Ultra Drago.
tags: ultra, drago, army, corelonewolf
*/
// Port of UltraDrago_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, discard, ref } from "./LWRef";
import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../core/CoreBots";
import { type ClassPreset, CoreLoneWolf, UltraRunResult } from "./CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Stable = "Stable",
    Reliable = "Reliable",
    Pay2Win = "Pay2Win",
    Abyssal = "Abyssal",
}

export enum FightResult {
    Continue = "Continue",
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export class UltraDrago_LW {
    private static readonly logPrefix = "Ultra Drago LW";
    private static readonly syncFileName = "UltraDrago_LW.sync";
    private static readonly mapName = "ultradrago";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly bossCell = "Boss";
    private static readonly bossPad = "Left";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly focusAura = "Focus";
    private static readonly entryTimestampName = "DRAGO_ENTRY_TIME";
    private static readonly algieTauntSignalPrefix = "ALGIE_TAUNT_";
    private static readonly deneTauntSignalPrefix = "DENIE_TAUNT_";
    private static readonly ultraQuestId = 8397;
    private static readonly prerequisiteQuestId = 8395;
    private static readonly prerequisiteQuestName = "Mahapadma";
    private static readonly minimumLevel = 80;
    private static readonly deneMapId = 1;
    private static readonly dragoMapId = 2;
    private static readonly algieMapId = 3;
    private static readonly entryLeadMilliseconds = 2000;
    private static readonly focusRefreshMilliseconds = 1500;
    private static readonly targetSettleDelay = 50;
    private static readonly fightPollDelay = 150;
    private static readonly respawnPollDelay = 500;
    private static readonly entryTimeoutMilliseconds = 5000;
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

        if (!LoneWolf.startArmySync(UltraDrago_LW.syncFileName, 4, this.masterMode ? "Setup" : null)) {
            return;
        }

        if (
            !LoneWolf.validateUltraAccess(
                UltraDrago_LW.ultraQuestId,
                UltraDrago_LW.prerequisiteQuestId,
                UltraDrago_LW.prerequisiteQuestName,
                UltraDrago_LW.minimumLevel,
                UltraDrago_LW.logPrefix,
                this.getClassPreset().className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        const preset = this.getClassPreset();
        this.isTaunter =
            (this.armyComposition !== ArmyComposition.Stable && this.armyComposition !== ArmyComposition.Pay2Win) ||
            !LoneWolf.isArmyPlayer(1);

        if (this.isTaunter) {
            preset.combatPotion = null;
        }

        Core.logger(
            `${UltraDrago_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        LoneWolf.acceptUltraQuest(UltraDrago_LW.ultraQuestId);

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        if (!this.runFightAttempts(preset) || !this.sync("BOSS_DEFEATED")) {
            return;
        }

        Core.jump(UltraDrago_LW.safeCell, UltraDrago_LW.safePad);
        LoneWolf.completeUltraQuest(UltraDrago_LW.ultraQuestId);

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
        this.runResult = UltraRunResult.Completed;
    }

    private runFightAttempts(preset: ClassPreset): boolean {
        for (let fightAttempt = 1; fightAttempt <= UltraDrago_LW.maxFightAttempts && !bot.shouldExit; fightAttempt++) {
            Core.join(
                `${UltraDrago_LW.mapName}-${this.privateRoomNumber}`,
                UltraDrago_LW.safeCell,
                UltraDrago_LW.safePad,
            );

            if (!this.prepareSafeRoom(preset) || !this.sync("FIGHT_READY")) {
                return false;
            }

            LoneWolf.genericPrebuff();
            if (bot.shouldExit) {
                return false;
            }

            const entryTimestamp = this.getEntryTimestamp(fightAttempt);
            if (entryTimestamp <= 0) {
                return false;
            }

            const initialTargetMapId = this.getInitialTarget();
            LoneWolf.maintainTarget(initialTargetMapId);
            this.startSkillEngine(preset);

            if (!this.waitForEntryTimestamp(entryTimestamp) || !this.aggressiveMoveToBossRoom(initialTargetMapId)) {
                return false;
            }

            const result = this.fight(fightAttempt);
            if (result === FightResult.Defeated) {
                return true;
            }

            if (result !== FightResult.Reset || !this.handleFightReset(fightAttempt)) {
                return false;
            }

            if (fightAttempt >= UltraDrago_LW.maxFightAttempts) {
                this.stopArmyAfterFailedAttempts();
                this.runResult = UltraRunResult.AttemptsExhausted;
                return false;
            }
        }

        return false;
    }

    private validateOptions(): boolean {
        this.armyComposition = this.getUltraOption("UltraDragoComposition", "ArmyComposition");
        this.privateRoomNumber = this.getSetupOption("PrivateRoomNumber");
        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} starting setup.`);

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
            LoneWolf.prepareScrolls(UltraDrago_LW.enrageScroll);
        }

        if (bot.shouldExit) {
            return false;
        }

        Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareSafeRoom(preset: ClassPreset): boolean {
        if (this.getSetupOption("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.equipScroll(UltraDrago_LW.enrageScroll);
        }
        return !bot.shouldExit;
    }

    private getEntryTimestamp(fightAttempt: number): number {
        const timestampName = `${UltraDrago_LW.entryTimestampName}_${fightAttempt}`;
        if (LoneWolf.isArmyPlayer(1)) {
            const timestamp = Date.now() + UltraDrago_LW.entryLeadMilliseconds;

            if (!LoneWolf.sendArmyTimestamp(timestampName, timestamp)) {
                return 0;
            }

            Core.logger(`${UltraDrago_LW.logPrefix} playerOne published the entry timestamp.`);
            return timestamp;
        }

        let entryTimestamp = 0;
        while (!bot.shouldExit && entryTimestamp <= 0) {
            entryTimestamp = LoneWolf.getArmyTimestamp(timestampName, 1);
            if (entryTimestamp <= 0) {
                bot.sleep(UltraDrago_LW.fightPollDelay);
            }
        }

        if (entryTimestamp > 0) {
            Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} received the entry timestamp.`);
        }

        return entryTimestamp;
    }

    private waitForEntryTimestamp(entryTimestamp: number): boolean {
        while (!bot.shouldExit) {
            const remaining = entryTimestamp - Date.now();
            if (remaining <= 0) {
                return true;
            }

            bot.sleep(Math.trunc(Math.min(remaining, UltraDrago_LW.targetSettleDelay)));
        }

        return false;
    }

    private aggressiveMoveToBossRoom(targetMapId: number): boolean {
        if (this.isInBossRoom()) {
            return true;
        }

        bot.combat.attack(targetMapId);
        bot.flash.call("jumpCorrectRoom", UltraDrago_LW.bossCell, UltraDrago_LW.bossPad, false, false);

        if (this.waitForBossRoom(targetMapId)) {
            return true;
        }

        bot.map.jump(UltraDrago_LW.bossCell, UltraDrago_LW.bossPad, false);
        if (this.waitForBossRoom(targetMapId)) {
            return true;
        }

        Core.logger(
            `${UltraDrago_LW.logPrefix} ${this.playerAlias} could not enter the boss room.`,
            "AggressiveMoveToBossRoom",
            { messageBox: true, stopBot: true },
        );
        return false;
    }

    private waitForBossRoom(targetMapId: number): boolean {
        const timeout = Date.now() + UltraDrago_LW.entryTimeoutMilliseconds;

        while (!bot.shouldExit && Date.now() < timeout) {
            if (this.isInBossRoom()) {
                return true;
            }

            bot.combat.attack(targetMapId);
            bot.sleep(UltraDrago_LW.fightPollDelay);
        }

        return this.isInBossRoom();
    }

    private fight(fightAttempt: number): FightResult {
        if (this.armyComposition !== ArmyComposition.Stable && this.armyComposition !== ArmyComposition.Pay2Win) {
            return this.fightGuardPair(fightAttempt);
        }

        if (LoneWolf.isArmyPlayer(1)) {
            return this.fightDamageDealer(fightAttempt);
        }

        if (LoneWolf.isArmyPlayer(4)) {
            return this.fightImmediateAlgieTaunter(fightAttempt);
        }

        return this.fightGuardPair(fightAttempt);
    }

    private fightDamageDealer(fightAttempt: number): FightResult {
        Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} started fighting.`);

        while (!bot.shouldExit) {
            let result = this.getFightResult(fightAttempt);
            if (result !== FightResult.Continue) {
                return this.finishFight(result);
            }

            result = this.recoverFromDeath(fightAttempt, discard());
            if (result !== FightResult.Continue) {
                return this.finishFight(result);
            }

            LoneWolf.maintainTarget(this.getNormalTarget());
            bot.sleep(UltraDrago_LW.fightPollDelay);
        }

        return this.finishFight(FightResult.Stopped);
    }

    private fightImmediateAlgieTaunter(fightAttempt: number): FightResult {
        Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} started fighting.`);

        while (!bot.shouldExit) {
            let result = this.getFightResult(fightAttempt);
            if (result !== FightResult.Continue) {
                return this.finishFight(result);
            }

            result = this.recoverFromDeath(fightAttempt, discard());
            if (result !== FightResult.Continue) {
                return this.finishFight(result);
            }

            const immediateTauntAccepted =
                LoneWolf.isMonsterAlive(UltraDrago_LW.algieMapId) &&
                LoneWolf.requestImmediateTaunt(UltraDrago_LW.algieMapId);

            if (!immediateTauntAccepted) {
                LoneWolf.maintainTarget(this.getNormalTarget());
            }

            bot.sleep(UltraDrago_LW.fightPollDelay);
        }

        return this.finishFight(FightResult.Stopped);
    }

    private fightGuardPair(fightAttempt: number): FightResult {
        const assignedGuardMapId = this.getAssignedGuardMapId();
        const partnerPlayerNumber = this.getPartnerPlayerNumber();
        const openingOwner = this.isOpeningOwner();
        const signalPrefix = this.getTauntSignalPrefix();
        const partnerName = this.getSetupOption<string>(`player${partnerPlayerNumber}`).trim();
        const partnerAlias = UltraDrago_LW.getPlayerAlias(partnerPlayerNumber);

        let pairClosed = false;
        let ownsFocusCycle = false;
        let waitingForOwnFocus = openingOwner;
        let partnerDeathObserved = false;
        let nextSignalNumber = 1;
        let focusBaseline = 0;
        let nextFocusInspection = 0;

        Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} started fighting.`);

        if (openingOwner && LoneWolf.isMonsterAlive(assignedGuardMapId)) {
            focusBaseline = this.beginTauntAcquisition(assignedGuardMapId);
            Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} requested the first guard taunt.`);
        }

        while (!bot.shouldExit) {
            let result = this.getFightResult(fightAttempt);
            if (result !== FightResult.Continue) {
                return this.finishFight(result);
            }

            let recovered: boolean = undefined!;

            result = this.recoverFromDeath(
                fightAttempt,
                ref(
                    () => recovered,
                    (v) => (recovered = v),
                ),
            );
            if (result !== FightResult.Continue) {
                return this.finishFight(result);
            }

            if (!pairClosed && !LoneWolf.isMonsterAlive(assignedGuardMapId)) {
                pairClosed = true;
                ownsFocusCycle = false;
                waitingForOwnFocus = false;
                Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} closed its guard taunt loop.`);
            }

            if (pairClosed) {
                LoneWolf.maintainTarget(this.getNormalTarget());
                bot.sleep(UltraDrago_LW.fightPollDelay);
                continue;
            }

            if (recovered) {
                nextSignalNumber = UltraDrago_LW.alignSignalNumber(nextSignalNumber, openingOwner);
                ownsFocusCycle = false;
                waitingForOwnFocus = true;
                focusBaseline = this.beginTauntAcquisition(assignedGuardMapId);
                Core.logger(
                    `${UltraDrago_LW.logPrefix} ${this.playerAlias} owns the next guard taunt after returning.`,
                );
            }

            if (!waitingForOwnFocus) {
                LoneWolf.maintainTarget(this.getNormalTarget());
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
                const expectedSignal = UltraDrago_LW.getTauntSignalName(signalPrefix, fightAttempt, nextSignalNumber);
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
                Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} detected its taunt partner died.`);
            }

            if (partnerDeathObserved) {
                if (partnerFound && !partnerDead && partnerInBossRoom) {
                    partnerDeathObserved = false;
                    nextSignalNumber = UltraDrago_LW.alignSignalNumber(nextSignalNumber, !openingOwner);
                    ownsFocusCycle = false;
                    waitingForOwnFocus = false;
                    Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} restored alternating guard taunts.`);
                } else {
                    this.requestImmediateGuardTaunt(assignedGuardMapId);
                    bot.sleep(UltraDrago_LW.fightPollDelay);
                    continue;
                }
            }

            if (waitingForOwnFocus) {
                this.selectGuard(assignedGuardMapId);
                const focus = bot.target.getAura(UltraDrago_LW.focusAura);

                if (focus != null && focus.expiresAt > focusBaseline) {
                    focusBaseline = focus.expiresAt;
                    nextFocusInspection = focus.expiresAt - UltraDrago_LW.focusRefreshMilliseconds;
                    waitingForOwnFocus = false;
                    ownsFocusCycle = true;
                    LoneWolf.maintainTarget(this.getNormalTarget());
                    Core.logger(
                        `${UltraDrago_LW.logPrefix} ${this.playerAlias} confirmed its Focus and owns the taunt cycle.`,
                    );
                } else if (focus == null) {
                    this.requestImmediateGuardTaunt(assignedGuardMapId);
                }
            } else if (ownsFocusCycle && Date.now() >= nextFocusInspection) {
                this.selectGuard(assignedGuardMapId);
                const focus = bot.target.getAura(UltraDrago_LW.focusAura);

                if (focus == null) {
                    ownsFocusCycle = false;
                    waitingForOwnFocus = true;
                    focusBaseline = 0;
                    this.requestImmediateGuardTaunt(assignedGuardMapId);
                } else if (focus.expiresAt - Date.now() <= UltraDrago_LW.focusRefreshMilliseconds) {
                    const signal = UltraDrago_LW.getTauntSignalName(signalPrefix, fightAttempt, nextSignalNumber);
                    if (LoneWolf.sendArmySignal(signal)) {
                        Core.logger(
                            `${UltraDrago_LW.logPrefix} ${this.playerAlias} sent ${signal} to ${partnerAlias}.`,
                        );
                        nextSignalNumber++;
                        ownsFocusCycle = false;
                        LoneWolf.maintainTarget(this.getNormalTarget());
                    }
                } else {
                    nextFocusInspection = focus.expiresAt - UltraDrago_LW.focusRefreshMilliseconds;
                    LoneWolf.maintainTarget(this.getNormalTarget());
                }
            } else if (!ownsFocusCycle && !waitingForOwnFocus) {
                const signal = UltraDrago_LW.getTauntSignalName(signalPrefix, fightAttempt, nextSignalNumber);
                if (LoneWolf.hasArmySignal(signal, partnerPlayerNumber)) {
                    nextSignalNumber++;
                    focusBaseline = this.beginTauntAcquisition(assignedGuardMapId);
                    waitingForOwnFocus = true;
                    Core.logger(
                        `${UltraDrago_LW.logPrefix} ${this.playerAlias} received ${signal} and requested its scheduled guard taunt.`,
                    );
                }
            }

            bot.sleep(UltraDrago_LW.fightPollDelay);
        }

        return this.finishFight(FightResult.Stopped);
    }

    private finishFight(result: FightResult): FightResult {
        LoneWolf.stopSkillEngine();

        if (bot.shouldExit || result === FightResult.Stopped) {
            return FightResult.Stopped;
        }

        if (result === FightResult.Defeated) {
            Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} confirmed King Drago defeated.`);
        } else if (result === FightResult.Reset) {
            Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} received the coordinated fight reset.`);
        }

        return result;
    }

    private beginTauntAcquisition(guardMapId: number): number {
        this.selectGuard(guardMapId);
        const baseline = this.getFocusExpiry();
        LoneWolf.requestTaunt(guardMapId);
        return baseline;
    }

    private requestImmediateGuardTaunt(guardMapId: number): void {
        LoneWolf.requestImmediateTaunt(guardMapId);
    }

    private selectGuard(guardMapId: number): void {
        const target = bot.player.target;
        const changed = !bot.player.hasTarget || target?.mapId !== guardMapId || target?.hp <= 0;

        LoneWolf.maintainTarget(guardMapId);
        if (changed) {
            bot.sleep(UltraDrago_LW.targetSettleDelay);
        }
    }

    private getInitialTarget(): number {
        if (
            LoneWolf.isArmyPlayer(3) ||
            ((this.armyComposition === ArmyComposition.Stable || this.armyComposition === ArmyComposition.Pay2Win) &&
                LoneWolf.isArmyPlayer(2))
        ) {
            return UltraDrago_LW.deneMapId;
        }

        return UltraDrago_LW.algieMapId;
    }

    private getNormalTarget(): number {
        const algieAlive = LoneWolf.isMonsterAlive(UltraDrago_LW.algieMapId);
        const deneAlive = LoneWolf.isMonsterAlive(UltraDrago_LW.deneMapId);

        if (algieAlive && deneAlive) {
            if (this.armyComposition === ArmyComposition.Stable || this.armyComposition === ArmyComposition.Pay2Win) {
                return LoneWolf.isArmyPlayer(1) || LoneWolf.isArmyPlayer(4)
                    ? UltraDrago_LW.algieMapId
                    : UltraDrago_LW.deneMapId;
            }

            return LoneWolf.isArmyPlayer(3) ? UltraDrago_LW.deneMapId : UltraDrago_LW.algieMapId;
        }

        if (algieAlive) {
            return UltraDrago_LW.algieMapId;
        }

        if (deneAlive) {
            return UltraDrago_LW.deneMapId;
        }

        return UltraDrago_LW.dragoMapId;
    }

    private getAssignedGuardMapId(): number {
        return LoneWolf.isArmyPlayer(1) || LoneWolf.isArmyPlayer(4)
            ? UltraDrago_LW.algieMapId
            : UltraDrago_LW.deneMapId;
    }

    private getPartnerPlayerNumber(): number {
        if (LoneWolf.isArmyPlayer(1)) {
            return 4;
        }

        if (LoneWolf.isArmyPlayer(4)) {
            return 1;
        }

        if (LoneWolf.isArmyPlayer(3)) {
            return 2;
        }

        return 3;
    }

    private isOpeningOwner(): boolean {
        return LoneWolf.isArmyPlayer(1) || LoneWolf.isArmyPlayer(3);
    }

    private getTauntSignalPrefix(): string {
        return LoneWolf.isArmyPlayer(1) || LoneWolf.isArmyPlayer(4)
            ? UltraDrago_LW.algieTauntSignalPrefix
            : UltraDrago_LW.deneTauntSignalPrefix;
    }

    private static getTauntSignalName(signalPrefix: string, fightAttempt: number, signalNumber: number): string {
        return `${signalPrefix}${fightAttempt}_${signalNumber}`;
    }

    private static alignSignalNumber(signalNumber: number, senderIsOpeningOwner: boolean): number {
        const signalIsOpeningOwner = signalNumber % 2 !== 0;
        return signalIsOpeningOwner === senderIsOpeningOwner ? signalNumber : signalNumber + 1;
    }

    private startSkillEngine(preset: ClassPreset): void {
        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            this.isTaunter,
            UltraDrago_LW.logPrefix,
            preset.skillMode,
            undefined,
            !this.isTaunter && this.getSetupOption("UsePotions") ? preset.combatPotion : null,
        );
    }

    private getFightResult(fightAttempt: number): FightResult {
        if (!LoneWolf.isMonsterAlive(UltraDrago_LW.dragoMapId)) {
            return FightResult.Defeated;
        }

        return LoneWolf.shouldResetFight(fightAttempt) ? FightResult.Reset : FightResult.Continue;
    }

    private recoverFromDeath(fightAttempt: number, recovered: Ref<boolean>): FightResult {
        recovered.value = false;

        if (bot.player.alive) {
            return FightResult.Continue;
        }

        Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} died.`);

        while (!bot.shouldExit && !bot.player.alive) {
            if (LoneWolf.shouldResetFight(fightAttempt)) {
                return FightResult.Reset;
            }

            bot.sleep(UltraDrago_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return FightResult.Stopped;
        }

        const result = this.getFightResult(fightAttempt);
        if (result !== FightResult.Continue) {
            return result;
        }

        Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} respawned.`);

        if (!this.aggressiveMoveToBossRoom(this.getNormalTarget())) {
            return FightResult.Stopped;
        }

        recovered.value = true;
        return FightResult.Continue;
    }

    private handleFightReset(fightAttempt: number): boolean {
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();

        while (!bot.shouldExit && !bot.player.alive) {
            LoneWolf.shouldResetFight(fightAttempt);
            bot.sleep(UltraDrago_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightAttempt);
        Core.jump(UltraDrago_LW.safeCell, UltraDrago_LW.safePad);

        if (!this.isInSafeRoom()) {
            Core.logger(
                `${UltraDrago_LW.logPrefix} ${this.playerAlias} could not reach the safe room after reset.`,
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
                `${UltraDrago_LW.logPrefix} failed after ${UltraDrago_LW.maxFightAttempts} fight attempts.`,
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
            `${UltraDrago_LW.logPrefix} failed after ${UltraDrago_LW.maxFightAttempts} fight attempts.`,
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
            inBossRoom.value = !dead.value && player.cell?.toLowerCase() === UltraDrago_LW.bossCell?.toLowerCase();
            return true;
        }

        return false;
    }

    private getFocusExpiry(): number {
        return bot.target.getAura(UltraDrago_LW.focusAura)?.expiresAt ?? 0;
    }

    private isInBossRoom(): boolean {
        return bot.player.cell === UltraDrago_LW.bossCell && bot.player.pad === UltraDrago_LW.bossPad;
    }

    private isInSafeRoom(): boolean {
        return bot.player.cell?.toLowerCase() === UltraDrago_LW.safeCell?.toLowerCase();
    }

    private getClassPreset(): ClassPreset {
        if (LoneWolf.isArmyPlayer(1) && this.armyComposition === ArmyComposition.Abyssal) {
            return LoneWolf.kathoolAdept(true);
        }

        if (LoneWolf.isArmyPlayer(1)) {
            if (this.armyComposition === ArmyComposition.Stable) {
                return LoneWolf.kingsEcho();
            }

            if (this.armyComposition === ArmyComposition.Pay2Win) {
                return LoneWolf.guardian();
            }

            return this.armyComposition === ArmyComposition.Reliable
                ? LoneWolf.verusDoomKnight()
                : LoneWolf.legionRevenant();
        }

        if (LoneWolf.isArmyPlayer(2)) {
            return LoneWolf.stoneCrusher();
        }

        if (LoneWolf.isArmyPlayer(3)) {
            return LoneWolf.archPaladin();
        }

        return LoneWolf.lordOfOrder();
    }

    private getPlayerAlias(): string {
        return UltraDrago_LW.getPlayerAlias(
            LoneWolf.isArmyPlayer(1) ? 1 : LoneWolf.isArmyPlayer(2) ? 2 : LoneWolf.isArmyPlayer(3) ? 3 : 4,
        );
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
        Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${UltraDrago_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${UltraDrago_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${UltraDrago_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "UltraDrago_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nPay2Win: Guardian / SC / AP / LOO\nAbyssal: Kathool Adept / SC / AP / LOO",
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
    const script = new UltraDrago_LW();
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
