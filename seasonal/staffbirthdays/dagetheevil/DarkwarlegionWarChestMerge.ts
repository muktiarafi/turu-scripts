/*
name: (Darkwarlegion War) Chest Merge
description: This will complete the Darkwarlegion War Chest story and farm Dark Victory Seals.
tags: story, quest, dark, legion, war, chest, legion, dark-victory-seal, merge, staff, birthday
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/DarkwarlegionWarChestMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreLegion } from "../../../legion/CoreLegion";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();

export class DarkwarlegionWarChestMerge {
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
                case "Wretched Blade of the Void":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Adv.buyItem("darkwarnation", 2123, req.name);
                        bot.wait.forItemBuy();
                    }
                    break;
                case "Legion Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Legion.farmLegionToken(2500);
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        if (!Core.isSeasonalMapActive("darkwarlegion")) {
            return;
        }

        Adv.startBuyAllMerge("darkwarlegion", 2124, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "68773",
            "Wretched Blades of Evil",
            'Mode: [select] only\nShould the bot buy "Wretched Blades of Evil" ?',
            false,
        ),
        option.bool(
            "68769",
            "Wretched Blade of the Underworld",
            'Mode: [select] only\nShould the bot buy "Wretched Blade of the Underworld" ?',
            false,
        ),
        option.bool(
            "68770",
            "Wretched Blades of the Underworld",
            'Mode: [select] only\nShould the bot buy "Wretched Blades of the Underworld" ?',
            false,
        ),
        option.bool(
            "5278",
            "Dage's DeathKnight Helm",
            'Mode: [select] only\nShould the bot buy "Dage\'s DeathKnight Helm" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DarkwarlegionWarChestMerge.select,
});

export default function main(): void {
    const script = new DarkwarlegionWarChestMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
