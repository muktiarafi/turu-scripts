/*
name: GooseMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/GooseMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class GooseMerge {
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
                case "Cysero's Cookie":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("goose", "Queen's Sage", "Cysero's Cookie", quant, { isTemp: false, log: false });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("goose", 58, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("30448", "Queen's Sage", 'Mode: [select] only\nShould the bot buy "Queen\'s Sage" ?', false),
        option.bool(
            "30449",
            "Queen's Sage Hood",
            'Mode: [select] only\nShould the bot buy "Queen\'s Sage Hood" ?',
            false,
        ),
        option.bool(
            "30450",
            "Queen's Sage Cape",
            'Mode: [select] only\nShould the bot buy "Queen\'s Sage Cape" ?',
            false,
        ),
        option.bool(
            "30451",
            "Queen's Sage Scythe",
            'Mode: [select] only\nShould the bot buy "Queen\'s Sage Scythe" ?',
            false,
        ),
        option.bool(
            "30422",
            "GIANT Mountain of Socks",
            'Mode: [select] only\nShould the bot buy "GIANT Mountain of Socks" ?',
            false,
        ),
        option.bool(
            "30421",
            "Cyser-Duck Painting",
            'Mode: [select] only\nShould the bot buy "Cyser-Duck Painting" ?',
            false,
        ),
        option.bool(
            "30404",
            "Bucket of Paint Helm",
            'Mode: [select] only\nShould the bot buy "Bucket of Paint Helm" ?',
            false,
        ),
        option.bool("30418", "Sock Ape", 'Mode: [select] only\nShould the bot buy "Sock Ape" ?', false),
        option.bool("30419", "Chris P. Bacon", 'Mode: [select] only\nShould the bot buy "Chris P. Bacon" ?', false),
        option.bool(
            "30420",
            "Grandhonk Goose the Gray",
            'Mode: [select] only\nShould the bot buy "Grandhonk Goose the Gray" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GooseMerge.select,
});

export default function main(): void {
    const script = new GooseMerge();
    Core.bankingBlackList.push("Cysero's Cookie ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
