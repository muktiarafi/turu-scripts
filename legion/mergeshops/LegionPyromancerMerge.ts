/*
name: LegionPyromancerMerge
description: null
tags: null
*/
// Port of Scripts/Legion/MergeShops/LegionPyromancerMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";
import { DarknessShard } from "../../other/materials/DarknessShard";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();
const DShard = new DarknessShard();

export class LegionPyromancerMerge {
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
                case "Crystallized Blood":
                    Core.farmingLogger(req.name, quant);
                    if (!bot.quests.isAvailable(793)) {
                        return;
                    }
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(6976);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("underworld", "Bloodfiend", "Fiend Blood", 10);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Legion Token":
                    Core.farmingLogger(req.name, quant);
                    Legion.farmLegionToken(quant);
                    break;
                case "Flaming Skull":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("underworld", "Frozen Pyromancer", req.name, quant, { isTemp: false });
                    break;
                case "Darkness Shard":
                    Core.farmingLogger(req.name, quant);
                    DShard.getShard(quant);
                    if (!Core.checkInventory(req.name, quant)) {
                        Core.logger("Not enough Darkness Shards (Daily) try again tomarrow.", undefined, {
                            stopBot: true,
                        });
                    }
                    break;
                case "Flame-Forged Metal":
                    if (!bot.quests.isAvailable(793)) {
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(6975);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("underworld", "Frozen Pyromancer", "Stolen Flame");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Soul-Forged Metal":
                    if (!bot.quests.isAvailable(793)) {
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(6977);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("underworld", "Frozen Pyromancer", "Pyromancer Soul Shard");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("underworld", 1734, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "48692",
            "Legion Pyromancer",
            'Mode: [select] only\nShould the bot buy "Legion Pyromancer" ?',
            false,
        ),
        option.bool("48693", "Darkflame Hair", 'Mode: [select] only\nShould the bot buy "Darkflame Hair" ?', false),
        option.bool("48694", "Darkflame Morph", 'Mode: [select] only\nShould the bot buy "Darkflame Morph" ?', false),
        option.bool(
            "48696",
            "Darkflame Denizen Morph",
            'Mode: [select] only\nShould the bot buy "Darkflame Denizen Morph" ?',
            false,
        ),
        option.bool(
            "48695",
            "Darkflame Horned Morph",
            'Mode: [select] only\nShould the bot buy "Darkflame Horned Morph" ?',
            false,
        ),
        option.bool(
            "48697",
            "Darkflame Ponytail",
            'Mode: [select] only\nShould the bot buy "Darkflame Ponytail" ?',
            false,
        ),
        option.bool(
            "48698",
            "Darkflame Morph Locks",
            'Mode: [select] only\nShould the bot buy "Darkflame Morph Locks" ?',
            false,
        ),
        option.bool(
            "48700",
            "Infernal Legion Athame",
            'Mode: [select] only\nShould the bot buy "Infernal Legion Athame" ?',
            false,
        ),
        option.bool(
            "48701",
            "Reversed Legion Athame",
            'Mode: [select] only\nShould the bot buy "Reversed Legion Athame" ?',
            false,
        ),
        option.bool(
            "48702",
            "Dark Flame of Fury",
            'Mode: [select] only\nShould the bot buy "Dark Flame of Fury" ?',
            false,
        ),
        option.bool(
            "48703",
            "Dark Flames of Fury",
            'Mode: [select] only\nShould the bot buy "Dark Flames of Fury" ?',
            false,
        ),
        option.bool(
            "48704",
            "Legion Invocation Tome",
            'Mode: [select] only\nShould the bot buy "Legion Invocation Tome" ?',
            false,
        ),
        option.bool(
            "48705",
            "Inferno's Legion Staff",
            'Mode: [select] only\nShould the bot buy "Inferno\'s Legion Staff" ?',
            false,
        ),
        option.bool(
            "48699",
            "Infernal Legion Minion",
            'Mode: [select] only\nShould the bot buy "Infernal Legion Minion" ?',
            false,
        ),
        option.bool(
            "48706",
            "Legion Moglin Minion",
            'Mode: [select] only\nShould the bot buy "Legion Moglin Minion" ?',
            false,
        ),
        option.bool(
            "48707",
            "Legion Moglin Minion Battlepet",
            'Mode: [select] only\nShould the bot buy "Legion Moglin Minion Battlepet" ?',
            false,
        ),
        option.bool("49143", "Chanky Pet", 'Mode: [select] only\nShould the bot buy "Chanky Pet" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LegionPyromancerMerge.select,
});

export default function main(): void {
    const script = new LegionPyromancerMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
