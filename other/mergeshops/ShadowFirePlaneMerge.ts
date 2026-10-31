/*
name: ShadowFirePlaneMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/ShadowFirePlaneMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreSoW } from "../../story/shadowsofwar/CoreSoW";

const Adv = new CoreAdvanced();
const SoW = new CoreSoW();

export class ShadowFirePlaneMerge {
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
                case "Shade Spark":
                    SoW.tyndarius();
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8145);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Catching Fire 8145
                        Core.huntMonster("shadowfireplane", "Living Shadowflame", "Shadefire Essence", 20);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shadowfireplane", 2008, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("61388", "Voidborn Warlock", 'Mode: [select] only\nShould the bot buy "Voidborn Warlock" ?', false),
        option.bool(
            "61389",
            "Voidborn Warlock's Hood",
            'Mode: [select] only\nShould the bot buy "Voidborn Warlock\'s Hood" ?',
            false,
        ),
        option.bool(
            "61390",
            "Voidborn Warlock's Guard",
            'Mode: [select] only\nShould the bot buy "Voidborn Warlock\'s Guard" ?',
            false,
        ),
        option.bool(
            "61391",
            "Voidborn Morph Helm",
            'Mode: [select] only\nShould the bot buy "Voidborn Morph Helm" ?',
            false,
        ),
        option.bool(
            "61392",
            "Angry Voidborn Morph Helm",
            'Mode: [select] only\nShould the bot buy "Angry Voidborn Morph Helm" ?',
            false,
        ),
        option.bool(
            "61393",
            "Happy Voidborn Morph Helm",
            'Mode: [select] only\nShould the bot buy "Happy Voidborn Morph Helm" ?',
            false,
        ),
        option.bool(
            "61394",
            "Hungry Voidborn Morph Helm",
            'Mode: [select] only\nShould the bot buy "Hungry Voidborn Morph Helm" ?',
            false,
        ),
        option.bool(
            "61395",
            "Voidborn Guardian Beast",
            'Mode: [select] only\nShould the bot buy "Voidborn Guardian Beast" ?',
            false,
        ),
        option.bool(
            "61396",
            "Voidborn Warlock Chakrams",
            'Mode: [select] only\nShould the bot buy "Voidborn Warlock Chakrams" ?',
            false,
        ),
        option.bool(
            "61397",
            "Voidborn Warlock Staff",
            'Mode: [select] only\nShould the bot buy "Voidborn Warlock Staff" ?',
            false,
        ),
        option.bool(
            "61807",
            "Voidborn Warlock Chakrams",
            'Mode: [select] only\nShould the bot buy "Voidborn Warlock Chakrams" ?',
            false,
        ),
        option.bool(
            "61332",
            "Flameburst Dragunblade",
            'Mode: [select] only\nShould the bot buy "Flameburst Dragunblade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShadowFirePlaneMerge.select,
});

export default function main(): void {
    const script = new ShadowFirePlaneMerge();
    Core.bankingBlackList.push("Shade Spark ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
