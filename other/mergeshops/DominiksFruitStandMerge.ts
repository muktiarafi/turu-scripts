/*
name: Dominiks Fruit Stand Merge
description: This bot will farm the items belonging to the selected mode for the Dominiks Fruit Stand Merge [2557] in /extinction
tags: dominiks, fruit, stand, merge, extinction, astro, seer, flame, morph, stellar, quasar, interstellar, riftbreaker, cosmic, traveler, chibi, fracture, companion, nebula, riftblade, singularity, guest
*/
// Port of Scripts/Other/MergeShops/DominiksFruitStandMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Extinction } from "../../story/Extinction";

const Adv = new CoreAdvanced();

export class DominiksFruitStandMerge {
    private get extinction(): Extinction {
        return new Extinction();
    }

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
                case "Lime":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, req.quantity)) {
                        Core.ensureAccept(10585);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("Ectocave", "Ektorax", "Regurgitated Key");
                        Core.equipClass(ClassType.Farm);
                        Core.killMonster("ectocave", "r1", "Left", "*", "Ecto Slime", 50);
                        Core.ensureComplete(10585);
                    }
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Lemon":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(
                            10054,
                            ["extinction", "Lard", ClassType.Farm],
                            ["extinction", "Gelatinous Slime", ClassType.Farm],
                            ["extinction", "SN.O.W. Challenge", ClassType.Solo],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        this.extinction.storyLine();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("extinction", 2557, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("91637", "Astro Seer", 'Mode: [select] only\nShould the bot buy "Astro Seer" ?', false),
        option.bool(
            "91638",
            "Astro Seer Flame Morph",
            'Mode: [select] only\nShould the bot buy "Astro Seer Flame Morph" ?',
            false,
        ),
        option.bool(
            "91639",
            "Astro Seer Visage",
            'Mode: [select] only\nShould the bot buy "Astro Seer Visage" ?',
            false,
        ),
        option.bool("91640", "Astro Seer Morph", 'Mode: [select] only\nShould the bot buy "Astro Seer Morph" ?', false),
        option.bool(
            "91641",
            "Astro Seer Flame Visage",
            'Mode: [select] only\nShould the bot buy "Astro Seer Flame Visage" ?',
            false,
        ),
        option.bool("91642", "Stellar Quasar", 'Mode: [select] only\nShould the bot buy "Stellar Quasar" ?', false),
        option.bool(
            "98965",
            "Interstellar Riftbreaker",
            'Mode: [select] only\nShould the bot buy "Interstellar Riftbreaker" ?',
            false,
        ),
        option.bool(
            "98966",
            "Interstellar Riftbreaker Hair",
            'Mode: [select] only\nShould the bot buy "Interstellar Riftbreaker Hair" ?',
            false,
        ),
        option.bool(
            "98967",
            "Interstellar Riftbreaker Locks",
            'Mode: [select] only\nShould the bot buy "Interstellar Riftbreaker Locks" ?',
            false,
        ),
        option.bool(
            "98968",
            "Interstellar Riftbreaker Morph",
            'Mode: [select] only\nShould the bot buy "Interstellar Riftbreaker Morph" ?',
            false,
        ),
        option.bool(
            "98969",
            "Interstellar Riftbreaker Visage",
            'Mode: [select] only\nShould the bot buy "Interstellar Riftbreaker Visage" ?',
            false,
        ),
        option.bool(
            "98970",
            "Cosmic Riftbreaker Morph",
            'Mode: [select] only\nShould the bot buy "Cosmic Riftbreaker Morph" ?',
            false,
        ),
        option.bool(
            "98971",
            "Cosmic Riftbreaker Visage",
            'Mode: [select] only\nShould the bot buy "Cosmic Riftbreaker Visage" ?',
            false,
        ),
        option.bool(
            "98975",
            "Interstellar Traveler Chibi",
            'Mode: [select] only\nShould the bot buy "Interstellar Traveler Chibi" ?',
            false,
        ),
        option.bool(
            "98976",
            "Astro Cosmic Fracture",
            'Mode: [select] only\nShould the bot buy "Astro Cosmic Fracture" ?',
            false,
        ),
        option.bool(
            "98977",
            "Interstellar Traveler Chibi Companion",
            'Mode: [select] only\nShould the bot buy "Interstellar Traveler Chibi Companion" ?',
            false,
        ),
        option.bool(
            "98978",
            "Astro Nebula Riftblade",
            'Mode: [select] only\nShould the bot buy "Astro Nebula Riftblade" ?',
            false,
        ),
        option.bool(
            "98980",
            "Astro Singularity Riftblade",
            'Mode: [select] only\nShould the bot buy "Astro Singularity Riftblade" ?',
            false,
        ),
        option.bool(
            "98988",
            "Interstellar Traveler Chibi Guest",
            'Mode: [select] only\nShould the bot buy "Interstellar Traveler Chibi Guest" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DominiksFruitStandMerge.select,
});

export default function main(): void {
    const script = new DominiksFruitStandMerge();
    Core.bankingBlackList.push("Lemon", "Lime");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
