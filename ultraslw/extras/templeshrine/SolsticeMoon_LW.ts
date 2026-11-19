/*
name: Solstice Moon LW
description: Four-player CoreLoneWolf Army script for the SolsticeMoon dungeon.
tags: dungeon, solstice moon, temple shrine, army, corelonewolf
*/
// Port of Extras/TempleShrine/SolsticeMoon_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, ref } from "../../LWRef";
import { bot, choices, defineScriptOptions, option } from "turu";
import { HelmSpecial } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { ClassPreset, CoreLoneWolf, SkillEngineMode } from "../../CoreLoneWolf";
import { CoreTempleShrine, DungeonRecoveryResult } from "./CoreTempleShrine";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Stable = "Stable",
    Reliable = "Reliable",
    Pay2Win = "Pay2Win",
}

export class SolsticeMoon_LW {
    private static readonly temple: CoreTempleShrine = new CoreTempleShrine(LoneWolf);

    private static readonly logPrefix = "Solstice Moon LW";
    private static readonly syncFileName = "SolsticeMoon_LW.sync";
    private static readonly mapName = "solsticemoon";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly moonlightGazeAura = "Moonlight Gaze";
    private static readonly enterCell = "Enter";
    private static readonly enterPad = "Spawn";
    private static readonly roomOneCell = "r1";
    private static readonly roomOnePad = "Left";
    private static readonly roomTwoCell = "r2";
    private static readonly roomTwoPad = "Right";
    private static readonly finalRoomCell = "r3";
    private static readonly finalRoomPad = "Right";
    private static readonly dailyQuestId = 9303;
    private static readonly enterPrimaryMapId = 1;
    private static readonly enterSecondaryMapId = 2;
    private static readonly roomOneSecondaryMapId = 3;
    private static readonly roomOnePrimaryMapId = 4;
    private static readonly roomTwoSecondaryMapId = 5;
    private static readonly roomTwoPrimaryMapId = 6;
    private static readonly finalBossMapId = 7;
    private static readonly fightPollDelay = 150;
    private static readonly moonlightGazeTauntSeconds = 8;

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private isTaunter: boolean = false;
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

        if (!LoneWolf.startArmySync(SolsticeMoon_LW.syncFileName, 4, this.masterMode ? "Setup" : null)) {
            return false;
        }

        if (!LoneWolf.validateHouseRequirements()) {
            return false;
        }

        this.playerAlias = this.getPlayerAlias();
        this.isTaunter = LoneWolf.isArmyPlayer(this.primaryTaunterArmyPlayer) || LoneWolf.isArmyPlayer(4);

        preset.value = this.getClassPreset();
        if (this.isTaunter) {
            preset.value.combatPotion = null;
        }

        Core.logger(
            `${SolsticeMoon_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        if (
            !SolsticeMoon_LW.temple.prepareOracle() ||
            !this.prepareBaseSetup(preset.value) ||
            !this.sync("SETUP_DONE")
        ) {
            return false;
        }

        players.value = this.getConfiguredPlayers();
        return true;
    }

    private runOnce(preset: ClassPreset, players: string[], runNumber: number): boolean {
        Core.logger(`${SolsticeMoon_LW.logPrefix} ${this.playerAlias} starting run ${runNumber}.`);

        LoneWolf.equipClass(preset);
        if (bot.shouldExit) {
            return false;
        }

        SolsticeMoon_LW.temple.tryAcceptOptionalDaily(SolsticeMoon_LW.dailyQuestId);

        if (
            !this.prepareRunConsumables(preset) ||
            !SolsticeMoon_LW.temple.prepareParty(players) ||
            !SolsticeMoon_LW.temple.enterDungeon(SolsticeMoon_LW.mapName, this.privateRoomNumber) ||
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

        Core.logger(`${SolsticeMoon_LW.logPrefix} ${this.playerAlias} completed run ${runNumber}.`);

        LoneWolf.stopPacketDetector();
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();

        bot.sleep(2000);
        if (bot.shouldExit) {
            return false;
        }

        if (!SolsticeMoon_LW.temple.returnHome()) {
            return false;
        }

        SolsticeMoon_LW.temple.tryCompleteOptionalDaily(SolsticeMoon_LW.dailyQuestId);
        return true;
    }

    private validateOptions(): boolean {
        this.armyComposition = this.getTempleOption("SolsticeMoonComposition", "ArmyComposition");
        this.privateRoomNumber = this.getSetupOption("PrivateRoomNumber");
        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepareBaseSetup(preset: ClassPreset): boolean {
        Core.logger(`${SolsticeMoon_LW.logPrefix} ${this.playerAlias} starting setup.`);

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

        Core.logger(`${SolsticeMoon_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareRunConsumables(preset: ClassPreset): boolean {
        if (this.getSetupOption("UsePotions")) {
            LoneWolf.preparePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.prepareScrolls(SolsticeMoon_LW.enrageScroll);
        }

        return !bot.shouldExit;
    }

    private prepareDungeonEntry(preset: ClassPreset): boolean {
        if (bot.player.cell !== SolsticeMoon_LW.enterCell || bot.player.pad !== SolsticeMoon_LW.enterPad) {
            Core.jump(SolsticeMoon_LW.enterCell, SolsticeMoon_LW.enterPad);
        }

        if (this.getSetupOption("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.equipScroll(SolsticeMoon_LW.enrageScroll);
        }

        return !bot.shouldExit;
    }

    private runEnterRoom(preset: ClassPreset, runNumber: number): boolean {
        let roomAttempt = 1;
        let observedMonster = false;

        while (!bot.shouldExit) {
            if (!this.prepareRoom("ROOM_1_READY", SolsticeMoon_LW.enterCell, SolsticeMoon_LW.enterPad)) {
                return false;
            }

            this.startSkillEngine(preset, true);
            let resetRoom = false;

            while (!bot.shouldExit) {
                const recovery = SolsticeMoon_LW.temple.recoverRoomDeath(runNumber, 1, roomAttempt);

                if (recovery === DungeonRecoveryResult.Stopped) {
                    return false;
                }

                if (recovery === DungeonRecoveryResult.ResetRoom) {
                    resetRoom = true;
                    break;
                }

                if (recovery === DungeonRecoveryResult.RejoinRoom) {
                    Core.jump(SolsticeMoon_LW.enterCell, SolsticeMoon_LW.enterPad);
                    this.startSkillEngine(preset, true);
                }

                const primaryAlive = LoneWolf.isMonsterAlive(SolsticeMoon_LW.enterPrimaryMapId);
                const secondaryAlive = LoneWolf.isMonsterAlive(SolsticeMoon_LW.enterSecondaryMapId);
                observedMonster = primaryAlive || secondaryAlive || observedMonster;

                if (observedMonster && !primaryAlive && !secondaryAlive) {
                    LoneWolf.stopSkillEngine();
                    Core.logger(`${SolsticeMoon_LW.logPrefix} ${this.playerAlias} completed Enter.`);
                    return true;
                }

                const targetMapId = primaryAlive
                    ? SolsticeMoon_LW.enterPrimaryMapId
                    : secondaryAlive
                      ? SolsticeMoon_LW.enterSecondaryMapId
                      : 0;

                if (targetMapId > 0) {
                    LoneWolf.maintainTarget(targetMapId);
                }

                bot.sleep(SolsticeMoon_LW.fightPollDelay);
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
            if (!this.prepareRoom("ROOM_2_READY", SolsticeMoon_LW.roomOneCell, SolsticeMoon_LW.roomOnePad)) {
                return false;
            }

            this.startSkillEngine(preset, true);
            let resetRoom = false;
            let gazeTauntHandled = false;

            while (!bot.shouldExit) {
                const recovery = SolsticeMoon_LW.temple.recoverRoomDeath(runNumber, 2, roomAttempt);

                if (recovery === DungeonRecoveryResult.Stopped) {
                    return false;
                }

                if (recovery === DungeonRecoveryResult.ResetRoom) {
                    resetRoom = true;
                    break;
                }

                if (recovery === DungeonRecoveryResult.RejoinRoom) {
                    Core.jump(SolsticeMoon_LW.roomOneCell, SolsticeMoon_LW.roomOnePad);
                    this.startSkillEngine(preset, true);
                }

                const primaryAlive = LoneWolf.isMonsterAlive(SolsticeMoon_LW.roomOnePrimaryMapId);
                const secondaryAlive = LoneWolf.isMonsterAlive(SolsticeMoon_LW.roomOneSecondaryMapId);
                observedMonster = primaryAlive || secondaryAlive || observedMonster;

                if (observedMonster && !primaryAlive && !secondaryAlive) {
                    LoneWolf.stopSkillEngine();
                    Core.logger(`${SolsticeMoon_LW.logPrefix} ${this.playerAlias} completed r1.`);
                    return true;
                }

                const targetMapId = primaryAlive
                    ? SolsticeMoon_LW.roomOnePrimaryMapId
                    : secondaryAlive
                      ? SolsticeMoon_LW.roomOneSecondaryMapId
                      : 0;

                if (targetMapId > 0) {
                    LoneWolf.maintainTarget(targetMapId);
                }

                if (primaryAlive) {
                    this.handleMoonlightGazeTaunt(
                        SolsticeMoon_LW.roomOnePrimaryMapId,
                        ref(
                            () => gazeTauntHandled,
                            (v) => (gazeTauntHandled = v),
                        ),
                    );
                }

                bot.sleep(SolsticeMoon_LW.fightPollDelay);
            }

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
            if (!this.prepareRoom("ROOM_3_READY", SolsticeMoon_LW.roomTwoCell, SolsticeMoon_LW.roomTwoPad)) {
                return false;
            }

            this.startSkillEngine(preset, true);
            let resetRoom = false;
            let gazeTauntHandled = false;

            while (!bot.shouldExit) {
                const recovery = SolsticeMoon_LW.temple.recoverRoomDeath(runNumber, 3, roomAttempt);

                if (recovery === DungeonRecoveryResult.Stopped) {
                    return false;
                }

                if (recovery === DungeonRecoveryResult.ResetRoom) {
                    resetRoom = true;
                    break;
                }

                if (recovery === DungeonRecoveryResult.RejoinRoom) {
                    Core.jump(SolsticeMoon_LW.roomTwoCell, SolsticeMoon_LW.roomTwoPad);
                    this.startSkillEngine(preset, true);
                }

                const primaryAlive = LoneWolf.isMonsterAlive(SolsticeMoon_LW.roomTwoPrimaryMapId);
                const secondaryAlive = LoneWolf.isMonsterAlive(SolsticeMoon_LW.roomTwoSecondaryMapId);
                observedMonster = primaryAlive || secondaryAlive || observedMonster;

                if (observedMonster && !primaryAlive && !secondaryAlive) {
                    LoneWolf.stopSkillEngine();
                    Core.logger(`${SolsticeMoon_LW.logPrefix} ${this.playerAlias} completed r2.`);
                    return true;
                }

                const targetMapId = primaryAlive
                    ? SolsticeMoon_LW.roomTwoPrimaryMapId
                    : secondaryAlive
                      ? SolsticeMoon_LW.roomTwoSecondaryMapId
                      : 0;

                if (targetMapId > 0) {
                    LoneWolf.maintainTarget(targetMapId);
                }

                if (primaryAlive) {
                    this.handleMoonlightGazeTaunt(
                        SolsticeMoon_LW.roomTwoPrimaryMapId,
                        ref(
                            () => gazeTauntHandled,
                            (v) => (gazeTauntHandled = v),
                        ),
                    );
                }

                bot.sleep(SolsticeMoon_LW.fightPollDelay);
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

            if (!LoneWolf.startPacketDetector("ct", "converges")) {
                return this.failure("The Converges packet detector could not start.");
            }

            if (!this.prepareRoom("ROOM_4_READY", SolsticeMoon_LW.finalRoomCell, SolsticeMoon_LW.finalRoomPad)) {
                LoneWolf.stopPacketDetector();
                return false;
            }

            this.startSkillEngine(preset);
            let resetRoom = false;
            let handledConverges = 0;

            while (!bot.shouldExit) {
                const recovery = SolsticeMoon_LW.temple.recoverRoomDeath(runNumber, 4, roomAttempt);

                if (recovery === DungeonRecoveryResult.Stopped) {
                    return false;
                }

                if (recovery === DungeonRecoveryResult.ResetRoom) {
                    resetRoom = true;
                    break;
                }

                if (recovery === DungeonRecoveryResult.RejoinRoom) {
                    Core.jump(SolsticeMoon_LW.finalRoomCell, SolsticeMoon_LW.finalRoomPad);
                    handledConverges = this.drainConverges(handledConverges);
                    this.startSkillEngine(preset);
                }

                const bossAlive = LoneWolf.isMonsterAlive(SolsticeMoon_LW.finalBossMapId);
                observedBoss = bossAlive || observedBoss;

                if (observedBoss && !bossAlive) {
                    LoneWolf.stopPacketDetector();
                    LoneWolf.stopSkillEngine();
                    Core.logger(`${SolsticeMoon_LW.logPrefix} ${this.playerAlias} confirmed Hollow Midnight defeated.`);
                    return true;
                }

                if (bossAlive) {
                    LoneWolf.maintainTarget(SolsticeMoon_LW.finalBossMapId);

                    if (LoneWolf.hasPacketDetection(handledConverges + 1)) {
                        handledConverges++;
                        const ownsTaunt =
                            handledConverges % 2 === 1
                                ? LoneWolf.isArmyPlayer(4)
                                : LoneWolf.isArmyPlayer(this.primaryTaunterArmyPlayer);

                        if (ownsTaunt) {
                            LoneWolf.requestTaunt(SolsticeMoon_LW.finalBossMapId);
                            Core.logger(
                                `${SolsticeMoon_LW.logPrefix} ${this.playerAlias} requested Converges taunt ${handledConverges}.`,
                            );
                        }
                    }
                }

                bot.sleep(SolsticeMoon_LW.fightPollDelay);
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

    private handleMoonlightGazeTaunt(targetMapId: number, auraHandled: Ref<boolean>): void {
        if (!LoneWolf.isArmyPlayer(4)) {
            return;
        }

        const aura = bot.self.getAura(SolsticeMoon_LW.moonlightGazeAura);
        if (aura == null) {
            auraHandled.value = false;
            return;
        }

        if (
            !auraHandled.value &&
            aura.remainingTime > 0 &&
            aura.remainingTime <= SolsticeMoon_LW.moonlightGazeTauntSeconds
        ) {
            LoneWolf.requestTaunt(targetMapId);
            auraHandled.value = true;
            Core.logger(`${SolsticeMoon_LW.logPrefix} ${this.playerAlias} requested the Moonlight Gaze taunt.`);
        }
    }

    private drainConverges(handledConverges: number): number {
        while (LoneWolf.hasPacketDetection(handledConverges + 1)) {
            handledConverges++;
        }

        return handledConverges;
    }

    private startSkillEngine(preset: ClassPreset, useShamanFarmMode = false): void {
        const skillMode =
            useShamanFarmMode && this.armyComposition === ArmyComposition.Reliable && LoneWolf.isArmyPlayer(1)
                ? SkillEngineMode.Simple
                : preset.skillMode;

        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            this.isTaunter,
            SolsticeMoon_LW.logPrefix,
            skillMode,
        );
    }

    private getClassPreset(): ClassPreset {
        if (LoneWolf.isArmyPlayer(1)) {
            if (this.armyComposition === ArmyComposition.Reliable) {
                const shaman = LoneWolf.shaman();
                shaman.helmEnhancement = HelmSpecial.Examen;
                return shaman;
            }

            if (this.armyComposition === ArmyComposition.Pay2Win) {
                return LoneWolf.guardian();
            }

            if (this.armyComposition === ArmyComposition.Stable) {
                return LoneWolf.verusDoomKnight();
            }

            return LoneWolf.legionRevenant();
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

    private get primaryTaunterArmyPlayer(): number {
        return this.armyComposition === ArmyComposition.Reliable
            ? 2
            : this.armyComposition === ArmyComposition.Pay2Win
              ? 3
              : 1;
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
        Core.logger(`${SolsticeMoon_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${SolsticeMoon_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private failure(message: string): boolean {
        Core.logger(message, SolsticeMoon_LW.logPrefix, { messageBox: true, stopBot: true });
        return false;
    }
}

export const scriptOptions = defineScriptOptions(
    "SolsticeMoon_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO\nStable: VDK / SC / AP / LOO\nReliable: Shaman / SC / AP / LOO\nPay2Win: Guardian / AP / LR / LOO",
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
    const script = new SolsticeMoon_LW();
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
