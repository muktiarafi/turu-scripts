/*
name: Nightmare Harvest War Merge
description: This will get all or selected items on this merge shop.
tags: nightmare-harvest-war-merge, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/MergeShops/NightmareHarvestWarMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreHarvestDay } from "../CoreHarvestDay";

const Adv = new CoreAdvanced();
const HarvestDay = new CoreHarvestDay();

export class NightmareHarvestWarMerge {
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
                case "Nightmare Medal":
                    HarvestDay.nightmareWar();
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7809, 7810);
                    // Murderbug Medal 7809
                    // Mega Murderbug Medal 7810
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("nightmarewar", "Zombie Cicada", "Murderbug Medal", 5);
                        Core.huntMonster("nightmarewar", "Zombie Cicada", "Mega Murderbug Medal", 3);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("nightmarewar")) {
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("nightmarewar", 1941, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "57178",
            "HollowNight Pumpkin Lord",
            'Mode: [select] only\nShould the bot buy "HollowNight Pumpkin Lord" ?',
            false,
        ),
        option.bool(
            "57179",
            "HollowNight Pumpkin Knight",
            'Mode: [select] only\nShould the bot buy "HollowNight Pumpkin Knight" ?',
            false,
        ),
        option.bool(
            "57180",
            "HollowNight Pumpkin Face",
            'Mode: [select] only\nShould the bot buy "HollowNight Pumpkin Face" ?',
            false,
        ),
        option.bool(
            "57181",
            "HollowNight Pumpkin Head",
            'Mode: [select] only\nShould the bot buy "HollowNight Pumpkin Head" ?',
            false,
        ),
        option.bool(
            "57182",
            "HollowNight Pumpkin Hood",
            'Mode: [select] only\nShould the bot buy "HollowNight Pumpkin Hood" ?',
            false,
        ),
        option.bool(
            "57183",
            "HollowNight Pumpkin Vines",
            'Mode: [select] only\nShould the bot buy "HollowNight Pumpkin Vines" ?',
            false,
        ),
        option.bool(
            "57184",
            "HollowNight Pumpkin Wings",
            'Mode: [select] only\nShould the bot buy "HollowNight Pumpkin Wings" ?',
            false,
        ),
        option.bool(
            "57185",
            "HollowNight Pumpkin Greatsword",
            'Mode: [select] only\nShould the bot buy "HollowNight Pumpkin Greatsword" ?',
            false,
        ),
        option.bool(
            "57186",
            "HollowNight Pumpkin Blade",
            'Mode: [select] only\nShould the bot buy "HollowNight Pumpkin Blade" ?',
            false,
        ),
        option.bool(
            "57188",
            "HollowNight Pumpkin Pet",
            'Mode: [select] only\nShould the bot buy "HollowNight Pumpkin Pet" ?',
            false,
        ),
        option.bool(
            "57189",
            "Otherworldly HollowNight Pumpkin Pet",
            'Mode: [select] only\nShould the bot buy "Otherworldly HollowNight Pumpkin Pet" ?',
            false,
        ),
        option.bool(
            "57705",
            "Enchanted Forest Rogue",
            'Mode: [select] only\nShould the bot buy "Enchanted Forest Rogue" ?',
            false,
        ),
        option.bool(
            "57706",
            "Enchanted Forest Rogue's Hat",
            'Mode: [select] only\nShould the bot buy "Enchanted Forest Rogue\'s Hat" ?',
            false,
        ),
        option.bool(
            "57707",
            "Enchanted Rogue's Hat + Ponytail",
            'Mode: [select] only\nShould the bot buy "Enchanted Rogue\'s Hat + Ponytail" ?',
            false,
        ),
        option.bool(
            "57708",
            "Enchanted Rogue's Grimace",
            'Mode: [select] only\nShould the bot buy "Enchanted Rogue\'s Grimace" ?',
            false,
        ),
        option.bool(
            "57709",
            "Enchanted Rogue's Grimace + Ponytail",
            'Mode: [select] only\nShould the bot buy "Enchanted Rogue\'s Grimace + Ponytail" ?',
            false,
        ),
        option.bool(
            "57710",
            "Enchanted Rogue's Back Quiver",
            'Mode: [select] only\nShould the bot buy "Enchanted Rogue\'s Back Quiver" ?',
            false,
        ),
        option.bool(
            "57711",
            "Enchanted Rogue's Hip Quiver",
            'Mode: [select] only\nShould the bot buy "Enchanted Rogue\'s Hip Quiver" ?',
            false,
        ),
        option.bool(
            "57712",
            "Enchanted Forest Rogue Bow",
            'Mode: [select] only\nShould the bot buy "Enchanted Forest Rogue Bow" ?',
            false,
        ),
        option.bool(
            "57856",
            "HollowNight Pumpkin Hood Morph",
            'Mode: [select] only\nShould the bot buy "HollowNight Pumpkin Hood Morph" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NightmareHarvestWarMerge.select,
});

export default function main(): void {
    const script = new NightmareHarvestWarMerge();
    Core.bankingBlackList.push("Nightmare Medal ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
