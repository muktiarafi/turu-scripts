/*
name: Fiendish LoreMaster Merge
description: This bot will farm the items belonging to the selected mode for the Fiendish LoreMaster Merge [2103] in /tercessuinotlim
tags: fiendish, loremaster, merge, tercessuinotlim, archfiend, warrior, armet, champion, mage, book, , rogue, backwards, knife, knives, healer, librarian, glasses, archvoid, horn
*/
// Port of Scripts/Nation/MergeShops/FiendishLoreMasterMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Tercessuinotlim } from "../../story/nation/Tercessuinotlim";

const Adv = new CoreAdvanced();
const Terc = new Tercessuinotlim();

export class FiendishLoreMasterMerge {
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
                case "Abyssal Lore Scrap":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Dodge);
                    Core.registerQuests(8475);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Room for Improvement 8475
                        Core.killMonster("Tercessuinotlim", "Boss2", "Right", "Nulgath", "Archfiend Analysis");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "ArchFiend Mage's Wand":

                case "ArchFiend Mage's Tome":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("Tercessuinotlim", "Evil Elemental", req.name, undefined, { isTemp: false });
                    break;
            }
        };
        Terc.jadziaQuests();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("tercessuinotlim", 2103, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "66936",
            "ArchFiend Warrior",
            'Mode: [select] only\nShould the bot buy "ArchFiend Warrior" ?',
            false,
        ),
        option.bool(
            "66937",
            "ArchFiend Warrior Armet",
            'Mode: [select] only\nShould the bot buy "ArchFiend Warrior Armet" ?',
            false,
        ),
        option.bool(
            "66938",
            "ArchFiend Warrior Helm",
            'Mode: [select] only\nShould the bot buy "ArchFiend Warrior Helm" ?',
            false,
        ),
        option.bool(
            "66939",
            "ArchFiend Warrior Sword",
            'Mode: [select] only\nShould the bot buy "ArchFiend Warrior Sword" ?',
            false,
        ),
        option.bool(
            "66940",
            "Dual ArchFiend Warrior Swords",
            'Mode: [select] only\nShould the bot buy "Dual ArchFiend Warrior Swords" ?',
            false,
        ),
        option.bool(
            "66941",
            "ArchFiend Warrior Champion Sword",
            'Mode: [select] only\nShould the bot buy "ArchFiend Warrior Champion Sword" ?',
            false,
        ),
        option.bool(
            "66942",
            "Dual ArchFiend Warrior Champion Swords",
            'Mode: [select] only\nShould the bot buy "Dual ArchFiend Warrior Champion Swords" ?',
            false,
        ),
        option.bool("66950", "ArchFiend Mage", 'Mode: [select] only\nShould the bot buy "ArchFiend Mage" ?', false),
        option.bool(
            "66951",
            "ArchFiend Mage Hat",
            'Mode: [select] only\nShould the bot buy "ArchFiend Mage Hat" ?',
            false,
        ),
        option.bool(
            "66952",
            "ArchFiend Mage Hood",
            'Mode: [select] only\nShould the bot buy "ArchFiend Mage Hood" ?',
            false,
        ),
        option.bool(
            "66955",
            "ArchFiend Mage Book + Wand",
            'Mode: [select] only\nShould the bot buy "ArchFiend Mage Book + Wand" ?',
            false,
        ),
        option.bool("66962", "ArchFiend Rogue", 'Mode: [select] only\nShould the bot buy "ArchFiend Rogue" ?', false),
        option.bool(
            "66963",
            "ArchFiend Rogue Hood",
            'Mode: [select] only\nShould the bot buy "ArchFiend Rogue Hood" ?',
            false,
        ),
        option.bool(
            "66964",
            "ArchFiend Rogue Mask",
            'Mode: [select] only\nShould the bot buy "ArchFiend Rogue Mask" ?',
            false,
        ),
        option.bool(
            "66965",
            "ArchFiend Rogue Mask + Hood",
            'Mode: [select] only\nShould the bot buy "ArchFiend Rogue Mask + Hood" ?',
            false,
        ),
        option.bool(
            "66966",
            "ArchFiend Rogue Backwards Knife",
            'Mode: [select] only\nShould the bot buy "ArchFiend Rogue Backwards Knife" ?',
            false,
        ),
        option.bool(
            "66967",
            "ArchFiend Rogue Backwards Knives",
            'Mode: [select] only\nShould the bot buy "ArchFiend Rogue Backwards Knives" ?',
            false,
        ),
        option.bool(
            "66968",
            "ArchFiend Rogue Knife",
            'Mode: [select] only\nShould the bot buy "ArchFiend Rogue Knife" ?',
            false,
        ),
        option.bool(
            "66969",
            "ArchFiend Rogue Knives",
            'Mode: [select] only\nShould the bot buy "ArchFiend Rogue Knives" ?',
            false,
        ),
        option.bool("66975", "ArchFiend Healer", 'Mode: [select] only\nShould the bot buy "ArchFiend Healer" ?', false),
        option.bool(
            "66976",
            "ArchFiend Healer Hood",
            'Mode: [select] only\nShould the bot buy "ArchFiend Healer Hood" ?',
            false,
        ),
        option.bool(
            "66977",
            "ArchFiend Healer Staff",
            'Mode: [select] only\nShould the bot buy "ArchFiend Healer Staff" ?',
            false,
        ),
        option.bool(
            "67085",
            "Fiendish Librarian Hair + Glasses",
            'Mode: [select] only\nShould the bot buy "Fiendish Librarian Hair + Glasses" ?',
            false,
        ),
        option.bool(
            "67086",
            "Fiendish Librarian Locks + Glasses",
            'Mode: [select] only\nShould the bot buy "Fiendish Librarian Locks + Glasses" ?',
            false,
        ),
        option.bool("66928", "ArchVoid Warrior", 'Mode: [select] only\nShould the bot buy "ArchVoid Warrior" ?', false),
        option.bool(
            "66929",
            "ArchVoid Warrior Mask",
            'Mode: [select] only\nShould the bot buy "ArchVoid Warrior Mask" ?',
            false,
        ),
        option.bool("66930", "ArchVoid Mage", 'Mode: [select] only\nShould the bot buy "ArchVoid Mage" ?', false),
        option.bool(
            "66931",
            "ArchVoid Mage Hood",
            'Mode: [select] only\nShould the bot buy "ArchVoid Mage Hood" ?',
            false,
        ),
        option.bool("66932", "ArchVoid Rogue", 'Mode: [select] only\nShould the bot buy "ArchVoid Rogue" ?', false),
        option.bool(
            "66933",
            "ArchVoid Rogue Horn",
            'Mode: [select] only\nShould the bot buy "ArchVoid Rogue Horn" ?',
            false,
        ),
        option.bool("66934", "ArchVoid Healer", 'Mode: [select] only\nShould the bot buy "ArchVoid Healer" ?', false),
        option.bool(
            "66935",
            "ArchVoid Healer Horn",
            'Mode: [select] only\nShould the bot buy "ArchVoid Healer Horn" ?',
            false,
        ),
        option.bool(
            "67082",
            "Fiendish Loremaster",
            'Mode: [select] only\nShould the bot buy "Fiendish Loremaster" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FiendishLoreMasterMerge.select,
});

export default function main(): void {
    const script = new FiendishLoreMasterMerge();
    Core.bankingBlackList.push("Abyssal Lore Scrap", "ArchFiend Mage's Wand", "ArchFiend Mage's Tome");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
