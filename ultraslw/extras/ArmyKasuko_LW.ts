/*
name: Army Kasuko LW
description: Four-to-seven-player CoreLoneWolf Army script for Kasuko.
tags: kasuko, seven-player, army, corelonewolf
*/
// Port of Extras/ArmyKasuko_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { type ClassPreset, CoreLoneWolf } from "../CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
}

export enum FightResult {
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export class ArmyKasuko_LW {
    private static readonly logPrefix = "Army Kasuko LW";
    private static readonly syncFileName = "ArmyKasuko_LW.sync";
    private static readonly mapName = "lavarockshore";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly bossCell = "r2";
    private static readonly bossPad = "Left";
    private static readonly dailyQuestId = 9254;
    private static readonly minimumLevel = 75;
    private static readonly firstTargetMapId = 1;
    private static readonly secondTargetMapId = 2;
    private static readonly fightPollDelay = 100;
    private static readonly respawnPollDelay = 500;
    private static readonly maxFightAttempts = 3;
    private static readonly deathResetThreshold = 3;

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private armyPlayerCount: number = 0;
    private privateRoomNumber: number = 0;

    static player5 = option.text("player5", "Player 5 (Optional)", "Player 5 (Optional) account name.", "");
    static player6 = option.text("player6", "Player 6 (Optional)", "Player 6 (Optional) account name.", "");
    static player7 = option.text("player7", "Player 7 (Optional)", "Player 7 (Optional) account name.", "");

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (!LoneWolf.startArmySync(ArmyKasuko_LW.syncFileName, this.armyPlayerCount)) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        const preset = this.getClassPreset();

        if (
            !LoneWolf.validateUltraAccess(
                ArmyKasuko_LW.dailyQuestId,
                0,
                "",
                ArmyKasuko_LW.minimumLevel,
                ArmyKasuko_LW.logPrefix,
                preset.className,
            )
        ) {
            return;
        }

        Core.logger(
            `${ArmyKasuko_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        LoneWolf.acceptUltraQuest(ArmyKasuko_LW.dailyQuestId);

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        if (!this.runFightAttempts(preset) || !this.sync("BOSS_DEFEATED")) {
            return;
        }

        Core.jump(ArmyKasuko_LW.safeCell, ArmyKasuko_LW.safePad);
        LoneWolf.completeUltraQuest(ArmyKasuko_LW.dailyQuestId);

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
    }

    private validateOptions(): boolean {
        this.armyComposition = bot.config!.get<ArmyComposition>("ArmyComposition");
        this.privateRoomNumber = bot.config.get<number>("PrivateRoomNumber");

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
        Core.logger(`${ArmyKasuko_LW.logPrefix} ${this.playerAlias} starting setup.`);

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
            LoneWolf.preparePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (bot.shouldExit) {
            return false;
        }

        Core.logger(`${ArmyKasuko_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareSafeRoom(preset: ClassPreset): boolean {
        if (bot.config!.get<boolean>("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        LoneWolf.genericPrebuff();
        return !bot.shouldExit;
    }

    private runFightAttempts(preset: ClassPreset): boolean {
        for (let fightAttempt = 1; fightAttempt <= ArmyKasuko_LW.maxFightAttempts && !bot.shouldExit; fightAttempt++) {
            Core.join(
                `${ArmyKasuko_LW.mapName}-${this.privateRoomNumber}`,
                ArmyKasuko_LW.safeCell,
                ArmyKasuko_LW.safePad,
            );

            if (!this.prepareSafeRoom(preset) || !this.sync("FIGHT_READY")) {
                return false;
            }

            Core.jump(ArmyKasuko_LW.bossCell, ArmyKasuko_LW.bossPad);

            if (bot.shouldExit || !this.sync("START_FIGHT")) {
                return false;
            }

            const result = this.fight(preset, fightAttempt);
            if (result === FightResult.Defeated) {
                return true;
            }

            if (result !== FightResult.Reset || !this.handleFightReset(fightAttempt)) {
                return false;
            }

            if (fightAttempt >= ArmyKasuko_LW.maxFightAttempts) {
                this.stopArmyAfterFailedAttempts();
                return false;
            }
        }

        return false;
    }

    private fight(preset: ClassPreset, fightAttempt: number): FightResult {
        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            false,
            ArmyKasuko_LW.logPrefix,
            preset.skillMode,
            undefined,
            bot.config!.get<boolean>("UsePotions") ? preset.combatPotion : null,
        );
        Core.logger(`${ArmyKasuko_LW.logPrefix} ${this.playerAlias} started fighting attempt ${fightAttempt}.`);

        let kasukoObservedAlive = false;

        while (!bot.shouldExit) {
            if (LoneWolf.shouldResetFight(fightAttempt, ArmyKasuko_LW.deathResetThreshold)) {
                this.stopFightCombat();
                return FightResult.Reset;
            }

            if (!bot.player.alive) {
                Core.logger(`${ArmyKasuko_LW.logPrefix} ${this.playerAlias} died.`);

                while (!bot.shouldExit && !bot.player.alive) {
                    if (LoneWolf.shouldResetFight(fightAttempt, ArmyKasuko_LW.deathResetThreshold)) {
                        this.stopFightCombat();
                        return FightResult.Reset;
                    }

                    bot.sleep(ArmyKasuko_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    break;
                }

                if (LoneWolf.shouldResetFight(fightAttempt, ArmyKasuko_LW.deathResetThreshold)) {
                    this.stopFightCombat();
                    return FightResult.Reset;
                }

                Core.logger(`${ArmyKasuko_LW.logPrefix} ${this.playerAlias} respawned.`);

                if (bot.player.cell !== ArmyKasuko_LW.bossCell || bot.player.pad !== ArmyKasuko_LW.bossPad) {
                    Core.jump(ArmyKasuko_LW.bossCell, ArmyKasuko_LW.bossPad);
                }

                continue;
            }

            const firstTargetAlive = LoneWolf.isMonsterAlive(ArmyKasuko_LW.firstTargetMapId);
            const secondTargetAlive = LoneWolf.isMonsterAlive(ArmyKasuko_LW.secondTargetMapId);

            if (secondTargetAlive) {
                kasukoObservedAlive = true;
            } else if (kasukoObservedAlive) {
                break;
            }

            if (firstTargetAlive) {
                LoneWolf.maintainTarget(ArmyKasuko_LW.firstTargetMapId);
            } else if (secondTargetAlive) {
                LoneWolf.maintainTarget(ArmyKasuko_LW.secondTargetMapId);
            }

            bot.sleep(ArmyKasuko_LW.fightPollDelay);
        }

        this.stopFightCombat();

        if (bot.shouldExit || !kasukoObservedAlive) {
            return FightResult.Stopped;
        }

        Core.logger(`${ArmyKasuko_LW.logPrefix} ${this.playerAlias} confirmed Kasuko encounter defeated.`);
        return FightResult.Defeated;
    }

    private handleFightReset(fightAttempt: number): boolean {
        this.stopFightCombat();

        while (!bot.shouldExit && !bot.player.alive) {
            LoneWolf.shouldResetFight(fightAttempt, ArmyKasuko_LW.deathResetThreshold);
            bot.sleep(ArmyKasuko_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightAttempt, ArmyKasuko_LW.deathResetThreshold);
        Core.jump(ArmyKasuko_LW.safeCell, ArmyKasuko_LW.safePad);

        if (!this.isInSafeRoom()) {
            Core.logger(
                `${ArmyKasuko_LW.logPrefix} ${this.playerAlias} could not reach the safe room after reset.`,
                "HandleFightReset",
                { messageBox: true, stopBot: true },
            );
            return false;
        }

        return this.sync(`FIGHT_RESET_${fightAttempt}_SAFE`);
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

    private isInSafeRoom(): boolean {
        return bot.player.cell?.toLowerCase() === ArmyKasuko_LW.safeCell?.toLowerCase();
    }

    private sync(step: string): boolean {
        Core.logger(`${ArmyKasuko_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${ArmyKasuko_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmyAfterFailedAttempts(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            LoneWolf.stopArmySync("ATTEMPTS_EXHAUSTED");
        } else {
            LoneWolf.syncArmy("STOP_CHECK");
        }

        Core.logger(
            `${ArmyKasuko_LW.logPrefix} failed after ${ArmyKasuko_LW.maxFightAttempts} fight attempts.`,
            "RunFightAttempts",
            { messageBox: true, stopBot: true },
        );
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${ArmyKasuko_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${ArmyKasuko_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${ArmyKasuko_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${ArmyKasuko_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "ArmyKasuko_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        ArmyKasuko_LW.player5,
        ArmyKasuko_LW.player6,
        ArmyKasuko_LW.player7,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO / VDK / Bard / Shaman",
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
    const script = new ArmyKasuko_LW();
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
