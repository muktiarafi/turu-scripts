/*
name: Dark Festa Merge
description: This script farms the materials needed for Dark Festa Merge.
tags: seasonal, dark festa, carnaval, merge
*/
// Port of Scripts/Seasonal/Carnaval/DarkFestaMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { DarkFesta } from "./DarkFesta";

const Adv = new CoreAdvanced();
const DF = new DarkFesta();

export class DarkFestaMerge {
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
                case "Pena mágica":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("firebird", "Ultra Belo", req.name, quant, { isTemp: false, log: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Rainha da Bateria":

                case "Rainha da Bateria Headdress":

                case "Rainha da Bateria Headdress + Locks":

                case "Rainha da Bateria Staff":

                case "Rainha da Bateria Feathered Tail":

                case "Rainha da Bateria Feathers":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("darkfesta", "Dark Boitata", req.name, quant, { isTemp: false, log: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        DF.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("darkfesta", 1699, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "47671",
            "Rainha do Carnaval",
            'Mode: [select] only\nShould the bot buy "Rainha do Carnaval" ?',
            false,
        ),
        option.bool(
            "47674",
            "Rainha do Carnaval Headdress",
            'Mode: [select] only\nShould the bot buy "Rainha do Carnaval Headdress" ?',
            false,
        ),
        option.bool(
            "47673",
            "Rainha do Carnaval Headdress + Locks",
            'Mode: [select] only\nShould the bot buy "Rainha do Carnaval Headdress + Locks" ?',
            false,
        ),
        option.bool(
            "47677",
            "Rainha do Carnaval Staff",
            'Mode: [select] only\nShould the bot buy "Rainha do Carnaval Staff" ?',
            false,
        ),
        option.bool(
            "47675",
            "Rainha do Carnaval Feathered Tail",
            'Mode: [select] only\nShould the bot buy "Rainha do Carnaval Feathered Tail" ?',
            false,
        ),
        option.bool(
            "47676",
            "Rainha do Carnaval Feathers",
            'Mode: [select] only\nShould the bot buy "Rainha do Carnaval Feathers" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DarkFestaMerge.select,
});

export default function main(): void {
    const script = new DarkFestaMerge();
    Core.bankingBlackList.push(
        "Pena mágica",
        "Rainha da Bateria",
        "Rainha da Bateria Headdress",
        "Rainha da Bateria Headdress + Locks",
        "Rainha da Bateria Staff",
        "Rainha da Bateria Feathered Tail",
        "Rainha da Bateria Feathers",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
