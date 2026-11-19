/*
name: Void Nerfkitten LW
description: Six-to-seven-player CoreLoneWolf Army script for Void Nerfkitten.
tags: void, nerfkitten, challenge boss, seven-player, army, corelonewolf
*/
// Port of Extras/VoidBosses/VoidNerfkitten_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, ref } from "../../LWRef";
import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../../core/CoreBots";
import { type ClassPreset, CoreLoneWolf } from "../../CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Stable = "Stable",
}

export enum FightResult {
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export class VoidNerfkitten_LW {
    private static readonly logPrefix = "Void Nerfkitten LW";
    private static readonly syncFileName = "VoidNerfkitten_LW.sync";
    private static readonly mapName = "voidnerfkitten";
    private static readonly fightCell = "Enter";
    private static readonly fightPad = "Spawn";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly packetCommand = "ct";
    private static readonly meowPacketText = "Meow";
    private static readonly voidEnergy = "Void Energy";
    private static readonly nerfkittenFang = "Nerfkitten's Fang";
    private static readonly sarahSouvenir = "Sarah's Souvenir";
    private static readonly doomSpikesQuestId = 9418;
    private static readonly fiendsPurgatoryQuestId = 10790;
    private static readonly minimumLevel = 80;
    private static readonly bossMapId = 1;
    private static readonly fightPollDelay = 100;
    private static readonly respawnPollDelay = 500;

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private armyPlayerCount: number = 0;
    private privateRoomNumber: number = 0;
    private farmNerfkitten: boolean = false;
    private isTaunter: boolean = false;

    static player6 = option.text("player6", "Player 6", "Player 6 account name.", "");
    static player7 = option.text("player7", "Player 7 (Optional)", "Player 7 (Optional) account name.", "");

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (!LoneWolf.startArmySync(VoidNerfkitten_LW.syncFileName, this.armyPlayerCount)) {
            return;
        }

        const preset = this.getClassPreset();
        if (
            !LoneWolf.validateUltraAccess(
                0,
                0,
                "",
                VoidNerfkitten_LW.minimumLevel,
                VoidNerfkitten_LW.logPrefix,
                preset.className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        this.isTaunter =
            this.armyComposition === ArmyComposition.Stable ? LoneWolf.isArmyPlayer(5) : LoneWolf.isArmyPlayer(1);
        Core.logger(
            `${VoidNerfkitten_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        this.updateDrops();

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        Core.join(
            `${VoidNerfkitten_LW.mapName}-${this.privateRoomNumber}`,
            VoidNerfkitten_LW.fightCell,
            VoidNerfkitten_LW.fightPad,
        );
        if (!this.prepareFightRoom(preset)) {
            return;
        }

        if (
            this.isTaunter &&
            !LoneWolf.startPacketDetector(VoidNerfkitten_LW.packetCommand, VoidNerfkitten_LW.meowPacketText)
        ) {
            this.fatal("The Sarah packet detector could not be started.", "Run");
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
        this.armyComposition = bot.config!.get<ArmyComposition>("ArmyComposition");
        this.privateRoomNumber = bot.config.get<number>("PrivateRoomNumber");
        this.farmNerfkitten = bot.config.get<boolean>("FarmNerfkitten");

        const playerSeven = bot.config.get<string>("player7")?.trim() ?? "";
        this.armyPlayerCount = !playerSeven ? 6 : 7;

        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${VoidNerfkitten_LW.logPrefix} ${this.playerAlias} starting setup.`);

        LoneWolf.equipClass(preset);
        if (bot.shouldExit) {
            return false;
        }

        if (bot.config!.get<boolean>("UseEnhancements")) {
            LoneWolf.prepareEnhancements(
                preset.baseEnhancement,
                preset.capeEnhancement,
                preset.helmEnhancement,
                preset.weaponEnhancement,
                undefined,
                preset.weaponEnhancementFallbacks,
            );
        }

        if (bot.config.get<boolean>("UsePotions")) {
            LoneWolf.preparePotions(preset.tonic, preset.elixir, this.isTaunter ? null : preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.prepareScrolls(VoidNerfkitten_LW.enrageScroll);
        }

        if (bot.shouldExit) {
            return false;
        }

        Core.logger(`${VoidNerfkitten_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareFightRoom(preset: ClassPreset): boolean {
        if (bot.config!.get<boolean>("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, this.isTaunter ? null : preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.equipScroll(VoidNerfkitten_LW.enrageScroll);
        }

        return !bot.shouldExit;
    }

    private runFightLoop(preset: ClassPreset): boolean {
        let fightCycle = 1;
        let killCount = 0;
        let nextMeowDetection = 1;

        while (!bot.shouldExit) {
            const result = this.fight(
                preset,
                fightCycle,
                ref(
                    () => nextMeowDetection,
                    (v) => (nextMeowDetection = v),
                ),
            );

            if (result === FightResult.Defeated) {
                killCount++;
                this.updateDrops();
                Core.logger(`${VoidNerfkitten_LW.logPrefix} ${this.playerAlias} completed kill ${killCount}.`);

                if (!this.farmNerfkitten) {
                    return true;
                }

                if (
                    !this.waitForRespawn(
                        ref(
                            () => nextMeowDetection,
                            (v) => (nextMeowDetection = v),
                        ),
                    )
                ) {
                    return false;
                }

                fightCycle++;
                continue;
            }

            if (
                result !== FightResult.Reset ||
                !this.handleFightReset(
                    fightCycle,
                    ref(
                        () => nextMeowDetection,
                        (v) => (nextMeowDetection = v),
                    ),
                )
            ) {
                return false;
            }

            fightCycle++;
        }

        return false;
    }

    private fight(preset: ClassPreset, fightCycle: number, nextMeowDetection: Ref<number>): FightResult {
        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            this.isTaunter,
            VoidNerfkitten_LW.logPrefix,
            preset.skillMode,
        );
        Core.logger(`${VoidNerfkitten_LW.logPrefix} ${this.playerAlias} started fight cycle ${fightCycle}.`);

        let bossObservedAlive = false;

        while (!bot.shouldExit) {
            if (LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount)) {
                this.stopFightCombat();
                return FightResult.Reset;
            }

            if (!bot.player.alive) {
                Core.logger(`${VoidNerfkitten_LW.logPrefix} ${this.playerAlias} died.`);

                while (!bot.shouldExit && !bot.player.alive) {
                    this.processMeowDetections(nextMeowDetection, false);

                    if (LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount)) {
                        this.stopFightCombat();
                        return FightResult.Reset;
                    }

                    bot.sleep(VoidNerfkitten_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    break;
                }

                if (LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount)) {
                    this.stopFightCombat();
                    return FightResult.Reset;
                }

                Core.logger(`${VoidNerfkitten_LW.logPrefix} ${this.playerAlias} respawned.`);
                continue;
            }

            const bossAlive = LoneWolf.isMonsterAlive(VoidNerfkitten_LW.bossMapId);
            if (bossAlive) {
                bossObservedAlive = true;
            } else if (bossObservedAlive) {
                break;
            }

            if (bossAlive) {
                LoneWolf.maintainTarget(VoidNerfkitten_LW.bossMapId);
            }

            this.processMeowDetections(nextMeowDetection, bossAlive);
            bot.sleep(VoidNerfkitten_LW.fightPollDelay);
        }

        this.stopFightCombat();

        if (bot.shouldExit || !bossObservedAlive) {
            return FightResult.Stopped;
        }

        Core.logger(`${VoidNerfkitten_LW.logPrefix} ${this.playerAlias} confirmed Sarah defeated.`);
        return FightResult.Defeated;
    }

    private processMeowDetections(nextMeowDetection: Ref<number>, requestTaunt: boolean): void {
        if (!this.isTaunter) {
            return;
        }

        while (LoneWolf.hasPacketDetection(nextMeowDetection.value)) {
            if (requestTaunt) {
                LoneWolf.requestAbsolutePriorityTaunt(VoidNerfkitten_LW.bossMapId);
                Core.logger(
                    `${VoidNerfkitten_LW.logPrefix} ${this.playerAlias} requested absolute priority taunt for Meow detection ${nextMeowDetection.value}.`,
                );
            }

            nextMeowDetection.value++;
        }
    }

    private waitForRespawn(nextMeowDetection: Ref<number>): boolean {
        Core.logger(`${VoidNerfkitten_LW.logPrefix} ${this.playerAlias} waiting for Sarah to respawn.`);

        while (!bot.shouldExit && !LoneWolf.isMonsterAlive(VoidNerfkitten_LW.bossMapId)) {
            this.processMeowDetections(nextMeowDetection, false);
            bot.sleep(VoidNerfkitten_LW.respawnPollDelay);
        }

        return !bot.shouldExit;
    }

    private handleFightReset(fightCycle: number, nextMeowDetection: Ref<number>): boolean {
        this.stopFightCombat();

        while (!bot.shouldExit && !bot.player.alive) {
            this.processMeowDetections(nextMeowDetection, false);
            LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount);
            bot.sleep(VoidNerfkitten_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount);
        return this.sync(`FIGHT_RESET_${fightCycle}_READY`);
    }

    private updateDrops(): void {
        this.updateDrop(VoidNerfkitten_LW.voidEnergy, true);
        this.updateDrop(VoidNerfkitten_LW.nerfkittenFang, bot.quests.isInProgress(VoidNerfkitten_LW.doomSpikesQuestId));
        this.updateDrop(
            VoidNerfkitten_LW.sarahSouvenir,
            bot.quests.isInProgress(VoidNerfkitten_LW.fiendsPurgatoryQuestId),
        );
    }

    private updateDrop(itemName: string, eligible: boolean): void {
        if (eligible && !bot.inventory.isMaxStack(itemName)) {
            if (!bot.drops.toPickup.includes(itemName)) {
                Core.addDrop(itemName);
            }

            return;
        }

        Core.removeDrop(itemName);
    }

    private stopFightCombat(): void {
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();
    }

    private getClassPreset(): ClassPreset {
        if (LoneWolf.isArmyPlayer(1)) {
            return this.armyComposition === ArmyComposition.Stable ? LoneWolf.kingsEcho() : LoneWolf.legionRevenant();
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

        return this.armyComposition === ArmyComposition.Stable ? LoneWolf.archFiend() : LoneWolf.shaman();
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

    private sync(step: string): boolean {
        Core.logger(`${VoidNerfkitten_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${VoidNerfkitten_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
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
                Core.logger(`${VoidNerfkitten_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${VoidNerfkitten_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${VoidNerfkitten_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${VoidNerfkitten_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "VoidNerfkitten_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        LoneWolf.player5,
        VoidNerfkitten_LW.player6,
        VoidNerfkitten_LW.player7,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO / VDK / Bard / Shaman\n" + "Stable: KE / SC / AP / LOO / VDK / Bard / AF",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool(
            "FarmNerfkitten",
            "Farm Sarah the NerfKitten",
            "Farm Sarah repeatedly. Disable this to defeat Sarah once.",
            true,
        ),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadout.", true),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadout.", true),
    ],
    true,
);

export default function main(): void {
    const script = new VoidNerfkitten_LW();
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
