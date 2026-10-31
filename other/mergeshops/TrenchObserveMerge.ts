/*
name: Trench Observe Merge
description: This bot will farm the items belonging to the selected mode for the Trench Observe Merge [2316] in /trenchobserve
tags: trench, observe, merge, trenchobserve, deepwater, drow, top, knot, horns, corona, bioluminescent, trident, sea, streams
*/
// Port of Scripts/Other/MergeShops/TrenchObserveMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { AbyssalZoneMerge } from "./AbyssalZoneMerge";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();
const AZM = new AbyssalZoneMerge();

export class TrenchObserveMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    protectRequiredItems(): void {
        const items = [
            "Undine Base Scrip",
            "Dark Elf Pearl",
            "Ashray Elf Warden",
            "Ashray Elf Top Knot",
            "Ashray Elf Locks",
            "Ashray Top Knot and Horns",
            "Ashray Locks and Horns",
            "Coastal Corona",
            "Golden Ashray Trident",
            "Dancer's Sea Streams",
        ];

        for (const item of items) {
            if (!Core.bankingBlackList.includes(item)) {
                Core.bankingBlackList.push(item);
            }
        }
    }

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
                case "Undine Base Scrip":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("sunlightzone", "Infernal Illusion", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Dark Elf Pearl":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9339);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("trenchobserve", "Lady Noelle", "Noelle's Brooch", undefined, { log: false });
                        Core.huntMonster("trenchobserve", "Sea Spirit", "Green Sea Jelly", 2, { log: false });
                        Core.huntMonster("trenchobserve", "Necro Adipocere", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Ashray Elf Top Knot":

                case "Ashray Elf Warden":

                case "Ashray Elf Locks":

                case "Ashray Top Knot and Horns":

                case "Ashray Locks and Horns":

                case "Coastal Corona":

                case "Golden Ashray Trident":

                case "Dancer's Sea Streams":
                    AZM.buyAllMerge(req.name);
                    break;
            }
        };
        this.protectRequiredItems();
        AOR.deepWater();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("trenchobserve", 2316, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("79050", "DeepWater Drow", 'Mode: [select] only\nShould the bot buy "DeepWater Drow" ?', false),
        option.bool(
            "79051",
            "DeepWater Top Knot",
            'Mode: [select] only\nShould the bot buy "DeepWater Top Knot" ?',
            false,
        ),
        option.bool("79052", "DeepWater Locks", 'Mode: [select] only\nShould the bot buy "DeepWater Locks" ?', false),
        option.bool(
            "79053",
            "DeepWater Top Knot and Horns",
            'Mode: [select] only\nShould the bot buy "DeepWater Top Knot and Horns" ?',
            false,
        ),
        option.bool(
            "79054",
            "DeepWater Locks and Horns",
            'Mode: [select] only\nShould the bot buy "DeepWater Locks and Horns" ?',
            false,
        ),
        option.bool("79055", "DeepWater Corona", 'Mode: [select] only\nShould the bot buy "DeepWater Corona" ?', false),
        option.bool(
            "79056",
            "Bioluminescent Trident",
            'Mode: [select] only\nShould the bot buy "Bioluminescent Trident" ?',
            false,
        ),
        option.bool(
            "79057",
            "DeepWater Sea Streams",
            'Mode: [select] only\nShould the bot buy "DeepWater Sea Streams" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TrenchObserveMerge.select,
});

export default function main(): void {
    const script = new TrenchObserveMerge();
    script.protectRequiredItems();
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
