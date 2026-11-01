/*
name: Magicians Merge
description: This bot will farm the items belonging to the selected mode for the Magicians Merge [2519] in /magician
tags: magicians, merge, magician, human, clock, oscillator, decay, erosion, nostalgia, face, countdown, scalpula, debris, scythe, creature, , wings, amp, tail, morph
*/
// Port of Scripts/Darkon/MergeShops/MagiciansMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class MagiciansMerge {
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
                case "Hours Minutes Seconds":

                case "Human Clock Face House Item":

                case "Creature 10 Tail":

                case "Creature 10 Half Wing":

                case "Creature 10 Horns":

                case "Creature 10 Horned Locks":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("magician", "Human Clock", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Chrono Bauble":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(10017, "magician", "Human Clock");
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("magician", 2519, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "90893",
            "Human Clock Oscillator",
            'Mode: [select] only\nShould the bot buy "Human Clock Oscillator" ?',
            false,
        ),
        option.bool(
            "90892",
            "Human Clock Decay",
            'Mode: [select] only\nShould the bot buy "Human Clock Decay" ?',
            false,
        ),
        option.bool(
            "90891",
            "Human Clock Erosion",
            'Mode: [select] only\nShould the bot buy "Human Clock Erosion" ?',
            false,
        ),
        option.bool(
            "90890",
            "Human Clock Nostalgia",
            'Mode: [select] only\nShould the bot buy "Human Clock Nostalgia" ?',
            false,
        ),
        option.bool("90889", "Human Clock", 'Mode: [select] only\nShould the bot buy "Human Clock" ?', false),
        option.bool("90887", "Human Clock Face", 'Mode: [select] only\nShould the bot buy "Human Clock Face" ?', false),
        option.bool(
            "90885",
            "Human Clock Countdown",
            'Mode: [select] only\nShould the bot buy "Human Clock Countdown" ?',
            false,
        ),
        option.bool(
            "85529",
            "Scalpula Debris Scythe",
            'Mode: [select] only\nShould the bot buy "Scalpula Debris Scythe" ?',
            false,
        ),
        option.bool(
            "85526",
            "Creature 10 Wings & Tail",
            'Mode: [select] only\nShould the bot buy "Creature 10 Wings & Tail" ?',
            false,
        ),
        option.bool(
            "85525",
            "Creature 10 Wings",
            'Mode: [select] only\nShould the bot buy "Creature 10 Wings" ?',
            false,
        ),
        option.bool("85521", "Creature 10 Mask", 'Mode: [select] only\nShould the bot buy "Creature 10 Mask" ?', false),
        option.bool(
            "85520",
            "Creature 10 Visage",
            'Mode: [select] only\nShould the bot buy "Creature 10 Visage" ?',
            false,
        ),
        option.bool(
            "85519",
            "Creature 10 Morph",
            'Mode: [select] only\nShould the bot buy "Creature 10 Morph" ?',
            false,
        ),
        option.bool("85516", "Creature 10", 'Mode: [select] only\nShould the bot buy "Creature 10" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MagiciansMerge.select,
});

export default function main(): void {
    const script = new MagiciansMerge();
    Core.bankingBlackList.push(
        "Hours Minutes Seconds",
        "Chrono Bauble",
        "Human Clock Face House Item",
        "Creature 10 Tail",
        "Creature 10 Half Wing",
        "Creature 10 Horns",
        "Creature 10 Horned Locks",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
