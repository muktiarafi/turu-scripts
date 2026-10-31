/*
name: Neuling Welcome Gifts Merge
description: This bot will farm the items belonging to the selected mode for the Neuling Welcome Gifts Merge [2617] in /thelimacity
tags: neuling, welcome, gifts, merge, thelimacity, dwarfhold, explorer, morph, wool, cap, friend, explorers, bag, mountain, range, brandt, aegis, , melano, zircon, catalyst, stahlschwert
*/
// Port of Scripts/Other/MergeShops/NeulingWelcomeGiftsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();

export class NeulingWelcomeGiftsMerge {
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
                //#region Items not setup
                case "Yew Ember":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("thelimacity", "Maleno Match", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Steel Ingot":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(
                            Core.isMember ? 10358 : 10357,
                            ["thelimacity", "Maleno Elemental", ClassType.Solo],
                            ["thelimacity", "Maleno Match", ClassType.Farm],
                            ["thelimacity", "Flame of Maleno", ClassType.Solo],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
                //#endregion
            }
        };
        AOR.thelimaCity();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("thelimacity", 2617, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "92345",
            "Dwarfhold Explorer",
            'Mode: [select] only\nShould the bot buy "Dwarfhold Explorer" ?',
            false,
        ),
        option.bool(
            "92346",
            "Dwarfhold Explorer Morph",
            'Mode: [select] only\nShould the bot buy "Dwarfhold Explorer Morph" ?',
            false,
        ),
        option.bool(
            "92347",
            "Dwarfhold Explorer Visage",
            'Mode: [select] only\nShould the bot buy "Dwarfhold Explorer Visage" ?',
            false,
        ),
        option.bool(
            "92348",
            "Dwarfhold Explorer Hair",
            'Mode: [select] only\nShould the bot buy "Dwarfhold Explorer Hair" ?',
            false,
        ),
        option.bool(
            "92349",
            "Dwarfhold Explorer Locks",
            'Mode: [select] only\nShould the bot buy "Dwarfhold Explorer Locks" ?',
            false,
        ),
        option.bool(
            "92350",
            "Dwarfhold Wool Cap",
            'Mode: [select] only\nShould the bot buy "Dwarfhold Wool Cap" ?',
            false,
        ),
        option.bool(
            "92351",
            "Dwarfhold Wool Friend",
            'Mode: [select] only\nShould the bot buy "Dwarfhold Wool Friend" ?',
            false,
        ),
        option.bool("92352", "Explorer's Bag", 'Mode: [select] only\nShould the bot buy "Explorer\'s Bag" ?', false),
        option.bool(
            "92353",
            "Dwarfhold Mountain Range",
            'Mode: [select] only\nShould the bot buy "Dwarfhold Mountain Range" ?',
            false,
        ),
        option.bool("92354", "Neuling Brandt", 'Mode: [select] only\nShould the bot buy "Neuling Brandt" ?', false),
        option.bool(
            "92355",
            "Dual Neuling Brandt",
            'Mode: [select] only\nShould the bot buy "Dual Neuling Brandt" ?',
            false,
        ),
        option.bool("92358", "Neuling Aegis", 'Mode: [select] only\nShould the bot buy "Neuling Aegis" ?', false),
        option.bool(
            "92359",
            "Neuling Brandt + Aegis",
            'Mode: [select] only\nShould the bot buy "Neuling Brandt + Aegis" ?',
            false,
        ),
        option.bool(
            "93387",
            "Melano Zircon Catalyst",
            'Mode: [select] only\nShould the bot buy "Melano Zircon Catalyst" ?',
            false,
        ),
        option.bool(
            "92356",
            "Neuling Stahlschwert",
            'Mode: [select] only\nShould the bot buy "Neuling Stahlschwert" ?',
            false,
        ),
        option.bool(
            "92357",
            "Dual Neuling Stahlschwert",
            'Mode: [select] only\nShould the bot buy "Dual Neuling Stahlschwert" ?',
            false,
        ),
        option.bool(
            "92360",
            "Neuling Stahlschwert + Aegis",
            'Mode: [select] only\nShould the bot buy "Neuling Stahlschwert + Aegis" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NeulingWelcomeGiftsMerge.select,
});

export default function main(): void {
    const script = new NeulingWelcomeGiftsMerge();
    Core.bankingBlackList.push("Yew Ember", "Steel Ingot");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
