/*
name: Gundahar's Stash Merge
description: This will get all or selected items on this merge shop.
tags: gundahars-stash-merge, seasonal, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/GundaharsStashMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFrostvale } from "./story/CoreFrostvale";

const Adv = new CoreAdvanced();
const Frostvale = new CoreFrostvale();

export class GundaharsStashMerge {
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
                case "Icy Pelt":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(8433);
                        Core.huntMonsterMapID("deerhunt", 1, "Deer Deterred", 3);
                        Core.huntMonsterMapID("deerhunt", 4, "Wolf Warded", 9);
                        Core.huntMonsterMapID("deerhunt", 5, "Owl Ousted", 6);
                        Core.ensureComplete(8433);
                    }
                    bot.wait.forPickup(req.name);
                    break;
                case "WinterWild Axe":

                case "Old Moglin Teddy Mace":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("deerhunt", "Zweinichthirsch", req.name, undefined, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("deerhunt")) {
            return;
        }

        Frostvale.deerHunt();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("deerhunt", 2077, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "49776",
            "WinterWild Warrior",
            'Mode: [select] only\nShould the bot buy "WinterWild Warrior" ?',
            false,
        ),
        option.bool("49777", "WinterWild Locks", 'Mode: [select] only\nShould the bot buy "WinterWild Locks" ?', false),
        option.bool("49778", "WinterWild Beard", 'Mode: [select] only\nShould the bot buy "WinterWild Beard" ?', false),
        option.bool("49779", "WinterWild Hood", 'Mode: [select] only\nShould the bot buy "WinterWild Hood" ?', false),
        option.bool(
            "49780",
            "WinterWild Hood + Beard",
            'Mode: [select] only\nShould the bot buy "WinterWild Hood + Beard" ?',
            false,
        ),
        option.bool(
            "49781",
            "WinterWild Warrior Back Axes",
            'Mode: [select] only\nShould the bot buy "WinterWild Warrior Back Axes" ?',
            false,
        ),
        option.bool(
            "49784",
            "Dual WinterWild Axes",
            'Mode: [select] only\nShould the bot buy "Dual WinterWild Axes" ?',
            false,
        ),
        option.bool(
            "49785",
            "WinterWild Dagger",
            'Mode: [select] only\nShould the bot buy "WinterWild Dagger" ?',
            false,
        ),
        option.bool(
            "66271",
            "Moglin Teddy Mace",
            'Mode: [select] only\nShould the bot buy "Moglin Teddy Mace" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GundaharsStashMerge.select,
});

export default function main(): void {
    const script = new GundaharsStashMerge();
    Core.bankingBlackList.push("Icy Pelt", "WinterWild Axe", "Old Moglin Teddy Mace");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
