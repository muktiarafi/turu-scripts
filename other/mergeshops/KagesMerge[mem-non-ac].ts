/*
name: KagesMerge[mem-non-ac]
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/KagesMerge[mem-non-ac].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Nukemichi } from "../../story/Nukemichi[mem]";

const Adv = new CoreAdvanced();
const nukemichi = new Nukemichi();

export class KagesMerge {
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
                case "Jade Box Trinket":

                case "Jade Box Jewel":

                case "Jade Box Heirloom":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(1593);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("akiba", "Shadow Nukemichi", "Jade Box");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        nukemichi.nukemichiQuests();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("akiba", 355, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("10762", "Shadow Dancer", 'Mode: [select] only\nShould the bot buy "Shadow Dancer" ?', false),
        option.bool(
            "10763",
            "Shadow Dancer's Headband",
            'Mode: [select] only\nShould the bot buy "Shadow Dancer\'s Headband" ?',
            false,
        ),
        option.bool(
            "10764",
            "Shadow Dancer's Lethal Headband",
            'Mode: [select] only\nShould the bot buy "Shadow Dancer\'s Lethal Headband" ?',
            false,
        ),
        option.bool(
            "10765",
            "Shadow Dancer Mask",
            'Mode: [select] only\nShould the bot buy "Shadow Dancer Mask" ?',
            false,
        ),
        option.bool(
            "10766",
            "Shadow Dancer Lethal Mask",
            'Mode: [select] only\nShould the bot buy "Shadow Dancer Lethal Mask" ?',
            false,
        ),
        option.bool(
            "10768",
            "Shadowed Butterfly Blades",
            'Mode: [select] only\nShould the bot buy "Shadowed Butterfly Blades" ?',
            false,
        ),
        option.bool("10767", "Sai of Shadows", 'Mode: [select] only\nShould the bot buy "Sai of Shadows" ?', false),
        option.bool("10770", "Shuriken", 'Mode: [select] only\nShould the bot buy "Shuriken" ?', false),
        option.bool(
            "10769",
            "Dual Dragonblades",
            'Mode: [select] only\nShould the bot buy "Dual Dragonblades" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: KagesMerge.select,
});

export default function main(): void {
    const script = new KagesMerge();
    Core.bankingBlackList.push("Jade Box Trinket", "Jade Box Jewel", "Jade Box Heirloom ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
