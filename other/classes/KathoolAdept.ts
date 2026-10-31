/*
name: Kathool Adept
description: Farms Kathool Adept through Bottom Feeder or the owned Adeptus Kathooli shortcut. Requires level 80 and completes the Voice in the Sea saga.
tags: kathool, depths, adept, class, callofkathool, somnia, fishing
*/
// Port of Scripts/Other/Classes/KathoolAdept.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { AbyssalZoneMerge } from "../mergeshops/AbyssalZoneMerge";
import { MidnightZoneMerge } from "../mergeshops/MidnightZoneMerge";
import { SeaviewSouvenirsMerge } from "../mergeshops/SeaviewSouvenirsMerge";
import { SeaVoiceMerge } from "../mergeshops/SeaVoiceMerge";
import { TrenchObserveMerge } from "../mergeshops/TrenchObserveMerge";
import { TwilightZoneMerge } from "../mergeshops/TwilightZoneMerge";
import { UndineCommissaryMerge } from "../mergeshops/UndineCommissaryMerge";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Farm = new CoreFarms();
const AOR = new CoreAOR();
const Adv = new CoreAdvanced();

export class KathoolAdept {
    readonly requiredArmors: string[] = [
        "Kathool Acolyte",
        "Ashray Elf Warden",
        "Midnight Glaucus Sage",
        "DeepWater Drow",
        "Ashray Villager",
        "Evacuation Protocol Suit",
        "Undine Defence Director",
        "Elven Heritage Guardian",
    ];

    getClass(rankUpClass = true): void {
        if (Core.checkInventory(104429, undefined, { toInv: false })) {
            Core.logger("Kathool Adept is already owned.");
            if (rankUpClass) {
                Adv.rankUpClass("Kathool Adept");
            }
            return;
        }

        if (bot.player.level < 80) {
            Core.logger("Kathool Adept requires level 80.");
            return;
        }

        if (bot.shouldExit) {
            return;
        }

        AOR.seaVoice();
        if (bot.shouldExit) {
            return;
        }

        bot.wait.forTrue(() => Core.isCompletedBefore(9348, false), 20);
        if (bot.shouldExit) {
            return;
        }
        if (!Core.isCompletedBefore(9348, false)) {
            Core.logger("Voice in the Sea saga completion was not confirmed. Class quests will not start.");
            return;
        }

        Core.addDrop(104429, 104532, 104533);
        Core.join("callofkathool");

        // Both unlock quests advance slot 657 to the same value.
        if (!bot.quests.isUnlocked(10920)) {
            if (Core.checkInventory(78153)) {
                Core.logger("Using the owned Adeptus Kathooli shortcut.");
                if (!this.acceptQuest(10919)) {
                    return;
                }
                Core.ensureComplete(10919);
            } else {
                if (!this.bottomFeeder()) {
                    return;
                }
            }

            bot.wait.forTrue(() => bot.quests.isUnlocked(10920), 20);
            if (bot.shouldExit) {
                return;
            }
            if (!bot.quests.isUnlocked(10920)) {
                Core.logger("Call of Kathool is still locked. Unlock quest completion was not confirmed.");
                return;
            }
        }

        Core.join("callofkathool");
        if (!this.acceptQuest(10920)) {
            return;
        }

        Core.equipClass(ClassType.Solo);
        Core.huntMonster("callofkathool", "Mad Morsel", "Kathool's Morsel Consumed", undefined, { log: false });
        if (bot.shouldExit) {
            return;
        }
        if (!bot.tempInv.contains(104534)) {
            Core.logger("The Mad Morsel quest drop was not obtained.");
            return;
        }

        Core.ensureComplete(10920, 104429);
        bot.wait.forTrue(() => bot.inventory.contains(104429), 20);
        if (bot.inventory.contains(104429)) {
            Core.logger("Kathool Adept obtained.");
            if (rankUpClass) {
                Adv.rankUpClass("Kathool Adept");
            }
        } else {
            Core.logger("The Kathool Adept reward was not received. Check the quest and inventory space.");
        }
    }

    private bottomFeeder(): boolean {
        this.farmRequiredArmors();
        if (bot.shouldExit) {
            return false;
        }

        for (const armor of this.requiredArmors) {
            if (!Core.checkInventory(armor) || !bot.inventory.contains(armor)) {
                Core.logger(`Required armor is missing from inventory: ${armor}.`);
                return false;
            }
        }

        Farm.somniaREP();
        if (bot.shouldExit) {
            return false;
        }
        if (Farm.factionRank("Somnia") < 10) {
            Core.logger("Bottom Feeder requires rank 10 Somnia.");
            return false;
        }

        Farm.fishingREP();
        if (bot.shouldExit) {
            return false;
        }
        if (Farm.factionRank("Fishing") < 10) {
            Core.logger("Johnnyfish requires rank 10 Fishing.");
            return false;
        }

        Core.buyItem("greenguardwest", 363, 104533, undefined, 15252);
        if (bot.shouldExit) {
            return false;
        }
        if (!Core.checkInventory(104533) || !bot.inventory.contains(104533)) {
            Core.logger("Johnnyfish is missing from inventory.");
            return false;
        }

        Core.join("callofkathool");
        if (!this.acceptQuest(10918)) {
            return false;
        }

        Core.equipClass(ClassType.Farm);
        Core.huntMonster("callofkathool", "Kathool Kultist", "Kultist's Morsel", 75, { isTemp: false, log: false });
        if (bot.shouldExit) {
            return false;
        }
        if (!bot.inventory.contains(104532, 75)) {
            Core.logger("Bottom Feeder requires 75 Kultist morsels in inventory.");
            return false;
        }

        Core.ensureComplete(10918);
        return !bot.shouldExit;
    }

    private farmRequiredArmors(): void {
        if (!bot.shouldExit && !Core.checkInventory("Ashray Villager")) {
            new SeaviewSouvenirsMerge().buyAllMerge("Ashray Villager");
        }

        if (!bot.shouldExit && !Core.checkInventory("Undine Defence Director")) {
            new UndineCommissaryMerge().buyAllMerge("Undine Defence Director");
        }

        if (!bot.shouldExit && !Core.checkInventory("Evacuation Protocol Suit")) {
            new TwilightZoneMerge().buyAllMerge("Evacuation Protocol Suit");
        }

        if (!bot.shouldExit && !Core.checkInventory("Elven Heritage Guardian")) {
            new MidnightZoneMerge().buyAllMerge("Elven Heritage Guardian");
        }

        // DeepWater Drow consumes one Warden. Obtain the retained Warden afterward.
        if (!bot.shouldExit && !Core.checkInventory("DeepWater Drow")) {
            new TrenchObserveMerge().buyAllMerge("DeepWater Drow");
        }

        if (!bot.shouldExit && !Core.checkInventory("Ashray Elf Warden")) {
            new AbyssalZoneMerge().buyAllMerge("Ashray Elf Warden");
        }

        if (!bot.shouldExit && !Core.checkInventory("Midnight Glaucus Sage")) {
            const seaVoice = new SeaVoiceMerge();
            // Buy prerequisites first so their merges do not consume materials reserved for the Sage.
            if (!Core.checkInventory("Midnight Glaucus Mystic")) {
                seaVoice.buyAllMerge("Glaucus Sage");
                seaVoice.buyAllMerge("Midnight Glaucus Mystic");
            }
            seaVoice.buyAllMerge("Midnight Glaucus Sage");
        }

        if (!bot.shouldExit && !Core.checkInventory("Kathool Acolyte")) {
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("deepchaos", "Kathool", "Kathool Acolyte", undefined, { isTemp: false, log: false });
        }
    }

    private acceptQuest(questID: number): boolean {
        if (bot.shouldExit) {
            return false;
        }

        Core.ensureAccept(questID);
        if (bot.shouldExit) {
            return false;
        }
        if (bot.quests.isInProgress(questID)) {
            return true;
        }

        Core.logger(`Quest ${questID} was not accepted. Check its requirements.`);
        return false;
    }
}

export default function main(): void {
    const script = new KathoolAdept();
    Core.bankingBlackList.push(...script.requiredArmors);
    Core.bankingBlackList.push("Adeptus Kathooli", "Johnnyfish", "Kultist's Morsel", "Kathool Adept");
    Core.setOptions();

    try {
        script.getClass();
    } finally {
        Core.setOptions(false);
    }
}
