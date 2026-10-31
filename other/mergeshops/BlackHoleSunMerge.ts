/*
name: BlackHoleSunMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/BlackHoleSunMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class BlackHoleSunMerge {
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
                case "4th Dimension Gem":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5163);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("blackholesun", "Black Light Elemental", "Black Light", 5);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("blackholesun", 1268, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "35490",
            "Golden Anubyx Warrior",
            'Mode: [select] only\nShould the bot buy "Golden Anubyx Warrior" ?',
            false,
        ),
        option.bool("35491", "Anubyx Headdress", 'Mode: [select] only\nShould the bot buy "Anubyx Headdress" ?', false),
        option.bool("35485", "Nega Mummy", 'Mode: [select] only\nShould the bot buy "Nega Mummy" ?', false),
        option.bool("35486", "Nega Mummy Head", 'Mode: [select] only\nShould the bot buy "Nega Mummy Head" ?', false),
        option.bool("35420", "Dimension Shard", 'Mode: [select] only\nShould the bot buy "Dimension Shard" ?', false),
        option.bool("35494", "Inverse Hound", 'Mode: [select] only\nShould the bot buy "Inverse Hound" ?', false),
        option.bool("35493", "Nega Hound", 'Mode: [select] only\nShould the bot buy "Nega Hound" ?', false),
        option.bool(
            "35492",
            "High Nega Commander Spear",
            'Mode: [select] only\nShould the bot buy "High Nega Commander Spear" ?',
            false,
        ),
        option.bool(
            "35488",
            "Nega Anubyx Headdress",
            'Mode: [select] only\nShould the bot buy "Nega Anubyx Headdress" ?',
            false,
        ),
        option.bool(
            "35487",
            "Nega Anubyx Warrior",
            'Mode: [select] only\nShould the bot buy "Nega Anubyx Warrior" ?',
            false,
        ),
        option.bool(
            "35489",
            "Nega Warrior Blade",
            'Mode: [select] only\nShould the bot buy "Nega Warrior Blade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BlackHoleSunMerge.select,
});

export default function main(): void {
    const script = new BlackHoleSunMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
