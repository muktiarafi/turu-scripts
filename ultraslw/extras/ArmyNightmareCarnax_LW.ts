/*
name: Army Nightmare Carnax LW
description: Two-to-five-player CoreLoneWolf Army script for Nightmare Carnax.
tags: nightmare carnax, challenge boss, five-player, army, corelonewolf
*/
// Port of Extras/ArmyNightmareCarnax_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, type EventMap, option } from "turu";
import { HelmSpecial } from "../../core/CoreAdvanced";
import { Core, randomInt } from "../../core/CoreBots";
import { type ClassPreset, CoreLoneWolf } from "../CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
}

export class ArmyNightmareCarnax_LW {
    private static readonly logPrefix = "Army Nightmare Carnax LW";
    private static readonly syncFileName = "ArmyNightmareCarnax_LW.sync";
    private static readonly mapName = "darkcarnax";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly bossCell = "Boss";
    private static readonly bossPad = "Right";
    private static readonly bossName = "Nightmare Carnax";
    private static readonly lastStandQuestName = "The Last Stand";
    private static readonly syntheticViscera = "Synthetic Viscera";
    private static readonly calamitousRuin = "Calamitous Ruin";
    private static readonly lastStandQuestId = 8872;
    private static readonly syntheticVisceraMaxStack = 1000;
    private static readonly fightPollDelay = 100;
    private static readonly respawnPollDelay = 500;

    private readonly pendingZones: string[] = [];
    // C#'s zoneLock: the zone queue is only touched on the script thread here.

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private armyPlayerCount: number = 0;
    private privateRoomNumber: number = 0;
    private farmNightmareCarnax: boolean = false;
    lastStandRegistered: boolean = false;

    static player3 = option.text("player3", "Player 3 (Optional)", "Player 3 (Optional) account name.", "");
    static player4 = option.text("player4", "Player 4 (Optional)", "Player 4 (Optional) account name.", "");
    static player5 = option.text("player5", "Player 5 (Optional)", "Player 5 (Optional) account name.", "");

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (!LoneWolf.startArmySync(ArmyNightmareCarnax_LW.syncFileName, this.armyPlayerCount)) {
            return;
        }

        if (!LoneWolf.validateHouseRequirements()) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        const preset = this.getClassPreset();
        Core.logger(
            `${ArmyNightmareCarnax_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        this.prepareDropsAndQuest();

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        Core.join(
            `${ArmyNightmareCarnax_LW.mapName}-${this.privateRoomNumber}`,
            ArmyNightmareCarnax_LW.safeCell,
            ArmyNightmareCarnax_LW.safePad,
        );

        if (!this.prepareSafeRoom(preset)) {
            return;
        }

        this.startZoneListener();

        if (!this.sync("FIGHT_READY")) {
            return;
        }

        Core.jump(ArmyNightmareCarnax_LW.bossCell, ArmyNightmareCarnax_LW.bossPad);

        if (!this.runFightLoop(preset)) {
            return;
        }

        Core.jump(ArmyNightmareCarnax_LW.safeCell, ArmyNightmareCarnax_LW.safePad);

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
    }

    private validateOptions(): boolean {
        this.armyComposition = bot.config!.get<ArmyComposition>("ArmyComposition");
        this.privateRoomNumber = bot.config.get<number>("PrivateRoomNumber");
        this.farmNightmareCarnax = bot.config.get<boolean>("FarmNightmareCarnax");

        const playerThree = bot.config.get<string>("player3")?.trim() ?? "";
        const playerFour = bot.config.get<string>("player4")?.trim() ?? "";
        const playerFive = bot.config.get<string>("player5")?.trim() ?? "";

        if (!playerThree && (!!playerFour || !!playerFive)) {
            Core.logger("Player 3 is required when Player 4 or Player 5 is configured.", "ValidateOptions", {
                messageBox: true,
            });
            return false;
        }

        if (!playerFour && !!playerFive) {
            Core.logger("Player 4 is required when Player 5 is configured.", "ValidateOptions", { messageBox: true });
            return false;
        }

        this.armyPlayerCount = !!playerFive ? 5 : !!playerFour ? 4 : !!playerThree ? 3 : 2;

        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepareDropsAndQuest(): void {
        Core.addDrop(ArmyNightmareCarnax_LW.syntheticViscera, ArmyNightmareCarnax_LW.calamitousRuin);

        if (!bot.drops.running) {
            bot.drops.start();
        }

        if (
            Core.checkInventory(
                ArmyNightmareCarnax_LW.syntheticViscera,
                ArmyNightmareCarnax_LW.syntheticVisceraMaxStack,
            )
        ) {
            Core.logger(
                `${ArmyNightmareCarnax_LW.syntheticViscera} is already at maximum stacks. ${ArmyNightmareCarnax_LW.lastStandQuestName} registration skipped.`,
                "PrepareDropsAndQuest",
            );
            return;
        }

        if (!LoneWolf.acceptUltraQuest(ArmyNightmareCarnax_LW.lastStandQuestId)) {
            Core.logger(
                `${ArmyNightmareCarnax_LW.lastStandQuestName} could not be accepted. Complete The Beast Awakens and Nightmare Containment Field to receive Synthetic Viscera. Continuing without quest rewards.`,
                "PrepareDropsAndQuest",
            );
            return;
        }

        Core.registerQuests(ArmyNightmareCarnax_LW.lastStandQuestId);
        this.lastStandRegistered = true;
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${ArmyNightmareCarnax_LW.logPrefix} ${this.playerAlias} starting setup.`);

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

        Core.logger(`${ArmyNightmareCarnax_LW.logPrefix} ${this.playerAlias} finished setup.`);
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

            Core.logger(`${ArmyNightmareCarnax_LW.logPrefix} ${this.playerAlias} completed kill ${fightCycle}.`);

            if (!this.sync(`NIGHTMARE_CARNAX_${fightCycle}_DEFEATED`)) {
                return false;
            }

            if (!this.farmNightmareCarnax) {
                return true;
            }

            fightCycle++;

            if (!this.waitForBossRespawn()) {
                return false;
            }
        }

        return false;
    }

    private fight(preset: ClassPreset, fightCycle: number): boolean {
        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            false,
            ArmyNightmareCarnax_LW.logPrefix,
            preset.skillMode,
        );
        Core.logger(`${ArmyNightmareCarnax_LW.logPrefix} ${this.playerAlias} started fight cycle ${fightCycle}.`);

        let bossObservedAlive = false;

        while (!bot.shouldExit) {
            this.drainZoneEvents(bot.player.alive);

            if (!bot.player.alive) {
                Core.logger(`${ArmyNightmareCarnax_LW.logPrefix} ${this.playerAlias} died.`);

                while (!bot.shouldExit && !bot.player.alive) {
                    this.drainZoneEvents(false);
                    bot.sleep(ArmyNightmareCarnax_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    break;
                }

                Core.logger(`${ArmyNightmareCarnax_LW.logPrefix} ${this.playerAlias} respawned.`);
                Core.jump(ArmyNightmareCarnax_LW.bossCell, ArmyNightmareCarnax_LW.bossPad);
                continue;
            }

            const bossAlive = Core.isMonsterAlive(ArmyNightmareCarnax_LW.bossName);
            if (bossAlive) {
                bossObservedAlive = true;
            } else if (bossObservedAlive) {
                break;
            }

            if (bossAlive && !this.hasBossTarget()) {
                bot.combat.attack(ArmyNightmareCarnax_LW.bossName);
            }

            bot.sleep(ArmyNightmareCarnax_LW.fightPollDelay);
        }

        this.stopFightCombat();

        if (bot.shouldExit || !bossObservedAlive) {
            return false;
        }

        Core.logger(`${ArmyNightmareCarnax_LW.logPrefix} ${this.playerAlias} confirmed Nightmare Carnax defeated.`);
        return true;
    }

    private waitForBossRespawn(): boolean {
        Core.logger(`${ArmyNightmareCarnax_LW.logPrefix} ${this.playerAlias} waiting for Nightmare Carnax to respawn.`);

        while (!bot.shouldExit && !Core.isMonsterAlive(ArmyNightmareCarnax_LW.bossName)) {
            this.drainZoneEvents(bot.player.alive);
            bot.sleep(ArmyNightmareCarnax_LW.respawnPollDelay);
        }

        return !bot.shouldExit;
    }

    private hasBossTarget(): boolean {
        return (
            bot.player.hasTarget &&
            bot.player.target?.name?.toLowerCase() === ArmyNightmareCarnax_LW.bossName?.toLowerCase()
        );
    }

    private startZoneListener(): void {
        {
            this.pendingZones.splice(0);
        }

        bot.events.off("runToArea", this.onRunToArea);
        bot.events.on("runToArea", this.onRunToArea);
    }

    stopZoneListener(): void {
        bot.events.off("runToArea", this.onRunToArea);

        {
            this.pendingZones.splice(0);
        }
    }

    private onRunToArea = ({ zone }: EventMap["runToArea"]): void => {
        if (!(zone?.toLowerCase() === "A"?.toLowerCase()) && !(zone?.toLowerCase() === "B"?.toLowerCase())) {
            return;
        }

        {
            this.pendingZones.push(zone.toUpperCase());
        }
    };

    private drainZoneEvents(move: boolean): void {
        while (true) {
            let zone: string;
            {
                if (this.pendingZones.length === 0) {
                    return;
                }

                zone = this.pendingZones.shift()!;
            }

            if (!move) {
                continue;
            }

            const y = randomInt(380, 475);
            const x = zone === "A" ? randomInt(600, 931) : randomInt(25, 326);

            bot.player.walkTo(x, y);
        }
    }

    private stopFightCombat(): void {
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();
    }

    private getClassPreset(): ClassPreset {
        if (LoneWolf.isArmyPlayer(1) || LoneWolf.isArmyPlayer(2)) {
            const dragonOfTime = LoneWolf.dragonOfTime();
            dragonOfTime.helmEnhancement = HelmSpecial.None;
            return dragonOfTime;
        }

        if (LoneWolf.isArmyPlayer(3)) {
            return LoneWolf.stoneCrusher();
        }

        if (LoneWolf.isArmyPlayer(4)) {
            return LoneWolf.archPaladin();
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

        if (LoneWolf.isArmyPlayer(4)) {
            return "playerFour";
        }

        return "playerFive";
    }

    private sync(step: string): boolean {
        Core.logger(`${ArmyNightmareCarnax_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${ArmyNightmareCarnax_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${ArmyNightmareCarnax_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${ArmyNightmareCarnax_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${ArmyNightmareCarnax_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${ArmyNightmareCarnax_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "ArmyNightmareCarnax_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        ArmyNightmareCarnax_LW.player3,
        ArmyNightmareCarnax_LW.player4,
        ArmyNightmareCarnax_LW.player5,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: DOT / DOT / SC / AP / LOO",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool(
            "FarmNightmareCarnax",
            "Farm Nightmare Carnax",
            "Farm Nightmare Carnax indefinitely. Disable this to defeat it once.",
            true,
        ),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadout.", true),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadout.", true),
    ],
    true,
);

export default function main(): void {
    const script = new ArmyNightmareCarnax_LW();
    bot.skills.stop();
    bot.options.infiniteRange = true;
    bot.options.skipCutscenes = true;
    LoneWolf.setAntiLag();
    bot.config?.configure();

    try {
        script.run();
    } finally {
        script.stopZoneListener();
        LoneWolf.stopSkillEngine();

        if (script.lastStandRegistered) {
            Core.cancelRegisteredQuests();
        }
    }
}
