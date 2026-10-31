/*
name: Ylsas Gift Sac Merge
description: This bot will farm the items belonging to the selected mode for the Ylsas Gift Sac Merge [1605] in /icestorm
tags: ylsas, gift, sac, merge, icestorm, winter, assassin, , bangs, bandana, shuriken, ninjato, kunai, katana
*/
// Port of Scripts/Seasonal/FrostvalInJuly/YlsasGiftSacMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { IceStorm } from "./IceStorm";

const Adv = new CoreAdvanced();
const IS = new IceStorm();

export class YlsasGiftSacMerge {
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
                case "Burnt Bow":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("icestorm", "Dragon Hunter", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Dragon Scale":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("icestorm", "Fire Dragonling", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        IS.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("icestorm", 1605, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("44387", "Winter Assassin", 'Mode: [select] only\nShould the bot buy "Winter Assassin" ?', false),
        option.bool(
            "44388",
            "Winter Assassin Hood",
            'Mode: [select] only\nShould the bot buy "Winter Assassin Hood" ?',
            false,
        ),
        option.bool(
            "44389",
            "Winter Assassin Hooded Mask",
            'Mode: [select] only\nShould the bot buy "Winter Assassin Hooded Mask" ?',
            false,
        ),
        option.bool(
            "44391",
            "Winter Assassin Mask",
            'Mode: [select] only\nShould the bot buy "Winter Assassin Mask" ?',
            false,
        ),
        option.bool(
            "44390",
            "Winter Assassin Mask + Bangs",
            'Mode: [select] only\nShould the bot buy "Winter Assassin Mask + Bangs" ?',
            false,
        ),
        option.bool(
            "44393",
            "Winter Assassin Hair",
            'Mode: [select] only\nShould the bot buy "Winter Assassin Hair" ?',
            false,
        ),
        option.bool(
            "44392",
            "Winter Assassin Hair + Bangs",
            'Mode: [select] only\nShould the bot buy "Winter Assassin Hair + Bangs" ?',
            false,
        ),
        option.bool(
            "44395",
            "Winter Assassin Bandana",
            'Mode: [select] only\nShould the bot buy "Winter Assassin Bandana" ?',
            false,
        ),
        option.bool(
            "44394",
            "Winter Assassin Bandana + Bangs",
            'Mode: [select] only\nShould the bot buy "Winter Assassin Bandana + Bangs" ?',
            false,
        ),
        option.bool(
            "44399",
            "Winter Assassin Shuriken",
            'Mode: [select] only\nShould the bot buy "Winter Assassin Shuriken" ?',
            false,
        ),
        option.bool(
            "44397",
            "Winter Assassin Ninjato",
            'Mode: [select] only\nShould the bot buy "Winter Assassin Ninjato" ?',
            false,
        ),
        option.bool(
            "44400",
            "Winter Assassin Kunai",
            'Mode: [select] only\nShould the bot buy "Winter Assassin Kunai" ?',
            false,
        ),
        option.bool(
            "44396",
            "Winter Assassin Katana",
            'Mode: [select] only\nShould the bot buy "Winter Assassin Katana" ?',
            false,
        ),
        option.bool(
            "44398",
            "Winter Assassin Katana + Ninjato",
            'Mode: [select] only\nShould the bot buy "Winter Assassin Katana + Ninjato" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: YlsasGiftSacMerge.select,
});

export default function main(): void {
    const script = new YlsasGiftSacMerge();
    Core.bankingBlackList.push("Burnt Bow", "Dragon Scale");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
