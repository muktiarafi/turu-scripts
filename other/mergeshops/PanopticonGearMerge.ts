/*
name: Panopticon Gear Merge
description: This bot will farm the items belonging to the selected mode for the Panopticon Gear Merge [2439] in /trenchobserve
tags: panopticon, gear, merge, trenchobserve, teuthi, amp, rhizo, countenance, artillery, armament
*/
// Port of Scripts/Other/MergeShops/PanopticonGearMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();

export class PanopticonGearMerge {
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
                case "Panopticon Gear Wreckage":

                case "Panopticon Gear Linker":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9730);
                    //C:\The Depths are a Harsh Mistress (9730)
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("trenchobserve", "Sea Spirit", "Squishy Organic Thingy", 5, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        AOR.deepWater(true);
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("trenchobserve", 2439, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "85273",
            "Panopticon Teuthi & Rhizo",
            'Mode: [select] only\nShould the bot buy "Panopticon Teuthi & Rhizo" ?',
            false,
        ),
        option.bool(
            "85274",
            "Panopticon Rhizo & Teuthi",
            'Mode: [select] only\nShould the bot buy "Panopticon Rhizo & Teuthi" ?',
            false,
        ),
        option.bool(
            "85275",
            "Panopticon Rhizo Countenance",
            'Mode: [select] only\nShould the bot buy "Panopticon Rhizo Countenance" ?',
            false,
        ),
        option.bool(
            "85276",
            "Panopticon Teuthi Countenance",
            'Mode: [select] only\nShould the bot buy "Panopticon Teuthi Countenance" ?',
            false,
        ),
        option.bool(
            "85277",
            "Panopticon Rhizo Artillery",
            'Mode: [select] only\nShould the bot buy "Panopticon Rhizo Artillery" ?',
            false,
        ),
        option.bool(
            "85278",
            "Panopticon Teuthi Artillery",
            'Mode: [select] only\nShould the bot buy "Panopticon Teuthi Artillery" ?',
            false,
        ),
        option.bool(
            "85279",
            "Panopticon Rhizo Armament",
            'Mode: [select] only\nShould the bot buy "Panopticon Rhizo Armament" ?',
            false,
        ),
        option.bool(
            "85280",
            "Panopticon Teuthi Armament",
            'Mode: [select] only\nShould the bot buy "Panopticon Teuthi Armament" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: PanopticonGearMerge.select,
});

export default function main(): void {
    const script = new PanopticonGearMerge();
    Core.bankingBlackList.push("Panopticon Gear Wreckage", "Panopticon Gear Linker");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
