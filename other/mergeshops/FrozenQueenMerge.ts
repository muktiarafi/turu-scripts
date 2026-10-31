/*
name: Frozen Queen Merge
description: This bot will farm the items belonging to the selected mode for the Frozen Queen Merge [2507] in /frozenqueen
tags: frozen, queen, merge, frozenqueen, northlands, lightcaster, cap, wings, dawning, paradise
*/
// Port of Scripts/Other/MergeShops/FrozenQueenMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class FrozenQueenMerge {
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
                case "Frozen SpiderSilk":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(10018, "frozenqueen", "Frostspinner Queen");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Ice Vapor":
                    Core.farmingLogger(req.name, quant);
                    Core.killMonster("lair", "Enter", "Spawn", "*", req.name, quant, { isTemp: req.temp, log: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("frozenqueen", 2507, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "90946",
            "Northlands LightCaster",
            'Mode: [select] only\nShould the bot buy "Northlands LightCaster" ?',
            false,
        ),
        option.bool(
            "90947",
            "Northlands LightCaster Hat",
            'Mode: [select] only\nShould the bot buy "Northlands LightCaster Hat" ?',
            false,
        ),
        option.bool(
            "90948",
            "Northlands LightCaster Cap",
            'Mode: [select] only\nShould the bot buy "Northlands LightCaster Cap" ?',
            false,
        ),
        option.bool(
            "90949",
            "Northlands LightCaster Wings",
            'Mode: [select] only\nShould the bot buy "Northlands LightCaster Wings" ?',
            false,
        ),
        option.bool(
            "90950",
            "Dawning Paradise Staff",
            'Mode: [select] only\nShould the bot buy "Dawning Paradise Staff" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FrozenQueenMerge.select,
});

export default function main(): void {
    const script = new FrozenQueenMerge();
    Core.bankingBlackList.push("Frozen SpiderSilk", "Ice Vapor");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
