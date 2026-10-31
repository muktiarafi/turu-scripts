/*
name: Robinas Harvest Merge
description: This bot will farm the items belonging to the selected mode for the Robinas Harvest Merge [2366] in /blightharvest
tags: robinas, harvest, merge, blightharvest, turdracolich, hunter, stalker, brimmed, morph, hunting, gear, goldtouched, carver, carvers, rifle, turdraken, carving, cranberry, imp, pet
*/
// Port of Scripts/Seasonal/HarvestDay/MergeShops/RobinasHarvestMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreHarvestDay } from "../CoreHarvestDay";

const Adv = new CoreAdvanced();
const CHD = new CoreHarvestDay();

export class RobinasHarvestMerge {
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
                case "Blight Bone":
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.name);
                    Core.registerQuests(9482);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.killMonster("blightharvest", "r5", "Left", "Tantalocust", "Mealy Bug Legs", 6);
                        Core.killMonster("blightharvest", "r7", "Left", "Fear Gorta", "Hunger Grass", 6);
                        Core.equipClass(ClassType.Solo);
                        Core.killMonster("blightharvest", "r10", "Left", "Famine", "Famine's Spice Flakes");
                        Core.logger("This item is not setup yet");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Turdraken Carver":

                case "Harvest Rifle":

                case "Turdraken Carvers":

                case "Vintage Shotgun":

                case "Cranberry Shoulder Imp":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.killMonster("blightharvest", "r5", "Left", "*", req.name, undefined, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        CHD.blightHarvest();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("blightharvest", 2366, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "81352",
            "Turdracolich Hunter",
            'Mode: [select] only\nShould the bot buy "Turdracolich Hunter" ?',
            false,
        ),
        option.bool(
            "81353",
            "Turdracolich Stalker",
            'Mode: [select] only\nShould the bot buy "Turdracolich Stalker" ?',
            false,
        ),
        option.bool(
            "81354",
            "Brimmed Turdracolich Hunter Hat",
            'Mode: [select] only\nShould the bot buy "Brimmed Turdracolich Hunter Hat" ?',
            false,
        ),
        option.bool(
            "81355",
            "Brimmed Turdracolich Hunter Hat and Locks",
            'Mode: [select] only\nShould the bot buy "Brimmed Turdracolich Hunter Hat and Locks" ?',
            false,
        ),
        option.bool(
            "81356",
            "Turdracolich Hunter Morph",
            'Mode: [select] only\nShould the bot buy "Turdracolich Hunter Morph" ?',
            false,
        ),
        option.bool(
            "81357",
            "Turdracolich Hunter Visage",
            'Mode: [select] only\nShould the bot buy "Turdracolich Hunter Visage" ?',
            false,
        ),
        option.bool(
            "81638",
            "Turdracolich Stalker Morph",
            'Mode: [select] only\nShould the bot buy "Turdracolich Stalker Morph" ?',
            false,
        ),
        option.bool(
            "81639",
            "Turdracolich Stalker Visage",
            'Mode: [select] only\nShould the bot buy "Turdracolich Stalker Visage" ?',
            false,
        ),
        option.bool(
            "81361",
            "Turdracolich Hunting Gear",
            'Mode: [select] only\nShould the bot buy "Turdracolich Hunting Gear" ?',
            false,
        ),
        option.bool(
            "81364",
            "Gold-Touched Carver",
            'Mode: [select] only\nShould the bot buy "Gold-Touched Carver" ?',
            false,
        ),
        option.bool(
            "81365",
            "Gold-Touched Carvers",
            'Mode: [select] only\nShould the bot buy "Gold-Touched Carvers" ?',
            false,
        ),
        option.bool(
            "81367",
            "Gold-Touched Rifle",
            'Mode: [select] only\nShould the bot buy "Gold-Touched Rifle" ?',
            false,
        ),
        option.bool(
            "81369",
            "Turdraken Carving Gear",
            'Mode: [select] only\nShould the bot buy "Turdraken Carving Gear" ?',
            false,
        ),
        option.bool(
            "81386",
            "Cranberry Imp Pet",
            'Mode: [select] only\nShould the bot buy "Cranberry Imp Pet" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: RobinasHarvestMerge.select,
});

export default function main(): void {
    const script = new RobinasHarvestMerge();
    Core.bankingBlackList.push(
        "Blight Bone",
        "Turdraken Carver",
        "Harvest Rifle",
        "Turdraken Carvers",
        "Vintage Shotgun",
        "Cranberry Shoulder Imp",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
