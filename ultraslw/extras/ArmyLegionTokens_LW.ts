/*
name: Army Legion Tokens LW
description: Four-to-seven-player Legion Token farm with optional helper accounts.
tags: legion token, legionarena, first class entertainment, army, corelonewolf
*/
// Port of Extras/ArmyLegionTokens_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { HelmSpecial } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { ClassPreset, CoreLoneWolf } from "../CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Stable = "Stable",
    Unselected = "Unselected",
}

export class ArmyLegionTokens_LW {
    private static readonly logPrefix = "Army Legion Tokens LW";
    private static readonly syncFileName = "ArmyLegionTokens_LW.sync";
    private static readonly mapName = "legionarena";
    private static readonly fightCell = "Boss";
    private static readonly fightPad = "Left";
    private static readonly legionToken = "Legion Token";
    private static readonly goalSignal = "TOKEN_GOAL_RESOLVED";
    private static readonly questId = 6743;
    private static readonly prerequisiteQuestId = 793;
    private static readonly legionTokenId = 6521;
    private static readonly tokenCap = 50000;
    private static readonly targetMapId = 10;
    private static readonly farmPollDelay = 100;
    private static readonly completionPollDelay = 500;
    private static readonly respawnPollDelay = 500;

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private armyPlayerCount: number = 0;
    private privateRoomNumber: number = 0;
    private eligible: boolean = false;
    private goalResolved: boolean = false;
    private questRegistered: boolean = false;
    originalInfiniteRange: boolean = false;
    originalAggroMonsters: boolean = false;
    originalAggroAllMonsters: boolean = false;
    private antiLagApplied: boolean = false;
    private originalLagKiller: boolean = false;
    private originalHidePlayers: boolean = false;
    private originalDisableSelfAnimation: boolean = false;
    private originalDisableMonsterAnimation: boolean = false;
    private originalDisableSkillAnimation: boolean = false;
    private originalDisableDamageStrobe: boolean = false;
    private originalMonstersHidden: boolean = false;

    static player5 = option.text("player5", "Player 5 (Optional)", "Player 5 (Optional) account name.", "");
    static player6 = option.text("player6", "Player 6 (Optional)", "Player 6 (Optional) account name.", "");
    static player7 = option.text("player7", "Player 7 (Optional)", "Player 7 (Optional) account name.", "");

    run(): void {
        this.goalResolved = false;
        this.questRegistered = false;
        if (
            !this.validateOptions() ||
            !LoneWolf.startArmySync(ArmyLegionTokens_LW.syncFileName, this.armyPlayerCount)
        ) {
            return;
        }

        if (!LoneWolf.validateHouseRequirements()) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        this.eligible = this.canEarnTokens();
        Core.bankingBlackList.push(ArmyLegionTokens_LW.legionToken);
        Core.addDrop(ArmyLegionTokens_LW.legionToken);
        Core.addDrop(ArmyLegionTokens_LW.legionTokenId);
        if (!bot.drops.running) {
            bot.drops.start();
        }

        if (!this.publishLocalCompletion()) {
            return;
        }

        if (this.eligible && !this.prepareTokens()) {
            return;
        }

        const preset = this.getClassPreset();
        if (!this.prepare(preset) || !this.publishLocalCompletion() || !this.sync("SETUP_DONE")) {
            return;
        }

        if (!this.allPlayersResolved() && !this.farm(preset)) {
            return;
        }

        this.stopCombat();
        if (bot.shouldExit) {
            return;
        }

        if (bot.map.name?.toLowerCase() === ArmyLegionTokens_LW.mapName?.toLowerCase()) {
            Core.jump("Enter", "Spawn");
        }

        this.cancelQuest();
        if (!this.moveToHouse() || !this.sync("PARKED")) {
            return;
        }

        this.stopArmy();
    }

    private canEarnTokens(): boolean {
        if (
            bot.quests.hasBeenCompleted(ArmyLegionTokens_LW.prerequisiteQuestId) &&
            bot.quests.isUnlocked(ArmyLegionTokens_LW.questId)
        ) {
            return true;
        }

        Core.logger(
            `${ArmyLegionTokens_LW.logPrefix} ${this.playerAlias} must complete Fail to the King and unlock First Class Entertainment to earn Legion Tokens. Continuing as a helper without quest registration or a token goal.`,
            "CanEarnTokens",
            { messageBox: true },
        );
        return false;
    }

    private prepareTokens(): boolean {
        if (bot.flash.get<string>("ui.mcPopup.currentLabel") !== "Bank") {
            bot.bank.open();
        }
        bot.bank.load();
        bot.bank.loaded = true;

        const bankQuantity = bot.bank.getQuantity(ArmyLegionTokens_LW.legionToken);
        if (bankQuantity <= 0) {
            return !bot.shouldExit;
        }

        if (!Core.hasSpaceFor(bot.bank.getItem(ArmyLegionTokens_LW.legionToken))) {
            return this.fatal("Legion Token cannot be moved from bank because the inventory is full.", "PrepareTokens");
        }

        bot.bank.ensureToInventory(ArmyLegionTokens_LW.legionToken);
        return (
            !bot.shouldExit &&
            (bot.inventory.contains(ArmyLegionTokens_LW.legionToken) ||
                this.fatal(LoneWolf.explainFailure("Legion Token could not be moved from bank."), "PrepareTokens"))
        );
    }

    private prepare(preset: ClassPreset): boolean {
        if (this.armyComposition !== ArmyComposition.Unselected) {
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
        }
        return !bot.shouldExit;
    }

    private farm(preset: ClassPreset): boolean {
        if (this.armyComposition !== ArmyComposition.Unselected && bot.config!.get<boolean>("UsePotions")) {
            Core.join("battleon");
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }
        if (bot.shouldExit || !this.joinFarmRoom() || !this.publishLocalCompletion()) {
            return false;
        }

        if (this.eligible && !this.goalResolved) {
            this.questRegistered = true;
            Core.registerQuests(ArmyLegionTokens_LW.questId);
        }
        if (bot.shouldExit) {
            return false;
        }

        bot.options.aggroMonsters = true;
        if (this.armyComposition === ArmyComposition.Unselected) {
            // C# starts Skua's skill timer with its current skills; Turu starts the class's Advanced Skills.
            bot.skills.startAdvanced(bot.player.currentClass ?? undefined, false);
        } else {
            LoneWolf.startSkillEngine(
                preset.skills,
                this.playerAlias,
                false,
                ArmyLegionTokens_LW.logPrefix,
                preset.skillMode,
                undefined,
                bot.config!.get<boolean>("UsePotions") ? preset.combatPotion : null,
            );
        }

        Core.logger(`${ArmyLegionTokens_LW.logPrefix} ${this.playerAlias} farming Legion Fiend Rider.`);
        let nextCompletionCheck = 0;
        let deathLogged = false;
        while (!bot.shouldExit) {
            const now = Date.now();
            if (now >= nextCompletionCheck) {
                if (!this.publishLocalCompletion()) {
                    return false;
                }
                if (this.allPlayersResolved()) {
                    return !bot.shouldExit;
                }
                nextCompletionCheck = now + ArmyLegionTokens_LW.completionPollDelay;
            }

            if (!bot.player.alive) {
                if (!deathLogged) {
                    Core.logger(`${ArmyLegionTokens_LW.logPrefix} ${this.playerAlias} died. Waiting to respawn.`);
                    deathLogged = true;
                }
                bot.sleep(ArmyLegionTokens_LW.respawnPollDelay);
                continue;
            }

            if (!this.joinFarmRoom()) {
                return false;
            }
            if (deathLogged) {
                Core.logger(
                    `${ArmyLegionTokens_LW.logPrefix} ${this.playerAlias} respawned and is continuing to help.`,
                );
                deathLogged = false;
            }
            bot.options.aggroMonsters = true;
            if (LoneWolf.isMonsterAlive(ArmyLegionTokens_LW.targetMapId)) {
                LoneWolf.maintainTarget(ArmyLegionTokens_LW.targetMapId);
            }
            bot.sleep(ArmyLegionTokens_LW.farmPollDelay);
        }
        return false;
    }

    private joinFarmRoom(): boolean {
        const fullMapName = `${ArmyLegionTokens_LW.mapName}-${this.privateRoomNumber}`;
        let currentFullMapName = bot.map.fullName;
        if (!(currentFullMapName?.toLowerCase() === fullMapName?.toLowerCase())) {
            if (bot.map.name?.toLowerCase() === ArmyLegionTokens_LW.mapName?.toLowerCase()) {
                Core.join("battleon");
            }
            Core.join(fullMapName, ArmyLegionTokens_LW.fightCell, ArmyLegionTokens_LW.fightPad);
            currentFullMapName = bot.map.fullName;
        }
        if (bot.shouldExit) {
            return false;
        }
        if (!(currentFullMapName?.toLowerCase() === fullMapName?.toLowerCase())) {
            return this.fatal(
                LoneWolf.explainFailure("The configured private legionarena room could not be reached.", true),
                "JoinFarmRoom",
            );
        }

        if (
            !(bot.player.cell?.toLowerCase() === ArmyLegionTokens_LW.fightCell?.toLowerCase()) ||
            !(bot.player.pad?.toLowerCase() === ArmyLegionTokens_LW.fightPad?.toLowerCase())
        ) {
            Core.jump(ArmyLegionTokens_LW.fightCell, ArmyLegionTokens_LW.fightPad);
        }

        return (
            !bot.shouldExit &&
            ((bot.player.cell?.toLowerCase() === ArmyLegionTokens_LW.fightCell?.toLowerCase() &&
                bot.player.pad?.toLowerCase() === ArmyLegionTokens_LW.fightPad?.toLowerCase()) ||
                this.fatal(
                    LoneWolf.explainFailure("The Legion Fiend Rider fight cell could not be reached.", true),
                    "JoinFarmRoom",
                ))
        );
    }

    private publishLocalCompletion(): boolean {
        if (this.goalResolved || bot.shouldExit) {
            return !bot.shouldExit;
        }
        if (
            this.eligible &&
            bot.inventory.getQuantity(ArmyLegionTokens_LW.legionToken) < ArmyLegionTokens_LW.tokenCap
        ) {
            return true;
        }

        this.cancelQuest();
        if (!LoneWolf.sendArmySignal(ArmyLegionTokens_LW.goalSignal)) {
            return false;
        }
        this.goalResolved = true;
        Core.logger(
            this.eligible
                ? `${ArmyLegionTokens_LW.logPrefix} ${this.playerAlias} reached 50000 Legion Tokens and is continuing to help.`
                : `${ArmyLegionTokens_LW.logPrefix} ${this.playerAlias} is helping without a token goal.`,
        );
        return true;
    }

    private allPlayersResolved(): boolean {
        for (let playerNumber = 1; playerNumber <= this.armyPlayerCount; playerNumber++) {
            if (!LoneWolf.hasArmySignal(ArmyLegionTokens_LW.goalSignal, playerNumber)) {
                return false;
            }
        }
        return true;
    }

    cancelQuest(): void {
        if (!this.questRegistered) {
            return;
        }
        Core.cancelRegisteredQuests();
        this.questRegistered = false;
    }

    stopCombat(): void {
        bot.options.aggroMonsters = false;
        bot.options.aggroAllMonsters = false;
        LoneWolf.stopSkillEngine();
        bot.skills.stop();
        bot.combat.cancelTarget();
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

    applyAntiLag(): void {
        if (!bot.config!.get<boolean>("EnableAntiLag")) {
            return;
        }

        this.originalLagKiller = bot.options.lagKiller;
        this.originalHidePlayers = bot.options.hidePlayers;
        this.originalDisableSelfAnimation = bot.lite.disableSelfAnimation;
        this.originalDisableMonsterAnimation = bot.lite.disableMonsterAnimation;
        this.originalDisableSkillAnimation = bot.lite.disableSkillAnimation;
        this.originalDisableDamageStrobe = bot.lite.disableDamageStrobe;
        this.originalMonstersHidden = bot.flash.get<boolean>("ui.monsterIcon.redX.visible");
        this.antiLagApplied = true;

        bot.options.lagKiller = true;
        bot.options.hidePlayers = true;
        bot.lite.disableSelfAnimation = true;
        bot.lite.disableMonsterAnimation = true;
        bot.lite.disableSkillAnimation = true;
        bot.lite.disableDamageStrobe = true;

        if (!this.originalMonstersHidden) {
            bot.flash.callGameFunction("world.toggleMonsters");
        }
    }

    restoreAntiLag(): void {
        if (!this.antiLagApplied) {
            return;
        }

        bot.options.lagKiller = this.originalLagKiller;
        bot.options.hidePlayers = this.originalHidePlayers;
        bot.lite.disableSelfAnimation = this.originalDisableSelfAnimation;
        bot.lite.disableMonsterAnimation = this.originalDisableMonsterAnimation;
        bot.lite.disableSkillAnimation = this.originalDisableSkillAnimation;
        bot.lite.disableDamageStrobe = this.originalDisableDamageStrobe;

        const monstersHidden = bot.flash.get<boolean>("ui.monsterIcon.redX.visible");
        if (monstersHidden !== this.originalMonstersHidden) {
            bot.flash.callGameFunction("world.toggleMonsters");
        }

        this.antiLagApplied = false;
    }

    private getClassPreset(): ClassPreset {
        if (this.armyComposition === ArmyComposition.Unselected) {
            return Object.assign(new ClassPreset(), { className: bot.player.currentClass ?? "Current Class" });
        }

        if (LoneWolf.isArmyPlayer(1)) {
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
            const shaman = LoneWolf.shaman(true);
            shaman.helmEnhancement = HelmSpecial.Examen;
            return shaman;
        }

        if (LoneWolf.isArmyPlayer(6)) {
            return LoneWolf.bard();
        }

        return LoneWolf.verusDoomKnight();
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
        Core.logger(`${ArmyLegionTokens_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${ArmyLegionTokens_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private moveToHouse(): boolean {
        return LoneWolf.moveToHouse(ArmyLegionTokens_LW.logPrefix);
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
                Core.logger(`${ArmyLegionTokens_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${ArmyLegionTokens_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${ArmyLegionTokens_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${ArmyLegionTokens_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "ArmyLegionTokens_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        ArmyLegionTokens_LW.player5,
        ArmyLegionTokens_LW.player6,
        ArmyLegionTokens_LW.player7,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO / Shaman / Bard / VDK\nStable: AF / SC / AP / LOO / Shaman / Bard / VDK\nUnselected: Current Class / Skua Advanced Skills / No Enhancements or Potions",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool(
            "UsePotions",
            "Use Potions",
            "Use owned inventory potions only. No acquisition or restocking.",
            false,
        ),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadout.", true),
        option.bool(
            "EnableAntiLag",
            "Enable AntiLag",
            "Temporarily enable AntiLag and disable visual effects while the script runs.",
            true,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new ArmyLegionTokens_LW();
    bot.config?.configure();
    script.originalInfiniteRange = bot.options.infiniteRange;
    script.originalAggroMonsters = bot.options.aggroMonsters;
    script.originalAggroAllMonsters = bot.options.aggroAllMonsters;

    try {
        script.stopCombat();
        bot.options.infiniteRange = true;
        script.applyAntiLag();
        script.run();
    } finally {
        try {
            script.stopCombat();
            script.cancelQuest();
        } finally {
            script.restoreAntiLag();
            bot.options.infiniteRange = script.originalInfiniteRange;
            bot.options.aggroMonsters = script.originalAggroMonsters;
            bot.options.aggroAllMonsters = script.originalAggroAllMonsters;
        }
    }
}
