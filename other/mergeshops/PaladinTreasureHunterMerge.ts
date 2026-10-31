/*
name: PaladinTreasureHunterMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/PaladinTreasureHunterMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { SEP } from "../../good/SilverExaltedPaladin";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const sep = new SEP();

export class PaladinTreasureHunterMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                Core.logger("req is NULL");
                return;
            }

            switch (req.name) {
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(
                        `The bot hasn't been taught how to get ${req.name}.` +
                            (shouldStop ? " Please report the issue." : " Skipping"),
                        undefined,
                        { messageBox: shouldStop, stopBot: shouldStop },
                    );
                    break;
                }
                //#endregion
                case "Silver Exalted Paladin":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(7586);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("warhorc", "General Drox", "Paladin Armor Found");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Ancient Alloy":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.name);
                    Core.registerQuests(7587);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("shadowvault", "Shadowstryke", "Alloy Materials", quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Silver Exalted Winged Visor":

                case "Silver Exalted Winged Helm":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(7582);
                        Core.huntMonster("frozentower", "FrostDeep Dweller", "Paladin Helmet Wings");
                        Core.ensureComplete(7582, req.id);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Silver Exalted Visor":

                case "Silver Exalted Helmet":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(7581);
                        Core.huntMonster("ectocave", "Ichor Dracolich", "Sticky Paladin Helm");
                        Core.ensureComplete(7581, req.id);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Silver Exalted Haloed Wings":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(7583);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("thirdspell", "Great Solar Elemental", "Wings Found");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Silver Exalted Spears of Light":

                case "Silver Exalted Paladin Poleaxe":

                case "Silver Exalted Paladin Spear":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(7584);
                        Core.huntMonster("table", "Roach", "Paladin Polearm Found");
                        Core.ensureComplete(7584, req.id);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Silver Exalted Paladin Axe":

                case "Silver Exalted Paladin Blade":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(7585);
                        Core.huntMonster("dracocon", "Singer", "Paladin Weapon Found");
                        Core.ensureComplete(7585, req.id);
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        sep.silverExaltedPaladin();
        Farm.treasureHunterREP(5);
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("lightguard", 1897, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "55454",
            "Gold Exalted Paladin",
            'Mode: [select] only\nShould the bot buy "Gold Exalted Paladin" ?',
            false,
        ),
        option.bool(
            "55455",
            "Gold Exalted Winged Helm",
            'Mode: [select] only\nShould the bot buy "Gold Exalted Winged Helm" ?',
            false,
        ),
        option.bool(
            "55456",
            "Gold Exalted Winged Visor",
            'Mode: [select] only\nShould the bot buy "Gold Exalted Winged Visor" ?',
            false,
        ),
        option.bool(
            "55457",
            "Gold Exalted Helmet",
            'Mode: [select] only\nShould the bot buy "Gold Exalted Helmet" ?',
            false,
        ),
        option.bool(
            "55458",
            "Gold Exalted Visor",
            'Mode: [select] only\nShould the bot buy "Gold Exalted Visor" ?',
            false,
        ),
        option.bool(
            "55459",
            "Gold Exalted Haloed Wings",
            'Mode: [select] only\nShould the bot buy "Gold Exalted Haloed Wings" ?',
            false,
        ),
        option.bool(
            "55460",
            "Exalted Paladin's Shroud",
            'Mode: [select] only\nShould the bot buy "Exalted Paladin\'s Shroud" ?',
            false,
        ),
        option.bool(
            "55461",
            "Gold Exalted Paladin Spear",
            'Mode: [select] only\nShould the bot buy "Gold Exalted Paladin Spear" ?',
            false,
        ),
        option.bool(
            "55462",
            "Gold Exalted Paladin Blade",
            'Mode: [select] only\nShould the bot buy "Gold Exalted Paladin Blade" ?',
            false,
        ),
        option.bool(
            "55463",
            "Gold Exalted Paladin Poleaxe",
            'Mode: [select] only\nShould the bot buy "Gold Exalted Paladin Poleaxe" ?',
            false,
        ),
        option.bool(
            "55464",
            "Gold Exalted Paladin Axe",
            'Mode: [select] only\nShould the bot buy "Gold Exalted Paladin Axe" ?',
            false,
        ),
        option.bool(
            "55528",
            "Gold Exalted Spears of Light",
            'Mode: [select] only\nShould the bot buy "Gold Exalted Spears of Light" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: PaladinTreasureHunterMerge.select,
});

export default function main(): void {
    const script = new PaladinTreasureHunterMerge();
    Core.bankingBlackList.push(
        "Silver Exalted Paladin",
        "Ancient Alloy",
        "Silver Exalted Winged Helm",
        "Silver Exalted Winged Visor",
        "Silver Exalted Helmet",
        "Silver Exalted Visor",
        "Silver Exalted Haloed Wings",
        "Silver Exalted Paladin Spear",
        "Silver Exalted Paladin Blade",
        "Silver Exalted Paladin Poleaxe",
        "Silver Exalted Paladin Axe",
        "Silver Exalted Spears of Light",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
