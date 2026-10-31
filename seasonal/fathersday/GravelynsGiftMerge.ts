/*
name: Gravelyns Gift Merge
description: This bot will farm the items belonging to the selected mode for the Gravelyns Gift Merge [2299] in /nursery
tags: gravelyns, gift, merge, nursery, doom, harried, legacy, furious, furred, shoulder, dark
*/
// Port of Scripts/Seasonal/FathersDay/GravelynsGiftMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { HoratioQuests } from "./HoratioQuests";

const Adv = new CoreAdvanced();
const HQ = new HoratioQuests();

export class GravelynsGiftMerge {
    // [Can Change] This should only be changed by the author.
    // If true, it will not stop the script if the default case triggers and the user chose to only get mats
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
                case "Doom Essence":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(6948);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("nursery", "Flesh Golem", "Treasure Found", 10, { isTemp: true, log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        HQ.horatio();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("nursery", 2299, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "76226",
            "Gravelyn's Doom Gift",
            'Mode: [select] only\nShould the bot buy "Gravelyn\'s Doom Gift" ?',
            false,
        ),
        option.bool(
            "76229",
            "Harried Doom Spikes",
            'Mode: [select] only\nShould the bot buy "Harried Doom Spikes" ?',
            false,
        ),
        option.bool(
            "76228",
            "Legacy of Doom Helm",
            'Mode: [select] only\nShould the bot buy "Legacy of Doom Helm" ?',
            false,
        ),
        option.bool(
            "76227",
            "Furious Legacy of Doom Helm",
            'Mode: [select] only\nShould the bot buy "Furious Legacy of Doom Helm" ?',
            false,
        ),
        option.bool(
            "76230",
            "Furred Shoulder Cape",
            'Mode: [select] only\nShould the bot buy "Furred Shoulder Cape" ?',
            false,
        ),
        option.bool(
            "76231",
            "Fur-ious Cape of Doom",
            'Mode: [select] only\nShould the bot buy "Fur-ious Cape of Doom" ?',
            false,
        ),
        option.bool(
            "76233",
            "Dark Legacy Doom Blade",
            'Mode: [select] only\nShould the bot buy "Dark Legacy Doom Blade" ?',
            false,
        ),
        option.bool(
            "76234",
            "Furious Legacy Doom Blade",
            'Mode: [select] only\nShould the bot buy "Furious Legacy Doom Blade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GravelynsGiftMerge.select,
});

export default function main(): void {
    const script = new GravelynsGiftMerge();
    Core.bankingBlackList.push("Doom Essence");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
