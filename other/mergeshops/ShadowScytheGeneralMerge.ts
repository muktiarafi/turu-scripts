/*
name: ShadowScytheGeneralMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/ShadowScytheGeneralMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ShadowScytheGeneralMerge {
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
                case "Shadow Shield":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("lightguardwar", "Sigrid Sunshield", req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shadowfall", 1644, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "45363",
            "ShadowScythe General",
            'Mode: [select] only\nShould the bot buy "ShadowScythe General" ?',
            false,
        ),
        option.bool(
            "45255",
            "ShadowScythe General Armor",
            'Mode: [select] only\nShould the bot buy "ShadowScythe General Armor" ?',
            false,
        ),
        option.bool(
            "45256",
            "ShadowScythe General Sinister Helm",
            'Mode: [select] only\nShould the bot buy "ShadowScythe General Sinister Helm" ?',
            false,
        ),
        option.bool(
            "45257",
            "ShadowScythe General Helm",
            'Mode: [select] only\nShould the bot buy "ShadowScythe General Helm" ?',
            false,
        ),
        option.bool(
            "45258",
            "ShadowScythe General Cape",
            'Mode: [select] only\nShould the bot buy "ShadowScythe General Cape" ?',
            false,
        ),
        option.bool(
            "45259",
            "ShadowScythe General Axe",
            'Mode: [select] only\nShould the bot buy "ShadowScythe General Axe" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShadowScytheGeneralMerge.select,
});

export default function main(): void {
    const script = new ShadowScytheGeneralMerge();
    Core.bankingBlackList.push("Shadow Shield ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
