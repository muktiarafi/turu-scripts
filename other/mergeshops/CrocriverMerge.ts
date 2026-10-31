/*
name: Crocriver Merge
description: This bot will farm the items belonging to the selected mode for the Crocriver Merge [2387] in /crocriver
tags: crocriver, merge, crocriver, sphinx, sentinel, commander, desher, desert, black, moon, criosphinx, sun, noble, anubian, overseer, resting, skyfall, spear, tail, keys, sandsea, life, oasis, storm, armblade, armblades
*/
// Port of Scripts/Other/MergeShops/CrocriverMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CrocriverMerge {
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
                case "Sobekemsaph's Hieroglyph":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9538);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreampalace", "Golmoth", "Hieroglyph Ruby", undefined, { log: false });
                        Core.huntMonster("dreampalace", "Flaming Harpy", "Flame Glyph", 6, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Sobekemsaph's Scale":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9539);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("crocriver", "Sobekemsaph", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Sphinx Sentinel Helm":

                case "Sheathed Black Moon Blades":

                case "Sphinx Sentinel Cape":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("crocriver", "Sobekemsaph", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("crocriver", 2387, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("83065", "Sphinx Sentinel", 'Mode: [select] only\nShould the bot buy "Sphinx Sentinel" ?', false),
        option.bool(
            "83066",
            "Sphinx Commander Helm",
            'Mode: [select] only\nShould the bot buy "Sphinx Commander Helm" ?',
            false,
        ),
        option.bool(
            "83067",
            "Sphinx Sentinel Desher Helm",
            'Mode: [select] only\nShould the bot buy "Sphinx Sentinel Desher Helm" ?',
            false,
        ),
        option.bool(
            "83069",
            "Sphinx Desher Helm and Hair",
            'Mode: [select] only\nShould the bot buy "Sphinx Desher Helm and Hair" ?',
            false,
        ),
        option.bool(
            "83070",
            "Sphinx Sentinel Helm and Hair",
            'Mode: [select] only\nShould the bot buy "Sphinx Sentinel Helm and Hair" ?',
            false,
        ),
        option.bool(
            "83073",
            "Sphinx Sentinel Cape and Blades",
            'Mode: [select] only\nShould the bot buy "Sphinx Sentinel Cape and Blades" ?',
            false,
        ),
        option.bool(
            "83074",
            "Desert Black Moon Blade",
            'Mode: [select] only\nShould the bot buy "Desert Black Moon Blade" ?',
            false,
        ),
        option.bool(
            "83075",
            "Desert Black Moon Blades",
            'Mode: [select] only\nShould the bot buy "Desert Black Moon Blades" ?',
            false,
        ),
        option.bool(
            "83076",
            "Criosphinx Sun Sword",
            'Mode: [select] only\nShould the bot buy "Criosphinx Sun Sword" ?',
            false,
        ),
        option.bool(
            "83077",
            "Criosphinx Sun Swords",
            'Mode: [select] only\nShould the bot buy "Criosphinx Sun Swords" ?',
            false,
        ),
        option.bool(
            "83101",
            "Noble Anubian Overseer",
            'Mode: [select] only\nShould the bot buy "Noble Anubian Overseer" ?',
            false,
        ),
        option.bool(
            "83102",
            "Noble Anubian Overseer Helm",
            'Mode: [select] only\nShould the bot buy "Noble Anubian Overseer Helm" ?',
            false,
        ),
        option.bool(
            "83104",
            "Resting Anubian Skyfall Spear",
            'Mode: [select] only\nShould the bot buy "Resting Anubian Skyfall Spear" ?',
            false,
        ),
        option.bool(
            "83105",
            "Noble Anubian Tail and Keys",
            'Mode: [select] only\nShould the bot buy "Noble Anubian Tail and Keys" ?',
            false,
        ),
        option.bool(
            "83106",
            "Noble Anubian Tail",
            'Mode: [select] only\nShould the bot buy "Noble Anubian Tail" ?',
            false,
        ),
        option.bool(
            "83107",
            "Sandsea Keys of Life",
            'Mode: [select] only\nShould the bot buy "Sandsea Keys of Life" ?',
            false,
        ),
        option.bool(
            "83108",
            "Oasis Storm Armblade",
            'Mode: [select] only\nShould the bot buy "Oasis Storm Armblade" ?',
            false,
        ),
        option.bool(
            "83109",
            "Oasis Storm Armblades",
            'Mode: [select] only\nShould the bot buy "Oasis Storm Armblades" ?',
            false,
        ),
        option.bool(
            "83110",
            "Anubian Skyfall Spear",
            'Mode: [select] only\nShould the bot buy "Anubian Skyfall Spear" ?',
            false,
        ),
        option.bool(
            "83621",
            "Pharaoh of Storms",
            'Mode: [select] only\nShould the bot buy "Pharaoh of Storms" ?',
            false,
        ),
        option.bool("83622", "Sandstorm Wings", 'Mode: [select] only\nShould the bot buy "Sandstorm Wings" ?', false),
        option.bool(
            "83623",
            "Sandstorm Sceptre",
            'Mode: [select] only\nShould the bot buy "Sandstorm Sceptre" ?',
            false,
        ),
        option.bool(
            "83624",
            "Enchanted Pharaoh of Storms",
            'Mode: [select] only\nShould the bot buy "Enchanted Pharaoh of Storms" ?',
            false,
        ),
        option.bool(
            "83625",
            "Pharaoh Djeba Morph",
            'Mode: [select] only\nShould the bot buy "Pharaoh Djeba Morph" ?',
            false,
        ),
        option.bool(
            "83626",
            "Enchanted Pharaoh Djeba Morph",
            'Mode: [select] only\nShould the bot buy "Enchanted Pharaoh Djeba Morph" ?',
            false,
        ),
        option.bool(
            "83627",
            "Veiled Pharaoh Tebtunis Visage",
            'Mode: [select] only\nShould the bot buy "Veiled Pharaoh Tebtunis Visage" ?',
            false,
        ),
        option.bool(
            "83628",
            "Pharaoh Tebtunis Visage",
            'Mode: [select] only\nShould the bot buy "Pharaoh Tebtunis Visage" ?',
            false,
        ),
        option.bool(
            "83629",
            "Pharaoh Tebtunis Veiled Ponytail",
            'Mode: [select] only\nShould the bot buy "Pharaoh Tebtunis Veiled Ponytail" ?',
            false,
        ),
        option.bool(
            "83630",
            "Pharaoh Tebtunis Ponytail",
            'Mode: [select] only\nShould the bot buy "Pharaoh Tebtunis Ponytail" ?',
            false,
        ),
        option.bool(
            "83631",
            "Pharaoh Tebtunis Veiled Locks",
            'Mode: [select] only\nShould the bot buy "Pharaoh Tebtunis Veiled Locks" ?',
            false,
        ),
        option.bool(
            "83632",
            "Pharaoh Tebtunis Locks",
            'Mode: [select] only\nShould the bot buy "Pharaoh Tebtunis Locks" ?',
            false,
        ),
        option.bool(
            "83633",
            "Enchanted Sandstorm Wings",
            'Mode: [select] only\nShould the bot buy "Enchanted Sandstorm Wings" ?',
            false,
        ),
        option.bool(
            "83634",
            "Enchanted Sandstorm Sceptre",
            'Mode: [select] only\nShould the bot buy "Enchanted Sandstorm Sceptre" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CrocriverMerge.select,
});

export default function main(): void {
    const script = new CrocriverMerge();
    Core.bankingBlackList.push(
        "Sobekemsaph's Hieroglyph",
        "Sobekemsaph's Scale",
        "Sphinx Sentinel Helm",
        "Sheathed Black Moon Blades",
        "Sphinx Sentinel Cape",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
