/*
name: GrenstoryMerge
description: Farms "Grenstory Token" and buys Items from the Grenstory mergeshop
tags: grenstory token, grenstory, merge
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/GrenstoryMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class GrenstoryMerge {
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
                case "Grenstory Token":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("grenstory", "Chinchilizard", req.name, quant, { isTemp: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("grenstory", 1236, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "34374",
            "Shamanic Summoner",
            'Mode: [select] only\nShould the bot buy "Shamanic Summoner" ?',
            false,
        ),
        option.bool("34376", "Raptor", 'Mode: [select] only\nShould the bot buy "Raptor" ?', false),
        option.bool("34373", "Azure Egg Staff", 'Mode: [select] only\nShould the bot buy "Azure Egg Staff" ?', false),
        option.bool(
            "34370",
            "Shamanic Summoner Helm",
            'Mode: [select] only\nShould the bot buy "Shamanic Summoner Helm" ?',
            false,
        ),
        option.bool("34371", "Tribal Feathers", 'Mode: [select] only\nShould the bot buy "Tribal Feathers" ?', false),
        option.bool("34369", "Jurassic Grenwog", 'Mode: [select] only\nShould the bot buy "Jurassic Grenwog" ?', false),
        option.bool(
            "34372",
            "Jurassic Grenwog Tail",
            'Mode: [select] only\nShould the bot buy "Jurassic Grenwog Tail" ?',
            false,
        ),
        option.bool("34378", "Raptor Morph", 'Mode: [select] only\nShould the bot buy "Raptor Morph" ?', false),
        option.bool("34377", "Raptor Tail", 'Mode: [select] only\nShould the bot buy "Raptor Tail" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GrenstoryMerge.select,
});

export default function main(): void {
    const script = new GrenstoryMerge();
    Core.bankingBlackList.push("Grenstory Token");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
