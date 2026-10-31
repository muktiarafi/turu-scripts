/*
name: Mog-GLOW-ween Merge
description: null
tags: merge, mogloween, seasonal
*/
// Port of Scripts/Seasonal/Mogloween/MergeShops/Mog-GLOW-weenMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class MogGLOWweenMerge {
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
                case "Glowball":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    //Survive Frankenwerepire! 3163
                    Core.registerQuests(3163);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("franken", "Frankenwerepire", "Defeat Frankenwerepire");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("mogloween")) {
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("franken", 770, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("20753", "Green Glowchucks", 'Mode: [select] only\nShould the bot buy "Green Glowchucks" ?', false),
        option.bool("20756", "Blue Glowchucks", 'Mode: [select] only\nShould the bot buy "Blue Glowchucks" ?', false),
        option.bool("20758", "Pink Glowchucks", 'Mode: [select] only\nShould the bot buy "Pink Glowchucks" ?', false),
        option.bool(
            "20759",
            "Orange Glowchucks",
            'Mode: [select] only\nShould the bot buy "Orange Glowchucks" ?',
            false,
        ),
        option.bool("36677", "Glow Dreads", 'Mode: [select] only\nShould the bot buy "Glow Dreads" ?', false),
        option.bool("36676", "Glow Falls", 'Mode: [select] only\nShould the bot buy "Glow Falls" ?', false),
        option.bool("36675", "Glow Smasher", 'Mode: [select] only\nShould the bot buy "Glow Smasher" ?', false),
        option.bool(
            "36674",
            "Blade of Cursed Glow",
            'Mode: [select] only\nShould the bot buy "Blade of Cursed Glow" ?',
            false,
        ),
        option.bool("36673", "Glow Flail", 'Mode: [select] only\nShould the bot buy "Glow Flail" ?', false),
        option.bool(
            "36672",
            "Blacklight Bone Club",
            'Mode: [select] only\nShould the bot buy "Blacklight Bone Club" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MogGLOWweenMerge.select,
});

export default function main(): void {
    const script = new MogGLOWweenMerge();
    Core.bankingBlackList.push("Glowball ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
