/*
name: Sunset Treasures Merge
description: This bot will farm the items belonging to the selected mode for the Sunset Treasures Merge [2451] in /sunsetdunes
tags: sunset, treasures, merge, sunsetdunes, phoenixs, glory, golden, phoenix, wings, fury, great, firebirds, spear, immortal, in, flames
*/
// Port of Scripts/Other/MergeShops/SunsetTreasuresMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class SunsetTreasuresMerge {
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
                case "Anqa's Feather":

                case "Glowing Ember":

                case "Golden Firebird's Spear":

                case "Golden Firebird's Blade":

                case "Golden Firebird's Blades":

                case "Miniature Phoenix Guest":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    //incase u get teh otehr drops along the way vvv
                    Core.addDrop(
                        "Glowing Ember",
                        "Golden Firebird's Spear",
                        "Golden Firebird's Blade",
                        "Golden Firebird's Blades",
                        "Miniature Phoenix Guest",
                    );
                    Core.registerQuests(9752);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("sunsetdunes", "Firebird Anqa", req.name, quant, { isTemp: req.temp });
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("sunsetdunes", 2451, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("86290", "Phoenix's Glory", 'Mode: [select] only\nShould the bot buy "Phoenix\'s Glory" ?', false),
        option.bool(
            "86292",
            "Phoenix's Glory Helm",
            'Mode: [select] only\nShould the bot buy "Phoenix\'s Glory Helm" ?',
            false,
        ),
        option.bool(
            "86298",
            "Golden Phoenix's Glory Blade",
            'Mode: [select] only\nShould the bot buy "Golden Phoenix\'s Glory Blade" ?',
            false,
        ),
        option.bool(
            "86300",
            "Golden Phoenix's Glory Blades",
            'Mode: [select] only\nShould the bot buy "Golden Phoenix\'s Glory Blades" ?',
            false,
        ),
        option.bool(
            "86294",
            "Golden Phoenix Wings",
            'Mode: [select] only\nShould the bot buy "Golden Phoenix Wings" ?',
            false,
        ),
        option.bool("86291", "Phoenix's Fury", 'Mode: [select] only\nShould the bot buy "Phoenix\'s Fury" ?', false),
        option.bool(
            "86293",
            "Phoenix's Fury Helm",
            'Mode: [select] only\nShould the bot buy "Phoenix\'s Fury Helm" ?',
            false,
        ),
        option.bool(
            "86297",
            "Golden Phoenix's Fury Blade",
            'Mode: [select] only\nShould the bot buy "Golden Phoenix\'s Fury Blade" ?',
            false,
        ),
        option.bool(
            "86299",
            "Golden Phoenix's Fury Blades",
            'Mode: [select] only\nShould the bot buy "Golden Phoenix\'s Fury Blades" ?',
            false,
        ),
        option.bool(
            "86295",
            "Golden Phoenix Great Wings",
            'Mode: [select] only\nShould the bot buy "Golden Phoenix Great Wings" ?',
            false,
        ),
        option.bool(
            "86279",
            "Firebird's Fury Spear",
            'Mode: [select] only\nShould the bot buy "Firebird\'s Fury Spear" ?',
            false,
        ),
        option.bool(
            "86281",
            "Firebird's Fury Blade",
            'Mode: [select] only\nShould the bot buy "Firebird\'s Fury Blade" ?',
            false,
        ),
        option.bool(
            "86306",
            "Firebird's Fury Blades",
            'Mode: [select] only\nShould the bot buy "Firebird\'s Fury Blades" ?',
            false,
        ),
        option.bool(
            "86302",
            "Immortal Phoenix in Flames",
            'Mode: [select] only\nShould the bot buy "Immortal Phoenix in Flames" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SunsetTreasuresMerge.select,
});

export default function main(): void {
    const script = new SunsetTreasuresMerge();
    Core.bankingBlackList.push(
        "Anqa's Feather",
        "Glowing Ember",
        "Golden Firebird's Spear",
        "Golden Firebird's Blade",
        "Golden Firebird's Blades",
        "Miniature Phoenix Guest",
    );
    if (
        !(
            bot.showMessageBox(
                "this script requires you to kill an ultra, so just run this on like 7 accounds... continue?",
                "**WARNING**",
                true,
            ) === true
        )
    ) {
        bot.stop();
    }

    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
