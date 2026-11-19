/*
name: Ascend Eclipse LW
description: Four-player CoreLoneWolf Army script for the AscendEclipse dungeon.
tags: dungeon, ascend eclipse, temple shrine, army, corelonewolf
*/
// Port of Extras/TempleShrine/AscendEclipse_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, ref } from "../../LWRef";
import { bot, choices, defineScriptOptions, option } from "turu";
import { CapeSpecial, WeaponSpecial } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { ClassPreset, CoreLoneWolf } from "../../CoreLoneWolf";
import { CoreTempleShrine, DungeonRecoveryResult } from "./CoreTempleShrine";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Stable = "Stable",
    Pay2Win = "Pay2Win",
}

export class AscendEclipse_LW {
    private static readonly temple: CoreTempleShrine = new CoreTempleShrine(LoneWolf);

    private static readonly logPrefix = "Ascend Eclipse LW";
    private static readonly syncFileName = "AscendEclipse_LW.sync";
    private static readonly mapName = "ascendeclipse";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly riteOfAscension = "Rite of Ascension";
    private static readonly solarFlareAura = "Solar Flare";
    private static readonly daybreakAura = "Daybreak";
    private static readonly gatheringLightAura = "Gathering Light";
    private static readonly righteousSealAura = "Righteous Seal";
    private static readonly roomOneSecondaryAttackMarkers: string[] = [
        '"nam":"Lunar Curse"',
        '"cInf":"m:4"',
        '"animStr":"Attack1"',
    ];
    private static readonly sunsWarmthAura = "Sun's Warmth";
    private static readonly moonlightGazeAura = "Moonlight Gaze";
    private static readonly enterCell = "Enter";
    private static readonly enterPad = "Spawn";
    private static readonly roomOneCell = "r1";
    private static readonly roomOnePad = "Left";
    private static readonly roomTwoCell = "r2";
    private static readonly roomTwoPad = "Left";
    private static readonly finalRoomCell = "r3";
    private static readonly finalRoomPad = "Left";
    private static readonly dailyQuestId = 9305;
    private static readonly enterPrimaryMapId = 1;
    private static readonly enterSecondaryMapId = 2;
    private static readonly roomOnePrimaryMapId = 3;
    private static readonly roomOneSecondaryMapId = 4;
    private static readonly roomTwoSecondaryMapId = 5;
    private static readonly roomTwoPrimaryMapId = 6;
    private static readonly ascendedSolsticeMapId = 7;
    private static readonly ascendedMidnightMapId = 8;
    private static readonly fightPollDelay = 100;
    private static readonly timedAuraTauntSeconds = 8;
    private static readonly tauntTargetHold = 1500;
    private static readonly righteousSealSkillFourWindow = 1000;
    private static readonly balanceMinimumDifference = 4;
    private static readonly balanceMaximumDifference = 8;

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private privateRoomNumber: number = 0;
    private masterMode: boolean = false;
    private masterStarted: boolean = false;
    private masterPreset: ClassPreset | null = null;
    private masterPlayers: string[] = [];
    private masterRunNumber = 1;

    runFromMaster(): boolean {
        try {
            return this.startFromMaster() && this.runOnceFromMaster();
        } finally {
            this.stopFromMaster();
        }
    }

    startFromMaster(): boolean {
        this.masterMode = true;
        bot.skills.stop();
        bot.options.infiniteRange = true;

        let preset: ClassPreset = undefined!;

        let players: string[] = undefined!;

        if (
            !this.prepareLifecycle(
                ref(
                    () => preset,
                    (v) => (preset = v),
                ),
                ref(
                    () => players,
                    (v) => (players = v),
                ),
            )
        ) {
            return false;
        }

        this.masterPreset = preset;
        this.masterPlayers = players;
        this.masterRunNumber = 1;
        this.masterStarted = true;
        return true;
    }

    runOnceFromMaster(): boolean {
        if (!this.masterStarted || this.masterPreset == null) {
            return false;
        }

        if (!this.runOnce(this.masterPreset, this.masterPlayers, this.masterRunNumber)) {
            return false;
        }

        this.masterRunNumber++;
        return true;
    }

    stopFromMaster(): void {
        LoneWolf.stopPacketDetector();
        LoneWolf.stopSkillEngine();
        this.masterPreset = null;
        this.masterPlayers = [];
        this.masterRunNumber = 1;
        this.masterStarted = false;
        this.masterMode = false;
    }

    run(): void {
        let preset: ClassPreset = undefined!;
        let players: string[] = undefined!;
        if (
            !this.prepareLifecycle(
                ref(
                    () => preset,
                    (v) => (preset = v),
                ),
                ref(
                    () => players,
                    (v) => (players = v),
                ),
            )
        ) {
            return;
        }

        let runNumber = 1;

        while (!bot.shouldExit) {
            if (!this.runOnce(preset, players, runNumber)) {
                return;
            }

            runNumber++;
        }
    }

    private prepareLifecycle(preset: Ref<ClassPreset>, players: Ref<string[]>): boolean {
        preset.value = new ClassPreset();
        players.value = [];

        if (!this.validateOptions()) {
            return false;
        }

        if (!LoneWolf.startArmySync(AscendEclipse_LW.syncFileName, 4, this.masterMode ? "Setup" : null)) {
            return false;
        }

        if (!LoneWolf.validateHouseRequirements()) {
            return false;
        }

        this.playerAlias = this.getPlayerAlias();

        preset.value = this.getClassPreset();
        preset.value.capeEnhancement =
            LoneWolf.isArmyPlayer(2) && this.armyComposition !== ArmyComposition.Pay2Win
                ? CapeSpecial.Absolution
                : CapeSpecial.Penitence;
        if (LoneWolf.isArmyPlayer(4)) {
            preset.value.weaponEnhancement = WeaponSpecial.Awe_Blast;
        }
        preset.value.combatPotion = null;

        Core.logger(
            `${AscendEclipse_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        if (
            !AscendEclipse_LW.temple.prepareOracle() ||
            !this.prepareBaseSetup(preset.value) ||
            !this.sync("SETUP_DONE")
        ) {
            return false;
        }

        if (this.masterMode && !this.ensureRiteOfAscension()) {
            return false;
        }

        players.value = this.getConfiguredPlayers();
        return true;
    }

    private runOnce(preset: ClassPreset, players: string[], runNumber: number): boolean {
        Core.logger(`${AscendEclipse_LW.logPrefix} ${this.playerAlias} starting run ${runNumber}.`);

        LoneWolf.equipClass(preset);
        if (bot.shouldExit) {
            return false;
        }

        AscendEclipse_LW.temple.tryAcceptOptionalDaily(AscendEclipse_LW.dailyQuestId);

        if (
            (!this.masterMode && !this.ensureRiteOfAscension()) ||
            !this.prepareRunConsumables(preset) ||
            !AscendEclipse_LW.temple.prepareParty(players) ||
            !AscendEclipse_LW.temple.enterDungeon(AscendEclipse_LW.mapName, this.privateRoomNumber) ||
            !this.prepareDungeonEntry(preset) ||
            !this.runEnterRoom(preset, runNumber) ||
            !this.runRoomOne(preset, runNumber) ||
            !this.runRoomTwo(preset, runNumber) ||
            !this.runFinalRoom(preset, runNumber)
        ) {
            return false;
        }

        if (!this.sync(`RUN_${runNumber}_COMPLETE`)) {
            return false;
        }

        Core.logger(`${AscendEclipse_LW.logPrefix} ${this.playerAlias} completed run ${runNumber}.`);

        LoneWolf.stopPacketDetector();
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();

        bot.sleep(2000);
        if (bot.shouldExit) {
            return false;
        }

        if (!AscendEclipse_LW.temple.returnHome()) {
            return false;
        }

        AscendEclipse_LW.temple.tryCompleteOptionalDaily(AscendEclipse_LW.dailyQuestId);
        return true;
    }

    private validateOptions(): boolean {
        this.armyComposition = this.getTempleOption("AscendEclipseComposition", "ArmyComposition");
        this.privateRoomNumber = this.getSetupOption("PrivateRoomNumber");
        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepareBaseSetup(preset: ClassPreset): boolean {
        Core.logger(`${AscendEclipse_LW.logPrefix} ${this.playerAlias} starting setup.`);

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
            );
        }

        if (bot.shouldExit) {
            return false;
        }

        Core.logger(`${AscendEclipse_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private ensureRiteOfAscension(): boolean {
        if (bot.inventory.contains(AscendEclipse_LW.riteOfAscension)) {
            Core.logger(`${AscendEclipse_LW.riteOfAscension} already in inventory.`, AscendEclipse_LW.logPrefix);
            return true;
        }

        if (!bot.bank.loaded) {
            if (bot.flash.get<string>("ui.mcPopup.currentLabel") !== "Bank") {
                bot.bank.open();
            }

            bot.bank.load(false);
            bot.wait.forBankLoad(20);
        }

        if (!bot.bank.contains(AscendEclipse_LW.riteOfAscension)) {
            return this.failure(`${AscendEclipse_LW.riteOfAscension} is not in inventory or bank.`);
        }

        if (!Core.hasSpaceFor(bot.bank.getItem(AscendEclipse_LW.riteOfAscension))) {
            return this.failure(`${AscendEclipse_LW.riteOfAscension} cannot be moved because the inventory is full.`);
        }

        bot.bank.ensureToInventory(AscendEclipse_LW.riteOfAscension);
        bot.wait.forTrue(() => bot.inventory.contains(AscendEclipse_LW.riteOfAscension), 14);

        if (!bot.inventory.contains(AscendEclipse_LW.riteOfAscension)) {
            return this.failure(`${AscendEclipse_LW.riteOfAscension} could not be moved from bank.`);
        }

        Core.logger(`${AscendEclipse_LW.riteOfAscension} moved from bank.`, AscendEclipse_LW.logPrefix);
        return true;
    }

    private prepareRunConsumables(preset: ClassPreset): boolean {
        if (this.getSetupOption("UsePotions")) {
            LoneWolf.preparePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        LoneWolf.prepareScrolls(AscendEclipse_LW.enrageScroll);
        return !bot.shouldExit;
    }

    private prepareDungeonEntry(preset: ClassPreset): boolean {
        if (bot.player.cell !== AscendEclipse_LW.enterCell || bot.player.pad !== AscendEclipse_LW.enterPad) {
            Core.jump(AscendEclipse_LW.enterCell, AscendEclipse_LW.enterPad);
        }

        if (this.getSetupOption("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        LoneWolf.equipScroll(AscendEclipse_LW.enrageScroll);
        return !bot.shouldExit;
    }

    private runEnterRoom(preset: ClassPreset, runNumber: number): boolean {
        let roomAttempt = 1;
        let observedMonster = false;

        while (!bot.shouldExit) {
            if (!this.prepareRoom("ROOM_1_READY", AscendEclipse_LW.enterCell, AscendEclipse_LW.enterPad)) {
                return false;
            }

            this.startSkillEngine(preset);
            let resetRoom = false;

            while (!bot.shouldExit) {
                const recovery = AscendEclipse_LW.temple.recoverRoomDeath(runNumber, 1, roomAttempt);

                if (recovery === DungeonRecoveryResult.Stopped) {
                    return false;
                }

                if (recovery === DungeonRecoveryResult.ResetRoom) {
                    resetRoom = true;
                    break;
                }

                if (recovery === DungeonRecoveryResult.RejoinRoom) {
                    Core.jump(AscendEclipse_LW.enterCell, AscendEclipse_LW.enterPad);
                    this.startSkillEngine(preset);
                }

                const primaryAlive = LoneWolf.isMonsterAlive(AscendEclipse_LW.enterPrimaryMapId);
                const secondaryAlive = LoneWolf.isMonsterAlive(AscendEclipse_LW.enterSecondaryMapId);
                observedMonster = primaryAlive || secondaryAlive || observedMonster;

                if (observedMonster && !primaryAlive && !secondaryAlive) {
                    LoneWolf.stopSkillEngine();
                    Core.logger(`${AscendEclipse_LW.logPrefix} ${this.playerAlias} completed Enter.`);
                    return true;
                }

                const solarFlareActive = bot.self.hasActiveAura(AscendEclipse_LW.solarFlareAura);
                const targetMapId =
                    secondaryAlive && solarFlareActive
                        ? AscendEclipse_LW.enterSecondaryMapId
                        : primaryAlive
                          ? AscendEclipse_LW.enterPrimaryMapId
                          : secondaryAlive
                            ? AscendEclipse_LW.enterSecondaryMapId
                            : 0;

                if (targetMapId > 0) {
                    LoneWolf.maintainTarget(targetMapId);
                }

                bot.sleep(AscendEclipse_LW.fightPollDelay);
            }

            LoneWolf.stopSkillEngine();
            if (!resetRoom) {
                return false;
            }

            roomAttempt++;
        }

        return false;
    }

    private runRoomOne(preset: ClassPreset, runNumber: number): boolean {
        let roomAttempt = 1;
        let observedMonster = false;

        while (!bot.shouldExit) {
            if (!this.prepareRoom("ROOM_2_READY", AscendEclipse_LW.roomOneCell, AscendEclipse_LW.roomOnePad)) {
                return false;
            }

            if (!LoneWolf.startPacketDetector("ct", AscendEclipse_LW.roomOneSecondaryAttackMarkers)) {
                return this.failure("The Room 1 Attack1 detector could not start.");
            }

            this.startRoomOneSkillEngine(preset);
            let resetRoom = false;
            let gatheringLightTauntHandled = false;
            let righteousSealSkillFourQueued = false;
            let gatheringLightCycle = 0;
            let handledSecondaryAttacks = 0;
            let secondaryTauntTargetUntil = 0;

            while (!bot.shouldExit) {
                const recovery = AscendEclipse_LW.temple.recoverRoomDeath(runNumber, 2, roomAttempt);

                if (recovery === DungeonRecoveryResult.Stopped) {
                    return false;
                }

                if (recovery === DungeonRecoveryResult.ResetRoom) {
                    resetRoom = true;
                    break;
                }

                if (recovery === DungeonRecoveryResult.RejoinRoom) {
                    Core.jump(AscendEclipse_LW.roomOneCell, AscendEclipse_LW.roomOnePad);
                    while (LoneWolf.hasPacketDetection(handledSecondaryAttacks + 1)) {
                        handledSecondaryAttacks++;
                    }

                    secondaryTauntTargetUntil = 0;
                    righteousSealSkillFourQueued = false;
                    this.startRoomOneSkillEngine(preset);
                }

                const primaryAlive = LoneWolf.isMonsterAlive(AscendEclipse_LW.roomOnePrimaryMapId);
                const secondaryAlive = LoneWolf.isMonsterAlive(AscendEclipse_LW.roomOneSecondaryMapId);
                observedMonster = primaryAlive || secondaryAlive || observedMonster;

                if (observedMonster && !primaryAlive && !secondaryAlive) {
                    LoneWolf.stopPacketDetector();
                    LoneWolf.stopSkillEngine();
                    Core.logger(`${AscendEclipse_LW.logPrefix} ${this.playerAlias} completed r1.`);
                    return true;
                }

                this.handleRoomOneSecondaryAttackDetections(
                    secondaryAlive,
                    ref(
                        () => handledSecondaryAttacks,
                        (v) => (handledSecondaryAttacks = v),
                    ),
                    ref(
                        () => secondaryTauntTargetUntil,
                        (v) => (secondaryTauntTargetUntil = v),
                    ),
                );

                const targetMapId =
                    secondaryAlive && Date.now() < secondaryTauntTargetUntil
                        ? AscendEclipse_LW.roomOneSecondaryMapId
                        : primaryAlive
                          ? AscendEclipse_LW.roomOnePrimaryMapId
                          : secondaryAlive
                            ? AscendEclipse_LW.roomOneSecondaryMapId
                            : 0;

                if (targetMapId > 0) {
                    LoneWolf.maintainTarget(targetMapId);
                }

                if (primaryAlive) {
                    this.handleAlternatingTargetAuraTaunt(
                        AscendEclipse_LW.roomOnePrimaryMapId,
                        AscendEclipse_LW.gatheringLightAura,
                        ref(
                            () => gatheringLightTauntHandled,
                            (v) => (gatheringLightTauntHandled = v),
                        ),
                        ref(
                            () => gatheringLightCycle,
                            (v) => (gatheringLightCycle = v),
                        ),
                    );
                }

                this.maintainRoomOneArchPaladinRighteousSeal(
                    ref(
                        () => righteousSealSkillFourQueued,
                        (v) => (righteousSealSkillFourQueued = v),
                    ),
                );

                bot.sleep(AscendEclipse_LW.fightPollDelay);
            }

            LoneWolf.stopPacketDetector();
            LoneWolf.stopSkillEngine();
            if (!resetRoom) {
                return false;
            }

            roomAttempt++;
        }

        return false;
    }

    private runRoomTwo(preset: ClassPreset, runNumber: number): boolean {
        let roomAttempt = 1;
        let observedMonster = false;

        while (!bot.shouldExit) {
            if (!this.prepareRoom("ROOM_3_READY", AscendEclipse_LW.roomTwoCell, AscendEclipse_LW.roomTwoPad)) {
                return false;
            }

            this.startSkillEngine(preset);
            let resetRoom = false;
            let sunsWarmthTauntHandled = false;
            let moonlightGazeTauntHandled = false;
            let sunsetKnightTauntTargetUntil = 0;

            while (!bot.shouldExit) {
                const recovery = AscendEclipse_LW.temple.recoverRoomDeath(runNumber, 3, roomAttempt);

                if (recovery === DungeonRecoveryResult.Stopped) {
                    return false;
                }

                if (recovery === DungeonRecoveryResult.ResetRoom) {
                    resetRoom = true;
                    break;
                }

                if (recovery === DungeonRecoveryResult.RejoinRoom) {
                    Core.jump(AscendEclipse_LW.roomTwoCell, AscendEclipse_LW.roomTwoPad);
                    sunsetKnightTauntTargetUntil = 0;
                    this.startSkillEngine(preset);
                }

                const primaryAlive = LoneWolf.isMonsterAlive(AscendEclipse_LW.roomTwoPrimaryMapId);
                const secondaryAlive = LoneWolf.isMonsterAlive(AscendEclipse_LW.roomTwoSecondaryMapId);
                observedMonster = primaryAlive || secondaryAlive || observedMonster;

                if (observedMonster && !primaryAlive && !secondaryAlive) {
                    LoneWolf.stopSkillEngine();
                    Core.logger(`${AscendEclipse_LW.logPrefix} ${this.playerAlias} completed r2.`);
                    return true;
                }

                if (secondaryAlive) {
                    const tauntRequested = this.handleSelfAuraTaunt(
                        this.sunsetKnightTaunterArmyPlayer,
                        AscendEclipse_LW.roomTwoSecondaryMapId,
                        AscendEclipse_LW.sunsWarmthAura,
                        ref(
                            () => sunsWarmthTauntHandled,
                            (v) => (sunsWarmthTauntHandled = v),
                        ),
                    );

                    if (tauntRequested) {
                        sunsetKnightTauntTargetUntil = Date.now() + AscendEclipse_LW.tauntTargetHold;
                    }
                }

                if (primaryAlive) {
                    this.handleSelfAuraTaunt(
                        4,
                        AscendEclipse_LW.roomTwoPrimaryMapId,
                        AscendEclipse_LW.moonlightGazeAura,
                        ref(
                            () => moonlightGazeTauntHandled,
                            (v) => (moonlightGazeTauntHandled = v),
                        ),
                    );
                }

                const targetMapId =
                    LoneWolf.isArmyPlayer(this.sunsetKnightTaunterArmyPlayer) &&
                    secondaryAlive &&
                    Date.now() < sunsetKnightTauntTargetUntil
                        ? AscendEclipse_LW.roomTwoSecondaryMapId
                        : primaryAlive
                          ? AscendEclipse_LW.roomTwoPrimaryMapId
                          : secondaryAlive
                            ? AscendEclipse_LW.roomTwoSecondaryMapId
                            : 0;

                if (targetMapId > 0) {
                    LoneWolf.maintainTarget(targetMapId);
                }

                bot.sleep(AscendEclipse_LW.fightPollDelay);
            }

            LoneWolf.stopSkillEngine();
            if (!resetRoom) {
                return false;
            }

            roomAttempt++;
        }

        return false;
    }

    private runFinalRoom(preset: ClassPreset, runNumber: number): boolean {
        let roomAttempt = 1;
        let observedBoss = false;

        while (!bot.shouldExit) {
            LoneWolf.stopPacketDetector();

            if (!this.prepareFinalRoomClassReset(preset)) {
                return false;
            }

            const solsticePair = LoneWolf.isArmyPlayer(2) || LoneWolf.isArmyPlayer(3);
            const convergesMarker = solsticePair ? "sun converges" : "moon converges";

            if (!LoneWolf.startPacketChoiceDetector("ct", [convergesMarker], convergesMarker)) {
                return this.failure("The Converges packet detector could not start.");
            }

            if (!this.prepareRoom("ROOM_4_READY", AscendEclipse_LW.finalRoomCell, AscendEclipse_LW.finalRoomPad)) {
                LoneWolf.stopPacketDetector();
                return false;
            }

            this.startSkillEngine(preset);
            let resetRoom = false;
            let handledConverges = 0;
            let tauntTargetUntil = 0;

            while (!bot.shouldExit) {
                const recovery = AscendEclipse_LW.temple.recoverRoomDeath(runNumber, 4, roomAttempt);

                if (recovery === DungeonRecoveryResult.Stopped) {
                    return false;
                }

                if (recovery === DungeonRecoveryResult.ResetRoom) {
                    resetRoom = true;
                    break;
                }

                if (recovery === DungeonRecoveryResult.RejoinRoom) {
                    Core.jump(AscendEclipse_LW.finalRoomCell, AscendEclipse_LW.finalRoomPad);
                    handledConverges = this.drainConverges(handledConverges);
                    tauntTargetUntil = 0;
                    this.startSkillEngine(preset);
                }

                const solsticeAlive = LoneWolf.isMonsterAlive(AscendEclipse_LW.ascendedSolsticeMapId);
                const midnightAlive = LoneWolf.isMonsterAlive(AscendEclipse_LW.ascendedMidnightMapId);
                observedBoss = solsticeAlive || midnightAlive || observedBoss;

                if (observedBoss && !solsticeAlive && !midnightAlive) {
                    LoneWolf.stopPacketDetector();
                    LoneWolf.stopSkillEngine();
                    Core.logger(
                        `${AscendEclipse_LW.logPrefix} ${this.playerAlias} confirmed both Ascended bosses defeated.`,
                    );
                    return true;
                }

                this.handleConvergesDetections(
                    solsticeAlive,
                    midnightAlive,
                    ref(
                        () => handledConverges,
                        (v) => (handledConverges = v),
                    ),
                    ref(
                        () => tauntTargetUntil,
                        (v) => (tauntTargetUntil = v),
                    ),
                );

                this.maintainFinalTarget(solsticeAlive, midnightAlive, tauntTargetUntil);

                bot.sleep(AscendEclipse_LW.fightPollDelay);
            }

            LoneWolf.stopPacketDetector();
            LoneWolf.stopSkillEngine();

            if (!resetRoom) {
                return false;
            }

            roomAttempt++;
        }

        return false;
    }

    private prepareFinalRoomClassReset(preset: ClassPreset): boolean {
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();

        LoneWolf.equipClass(LoneWolf.oracle());
        if (bot.shouldExit) {
            return false;
        }

        bot.sleep(1000);
        LoneWolf.equipClass(preset);
        if (bot.shouldExit) {
            return false;
        }

        bot.sleep(1000);
        Core.logger(
            `${AscendEclipse_LW.logPrefix} ${this.playerAlias} completed the Oracle reset before the final room.`,
        );
        return !bot.shouldExit;
    }

    private handleConvergesDetections(
        solsticeAlive: boolean,
        midnightAlive: boolean,
        handledConverges: Ref<number>,
        tauntTargetUntil: Ref<number>,
    ): void {
        while (LoneWolf.hasPacketDetection(handledConverges.value + 1)) {
            handledConverges.value++;

            const assignedMapId = this.getFinalAssignedMapId();
            const assignedBossAlive =
                assignedMapId === AscendEclipse_LW.ascendedSolsticeMapId ? solsticeAlive : midnightAlive;

            if (!assignedBossAlive || !this.ownsFinalTaunt(handledConverges.value)) {
                LoneWolf.resumeSkillEngine();
                continue;
            }

            LoneWolf.maintainTarget(assignedMapId);
            LoneWolf.requestAbsolutePriorityTaunt(assignedMapId);
            tauntTargetUntil.value = Date.now() + AscendEclipse_LW.tauntTargetHold;
            Core.logger(
                `${AscendEclipse_LW.logPrefix} ${this.playerAlias} requested absolute priority Converges taunt ${handledConverges.value} on MapID ${assignedMapId}.`,
            );
        }
    }

    private maintainFinalTarget(solsticeAlive: boolean, midnightAlive: boolean, tauntTargetUntil: number): void {
        if (!solsticeAlive || !midnightAlive) {
            const survivingBoss = solsticeAlive
                ? AscendEclipse_LW.ascendedSolsticeMapId
                : midnightAlive
                  ? AscendEclipse_LW.ascendedMidnightMapId
                  : 0;

            if (survivingBoss > 0) {
                LoneWolf.maintainTarget(survivingBoss);
            }

            return;
        }

        const assignedMapId = this.getFinalAssignedMapId();
        if (LoneWolf.hasPendingAbsolutePriorityTaunt()) {
            LoneWolf.maintainTarget(assignedMapId);
            return;
        }

        if (Date.now() < tauntTargetUntil) {
            LoneWolf.maintainTarget(assignedMapId);
            return;
        }

        const solsticeHealth = this.getMonsterHealthPercent(AscendEclipse_LW.ascendedSolsticeMapId);
        const midnightHealth = this.getMonsterHealthPercent(AscendEclipse_LW.ascendedMidnightMapId);

        if (bot.self.hasActiveAura(AscendEclipse_LW.daybreakAura)) {
            LoneWolf.maintainTarget(AscendEclipse_LW.ascendedMidnightMapId);
            return;
        }

        const gap = midnightHealth - solsticeHealth;
        const isBalancer = this.isFinalBalancer;
        if (isBalancer) {
            if (gap < AscendEclipse_LW.balanceMinimumDifference) {
                LoneWolf.maintainTarget(AscendEclipse_LW.ascendedSolsticeMapId);
            } else if (gap > AscendEclipse_LW.balanceMaximumDifference) {
                LoneWolf.maintainTarget(AscendEclipse_LW.ascendedMidnightMapId);
            } else {
                LoneWolf.maintainTarget(assignedMapId);
            }
        } else {
            LoneWolf.maintainTarget(assignedMapId);
        }
    }

    private getMonsterHealthPercent(mapId: number): number {
        const monsters = bot.monsters?.mapMonsters;
        if (monsters == null) {
            return 0;
        }

        for (const monster of monsters) {
            if (monster != null && monster.mapId === mapId && monster.maxHp > 0) {
                return (monster.hp * 100) / monster.maxHp;
            }
        }

        return 0;
    }

    private ownsFinalTaunt(cycle: number): boolean {
        const openingOwner =
            LoneWolf.isArmyPlayer(1) ||
            (this.armyComposition === ArmyComposition.Pay2Win ? LoneWolf.isArmyPlayer(2) : LoneWolf.isArmyPlayer(3));
        return openingOwner ? cycle % 2 === 1 : cycle % 2 === 0;
    }

    private getFinalAssignedMapId(): number {
        return LoneWolf.isArmyPlayer(2) || LoneWolf.isArmyPlayer(3)
            ? AscendEclipse_LW.ascendedSolsticeMapId
            : AscendEclipse_LW.ascendedMidnightMapId;
    }

    private prepareRoom(step: string, cell: string, pad: string): boolean {
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();

        if (bot.shouldExit || !this.sync(step)) {
            return false;
        }

        if (bot.player.cell !== cell || bot.player.pad !== pad) {
            Core.jump(cell, pad);
        }

        if (bot.shouldExit) {
            return false;
        }

        if (bot.player.cell === cell && bot.player.pad === pad) {
            return true;
        }

        return this.failure(`Could not reach dungeon cell ${cell}.`);
    }

    private handleAlternatingTargetAuraTaunt(
        targetMapId: number,
        auraName: string,
        auraHandled: Ref<boolean>,
        cycle: Ref<number>,
    ): void {
        if (!LoneWolf.isArmyPlayer(this.roomOnePrimaryFollowingTaunterArmyPlayer) && !this.isRoomOneArchPaladin) {
            return;
        }

        const hasAura = bot.target.getMonsterAura(targetMapId).some((aura) => aura.name === auraName);

        if (!hasAura) {
            auraHandled.value = false;
            return;
        }

        if (auraHandled.value) {
            return;
        }

        auraHandled.value = true;
        cycle.value++;
        const ownsTaunt =
            cycle.value % 2 === 1
                ? this.isRoomOneArchPaladin
                : LoneWolf.isArmyPlayer(this.roomOnePrimaryFollowingTaunterArmyPlayer);

        if (!ownsTaunt) {
            return;
        }

        LoneWolf.requestTaunt(targetMapId);
        if (this.isRoomOneArchPaladin) {
            LoneWolf.requestPrioritySkill(3);
            Core.logger(
                `${AscendEclipse_LW.logPrefix} ${this.playerAlias} queued skill 3 after its ${auraName} taunt cycle.value ${cycle.value}.`,
            );
        }

        Core.logger(
            `${AscendEclipse_LW.logPrefix} ${this.playerAlias} requested ${auraName} taunt cycle.value ${cycle.value} on MapID ${targetMapId}.`,
        );
    }

    private maintainRoomOneArchPaladinRighteousSeal(skillFourQueued: Ref<boolean>): void {
        if (!this.isRoomOneArchPaladin) {
            return;
        }

        const righteousSeal = bot.target.getAura(AscendEclipse_LW.righteousSealAura);
        if (righteousSeal == null) {
            skillFourQueued.value = false;
            return;
        }

        if (skillFourQueued.value || LoneWolf.hasPendingPrioritySkill()) {
            return;
        }

        const remaining = righteousSeal.expiresAt - Date.now();
        if (remaining <= 0 || remaining > AscendEclipse_LW.righteousSealSkillFourWindow) {
            return;
        }

        LoneWolf.requestPrioritySkill(4);
        skillFourQueued.value = true;
        Core.logger(`${AscendEclipse_LW.logPrefix} ${this.playerAlias} queued skill 4 for Righteous Seal.`);
    }

    private handleRoomOneSecondaryAttackDetections(
        secondaryAlive: boolean,
        handledAttacks: Ref<number>,
        tauntTargetUntil: Ref<number>,
    ): void {
        while (LoneWolf.hasPacketDetection(handledAttacks.value + 1)) {
            handledAttacks.value++;
            if (!secondaryAlive || handledAttacks.value < 3 || (handledAttacks.value - 3) % 4 !== 0) {
                continue;
            }

            const tauntCycle = (handledAttacks.value - 3) / 4 + 1;
            const ownsTaunt =
                tauntCycle % 2 === 1
                    ? LoneWolf.isArmyPlayer(this.roomOneSecondaryOpeningTaunterArmyPlayer)
                    : LoneWolf.isArmyPlayer(4);

            if (!ownsTaunt) {
                continue;
            }

            LoneWolf.maintainTarget(AscendEclipse_LW.roomOneSecondaryMapId);
            LoneWolf.requestTaunt(AscendEclipse_LW.roomOneSecondaryMapId);
            tauntTargetUntil.value = Date.now() + AscendEclipse_LW.tauntTargetHold;
            Core.logger(
                `${AscendEclipse_LW.logPrefix} ${this.playerAlias} requested MapID 4 taunt after Attack1 count ${handledAttacks.value}.`,
            );
        }
    }

    private handleSelfAuraTaunt(
        armyPlayer: number,
        targetMapId: number,
        auraName: string,
        auraHandled: Ref<boolean>,
    ): boolean {
        if (!LoneWolf.isArmyPlayer(armyPlayer)) {
            return false;
        }

        const aura = bot.self.getAura(auraName);
        if (aura == null) {
            auraHandled.value = false;
            return false;
        }

        if (
            !auraHandled.value &&
            aura.remainingTime > 0 &&
            aura.remainingTime <= AscendEclipse_LW.timedAuraTauntSeconds
        ) {
            LoneWolf.maintainTarget(targetMapId);
            LoneWolf.requestTaunt(targetMapId);
            auraHandled.value = true;
            Core.logger(
                `${AscendEclipse_LW.logPrefix} ${this.playerAlias} requested the ${auraName} taunt on MapID ${targetMapId}.`,
            );
            return true;
        }

        return false;
    }

    private drainConverges(handledConverges: number): number {
        while (LoneWolf.hasPacketDetection(handledConverges + 1)) {
            handledConverges++;
        }

        return handledConverges;
    }

    private startSkillEngine(preset: ClassPreset): void {
        LoneWolf.startSkillEngine(preset.skills, this.playerAlias, true, AscendEclipse_LW.logPrefix, preset.skillMode);
    }

    private startRoomOneSkillEngine(preset: ClassPreset): void {
        if (!this.isRoomOneArchPaladin) {
            this.startSkillEngine(preset);
            return;
        }

        LoneWolf.startSkillEngine([2, 1], this.playerAlias, true, AscendEclipse_LW.logPrefix, preset.skillMode);
    }

    private getClassPreset(): ClassPreset {
        if (LoneWolf.isArmyPlayer(1)) {
            if (this.armyComposition === ArmyComposition.Pay2Win) {
                return LoneWolf.guardian();
            }

            return this.armyComposition === ArmyComposition.Stable
                ? LoneWolf.verusDoomKnight()
                : LoneWolf.legionRevenant();
        }

        if (LoneWolf.isArmyPlayer(2)) {
            return this.armyComposition === ArmyComposition.Pay2Win ? LoneWolf.archPaladin() : LoneWolf.stoneCrusher();
        }

        if (LoneWolf.isArmyPlayer(3)) {
            return this.armyComposition === ArmyComposition.Pay2Win
                ? LoneWolf.legionRevenant()
                : LoneWolf.archPaladin();
        }

        return LoneWolf.lordOfOrder();
    }

    private get sunsetKnightTaunterArmyPlayer(): number {
        return this.armyComposition === ArmyComposition.Pay2Win ? 3 : 1;
    }

    private get roomOneSecondaryOpeningTaunterArmyPlayer(): number {
        return this.armyComposition === ArmyComposition.Pay2Win ? 1 : 2;
    }

    private get roomOnePrimaryFollowingTaunterArmyPlayer(): number {
        return this.armyComposition === ArmyComposition.Pay2Win ? 3 : 1;
    }

    private get isRoomOneArchPaladin(): boolean {
        return this.armyComposition === ArmyComposition.Pay2Win ? LoneWolf.isArmyPlayer(2) : LoneWolf.isArmyPlayer(3);
    }

    private get isFinalBalancer(): boolean {
        return (
            LoneWolf.isArmyPlayer(2) ||
            (this.armyComposition === ArmyComposition.Pay2Win && LoneWolf.isArmyPlayer(4)) ||
            (this.armyComposition === ArmyComposition.Stable || this.armyComposition === ArmyComposition.Pay2Win
                ? LoneWolf.isArmyPlayer(1)
                : LoneWolf.isArmyPlayer(4))
        );
    }

    private getSetupOption<T extends string | number | boolean>(optionName: string): T {
        return (this.masterMode ? bot.config!.get<T>("Setup", optionName) : bot.config!.get<T>(optionName))!;
    }

    private getTempleOption<T extends string | number | boolean>(
        masterOptionName: string,
        standaloneOptionName: string,
    ): T {
        return (
            this.masterMode
                ? bot.config!.get<T>("Temple_Shrine", masterOptionName)
                : bot.config!.get<T>(standaloneOptionName)
        )!;
    }

    private getConfiguredPlayers(): string[] {
        return [
            this.getSetupOption("player1") ?? "",
            this.getSetupOption("player2") ?? "",
            this.getSetupOption("player3") ?? "",
            this.getSetupOption("player4") ?? "",
        ];
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
        Core.logger(`${AscendEclipse_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${AscendEclipse_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private failure(message: string): boolean {
        Core.logger(message, AscendEclipse_LW.logPrefix, { messageBox: true, stopBot: true });
        return false;
    }
}

export const scriptOptions = defineScriptOptions(
    "AscendEclipse_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO\nStable: VDK / SC / AP / LOO\nPay2Win: Guardian / AP / LR / LOO",
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
    const script = new AscendEclipse_LW();
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
