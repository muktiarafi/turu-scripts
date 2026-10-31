/*
name: Beleen's Party Presents Merge
description: This will get all or selected items on this merge shop.
tags: beleens-party-presents-merge, seasonal, aqw-anniverasary
*/
// Port of Scripts/Seasonal/AqwBirthday/BeleensPartyPresentsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class BeleensPartyPresentsMerge {
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
                case "Starry Bow":
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("spacepwny", "r3", "Right", "*", req.name, quant, { isTemp: false });
                    break;
                case "DOOM Gift":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("spacepwny", "Mr DED", req.name, quant, { isTemp: false });
                    break;
                case "Scarbucks Gift Card":
                    Core.equipClass(ClassType.Solo);
                    bot.quests.updateQuest(8892);
                    Core.killMonster("mermaidsushi", "r7a", "Left", "*", req.name, quant, { isTemp: false });
                    break;
                case "Golden Anniversary Gift":

                case "Platinum Leaf":

                case "Ultimate Dragonlord Cape":

                case "Ultimate Dragonlord Wings":
                    Core.equipClass(ClassType.Solo);
                    if (req.name === "Platinum Leaf") {
                        Core.registerQuests(8925);
                    }
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("yulgarparty", "Treasure Pile", "Twilly's Treasure Defeated");
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("yulgar20")) {
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("yulgar20", 2177, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "73072",
            "Gold Pony Star Warrior",
            'Mode: [select] only\nShould the bot buy "Gold Pony Star Warrior" ?',
            false,
        ),
        option.bool(
            "73073",
            "Gold Pony's Candied Helm",
            'Mode: [select] only\nShould the bot buy "Gold Pony\'s Candied Helm" ?',
            false,
        ),
        option.bool(
            "73074",
            "Gold Pony's Cloudy Helm",
            'Mode: [select] only\nShould the bot buy "Gold Pony\'s Cloudy Helm" ?',
            false,
        ),
        option.bool(
            "73075",
            "Rainbow Pony Morph",
            'Mode: [select] only\nShould the bot buy "Rainbow Pony Morph" ?',
            false,
        ),
        option.bool("73076", "Gold Pony Cloak", 'Mode: [select] only\nShould the bot buy "Gold Pony Cloak" ?', false),
        option.bool(
            "73077",
            "Rainbow Pony Wings",
            'Mode: [select] only\nShould the bot buy "Rainbow Pony Wings" ?',
            false,
        ),
        option.bool(
            "73078",
            "Rainbow Pony Tail",
            'Mode: [select] only\nShould the bot buy "Rainbow Pony Tail" ?',
            false,
        ),
        option.bool(
            "73079",
            "Gold Pony Star Lance",
            'Mode: [select] only\nShould the bot buy "Gold Pony Star Lance" ?',
            false,
        ),
        option.bool(
            "73080",
            "Rainbow Pony Plushie",
            'Mode: [select] only\nShould the bot buy "Rainbow Pony Plushie" ?',
            false,
        ),
        option.bool(
            "73081",
            "Pink Pony Star Warrior",
            'Mode: [select] only\nShould the bot buy "Pink Pony Star Warrior" ?',
            false,
        ),
        option.bool(
            "73082",
            "Pink Pony's Maned Helm",
            'Mode: [select] only\nShould the bot buy "Pink Pony\'s Maned Helm" ?',
            false,
        ),
        option.bool(
            "73083",
            "Pink Pony's Cotton Helm",
            'Mode: [select] only\nShould the bot buy "Pink Pony\'s Cotton Helm" ?',
            false,
        ),
        option.bool("73084", "Pink Pony Morph", 'Mode: [select] only\nShould the bot buy "Pink Pony Morph" ?', false),
        option.bool("73085", "Pink Pony Cloak", 'Mode: [select] only\nShould the bot buy "Pink Pony Cloak" ?', false),
        option.bool("73086", "Pink Pony Wings", 'Mode: [select] only\nShould the bot buy "Pink Pony Wings" ?', false),
        option.bool("73087", "Pink Pony Tail", 'Mode: [select] only\nShould the bot buy "Pink Pony Tail" ?', false),
        option.bool(
            "73088",
            "Pink Pony Star Lance",
            'Mode: [select] only\nShould the bot buy "Pink Pony Star Lance" ?',
            false,
        ),
        option.bool(
            "73089",
            "Pink Pony Plushie",
            'Mode: [select] only\nShould the bot buy "Pink Pony Plushie" ?',
            false,
        ),
        option.bool("72279", "Bean Twilly", 'Mode: [select] only\nShould the bot buy "Bean Twilly" ?', false),
        option.bool(
            "73285",
            "Enchanted Necromancer Cape",
            'Mode: [select] only\nShould the bot buy "Enchanted Necromancer Cape" ?',
            false,
        ),
        option.bool(
            "73284",
            "Enchanted Highborn Coronet",
            'Mode: [select] only\nShould the bot buy "Enchanted Highborn Coronet" ?',
            false,
        ),
        option.bool(
            "73283",
            "Enchanted Necromancer Circlet",
            'Mode: [select] only\nShould the bot buy "Enchanted Necromancer Circlet" ?',
            false,
        ),
        option.bool(
            "73282",
            "Enchanted Highborn Necromancer",
            'Mode: [select] only\nShould the bot buy "Enchanted Highborn Necromancer" ?',
            false,
        ),
        option.bool(
            "57464",
            "Phoenix Reign Bringer",
            'Mode: [select] only\nShould the bot buy "Phoenix Reign Bringer" ?',
            false,
        ),
        option.bool(
            "57462",
            "Phoenix Reign Wings",
            'Mode: [select] only\nShould the bot buy "Phoenix Reign Wings" ?',
            false,
        ),
        option.bool(
            "57460",
            "Phoenix Reign Galea",
            'Mode: [select] only\nShould the bot buy "Phoenix Reign Galea" ?',
            false,
        ),
        option.bool(
            "57459",
            "Phoenix Reign Helm",
            'Mode: [select] only\nShould the bot buy "Phoenix Reign Helm" ?',
            false,
        ),
        option.bool(
            "57458",
            "Phoenix Reign Plate",
            'Mode: [select] only\nShould the bot buy "Phoenix Reign Plate" ?',
            false,
        ),
        option.bool(
            "57472",
            "Ultimate Dragonlord Greatsword",
            'Mode: [select] only\nShould the bot buy "Ultimate Dragonlord Greatsword" ?',
            false,
        ),
        option.bool(
            "57478",
            "Newbatron Prime Cannons",
            'Mode: [select] only\nShould the bot buy "Newbatron Prime Cannons" ?',
            false,
        ),
        option.bool(
            "57477",
            "Newbatron Prime Boosters",
            'Mode: [select] only\nShould the bot buy "Newbatron Prime Boosters" ?',
            false,
        ),
        option.bool(
            "57476",
            "Newbatron Prime Helm",
            'Mode: [select] only\nShould the bot buy "Newbatron Prime Helm" ?',
            false,
        ),
        option.bool(
            "57475",
            "Newbatron Prime Guard",
            'Mode: [select] only\nShould the bot buy "Newbatron Prime Guard" ?',
            false,
        ),
        option.bool("57474", "Newbatron Prime", 'Mode: [select] only\nShould the bot buy "Newbatron Prime" ?', false),
        option.bool(
            "57470",
            "Ultimate Dragonlord Winged Cape",
            'Mode: [select] only\nShould the bot buy "Ultimate Dragonlord Winged Cape" ?',
            false,
        ),
        option.bool(
            "57467",
            "Ultimate Dragonlord Helm",
            'Mode: [select] only\nShould the bot buy "Ultimate Dragonlord Helm" ?',
            false,
        ),
        option.bool(
            "57465",
            "Ultimate DragonLord",
            'Mode: [select] only\nShould the bot buy "Ultimate DragonLord" ?',
            false,
        ),
        option.bool(
            "73286",
            "Enchanted Necromancer Cane",
            'Mode: [select] only\nShould the bot buy "Enchanted Necromancer Cane" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BeleensPartyPresentsMerge.select,
});

export default function main(): void {
    const script = new BeleensPartyPresentsMerge();
    Core.bankingBlackList.push("Starry Bow", "DOOM Gift", "Scarbucks Gift Card ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
