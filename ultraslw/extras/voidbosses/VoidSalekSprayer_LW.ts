/*
name: Void Salek Sprayer LW
description: Four-to-seven-player CoreLoneWolf Army script for Void Salek Sprayer.
tags: void, salek sprayer, challenge boss, seven-player, army, corelonewolf
*/
// Port of Extras/VoidBosses/VoidSalekSprayer_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, ref } from "../../LWRef";
import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../../core/CoreBots";
import { type ClassPreset, CoreLoneWolf } from "../../CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
}

export enum FightResult {
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export class VoidSalekSprayer_LW {
    private static readonly logPrefix = "Void Salek Sprayer LW";
    private static readonly syncFileName = "VoidSalekSprayer_LW.sync";
    private static readonly mapName = "voidsalek";
    private static readonly fightCell = "Enter";
    private static readonly fightPad = "Spawn";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly packetCommand = "ct";
    private static readonly extinguishPacketText = "EXTINGUISH";
    private static readonly voidEnergy = "Void Energy";
    private static readonly salekDefeated = "Salek Sprayer Defeated";
    private static readonly spoilOfSalek = "Spoil of Salek";
    private static readonly surrenderQuestId = 9905;
    private static readonly surrenderLegendQuestId = 9909;
    private static readonly fiendsPurgatoryQuestId = 10790;
    private static readonly minimumLevel = 80;
    private static readonly bossMapId = 1;
    private static readonly tauntDelayMilliseconds = 5000;
    private static readonly fightPollDelay = 100;
    private static readonly respawnPollDelay = 500;

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private armyPlayerCount: number = 0;
    private privateRoomNumber: number = 0;
    private farmSalekSprayer: boolean = false;
    private isTaunter: boolean = false;

    static player5 = option.text("player5", "Player 5 (Optional)", "Player 5 (Optional) account name.", "");
    static player6 = option.text("player6", "Player 6 (Optional)", "Player 6 (Optional) account name.", "");
    static player7 = option.text("player7", "Player 7 (Optional)", "Player 7 (Optional) account name.", "");

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (!LoneWolf.startArmySync(VoidSalekSprayer_LW.syncFileName, this.armyPlayerCount)) {
            return;
        }

        const preset = this.getClassPreset();
        if (
            !LoneWolf.validateUltraAccess(
                0,
                0,
                "",
                VoidSalekSprayer_LW.minimumLevel,
                VoidSalekSprayer_LW.logPrefix,
                preset.className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        this.isTaunter = LoneWolf.isArmyPlayer(1);
        Core.logger(
            `${VoidSalekSprayer_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        this.updateDrops();

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        Core.join(
            `${VoidSalekSprayer_LW.mapName}-${this.privateRoomNumber}`,
            VoidSalekSprayer_LW.fightCell,
            VoidSalekSprayer_LW.fightPad,
        );
        if (!this.prepareFightRoom(preset)) {
            return;
        }

        if (
            this.isTaunter &&
            !LoneWolf.startPacketDetector(VoidSalekSprayer_LW.packetCommand, VoidSalekSprayer_LW.extinguishPacketText)
        ) {
            this.fatal("The Salek Sprayer packet detector could not be started.", "Run");
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
        this.farmSalekSprayer = bot.config.get<boolean>("FarmSalekSprayer");

        const playerFive = bot.config.get<string>("player5")?.trim() ?? "";
        const playerSix = bot.config.get<string>("player6")?.trim() ?? "";
        const playerSeven = bot.config.get<string>("player7")?.trim() ?? "";

        if (!playerFive && (!!playerSix || !!playerSeven)) {
            Core.logger("Player 5 is required when Player 6 or Player 7 is configured.", "ValidateOptions", {
                messageBox: true,
            });
            return false;
        }

        if (!playerSix && !!playerSeven) {
            Core.logger("Player 6 is required when Player 7 is configured.", "ValidateOptions", { messageBox: true });
            return false;
        }

        this.armyPlayerCount = !!playerSeven ? 7 : !!playerSix ? 6 : !!playerFive ? 5 : 4;

        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${VoidSalekSprayer_LW.logPrefix} ${this.playerAlias} starting setup.`);

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
            LoneWolf.prepareScrolls(VoidSalekSprayer_LW.enrageScroll);
        }

        if (bot.shouldExit) {
            return false;
        }

        Core.logger(`${VoidSalekSprayer_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareFightRoom(preset: ClassPreset): boolean {
        if (bot.config!.get<boolean>("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, this.isTaunter ? null : preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.equipScroll(VoidSalekSprayer_LW.enrageScroll);
        }

        return !bot.shouldExit;
    }

    private runFightLoop(preset: ClassPreset): boolean {
        let fightCycle = 1;
        let killCount = 0;
        let nextExtinguishDetection = 1;

        while (!bot.shouldExit) {
            const result = this.fight(
                preset,
                fightCycle,
                ref(
                    () => nextExtinguishDetection,
                    (v) => (nextExtinguishDetection = v),
                ),
            );

            if (result === FightResult.Defeated) {
                killCount++;
                this.updateDrops();
                Core.logger(`${VoidSalekSprayer_LW.logPrefix} ${this.playerAlias} completed kill ${killCount}.`);

                if (!this.farmSalekSprayer) {
                    return true;
                }

                if (
                    !this.waitForRespawn(
                        ref(
                            () => nextExtinguishDetection,
                            (v) => (nextExtinguishDetection = v),
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
                        () => nextExtinguishDetection,
                        (v) => (nextExtinguishDetection = v),
                    ),
                )
            ) {
                return false;
            }

            fightCycle++;
        }

        return false;
    }

    private fight(preset: ClassPreset, fightCycle: number, nextExtinguishDetection: Ref<number>): FightResult {
        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            this.isTaunter,
            VoidSalekSprayer_LW.logPrefix,
            preset.skillMode,
        );
        Core.logger(`${VoidSalekSprayer_LW.logPrefix} ${this.playerAlias} started fight cycle ${fightCycle}.`);

        let bossObservedAlive = false;
        let tauntDue: number | null = null;
        let scheduledDetection = 0;

        while (!bot.shouldExit) {
            if (LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount)) {
                this.stopFightCombat();
                return FightResult.Reset;
            }

            if (!bot.player.alive) {
                Core.logger(`${VoidSalekSprayer_LW.logPrefix} ${this.playerAlias} died.`);

                while (!bot.shouldExit && !bot.player.alive) {
                    this.processTauntCycle(
                        nextExtinguishDetection,
                        ref(
                            () => tauntDue,
                            (v) => (tauntDue = v),
                        ),
                        ref(
                            () => scheduledDetection,
                            (v) => (scheduledDetection = v),
                        ),
                        false,
                    );

                    if (LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount)) {
                        this.stopFightCombat();
                        return FightResult.Reset;
                    }

                    bot.sleep(VoidSalekSprayer_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    break;
                }

                if (LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount)) {
                    this.stopFightCombat();
                    return FightResult.Reset;
                }

                Core.logger(`${VoidSalekSprayer_LW.logPrefix} ${this.playerAlias} respawned.`);
                continue;
            }

            const bossAlive = LoneWolf.isMonsterAlive(VoidSalekSprayer_LW.bossMapId);
            if (bossAlive && !bossObservedAlive) {
                bossObservedAlive = true;
                if (this.isTaunter) {
                    this.drainExtinguishDetections(nextExtinguishDetection);
                    tauntDue = Date.now() + VoidSalekSprayer_LW.tauntDelayMilliseconds;
                    scheduledDetection = 0;
                    Core.logger(
                        `${VoidSalekSprayer_LW.logPrefix} ${this.playerAlias} scheduled the opening taunt in ${VoidSalekSprayer_LW.tauntDelayMilliseconds}ms.`,
                    );
                }
            } else if (!bossAlive && bossObservedAlive) {
                break;
            }

            if (bossAlive) {
                LoneWolf.maintainTarget(VoidSalekSprayer_LW.bossMapId);
            }

            this.processTauntCycle(
                nextExtinguishDetection,
                ref(
                    () => tauntDue,
                    (v) => (tauntDue = v),
                ),
                ref(
                    () => scheduledDetection,
                    (v) => (scheduledDetection = v),
                ),
                bossAlive,
            );
            bot.sleep(VoidSalekSprayer_LW.fightPollDelay);
        }

        this.stopFightCombat();

        if (bot.shouldExit || !bossObservedAlive) {
            return FightResult.Stopped;
        }

        Core.logger(`${VoidSalekSprayer_LW.logPrefix} ${this.playerAlias} confirmed Salek Sprayer defeated.`);
        return FightResult.Defeated;
    }

    private processTauntCycle(
        nextExtinguishDetection: Ref<number>,
        tauntDue: Ref<number | null>,
        scheduledDetection: Ref<number>,
        canRequestTaunt: boolean,
    ): void {
        if (!this.isTaunter) {
            return;
        }

        if (!canRequestTaunt) {
            this.drainExtinguishDetections(nextExtinguishDetection);
            return;
        }

        if (tauntDue.value != null) {
            this.drainExtinguishDetections(nextExtinguishDetection);
            if (Date.now() < tauntDue.value) {
                return;
            }

            LoneWolf.requestAbsolutePriorityTaunt(VoidSalekSprayer_LW.bossMapId);
            const source =
                scheduledDetection.value === 0 ? "opening timer" : `EXTINGUISH detection ${scheduledDetection.value}`;
            Core.logger(
                `${VoidSalekSprayer_LW.logPrefix} ${this.playerAlias} requested absolute priority taunt for ${source}.`,
            );
            tauntDue.value = null;
            return;
        }

        if (!LoneWolf.hasPacketDetection(nextExtinguishDetection.value)) {
            return;
        }

        scheduledDetection.value = nextExtinguishDetection.value;
        nextExtinguishDetection.value++;
        tauntDue.value = Date.now() + VoidSalekSprayer_LW.tauntDelayMilliseconds;
        this.drainExtinguishDetections(nextExtinguishDetection);
        Core.logger(
            `${VoidSalekSprayer_LW.logPrefix} ${this.playerAlias} detected EXTINGUISH ${scheduledDetection.value} and scheduled a taunt in ${VoidSalekSprayer_LW.tauntDelayMilliseconds}ms.`,
        );
    }

    private drainExtinguishDetections(nextExtinguishDetection: Ref<number>): void {
        if (!this.isTaunter) {
            return;
        }

        while (LoneWolf.hasPacketDetection(nextExtinguishDetection.value)) {
            nextExtinguishDetection.value++;
        }
    }

    private waitForRespawn(nextExtinguishDetection: Ref<number>): boolean {
        Core.logger(`${VoidSalekSprayer_LW.logPrefix} ${this.playerAlias} waiting for Salek Sprayer to respawn.`);

        while (!bot.shouldExit && !LoneWolf.isMonsterAlive(VoidSalekSprayer_LW.bossMapId)) {
            this.drainExtinguishDetections(nextExtinguishDetection);
            bot.sleep(VoidSalekSprayer_LW.respawnPollDelay);
        }

        return !bot.shouldExit;
    }

    private handleFightReset(fightCycle: number, nextExtinguishDetection: Ref<number>): boolean {
        this.stopFightCombat();

        while (!bot.shouldExit && !bot.player.alive) {
            this.drainExtinguishDetections(nextExtinguishDetection);
            LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount);
            bot.sleep(VoidSalekSprayer_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        this.drainExtinguishDetections(nextExtinguishDetection);
        LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount);
        return this.sync(`FIGHT_RESET_${fightCycle}_READY`);
    }

    private updateDrops(): void {
        this.updateDrop(VoidSalekSprayer_LW.voidEnergy, true);
        this.updateDrop(
            VoidSalekSprayer_LW.salekDefeated,
            bot.quests.isInProgress(VoidSalekSprayer_LW.surrenderQuestId) ||
                bot.quests.isInProgress(VoidSalekSprayer_LW.surrenderLegendQuestId),
        );
        this.updateDrop(
            VoidSalekSprayer_LW.spoilOfSalek,
            bot.quests.isInProgress(VoidSalekSprayer_LW.fiendsPurgatoryQuestId),
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
            return LoneWolf.legionRevenant();
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

        return LoneWolf.shaman();
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
        Core.logger(`${VoidSalekSprayer_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${VoidSalekSprayer_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
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
                Core.logger(`${VoidSalekSprayer_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${VoidSalekSprayer_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${VoidSalekSprayer_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${VoidSalekSprayer_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "VoidSalekSprayer_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        VoidSalekSprayer_LW.player5,
        VoidSalekSprayer_LW.player6,
        VoidSalekSprayer_LW.player7,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO / VDK / Bard / Shaman",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool(
            "FarmSalekSprayer",
            "Farm Salek Sprayer",
            "Farm Salek Sprayer repeatedly. Disable this to defeat it once.",
            false,
        ),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadout.", true),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadout.", true),
    ],
    true,
);

export default function main(): void {
    const script = new VoidSalekSprayer_LW();
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
