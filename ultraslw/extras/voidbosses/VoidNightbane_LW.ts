/*
name: Void Nightbane LW
description: Four-to-seven-player CoreLoneWolf Army script for Void Nightbane
tags: void, nightbane, challenge boss, seven-player, army, corelonewolf
*/
// Port of Extras/VoidBosses/VoidNightbane_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
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

export class VoidNightbane_LW {
    private static readonly logPrefix = "Void Nightbane LW";
    private static readonly syncFileName = "VoidNightbane_LW.sync";
    private static readonly mapName = "voidnightbane";
    private static readonly fightCell = "Enter";
    private static readonly fightPad = "Spawn";
    private static readonly voidEnergy = "Void Energy";
    private static readonly insatiableHunger = "Insatiable Hunger";
    private static readonly starlitJournalPage3Scraps = "Starlit Journal Page 3 Scraps";
    private static readonly nightbaneEssence = "Nightbane's ??? Essence";
    private static readonly nightbaneEssenceId = 73862;
    private static readonly celestialSkiesQuestId = 7713;
    private static readonly wrongTurnQuestId = 9091;
    private static readonly minimumLevel = 80;
    private static readonly bossMapId = 1;
    private static readonly fightPollDelay = 100;
    private static readonly respawnPollDelay = 500;

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private armyPlayerCount: number = 0;
    private privateRoomNumber: number = 0;
    private farmNightbane: boolean = false;
    private masterMode: boolean = false;
    private masterStarted: boolean = false;
    private masterPreset: ClassPreset | null = null;
    private masterFightCycle = 1;

    static player5 = option.text("player5", "Player 5 (Optional)", "Player 5 (Optional) account name.", "");
    static player6 = option.text("player6", "Player 6 (Optional)", "Player 6 (Optional) account name.", "");
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
        bot.skills.stop();
        bot.options.infiniteRange = true;

        if (!this.validateOptions()) {
            return false;
        }

        if (!LoneWolf.startArmySync(VoidNightbane_LW.syncFileName, this.armyPlayerCount, "Setup")) {
            return false;
        }

        const preset = this.getClassPreset();
        if (preset.capeEnhancement === CapeSpecial.Vainglory) {
            preset.capeEnhancement = CapeSpecial.Lament;
        }

        if (
            !LoneWolf.validateUltraAccess(
                0,
                0,
                "",
                VoidNightbane_LW.minimumLevel,
                VoidNightbane_LW.logPrefix,
                preset.className,
            )
        ) {
            return false;
        }

        this.playerAlias = this.getPlayerAlias();
        Core.logger(
            `${VoidNightbane_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        this.updateDrops();

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return false;
        }

        Core.join(
            `${VoidNightbane_LW.mapName}-${this.privateRoomNumber}`,
            VoidNightbane_LW.fightCell,
            VoidNightbane_LW.fightPad,
        );
        if (!this.prepareFightRoom(preset) || !this.sync("FIGHT_READY")) {
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
        );
    }

    stopFromMaster(): void {
        LoneWolf.stopSkillEngine();
        this.masterPreset = null;
        this.masterStarted = false;
        this.masterFightCycle = 1;
        this.masterMode = false;
    }

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (
            !LoneWolf.startArmySync(
                VoidNightbane_LW.syncFileName,
                this.armyPlayerCount,
                this.masterMode ? "Setup" : null,
            )
        ) {
            return;
        }

        const preset = this.getClassPreset();
        if (preset.capeEnhancement === CapeSpecial.Vainglory) {
            preset.capeEnhancement = CapeSpecial.Lament;
        }

        if (
            !LoneWolf.validateUltraAccess(
                0,
                0,
                "",
                VoidNightbane_LW.minimumLevel,
                VoidNightbane_LW.logPrefix,
                preset.className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        Core.logger(
            `${VoidNightbane_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        this.updateDrops();

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        Core.join(
            `${VoidNightbane_LW.mapName}-${this.privateRoomNumber}`,
            VoidNightbane_LW.fightCell,
            VoidNightbane_LW.fightPad,
        );
        if (!this.prepareFightRoom(preset)) {
            return;
        }

        if (!this.sync("FIGHT_READY") || !this.runFightLoop(preset)) {
            return;
        }

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
    }

    private validateOptions(): boolean {
        this.armyComposition = this.getBossOption("NightbaneComposition", "ArmyComposition");
        this.privateRoomNumber = this.getSetupOption("PrivateRoomNumber");
        this.farmNightbane = this.masterMode ? false : configOr("FarmNightbane", false);

        const playerFive = this.getSetupOption<string>("player5")?.trim() ?? "";
        const playerSix = this.getSetupOption<string>("player6")?.trim() ?? "";
        const playerSeven = this.getSetupOption<string>("player7")?.trim() ?? "";

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
        Core.logger(`${VoidNightbane_LW.logPrefix} ${this.playerAlias} starting setup.`);

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

        if (bot.shouldExit) {
            return false;
        }

        this.warnIfVaingloryCapeIsEquipped();
        Core.logger(`${VoidNightbane_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private warnIfVaingloryCapeIsEquipped(): void {
        for (const item of bot.inventory.items) {
            if (
                !item.equipped ||
                !(item.category?.toLowerCase() === "Cape"?.toLowerCase()) ||
                item.enhancementPatternId !== CapeSpecial.Vainglory
            ) {
                continue;
            }

            Core.logger("Vainglory is enhanced on the cape. Void Nightbane will fail.", "Prepare", {
                messageBox: true,
            });
            return;
        }
    }

    private prepareFightRoom(preset: ClassPreset): boolean {
        if (this.getSetupOption("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        return !bot.shouldExit;
    }

    private runFightLoop(preset: ClassPreset): boolean {
        let fightCycle = 1;

        return this.runFightLoopWith(
            preset,
            ref(
                () => fightCycle,
                (v) => (fightCycle = v),
            ),
        );
    }

    /** C#'s `RunFightLoop` overload with `ref` counters. */
    private runFightLoopWith(preset: ClassPreset, fightCycle: Ref<number>): boolean {
        let killCount = 0;

        while (!bot.shouldExit) {
            const result = this.fight(preset, fightCycle.value);

            if (result === FightResult.Defeated) {
                killCount++;
                this.updateDrops();
                Core.logger(`${VoidNightbane_LW.logPrefix} ${this.playerAlias} completed kill ${killCount}.`);

                fightCycle.value++;

                if (!this.farmNightbane) {
                    return true;
                }

                if (!this.waitForRespawn()) {
                    return false;
                }

                continue;
            }

            if (result !== FightResult.Reset || !this.handleFightReset(fightCycle.value)) {
                return false;
            }

            fightCycle.value++;
        }

        return false;
    }

    private fight(preset: ClassPreset, fightCycle: number): FightResult {
        LoneWolf.startSkillEngine(preset.skills, this.playerAlias, false, VoidNightbane_LW.logPrefix, preset.skillMode);
        Core.logger(`${VoidNightbane_LW.logPrefix} ${this.playerAlias} started fight cycle ${fightCycle}.`);

        let bossObservedAlive = false;

        while (!bot.shouldExit) {
            if (LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount)) {
                this.stopFightCombat();
                return FightResult.Reset;
            }

            if (!bot.player.alive) {
                Core.logger(`${VoidNightbane_LW.logPrefix} ${this.playerAlias} died.`);

                while (!bot.shouldExit && !bot.player.alive) {
                    if (LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount)) {
                        this.stopFightCombat();
                        return FightResult.Reset;
                    }

                    bot.sleep(VoidNightbane_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    break;
                }

                if (LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount)) {
                    this.stopFightCombat();
                    return FightResult.Reset;
                }

                Core.logger(`${VoidNightbane_LW.logPrefix} ${this.playerAlias} respawned.`);
                continue;
            }

            const bossAlive = LoneWolf.isMonsterAlive(VoidNightbane_LW.bossMapId);
            if (bossAlive) {
                bossObservedAlive = true;
            } else if (bossObservedAlive) {
                break;
            }

            if (bossAlive) {
                LoneWolf.maintainTarget(VoidNightbane_LW.bossMapId);
            }

            bot.sleep(VoidNightbane_LW.fightPollDelay);
        }

        this.stopFightCombat();

        if (bot.shouldExit || !bossObservedAlive) {
            return FightResult.Stopped;
        }

        Core.logger(`${VoidNightbane_LW.logPrefix} ${this.playerAlias} confirmed Nightbane defeated.`);
        return FightResult.Defeated;
    }

    private waitForRespawn(): boolean {
        Core.logger(`${VoidNightbane_LW.logPrefix} ${this.playerAlias} waiting for Nightbane to respawn.`);

        while (!bot.shouldExit && !LoneWolf.isMonsterAlive(VoidNightbane_LW.bossMapId)) {
            bot.sleep(VoidNightbane_LW.respawnPollDelay);
        }

        return !bot.shouldExit;
    }

    private handleFightReset(fightCycle: number): boolean {
        this.stopFightCombat();

        while (!bot.shouldExit && !bot.player.alive) {
            LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount);
            bot.sleep(VoidNightbane_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightCycle, this.armyPlayerCount);
        return this.sync(`FIGHT_RESET_${fightCycle}_READY`);
    }

    private updateDrops(): void {
        this.updateDrop(VoidNightbane_LW.voidEnergy, true);
        this.updateDrop(VoidNightbane_LW.insatiableHunger, true);
        this.updateDrop(
            VoidNightbane_LW.starlitJournalPage3Scraps,
            bot.quests.isInProgress(VoidNightbane_LW.celestialSkiesQuestId),
        );
        this.updateDrop(
            VoidNightbane_LW.nightbaneEssence,
            bot.quests.isInProgress(VoidNightbane_LW.wrongTurnQuestId),
            VoidNightbane_LW.nightbaneEssenceId,
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
            return this.armyComposition === ArmyComposition.Reliable ? LoneWolf.legionRevenant() : LoneWolf.kingsEcho();
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

        return this.armyComposition === ArmyComposition.Reliable ? LoneWolf.shaman() : LoneWolf.archFiend();
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
        Core.logger(`${VoidNightbane_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${VoidNightbane_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${VoidNightbane_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${VoidNightbane_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${VoidNightbane_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${VoidNightbane_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "VoidNightbane_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        VoidNightbane_LW.player5,
        VoidNightbane_LW.player6,
        VoidNightbane_LW.player7,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: KE / SC / AP / LOO / VDK / Bard / AF\n" +
                "Reliable: LR / SC / AP / LOO / VDK / Bard / Shaman\n" +
                "Stable: KE / SC / AP / LOO / VDK / Bard / AF",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool(
            "FarmNightbane",
            "Farm Nightbane",
            "Farm Nightbane repeatedly. Disable this to defeat it once.",
            true,
        ),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadout.", true),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadout.", true),
    ],
    true,
);

export default function main(): void {
    const script = new VoidNightbane_LW();
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
