/*
name: All Ultras LW
description: Runs selected LoneWolf four-player Ultra scripts in order.
tags: ultra, army, corelonewolf, master
*/
// Port of 0AllUltras_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../core/CoreBots";
import { CoreLoneWolf, UltraRunResult } from "./CoreLoneWolf";
import { ArmyComposition as UltraEngineer_LWArmyComposition, UltraEngineer_LW } from "./dailies/UltraEngineer_LW";
import { ArmyComposition, UltraEzrajal_LW } from "./dailies/UltraEzrajal_LW";
import { ArmyComposition as UltraTyndarius_LWArmyComposition, UltraTyndarius_LW } from "./dailies/UltraTyndarius_LW";
import { ArmyComposition as UltraWarden_LWArmyComposition, UltraWarden_LW } from "./dailies/UltraWarden_LW";
import { ArmyComposition as UltraDage_LWArmyComposition, UltraDage_LW } from "./UltraDage_LW";
import { ArmyComposition as UltraDarkon_LWArmyComposition, UltraDarkon_LW } from "./UltraDarkon_LW";
import { ArmyComposition as UltraDrago_LWArmyComposition, UltraDrago_LW } from "./UltraDrago_LW";
import { ArmyComposition as UltraDrakath_LWArmyComposition, UltraDrakath_LW } from "./UltraDrakath_LW";
import { ArmyComposition as UltraGramiel_LWArmyComposition, UltraGramiel_LW } from "./UltraGramiel_LW";
import { ArmyComposition as UltraNulgath_LWArmyComposition, UltraNulgath_LW } from "./UltraNulgath_LW";
import { ArmyComposition as UltraSpeaker_LWArmyComposition, UltraSpeaker_LW } from "./UltraSpeaker_LW";

const LoneWolf = new CoreLoneWolf();

export class AllUltras_LW {
    private static readonly logPrefix = "All Ultras LW";
    private static readonly completionSyncFileName = "0AllUltras_Completion.sync";
    private static readonly completionSignalPrefix = "ULTRA_REQUIRED_";
    private static readonly ezrajalBit: number = 1 << 0;
    private static readonly wardenBit: number = 1 << 1;
    private static readonly engineerBit: number = 1 << 2;
    private static readonly tyndariusBit: number = 1 << 3;
    private static readonly drakathBit: number = 1 << 4;
    private static readonly dragoBit: number = 1 << 5;
    private static readonly nulgathBit: number = 1 << 6;
    private static readonly dageBit: number = 1 << 7;
    private static readonly darkonBit: number = 1 << 8;
    private static readonly gramielBit: number = 1 << 9;
    private static readonly speakerBit: number = 1 << 10;

    private static readonly ultraBits: number[] = [
        AllUltras_LW.ezrajalBit,
        AllUltras_LW.wardenBit,
        AllUltras_LW.engineerBit,
        AllUltras_LW.tyndariusBit,
        AllUltras_LW.drakathBit,
        AllUltras_LW.dragoBit,
        AllUltras_LW.nulgathBit,
        AllUltras_LW.dageBit,
        AllUltras_LW.darkonBit,
        AllUltras_LW.gramielBit,
        AllUltras_LW.speakerBit,
    ];

    private skipCompletedUltras: boolean = false;
    private partyRequiredMask: number = 0;
    private actualRunMask: number = 0;
    private remainingUltras: number = 0;
    private totalUltras: number = 0;
    private processedUltras: number = 0;

    static readonly setup = [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadouts.", true),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadouts.", true),
        option.bool(
            "SkipCompletedUltras",
            "Skip Completed Ultras?",
            "Skip an Ultra when all four accounts completed its quest.",
            true,
        ),
    ];

    static readonly daily_Ultras = [
        option.bool("RunUltraEzrajal", "Run Ultra Ezrajal", "Run Ultra Ezrajal.", true),
        option.choice(
            "UltraEzrajalComposition",
            "→ Ultra Ezrajal Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nPay2Win: Guardian / AP / LR / LOO\nAbyssal: Kathool Adept / SC / AP / LOO",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.bool(
            "UltraEzrajalSkipManaLock",
            "→ Skip Mana Lock?",
            "Skip the Battle Oracle Battlestaff Mana Lock preparation.",
            true,
        ),
        option.bool("RunUltraWarden", "Run Ultra Warden", "Run Ultra Warden.", true),
        option.choice(
            "UltraWardenComposition",
            "→ Ultra Warden Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nPay2Win: Guardian / AP / LR / LOO\nAbyssal: Kathool Adept / SC / AP / LOO",
            choices(UltraWarden_LWArmyComposition),
            UltraWarden_LWArmyComposition.Default,
        ),
        option.bool("RunUltraEngineer", "Run Ultra Engineer", "Run Ultra Engineer.", true),
        option.choice(
            "UltraEngineerComposition",
            "→ Ultra Engineer Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nPay2Win: Guardian / AP / LR / LOO\nAbyssal: Kathool Adept / SC / AP / LOO",
            choices(UltraEngineer_LWArmyComposition),
            UltraEngineer_LWArmyComposition.Default,
        ),
        option.bool("RunUltraTyndarius", "Run Ultra Tyndarius", "Run Ultra Tyndarius.", true),
        option.choice(
            "UltraTyndariusComposition",
            "→ Ultra Tyndarius Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nFast: AI / AP / LR / LOO\nPay2Win: Guardian / AP / LR / LOO\nTest: LR / SC / AP / LOO\nAbyssal: Kathool Adept / SC / AP / LOO",
            choices(UltraTyndarius_LWArmyComposition),
            UltraTyndarius_LWArmyComposition.Default,
        ),
    ];

    static readonly weekly_Ultras = [
        option.bool("RunChampionDrakath", "Run Champion Drakath", "Run Champion Drakath.", true),
        option.choice(
            "ChampionDrakathComposition",
            "→ Champion Drakath Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nOptimized: Chaos Slayer / SC / AP / LOO\nPay2Win: Guardian / AP / LR / LOO\nPay2Win2: Guardian / PCM / LR / LOO\nPay2Win3: Martial Artist / PCM / LR / LOO",
            choices(UltraDrakath_LWArmyComposition),
            UltraDrakath_LWArmyComposition.Default,
        ),
        option.bool("RunUltraDrago", "Run Ultra Drago", "Run Ultra Drago.", true),
        option.choice(
            "UltraDragoComposition",
            "→ Ultra Drago Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nPay2Win: Guardian / SC / AP / LOO\nAbyssal: Kathool Adept / SC / AP / LOO",
            choices(UltraDrago_LWArmyComposition),
            UltraDrago_LWArmyComposition.Default,
        ),
        option.bool("RunUltraNulgath", "Run Ultra Nulgath", "Run Ultra Nulgath.", true),
        option.choice(
            "UltraNulgathComposition",
            "→ Ultra Nulgath Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nOptimized: DOT / DOT / LR / LOO\nPay2Win: Guardian / VDK / LR / LOO\nFast: AI / VDK / LR / LOO",
            choices(UltraNulgath_LWArmyComposition),
            UltraNulgath_LWArmyComposition.Default,
        ),
        option.bool("RunUltraDage", "Run Ultra Dage", "Run Ultra Dage.", true),
        option.choice(
            "UltraDageComposition",
            "→ Ultra Dage Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nPay2Win: CSS / AP / VDK / AF",
            choices(UltraDage_LWArmyComposition),
            UltraDage_LWArmyComposition.Default,
        ),
        option.bool("RunUltraDarkon", "Run Ultra Darkon", "Run Ultra Darkon.", true),
        option.choice(
            "UltraDarkonComposition",
            "→ Ultra Darkon Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nOptimized: LC / SC / AP / LOO\nPay2Win: Guardian / SC / AP / LOO",
            choices(UltraDarkon_LWArmyComposition),
            UltraDarkon_LWArmyComposition[UltraDarkon_LWArmyComposition.Default],
        ),
        option.bool("RunUltraGramiel", "Run Ultra Gramiel", "Run Ultra Gramiel.", true),
        option.choice(
            "UltraGramielComposition",
            "→ Ultra Gramiel Composition",
            "Default: LR / SC / AP / LOO\nOptimized: Shaman / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nPay2Win: Guardian / SC / AP / LOO\nAbyssal: Kathool Adept / SC / AP / LOO",
            choices(UltraGramiel_LWArmyComposition),
            UltraGramiel_LWArmyComposition[UltraGramiel_LWArmyComposition.Default],
        ),
        option.bool("RunUltraSpeaker", "Run Ultra Speaker", "Run Ultra Speaker.", true),
        option.choice(
            "UltraSpeakerComposition",
            "→ Ultra Speaker Composition",
            "Default: LR / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nPay2Win: Guardian / SC / LR / AP\nFast: Martial Artist / SC / LR / AP",
            choices(UltraSpeaker_LWArmyComposition),
            UltraSpeaker_LWArmyComposition[UltraSpeaker_LWArmyComposition.Default],
        ),
        option.bool(
            "UltraSpeakerBruteForceMethod",
            "→ Brute Force Method",
            "Keep everyone in the safe zone and skip Equalize movement.",
            false,
        ),
    ];

    run(): void {
        const privateRoomNumber = bot.config!.get<number>("Setup", "PrivateRoomNumber");
        if (!LoneWolf.validatePrivateRoomNumber(privateRoomNumber)) {
            return;
        }

        const selectedMask = this.buildSelectedMask();
        if (selectedMask === 0) {
            Core.logger("No Ultras were selected.", AllUltras_LW.logPrefix);
            return;
        }

        this.skipCompletedUltras = bot.config.get<boolean>("Setup", "SkipCompletedUltras");
        this.totalUltras = AllUltras_LW.countUltras(selectedMask);
        this.processedUltras = 0;
        const totalTimer = stopwatch();
        if (this.skipCompletedUltras && !this.buildPartyRequiredMask()) {
            totalTimer.stop();
            this.logSequenceStopped(totalTimer.elapsed);
            return;
        }

        this.actualRunMask = this.skipCompletedUltras ? selectedMask & this.partyRequiredMask : selectedMask;
        this.remainingUltras = AllUltras_LW.countUltras(this.actualRunMask);
        if (this.remainingUltras === 0) {
            totalTimer.stop();
            Core.logger(
                "All selected Ultras are already completed by the party. Nothing to run.",
                AllUltras_LW.logPrefix,
            );
            return;
        }

        this.totalUltras = this.remainingUltras;

        if (this.remainingUltras > 1 && !this.prepareOracle()) {
            totalTimer.stop();
            this.logSequenceStopped(totalTimer.elapsed);
            return;
        }

        if (
            !this.runSelectedUltra("Daily_Ultras", "RunUltraEzrajal", "Ultra Ezrajal", AllUltras_LW.ezrajalBit, () =>
                new UltraEzrajal_LW().runFromMaster(),
            ) ||
            !this.runSelectedUltra("Daily_Ultras", "RunUltraWarden", "Ultra Warden", AllUltras_LW.wardenBit, () =>
                new UltraWarden_LW().runFromMaster(),
            ) ||
            !this.runSelectedUltra("Daily_Ultras", "RunUltraEngineer", "Ultra Engineer", AllUltras_LW.engineerBit, () =>
                new UltraEngineer_LW().runFromMaster(),
            ) ||
            !this.runSelectedUltra(
                "Daily_Ultras",
                "RunUltraTyndarius",
                "Ultra Tyndarius",
                AllUltras_LW.tyndariusBit,
                () => new UltraTyndarius_LW().runFromMaster(),
            ) ||
            !this.runSelectedUltra(
                "Weekly_Ultras",
                "RunChampionDrakath",
                "Champion Drakath",
                AllUltras_LW.drakathBit,
                () => new UltraDrakath_LW().runFromMaster(),
            ) ||
            !this.runSelectedUltra("Weekly_Ultras", "RunUltraDrago", "Ultra Drago", AllUltras_LW.dragoBit, () =>
                new UltraDrago_LW().runFromMaster(),
            ) ||
            !this.runSelectedUltra("Weekly_Ultras", "RunUltraNulgath", "Ultra Nulgath", AllUltras_LW.nulgathBit, () =>
                new UltraNulgath_LW().runFromMaster(),
            ) ||
            !this.runSelectedUltra("Weekly_Ultras", "RunUltraDage", "Ultra Dage", AllUltras_LW.dageBit, () =>
                new UltraDage_LW().runFromMaster(),
            ) ||
            !this.runSelectedUltra("Weekly_Ultras", "RunUltraDarkon", "Ultra Darkon", AllUltras_LW.darkonBit, () =>
                new UltraDarkon_LW().runFromMaster(),
            ) ||
            !this.runSelectedUltra("Weekly_Ultras", "RunUltraGramiel", "Ultra Gramiel", AllUltras_LW.gramielBit, () =>
                new UltraGramiel_LW().runFromMaster(),
            ) ||
            !this.runSelectedUltra("Weekly_Ultras", "RunUltraSpeaker", "Ultra Speaker", AllUltras_LW.speakerBit, () =>
                new UltraSpeaker_LW().runFromMaster(),
            )
        ) {
            totalTimer.stop();
            this.logSequenceStopped(totalTimer.elapsed);
            return;
        }

        totalTimer.stop();
        Core.logger(
            `All selected Ultras finished in ${AllUltras_LW.formatDuration(totalTimer.elapsed)} (${this.processedUltras}/${this.totalUltras}).`,
            AllUltras_LW.logPrefix,
        );
    }

    private buildSelectedMask(): number {
        let mask = 0;

        if (this.getUltraOption("Daily_Ultras", "RunUltraEzrajal")) {
            mask |= AllUltras_LW.ezrajalBit;
        }
        if (this.getUltraOption("Daily_Ultras", "RunUltraWarden")) {
            mask |= AllUltras_LW.wardenBit;
        }
        if (this.getUltraOption("Daily_Ultras", "RunUltraEngineer")) {
            mask |= AllUltras_LW.engineerBit;
        }
        if (this.getUltraOption("Daily_Ultras", "RunUltraTyndarius")) {
            mask |= AllUltras_LW.tyndariusBit;
        }
        if (this.getUltraOption("Weekly_Ultras", "RunChampionDrakath")) {
            mask |= AllUltras_LW.drakathBit;
        }
        if (this.getUltraOption("Weekly_Ultras", "RunUltraDrago")) {
            mask |= AllUltras_LW.dragoBit;
        }
        if (this.getUltraOption("Weekly_Ultras", "RunUltraNulgath")) {
            mask |= AllUltras_LW.nulgathBit;
        }
        if (this.getUltraOption("Weekly_Ultras", "RunUltraDage")) {
            mask |= AllUltras_LW.dageBit;
        }
        if (this.getUltraOption("Weekly_Ultras", "RunUltraDarkon")) {
            mask |= AllUltras_LW.darkonBit;
        }
        if (this.getUltraOption("Weekly_Ultras", "RunUltraGramiel")) {
            mask |= AllUltras_LW.gramielBit;
        }
        if (this.getUltraOption("Weekly_Ultras", "RunUltraSpeaker")) {
            mask |= AllUltras_LW.speakerBit;
        }

        return mask;
    }

    private static countUltras(mask: number): number {
        let count = 0;

        for (const ultraBit of AllUltras_LW.ultraBits) {
            if ((mask & ultraBit) !== 0) {
                count++;
            }
        }

        return count;
    }

    private getUltraOption(category: string, optionName: string): boolean {
        return bot.config!.get<boolean>(category, optionName);
    }

    private buildPartyRequiredMask(): boolean {
        if (!LoneWolf.startArmySync(AllUltras_LW.completionSyncFileName, 4, "Setup")) {
            return false;
        }

        if (!LoneWolf.validateHouseRequirements()) {
            return false;
        }

        const localRequiredMask = this.buildLocalRequiredMask();
        for (const ultraBit of AllUltras_LW.ultraBits) {
            if (
                (localRequiredMask & ultraBit) !== 0 &&
                !LoneWolf.sendArmySignal(AllUltras_LW.getCompletionSignal(ultraBit))
            ) {
                return false;
            }
        }

        if (!LoneWolf.syncArmy("COMPLETION_MASK_READY")) {
            return false;
        }

        this.partyRequiredMask = 0;
        for (const ultraBit of AllUltras_LW.ultraBits) {
            const signal = AllUltras_LW.getCompletionSignal(ultraBit);
            for (let playerNumber = 1; playerNumber <= 4; playerNumber++) {
                if (!LoneWolf.hasArmySignal(signal, playerNumber)) {
                    continue;
                }

                this.partyRequiredMask |= ultraBit;
                break;
            }
        }

        Core.logger("Ultra completion check finished.", AllUltras_LW.logPrefix);
        return true;
    }

    private buildLocalRequiredMask(): number {
        let mask = 0;

        if (this.needsUltra("Daily_Ultras", "RunUltraEzrajal", 8152)) {
            mask |= AllUltras_LW.ezrajalBit;
        }
        if (this.needsUltra("Daily_Ultras", "RunUltraWarden", 8153)) {
            mask |= AllUltras_LW.wardenBit;
        }
        if (this.needsUltra("Daily_Ultras", "RunUltraEngineer", 8154)) {
            mask |= AllUltras_LW.engineerBit;
        }
        if (this.needsUltra("Daily_Ultras", "RunUltraTyndarius", 8245)) {
            mask |= AllUltras_LW.tyndariusBit;
        }
        if (this.needsUltra("Weekly_Ultras", "RunChampionDrakath", 8300)) {
            mask |= AllUltras_LW.drakathBit;
        }
        if (this.needsUltra("Weekly_Ultras", "RunUltraDrago", 8397)) {
            mask |= AllUltras_LW.dragoBit;
        }
        if (this.needsUltra("Weekly_Ultras", "RunUltraNulgath", 8692)) {
            mask |= AllUltras_LW.nulgathBit;
        }
        if (this.needsUltra("Weekly_Ultras", "RunUltraDage", 8547)) {
            mask |= AllUltras_LW.dageBit;
        }
        if (this.needsUltra("Weekly_Ultras", "RunUltraDarkon", 8746)) {
            mask |= AllUltras_LW.darkonBit;
        }
        if (this.needsUltra("Weekly_Ultras", "RunUltraGramiel", 10301)) {
            mask |= AllUltras_LW.gramielBit;
        }
        if (this.needsUltra("Weekly_Ultras", "RunUltraSpeaker", 9173)) {
            mask |= AllUltras_LW.speakerBit;
        }

        return mask;
    }

    private needsUltra(category: string, optionName: string, questId: number): boolean {
        return this.getUltraOption(category, optionName) && !bot.quests.isDailyComplete(questId);
    }

    private static getCompletionSignal(ultraBit: number): string {
        return `${AllUltras_LW.completionSignalPrefix}${ultraBit}`;
    }

    private runSelectedUltra(
        category: string,
        optionName: string,
        ultraName: string,
        ultraBit: number,
        runUltra: () => UltraRunResult,
    ): boolean {
        if (!this.getUltraOption(category, optionName)) {
            return true;
        }

        if (bot.shouldExit) {
            return false;
        }

        if ((this.actualRunMask & ultraBit) === 0) {
            Core.logger(`${ultraName} is completed on all four accounts. Skipping.`, AllUltras_LW.logPrefix);
            return true;
        }

        Core.logger(`Starting ${ultraName} (${this.processedUltras + 1}/${this.totalUltras}).`, AllUltras_LW.logPrefix);

        const timer = stopwatch();
        const result = runUltra();
        timer.stop();

        const duration = AllUltras_LW.formatDuration(timer.elapsed);
        const remainingAfterCurrent = Math.max(this.remainingUltras - 1, 0);

        if (result === UltraRunResult.Completed) {
            this.processedUltras++;
            Core.logger(
                `${ultraName} completed in ${duration}. [${this.processedUltras}/${this.totalUltras}] ${remainingAfterCurrent} remaining.`,
                AllUltras_LW.logPrefix,
            );
            return this.continueAfterUltra();
        }

        if (result === UltraRunResult.AttemptsExhausted) {
            this.processedUltras++;
            Core.logger(
                `${ultraName} exhausted all fight attempts after ${duration}. [${this.processedUltras}/${this.totalUltras}] ${remainingAfterCurrent} remaining. Continuing.`,
                AllUltras_LW.logPrefix,
            );
            return this.continueAfterUltra();
        }

        if (bot.shouldExit) {
            Core.logger(
                `${ultraName} failed after ${duration} with ${this.processedUltras}/${this.totalUltras} processed. Stopping the Ultra sequence.`,
                AllUltras_LW.logPrefix,
            );
        } else {
            Core.logger(
                `${ultraName} failed after ${duration} with ${this.processedUltras}/${this.totalUltras} processed. Stopping the Ultra sequence.`,
                AllUltras_LW.logPrefix,
                { messageBox: true, stopBot: true },
            );
        }
        return false;
    }

    private logSequenceStopped(elapsed: number): void {
        Core.logger(
            `Ultra sequence stopped after ${AllUltras_LW.formatDuration(elapsed)} with ${this.processedUltras}/${this.totalUltras} processed.`,
            AllUltras_LW.logPrefix,
        );
    }

    private static formatDuration(elapsed: number): string {
        const totalHours = Math.trunc(elapsed / 3600000);
        return `${String(totalHours).padStart(2, "0")}:${String(Math.floor(elapsed / 60000) % 60).padStart(2, "0")}:${String(Math.floor(elapsed / 1000) % 60).padStart(2, "0")}`;
    }

    private prepareOracle(): boolean {
        const oracleName = "Oracle";

        if (bot.inventory.contains(oracleName)) {
            return true;
        }

        if (bot.flash.get<string>("ui.mcPopup.currentLabel") !== "Bank") {
            bot.bank.open();
        }

        bot.bank.load(false);
        bot.wait.forBankLoad(20);

        if (bot.bank.contains(oracleName)) {
            if (!Core.hasSpaceFor(bot.bank.getItem(oracleName))) {
                return this.oracleFailure(
                    "Oracle could not be moved from bank because no inventory slot is available.",
                );
            }

            bot.bank.ensureToInventory(oracleName);
            bot.wait.forTrue(() => bot.inventory.contains(oracleName), 14);

            if (!bot.inventory.contains(oracleName)) {
                return this.oracleFailure(LoneWolf.explainFailure("Oracle could not be moved from bank."));
            }

            Core.logger("Oracle moved from bank.", AllUltras_LW.logPrefix);
            return true;
        }

        if (!Core.hasSpaceFor(Core.parseShopItem(Core.getShopItems("classhalla", 759), 759, oracleName))) {
            return this.oracleFailure("Oracle could not be purchased because no inventory slot is available.");
        }

        Core.buyItem("classhalla", 759, oracleName);
        if (!bot.inventory.contains(oracleName)) {
            return this.oracleFailure(LoneWolf.explainFailure("Oracle could not be purchased."));
        }

        Core.logger("Oracle purchased.", AllUltras_LW.logPrefix);
        return true;
    }

    private continueAfterUltra(): boolean {
        this.remainingUltras--;
        if (this.remainingUltras <= 0) {
            return true;
        }

        return this.resetBetweenUltras();
    }

    private getConfiguredPlayerAlias(): string {
        const username = Core.username().trim();
        if (username.length === 0) {
            return "unknownPlayer";
        }

        const playerAliases = ["playerOne", "playerTwo", "playerThree", "playerFour"];
        for (let index = 0; index < playerAliases.length; index++) {
            const configuredPlayer = bot.config?.get<string>("Setup", `player${index + 1}`);
            if (configuredPlayer?.trim()?.toLowerCase() === username?.toLowerCase()) {
                return playerAliases[index];
            }
        }

        return "unknownPlayer";
    }

    private resetBetweenUltras(): boolean {
        if (!LoneWolf.moveToHouse(AllUltras_LW.logPrefix, this.getConfiguredPlayerAlias())) {
            return false;
        }

        bot.sleep(1000);
        LoneWolf.equipClass(LoneWolf.oracle());
        if (bot.shouldExit) {
            return false;
        }

        if (!(bot.player.currentClass?.toLowerCase() === "Oracle"?.toLowerCase())) {
            return this.oracleFailure(LoneWolf.explainFailure("Oracle could not be equipped.", true));
        }

        bot.sleep(1000);
        return !bot.shouldExit;
    }

    private oracleFailure(message: string): boolean {
        Core.logger(
            message + "\nThis class is required in order to reset the auras in between Ultra fights",
            AllUltras_LW.logPrefix,
            { messageBox: true, stopBot: true },
        );
        return false;
    }
}

export const scriptOptions = defineScriptOptions("0AllUltras_LW", [], true, {
    Setup: AllUltras_LW.setup,
    Daily_Ultras: AllUltras_LW.daily_Ultras,
    Weekly_Ultras: AllUltras_LW.weekly_Ultras,
});

export default function main(): void {
    const script = new AllUltras_LW();
    bot.skills.stop();
    bot.options.infiniteRange = true;
    LoneWolf.setAntiLag();
    bot.config?.configure();

    script.run();
}

/** C#'s `Stopwatch.StartNew()`: `elapsed` in milliseconds, frozen once `stop()`ped. */
function stopwatch(): { stop(): void; readonly elapsed: number } {
    const startedAt = Date.now();
    let stoppedAt: number | null = null;
    return {
        stop() {
            stoppedAt ??= Date.now();
        },
        get elapsed() {
            return (stoppedAt ?? Date.now()) - startedAt;
        },
    };
}
