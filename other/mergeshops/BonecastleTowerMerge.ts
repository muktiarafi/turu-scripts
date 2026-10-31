/*
name: Bonecastle Tower Merge
description: This bot will farm the items belonging to the selected mode for the Bonecastle Tower Merge [1243] in /towersilver
tags: bonecastle, tower, merge, towersilver, deathknight, lord, deathknights, silver, golden
*/
// Port of Scripts/Other/MergeShops/BonecastleTowerMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreToD } from "../../story/throneofdarkness/CoreToD";

const Adv = new CoreAdvanced();
const TOD = new CoreToD();

export class BonecastleTowerMerge {
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
                case "Bonecastle Amulet":

                case "Shadow Skull":
                    Core.farmingLogger(req.name, quant);
                    if (!Core.checkInventory("Silver DeathKnight Lord")) {
                        this.buyAllMerge("Silver DeathKnight Lord");
                    }
                    if (!Core.checkInventory("Golden DeathKnight Lord")) {
                        this.buyAllMerge("Golden DeathKnight Lord");
                    }
                    Core.registerQuests(4993);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("bonecastle", "Green Rat", "Gamey Rat Meat", 3);
                        Core.huntMonster("bonecastle", "Undead Waiter", "Waiter's Notepad");
                        Core.huntMonster("bonecastle", "Turtle", "Turtle's Eggs", 6);
                        Core.huntMonster("bonecastle", "Ghoul", 'Ghoul "Vinegar"', 6);
                        Core.huntMonster("bonecastle", "Grateful Undead", "Spices", 2);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("bonecastle", "The Butcher", "Bag of Bone Flour");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "GoldSkull Amulet":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5023);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("towergold", "Book Maggot", "Book Pages", 10);
                        Core.huntMonster("towergold", "Vampire Bat", "Batwing Leather");
                        Core.huntMonster("towergold", "Skullspider", "Skullspider Silk", 3);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "SilverSkull Amulet":
                    Core.registerQuests(5010);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("towersilver", "Bloody Scary", req.name, req.quantity, { isTemp: req.temp });
                    break;
                case "DeathKnight Lord Gauntlets":

                case "DeathKnight Lord Greaves":

                case "DeathKnight Lord Chest Plate":

                case "DeathKnight Lord Hauberk":

                case "DeathKnight Lord Boots":
                    Core.addDrop(
                        "DeathKnight Lord Gauntlets",
                        "DeathKnight Lord Greaves",
                        "DeathKnight Lord Chest Plate",
                        "DeathKnight Lord Hauberk",
                        "DeathKnight Lord Boots",
                    );
                    Core.huntMonster("bonecastle", "Vaden", req.name, undefined, { isTemp: false });
                    break;
                case "Silver DeathKnight Lord Gauntlets":

                case "Silver DeathKnight Lord Greaves":

                case "Silver DeathKnight Lord Chest Plate":

                case "Silver DeathKnight Lord Hauberk":

                case "Silver DeathKnight Lord Boots":
                    Core.addDrop(
                        "Silver DeathKnight Lord Gauntlets",
                        "Silver DeathKnight Lord Greaves",
                        "Silver DeathKnight Lord Chest Plate",
                        "Silver DeathKnight Lord Hauberk",
                        "Silver DeathKnight Lord Boots",
                        "SilverSkull Amulet",
                    );
                    Core.huntMonster("towersilver", "Flester the Silver", req.name, undefined, { isTemp: false });
                    break;
                case "Golden DeathKnight Lord Gauntlets":

                case "Golden DeathKnight Lord Greaves":

                case "Golden DeathKnight Lord Chest Plate":

                case "Golden DeathKnight Lord Hauberk":

                case "Golden DeathKnight Lord Boots":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.addDrop(
                        "Golden DeathKnight Lord Gauntlets",
                        "Golden DeathKnight Lord Greaves",
                        "Golden DeathKnight Lord Chest Plate",
                        "Golden DeathKnight Lord Hauberk",
                        "Golden DeathKnight Lord Boots",
                    );
                    Core.huntMonster("towergold", "Yurrod the Gold", req.name, undefined, { isTemp: false });
                    break;
            }
        };
        TOD.boneTowerAll();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("towersilver", 1243, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "34717",
            "DeathKnight Lord Armor",
            'Mode: [select] only\nShould the bot buy "DeathKnight Lord Armor" ?',
            false,
        ),
        option.bool(
            "34726",
            "DeathKnight's Blade",
            'Mode: [select] only\nShould the bot buy "DeathKnight\'s Blade" ?',
            false,
        ),
        option.bool("34729", "DeathKnight Helm", 'Mode: [select] only\nShould the bot buy "DeathKnight Helm" ?', false),
        option.bool(
            "34724",
            "Silver DeathKnight Lord",
            'Mode: [select] only\nShould the bot buy "Silver DeathKnight Lord" ?',
            false,
        ),
        option.bool(
            "34727",
            "Silver DeathKnight's Blade",
            'Mode: [select] only\nShould the bot buy "Silver DeathKnight\'s Blade" ?',
            false,
        ),
        option.bool(
            "34730",
            "Silver DeathKnight Helm",
            'Mode: [select] only\nShould the bot buy "Silver DeathKnight Helm" ?',
            false,
        ),
        option.bool(
            "34725",
            "Golden DeathKnight Lord",
            'Mode: [select] only\nShould the bot buy "Golden DeathKnight Lord" ?',
            false,
        ),
        option.bool(
            "34728",
            "Golden DeathKnight's Blade",
            'Mode: [select] only\nShould the bot buy "Golden DeathKnight\'s Blade" ?',
            false,
        ),
        option.bool(
            "34731",
            "Golden DeathKnight Helm",
            'Mode: [select] only\nShould the bot buy "Golden DeathKnight Helm" ?',
            false,
        ),
        option.bool(
            "34744",
            "DeathKnight Lord Cape",
            'Mode: [select] only\nShould the bot buy "DeathKnight Lord Cape" ?',
            false,
        ),
        option.bool("34780", "DeathKnight Lord", 'Mode: [select] only\nShould the bot buy "DeathKnight Lord" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BonecastleTowerMerge.select,
});

export default function main(): void {
    const script = new BonecastleTowerMerge();
    Core.bankingBlackList.push(
        "DeathKnight Lord Gauntlets",
        "DeathKnight Lord Greaves",
        "DeathKnight Lord Chest Plate",
        "DeathKnight Lord Hauberk",
        "DeathKnight Lord Boots",
        "Bonecastle Amulet",
        "Silver DeathKnight Lord Gauntlets",
        "Silver DeathKnight Lord Greaves",
        "Silver DeathKnight Lord Chest Plate",
        "Silver DeathKnight Lord Hauberk",
        "Silver DeathKnight Lord Boots",
        "SilverSkull Amulet",
        "Golden DeathKnight Lord Gauntlets",
        "Golden DeathKnight Lord Greaves",
        "Golden DeathKnight Lord Chest Plate",
        "Golden DeathKnight Lord Hauberk",
        "Golden DeathKnight Lord Boots",
        "GoldSkull Amulet",
        "Shadow Skull",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
