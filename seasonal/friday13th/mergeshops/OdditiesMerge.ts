/*
name: Oddities Merge
description: This will get all or selected items on this merge shop.
tags: oddities-merge, friday the 13th, seasonal
*/
// Port of Scripts/Seasonal/Friday13th/MergeShops/OdditiesMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreFriday13th } from "../story/CoreFriday13th";

const Adv = new CoreAdvanced();
const F13 = new CoreFriday13th();

export class OdditiesMerge {
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
                case "Cursed Doll Tassel":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(8667);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.killMonster("oddities", "Enter", "Spawn", "*", "Chipped Wood", 7, { log: false });
                        Core.killMonster("oddities", "r6", "Left", "*", "Fuzz Tuff", 7, { log: false });
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("oddities", "Cursed Spirit", "Doll Eyes", 7, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Odd Coin":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8674);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("oddities", "r6", "Left", "*", "Frankensteined Teddy", undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Ectoplasmic Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8675);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("oddities", "Cursed Spirit", "Doll Eye", 5, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        F13.oddities();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("oddities", 2134, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "70165",
            "Mysterious Johnson",
            'Mode: [select] only\nShould the bot buy "Mysterious Johnson" ?',
            false,
        ),
        option.bool(
            "70166",
            "Mysterious Johnson's Hat",
            'Mode: [select] only\nShould the bot buy "Mysterious Johnson\'s Hat" ?',
            false,
        ),
        option.bool(
            "70167",
            "Mysterious Johnson's Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Mysterious Johnson\'s Hat + Locks" ?',
            false,
        ),
        option.bool("70168", "Magical Johnson", 'Mode: [select] only\nShould the bot buy "Magical Johnson" ?', false),
        option.bool(
            "70169",
            "Magical Johnson's Hat",
            'Mode: [select] only\nShould the bot buy "Magical Johnson\'s Hat" ?',
            false,
        ),
        option.bool(
            "70170",
            "Magical Johnson's Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Magical Johnson\'s Hat + Locks" ?',
            false,
        ),
        option.bool(
            "70131",
            "Neo Necromantress",
            'Mode: [select] only\nShould the bot buy "Neo Necromantress" ?',
            false,
        ),
        option.bool(
            "70132",
            "Neo Necromantress' Braid",
            'Mode: [select] only\nShould the bot buy "Neo Necromantress\' Braid" ?',
            false,
        ),
        option.bool(
            "70133",
            "Neo Necromantress' Fur Cloak",
            'Mode: [select] only\nShould the bot buy "Neo Necromantress\' Fur Cloak" ?',
            false,
        ),
        option.bool("70134", "Sally's Plushie", 'Mode: [select] only\nShould the bot buy "Sally\'s Plushie" ?', false),
        option.bool("70127", "Gothic Thief", 'Mode: [select] only\nShould the bot buy "Gothic Thief" ?', false),
        option.bool(
            "70128",
            "Gothic Thief's Hair",
            'Mode: [select] only\nShould the bot buy "Gothic Thief\'s Hair" ?',
            false,
        ),
        option.bool(
            "70129",
            "Gothic Thief's Locks",
            'Mode: [select] only\nShould the bot buy "Gothic Thief\'s Locks" ?',
            false,
        ),
        option.bool(
            "70130",
            "Gothic Thief's Wrap",
            'Mode: [select] only\nShould the bot buy "Gothic Thief\'s Wrap" ?',
            false,
        ),
        option.bool(
            "57579",
            "Dread Spirit Hunter",
            'Mode: [select] only\nShould the bot buy "Dread Spirit Hunter" ?',
            false,
        ),
        option.bool(
            "57580",
            "Spirit Hunter Hat",
            'Mode: [select] only\nShould the bot buy "Spirit Hunter Hat" ?',
            false,
        ),
        option.bool(
            "57581",
            "Spirit Hunter Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Spirit Hunter Hat + Locks" ?',
            false,
        ),
        option.bool(
            "57582",
            "Spirit Hunter Hood",
            'Mode: [select] only\nShould the bot buy "Spirit Hunter Hood" ?',
            false,
        ),
        option.bool(
            "57583",
            "Ancient Chains of Binding",
            'Mode: [select] only\nShould the bot buy "Ancient Chains of Binding" ?',
            false,
        ),
        option.bool("57584", "Slasher of Wrath", 'Mode: [select] only\nShould the bot buy "Slasher of Wrath" ?', false),
        option.bool(
            "57585",
            "Spirit Katana of Wrath",
            'Mode: [select] only\nShould the bot buy "Spirit Katana of Wrath" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: OdditiesMerge.select,
});

export default function main(): void {
    const script = new OdditiesMerge();
    Core.bankingBlackList.push("Cursed Doll Tassel", "Odd Coin", "Ectoplasmic Token");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
