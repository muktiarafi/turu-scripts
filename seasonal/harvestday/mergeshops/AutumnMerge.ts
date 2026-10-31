/*
name: Autumn Merge
description: This bot will farm the items belonging to the selected mode for the Autumn Merge [2368] in /eventhub
tags: autumn, merge, eventhub, spirit, breath, wind, falls, whisper, whispers, tree, scattered, leaves, fallen, forest, log, owl, guest, friend
*/
// Port of Scripts/Seasonal/HarvestDay/MergeShops/AutumnMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class AutumnMerge {
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
                case "Fallen Leaf":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("eventhub", "Leaf Painter", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Gold Flake":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("blightharvest", "Tantalocust", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Gnarled Wood":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("fearfeast", "OverGourd", req.name, quant, { isTemp: req.temp, log: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("harvest")) {
            Core.logger("This script is only available during Harvest Day");
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("eventhub", 2368, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("81605", "Spirit of Autumn", 'Mode: [select] only\nShould the bot buy "Spirit of Autumn" ?', false),
        option.bool("81606", "Visage of Autumn", 'Mode: [select] only\nShould the bot buy "Visage of Autumn" ?', false),
        option.bool(
            "81607",
            "Breath of Autumn Wind",
            'Mode: [select] only\nShould the bot buy "Breath of Autumn Wind" ?',
            false,
        ),
        option.bool("81608", "Autumn Falls", 'Mode: [select] only\nShould the bot buy "Autumn Falls" ?', false),
        option.bool(
            "81609",
            "Whisper of Autumn",
            'Mode: [select] only\nShould the bot buy "Whisper of Autumn" ?',
            false,
        ),
        option.bool(
            "81631",
            "Whispers of Autumn",
            'Mode: [select] only\nShould the bot buy "Whispers of Autumn" ?',
            false,
        ),
        option.bool("81610", "Autumn Wind Tree", 'Mode: [select] only\nShould the bot buy "Autumn Wind Tree" ?', false),
        option.bool(
            "89500",
            "Scattered Autumn Leaves",
            'Mode: [select] only\nShould the bot buy "Scattered Autumn Leaves" ?',
            false,
        ),
        option.bool(
            "89501",
            "Fallen Forest Log",
            'Mode: [select] only\nShould the bot buy "Fallen Forest Log" ?',
            false,
        ),
        option.bool("89502", "Forest Owl Guest", 'Mode: [select] only\nShould the bot buy "Forest Owl Guest" ?', false),
        option.bool(
            "89503",
            "Forest Owl Friend",
            'Mode: [select] only\nShould the bot buy "Forest Owl Friend" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AutumnMerge.select,
});

export default function main(): void {
    const script = new AutumnMerge();
    Core.bankingBlackList.push("Fallen Leaf", "Gold Flake", "Gnarled Wood");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
