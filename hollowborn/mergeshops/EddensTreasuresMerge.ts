/*
name: Eddens Treasures Merge
description: This bot will farm the items belonging to the selected mode for the Eddens Treasures Merge [2455] in /greed
tags: eddens, treasures, merge, greed, hollowborn, bodyguard, fists, claws, battle, companion, treasure, hunter, bag, necklace, necklaces, krenos, spirit, katanas
*/
// Port of Scripts/Hollowborn/MergeShops/EddensTreasuresMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreHollowbornStory } from "../../story/hollowborn/CoreHollowbornStory";

const Adv = new CoreAdvanced();
const HBStory = new CoreHollowbornStory();

export class EddensTreasuresMerge {
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
                case "Cursed Ring":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9794);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("greed", "Cursed Treasure", "Ring Found", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Frozen Diamond":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9795);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("greed", "Ice Crystal", "Frozen Diamond Found", 5, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Krenos Spirit Katana":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9804);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("shimazu", "Shimazu", "First Rune", undefined, { log: false });
                        Core.getMapItem(13328, undefined, "evilmarsh");
                        Core.huntMonster("seraphicwarlaken", "Rayce", "Third Rune", undefined, { log: false });
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("pyrewatch", "Firestorm Major", "Fourth Rune", undefined, { log: false });
                        Core.getMapItem(13329, undefined, "icewindpass");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Energy Dragon Scale":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("thunderfang", "Tonitru", req.name, quant, { isTemp: req.temp, log: false });
                    break;
            }
        };
        HBStory.shadowrealm();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("greed", 2455, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "86701",
            "Hollowborn Bodyguard",
            'Mode: [select] only\nShould the bot buy "Hollowborn Bodyguard" ?',
            false,
        ),
        option.bool(
            "86702",
            "Hollowborn Bodyguard Helm",
            'Mode: [select] only\nShould the bot buy "Hollowborn Bodyguard Helm" ?',
            false,
        ),
        option.bool(
            "86705",
            "Hollowborn Bodyguard Fists",
            'Mode: [select] only\nShould the bot buy "Hollowborn Bodyguard Fists" ?',
            false,
        ),
        option.bool(
            "86706",
            "Hollowborn Bodyguard Claws",
            'Mode: [select] only\nShould the bot buy "Hollowborn Bodyguard Claws" ?',
            false,
        ),
        option.bool(
            "86704",
            "Hollowborn Battle Bodyguard",
            'Mode: [select] only\nShould the bot buy "Hollowborn Battle Bodyguard" ?',
            false,
        ),
        option.bool(
            "86703",
            "Hollowborn Bodyguard Companion",
            'Mode: [select] only\nShould the bot buy "Hollowborn Bodyguard Companion" ?',
            false,
        ),
        option.bool(
            "86735",
            "Hollowborn Treasure Hunter",
            'Mode: [select] only\nShould the bot buy "Hollowborn Treasure Hunter" ?',
            false,
        ),
        option.bool(
            "86736",
            "Hollowborn Treasure Hunter Hat",
            'Mode: [select] only\nShould the bot buy "Hollowborn Treasure Hunter Hat" ?',
            false,
        ),
        option.bool(
            "86737",
            "Hollowborn Treasure Hunter Bag",
            'Mode: [select] only\nShould the bot buy "Hollowborn Treasure Hunter Bag" ?',
            false,
        ),
        option.bool(
            "86738",
            "Hollowborn Treasure Hunter Necklace",
            'Mode: [select] only\nShould the bot buy "Hollowborn Treasure Hunter Necklace" ?',
            false,
        ),
        option.bool(
            "86739",
            "Hollowborn Treasure Hunter Necklaces",
            'Mode: [select] only\nShould the bot buy "Hollowborn Treasure Hunter Necklaces" ?',
            false,
        ),
        option.bool(
            "67461",
            "Krenos Spirit Katanas",
            'Mode: [select] only\nShould the bot buy "Krenos Spirit Katanas" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: EddensTreasuresMerge.select,
});

export default function main(): void {
    const script = new EddensTreasuresMerge();
    Core.bankingBlackList.push("Cursed Ring", "Frozen Diamond", "Krenos Spirit Katana", "Energy Dragon Scale");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
