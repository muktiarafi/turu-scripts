/*
name: Diogons Merge
description: This bot will farm the items belonging to the selected mode for the Diogons Merge [2449] in /ectocave
tags: diogons, merge, ectocave, toxian, metal, strider, masked, panama, morph, radiation, vessel, radioactive, warning, synthesis, armblades
*/
// Port of Scripts/Other/MergeShops/DiogonsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class DiogonsMerge {
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
                case "Toxic Gem":
                    Core.farmingLogger(req.name, quant);
                    this.farmToxicGem(quant);
                    break;
                case "Gamma Toxic Gem":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9751);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Adv.buyItem("tercessuinotlim", 1951, "Doomatter", undefined, undefined, undefined, false);
                        Adv.buyItem("ectocave", 2449, "Toxian Metal", undefined, undefined, undefined, false);
                        this.farmToxicGem(5);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("ectocave", 2449, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    farmToxicGem(quant = 500): void {
        if (Core.checkInventory("Toxic Gem", quant)) {
            return;
        }

        Core.equipClass(ClassType.Solo);
        if (!Core.checkInventory("Toxian Gas Mask")) {
            Core.logger("Toxian Gas Mask is not in inventory. Farming it now.");
            Core.addDrop("Toxian Gas Mask");
            Core.ensureAccept(9748);
            Adv.buyItem("ectocave", 2449, "Toxian Metal", 3);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("therift", "Noxious Fumes", "Noxious Fumes", 7);
            Core.killMonster("shadowattack", "r2", "Left", "Toxic Fiend", "Toxic Fiend Blood", 3);
            Core.huntMonster("ectocave", "Sludge Beast", "Sludge Beast's Tentacle");
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("ectocave", "Ektorax", "Ektorax's Ectoplasm");
            Core.ensureComplete(9748);
        }
        Core.registerQuests(9750);
        while (!bot.shouldExit && !Core.checkInventory("Toxic Gem", quant)) {
            Core.huntMonster("extriki", "Extriki", "Extriki's Shard", undefined, { log: false });
            bot.wait.forPickup("Toxic Gem");
        }
        Core.cancelRegisteredQuests();
    }

    static readonly select = [
        option.bool("85281", "Toxian Metal", 'Mode: [select] only\nShould the bot buy "Toxian Metal" ?', false),
        option.bool("85957", "Toxian Strider", 'Mode: [select] only\nShould the bot buy "Toxian Strider" ?', false),
        option.bool(
            "85959",
            "Toxian Strider Hair",
            'Mode: [select] only\nShould the bot buy "Toxian Strider Hair" ?',
            false,
        ),
        option.bool(
            "85960",
            "Toxian Strider Locks",
            'Mode: [select] only\nShould the bot buy "Toxian Strider Locks" ?',
            false,
        ),
        option.bool(
            "85961",
            "Toxian Strider Masked Hair",
            'Mode: [select] only\nShould the bot buy "Toxian Strider Masked Hair" ?',
            false,
        ),
        option.bool(
            "85962",
            "Toxian Strider Masked Locks",
            'Mode: [select] only\nShould the bot buy "Toxian Strider Masked Locks" ?',
            false,
        ),
        option.bool(
            "85963",
            "Toxian Strider Hat",
            'Mode: [select] only\nShould the bot buy "Toxian Strider Hat" ?',
            false,
        ),
        option.bool(
            "85964",
            "Toxian Strider Panama",
            'Mode: [select] only\nShould the bot buy "Toxian Strider Panama" ?',
            false,
        ),
        option.bool(
            "85965",
            "Toxian Strider Morph",
            'Mode: [select] only\nShould the bot buy "Toxian Strider Morph" ?',
            false,
        ),
        option.bool(
            "85966",
            "Toxian Strider Visage",
            'Mode: [select] only\nShould the bot buy "Toxian Strider Visage" ?',
            false,
        ),
        option.bool(
            "85967",
            "Toxian Radiation Vessel",
            'Mode: [select] only\nShould the bot buy "Toxian Radiation Vessel" ?',
            false,
        ),
        option.bool(
            "85968",
            "Radioactive Warning",
            'Mode: [select] only\nShould the bot buy "Radioactive Warning" ?',
            false,
        ),
        option.bool(
            "85969",
            "Toxian Synthesis Sword",
            'Mode: [select] only\nShould the bot buy "Toxian Synthesis Sword" ?',
            false,
        ),
        option.bool(
            "85970",
            "Toxian Synthesis Swords",
            'Mode: [select] only\nShould the bot buy "Toxian Synthesis Swords" ?',
            false,
        ),
        option.bool(
            "85971",
            "Toxian Synthesis Armblades",
            'Mode: [select] only\nShould the bot buy "Toxian Synthesis Armblades" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DiogonsMerge.select,
});

export default function main(): void {
    const script = new DiogonsMerge();
    Core.bankingBlackList.push("Toxic Gem", "Gamma Toxic Gem");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
