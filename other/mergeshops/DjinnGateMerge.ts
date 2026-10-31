/*
name: Djinn Gate Merge
description: This bot will farm the items belonging to the selected mode for the Djinn Gate Merge [1511] in /djinngate
tags: djinn, gate, merge, djinngate, jafar, valthos, zulars, circlet, sigil, aya, ayas, tails, agares, morph
*/
// Port of Scripts/Other/MergeShops/DjinnGateMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { DjinnGateStory } from "../../story/DjinnGate";

const Adv = new CoreAdvanced();
const DG = new DjinnGateStory();

export class DjinnGateMerge {
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
                case "Unseen Essence":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(6162);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("djinngate", "Harpy", "Potent Harpy Mana", 2, { isTemp: true, log: false });
                        Core.huntMonster("djinngate", "Lamia", "Potent Lamia Mana", 2, { isTemp: true, log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        DG.djinnGate();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("djinngate", 1511, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("42420", "Jafar Armor", 'Mode: [select] only\nShould the bot buy "Jafar Armor" ?', false),
        option.bool("42423", "Helm of Jafar", 'Mode: [select] only\nShould the bot buy "Helm of Jafar" ?', false),
        option.bool("42398", "Armor of Valthos", 'Mode: [select] only\nShould the bot buy "Armor of Valthos" ?', false),
        option.bool("42400", "Helm of Valthos", 'Mode: [select] only\nShould the bot buy "Helm of Valthos" ?', false),
        option.bool("42401", "Runes of Valthos", 'Mode: [select] only\nShould the bot buy "Runes of Valthos" ?', false),
        option.bool("42405", "Zular's Circlet", 'Mode: [select] only\nShould the bot buy "Zular\'s Circlet" ?', false),
        option.bool("42406", "Zular's Helm", 'Mode: [select] only\nShould the bot buy "Zular\'s Helm" ?', false),
        option.bool(
            "42404",
            "Zular's Sigil Cape",
            'Mode: [select] only\nShould the bot buy "Zular\'s Sigil Cape" ?',
            false,
        ),
        option.bool("42415", "Armor of Aya", 'Mode: [select] only\nShould the bot buy "Armor of Aya" ?', false),
        option.bool("42418", "Aya's Helm", 'Mode: [select] only\nShould the bot buy "Aya\'s Helm" ?', false),
        option.bool("42416", "Aya's Tails", 'Mode: [select] only\nShould the bot buy "Aya\'s Tails" ?', false),
        option.bool("42409", "Agares' Armor", 'Mode: [select] only\nShould the bot buy "Agares\' Armor" ?', false),
        option.bool("42412", "Agares Morph", 'Mode: [select] only\nShould the bot buy "Agares Morph" ?', false),
        option.bool("42413", "Agares' Helm", 'Mode: [select] only\nShould the bot buy "Agares\' Helm" ?', false),
        option.bool("42410", "Runes of Agares", 'Mode: [select] only\nShould the bot buy "Runes of Agares" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DjinnGateMerge.select,
});

export default function main(): void {
    const script = new DjinnGateMerge();
    Core.bankingBlackList.push("Unseen Essence");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
