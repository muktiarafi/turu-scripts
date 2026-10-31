/*
name: ArtixWeddingMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/ArtixWeddingMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ArtixWeddingMerge {
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
                case "Love Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("battlewedding", "Platinum Mech Dragon", req.name, req.quantity, {
                        isTemp: req.temp,
                    });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("battlewedding", 788, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "21402",
            "Artix's Wedding Party",
            'Mode: [select] only\nShould the bot buy "Artix\'s Wedding Party" ?',
            false,
        ),
        option.bool("21411", "Bellhop Minion", 'Mode: [select] only\nShould the bot buy "Bellhop Minion" ?', false),
        option.bool("21499", "Ebil Ninja", 'Mode: [select] only\nShould the bot buy "Ebil Ninja" ?', false),
        option.bool(
            "21487",
            "Legendary Wedding Usher",
            'Mode: [select] only\nShould the bot buy "Legendary Wedding Usher" ?',
            false,
        ),
        option.bool(
            "21474",
            "Red Wedding Guest",
            'Mode: [select] only\nShould the bot buy "Red Wedding Guest" ?',
            false,
        ),
        option.bool(
            "21472",
            "Silver Wedding Guest",
            'Mode: [select] only\nShould the bot buy "Silver Wedding Guest" ?',
            false,
        ),
        option.bool("21512", "Ebil Ninja Hood", 'Mode: [select] only\nShould the bot buy "Ebil Ninja Hood" ?', false),
        option.bool(
            "21492",
            "Wedding Usher Helm",
            'Mode: [select] only\nShould the bot buy "Wedding Usher Helm" ?',
            false,
        ),
        option.bool(
            "21484",
            "Red Bouquet-on-Your-Back",
            'Mode: [select] only\nShould the bot buy "Red Bouquet-on-Your-Back" ?',
            false,
        ),
        option.bool(
            "21483",
            "Silver Bouquet-on-Your-Back",
            'Mode: [select] only\nShould the bot buy "Silver Bouquet-on-Your-Back" ?',
            false,
        ),
        option.bool(
            "21624",
            "Crimson ZARDIS Key",
            'Mode: [select] only\nShould the bot buy "Crimson ZARDIS Key" ?',
            false,
        ),
        option.bool("21598", "ZARDIS Key", 'Mode: [select] only\nShould the bot buy "ZARDIS Key" ?', false),
        option.bool("21488", "Bullhorn Of Love", 'Mode: [select] only\nShould the bot buy "Bullhorn Of Love" ?', false),
        option.bool("21480", "Red Bouquet", 'Mode: [select] only\nShould the bot buy "Red Bouquet" ?', false),
        option.bool("21479", "Silver Bouquet", 'Mode: [select] only\nShould the bot buy "Silver Bouquet" ?', false),
        option.bool("21476", "Red Rose", 'Mode: [select] only\nShould the bot buy "Red Rose" ?', false),
        option.bool("21475", "Silver Rose", 'Mode: [select] only\nShould the bot buy "Silver Rose" ?', false),
        option.bool(
            "21640",
            "Black Thorn Blade",
            'Mode: [select] only\nShould the bot buy "Black Thorn Blade" ?',
            false,
        ),
        option.bool(
            "21643",
            "Pink Wedding Guest",
            'Mode: [select] only\nShould the bot buy "Pink Wedding Guest" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ArtixWeddingMerge.select,
});

export default function main(): void {
    const script = new ArtixWeddingMerge();
    Core.bankingBlackList.push("Love Token ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
