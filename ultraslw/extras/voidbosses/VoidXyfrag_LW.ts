/*
name: Void Xyfrag LW
description: Four-to-seven-player CoreLoneWolf Army script for Xyfrag.
tags: void, xyfrag, challenge boss, seven-player, army, corelonewolf
*/
// Port of Extras/VoidBosses/VoidXyfrag_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, ref } from "../../LWRef";
import { bot, choices, defineScriptOptions, option } from "turu";
import { CapeSpecial } from "../../../core/CoreAdvanced";
import { Core, configOr } from "../../../core/CoreBots";
import { type ClassPreset, CoreLoneWolf } from "../../CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Reliable = "Reliable",
    Stable = "Stable",
}

export enum FightResult {
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export class VoidXyfrag_LW {
    private static readonly logPrefix = "Void Xyfrag LW";
    private static readonly syncFileName = "VoidXyfrag_LW.sync";
    private static readonly mapName = "voidxyfrag";
    private static readonly fightCell = "Enter";
    private static readonly fightPad = "Spawn";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly packetCommand = "ct";
    private static readonly bleechPacketText = "BLEEEEEEEEEEEECCH";
    private static readonly voidEnergy = "Void Energy";
    private static readonly slimyTooth = "Xyfrag's Slimy Tooth";
    private static readonly xyfragEssence = "Xyfrag's ??? Essence";
    private static readonly xyfragEssenceId = 73863;
    private static readonly doomSpikesQuestId = 9418;
    private static readonly wrongTurnQuestId = 9091;
    private static readonly minimumLevel = 80;
    private static readonly bossMapId = 1;
    private static readonly fightPollDelay = 100;
    private static readonly respawnPollDelay = 500;

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private armyPlayerCount: number = 0;
    private privateRoomNumber: number = 0;
    private farmXyfrag: boolean = false;
    private isTaunter: boolean = false;
    private masterMode: boolean = false;
    private masterStarted: boolean = false;
    private masterPreset: ClassPreset | null = null;
    private masterFightCycle = 1;
    private masterNextBleechDetection = 1;

    static player6 = option.text("player6", "Player 6", "Player 6 account name.", "");
    static player7 = option.text("player7", "Player 7 (Optional)", "Player 7 (Optional) account name.", "");

    runFromMaster(): boolean {
        try {
            return this.startFromMaster() && this.runOnceFromMaster();
        } finally {
            this.stopFromMaster();
        }
    }

    startFromMaster(): boolean {
        this.masterMode = true;
        this.masterStarted = false;
        this.masterPreset = null;
        this.masterFightCycle = 1;
        this.masterNextBleechDetection = 1;
        bot.skills.stop();
        bot.options.infiniteRange = true;

        if (!this.validateOptions()) {
            return false;
        }

        if (!LoneWolf.startArmySync(VoidXyfrag_LW.syncFileName, this.armyPlayerCount, "Setup")) {
            return false;
        }

        const preset = this.getClassPreset();
        if (this.armyComposition === ArmyComposition.Default && preset.capeEnhancement === CapeSpecial.Vainglory) {
            preset.capeEnhancement = CapeSpecial.Lament;
        }

        if (
            !LoneWolf.validateUltraAccess(
                0,
                0,
                "",
                VoidXyfrag_LW.minimumLevel,
                VoidXyfrag_LW.logPrefix,
                preset.className,
            )
        ) {
            return false;
        }

        this.playerAlias = this.getPlayerAlias();
        this.isTaunter = LoneWolf.isArmyPlayer(5);
        Core.logger(
            `${VoidXyfrag_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        this.updateDrops();

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return false;
        }

        Core.join(
            `${VoidXyfrag_LW.mapName}-${this.privateRoomNumber}`,
            VoidXyfrag_LW.fightCell,
            VoidXyfrag_LW.fightPad,
        );
        if (!this.prepareFightRoom(preset)) {
            return false;
        }

        if (
            this.isTaunter &&
            !LoneWolf.startPacketDetector(VoidXyfrag_LW.packetCommand, VoidXyfrag_LW.bleechPacketText)
        ) {
            return this.fatal("The Xyfrag packet detector could not be started.", "StartFromMaster");
        }

        if (!this.sync("FIGHT_READY")) {
            return false;
        }

        this.masterPreset = preset;
        this.masterStarted = true;
        return true;
    }

    runOnceFromMaster(): boolean {
        if (!this.masterStarted || this.masterPreset == null) {
            return false;
        }

        return this.runFightLoopWith(
            this.masterPreset,
            ref(
                () => this.masterFightCycle,
                (v) => (this.masterFightCycle = v),
            ),
            ref(
                () => this.masterNextBleechDetection,
                (v) => (this.masterNextBleechDetection = v),
            ),
        );
    }

    stopFromMaster(): void {
        LoneWolf.stopPacketDetector();
        LoneWolf.stopSkillEngine();
        this.masterPreset = null;
        this.masterStarted = false;
        this.masterFightCycle = 1;
        this.masterNextBleechDetection = 1;
        this.masterMode = false;
    }

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (
            !LoneWolf.startArmySync(VoidXyfrag_LW.syncFileName, this.armyPlayerCount, this.masterMode ? "Setup" : null)
        ) {
            return;
        }

        const preset = this.getClassPreset();
        if (this.armyComposition === ArmyComposition.Default && preset.capeEnhancement === CapeSpecial.Vainglory) {
            preset.capeEnhancement = CapeSpecial.Lament;
        }

        if (
            !LoneWolf.validateUltraAccess(
                0,
                0,
                "",
                VoidXyfrag_LW.minimumLevel,
                VoidXyfrag_LW.logPrefix,
                preset.className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        this.isTaunter = LoneWolf.isArmyPlayer(5);
        Core.logger(
            `${VoidXyfrag_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        this.updateDrops();

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        Core.join(
            `${VoidXyfrag_LW.mapName}-${this.privateRoomNumber}`,
            VoidXyfrag_LW.fightCell,
            VoidXyfrag_LW.fightPad,
        );
        if (!this.prepareFightRoom(preset)) {
            return;
        }

        if (
            this.isTaunter &&
            !LoneWolf.startPacketDetector(VoidXyfrag_LW.packetCommand, VoidXyfrag_LW.bleechPacketText)
        ) {
            this.fatal("The Xyfrag packet detector could not be started.", "Run");
            return;
        }

        try {
            if (!this.sync("FIGHT_READY") || !this.runFightLoop(preset)) {
                return;
            }
        } finally {
            LoneWolf.stopPacketDetector();
        }

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
    }

    private validateOptions(): boolean {
        this.armyComposition = this.getBossOption("XyfragComposition", "ArmyComposition");
        this.privateRoomNumber = this.getSetupOption("PrivateRoomNumber");
        this.farmXyfrag = this.masterMode ? false : configOr("FarmXyfrag", false);

        const playerSeven = this.getSetupOption<string>("player7")?.trim() ?? "";
        this.armyPlayerCount = !playerSeven ? 6 : 7;

        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${VoidXyfrag_LW.logPrefix} ${this.playerAlias} starting setup.`);

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
            LoneWolf.preparePotions(preset.tonic, preset.elixir, this.isTaunter ? null : preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.prepareScrolls(VoidXyfrag_LW.enrageScroll);
        }

        if (bot.shouldExit) {
            return false;
        }

        Core.logger(`${VoidXyfrag_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareFightRoom(preset: ClassPreset): boolean {
        if (this.getSetupOption("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, this.isTaunter ? null : preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.equipScroll(VoidXyfrag_LW.enrageScroll);
        }

        return !bot.shouldExit;
    }

    private runFightLoop(preset: ClassPreset): boolean {
        let fightCycle = 1;
        let nextBleechDetection = 1;

        return this.runFightLoopWith(
            preset,
            ref(
                () => fightCycle,
                (v) => (fightCycle = v),
            ),
            ref(
                () => nextBleechDetection,
                (v) => (nextBleechDetection = v),
            ),
        );
    }

    /** C#'s `RunFightLoop` overload with `ref` counters. */
    private runFightLoopWith(preset: ClassPreset, fightCycle: Ref<number>, nextBleechDetection: Ref<number>): boolean {
        let killCount = 0;

        while (!bot.shouldExit) {
            const result = this.fight(preset, fightCycle.value, nextBleechDetection);

            if (result === FightResult.Defeated) {
                killCount++;
                this.updateDrops();
                Core.logger(`${VoidXyfrag_LW.logPrefix} ${this.playerAlias} completed kill ${killCount}.`);

                fightCycle.value++;

                if (!this.farmXyfrag) {
                    return true;
                }

                if (!this.waitForRespawn(nextBleechDetection)) {
                    return false;
                }

                continue;
            }

            if (result !== FightResult.Reset || !this.handleFightReset(fightCycle.value, nextBleechDetection)) {
                return false;
            }

            fightCycle.value++;
        }

        return false;
    }

    private fight(preset: ClassPreset, fightCycle: number, nextBleechDetection: Ref<number>): FightResult {
        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            this.isTaunter,
            VoidXyfrag_LW.logPrefix,
            preset.skillMode,
        );
        Core.logger(`${VoidXyfrag_LW.logPrefix} ${this.playerAlias} started fight cycle ${fightCycle}.`);

        let bossObservedAlive = false;

        while (!bot.shouldExit) {
            if (LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount)) {
                this.stopFightCombat();
                return FightResult.Reset;
            }

            if (!bot.player.alive) {
                Core.logger(`${VoidXyfrag_LW.logPrefix} ${this.playerAlias} died.`);

                while (!bot.shouldExit && !bot.player.alive) {
                    this.processBleechDetections(nextBleechDetection, false);

                    if (LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount)) {
                        this.stopFightCombat();
                        return FightResult.Reset;
                    }

                    bot.sleep(VoidXyfrag_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    break;
                }

                if (LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount)) {
                    this.stopFightCombat();
                    return FightResult.Reset;
                }

                Core.logger(`${VoidXyfrag_LW.logPrefix} ${this.playerAlias} respawned.`);
                continue;
            }

            const bossAlive = LoneWolf.isMonsterAlive(VoidXyfrag_LW.bossMapId);
            if (bossAlive) {
                bossObservedAlive = true;
            } else if (bossObservedAlive) {
                break;
            }

            if (bossAlive) {
                LoneWolf.maintainTarget(VoidXyfrag_LW.bossMapId);
            }

            this.processBleechDetections(nextBleechDetection, bossAlive);
            bot.sleep(VoidXyfrag_LW.fightPollDelay);
        }

        this.stopFightCombat();

        if (bot.shouldExit || !bossObservedAlive) {
            return FightResult.Stopped;
        }

        Core.logger(`${VoidXyfrag_LW.logPrefix} ${this.playerAlias} confirmed Xyfrag defeated.`);
        return FightResult.Defeated;
    }

    private processBleechDetections(nextBleechDetection: Ref<number>, requestTaunt: boolean): void {
        if (!this.isTaunter) {
            return;
        }

        while (LoneWolf.hasPacketDetection(nextBleechDetection.value)) {
            if (requestTaunt) {
                LoneWolf.requestAbsolutePriorityTaunt(VoidXyfrag_LW.bossMapId);
                Core.logger(
                    `${VoidXyfrag_LW.logPrefix} ${this.playerAlias} requested absolute priority taunt for BLEECH detection ${nextBleechDetection.value}.`,
                );
            }

            nextBleechDetection.value++;
        }
    }

    private waitForRespawn(nextBleechDetection: Ref<number>): boolean {
        Core.logger(`${VoidXyfrag_LW.logPrefix} ${this.playerAlias} waiting for Xyfrag to respawn.`);

        while (!bot.shouldExit && !LoneWolf.isMonsterAlive(VoidXyfrag_LW.bossMapId)) {
            this.processBleechDetections(nextBleechDetection, false);
            bot.sleep(VoidXyfrag_LW.respawnPollDelay);
        }

        return !bot.shouldExit;
    }

    private handleFightReset(fightCycle: number, nextBleechDetection: Ref<number>): boolean {
        this.stopFightCombat();

        while (!bot.shouldExit && !bot.player.alive) {
            this.processBleechDetections(nextBleechDetection, false);
            LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount);
            bot.sleep(VoidXyfrag_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount);
        return this.sync(`FIGHT_RESET_${fightCycle}_READY`);
    }

    private updateDrops(): void {
        this.updateDrop(VoidXyfrag_LW.voidEnergy, true);
        this.updateDrop(VoidXyfrag_LW.slimyTooth, bot.quests.isInProgress(VoidXyfrag_LW.doomSpikesQuestId));
        this.updateDrop(
            VoidXyfrag_LW.xyfragEssence,
            bot.quests.isInProgress(VoidXyfrag_LW.wrongTurnQuestId),
            VoidXyfrag_LW.xyfragEssenceId,
        );

        if (!bot.drops.running) {
            bot.drops.start();
        }
    }

    private updateDrop(itemName: string, eligible: boolean, itemId = 0): void {
        if (eligible && !bot.inventory.isMaxStack(itemName)) {
            if (!bot.drops.toPickup.includes(itemName)) {
                Core.addDrop(itemName);
            }

            if (itemId > 0 && !bot.drops.toPickupIds.includes(itemId)) {
                Core.addDrop(itemId);
            }

            return;
        }

        Core.removeDrop(itemName);
        if (itemId > 0) {
            Core.removeDrop(itemId);
        }
    }

    private stopFightCombat(): void {
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();
    }

    private getClassPreset(): ClassPreset {
        if (LoneWolf.isArmyPlayer(1)) {
            if (this.armyComposition === ArmyComposition.Default) {
                return LoneWolf.kingsEcho();
            }

            return this.armyComposition === ArmyComposition.Stable ? LoneWolf.archFiend() : LoneWolf.legionRevenant();
        }

        if (LoneWolf.isArmyPlayer(2)) {
            return LoneWolf.stoneCrusher();
        }

        if (LoneWolf.isArmyPlayer(3)) {
            return LoneWolf.archPaladin();
        }

        if (LoneWolf.isArmyPlayer(4)) {
            return LoneWolf.lordOfOrder();
        }

        if (LoneWolf.isArmyPlayer(5)) {
            return LoneWolf.verusDoomKnight();
        }

        if (LoneWolf.isArmyPlayer(6)) {
            return LoneWolf.bard();
        }

        return this.armyComposition === ArmyComposition.Default ? LoneWolf.archFiend() : LoneWolf.shaman();
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

        if (LoneWolf.isArmyPlayer(4)) {
            return "playerFour";
        }

        if (LoneWolf.isArmyPlayer(5)) {
            return "playerFive";
        }

        if (LoneWolf.isArmyPlayer(6)) {
            return "playerSix";
        }

        return "playerSeven";
    }

    private getSetupOption<T extends string | number | boolean>(optionName: string): T {
        return (this.masterMode ? bot.config!.get<T>("Setup", optionName) : bot.config!.get<T>(optionName))!;
    }

    private getBossOption<T extends string | number | boolean>(
        masterOptionName: string,
        standaloneOptionName: string,
    ): T {
        return (
            this.masterMode
                ? bot.config!.get<T>("Void_Bosses", masterOptionName)
                : bot.config!.get<T>(standaloneOptionName)
        )!;
    }

    private sync(step: string): boolean {
        Core.logger(`${VoidXyfrag_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${VoidXyfrag_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private fatal(message: string, caller: string): boolean {
        Core.logger(message, caller, { messageBox: true, stopBot: true });
        return false;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${VoidXyfrag_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${VoidXyfrag_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${VoidXyfrag_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${VoidXyfrag_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "VoidXyfrag_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        LoneWolf.player5,
        VoidXyfrag_LW.player6,
        VoidXyfrag_LW.player7,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: KE / SC / AP / LOO / VDK / Bard / AF\n" +
                "Reliable: LR / SC / AP / LOO / VDK / Bard / Shaman\n" +
                "Stable: AF / SC / AP / LOO / VDK / Bard / Shaman",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool("FarmXyfrag", "Farm Xyfrag", "Farm Xyfrag repeatedly. Disable this to defeat Xyfrag once.", true),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadout.", true),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadout.", true),
    ],
    true,
);

export default function main(): void {
    const script = new VoidXyfrag_LW();
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
