/*
name: Champion Drakath LW
description: Four-player CoreLoneWolf Army script for Champion Drakath.
tags: ultra, champion drakath, weekly, army, corelonewolf
*/
// Port of UltraDrakath_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { CapeSpecial, HelmSpecial, WeaponSpecial } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";
import { type ClassPreset, CoreLoneWolf, UltraRunResult } from "./CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Stable = "Stable",
    Reliable = "Reliable",
    Optimized = "Optimized",
    Pay2Win = "Pay2Win",
    Pay2Win2 = "Pay2Win2",
    Pay2Win3 = "Pay2Win3",
}

export enum FightResult {
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export class UltraDrakath_LW {
    private static readonly stoneCrusherTauntThresholds: number[] = [16500000, 12500000, 6200000];

    private static readonly archPaladinTauntThresholds: number[] = [18500000, 14500000, 8200000, 4200000];

    private static readonly adjustedStoneCrusherTauntThresholds: number[] = [16500000, 12500000, 6500000];

    private static readonly adjustedArchPaladinTauntThresholds: number[] = [18500000, 14500000, 8500000, 4500000];

    private static readonly pay2WinLegionRevenantTauntThresholds: number[] = [18500000, 14500000];

    private static readonly pay2WinArchPaladinTauntThresholds: number[] = [
        16500000, 12500000, 8500000, 6500000, 4500000,
    ];

    private static readonly pay2Win2PaladinChronomancerTauntThresholds: number[] = [
        18500000, 14500000, 8500000, 6500000, 4500000,
    ];

    private static readonly pay2Win2LordOfOrderTauntThresholds: number[] = [16500000, 12500000];

    private static readonly logPrefix = "Champion Drakath LW";
    private static readonly syncFileName = "UltraDrakath_LW.sync";
    private static readonly mapName = "championdrakath";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly bossCell = "r2";
    private static readonly bossPad = "Left";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly ultraQuestId = 8300;
    private static readonly prerequisiteQuestId = 3881;
    private static readonly prerequisiteQuestName = "The Final Showdown!";
    private static readonly minimumLevel = 80;
    private static readonly bossMapId = 1;
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

        if (!LoneWolf.startArmySync(UltraDrakath_LW.syncFileName, 4, this.masterMode ? "Setup" : null)) {
            return;
        }

        if (
            !LoneWolf.validateUltraAccess(
                UltraDrakath_LW.ultraQuestId,
                UltraDrakath_LW.prerequisiteQuestId,
                UltraDrakath_LW.prerequisiteQuestName,
                UltraDrakath_LW.minimumLevel,
                UltraDrakath_LW.logPrefix,
                this.getClassPreset().className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        this.isTaunter =
            this.armyComposition === ArmyComposition.Pay2Win2 || this.armyComposition === ArmyComposition.Pay2Win3
                ? LoneWolf.isArmyPlayer(2) || LoneWolf.isArmyPlayer(4)
                : LoneWolf.isArmyPlayer(2) || LoneWolf.isArmyPlayer(3);

        const preset = this.getClassPreset();
        if (LoneWolf.isArmyPlayer(1) && this.armyComposition === ArmyComposition.Pay2Win3) {
            preset.capeEnhancement = CapeSpecial.Lament;
        }

        if (this.armyComposition === ArmyComposition.Pay2Win2 || this.armyComposition === ArmyComposition.Pay2Win3) {
            if (LoneWolf.isArmyPlayer(2)) {
                preset.capeEnhancement = CapeSpecial.Lament;
            } else if (LoneWolf.isArmyPlayer(3)) {
                preset.weaponEnhancement = WeaponSpecial.Ravenous;
                preset.helmEnhancement = HelmSpecial.None;
                preset.capeEnhancement = CapeSpecial.Lament;
                preset.combatPotion = "Felicitous Philtre";
            } else if (LoneWolf.isArmyPlayer(4)) {
                preset.helmEnhancement = HelmSpecial.Forge;
            }
        } else if (this.armyComposition === ArmyComposition.Pay2Win) {
            if (LoneWolf.isArmyPlayer(2)) {
                preset.weaponEnhancement = WeaponSpecial.Valiance;
                preset.capeEnhancement = CapeSpecial.Lament;
            } else if (LoneWolf.isArmyPlayer(3)) {
                preset.weaponEnhancement = WeaponSpecial.Ravenous;
                preset.helmEnhancement = HelmSpecial.None;
                preset.capeEnhancement = CapeSpecial.Lament;
                preset.tonic = "Fate Tonic";
            } else if (LoneWolf.isArmyPlayer(4)) {
                preset.combatPotion = "Felicitous Philtre";
            }
        } else {
            if (
                LoneWolf.isArmyPlayer(3) ||
                ((this.armyComposition === ArmyComposition.Default ||
                    this.armyComposition === ArmyComposition.Reliable) &&
                    LoneWolf.isArmyPlayer(1))
            ) {
                preset.capeEnhancement = CapeSpecial.Penitence;
            } else if (preset.capeEnhancement === CapeSpecial.Vainglory) {
                preset.capeEnhancement = CapeSpecial.Lament;
            }
        }

        if (this.isTaunter) {
            preset.combatPotion = null;
        }

        Core.logger(
            `${UltraDrakath_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        LoneWolf.acceptUltraQuest(UltraDrakath_LW.ultraQuestId);

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        if (!this.runFightAttempts(preset) || !this.sync("BOSS_DEFEATED")) {
            return;
        }

        Core.jump(UltraDrakath_LW.safeCell, UltraDrakath_LW.safePad);

        LoneWolf.completeUltraQuest(UltraDrakath_LW.ultraQuestId);

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
        this.runResult = UltraRunResult.Completed;
    }

    private runFightAttempts(preset: ClassPreset): boolean {
        for (
            let fightAttempt = 1;
            fightAttempt <= UltraDrakath_LW.maxFightAttempts && !bot.shouldExit;
            fightAttempt++
        ) {
            Core.join(
                `${UltraDrakath_LW.mapName}-${this.privateRoomNumber}`,
                UltraDrakath_LW.safeCell,
                UltraDrakath_LW.safePad,
            );

            if (!this.prepareSafeRoom(preset) || !this.sync("FIGHT_READY")) {
                return false;
            }

            Core.jump(UltraDrakath_LW.bossCell, UltraDrakath_LW.bossPad);

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

            if (fightAttempt >= UltraDrakath_LW.maxFightAttempts) {
                this.stopArmyAfterFailedAttempts();
                this.runResult = UltraRunResult.AttemptsExhausted;
                return false;
            }
        }

        return false;
    }

    private validateOptions(): boolean {
        this.armyComposition = this.getUltraOption("ChampionDrakathComposition", "ArmyComposition");
        this.privateRoomNumber = this.getSetupOption("PrivateRoomNumber");
        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${UltraDrakath_LW.logPrefix} ${this.playerAlias} starting setup.`);

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
            if (
                (this.armyComposition === ArmyComposition.Pay2Win2 ||
                    this.armyComposition === ArmyComposition.Pay2Win3) &&
                LoneWolf.isArmyPlayer(2)
            ) {
                preset.elixir = LoneWolf.getDivineElixir(preset, this.playerAlias, UltraDrakath_LW.logPrefix);
            }

            LoneWolf.preparePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.prepareScrolls(UltraDrakath_LW.enrageScroll);
        }

        if (bot.shouldExit) {
            return false;
        }

        Core.logger(`${UltraDrakath_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareSafeRoom(preset: ClassPreset): boolean {
        if (this.getSetupOption("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.equipScroll(UltraDrakath_LW.enrageScroll);
        }

        if (
            (this.armyComposition !== ArmyComposition.Pay2Win2 && this.armyComposition !== ArmyComposition.Pay2Win3) ||
            !LoneWolf.isArmyPlayer(2)
        ) {
            LoneWolf.genericPrebuff();
        }

        return !bot.shouldExit;
    }

    private fight(preset: ClassPreset, fightAttempt: number): FightResult {
        const tauntThresholds = this.getTauntThresholds();
        let tauntIndex = 0;

        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            this.isTaunter,
            UltraDrakath_LW.logPrefix,
            preset.skillMode,
            undefined,
            !this.isTaunter && this.getSetupOption("UsePotions") ? preset.combatPotion : null,
        );
        Core.logger(`${UltraDrakath_LW.logPrefix} ${this.playerAlias} started fighting.`);

        while (!bot.shouldExit) {
            if (!LoneWolf.isMonsterAlive(UltraDrakath_LW.bossMapId)) {
                break;
            }

            if (LoneWolf.shouldResetFight(fightAttempt)) {
                LoneWolf.stopSkillEngine();
                return FightResult.Reset;
            }

            if (!bot.player.alive) {
                Core.logger(`${UltraDrakath_LW.logPrefix} ${this.playerAlias} died.`);

                while (!bot.shouldExit && !bot.player.alive) {
                    if (LoneWolf.shouldResetFight(fightAttempt)) {
                        LoneWolf.stopSkillEngine();
                        return FightResult.Reset;
                    }

                    bot.sleep(UltraDrakath_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    break;
                }

                if (!LoneWolf.isMonsterAlive(UltraDrakath_LW.bossMapId)) {
                    break;
                }

                if (LoneWolf.shouldResetFight(fightAttempt)) {
                    LoneWolf.stopSkillEngine();
                    return FightResult.Reset;
                }

                Core.logger(`${UltraDrakath_LW.logPrefix} ${this.playerAlias} respawned.`);

                if (
                    LoneWolf.isMonsterAlive(UltraDrakath_LW.bossMapId) &&
                    (bot.player.cell !== UltraDrakath_LW.bossCell || bot.player.pad !== UltraDrakath_LW.bossPad)
                ) {
                    Core.jump(UltraDrakath_LW.bossCell, UltraDrakath_LW.bossPad);
                }

                continue;
            }

            const bossHealth = LoneWolf.getMonsterHP(UltraDrakath_LW.bossMapId);
            LoneWolf.maintainTarget(UltraDrakath_LW.bossMapId);

            if (tauntIndex < tauntThresholds.length && bossHealth > 0 && bossHealth <= tauntThresholds[tauntIndex]) {
                const threshold = tauntThresholds[tauntIndex];
                LoneWolf.requestAbsolutePriorityTaunt(UltraDrakath_LW.bossMapId);
                tauntIndex++;
                Core.logger(`${UltraDrakath_LW.logPrefix} ${this.playerAlias} requested taunt at ${threshold} HP.`);
            }

            bot.sleep(UltraDrakath_LW.fightPollDelay);
        }

        LoneWolf.stopSkillEngine();

        if (bot.shouldExit) {
            return FightResult.Stopped;
        }

        Core.logger(`${UltraDrakath_LW.logPrefix} ${this.playerAlias} confirmed Champion Drakath defeated.`);
        return FightResult.Defeated;
    }

    private handleFightReset(fightAttempt: number): boolean {
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();

        while (!bot.shouldExit && !bot.player.alive) {
            LoneWolf.shouldResetFight(fightAttempt);
            bot.sleep(UltraDrakath_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightAttempt);
        Core.jump(UltraDrakath_LW.safeCell, UltraDrakath_LW.safePad);

        if (!this.isInSafeRoom()) {
            Core.logger(
                `${UltraDrakath_LW.logPrefix} ${this.playerAlias} could not reach the safe room after reset.`,
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
                `${UltraDrakath_LW.logPrefix} failed after ${UltraDrakath_LW.maxFightAttempts} fight attempts.`,
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
            `${UltraDrakath_LW.logPrefix} failed after ${UltraDrakath_LW.maxFightAttempts} fight attempts.`,
            "RunFightAttempts",
            { messageBox: true, stopBot: true },
        );
    }

    private isInSafeRoom(): boolean {
        return bot.player.cell?.toLowerCase() === UltraDrakath_LW.safeCell?.toLowerCase();
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

    private getTauntThresholds(): number[] {
        if (this.armyComposition === ArmyComposition.Pay2Win) {
            if (LoneWolf.isArmyPlayer(2)) {
                return UltraDrakath_LW.pay2WinArchPaladinTauntThresholds;
            }

            return LoneWolf.isArmyPlayer(3) ? UltraDrakath_LW.pay2WinLegionRevenantTauntThresholds : [];
        }

        if (this.armyComposition === ArmyComposition.Pay2Win2 || this.armyComposition === ArmyComposition.Pay2Win3) {
            if (LoneWolf.isArmyPlayer(2)) {
                return UltraDrakath_LW.pay2Win2PaladinChronomancerTauntThresholds;
            }

            return LoneWolf.isArmyPlayer(4) ? UltraDrakath_LW.pay2Win2LordOfOrderTauntThresholds : [];
        }

        if (LoneWolf.isArmyPlayer(2)) {
            return this.armyComposition === ArmyComposition.Stable
                ? UltraDrakath_LW.adjustedStoneCrusherTauntThresholds
                : UltraDrakath_LW.stoneCrusherTauntThresholds;
        }

        if (LoneWolf.isArmyPlayer(3)) {
            return this.armyComposition === ArmyComposition.Stable
                ? UltraDrakath_LW.adjustedArchPaladinTauntThresholds
                : UltraDrakath_LW.archPaladinTauntThresholds;
        }

        return [];
    }

    private getClassPreset(): ClassPreset {
        if (LoneWolf.isArmyPlayer(1)) {
            return this.armyComposition === ArmyComposition.Stable
                ? LoneWolf.kingsEcho()
                : this.armyComposition === ArmyComposition.Reliable
                  ? LoneWolf.verusDoomKnight()
                  : this.armyComposition === ArmyComposition.Optimized
                    ? LoneWolf.chaosSlayer()
                    : this.armyComposition === ArmyComposition.Pay2Win
                      ? LoneWolf.guardian()
                      : this.armyComposition === ArmyComposition.Pay2Win2
                        ? LoneWolf.guardian()
                        : this.armyComposition === ArmyComposition.Pay2Win3
                          ? LoneWolf.martialArtist()
                          : LoneWolf.legionRevenant();
        }

        if (LoneWolf.isArmyPlayer(2)) {
            return this.armyComposition === ArmyComposition.Pay2Win
                ? LoneWolf.archPaladin()
                : this.armyComposition === ArmyComposition.Pay2Win2
                  ? LoneWolf.paladinChronomancer()
                  : this.armyComposition === ArmyComposition.Pay2Win3
                    ? LoneWolf.paladinChronomancer()
                    : LoneWolf.stoneCrusher();
        }

        if (LoneWolf.isArmyPlayer(3)) {
            return this.armyComposition === ArmyComposition.Pay2Win ||
                this.armyComposition === ArmyComposition.Pay2Win2 ||
                this.armyComposition === ArmyComposition.Pay2Win3
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
        Core.logger(`${UltraDrakath_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${UltraDrakath_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${UltraDrakath_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${UltraDrakath_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${UltraDrakath_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${UltraDrakath_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "UltraDrakath_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nOptimized: Chaos Slayer / SC / AP / LOO\nPay2Win: Guardian / AP / LR / LOO\nPay2Win2: Guardian / PCM / LR / LOO\nPay2Win3: Martial Artist / PCM / LR / LOO",
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
    const script = new UltraDrakath_LW();
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
