/*
name: ManaHarvest Merge
description: This bot will farm the items belonging to the selected mode for the ManaHarvest Merge [2503] in /manaharvest
tags: manaharvest, merge, manaharvest, shadowslayer, leathers, leather, cap, ritual, headstone, shadowslayerss, quiver, immortal, shadow, breaker, breakers, shadowslayers, heirloom, rifle, bow
*/
// Port of Scripts/Seasonal/HarvestDay/MergeShops/ManaHarvestMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreHarvestDay } from "../CoreHarvestDay";

const Adv = new CoreAdvanced();
const CHD = new CoreHarvestDay();

export class ManaHarvestMerge {
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
                case "Emergency Rations":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(
                            9975,
                            ["manaharvest", CHD.umManaHarvest[1], ClassType.Farm],
                            ["manaharvest", CHD.umManaHarvest[7], ClassType.Solo],
                            ["manaharvest", CHD.umManaHarvest[4], ClassType.Farm],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Glossly Chestnut Waves":

                case "Glossy Chestnut Locks":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("manaharvest", CHD.umManaHarvest[7], req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
            }
        };
        CHD.manaHarvest();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("manaharvest", 2503, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "88554",
            "ShadowSlayer Leathers",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Leathers" ?',
            false,
        ),
        option.bool(
            "88557",
            "ShadowSlayer Leather Hat",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Leather Hat" ?',
            false,
        ),
        option.bool(
            "88558",
            "ShadowSlayer Leather Cap",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Leather Cap" ?',
            false,
        ),
        option.bool("88559", "Ritual Headstone", 'Mode: [select] only\nShould the bot buy "Ritual Headstone" ?', false),
        option.bool(
            "88560",
            "ShadowSlayers's Leather Quiver",
            'Mode: [select] only\nShould the bot buy "ShadowSlayers\'s Leather Quiver" ?',
            false,
        ),
        option.bool(
            "88561",
            "Immortal Shadow Breaker",
            'Mode: [select] only\nShould the bot buy "Immortal Shadow Breaker" ?',
            false,
        ),
        option.bool(
            "88562",
            "Immortal Shadow Breakers",
            'Mode: [select] only\nShould the bot buy "Immortal Shadow Breakers" ?',
            false,
        ),
        option.bool(
            "88563",
            "ShadowSlayer's Heirloom Rifle",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer\'s Heirloom Rifle" ?',
            false,
        ),
        option.bool(
            "88564",
            "ShadowSlayer's Heirloom Bow",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer\'s Heirloom Bow" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ManaHarvestMerge.select,
});

export default function main(): void {
    const script = new ManaHarvestMerge();
    Core.bankingBlackList.push("Emergency Rations", "Glossly Chestnut Waves", "Glossy Chestnut Locks");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
