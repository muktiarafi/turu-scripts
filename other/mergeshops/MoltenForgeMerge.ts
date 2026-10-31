/*
name: Molten Forge Merge
description: This bot will farm the items belonging to the selected mode for the Molten Forge Merge [1428] in /battleundere
tags: molten, forge, merge, battleundere, lavamorphosis, lavamorph, eyes, visor, wings, stinger, venom, banes
*/
// Port of Scripts/Other/MergeShops/MoltenForgeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class MoltenForgeMerge {
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
                case "Molten Core":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("battleundere", "Lava Guard", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Crystamorphosis":

                case "Crystamorph Helm":

                case "Crystamorph Eyes":

                case "Crystamorph Visor":

                case "Crystamorph Wings":

                case "Crystamorph Stinger":

                case "Crystamorph Venom":

                case "Crystamorph Dual Banes":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("battleundere", "r9", "Left", "*", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("battleundere", 1428, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("40605", "Lavamorphosis", 'Mode: [select] only\nShould the bot buy "Lavamorphosis" ?', false),
        option.bool("40607", "Lavamorph Helm", 'Mode: [select] only\nShould the bot buy "Lavamorph Helm" ?', false),
        option.bool("40608", "Lavamorph Eyes", 'Mode: [select] only\nShould the bot buy "Lavamorph Eyes" ?', false),
        option.bool("40606", "Lavamorph Visor", 'Mode: [select] only\nShould the bot buy "Lavamorph Visor" ?', false),
        option.bool("40612", "Lavamorph Wings", 'Mode: [select] only\nShould the bot buy "Lavamorph Wings" ?', false),
        option.bool(
            "40609",
            "Lavamorph Stinger",
            'Mode: [select] only\nShould the bot buy "Lavamorph Stinger" ?',
            false,
        ),
        option.bool("40611", "Lavamorph Venom", 'Mode: [select] only\nShould the bot buy "Lavamorph Venom" ?', false),
        option.bool(
            "40610",
            "Lavamorph Dual Banes",
            'Mode: [select] only\nShould the bot buy "Lavamorph Dual Banes" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MoltenForgeMerge.select,
});

export default function main(): void {
    const script = new MoltenForgeMerge();
    Core.bankingBlackList.push(
        "Molten Core",
        "Crystamorphosis",
        "Crystamorph Helm",
        "Crystamorph Eyes",
        "Crystamorph Visor",
        "Crystamorph Wings",
        "Crystamorph Stinger",
        "Crystamorph Venom",
        "Crystamorph Dual Banes",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
