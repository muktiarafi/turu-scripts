/*
name: Bonecastle Merge
description: This bot will farm the items belonging to the selected mode for the Bonecastle Merge [1242] in /bonecastle
tags: bonecastle, merge, bonecastle, piercer, plate, face, accoutrements, tomb, tombstone, vadens, enchanted, deathknight, deathknights, royal, deathbringer, cloak, sabre, pile, bone, skulls, silver, golden, castle, house, lord
*/
// Port of Scripts/Other/MergeShops/BonecastleMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class BonecastleMerge {
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
                //#region Known items
                case "Bonecastle Token":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("bonecastlec", "Undead Golden Knight", req.name, quant, { isTemp: false });
                    break;
                case "Vaden Helm Token":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("bonecastlec", "Vaden", req.name, quant, { isTemp: false });
                    break;
                case "Shadow Skull":
                    if (!Core.checkInventory("Silver DeathKnight Lord")) {
                        this.buyAllMerge("Silver DeathKnight Lord");
                    }
                    if (!Core.checkInventory("Golden DeathKnight Lord")) {
                        this.buyAllMerge("Golden DeathKnight Lord");
                    }
                    Core.registerQuests(4993);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, req.quantity)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("bonecastle", "Green Rat", "Gamey Rat Meat", 3);
                        Core.huntMonster("bonecastle", "Undead Waiter", "Waiter's Notepad", 1);
                        Core.huntMonster("bonecastle", "Turtle", "Turtle's Eggs", 6);
                        Core.huntMonster("bonecastle", "Ghoul", 'Ghoul "Vinegar"', 6);
                        Core.huntMonster("bonecastle", "Grateful Undead", "Spices", 2);

                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("bonecastle", "The Butcher", "Bag of Bone Flour", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "DeathKnight Lord Armor": {
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    const RequiredItems = [
                        "DeathKnight Lord Gauntlets",
                        "DeathKnight Lord Greaves",
                        "DeathKnight Lord Chest Plate",
                        "DeathKnight Lord Hauberk",
                        "DeathKnight Lord Boots",
                    ];
                    for (const item of RequiredItems) {
                        Core.huntMonster("bonecastle", "Vaden", item, undefined, { isTemp: false });
                    }
                    if (!Core.checkInventory("Silver DeathKnight Lord")) {
                        Core.buyItem("towersilver", 1243, "Silver DeathKnight Lord");
                    }
                    if (!Core.checkInventory("Golden DeathKnight Lord")) {
                        Core.buyItem("towergold", 1243, "Golden DeathKnight Lord");
                    }
                    // BoneCastle Amulet
                    Core.registerQuests(4993);
                    while (!bot.shouldExit && !Core.checkInventory("Bonecastle Amulet", 30)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("bonecastle", "Green Rat", "Gamey Rat Meat", 3);
                        Core.huntMonster("bonecastle", "Undead Waiter", "Waiter's Notepad", 1);
                        Core.huntMonster("bonecastle", "Turtle", "Turtle's Eggs", 6);
                        Core.huntMonster("bonecastle", "Ghoul", 'Ghoul "Vinegar"', 6);
                        Core.huntMonster("bonecastle", "Grateful Undead", "Spices", 2);

                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("bonecastle", "The Butcher", "Bag of Bone Flour", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    if (
                        RequiredItems.every((x) => Core.checkInventory(x)) &&
                        Core.checkInventory("Bonecastle Amulet", 30)
                    ) {
                        Core.buyItem("bonecastle", 1242, req.name);
                    }
                    bot.wait.forItemBuy(req.id);
                    break;
                }
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("bonecastle", 1242, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "34577",
            "The Piercer Plate",
            'Mode: [select] only\nShould the bot buy "The Piercer Plate" ?',
            false,
        ),
        option.bool(
            "34578",
            "Face Of The Piercer",
            'Mode: [select] only\nShould the bot buy "Face Of The Piercer" ?',
            false,
        ),
        option.bool(
            "34579",
            "Hood Of The Piercer",
            'Mode: [select] only\nShould the bot buy "Hood Of The Piercer" ?',
            false,
        ),
        option.bool(
            "34580",
            "The Piercer Accoutrements",
            'Mode: [select] only\nShould the bot buy "The Piercer Accoutrements" ?',
            false,
        ),
        option.bool(
            "34581",
            "Axe Of The Piercer",
            'Mode: [select] only\nShould the bot buy "Axe Of The Piercer" ?',
            false,
        ),
        option.bool(
            "34582",
            "Tomb of The Piercer",
            'Mode: [select] only\nShould the bot buy "Tomb of The Piercer" ?',
            false,
        ),
        option.bool(
            "34583",
            "The Piercer Tombstone",
            'Mode: [select] only\nShould the bot buy "The Piercer Tombstone" ?',
            false,
        ),
        option.bool("34655", "Vaden's Helm", 'Mode: [select] only\nShould the bot buy "Vaden\'s Helm" ?', false),
        option.bool(
            "34571",
            "Enchanted DeathKnight",
            'Mode: [select] only\nShould the bot buy "Enchanted DeathKnight" ?',
            false,
        ),
        option.bool(
            "34572",
            "Enchanted DeathKnight Plate",
            'Mode: [select] only\nShould the bot buy "Enchanted DeathKnight Plate" ?',
            false,
        ),
        option.bool(
            "34573",
            "Enchanted DeathKnight Cape",
            'Mode: [select] only\nShould the bot buy "Enchanted DeathKnight Cape" ?',
            false,
        ),
        option.bool(
            "34574",
            "Enchanted DeathKnight Axe",
            'Mode: [select] only\nShould the bot buy "Enchanted DeathKnight Axe" ?',
            false,
        ),
        option.bool(
            "34718",
            "DeathKnight's Hood",
            'Mode: [select] only\nShould the bot buy "DeathKnight\'s Hood" ?',
            false,
        ),
        option.bool(
            "34740",
            "Royal Deathbringer",
            'Mode: [select] only\nShould the bot buy "Royal Deathbringer" ?',
            false,
        ),
        option.bool(
            "34741",
            "Royal Deathbringer Cloak",
            'Mode: [select] only\nShould the bot buy "Royal Deathbringer Cloak" ?',
            false,
        ),
        option.bool(
            "34742",
            "Royal Deathbringer Helm",
            'Mode: [select] only\nShould the bot buy "Royal Deathbringer Helm" ?',
            false,
        ),
        option.bool(
            "34743",
            "Royal Deathbringer Sabre",
            'Mode: [select] only\nShould the bot buy "Royal Deathbringer Sabre" ?',
            false,
        ),
        option.bool(
            "34666",
            "Pile of Bone Skulls",
            'Mode: [select] only\nShould the bot buy "Pile of Bone Skulls" ?',
            false,
        ),
        option.bool(
            "34665",
            "Pile of Silver Skulls",
            'Mode: [select] only\nShould the bot buy "Pile of Silver Skulls" ?',
            false,
        ),
        option.bool(
            "34664",
            "Pile of Golden Skulls",
            'Mode: [select] only\nShould the bot buy "Pile of Golden Skulls" ?',
            false,
        ),
        option.bool(
            "34723",
            "Bone Castle House",
            'Mode: [select] only\nShould the bot buy "Bone Castle House" ?',
            false,
        ),
        option.bool("34780", "DeathKnight Lord", 'Mode: [select] only\nShould the bot buy "DeathKnight Lord" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BonecastleMerge.select,
});

export default function main(): void {
    const script = new BonecastleMerge();
    Core.bankingBlackList.push("Bonecastle Token", "Vaden Helm Token", "Shadow Skull", "DeathKnight Lord Armor");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
