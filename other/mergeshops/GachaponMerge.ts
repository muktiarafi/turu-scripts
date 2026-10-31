/*
name: GachaponMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/GachaponMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Eden } from "../../story/Eden";

const Adv = new CoreAdvanced();
const eden = new Eden();

export class GachaponMerge {
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
                case "Second Chance Coin":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    //I heard you like Gacha 7781
                    Core.registerQuests(7781);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Adv.buyItem("onsen", 1926, "Gachapon Coin", undefined, undefined, undefined, false);
                        Core.huntMonster("yokaigrave", "Skello Kitty", "Skello Kitty Bone");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        eden.storyLine();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("onsen", 1926, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "57239",
            "Crystallis Jinbei",
            'Mode: [select] only\nShould the bot buy "Crystallis Jinbei" ?',
            false,
        ),
        option.bool(
            "57240",
            "Crystallis Yukata",
            'Mode: [select] only\nShould the bot buy "Crystallis Yukata" ?',
            false,
        ),
        option.bool(
            "57241",
            "Crystallis Yukata + Haori",
            'Mode: [select] only\nShould the bot buy "Crystallis Yukata + Haori" ?',
            false,
        ),
        option.bool(
            "57242",
            "Cool Crystallis Yukata",
            'Mode: [select] only\nShould the bot buy "Cool Crystallis Yukata" ?',
            false,
        ),
        option.bool(
            "57243",
            "Dark Crystallis Jinbei",
            'Mode: [select] only\nShould the bot buy "Dark Crystallis Jinbei" ?',
            false,
        ),
        option.bool("57244", "Onsen Yukata", 'Mode: [select] only\nShould the bot buy "Onsen Yukata" ?', false),
        option.bool(
            "57245",
            "Onsen Yukata + Haori",
            'Mode: [select] only\nShould the bot buy "Onsen Yukata + Haori" ?',
            false,
        ),
        option.bool(
            "57246",
            "Cool Onsen Yukata",
            'Mode: [select] only\nShould the bot buy "Cool Onsen Yukata" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GachaponMerge.select,
});

export default function main(): void {
    const script = new GachaponMerge();
    Core.bankingBlackList.push("Second Chance Coin ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
