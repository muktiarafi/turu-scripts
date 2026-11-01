/*
name: ChaosLab Mergeshop
description: Gets any item you want in ChaosLab mergeshop
tags: chaoslab, dage, alina, cysero, artix, beleen, mergeshop, daimyo, moglin, hamster, chaos, necropolis, bots,
*/
// Port of Scripts/Other/MergeShops/ChaosLabMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ChaosLabMerge {
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
                case "Chaorrupted Hamster":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("chaoslab", "Chaotic Server Hamster", req.name, undefined, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Crystallized Chaos":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("chaoslab", "Chaorrupted Moglin", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Daimyo":
                    Core.buyItem("necropolis", 422, "Daimyo");
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("chaoslab", 887, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "24085",
            "Chaorrupted BattleHamster",
            'Mode: [select] only\nShould the bot buy "Chaorrupted BattleHamster" ?',
            false,
        ),
        option.bool("24091", "Eye Am Chaos", 'Mode: [select] only\nShould the bot buy "Eye Am Chaos" ?', false),
        option.bool(
            "24090",
            "Chaorrupted Blade of Awe",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Blade of Awe" ?',
            false,
        ),
        option.bool(
            "24094",
            "Chaorrupted Cysero & Alina",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Cysero & Alina" ?',
            false,
        ),
        option.bool(
            "24095",
            "Chaorrupted Artix & Beleen",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Artix & Beleen" ?',
            false,
        ),
        option.bool("17849", "Chaos Daimyo", 'Mode: [select] only\nShould the bot buy "Chaos Daimyo" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ChaosLabMerge.select,
});

export default function main(): void {
    const script = new ChaosLabMerge();
    Core.bankingBlackList.push("Chaorrupted Hamster", "Crystallized Chaos", "Daimyo");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
