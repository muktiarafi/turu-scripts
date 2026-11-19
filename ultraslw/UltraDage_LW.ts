/*
name: Ultra Dage LW
description: Four-player CoreLoneWolf Army script for Ultra Dage.
tags: ultra, dage, army, corelonewolf
*/
// Port of UltraDage_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, discard, ref } from "./LWRef";
import { bot, choices, defineScriptOptions, type EventMap, option } from "turu";
import { CapeSpecial, WeaponSpecial } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";
import { type ClassPreset, CoreLoneWolf, SkillEngineMode, UltraRunResult } from "./CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Stable = "Stable",
    Reliable = "Reliable",
    Pay2Win = "Pay2Win",
}

export enum FightResult {
    Continue = "Continue",
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export class UltraDage_LW {
    private static readonly logPrefix = "Ultra Dage LW";
    private static readonly syncFileName = "UltraDage_LW.sync";
    private static readonly mapName = "ultradage";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly bossCell = "Boss";
    private static readonly bossPad = "Right";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly decayScroll = "Scroll of Decay";
    private static readonly mystifyScroll = "Scroll of Mystify";
    private static readonly noxiousDecayAura = "Noxious Decay";
    private static readonly unleashedDoomAura = "Unleashed Doom";
    private static readonly dauntlessAura = "Dauntless";
    private static readonly focusAura = "Focus";
    private static readonly decayMessage = "I possess the full power of the Legion at my disposal.";
    private static readonly ultraQuestId = 8547;
    private static readonly prerequisiteQuestId = 793;
    private static readonly prerequisiteQuestName = "Fail to the King";
    private static readonly minimumLevel = 80;
    private static readonly dageMapId = 1;
    private static readonly focusRefreshMilliseconds = 1500;
    private static readonly fightPollDelay = 150;
    private static readonly respawnPollDelay = 500;
    private static readonly maxFightAttempts = 3;

    private readonly pendingZones: string[] = [];
    // C#'s zoneLock: the zone queue is only touched on the script thread here.
    private playerAlias: string = "";
    private isTaunter: boolean = false;
    private privateRoomNumber: number = 0;
    private armyComposition: ArmyComposition = null!;
    private masterMode: boolean = false;
    private runResult: UltraRunResult = UltraRunResult.Failed;
    private testDauntlessEnabled: boolean = false;

    runFromMaster(): UltraRunResult {
        this.masterMode = true;
        this.runResult = UltraRunResult.Failed;
        bot.skills.stop();
        bot.options.infiniteRange = true;

        try {
            this.run();
        } finally {
            this.stopAttemptSystems();
            this.masterMode = false;
        }

        return this.runResult;
    }

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (!LoneWolf.startArmySync(UltraDage_LW.syncFileName, 4, this.masterMode ? "Setup" : null)) {
            return;
        }

        if (
            !LoneWolf.validateUltraAccess(
                UltraDage_LW.ultraQuestId,
                UltraDage_LW.prerequisiteQuestId,
                UltraDage_LW.prerequisiteQuestName,
                UltraDage_LW.minimumLevel,
                UltraDage_LW.logPrefix,
                this.getClassPreset().className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        this.isTaunter = this.isEnrageTaunter();
        const preset = this.getClassPreset();

        Core.logger(
            `${UltraDage_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );
        LoneWolf.acceptUltraQuest(UltraDage_LW.ultraQuestId);

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        if (!this.runFightAttempts(preset) || !this.sync("BOSS_DEFEATED")) {
            return;
        }

        LoneWolf.completeUltraQuest(UltraDage_LW.ultraQuestId);

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
        this.runResult = UltraRunResult.Completed;
    }

    private runFightAttempts(preset: ClassPreset): boolean {
        for (let fightAttempt = 1; fightAttempt <= UltraDage_LW.maxFightAttempts && !bot.shouldExit; fightAttempt++) {
            Core.join(`${UltraDage_LW.mapName}-${this.privateRoomNumber}`, UltraDage_LW.safeCell, UltraDage_LW.safePad);

            let mystifyMode: boolean = undefined!;

            if (
                !this.prepareSafeRoom(
                    preset,
                    fightAttempt,
                    ref(
                        () => mystifyMode,
                        (v) => (mystifyMode = v),
                    ),
                )
            ) {
                return false;
            }

            this.startZoneListener();

            try {
                if (!this.startDecayDetector(mystifyMode) || !this.sync("FIGHT_READY")) {
                    return false;
                }

                this.startSkillEngine(preset);
                Core.jump(UltraDage_LW.bossCell, UltraDage_LW.bossPad);

                const result = this.fight(fightAttempt, mystifyMode);
                if (result === FightResult.Defeated) {
                    Core.jump(UltraDage_LW.safeCell, UltraDage_LW.safePad);
                    Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} confirmed Ultra Dage defeated.`);
                    return true;
                }

                if (result !== FightResult.Reset) {
                    return false;
                }
            } finally {
                this.stopAttemptSystems();
            }

            if (!this.handleFightReset(fightAttempt)) {
                return false;
            }

            if (fightAttempt >= UltraDage_LW.maxFightAttempts) {
                this.stopArmyAfterFailedAttempts();
                this.runResult = UltraRunResult.AttemptsExhausted;
                return false;
            }
        }

        return false;
    }

    private validateOptions(): boolean {
        this.armyComposition = this.getUltraOption("UltraDageComposition", "ArmyComposition");
        this.privateRoomNumber = this.getSetupOption("PrivateRoomNumber");
        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} starting setup.`);

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

            this.prepareTestDauntlessFallback(preset);
        } else {
            this.detectTestDauntless(preset);
        }

        if (this.getSetupOption("UsePotions")) {
            LoneWolf.preparePotions(preset.tonic, preset.elixir, this.usesFullPotionSet() ? preset.combatPotion : null);
        }

        if (this.isTaunter) {
            LoneWolf.prepareScrolls(UltraDage_LW.enrageScroll);
        } else if (this.isPrimaryDecayHolder()) {
            LoneWolf.prepareScrolls(UltraDage_LW.decayScroll);
        } else if (this.isMystifyHolder()) {
            LoneWolf.prepareScrolls(UltraDage_LW.mystifyScroll);

            LoneWolf.prepareScrolls(UltraDage_LW.decayScroll);
        }

        if (bot.shouldExit) {
            return false;
        }

        this.warnIfHealthVampWeaponIsMissing();
        Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private warnIfHealthVampWeaponIsMissing(): void {
        if (this.isTestDauntlessUser() && this.testDauntlessEnabled) {
            return;
        }

        for (const item of bot.inventory.items) {
            if (!item.equipped || !(item.category?.toLowerCase() === "Weapon"?.toLowerCase())) {
                continue;
            }

            if (item.enhancementPatternId !== WeaponSpecial.Health_Vamp) {
                Core.logger("Health Vamp is not enhanced on the weapon. Ultra Dage will fail.", "Prepare", {
                    messageBox: true,
                });
            }

            return;
        }
    }

    private prepareTestDauntlessFallback(preset: ClassPreset): void {
        if (!this.isTestDauntlessUser()) {
            return;
        }

        this.detectTestDauntless(preset);
        if (this.testDauntlessEnabled || bot.shouldExit) {
            return;
        }

        preset.weaponEnhancement = WeaponSpecial.Health_Vamp;
        preset.weaponEnhancementFallbacks = [];
        LoneWolf.prepareEnhancements(
            preset.baseEnhancement,
            preset.capeEnhancement,
            preset.helmEnhancement,
            preset.weaponEnhancement,
            undefined,
            preset.weaponEnhancementFallbacks,
        );
        this.applyTestDauntlessSkillRules(preset);
        Core.logger(
            `${UltraDage_LW.logPrefix} ${this.playerAlias} did not confirm ${UltraDage_LW.dauntlessAura}; using Health Vamp with the normal Dage skill restriction.`,
        );
    }

    private detectTestDauntless(preset: ClassPreset): void {
        if (!this.isTestDauntlessUser()) {
            return;
        }

        this.testDauntlessEnabled = bot.self.hasActiveAura(UltraDage_LW.dauntlessAura);
        this.applyTestDauntlessSkillRules(preset);

        if (this.testDauntlessEnabled) {
            Core.logger(
                `${UltraDage_LW.logPrefix} ${this.playerAlias} confirmed ${UltraDage_LW.dauntlessAura}; its locked Dage skill is enabled.`,
            );
        }
    }

    private applyTestDauntlessSkillRules(preset: ClassPreset): void {
        if (this.armyComposition === ArmyComposition.Pay2Win && LoneWolf.isArmyPlayer(4)) {
            preset.skills = this.testDauntlessEnabled ? [3, 4, 1, 2] : [4, 1, 2];
            preset.skillMode = this.testDauntlessEnabled ? SkillEngineMode.Simple : SkillEngineMode.ArchFiendNoHealing;
        }
    }

    private prepareSafeRoom(preset: ClassPreset, fightAttempt: number, mystifyMode: Ref<boolean>): boolean {
        mystifyMode.value = false;

        if (this.getSetupOption("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, this.usesFullPotionSet() ? preset.combatPotion : null);
        }

        if (this.isTaunter) {
            LoneWolf.equipScroll(UltraDage_LW.enrageScroll);
        } else if (this.isPrimaryDecayHolder()) {
            LoneWolf.equipScroll(UltraDage_LW.decayScroll);
        } else if (this.isMystifyHolder()) {
            LoneWolf.equipScroll(UltraDage_LW.mystifyScroll);
            mystifyMode.value = bot.inventory.isEquipped(UltraDage_LW.mystifyScroll);

            if (!mystifyMode.value) {
                LoneWolf.equipScroll(UltraDage_LW.decayScroll);
            }

            const modeSignal = mystifyMode.value
                ? UltraDage_LW.getMystifySignal(fightAttempt)
                : UltraDage_LW.getAlternatingDecaySignal(fightAttempt);

            if (!LoneWolf.sendArmySignal(modeSignal)) {
                Core.logger(
                    `${UltraDage_LW.logPrefix} ${this.playerAlias} could not publish the scroll mode.`,
                    "PrepareSafeRoom",
                    { messageBox: true, stopBot: true },
                );
                return false;
            }

            Core.logger(
                `${UltraDage_LW.logPrefix} ${this.playerAlias} selected ${mystifyMode.value ? "Mystify" : "alternating Decay"} mode.`,
            );
        }

        if (bot.shouldExit || !this.sync(`SCROLL_MODE_${fightAttempt}`)) {
            return false;
        }

        if (this.armyComposition === ArmyComposition.Default && !LoneWolf.isArmyPlayer(4)) {
            mystifyMode.value = LoneWolf.hasArmySignal(UltraDage_LW.getMystifySignal(fightAttempt), 4);
        }

        return !bot.shouldExit;
    }

    private startDecayDetector(mystifyMode: boolean): boolean {
        const detectsDecay =
            this.isPrimaryDecayHolder() ||
            (this.armyComposition === ArmyComposition.Default && LoneWolf.isArmyPlayer(4) && !mystifyMode) ||
            (this.armyComposition === ArmyComposition.Pay2Win && LoneWolf.isArmyPlayer(4) && !mystifyMode);

        return !detectsDecay || LoneWolf.startPacketDetector("ct", UltraDage_LW.decayMessage);
    }

    private fight(fightAttempt: number, mystifyMode: boolean): FightResult {
        if (this.isTaunter) {
            return this.fightEnrageTaunter(fightAttempt);
        }

        if (this.isDamageDealer()) {
            return this.fightDamageDealer(fightAttempt);
        }

        return this.fightScrollHolder(fightAttempt, mystifyMode);
    }

    private fightDamageDealer(fightAttempt: number): FightResult {
        let nextDecayDetection = 1;
        let bossObserved = LoneWolf.isMonsterAlive(UltraDage_LW.dageMapId);

        Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} started fighting.`);

        while (!bot.shouldExit) {
            let result = this.getFightResult(
                fightAttempt,
                ref(
                    () => bossObserved,
                    (v) => (bossObserved = v),
                ),
            );
            if (result !== FightResult.Continue) {
                return result;
            }

            result = this.recoverFromDeath(
                fightAttempt,
                ref(
                    () => bossObserved,
                    (v) => (bossObserved = v),
                ),
                ref(
                    () => nextDecayDetection,
                    (v) => (nextDecayDetection = v),
                ),
                discard(),
            );
            if (result !== FightResult.Continue) {
                return result;
            }

            this.drainZoneEvents(true);
            LoneWolf.maintainTarget(UltraDage_LW.dageMapId);
            bot.sleep(UltraDage_LW.fightPollDelay);
        }

        return FightResult.Stopped;
    }

    private fightEnrageTaunter(fightAttempt: number): FightResult {
        const openingOwner = this.isOpeningTauntOwner();
        const partnerPlayerNumber = this.getTauntPartnerPlayerNumber(openingOwner);
        const partnerName = this.getSetupOption<string>(`player${partnerPlayerNumber}`).trim();
        const partnerAlias = UltraDage_LW.getPlayerAlias(partnerPlayerNumber);
        let ownsFocusCycle = false;
        let waitingForOwnFocus = openingOwner;
        let partnerDeathObserved = false;
        let safeHealUsedThisWindow = false;
        let nextSignalNumber = 1;
        let nextDecayDetection = 1;
        let focusBaseline = this.getFocusExpiry();
        let bossObserved = LoneWolf.isMonsterAlive(UltraDage_LW.dageMapId);

        if (openingOwner) {
            this.requestEnrageTaunt();
            Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} requested the first Dage taunt.`);
        }

        Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} started fighting.`);

        while (!bot.shouldExit) {
            let result = this.getFightResult(
                fightAttempt,
                ref(
                    () => bossObserved,
                    (v) => (bossObserved = v),
                ),
            );
            if (result !== FightResult.Continue) {
                return result;
            }

            let recovered: boolean = undefined!;

            result = this.recoverFromDeath(
                fightAttempt,
                ref(
                    () => bossObserved,
                    (v) => (bossObserved = v),
                ),
                ref(
                    () => nextDecayDetection,
                    (v) => (nextDecayDetection = v),
                ),
                ref(
                    () => recovered,
                    (v) => (recovered = v),
                ),
            );
            if (result !== FightResult.Continue) {
                return result;
            }

            if (recovered && this.isSafeHealer()) {
                safeHealUsedThisWindow = true;
            }

            this.drainZoneEvents(true);
            LoneWolf.maintainTarget(UltraDage_LW.dageMapId);

            if (this.isSafeHealer()) {
                this.handleSafeHeal(
                    ref(
                        () => safeHealUsedThisWindow,
                        (v) => (safeHealUsedThisWindow = v),
                    ),
                );
            }

            if (recovered) {
                nextSignalNumber = UltraDage_LW.alignSignalNumber(nextSignalNumber, openingOwner);
                ownsFocusCycle = false;
                waitingForOwnFocus = true;
                focusBaseline = this.getFocusExpiry();
                this.requestEnrageTaunt();
                Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} owns the next Dage taunt after returning.`);
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
                const expectedSignal = UltraDage_LW.getTauntSignal(fightAttempt, nextSignalNumber);
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
                Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} detected its taunt partner died.`);
            }

            if (partnerDeathObserved) {
                if (partnerFound && !partnerDead && partnerInBossRoom) {
                    partnerDeathObserved = false;
                    nextSignalNumber = UltraDage_LW.alignSignalNumber(nextSignalNumber, !openingOwner);
                    ownsFocusCycle = false;
                    waitingForOwnFocus = false;
                    Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} restored alternating Dage taunts.`);
                } else {
                    this.requestImmediateEnrageTaunt();
                    bot.sleep(UltraDage_LW.fightPollDelay);
                    continue;
                }
            }

            const focus = bot.target.getAura(UltraDage_LW.focusAura);
            if (waitingForOwnFocus && focus != null && focus.expiresAt > focusBaseline) {
                focusBaseline = focus.expiresAt;
                waitingForOwnFocus = false;
                ownsFocusCycle = true;
                Core.logger(
                    `${UltraDage_LW.logPrefix} ${this.playerAlias} confirmed its Focus and owns the taunt cycle.`,
                );
            }

            if (waitingForOwnFocus) {
                if (focus == null) {
                    this.requestImmediateEnrageTaunt();
                }
            } else if (ownsFocusCycle && focus == null) {
                ownsFocusCycle = false;
                waitingForOwnFocus = true;
                focusBaseline = 0;
                this.requestImmediateEnrageTaunt();
            } else if (
                ownsFocusCycle &&
                focus != null &&
                focus.expiresAt - Date.now() <= UltraDage_LW.focusRefreshMilliseconds
            ) {
                const signal = UltraDage_LW.getTauntSignal(fightAttempt, nextSignalNumber);
                if (LoneWolf.sendArmySignal(signal)) {
                    Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} sent ${signal} to ${partnerAlias}.`);
                    nextSignalNumber++;
                    ownsFocusCycle = false;
                }
            } else if (!ownsFocusCycle && !waitingForOwnFocus) {
                const signal = UltraDage_LW.getTauntSignal(fightAttempt, nextSignalNumber);
                if (LoneWolf.hasArmySignal(signal, partnerPlayerNumber)) {
                    nextSignalNumber++;
                    focusBaseline = this.getFocusExpiry();
                    waitingForOwnFocus = true;
                    this.requestEnrageTaunt();
                    Core.logger(
                        `${UltraDage_LW.logPrefix} ${this.playerAlias} received ${signal} and requested its scheduled Dage taunt.`,
                    );
                }
            }

            bot.sleep(UltraDage_LW.fightPollDelay);
        }

        return FightResult.Stopped;
    }

    private requestEnrageTaunt(): void {
        LoneWolf.requestTaunt(UltraDage_LW.dageMapId);
    }

    private requestImmediateEnrageTaunt(): void {
        LoneWolf.requestImmediateTaunt(UltraDage_LW.dageMapId);
    }

    private fightScrollHolder(fightAttempt: number, mystifyMode: boolean): FightResult {
        let safeHealUsedThisWindow = false;
        let packetCommandLogged = false;
        let nextDecayDetection = 1;
        let bossObserved = LoneWolf.isMonsterAlive(UltraDage_LW.dageMapId);

        Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} started fighting.`);

        while (!bot.shouldExit) {
            let result = this.getFightResult(
                fightAttempt,
                ref(
                    () => bossObserved,
                    (v) => (bossObserved = v),
                ),
            );
            if (result !== FightResult.Continue) {
                return result;
            }

            let recovered: boolean = undefined!;
            result = this.recoverFromDeath(
                fightAttempt,
                ref(
                    () => bossObserved,
                    (v) => (bossObserved = v),
                ),
                ref(
                    () => nextDecayDetection,
                    (v) => (nextDecayDetection = v),
                ),
                ref(
                    () => recovered,
                    (v) => (recovered = v),
                ),
            );
            if (result !== FightResult.Continue) {
                return result;
            }

            if (recovered) {
                safeHealUsedThisWindow = true;
            }

            this.drainZoneEvents(true);
            LoneWolf.maintainTarget(UltraDage_LW.dageMapId);

            if (this.isSafeHealer()) {
                this.handleSafeHeal(
                    ref(
                        () => safeHealUsedThisWindow,
                        (v) => (safeHealUsedThisWindow = v),
                    ),
                );
            }

            if (this.isMystifyHolder()) {
                if (mystifyMode) {
                    LoneWolf.requestImmediateSkillFive(UltraDage_LW.dageMapId);
                }
            }

            this.handleDecayDetections(
                mystifyMode,
                ref(
                    () => nextDecayDetection,
                    (v) => (nextDecayDetection = v),
                ),
                ref(
                    () => packetCommandLogged,
                    (v) => (packetCommandLogged = v),
                ),
            );

            bot.sleep(UltraDage_LW.fightPollDelay);
        }

        return FightResult.Stopped;
    }

    private handleDecayDetections(
        mystifyMode: boolean,
        nextDetection: Ref<number>,
        packetCommandLogged: Ref<boolean>,
    ): void {
        while (LoneWolf.hasPacketDetection(nextDetection.value)) {
            if (!packetCommandLogged.value) {
                const command = LoneWolf.getPacketDetectorCommand();
                if (command.length > 0) {
                    Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} detected Decay in ${command} packets.`);
                    packetCommandLogged.value = true;
                }
            }

            const cycle = nextDetection.value++;
            const ownsCycle =
                (LoneWolf.isArmyPlayer(2) &&
                    (this.armyComposition === ArmyComposition.Stable || mystifyMode || cycle % 2 !== 0)) ||
                (LoneWolf.isArmyPlayer(4) &&
                    this.armyComposition === ArmyComposition.Default &&
                    !mystifyMode &&
                    cycle % 2 === 0) ||
                (LoneWolf.isArmyPlayer(4) && this.armyComposition === ArmyComposition.Pay2Win && !mystifyMode);

            if (!ownsCycle) {
                continue;
            }

            if (!bot.inventory.isEquipped(UltraDage_LW.decayScroll)) {
                Core.logger(
                    `${UltraDage_LW.logPrefix} ${this.playerAlias} consumed Decay cycle ${cycle} without a cast because ${UltraDage_LW.decayScroll} is not equipped.`,
                );
                continue;
            }

            LoneWolf.requestSkillFive(UltraDage_LW.dageMapId);
            Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} requested Decay for cycle ${cycle}.`);
        }
    }

    private handleSafeHeal(safeHealUsedThisWindow: Ref<boolean>): void {
        const selfAuras = bot.self.auras;
        if (selfAuras == null || selfAuras.length === 0) {
            return;
        }

        if (bot.self.getAura(UltraDage_LW.noxiousDecayAura) != null) {
            safeHealUsedThisWindow.value = false;
            return;
        }

        if (
            safeHealUsedThisWindow.value ||
            !bot.player.alive ||
            !bot.player.hasTarget ||
            bot.player.target?.mapId !== UltraDage_LW.dageMapId ||
            bot.player.target?.hp <= 0 ||
            !bot.skills.canUseSkill(2)
        ) {
            return;
        }

        bot.skills.useSkill(2);
        safeHealUsedThisWindow.value = true;
        Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} used its safe-window heal.`);
    }

    private recoverFromDeath(
        fightAttempt: number,
        bossObserved: Ref<boolean>,
        nextDecayDetection: Ref<number>,
        recovered: Ref<boolean>,
    ): FightResult {
        recovered.value = false;

        if (bot.player.alive) {
            return FightResult.Continue;
        }

        Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} died.`);

        while (!bot.shouldExit && !bot.player.alive) {
            this.drainZoneEvents(false);
            this.advanceDecayDetections(nextDecayDetection);

            if (LoneWolf.shouldResetFight(fightAttempt)) {
                return FightResult.Reset;
            }

            bot.sleep(UltraDage_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return FightResult.Stopped;
        }

        const result = this.getFightResult(fightAttempt, bossObserved);
        if (result !== FightResult.Continue) {
            return result;
        }

        Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} respawned.`);

        if (!this.isInBossRoom()) {
            Core.jump(UltraDage_LW.bossCell, UltraDage_LW.bossPad);
        }

        LoneWolf.maintainTarget(UltraDage_LW.dageMapId);
        recovered.value = true;
        return FightResult.Continue;
    }

    private advanceDecayDetections(nextDetection: Ref<number>): void {
        while (LoneWolf.hasPacketDetection(nextDetection.value)) {
            nextDetection.value++;
        }
    }

    private getFightResult(fightAttempt: number, bossObserved: Ref<boolean>): FightResult {
        if (LoneWolf.isMonsterAlive(UltraDage_LW.dageMapId)) {
            bossObserved.value = true;
        } else if (bossObserved.value) {
            return FightResult.Defeated;
        }

        return LoneWolf.shouldResetFight(fightAttempt) ? FightResult.Reset : FightResult.Continue;
    }

    private startSkillEngine(preset: ClassPreset): void {
        const stableKingsEcho = this.armyComposition === ArmyComposition.Stable && LoneWolf.isArmyPlayer(1);
        const dageVerusDoomKnight =
            (this.armyComposition === ArmyComposition.Reliable && LoneWolf.isArmyPlayer(1)) ||
            (this.armyComposition === ArmyComposition.Pay2Win &&
                LoneWolf.isArmyPlayer(3) &&
                !this.testDauntlessEnabled);

        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            this.isTaunter,
            UltraDage_LW.logPrefix,
            preset.skillMode,
            !stableKingsEcho,
            stableKingsEcho && this.getSetupOption("UsePotions") ? preset.combatPotion : null,
            undefined,
            dageVerusDoomKnight ? 2 : 0,
            dageVerusDoomKnight ? UltraDage_LW.unleashedDoomAura : "",
        );
    }

    private startZoneListener(): void {
        {
            this.pendingZones.splice(0);
        }

        bot.events.off("runToArea", this.onRunToArea);
        bot.events.on("runToArea", this.onRunToArea);
    }

    private stopZoneListener(): void {
        bot.events.off("runToArea", this.onRunToArea);

        {
            this.pendingZones.splice(0);
        }
    }

    private onRunToArea = ({ zone }: EventMap["runToArea"]): void => {
        if (zone !== "A" && zone !== "B" && zone.length !== 0) {
            return;
        }

        {
            this.pendingZones.push(zone);
        }
    };

    private drainZoneEvents(move: boolean): void {
        while (true) {
            let zone: string;
            {
                if (this.pendingZones.length === 0) {
                    return;
                }

                zone = this.pendingZones.shift()!;
            }

            if (!move || !bot.player.alive) {
                continue;
            }

            if (zone === "A") {
                bot.player.walkTo(122, 420);
            } else if (zone === "B") {
                bot.player.walkTo(856, 420);
            } else {
                bot.player.walkTo(500, 420);
            }
        }
    }

    stopAttemptSystems(): void {
        LoneWolf.stopSkillEngine();
        LoneWolf.stopPacketDetector();
        this.stopZoneListener();
    }

    private handleFightReset(fightAttempt: number): boolean {
        bot.combat.cancelTarget();

        while (!bot.shouldExit && !bot.player.alive) {
            LoneWolf.shouldResetFight(fightAttempt);
            bot.sleep(UltraDage_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightAttempt);
        Core.jump(UltraDage_LW.safeCell, UltraDage_LW.safePad);

        if (!this.isInSafeRoom()) {
            Core.logger(
                `${UltraDage_LW.logPrefix} ${this.playerAlias} could not reach the safe room after reset.`,
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
                `${UltraDage_LW.logPrefix} failed after ${UltraDage_LW.maxFightAttempts} fight attempts.`,
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
            `${UltraDage_LW.logPrefix} failed after ${UltraDage_LW.maxFightAttempts} fight attempts.`,
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
            inBossRoom.value = !dead.value && player.cell?.toLowerCase() === UltraDage_LW.bossCell?.toLowerCase();
            return true;
        }

        return false;
    }

    private getFocusExpiry(): number {
        return bot.target.getAura(UltraDage_LW.focusAura)?.expiresAt ?? 0;
    }

    private static alignSignalNumber(signalNumber: number, senderIsOpeningOwner: boolean): number {
        const signalIsOpeningOwner = signalNumber % 2 !== 0;
        return signalIsOpeningOwner === senderIsOpeningOwner ? signalNumber : signalNumber + 1;
    }

    private static getTauntSignal(attempt: number, signalNumber: number): string {
        return `DAGE_TAUNT_${attempt}_${signalNumber}`;
    }

    private static getMystifySignal(attempt: number): string {
        return `DAGE_MYSTIFY_${attempt}`;
    }

    private static getAlternatingDecaySignal(attempt: number): string {
        return `DAGE_ALTERNATING_DECAY_${attempt}`;
    }

    private isInBossRoom(): boolean {
        return bot.player.cell === UltraDage_LW.bossCell && bot.player.pad === UltraDage_LW.bossPad;
    }

    private isInSafeRoom(): boolean {
        return bot.player.cell?.toLowerCase() === UltraDage_LW.safeCell?.toLowerCase();
    }

    private getClassPreset(): ClassPreset {
        let preset: ClassPreset;

        if (LoneWolf.isArmyPlayer(1)) {
            if (this.armyComposition === ArmyComposition.Stable) {
                preset = LoneWolf.kingsEcho();
            } else if (this.armyComposition === ArmyComposition.Reliable) {
                preset = LoneWolf.verusDoomKnight();
            } else if (this.armyComposition === ArmyComposition.Pay2Win) {
                preset = LoneWolf.chronoShadowHunter(false);
            } else {
                preset = LoneWolf.legionRevenant();
                preset.skills = [3, 4, 2, 1];
            }
        } else if (LoneWolf.isArmyPlayer(2)) {
            if (this.armyComposition === ArmyComposition.Pay2Win) {
                preset = LoneWolf.archPaladin();
                preset.skills = [3, 1, 4];
            } else {
                preset = LoneWolf.stoneCrusher();
                preset.skills = [2, 4, 1];
            }
        } else if (LoneWolf.isArmyPlayer(3)) {
            if (this.armyComposition === ArmyComposition.Pay2Win) {
                preset = LoneWolf.verusDoomKnight();
            } else {
                preset = LoneWolf.archPaladin();
                preset.skills = [3, 1, 4];
            }
        } else {
            if (this.armyComposition === ArmyComposition.Pay2Win) {
                preset = LoneWolf.archFiend();
            } else {
                preset = LoneWolf.lordOfOrder();
                preset.skills = [3, 1, 4];
            }
        }

        if (this.isTestDauntlessUser()) {
            preset.weaponEnhancement = WeaponSpecial.Dauntless;
            preset.weaponEnhancementFallbacks = [WeaponSpecial.Health_Vamp];
        } else {
            preset.weaponEnhancement = WeaponSpecial.Health_Vamp;
            preset.weaponEnhancementFallbacks = [];
        }
        preset.capeEnhancement = CapeSpecial.Vainglory;

        if (!this.usesFullPotionSet()) {
            preset.combatPotion = null;
        }

        return preset;
    }

    private isEnrageTaunter(): boolean {
        if (this.armyComposition === ArmyComposition.Pay2Win) {
            return LoneWolf.isArmyPlayer(2) || LoneWolf.isArmyPlayer(3);
        }

        if (this.armyComposition === ArmyComposition.Stable) {
            return LoneWolf.isArmyPlayer(3) || LoneWolf.isArmyPlayer(4);
        }

        return LoneWolf.isArmyPlayer(1) || LoneWolf.isArmyPlayer(3);
    }

    private isOpeningTauntOwner(): boolean {
        if (this.armyComposition === ArmyComposition.Pay2Win) {
            return LoneWolf.isArmyPlayer(2);
        }

        if (this.armyComposition === ArmyComposition.Stable) {
            return LoneWolf.isArmyPlayer(3);
        }

        return LoneWolf.isArmyPlayer(1);
    }

    private getTauntPartnerPlayerNumber(openingOwner: boolean): number {
        if (this.armyComposition === ArmyComposition.Pay2Win) {
            return openingOwner ? 3 : 2;
        }

        if (this.armyComposition === ArmyComposition.Stable) {
            return openingOwner ? 4 : 3;
        }

        return openingOwner ? 3 : 1;
    }

    private isPrimaryDecayHolder(): boolean {
        return this.armyComposition !== ArmyComposition.Pay2Win && LoneWolf.isArmyPlayer(2);
    }

    private isMystifyHolder(): boolean {
        return this.armyComposition !== ArmyComposition.Stable && LoneWolf.isArmyPlayer(4);
    }

    private isDamageDealer(): boolean {
        return (
            LoneWolf.isArmyPlayer(1) &&
            (this.armyComposition === ArmyComposition.Stable || this.armyComposition === ArmyComposition.Pay2Win)
        );
    }

    private isSafeHealer(): boolean {
        return this.armyComposition === ArmyComposition.Pay2Win
            ? LoneWolf.isArmyPlayer(2)
            : LoneWolf.isArmyPlayer(3) || LoneWolf.isArmyPlayer(4);
    }

    private usesFullPotionSet(): boolean {
        return (
            LoneWolf.isArmyPlayer(1) &&
            (this.armyComposition === ArmyComposition.Stable || this.armyComposition === ArmyComposition.Pay2Win)
        );
    }

    private isTestDauntlessUser(): boolean {
        return (
            this.armyComposition === ArmyComposition.Pay2Win && (LoneWolf.isArmyPlayer(3) || LoneWolf.isArmyPlayer(4))
        );
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
        Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${UltraDage_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${UltraDage_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${UltraDage_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "UltraDage_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nPay2Win: CSS / AP / VDK / AF",
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
    const script = new UltraDage_LW();
    bot.skills.stop();
    bot.options.infiniteRange = true;
    LoneWolf.setAntiLag();
    bot.config?.configure();

    try {
        script.run();
    } finally {
        script.stopAttemptSystems();
    }
}
