/*
name: Ultra Warden LW
description: Four-player CoreLoneWolf Army script for Ultra Warden.
tags: ultra, warden, army, corelonewolf
*/
// Port of Dailies/UltraWarden_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { type ClassPreset, CoreLoneWolf, UltraRunResult } from "../CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Stable = "Stable",
    Reliable = "Reliable",
    Pay2Win = "Pay2Win",
    Abyssal = "Abyssal",
}

export enum FightResult {
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export class UltraWarden_LW {
    private static readonly logPrefix = "Ultra Warden LW";
    private static readonly syncFileName = "UltraWarden_LW.sync";
    private static readonly mapName = "ultrawarden";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly bossCell = "r2";
    private static readonly bossPad = "Left";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly ultraQuestId = 8153;
    private static readonly prerequisiteQuestId = 8151;
    private static readonly prerequisiteQuestName = "The Engineer";
    private static readonly minimumLevel = 61;
    private static readonly monsterMapId = 1;
    private static readonly tauntHealth = 500000;
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

        if (!LoneWolf.startArmySync(UltraWarden_LW.syncFileName, 4, this.masterMode ? "Setup" : null)) {
            return;
        }

        if (
            !LoneWolf.validateUltraAccess(
                UltraWarden_LW.ultraQuestId,
                UltraWarden_LW.prerequisiteQuestId,
                UltraWarden_LW.prerequisiteQuestName,
                UltraWarden_LW.minimumLevel,
                UltraWarden_LW.logPrefix,
                this.getClassPreset().className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        const taunterPlayer =
            this.armyComposition === ArmyComposition.Stable || this.armyComposition === ArmyComposition.Pay2Win ? 2 : 1;
        this.isTaunter = LoneWolf.isArmyPlayer(taunterPlayer);

        const preset = this.getClassPreset();
        if (this.isTaunter) {
            preset.combatPotion = null;
        }

        Core.logger(
            `${UltraWarden_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        LoneWolf.acceptUltraQuest(UltraWarden_LW.ultraQuestId);

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        if (!this.runFightAttempts(preset) || !this.sync("BOSS_DEFEATED")) {
            return;
        }

        Core.jump(UltraWarden_LW.safeCell, UltraWarden_LW.safePad);

        LoneWolf.completeUltraQuest(UltraWarden_LW.ultraQuestId);

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
        this.runResult = UltraRunResult.Completed;
    }

    private runFightAttempts(preset: ClassPreset): boolean {
        for (let fightAttempt = 1; fightAttempt <= UltraWarden_LW.maxFightAttempts && !bot.shouldExit; fightAttempt++) {
            Core.join(
                `${UltraWarden_LW.mapName}-${this.privateRoomNumber}`,
                UltraWarden_LW.safeCell,
                UltraWarden_LW.safePad,
            );

            if (!this.prepareSafeRoom(preset) || !this.sync("FIGHT_READY")) {
                return false;
            }

            Core.jump(UltraWarden_LW.bossCell, UltraWarden_LW.bossPad);

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

            if (fightAttempt >= UltraWarden_LW.maxFightAttempts) {
                this.stopArmyAfterFailedAttempts();
                this.runResult = UltraRunResult.AttemptsExhausted;
                return false;
            }
        }

        return false;
    }

    private validateOptions(): boolean {
        this.armyComposition = this.getUltraOption("UltraWardenComposition", "ArmyComposition");
        this.privateRoomNumber = this.getSetupOption("PrivateRoomNumber");
        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${UltraWarden_LW.logPrefix} ${this.playerAlias} starting setup.`);

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
            LoneWolf.prepareScrolls(UltraWarden_LW.enrageScroll);
        }

        if (bot.shouldExit) {
            return false;
        }

        Core.logger(`${UltraWarden_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareSafeRoom(preset: ClassPreset): boolean {
        if (this.getSetupOption("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.equipScroll(UltraWarden_LW.enrageScroll);
        }

        LoneWolf.genericPrebuff();
        return !bot.shouldExit;
    }

    private fight(preset: ClassPreset, fightAttempt: number): FightResult {
        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            this.isTaunter,
            UltraWarden_LW.logPrefix,
            preset.skillMode,
            this.armyComposition !== ArmyComposition.Stable && this.armyComposition !== ArmyComposition.Pay2Win,
        );
        Core.logger(`${UltraWarden_LW.logPrefix} ${this.playerAlias} started fighting.`);

        let tauntRequested = false;

        while (!bot.shouldExit) {
            if (!LoneWolf.isMonsterAlive(UltraWarden_LW.monsterMapId)) {
                break;
            }

            if (LoneWolf.shouldResetFight(fightAttempt)) {
                LoneWolf.stopSkillEngine();
                return FightResult.Reset;
            }

            if (!bot.player.alive) {
                Core.logger(`${UltraWarden_LW.logPrefix} ${this.playerAlias} died.`);

                while (!bot.shouldExit && !bot.player.alive) {
                    if (LoneWolf.shouldResetFight(fightAttempt)) {
                        LoneWolf.stopSkillEngine();
                        return FightResult.Reset;
                    }

                    bot.sleep(UltraWarden_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    break;
                }

                if (!LoneWolf.isMonsterAlive(UltraWarden_LW.monsterMapId)) {
                    break;
                }

                if (LoneWolf.shouldResetFight(fightAttempt)) {
                    LoneWolf.stopSkillEngine();
                    return FightResult.Reset;
                }

                Core.logger(`${UltraWarden_LW.logPrefix} ${this.playerAlias} respawned.`);

                if (
                    LoneWolf.isMonsterAlive(UltraWarden_LW.monsterMapId) &&
                    (bot.player.cell !== UltraWarden_LW.bossCell || bot.player.pad !== UltraWarden_LW.bossPad)
                ) {
                    Core.jump(UltraWarden_LW.bossCell, UltraWarden_LW.bossPad);
                }

                continue;
            }

            const monsterHealth = LoneWolf.getMonsterHP(UltraWarden_LW.monsterMapId);
            LoneWolf.maintainTarget(UltraWarden_LW.monsterMapId);

            if (this.isTaunter && !tauntRequested && monsterHealth > 0 && monsterHealth <= UltraWarden_LW.tauntHealth) {
                LoneWolf.requestTaunt(UltraWarden_LW.monsterMapId);
                tauntRequested = true;
                Core.logger(`${UltraWarden_LW.logPrefix} ${this.playerAlias} requested the Warden taunt.`);
            }

            bot.sleep(UltraWarden_LW.fightPollDelay);
        }

        LoneWolf.stopSkillEngine();

        if (bot.shouldExit) {
            return FightResult.Stopped;
        }

        Core.logger(`${UltraWarden_LW.logPrefix} ${this.playerAlias} confirmed Ultra Warden defeated.`);
        return FightResult.Defeated;
    }

    private handleFightReset(fightAttempt: number): boolean {
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();

        while (!bot.shouldExit && !bot.player.alive) {
            LoneWolf.shouldResetFight(fightAttempt);
            bot.sleep(UltraWarden_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightAttempt);
        Core.jump(UltraWarden_LW.safeCell, UltraWarden_LW.safePad);

        if (!this.isInSafeRoom()) {
            Core.logger(
                `${UltraWarden_LW.logPrefix} ${this.playerAlias} could not reach the safe room after reset.`,
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
                `${UltraWarden_LW.logPrefix} failed after ${UltraWarden_LW.maxFightAttempts} fight attempts.`,
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
            `${UltraWarden_LW.logPrefix} failed after ${UltraWarden_LW.maxFightAttempts} fight attempts.`,
            "RunFightAttempts",
            { messageBox: true, stopBot: true },
        );
    }

    private isInSafeRoom(): boolean {
        return bot.player.cell?.toLowerCase() === UltraWarden_LW.safeCell?.toLowerCase();
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
            return this.armyComposition === ArmyComposition.Stable
                ? LoneWolf.kingsEcho()
                : this.armyComposition === ArmyComposition.Reliable
                  ? LoneWolf.verusDoomKnight()
                  : this.armyComposition === ArmyComposition.Pay2Win
                    ? LoneWolf.guardian()
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
        Core.logger(`${UltraWarden_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${UltraWarden_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${UltraWarden_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${UltraWarden_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${UltraWarden_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${UltraWarden_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "UltraWarden_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nPay2Win: Guardian / AP / LR / LOO\nAbyssal: Kathool Adept / SC / AP / LOO",
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
    const script = new UltraWarden_LW();
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
