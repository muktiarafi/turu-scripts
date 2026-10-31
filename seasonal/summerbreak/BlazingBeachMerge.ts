/*
name: Blazing Beach Merge
description: This will farm the Blazing Beach items.
tags: farm, merge, shop, blazing-beach, summer-break
*/
// Port of Scripts/Seasonal/SummerBreak/BlazingBeachMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { BlazingBeachStory } from "./BlazingBeach";

const Adv = new CoreAdvanced();
const BBS = new BlazingBeachStory();

export class BlazingBeachMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            const currentQuant = req.temp ? bot.tempInv.getQuantity(req.name) : bot.inventory.getQuantity(req.name);
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
                case `Mother Dragon's Gift`:
                    Core.registerQuests(8709);
                    Core.logger(`Farming ${req.name} (${currentQuant}/${quant})`);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("blazingbeach", "r5", "Right", "Red-Hot Raider", "Raider Repelled", 10, {
                            log: false,
                        });
                        Core.killMonster("blazingbeach", "r2", "Right", "Scalding Shooter", "Sharpshooter Shooed", 8, {
                            log: false,
                        });
                        Core.killMonster("blazingbeach", "r2", "Right", "Burning Bombadier", "Bomber Bye-Byed", 6, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("blazingbeach")) {
            return;
        }

        BBS.storyLine();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("blazingbeach", 2138, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("70495", "Magma BlazeBeard", 'Mode: [select] only\nShould the bot buy "Magma BlazeBeard" ?', false),
        option.bool(
            "70496",
            "Magma BlazeBeard Morph",
            'Mode: [select] only\nShould the bot buy "Magma BlazeBeard Morph" ?',
            false,
        ),
        option.bool(
            "70497",
            "Magma BlazeBeard Female Morph",
            'Mode: [select] only\nShould the bot buy "Magma BlazeBeard Female Morph" ?',
            false,
        ),
        option.bool(
            "70498",
            "Magma BlazeBeard Flames",
            'Mode: [select] only\nShould the bot buy "Magma BlazeBeard Flames" ?',
            false,
        ),
        option.bool(
            "70499",
            "Magma BlazeBeard Cutlass",
            'Mode: [select] only\nShould the bot buy "Magma BlazeBeard Cutlass" ?',
            false,
        ),
        option.bool(
            "70661",
            "Dual Magma BlazeBeard Cutlasses",
            'Mode: [select] only\nShould the bot buy "Dual Magma BlazeBeard Cutlasses" ?',
            false,
        ),
        option.bool("68640", "Magmagilt Odachi", 'Mode: [select] only\nShould the bot buy "Magmagilt Odachi" ?', false),
        option.bool(
            "68641",
            "Magmagilt Odachis",
            'Mode: [select] only\nShould the bot buy "Magmagilt Odachis" ?',
            false,
        ),
        option.bool("68643", "Magmagilt Kama", 'Mode: [select] only\nShould the bot buy "Magmagilt Kama" ?', false),
        option.bool("68644", "Magmagilt Kamas", 'Mode: [select] only\nShould the bot buy "Magmagilt Kamas" ?', false),
        option.bool("68647", "Magmagilt Tabar", 'Mode: [select] only\nShould the bot buy "Magmagilt Tabar" ?', false),
        option.bool("68648", "Magmagilt Tabars", 'Mode: [select] only\nShould the bot buy "Magmagilt Tabars" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BlazingBeachMerge.select,
});

export default function main(): void {
    const script = new BlazingBeachMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
