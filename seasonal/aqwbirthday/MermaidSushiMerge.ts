/*
name: Mermaid Sushi Merge
description: This will get all or selected items on this merge shop.
tags: mermaid-sushi-merge, seasonal, aqw-anniversary
*/
// Port of Scripts/Seasonal/AqwBirthday/MermaidSushiMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class MermaidSushiMerge {
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
                case "Scarbucks Gift Card":
                    Core.equipClass(ClassType.Solo);
                    Core.killMonster("mermaidsushi", "r7a", "Left", "*", req.name, quant, { isTemp: false });
                    break;
            }
        };
        bot.quests.updateQuest(8892);
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("mermaidsushi", 2178, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("72957", "Coffeemancer", 'Mode: [select] only\nShould the bot buy "Coffeemancer" ?', false),
        option.bool("72958", "Barista Beard", 'Mode: [select] only\nShould the bot buy "Barista Beard" ?', false),
        option.bool(
            "72960",
            "Barista Bun and Glasses",
            'Mode: [select] only\nShould the bot buy "Barista Bun and Glasses" ?',
            false,
        ),
        option.bool("72963", "Coffee Guzzler", 'Mode: [select] only\nShould the bot buy "Coffee Guzzler" ?', false),
        option.bool(
            "72964",
            "Zorbak the Coffee Fiend",
            'Mode: [select] only\nShould the bot buy "Zorbak the Coffee Fiend" ?',
            false,
        ),
        option.bool("72965", "Scarbucks Carpet", 'Mode: [select] only\nShould the bot buy "Scarbucks Carpet" ?', false),
        option.bool(
            "72968",
            "Scarbucks Barista Gear",
            'Mode: [select] only\nShould the bot buy "Scarbucks Barista Gear" ?',
            false,
        ),
        option.bool("72969", "Scarbucks Tray", 'Mode: [select] only\nShould the bot buy "Scarbucks Tray" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MermaidSushiMerge.select,
});

export default function main(): void {
    const script = new MermaidSushiMerge();
    Core.bankingBlackList.push("Scarbucks Gift Card ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
