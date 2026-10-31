/*
name: Moonlight Khopesh Merge
description: This bot will farm the items belonging to the selected mode for the Moonlight Khopesh Merge [1175] in /bot.map.name
tags: moonlight, khopesh, merge, bot.map.name, moonlit, great, lunar, stellar, celestial
*/
// Port of Scripts/Seasonal/Mogloween/MoonlightKhopeshMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CruxShip } from "../../story/CruxShip";

const Adv = new CoreAdvanced();
const cruxShip = new CruxShip();

export class MoonlightKhopeshMerge {
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
                case "Khonsu Seal":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("cruxship", "Apephryx", req.name, quant, { isTemp: false });
                    break;
            }
        };
        cruxShip.storyLine();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge(bot.map.name, 1175, findIngredients, buyOnlyThis, { buyMode });
        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("31983", "Moonlit Khopesh", 'Mode: [select] only\nShould the bot buy "Moonlit Khopesh" ?', false),
        option.bool(
            "31984",
            "Great Moonlit Khopesh",
            'Mode: [select] only\nShould the bot buy "Great Moonlit Khopesh" ?',
            false,
        ),
        option.bool("31985", "Lunar Khopesh", 'Mode: [select] only\nShould the bot buy "Lunar Khopesh" ?', false),
        option.bool("31986", "Stellar Khopesh", 'Mode: [select] only\nShould the bot buy "Stellar Khopesh" ?', false),
        option.bool(
            "31987",
            "Celestial Khopesh",
            'Mode: [select] only\nShould the bot buy "Celestial Khopesh" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MoonlightKhopeshMerge.select,
});

export default function main(): void {
    const script = new MoonlightKhopeshMerge();
    Core.bankingBlackList.push("Khonsu Seal");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
