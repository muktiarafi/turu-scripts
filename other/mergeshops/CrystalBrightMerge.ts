/*
name: CrystalBrightMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/CrystalBrightMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CrystalBrightMerge {
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
                case "Carnival Ticket":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("dreamforest", "r3", "Left", "*", "Carnival Ticket", 300);
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("dreamforest", 1240, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("34535", "Carnival Worker", 'Mode: [select] only\nShould the bot buy "Carnival Worker" ?', false),
        option.bool(
            "34536",
            "Carnival Worker Hat",
            'Mode: [select] only\nShould the bot buy "Carnival Worker Hat" ?',
            false,
        ),
        option.bool(
            "34537",
            "Carnival Worker Locks",
            'Mode: [select] only\nShould the bot buy "Carnival Worker Locks" ?',
            false,
        ),
        option.bool(
            "34568",
            "Miranda and William Outfits",
            'Mode: [select] only\nShould the bot buy "Miranda and William Outfits" ?',
            false,
        ),
        option.bool("34569", "Miranda's Hair", 'Mode: [select] only\nShould the bot buy "Miranda\'s Hair" ?', false),
        option.bool("34570", "William's Hair", 'Mode: [select] only\nShould the bot buy "William\'s Hair" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CrystalBrightMerge.select,
});

export default function main(): void {
    const script = new CrystalBrightMerge();
    Core.bankingBlackList.push("Carnival Ticket");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
