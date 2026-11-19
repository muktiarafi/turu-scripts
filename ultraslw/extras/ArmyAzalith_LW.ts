/*
name: Army Azalith LW
description: Four-to-seven-player CoreLoneWolf Army script for Azalith.
tags: azalith, seven-player, army, corelonewolf
*/
// Port of Extras/ArmyAzalith_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { type ClassPreset, CoreLoneWolf, SkillEngineMode } from "../CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Pay2Win = "Pay2Win",
}

export class ArmyAzalith_LW {
    private static readonly logPrefix = "Army Azalith LW";
    private static readonly syncFileName = "ArmyAzalith_LW.sync";
    private static readonly mapName = "celestialpast";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly bossCell = "r11a";
    private static readonly bossPad = "Left";
    private static readonly bossMapId = 23;
    private static readonly fightPollDelay = 100;
    private static readonly respawnPollDelay = 500;

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private armyPlayerCount: number = 0;
    private privateRoomNumber: number = 0;
    private farmAzalith: boolean = false;

    static player5 = option.text("player5", "Player 5 (Optional)", "Player 5 (Optional) account name.", "");
    static player6 = option.text("player6", "Player 6 (Optional)", "Player 6 (Optional) account name.", "");
    static player7 = option.text("player7", "Player 7 (Optional)", "Player 7 (Optional) account name.", "");

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (!LoneWolf.startArmySync(ArmyAzalith_LW.syncFileName, this.armyPlayerCount)) {
            return;
        }

        if (!LoneWolf.validateHouseRequirements()) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        const preset = this.getClassPreset();
        Core.logger(
            `${ArmyAzalith_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        Core.join(
            `${ArmyAzalith_LW.mapName}-${this.privateRoomNumber}`,
            ArmyAzalith_LW.safeCell,
            ArmyAzalith_LW.safePad,
        );

        if (!this.prepareSafeRoom(preset)) {
            return;
        }

        Core.jump(ArmyAzalith_LW.bossCell, ArmyAzalith_LW.bossPad);

        if (!this.sync("FIGHT_READY") || !this.runFightLoop(preset)) {
            return;
        }

        Core.jump(ArmyAzalith_LW.safeCell, ArmyAzalith_LW.safePad);

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
    }

    private validateOptions(): boolean {
        this.armyComposition = bot.config!.get<ArmyComposition>("ArmyComposition");
        this.privateRoomNumber = bot.config.get<number>("PrivateRoomNumber");
        this.farmAzalith = bot.config.get<boolean>("FarmAzalith");

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
        Core.logger(`${ArmyAzalith_LW.logPrefix} ${this.playerAlias} starting setup.`);

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

        Core.logger(`${ArmyAzalith_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareSafeRoom(preset: ClassPreset): boolean {
        if (bot.config!.get<boolean>("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        return !bot.shouldExit;
    }

    private runFightLoop(preset: ClassPreset): boolean {
        let fightCycle = 1;

        while (!bot.shouldExit) {
            if (!this.fight(preset, fightCycle)) {
                return false;
            }

            Core.logger(`${ArmyAzalith_LW.logPrefix} ${this.playerAlias} completed kill ${fightCycle}.`);

            if (!this.sync(`AZALITH_${fightCycle}_DEFEATED`)) {
                return false;
            }

            if (!this.farmAzalith) {
                return true;
            }

            fightCycle++;

            if (!this.waitForAzalithRespawn()) {
                return false;
            }
        }

        return false;
    }

    private fight(preset: ClassPreset, fightCycle: number): boolean {
        LoneWolf.startSkillEngine(preset.skills, this.playerAlias, false, ArmyAzalith_LW.logPrefix, preset.skillMode);
        Core.logger(`${ArmyAzalith_LW.logPrefix} ${this.playerAlias} started fight cycle ${fightCycle}.`);

        let bossObservedAlive = false;

        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                Core.logger(`${ArmyAzalith_LW.logPrefix} ${this.playerAlias} died.`);

                while (!bot.shouldExit && !bot.player.alive) {
                    bot.sleep(ArmyAzalith_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    break;
                }

                Core.logger(`${ArmyAzalith_LW.logPrefix} ${this.playerAlias} respawned.`);
                Core.jump(ArmyAzalith_LW.bossCell, ArmyAzalith_LW.bossPad);
                continue;
            }

            const bossAlive = LoneWolf.isMonsterAlive(ArmyAzalith_LW.bossMapId);
            if (bossAlive) {
                bossObservedAlive = true;
            } else if (bossObservedAlive) {
                break;
            }

            if (bossAlive) {
                LoneWolf.maintainTarget(ArmyAzalith_LW.bossMapId);
            }

            bot.sleep(ArmyAzalith_LW.fightPollDelay);
        }

        this.stopFightCombat();

        if (bot.shouldExit || !bossObservedAlive) {
            return false;
        }

        Core.logger(`${ArmyAzalith_LW.logPrefix} ${this.playerAlias} confirmed Azalith defeated.`);
        return true;
    }

    private waitForAzalithRespawn(): boolean {
        Core.logger(`${ArmyAzalith_LW.logPrefix} ${this.playerAlias} waiting for Azalith to respawn.`);

        while (!bot.shouldExit && !LoneWolf.isMonsterAlive(ArmyAzalith_LW.bossMapId)) {
            bot.sleep(ArmyAzalith_LW.respawnPollDelay);
        }

        return !bot.shouldExit;
    }

    private stopFightCombat(): void {
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();
    }

    private getClassPreset(): ClassPreset {
        if (this.armyComposition === ArmyComposition.Pay2Win) {
            if (LoneWolf.isArmyPlayer(1)) {
                return LoneWolf.ssot();
            }

            if (LoneWolf.isArmyPlayer(2)) {
                return LoneWolf.stoneCrusher();
            }

            if (LoneWolf.isArmyPlayer(3)) {
                return LoneWolf.legionRevenant();
            }

            if (LoneWolf.isArmyPlayer(4)) {
                return LoneWolf.lordOfOrder();
            }

            if (LoneWolf.isArmyPlayer(5)) {
                return LoneWolf.bard();
            }

            if (LoneWolf.isArmyPlayer(6)) {
                return LoneWolf.verusDoomKnight();
            }

            return LoneWolf.archPaladin();
        }

        if (LoneWolf.isArmyPlayer(1)) {
            const preset = LoneWolf.imperialChunin();
            preset.weaponEnhancement = WeaponSpecial.Praxis;
            return preset;
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
            const preset = LoneWolf.shaman();

            if (this.armyComposition === ArmyComposition.Default && this.armyPlayerCount === 7) {
                preset.skills = [4, 1, 2, 3];
                preset.skillMode = SkillEngineMode.Simple;
            }

            preset.helmEnhancement = HelmSpecial.Examen;
            return preset;
        }

        if (LoneWolf.isArmyPlayer(6)) {
            return LoneWolf.verusDoomKnight();
        }

        return LoneWolf.bard();
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
        Core.logger(`${ArmyAzalith_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${ArmyAzalith_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${ArmyAzalith_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${ArmyAzalith_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${ArmyAzalith_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${ArmyAzalith_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "ArmyAzalith_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        ArmyAzalith_LW.player5,
        ArmyAzalith_LW.player6,
        ArmyAzalith_LW.player7,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: IC / SC / AP / LOO / Shaman / VDK / Bard\nPay2Win: SSOT / SC / LR / LOO / Bard / VDK / AP",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool("FarmAzalith", "Farm Azalith", "Farm Azalith repeatedly. Disable this to defeat it once.", false),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadout.", true),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadout.", true),
    ],
    true,
);

export default function main(): void {
    const script = new ArmyAzalith_LW();
    bot.skills.stop();
    bot.options.infiniteRange = true;
    bot.options.skipCutscenes = true;
    LoneWolf.setAntiLag();
    bot.config?.configure();

    try {
        script.run();
    } finally {
        LoneWolf.stopSkillEngine();
    }
}
