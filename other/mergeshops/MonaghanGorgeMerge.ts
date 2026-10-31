/*
name: MonaghanGorge Merge
description: This bot will farm the items belonging to the selected mode for the MonaghanGorge Merge [2499] in /monaghangorge
tags: monaghangorge, merge, monaghangorge, enchanted, tricksters, apprentice, omen, trickster, morph, dark, cards, assistant, barb, barbs, trick, card, allure, grinning, stage
*/
// Port of Scripts/Other/MergeShops/MonaghanGorgeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class MonaghanGorgeMerge {
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
                case "Apocalyptic Nihil Coin":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(9929, "monaghangorge", "Trickster Duartaine");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Trickster's Apprentice":

                case "Dark Omen Trickster Morph":

                case "Dark Omen Trickster Hair":

                case "Dark Omen Trickster Visage":

                case "Dark Omen Trickster Locks":

                case "Dark Omen Cards":

                case "Dark Omen Card Familiar":

                case "Trickster's Dark Omen":

                case "Dark Omen Barb":

                case "Dark Omen Barbs":

                case "Dark Omen Trick Card":

                case "Trickster's Hidden Grin":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("monaghangorge", "Trickster Duartaine", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("monaghangorge", 2499, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "89421",
            "Enchanted Trickster's Apprentice",
            'Mode: [select] only\nShould the bot buy "Enchanted Trickster\'s Apprentice" ?',
            false,
        ),
        option.bool(
            "88740",
            "Enchanted Omen Trickster Morph",
            'Mode: [select] only\nShould the bot buy "Enchanted Omen Trickster Morph" ?',
            false,
        ),
        option.bool(
            "88741",
            "Enchanted Omen Trickster Hair",
            'Mode: [select] only\nShould the bot buy "Enchanted Omen Trickster Hair" ?',
            false,
        ),
        option.bool(
            "88742",
            "Enchanted Omen Trickster Visage",
            'Mode: [select] only\nShould the bot buy "Enchanted Omen Trickster Visage" ?',
            false,
        ),
        option.bool(
            "88743",
            "Enchanted Omen Trickster Locks",
            'Mode: [select] only\nShould the bot buy "Enchanted Omen Trickster Locks" ?',
            false,
        ),
        option.bool(
            "88744",
            "Enchanted Dark Omen Cards",
            'Mode: [select] only\nShould the bot buy "Enchanted Dark Omen Cards" ?',
            false,
        ),
        option.bool(
            "88745",
            "Dark Omen Trickster's Assistant",
            'Mode: [select] only\nShould the bot buy "Dark Omen Trickster\'s Assistant" ?',
            false,
        ),
        option.bool(
            "88748",
            "Enchanted Dark Omen Barb",
            'Mode: [select] only\nShould the bot buy "Enchanted Dark Omen Barb" ?',
            false,
        ),
        option.bool(
            "88749",
            "Enchanted Dark Omen Barbs",
            'Mode: [select] only\nShould the bot buy "Enchanted Dark Omen Barbs" ?',
            false,
        ),
        option.bool(
            "88750",
            "Enchanted Omen Trick Card",
            'Mode: [select] only\nShould the bot buy "Enchanted Omen Trick Card" ?',
            false,
        ),
        option.bool(
            "88751",
            "Enchanted Omen Trick Cards",
            'Mode: [select] only\nShould the bot buy "Enchanted Omen Trick Cards" ?',
            false,
        ),
        option.bool("89423", "Dark Omen Allure", 'Mode: [select] only\nShould the bot buy "Dark Omen Allure" ?', false),
        option.bool(
            "88747",
            "Trickster's Grinning Stage",
            'Mode: [select] only\nShould the bot buy "Trickster\'s Grinning Stage" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MonaghanGorgeMerge.select,
});

export default function main(): void {
    const script = new MonaghanGorgeMerge();
    Core.bankingBlackList.push(
        "Apocalyptic Nihil Coin",
        "Trickster's Apprentice",
        "Dark Omen Trickster Morph",
        "Dark Omen Trickster Hair",
        "Dark Omen Trickster Visage",
        "Dark Omen Trickster Locks",
        "Dark Omen Cards",
        "Dark Omen Card Familiar",
        "Trickster's Dark Omen",
        "Dark Omen Barb",
        "Dark Omen Barbs",
        "Dark Omen Trick Card",
        "Trickster's Hidden Grin",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
