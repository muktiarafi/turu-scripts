/*
name: GL-24Ks Loot Merge
description: This bot will farm the items belonging to the selected mode for the GL-24Ks Loot Merge [2437] in /twigguhunt
tags: gl-24ks, gl 24ks, loot, merge, twigguhunt, gold, voucher, k, glk, cloaked, visor, cloak, pronged, spear, spears, gilded, seraphic, fourth, morph, beard, beacon, glst
*/
// Port of Scripts/Seasonal/MayThe4th/GL24KsLootMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { TwigguHunt } from "./TwigguHunt";

const Adv = new CoreAdvanced();
const TH = new TwigguHunt();

export class GL24KsLootMerge {
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
                case "Salvaged Droid Part":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9703);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("twigguhunt", "r2", "Down", "*", "Broken Droid Part", 300, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "GL-1ST":

                case "GL-1ST Helm":

                case "GL-1ST Mask":

                case "GL-1ST Visor":

                case "Seraphic Fourth Morph":

                case "Seraphic Fourth Beard Morph":

                case "Seraphic Fourth Visage":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("twigguhunt", "Twiggu", req.name, quant, { isTemp: false, log: false });
                    break;
                case "GL-1ST Pronged Spear":

                case "GL-1ST Pronged Spears":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("twigguhunt", "Bodyguard Droid", req.name, quant, { isTemp: false, log: false });
                    break;
                case "GL-1ST Salvage Axe":

                case "GL-1ST Salvage Axes":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("twigguhunt", "Scout Droid", req.name, quant, { isTemp: false, log: false });
                    break;
                case "GL-1ST Salvage Gun":

                case "GL-1ST Salvage Guns":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("twigguhunt", "Infantry Droid", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        TH.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("twigguhunt", 2437, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("85548", "GL-24K", 'Mode: [select] only\nShould the bot buy "GL-24K" ?', false),
        option.bool("85549", "Cloaked GL-24K", 'Mode: [select] only\nShould the bot buy "Cloaked GL-24K" ?', false),
        option.bool("85550", "GL-24K Helm", 'Mode: [select] only\nShould the bot buy "GL-24K Helm" ?', false),
        option.bool("85551", "GL-24K Mask", 'Mode: [select] only\nShould the bot buy "GL-24K Mask" ?', false),
        option.bool("85552", "GL-24K Visor", 'Mode: [select] only\nShould the bot buy "GL-24K Visor" ?', false),
        option.bool("85555", "GL-24K Cloak", 'Mode: [select] only\nShould the bot buy "GL-24K Cloak" ?', false),
        option.bool(
            "85557",
            "GL-24K Pronged Spear",
            'Mode: [select] only\nShould the bot buy "GL-24K Pronged Spear" ?',
            false,
        ),
        option.bool(
            "85558",
            "GL-24K Pronged Spears",
            'Mode: [select] only\nShould the bot buy "GL-24K Pronged Spears" ?',
            false,
        ),
        option.bool(
            "85559",
            "GL-24K Gilded Axe",
            'Mode: [select] only\nShould the bot buy "GL-24K Gilded Axe" ?',
            false,
        ),
        option.bool(
            "85560",
            "GL-24K Gilded Axes",
            'Mode: [select] only\nShould the bot buy "GL-24K Gilded Axes" ?',
            false,
        ),
        option.bool(
            "85561",
            "GL-24K Gilded Gun",
            'Mode: [select] only\nShould the bot buy "GL-24K Gilded Gun" ?',
            false,
        ),
        option.bool(
            "85562",
            "GL-24K Gilded Guns",
            'Mode: [select] only\nShould the bot buy "GL-24K Gilded Guns" ?',
            false,
        ),
        option.bool(
            "85571",
            "Seraphic Fourth Hooded Morph",
            'Mode: [select] only\nShould the bot buy "Seraphic Fourth Hooded Morph" ?',
            false,
        ),
        option.bool(
            "85573",
            "Seraphic Fourth Hooded Beard Morph",
            'Mode: [select] only\nShould the bot buy "Seraphic Fourth Hooded Beard Morph" ?',
            false,
        ),
        option.bool(
            "85575",
            "Seraphic Fourth Hooded Visage",
            'Mode: [select] only\nShould the bot buy "Seraphic Fourth Hooded Visage" ?',
            false,
        ),
        option.bool(
            "85553",
            "GL-24K Beacon Cloak",
            'Mode: [select] only\nShould the bot buy "GL-24K Beacon Cloak" ?',
            false,
        ),
        option.bool("85554", "GL-24K Beacon", 'Mode: [select] only\nShould the bot buy "GL-24K Beacon" ?', false),
        option.bool("85536", "GL-1ST Beacon", 'Mode: [select] only\nShould the bot buy "GL-1ST Beacon" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GL24KsLootMerge.select,
});

export default function main(): void {
    const script = new GL24KsLootMerge();
    Core.bankingBlackList.push(
        "Salvaged Droid Part",
        "GL-1ST",
        "GL-1ST Helm",
        "GL-1ST Mask",
        "GL-1ST Visor",
        "GL-1ST Pronged Spear",
        "GL-1ST Pronged Spears",
        "GL-1ST Salvage Axe",
        "GL-1ST Salvage Axes",
        "GL-1ST Salvage Gun",
        "GL-1ST Salvage Guns",
        "Seraphic Fourth Morph",
        "Seraphic Fourth Beard Morph",
        "Seraphic Fourth Visage",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
