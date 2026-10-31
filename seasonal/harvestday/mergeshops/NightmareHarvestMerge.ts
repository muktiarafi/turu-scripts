/*
name: Nightmare Harvest Merge
description: This will get all or selected items on this merge shop.
tags: nightmare-harvest-merge, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/MergeShops/NightmareHarvestMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class NightmareHarvestMerge {
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
                case "Earplug":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7808);
                    // Quiet Down, Will Ya? 7808
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("memetnightmare", "Fire Cyclone", "Cyclones Subdued", 8);
                        Core.huntMonster("memetnightmare", "Burning Ember", "Embers Smothered", 8);
                        Core.huntMonster("memetnightmare", "Cannibal Mermaid", "Mermaids Dispersed", 8);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("gothicdream")) {
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("gothicdream", 1939, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("57588", "Teen Slasher", 'Mode: [select] only\nShould the bot buy "Teen Slasher" ?', false),
        option.bool(
            "57589",
            "Teen Slasher's Hair",
            'Mode: [select] only\nShould the bot buy "Teen Slasher\'s Hair" ?',
            false,
        ),
        option.bool(
            "57590",
            "Teen Slasher's Side Mask",
            'Mode: [select] only\nShould the bot buy "Teen Slasher\'s Side Mask" ?',
            false,
        ),
        option.bool(
            "57591",
            "Teen Slasher's Mask",
            'Mode: [select] only\nShould the bot buy "Teen Slasher\'s Mask" ?',
            false,
        ),
        option.bool(
            "57592",
            "Teen Slasher's Locks",
            'Mode: [select] only\nShould the bot buy "Teen Slasher\'s Locks" ?',
            false,
        ),
        option.bool(
            "57593",
            "Teen Slasher's Side Mask + Locks",
            'Mode: [select] only\nShould the bot buy "Teen Slasher\'s Side Mask + Locks" ?',
            false,
        ),
        option.bool(
            "57594",
            "Teen Slasher's Mask + Locks",
            'Mode: [select] only\nShould the bot buy "Teen Slasher\'s Mask + Locks" ?',
            false,
        ),
        option.bool(
            "57595",
            "Teen Slasher's Knife",
            'Mode: [select] only\nShould the bot buy "Teen Slasher\'s Knife" ?',
            false,
        ),
        option.bool(
            "57640",
            "Dual Slasher's Knives",
            'Mode: [select] only\nShould the bot buy "Dual Slasher\'s Knives" ?',
            false,
        ),
        option.bool("57596", "Unlucky Hoodie", 'Mode: [select] only\nShould the bot buy "Unlucky Hoodie" ?', false),
        option.bool(
            "57597",
            "Unlucky Hoodie Hair",
            'Mode: [select] only\nShould the bot buy "Unlucky Hoodie Hair" ?',
            false,
        ),
        option.bool(
            "57598",
            "Unlucky Hoodie Locks",
            'Mode: [select] only\nShould the bot buy "Unlucky Hoodie Locks" ?',
            false,
        ),
        option.bool("57651", "Doomba", 'Mode: [select] only\nShould the bot buy "Doomba" ?', false),
        option.bool("57652", "Terrifier", 'Mode: [select] only\nShould the bot buy "Terrifier" ?', false),
        option.bool(
            "57653",
            "Terrifier's Tiny Hat",
            'Mode: [select] only\nShould the bot buy "Terrifier\'s Tiny Hat" ?',
            false,
        ),
        option.bool(
            "57654",
            "Terrifier's Tiny Hat (Female)",
            'Mode: [select] only\nShould the bot buy "Terrifier\'s Tiny Hat (Female)" ?',
            false,
        ),
        option.bool(
            "57655",
            "Terrifier's Morph",
            'Mode: [select] only\nShould the bot buy "Terrifier\'s Morph" ?',
            false,
        ),
        option.bool(
            "57553",
            "Spooky Skelly Suit",
            'Mode: [select] only\nShould the bot buy "Spooky Skelly Suit" ?',
            false,
        ),
        option.bool(
            "57554",
            "Spooky Skull Morph + Locks",
            'Mode: [select] only\nShould the bot buy "Spooky Skull Morph + Locks" ?',
            false,
        ),
        option.bool(
            "57555",
            "Spooky Skull Morph",
            'Mode: [select] only\nShould the bot buy "Spooky Skull Morph" ?',
            false,
        ),
        option.bool(
            "57556",
            "Spooky Batty Wings",
            'Mode: [select] only\nShould the bot buy "Spooky Batty Wings" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NightmareHarvestMerge.select,
});

export default function main(): void {
    const script = new NightmareHarvestMerge();
    Core.bankingBlackList.push("Earplug ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
