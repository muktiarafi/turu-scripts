/*
name: FirePlaneWarMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/FirePlaneWarMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class FirePlaneWarMerge {
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
                case "Elemental Embers":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8125, 8126);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.killMonster("fireplanewar", "r5", "Right", "*", "War Medal", 5, { log: false });
                        Core.killMonster("fireplanewar", "r5", "Right", "*", "Mega War Medal", 3, { log: false });
                        bot.wait.forPickup(req.id);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Burnt Cinders":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8131);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("fireplanewar", "ShadowClaw", "ShadowClaw Defeated", undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.id);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Seared Ashes":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("fireplanewar", "ShadowFlame Phedra", req.name, quant, { log: false });
                        bot.wait.forPickup(req.id);
                    }
                    break;
                case "ShadowFlame Flamberge":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.buyItem("fireplanewar", 2007, req.name, quant);
                        bot.wait.forPickup(req.id);
                    }
                    break;
                case "Refulgent Flamberge":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("fireplanewar", "Shadowflame Soldier", req.name, quant, { log: false });
                        bot.wait.forPickup(req.id);
                    }
                    break;
                case "ShadowFlame Great Harp":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.buyItem("fireplanewar", 2007, req.name, quant);
                        bot.wait.forPickup(req.id);
                    }
                    break;
                case "Vulcan Great Harp":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("fireplanewar", "Shadefire Onslaught", req.name, quant, { log: false });
                        bot.wait.forPickup(req.id);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("fireplanewar", 2006, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "60979",
            "Infernus Guardian",
            'Mode: [select] only\nShould the bot buy "Infernus Guardian" ?',
            false,
        ),
        option.bool(
            "60980",
            "Infernus Guardian's Helm",
            'Mode: [select] only\nShould the bot buy "Infernus Guardian\'s Helm" ?',
            false,
        ),
        option.bool(
            "60981",
            "Infernus Guardian's Wings",
            'Mode: [select] only\nShould the bot buy "Infernus Guardian\'s Wings" ?',
            false,
        ),
        option.bool(
            "60982",
            "Infernus Guardian's Mace",
            'Mode: [select] only\nShould the bot buy "Infernus Guardian\'s Mace" ?',
            false,
        ),
        option.bool(
            "61398",
            "Shadowflame Firebender",
            'Mode: [select] only\nShould the bot buy "Shadowflame Firebender" ?',
            false,
        ),
        option.bool(
            "61399",
            "ShadowFlame Firebender Morph",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Firebender Morph" ?',
            false,
        ),
        option.bool(
            "61400",
            "ShadowFlame Firebender Guard",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Firebender Guard" ?',
            false,
        ),
        option.bool("61401", "Shadow of Malgor", 'Mode: [select] only\nShould the bot buy "Shadow of Malgor" ?', false),
        option.bool(
            "61402",
            "ShadowFlame Firebender Tail",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Firebender Tail" ?',
            false,
        ),
        option.bool(
            "61403",
            "ShadowFlame Firebender Daggers",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Firebender Daggers" ?',
            false,
        ),
        option.bool(
            "61404",
            "ShadowFlame Firebender Claws",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Firebender Claws" ?',
            false,
        ),
        option.bool(
            "61405",
            "ShadowFlame Firebender Blade",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Firebender Blade" ?',
            false,
        ),
        option.bool(
            "61334",
            "Enchanted ShadowDrake's Lance",
            'Mode: [select] only\nShould the bot buy "Enchanted ShadowDrake\'s Lance" ?',
            false,
        ),
        option.bool(
            "61335",
            "Enchanted ShadowFlame Flamberge",
            'Mode: [select] only\nShould the bot buy "Enchanted ShadowFlame Flamberge" ?',
            false,
        ),
        option.bool(
            "61336",
            "Enchanted ShadowFlame Great Harp",
            'Mode: [select] only\nShould the bot buy "Enchanted ShadowFlame Great Harp" ?',
            false,
        ),
        option.bool(
            "61337",
            "Enchanted FireDrake's Lance",
            'Mode: [select] only\nShould the bot buy "Enchanted FireDrake\'s Lance" ?',
            false,
        ),
        option.bool(
            "61595",
            "Dual ShadowFlame Firebender Blades",
            'Mode: [select] only\nShould the bot buy "Dual ShadowFlame Firebender Blades" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FirePlaneWarMerge.select,
});

export default function main(): void {
    const script = new FirePlaneWarMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
