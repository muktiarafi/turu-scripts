/*
name: DageWar50Merge
description: null
tags: null
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/DageWar50Merge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class DageWar50Merge {
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
                case "Cyber Skull":

                case "UnDeath Core":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("futurewardage", "SF3017 Paragonator", req.name, quant, { log: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("futurewardage", 1377, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("38435", "Eternal PainSaw", 'Mode: [select] only\nShould the bot buy "Eternal PainSaw" ?', false),
        option.bool(
            "38806",
            "Dual Eternal PainSaws",
            'Mode: [select] only\nShould the bot buy "Dual Eternal PainSaws" ?',
            false,
        ),
        option.bool(
            "38808",
            "Enchanted Eternal PainSaw",
            'Mode: [select] only\nShould the bot buy "Enchanted Eternal PainSaw" ?',
            false,
        ),
        option.bool(
            "38809",
            "Enchanted Eternal PainSaws",
            'Mode: [select] only\nShould the bot buy "Enchanted Eternal PainSaws" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DageWar50Merge.select,
});

export default function main(): void {
    const script = new DageWar50Merge();
    Core.bankingBlackList.push("Cyber Skull", "UnDeath Core");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
