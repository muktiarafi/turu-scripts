/*
name: The Encroaching Shadows LW
description: Farms Flibbitiestgibbet, Warlord Icewing and Hydra Head 90 for the daily quest with four to six players.
tags: void aura, daily, army, corelonewolf, master
*/
// Port of Extras/VoidBosses/TheEncroachingShadows_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, ref } from "../../LWRef";
import { bot, choices, defineScriptOptions, type Monster, option } from "turu";
import { CapeSpecial } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { type ClassPreset, CoreLoneWolf } from "../../CoreLoneWolf";
import { ArmyComposition, VoidFlibbitiestgibbet_LW } from "./VoidFlibbitiestgibbet_LW";

const LoneWolf = new CoreLoneWolf();

export class TheEncroachingShadows_LW {
    private static readonly logPrefix = "The Encroaching Shadows LW";
    private static readonly syncFileName = "TheEncroachingShadows_LW.sync";
    private static readonly questName = "The Encroaching Shadows";
    private static readonly questId = 8653;
    private static readonly flibbitigibletsId = 70054;
    private static readonly glacialPinionId = 70052;
    private static readonly hydraEyeballId = 70053;
    private static readonly pollDelay = 500;

    private playerAlias: string = "";
    private armyPlayerCount: number = 0;
    private privateRoomNumber: number = 0;
    private questEligible: boolean = false;
    private routeSetupComplete: boolean = false;
    private routePreset: ClassPreset | null = null;
    private armyComposition: ArmyComposition = null!;

    static readonly setup = [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        VoidFlibbitiestgibbet_LW.player5,
        VoidFlibbitiestgibbet_LW.player6,
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadouts.", true),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadouts.", true),
    ];

    static readonly void_Bosses = [
        option.choice(
            "FlibbitiestgibbetComposition",
            "Army Composition",
            "Default: KE / SC / AP / LOO / VDK / Bard\n" +
                "Reliable: LR / SC / AP / LOO / VDK / Bard\n" +
                "Stable: KE / SC / AP / LOO / VDK / Bard",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
    ];

    run(): void {
        this.routeSetupComplete = false;
        this.routePreset = null;
        if (
            !this.validateOptions() ||
            !LoneWolf.startArmySync(TheEncroachingShadows_LW.syncFileName, this.armyPlayerCount, "Setup")
        ) {
            return;
        }

        if (!LoneWolf.validateHouseRequirements()) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        Core.logger(
            `${TheEncroachingShadows_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );
        Core.bankingBlackList.push("Flibbitigiblets", "Glacial Pinion", "Hydra Eyeball");

        if (!this.prepareQuest() || !this.sync("QUEST_READY")) {
            return;
        }

        if (!this.runFlibbitiestgibbet() || !this.moveToHouse()) {
            return;
        }

        if (
            !this.runFarmStage(
                "ICEWING",
                "icewing",
                "Enter",
                "Spawn",
                [1],
                TheEncroachingShadows_LW.glacialPinionId,
                "Glacial Pinion",
                1,
            ) ||
            !this.moveToHouse()
        ) {
            return;
        }

        if (
            !this.runFarmStage(
                "HYDRA",
                "hydrachallenge",
                "h90",
                "Left",
                [32, 33, 34],
                TheEncroachingShadows_LW.hydraEyeballId,
                "Hydra Eyeball",
                3,
            ) ||
            !this.moveToHouse()
        ) {
            return;
        }

        this.completeQuest();
        if (!bot.shouldExit && this.sync("QUEST_RESULT")) {
            this.stopArmy();
        }
    }

    private validateOptions(): boolean {
        this.privateRoomNumber = bot.config!.get<number>("Setup", "PrivateRoomNumber");
        if (!LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber)) {
            return false;
        }

        this.armyComposition = bot.config.get<ArmyComposition>("Void_Bosses", "FlibbitiestgibbetComposition");
        const playerFive = bot.config.get<string>("Setup", "player5")?.trim() ?? "";
        const playerSix = bot.config.get<string>("Setup", "player6")?.trim() ?? "";
        if (!playerFive && !!playerSix) {
            Core.logger("Player 5 is required when Player 6 is configured.", TheEncroachingShadows_LW.logPrefix, {
                messageBox: true,
            });
            return false;
        }

        this.armyPlayerCount = !!playerSix ? 6 : !!playerFive ? 5 : 4;
        return true;
    }

    private prepareQuest(): boolean {
        if (bot.quests.isDailyComplete(TheEncroachingShadows_LW.questId)) {
            Core.logger(
                `${TheEncroachingShadows_LW.questName} is already completed for ${this.playerAlias}. This account will help the Army.`,
                TheEncroachingShadows_LW.logPrefix,
            );
            return true;
        }

        if (
            !bot.quests.isInProgress(TheEncroachingShadows_LW.questId) &&
            !bot.quests.isUnlocked(TheEncroachingShadows_LW.questId)
        ) {
            Core.logger(
                `${TheEncroachingShadows_LW.questName} is locked for ${this.playerAlias}. Unlock it before running this daily. This account will continue as a helper.`,
                TheEncroachingShadows_LW.logPrefix,
                { messageBox: true },
            );
            return true;
        }

        bot.bank.load();
        if (bot.shouldExit) {
            return false;
        }
        if (!bot.quests.isInProgress(TheEncroachingShadows_LW.questId)) {
            Core.ensureAccept(TheEncroachingShadows_LW.questId);
        }

        this.questEligible = bot.quests.isInProgress(TheEncroachingShadows_LW.questId);
        if (!this.questEligible) {
            Core.logger(
                LoneWolf.explainFailure(
                    `${TheEncroachingShadows_LW.questName} could not be accepted for ${this.playerAlias}. This account will continue as a helper.`,
                ),
                TheEncroachingShadows_LW.logPrefix,
                { messageBox: true },
            );
            return !bot.shouldExit;
        }

        Core.addDrop("Flibbitigiblets", "Glacial Pinion", "Hydra Eyeball");
        Core.addDrop(
            TheEncroachingShadows_LW.flibbitigibletsId,
            TheEncroachingShadows_LW.glacialPinionId,
            TheEncroachingShadows_LW.hydraEyeballId,
        );
        if (!bot.drops.running) {
            bot.drops.start();
        }

        Core.logger(
            `${TheEncroachingShadows_LW.questName} is active for ${this.playerAlias}.`,
            TheEncroachingShadows_LW.logPrefix,
        );
        return !bot.shouldExit;
    }

    private runFlibbitiestgibbet(): boolean {
        const signal = "FLIBBITIESTGIBBET_ITEM_READY";
        const child = new VoidFlibbitiestgibbet_LW();
        let readySent = false;
        let startAttempted = false;
        let statusPass = 0;
        let cycle = 0;

        try {
            while (!bot.shouldExit) {
                if (
                    !this.publishReady(
                        signal,
                        TheEncroachingShadows_LW.flibbitigibletsId,
                        "Flibbitigiblets",
                        1,
                        ref(
                            () => readySent,
                            (v) => (readySent = v),
                        ),
                    ) ||
                    !this.sync(`FLIBBITIESTGIBBET_${statusPass}_STATUS`)
                ) {
                    return false;
                }

                statusPass++;
                if (this.allPlayersSignaled(signal)) {
                    Core.logger(
                        "Every eligible account confirmed Flibbitigiblets.",
                        TheEncroachingShadows_LW.logPrefix,
                    );
                    return true;
                }

                if (!startAttempted) {
                    if (bot.map.name?.toLowerCase() === "voidflibbi"?.toLowerCase() && !this.moveToHouse()) {
                        return false;
                    }

                    startAttempted = true;
                    if (!child.startFromMaster()) {
                        return this.failure(
                            LoneWolf.explainFailure("Flibbitiestgibbet setup failed before the item gate was ready."),
                        );
                    }
                    if (!this.verifyRoom("voidflibbi")) {
                        return false;
                    }
                    this.routePreset ??= this.getClassPreset();
                    this.routeSetupComplete = true;
                    continue;
                }

                Core.logger(`Starting Flibbitiestgibbet kill ${cycle + 1}.`, TheEncroachingShadows_LW.logPrefix);
                if (!child.runOnceFromMaster()) {
                    return this.failure(
                        LoneWolf.explainFailure("Flibbitiestgibbet failed before the item gate was ready."),
                    );
                }

                bot.sleep(1500);
                cycle++;
            }
        } finally {
            if (startAttempted) {
                child.stopFromMaster();
            }
        }

        return false;
    }

    private runFarmStage(
        phase: string,
        map: string,
        fightCell: string,
        fightPad: string,
        targetMapIds: number[],
        itemId: number,
        itemName: string,
        quantity: number,
    ): boolean {
        const signal = `${phase}_ITEM_READY`;
        let readySent = false;
        if (
            !this.publishReady(
                signal,
                itemId,
                itemName,
                quantity,
                ref(
                    () => readySent,
                    (v) => (readySent = v),
                ),
            ) ||
            !this.sync(`${phase}_INITIAL_STATUS`)
        ) {
            return false;
        }
        if (this.allPlayersSignaled(signal)) {
            return true;
        }

        const preset = (this.routePreset ??= this.getClassPreset());
        if (!this.ensureRouteSetup(preset)) {
            return false;
        }

        if (bot.map.name?.toLowerCase() === map?.toLowerCase() && !this.moveToHouse()) {
            return false;
        }
        Core.join(`${map}-${this.privateRoomNumber}`);
        if (!this.verifyRoom(map)) {
            return false;
        }

        if (!this.jumpTo(fightCell, fightPad)) {
            return false;
        }
        if (bot.shouldExit || !this.sync(`${phase}_FIGHT_READY`)) {
            return false;
        }

        try {
            LoneWolf.startSkillEngine(
                preset.skills,
                this.playerAlias,
                false,
                TheEncroachingShadows_LW.logPrefix,
                preset.skillMode,
            );
            let targetMapId = 0;
            let deathLogged = false;
            while (!bot.shouldExit) {
                if (
                    !this.publishReady(
                        signal,
                        itemId,
                        itemName,
                        quantity,
                        ref(
                            () => readySent,
                            (v) => (readySent = v),
                        ),
                    )
                ) {
                    return false;
                }
                if (!bot.player.alive) {
                    if (!deathLogged) {
                        Core.logger(`${TheEncroachingShadows_LW.logPrefix} ${this.playerAlias} died during ${phase}.`);
                    }
                    deathLogged = true;
                    targetMapId = 0;
                    bot.sleep(TheEncroachingShadows_LW.pollDelay);
                    continue;
                }

                const needsReentry = deathLogged || !(bot.player.cell?.toLowerCase() === fightCell?.toLowerCase());
                if (deathLogged) {
                    Core.logger(`${TheEncroachingShadows_LW.logPrefix} ${this.playerAlias} respawned during ${phase}.`);
                    deathLogged = false;
                }
                if (this.allPlayersSignaled(signal)) {
                    this.stopCombat();
                    if (phase === "HYDRA" && !this.jumpTo("Enter", "Spawn")) {
                        return false;
                    }
                    Core.logger(
                        `Every eligible account confirmed ${itemName} x${quantity}.`,
                        TheEncroachingShadows_LW.logPrefix,
                    );
                    return this.sync(`${phase}_COMPLETE`);
                }

                if (!this.verifyRoom(map)) {
                    return false;
                }
                if (needsReentry) {
                    if (!this.jumpTo(fightCell, fightPad)) {
                        return false;
                    }
                    targetMapId = 0;
                    bot.sleep(TheEncroachingShadows_LW.pollDelay);
                    continue;
                }

                // Re-read after arriving. Retain a living selected instance across polls.
                const monsters = bot.monsters.mapMonsters;
                targetMapId = TheEncroachingShadows_LW.selectTarget(monsters, targetMapId, targetMapIds, fightCell);
                if (targetMapId > 0) {
                    LoneWolf.maintainTarget(targetMapId);
                }
                bot.sleep(TheEncroachingShadows_LW.pollDelay);
            }
        } finally {
            this.stopCombat();
        }

        return false;
    }

    private static selectTarget(
        monsters: Monster[],
        selectedMapId: number,
        targetMapIds: number[],
        fightCell: string,
    ): number {
        const matching = monsters.filter(
            (monster) =>
                monster != null &&
                targetMapIds.includes(monster.mapId) &&
                monster.hp > 0 &&
                monster.cell?.toLowerCase() === fightCell?.toLowerCase(),
        );
        return matching.some((monster) => monster.mapId === selectedMapId)
            ? selectedMapId
            : ((
                  [...matching].sort((a, b) =>
                      compare(((monster) => monster.mapId)(a), ((monster) => monster.mapId)(b)),
                  )[0] ?? null
              )?.mapId ?? 0);
    }

    private ensureRouteSetup(preset: ClassPreset): boolean {
        if (this.routeSetupComplete) {
            return true;
        }

        // The Flibbi child normally owns setup. This path is only for a skipped Flibbi stage.
        if (
            !LoneWolf.validateUltraAccess(0, 0, "", 80, TheEncroachingShadows_LW.logPrefix, preset.className) ||
            !this.prepare(preset)
        ) {
            return false;
        }
        if (bot.config!.get<boolean>("Setup", "UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }
        if (bot.shouldExit || !this.sync("ROUTE_SETUP_DONE")) {
            return false;
        }

        this.routeSetupComplete = true;
        return true;
    }

    private jumpTo(cell: string, pad: string): boolean {
        if (bot.shouldExit) {
            return false;
        }
        Core.jump(cell, pad);
        if (bot.shouldExit) {
            return false;
        }

        // Core.Jump can return early in the correct cell even when its pad differs.
        if (
            !(bot.player.cell?.toLowerCase() === cell?.toLowerCase()) ||
            !(bot.player.pad?.toLowerCase() === pad?.toLowerCase())
        ) {
            bot.map.jump(cell, pad, false, false);
            bot.wait.forTrue(
                () =>
                    bot.shouldExit ||
                    (bot.player.cell?.toLowerCase() === cell?.toLowerCase() &&
                        bot.player.pad?.toLowerCase() === pad?.toLowerCase()),
                40,
            );
            if (bot.shouldExit) {
                return false;
            }
            bot.player.setSpawnPoint();
        }

        return (
            (bot.player.cell?.toLowerCase() === cell?.toLowerCase() &&
                bot.player.pad?.toLowerCase() === pad?.toLowerCase()) ||
            this.failure(LoneWolf.explainFailure(`${this.playerAlias} could not reach ${cell} at ${pad}.`, true))
        );
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${TheEncroachingShadows_LW.logPrefix} ${this.playerAlias} starting setup.`);
        LoneWolf.equipClass(preset);
        if (bot.shouldExit) {
            return false;
        }
        if (bot.config!.get<boolean>("Setup", "UseEnhancements")) {
            LoneWolf.prepareEnhancements(
                preset.baseEnhancement,
                preset.capeEnhancement,
                preset.helmEnhancement,
                preset.weaponEnhancement,
                undefined,
                preset.weaponEnhancementFallbacks,
            );
        }
        if (bot.config.get<boolean>("Setup", "UsePotions")) {
            LoneWolf.preparePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }
        return !bot.shouldExit;
    }

    private getClassPreset(): ClassPreset {
        let preset: ClassPreset;
        if (LoneWolf.isArmyPlayer(1)) {
            preset =
                this.armyComposition === ArmyComposition.Reliable ? LoneWolf.legionRevenant() : LoneWolf.kingsEcho();
        } else if (LoneWolf.isArmyPlayer(2)) {
            preset = LoneWolf.stoneCrusher();
        } else if (LoneWolf.isArmyPlayer(3)) {
            preset = LoneWolf.archPaladin();
        } else if (LoneWolf.isArmyPlayer(4)) {
            preset = LoneWolf.lordOfOrder();
        } else if (LoneWolf.isArmyPlayer(5)) {
            preset = LoneWolf.verusDoomKnight();
        } else {
            preset = LoneWolf.bard();
        }

        if (this.armyComposition === ArmyComposition.Default && preset.capeEnhancement === CapeSpecial.Vainglory) {
            preset.capeEnhancement = CapeSpecial.Lament;
        }
        return preset;
    }

    private publishReady(
        signal: string,
        itemId: number,
        itemName: string,
        quantity: number,
        readySent: Ref<boolean>,
    ): boolean {
        if (readySent.value || (this.questEligible && bot.inventory.getQuantity(itemId) < quantity)) {
            return true;
        }
        if (!LoneWolf.sendArmySignal(signal)) {
            return false;
        }

        readySent.value = true;
        Core.logger(
            this.questEligible
                ? `${TheEncroachingShadows_LW.logPrefix} ${this.playerAlias} confirmed ${itemName} x${quantity}.`
                : `${TheEncroachingShadows_LW.logPrefix} ${this.playerAlias} is exempt from the ${itemName} gate.`,
        );
        return true;
    }

    private allPlayersSignaled(signal: string): boolean {
        for (let playerNumber = 1; playerNumber <= this.armyPlayerCount; playerNumber++) {
            if (!LoneWolf.hasArmySignal(signal, playerNumber)) {
                return false;
            }
        }
        return true;
    }

    private verifyRoom(map: string): boolean {
        return (
            !bot.shouldExit &&
            (bot.map.fullName?.toLowerCase() === `${map}-${this.privateRoomNumber}`?.toLowerCase() ||
                this.failure(LoneWolf.explainFailure(`The configured private ${map} room could not be reached.`, true)))
        );
    }

    private moveToHouse(): boolean {
        this.stopCombat();
        return LoneWolf.moveToHouse(TheEncroachingShadows_LW.logPrefix);
    }

    private completeQuest(): void {
        if (!this.questEligible || bot.shouldExit) {
            return;
        }
        Core.ensureComplete(TheEncroachingShadows_LW.questId);
        bot.wait.forTrue(() => bot.shouldExit || bot.quests.isDailyComplete(TheEncroachingShadows_LW.questId), 40);
        if (bot.shouldExit) {
            return;
        }
        if (bot.quests.isDailyComplete(TheEncroachingShadows_LW.questId)) {
            Core.logger(
                `${TheEncroachingShadows_LW.questName} completed for ${this.playerAlias}.`,
                TheEncroachingShadows_LW.logPrefix,
            );
            return;
        }
        Core.logger(
            LoneWolf.explainFailure(
                `${TheEncroachingShadows_LW.questName} could not be completed for ${this.playerAlias}. Other accounts will continue.`,
            ),
            TheEncroachingShadows_LW.logPrefix,
            { messageBox: true },
        );
    }

    stopCombat(): void {
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();
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
        return "playerSix";
    }

    private sync(step: string): boolean {
        Core.logger(`${TheEncroachingShadows_LW.logPrefix} ${this.playerAlias} entering ${step}.`);
        if (!LoneWolf.syncArmy(step)) {
            return false;
        }
        Core.logger(`${TheEncroachingShadows_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private failure(message: string): boolean {
        if (bot.shouldExit) {
            Core.logger(message, TheEncroachingShadows_LW.logPrefix);
        } else {
            Core.logger(message, TheEncroachingShadows_LW.logPrefix, { messageBox: true, stopBot: true });
        }
        return false;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);
            if (bot.shouldExit) {
                return;
            }
            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${TheEncroachingShadows_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${TheEncroachingShadows_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }
            return;
        }
        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${TheEncroachingShadows_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${TheEncroachingShadows_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions("TheEncroachingShadows_LW", [], true, {
    Setup: TheEncroachingShadows_LW.setup,
    Void_Bosses: TheEncroachingShadows_LW.void_Bosses,
});

export default function main(): void {
    const script = new TheEncroachingShadows_LW();
    bot.skills.stop();
    bot.options.infiniteRange = true;
    LoneWolf.setAntiLag();
    bot.config?.configure();

    try {
        script.run();
    } finally {
        script.stopCombat();
    }
}

function compare(a: any, b: any): number {
    return a < b ? -1 : a > b ? 1 : 0;
}
