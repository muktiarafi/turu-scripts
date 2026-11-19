/*
name: Wrong Turn at Voidbuquerque LW
description: Runs the required Void bosses for the Wrong Turn at Voidbuquerque daily quest.
tags: void, daily, army, corelonewolf, master
*/
// Port of Extras/VoidBosses/WrongTurnatVoidbuquerque_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../../core/CoreBots";
import { CoreLoneWolf } from "../../CoreLoneWolf";
import {
    ArmyComposition as VoidFlibbitiestgibbet_LWArmyComposition,
    VoidFlibbitiestgibbet_LW,
} from "./VoidFlibbitiestgibbet_LW";
import { ArmyComposition as VoidNightbane_LWArmyComposition, VoidNightbane_LW } from "./VoidNightbane_LW";
import { ArmyComposition, VoidXyfrag_LW } from "./VoidXyfrag_LW";

const LoneWolf = new CoreLoneWolf();

export enum DailyReward {
    TaintedGem = "TaintedGem",
    DarkCrystalShard = "DarkCrystalShard",
    DiamondOfNulgath = "DiamondOfNulgath",
    TotemOfNulgath = "TotemOfNulgath",
    GemOfNulgath = "GemOfNulgath",
    BloodGemOfTheArchfiend = "BloodGemOfTheArchfiend",
}

export class WrongTurnatVoidbuquerque_LW {
    private static readonly logPrefix = "Wrong Turn at Voidbuquerque LW";
    private static readonly syncFileName = "WrongTurnatVoidbuquerque_LW.sync";
    private static readonly questName = "Wrong Turn at Voidbuquerque";
    private static readonly prerequisiteQuestName = "Break their Muti-kneecaps";
    private static readonly xyfragEssence = "Xyfrag's ??? Essence";
    private static readonly flibbitiestgibbetEssence = "Flibbitiestgibbet's ??? Essence";
    private static readonly nightbaneEssence = "Nightbane's ??? Essence";
    private static readonly questId = 9091;

    private playerAlias: string = "";
    private armyPlayerCount: number = 0;
    private questEligible: boolean = false;

    static player6 = option.text("player6", "Player 6", "Player 6 account name.", "");

    static player7 = option.text("player7", "Player 7 (Optional)", "Player 7 (Optional) account name.", "");

    static readonly setup = [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        LoneWolf.player5,
        WrongTurnatVoidbuquerque_LW.player6,
        WrongTurnatVoidbuquerque_LW.player7,
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadouts.", true),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadouts.", true),
        option.choice(
            "DailyReward",
            "Daily Reward",
            "Tainted Gem: 60\n" +
                "Dark Crystal Shard: 35\n" +
                "Diamond of Nulgath: 100\n" +
                "Totem of Nulgath: 2\n" +
                "Gem of Nulgath: 35\n" +
                "Blood Gem of the Archfiend: 7",
            choices(DailyReward),
            DailyReward.TaintedGem,
        ),
    ];

    static readonly void_Bosses = [
        option.choice(
            "XyfragComposition",
            "Xyfrag Composition",
            "Default: KE / SC / AP / LOO / VDK / Bard / AF\n" +
                "Reliable: LR / SC / AP / LOO / VDK / Bard / Shaman\n" +
                "Stable: AF / SC / AP / LOO / VDK / Bard / Shaman",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.choice(
            "FlibbitiestgibbetComposition",
            "Flibbitiestgibbet Composition",
            "Default: KE / SC / AP / LOO / VDK / Bard / AF\n" +
                "Reliable: LR / SC / AP / LOO / VDK / Bard / AF\n" +
                "Stable: KE / SC / AP / LOO / VDK / Bard / AF",
            choices(VoidFlibbitiestgibbet_LWArmyComposition),
            VoidFlibbitiestgibbet_LWArmyComposition.Default,
        ),
        option.choice(
            "NightbaneComposition",
            "Nightbane Composition",
            "Default: KE / SC / AP / LOO / VDK / Bard / AF\n" +
                "Reliable: LR / SC / AP / LOO / VDK / Bard / Shaman\n" +
                "Stable: KE / SC / AP / LOO / VDK / Bard / AF",
            choices(VoidNightbane_LWArmyComposition),
            VoidNightbane_LWArmyComposition.Default,
        ),
    ];

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (!this.startArmy()) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        Core.logger(`${WrongTurnatVoidbuquerque_LW.logPrefix} started as ${this.playerAlias}.`);

        if (!this.prepareQuest() || !this.sync("QUEST_READY")) {
            return;
        }

        const xyfrag = new VoidXyfrag_LW();
        if (
            !this.runBossUntilReady(
                "XYFRAG",
                "Xyfrag",
                WrongTurnatVoidbuquerque_LW.xyfragEssence,
                xyfrag.startFromMaster.bind(xyfrag),
                xyfrag.runOnceFromMaster.bind(xyfrag),
                xyfrag.stopFromMaster.bind(xyfrag),
            )
        ) {
            return;
        }

        if (!this.moveToHouse()) {
            return;
        }

        const flibbitiestgibbet = new VoidFlibbitiestgibbet_LW();
        if (
            !this.runBossUntilReady(
                "FLIBBITIESTGIBBET",
                "Void Flibbitiestgibbet",
                WrongTurnatVoidbuquerque_LW.flibbitiestgibbetEssence,
                flibbitiestgibbet.startFromMaster.bind(flibbitiestgibbet),
                flibbitiestgibbet.runOnceFromMaster.bind(flibbitiestgibbet),
                flibbitiestgibbet.stopFromMaster.bind(flibbitiestgibbet),
            )
        ) {
            return;
        }

        if (!this.moveToHouse()) {
            return;
        }

        const nightbane = new VoidNightbane_LW();
        if (
            !this.runBossUntilReady(
                "NIGHTBANE",
                "Nightbane",
                WrongTurnatVoidbuquerque_LW.nightbaneEssence,
                nightbane.startFromMaster.bind(nightbane),
                nightbane.runOnceFromMaster.bind(nightbane),
                nightbane.stopFromMaster.bind(nightbane),
            )
        ) {
            return;
        }

        if (!this.moveToHouse()) {
            return;
        }

        this.completeQuest();
        this.showFinalPrerequisiteWarning();

        if (bot.shouldExit || !this.sync("QUEST_RESULT")) {
            return;
        }

        this.stopArmy();
    }

    private validateOptions(): boolean {
        const privateRoomNumber = bot.config!.get<number>("Setup", "PrivateRoomNumber");
        if (!LoneWolf.validatePrivateRoomNumber(privateRoomNumber)) {
            return false;
        }

        const playerSeven = bot.config.get<string>("Setup", "player7")?.trim() ?? "";
        this.armyPlayerCount = !playerSeven ? 6 : 7;
        return true;
    }

    private startArmy(): boolean {
        return (
            LoneWolf.startArmySync(WrongTurnatVoidbuquerque_LW.syncFileName, this.armyPlayerCount, "Setup") &&
            LoneWolf.validateHouseRequirements()
        );
    }

    private prepareQuest(): boolean {
        if (bot.quests.isDailyComplete(WrongTurnatVoidbuquerque_LW.questId)) {
            this.questEligible = false;
            Core.logger(
                `${WrongTurnatVoidbuquerque_LW.questName} is already completed for ${this.playerAlias}. This account will help the Army.`,
                WrongTurnatVoidbuquerque_LW.logPrefix,
            );
            return true;
        }

        const unlocked =
            bot.quests.isInProgress(WrongTurnatVoidbuquerque_LW.questId) ||
            bot.quests.isUnlocked(WrongTurnatVoidbuquerque_LW.questId);
        if (!unlocked) {
            this.questEligible = false;
            Core.logger(
                `${WrongTurnatVoidbuquerque_LW.questName} is locked for ${this.playerAlias}. Complete ${WrongTurnatVoidbuquerque_LW.prerequisiteQuestName} before running this daily. This account will continue as a helper.`,
                WrongTurnatVoidbuquerque_LW.logPrefix,
                { messageBox: true },
            );
            return true;
        }

        if (!bot.quests.isInProgress(WrongTurnatVoidbuquerque_LW.questId)) {
            Core.ensureAccept(WrongTurnatVoidbuquerque_LW.questId);
        }

        this.questEligible = bot.quests.isInProgress(WrongTurnatVoidbuquerque_LW.questId);
        if (!this.questEligible) {
            Core.logger(
                LoneWolf.explainFailure(
                    `${WrongTurnatVoidbuquerque_LW.questName} could not be accepted for ${this.playerAlias}. This account will continue as a helper.`,
                ),
                WrongTurnatVoidbuquerque_LW.logPrefix,
                { messageBox: true },
            );
            return true;
        }

        Core.logger(
            `${WrongTurnatVoidbuquerque_LW.questName} is active for ${this.playerAlias}.`,
            WrongTurnatVoidbuquerque_LW.logPrefix,
        );
        return true;
    }

    private runBossUntilReady(
        phaseName: string,
        bossName: string,
        requiredEssence: string,
        startBoss: () => boolean,
        runBoss: () => boolean,
        stopBoss: () => void,
    ): boolean {
        const readySignal = `${phaseName}_ESSENCE_READY`;
        let cycle = 0;
        let statusPass = 0;
        let startAttempted = false;

        try {
            while (!bot.shouldExit) {
                const localReady = !this.questEligible || bot.inventory.contains(requiredEssence);
                if (localReady) {
                    if (!LoneWolf.sendArmySignal(readySignal)) {
                        return false;
                    }

                    Core.logger(
                        this.questEligible
                            ? `${WrongTurnatVoidbuquerque_LW.logPrefix} ${this.playerAlias} confirmed ${requiredEssence}.`
                            : `${WrongTurnatVoidbuquerque_LW.logPrefix} ${this.playerAlias} is exempt from the ${requiredEssence} gate.`,
                    );
                }

                if (!this.sync(`${phaseName}_${statusPass}_STATUS`)) {
                    return false;
                }

                statusPass++;

                if (this.allPlayersSignaled(readySignal)) {
                    Core.logger(
                        `Every eligible account confirmed ${requiredEssence}.`,
                        WrongTurnatVoidbuquerque_LW.logPrefix,
                    );
                    return true;
                }

                if (!startAttempted) {
                    startAttempted = true;
                    if (!startBoss()) {
                        return this.bossFailure(
                            LoneWolf.explainFailure(`${bossName} setup failed before the essence gate was ready.`),
                        );
                    }

                    continue;
                }

                Core.logger(`Starting ${bossName} kill ${cycle + 1}.`, WrongTurnatVoidbuquerque_LW.logPrefix);
                if (!runBoss()) {
                    return this.bossFailure(
                        LoneWolf.explainFailure(`${bossName} failed before the essence gate was ready.`),
                    );
                }

                bot.sleep(1500);
                cycle++;
            }
        } finally {
            if (startAttempted) {
                stopBoss();
            }
        }

        return false;
    }

    private allPlayersSignaled(signal: string): boolean {
        for (let playerNumber = 1; playerNumber <= this.armyPlayerCount; playerNumber++) {
            if (!LoneWolf.hasArmySignal(signal, playerNumber)) {
                return false;
            }
        }

        return true;
    }

    private moveToHouse(): boolean {
        return LoneWolf.moveToHouse(WrongTurnatVoidbuquerque_LW.logPrefix);
    }

    private completeQuest(): void {
        if (!this.questEligible || bot.shouldExit) {
            return;
        }

        const rewardItemId = WrongTurnatVoidbuquerque_LW.getRewardItemId(
            bot.config!.get<DailyReward>("Setup", "DailyReward"),
        );
        Core.ensureComplete(WrongTurnatVoidbuquerque_LW.questId, rewardItemId);

        if (bot.quests.isDailyComplete(WrongTurnatVoidbuquerque_LW.questId)) {
            Core.logger(
                `${WrongTurnatVoidbuquerque_LW.questName} completed for ${this.playerAlias}.`,
                WrongTurnatVoidbuquerque_LW.logPrefix,
            );
            return;
        }

        Core.logger(
            LoneWolf.explainFailure(
                `${WrongTurnatVoidbuquerque_LW.questName} could not be completed for ${this.playerAlias}. Other accounts will continue.`,
            ),
            WrongTurnatVoidbuquerque_LW.logPrefix,
            { messageBox: true },
        );
    }

    private showFinalPrerequisiteWarning(): void {
        if (
            bot.quests.isDailyComplete(WrongTurnatVoidbuquerque_LW.questId) ||
            bot.quests.isInProgress(WrongTurnatVoidbuquerque_LW.questId) ||
            bot.quests.isUnlocked(WrongTurnatVoidbuquerque_LW.questId)
        ) {
            return;
        }

        Core.logger(
            `${WrongTurnatVoidbuquerque_LW.questName} is still locked for ${this.playerAlias}. Complete ${WrongTurnatVoidbuquerque_LW.prerequisiteQuestName} before this account can turn in the daily.`,
            WrongTurnatVoidbuquerque_LW.logPrefix,
            { messageBox: true },
        );
    }

    private static getRewardItemId(reward: DailyReward): number {
        return reward === DailyReward.TaintedGem
            ? 4769
            : reward === DailyReward.DarkCrystalShard
              ? 4770
              : reward === DailyReward.DiamondOfNulgath
                ? 4771
                : reward === DailyReward.TotemOfNulgath
                  ? 5357
                  : reward === DailyReward.GemOfNulgath
                    ? 6136
                    : reward === DailyReward.BloodGemOfTheArchfiend
                      ? 22332
                      : 4769;
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

        if (LoneWolf.isArmyPlayer(7)) {
            return "playerSeven";
        }

        return "player";
    }

    private sync(step: string): boolean {
        Core.logger(`${WrongTurnatVoidbuquerque_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${WrongTurnatVoidbuquerque_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private bossFailure(message: string): boolean {
        if (bot.shouldExit) {
            Core.logger(message, WrongTurnatVoidbuquerque_LW.logPrefix);
        } else {
            Core.logger(message, WrongTurnatVoidbuquerque_LW.logPrefix, { messageBox: true, stopBot: true });
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
                Core.logger(`${WrongTurnatVoidbuquerque_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${WrongTurnatVoidbuquerque_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${WrongTurnatVoidbuquerque_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${WrongTurnatVoidbuquerque_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions("WrongTurnatVoidbuquerque_LW", [], true, {
    Setup: WrongTurnatVoidbuquerque_LW.setup,
    Void_Bosses: WrongTurnatVoidbuquerque_LW.void_Bosses,
});

export default function main(): void {
    const script = new WrongTurnatVoidbuquerque_LW();
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
