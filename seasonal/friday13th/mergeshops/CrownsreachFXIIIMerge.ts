/*
name: Crownsreach FXIII Merge
description: This bot will farm the items belonging to the selected mode for the Crownsreach FXIII Merge [1354] in /crownsreachfxiii
tags: crownsreach, fxiii, merge, crownsreachfxiii, dandy, gilded, tentacle, wings, fascinator, dapper, cane
*/
// Port of Scripts/Seasonal/Friday13th/MergeShops/CrownsreachFXIIIMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CrownsreachFXIIIMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
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
                //#region Items not setup
                case "Amethyst Gem":
                    if (!Core.isMember) {
                        Core.logger("Map requires memmbership...");
                        return;
                    }
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, req.quantity)) {
                        Core.killMonster("crownsreachfxiii", "r4", "Left", "*");
                    }
                    bot.wait.forPickup(req.id);
                    break;
                //#endregion
            }
        };
        if (!Core.isMember) {
            Core.logger("Membership required for map, cannot do the merge");
            return;
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("crownsreachfxiii", 1354, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "38191",
            "Crownsreach Dandy",
            'Mode: [select] only\nShould the bot buy "Crownsreach Dandy" ?',
            false,
        ),
        option.bool(
            "38194",
            "Gilded Tentacle Wings",
            'Mode: [select] only\nShould the bot buy "Gilded Tentacle Wings" ?',
            false,
        ),
        option.bool(
            "38192",
            "Crownsreach Fascinator",
            'Mode: [select] only\nShould the bot buy "Crownsreach Fascinator" ?',
            false,
        ),
        option.bool(
            "38193",
            "Dapper Dandy Hair",
            'Mode: [select] only\nShould the bot buy "Dapper Dandy Hair" ?',
            false,
        ),
        option.bool(
            "38195",
            "Dapper Gilded Cane",
            'Mode: [select] only\nShould the bot buy "Dapper Gilded Cane" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CrownsreachFXIIIMerge.select,
});

export default function main(): void {
    const script = new CrownsreachFXIIIMerge();
    Core.bankingBlackList.push("Amethyst Gem");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
