/*
name: Fire War Merge
description: This bot will farm the items belonging to the selected mode for the Fire War Merge [1587] in /firewar
tags: fire, war, merge, firewar, ignited, flame, guardian, guardians, wrap, runed, lance, , shield, accoutrements, dragonslayer, twilly, bank
*/
// Port of Scripts/Other/MergeShops/FireWarMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { DragonFableOrigins } from "../../story/DragonFableOrigins";

const Adv = new CoreAdvanced();
const DFO = new DragonFableOrigins();

export class FireWarMerge {
    // [Can Change] This should only be changed by the author.
    //If true, it will not stop the script if the default case triggers and the user chose to only get mats
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
                case "Flame Guardian":

                case "Flame Guardian Helm":

                case "Flame Guardian's Wrap":

                case "Flame Guardian's Blade":

                case "Flame Guardian's Lance":

                case "Flame Guardian's Blade + Shield":
                    Core.farmingLogger(req.name, quant);
                    Adv.buyItem("firewar", 1586, req.name);
                    break;
                case "Dragon Flame":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(6300);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("firewar", "Fire Dragon", "Fire Dragon Slain", 3);
                        Core.killMonster("firewar", "r8", "Left", "Inferno Dragon", "Inferno Dragon Slain", 2);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Dragon Eye":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("firewar", "Uriax", "Dragon Eye", quant, { isTemp: false, log: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Flame Guardian's Accoutrements":
                    Core.farmingLogger(req.name, quant);
                    if (Core.isMember) {
                        Adv.buyItem("firewar", 1586, "Flame Guardian's Accoutrements");
                    } else {
                        Core.logger("Membership is required.");
                    }
                    break;
            }
        };
        DFO.greatFireWar();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("firewar", 1587, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "43617",
            "Ignited Flame Guardian",
            'Mode: [select] only\nShould the bot buy "Ignited Flame Guardian" ?',
            false,
        ),
        option.bool(
            "43618",
            "Ignited Guardian's Helm",
            'Mode: [select] only\nShould the bot buy "Ignited Guardian\'s Helm" ?',
            false,
        ),
        option.bool(
            "43644",
            "Ignited Guardian's Wrap",
            'Mode: [select] only\nShould the bot buy "Ignited Guardian\'s Wrap" ?',
            false,
        ),
        option.bool(
            "43619",
            "Ignited Guardian's Runed Wrap",
            'Mode: [select] only\nShould the bot buy "Ignited Guardian\'s Runed Wrap" ?',
            false,
        ),
        option.bool(
            "43647",
            "Ignited Guardian's Rune",
            'Mode: [select] only\nShould the bot buy "Ignited Guardian\'s Rune" ?',
            false,
        ),
        option.bool(
            "43620",
            "Ignited Guardian's Blade",
            'Mode: [select] only\nShould the bot buy "Ignited Guardian\'s Blade" ?',
            false,
        ),
        option.bool(
            "43621",
            "Ignited Guardian Lance",
            'Mode: [select] only\nShould the bot buy "Ignited Guardian Lance" ?',
            false,
        ),
        option.bool(
            "43623",
            "Ignited Guardian's Blade + Shield",
            'Mode: [select] only\nShould the bot buy "Ignited Guardian\'s Blade + Shield" ?',
            false,
        ),
        option.bool(
            "43643",
            "Ignited Guardian's Accoutrements",
            'Mode: [select] only\nShould the bot buy "Ignited Guardian\'s Accoutrements" ?',
            false,
        ),
        option.bool(
            "43649",
            "DragonSlayer Twilly Bank",
            'Mode: [select] only\nShould the bot buy "DragonSlayer Twilly Bank" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FireWarMerge.select,
});

export default function main(): void {
    const script = new FireWarMerge();
    Core.bankingBlackList.push(
        "Flame Guardian",
        "Dragon Flame",
        "Dragon Eye",
        "Flame Guardian Helm",
        "Flame Guardian's Wrap",
        "Flame Guardian's Blade",
        "Flame Guardian's Lance",
        "Flame Guardian's Blade + Shield",
        "Flame Guardian's Accoutrements",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
