/*
name: Hollowborn Merge
description: This bot will farm the items belonging to the selected mode for the Hollowborn Merge [1887] in /hbchallenge
tags: hollowborn, merge, hbchallenge, executioner, executioners, gas, , scarves, bite, cleavers, druid, druids, antlered, skull, runed, burning
*/
// Port of Scripts/Hollowborn/MergeShops/HollowbornMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class HollowbornMerge {
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
                case "Hollowborn Adept":

                case "Hollowborn Locks":

                case "Hollowborn Shag":

                case "Hollowborn Blades":

                case "Hollowborn Cleaver":

                case "Hollowborn Executioner's Axe":
                    Core.huntMonster("hbchallenge", "Shadow Rider", req.name, undefined, { isTemp: false });
                    break;
                case "Hollowborn Spirit":

                case "Hollowborn Spite":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7548);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster(
                            "hbchallenge",
                            "Enter",
                            "Spawn",
                            "Hollowborn Tamer",
                            "Hollowborn Tamer Defeated",
                            5,
                        );
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Druidic Soothsayer":

                case "Druidic Soothsayer's Antlered Skull":

                case "Druidic Soothsayer Hood":

                case "Druidic Soothsayer's Hooded Visage":

                case "Druidic Soothsayer's Runed Cape":

                case "Druidic Soothsayer's Cape":

                case "Druidic Soothsayer's Runes":

                case "Druidic Soothsayer's Burning Aura":

                case "Druidic Soothsayer's Burning Cape":

                case "Druidic Soothsayer Rune Gate":

                case "Druidic Soothsayer Staff":

                case "Druidic Soothsayer Spike":

                case "Druidic Soothsayer Spikes":

                case "Druidic Soothsayer Gauntlet":
                    Adv.buyItem(`dragonrune`, 689, req.name, quant);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("hbchallenge", 1887, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "54655",
            "Hollowborn Executioner",
            'Mode: [select] only\nShould the bot buy "Hollowborn Executioner" ?',
            false,
        ),
        option.bool(
            "54657",
            "Hollowborn Executioner's Hood",
            'Mode: [select] only\nShould the bot buy "Hollowborn Executioner\'s Hood" ?',
            false,
        ),
        option.bool(
            "54660",
            "Hollowborn Gas Mask + Locks",
            'Mode: [select] only\nShould the bot buy "Hollowborn Gas Mask + Locks" ?',
            false,
        ),
        option.bool(
            "54661",
            "Hollowborn Gas Mask",
            'Mode: [select] only\nShould the bot buy "Hollowborn Gas Mask" ?',
            false,
        ),
        option.bool(
            "54663",
            "Hollowborn Scarves",
            'Mode: [select] only\nShould the bot buy "Hollowborn Scarves" ?',
            false,
        ),
        option.bool(
            "54664",
            "Hollowborn Executioner's Bite",
            'Mode: [select] only\nShould the bot buy "Hollowborn Executioner\'s Bite" ?',
            false,
        ),
        option.bool(
            "54955",
            "Dual Hollowborn Cleavers",
            'Mode: [select] only\nShould the bot buy "Dual Hollowborn Cleavers" ?',
            false,
        ),
        option.bool(
            "54973",
            "Hollowborn Executioner's Bite + Axe",
            'Mode: [select] only\nShould the bot buy "Hollowborn Executioner\'s Bite + Axe" ?',
            false,
        ),
        option.bool("77195", "Hollowborn Druid", 'Mode: [select] only\nShould the bot buy "Hollowborn Druid" ?', false),
        option.bool(
            "77196",
            "Hollowborn Druid's Antlered Skull",
            'Mode: [select] only\nShould the bot buy "Hollowborn Druid\'s Antlered Skull" ?',
            false,
        ),
        option.bool(
            "77197",
            "Hollowborn Druid's Hooded Visage",
            'Mode: [select] only\nShould the bot buy "Hollowborn Druid\'s Hooded Visage" ?',
            false,
        ),
        option.bool(
            "77198",
            "Hollowborn Druid's Hood",
            'Mode: [select] only\nShould the bot buy "Hollowborn Druid\'s Hood" ?',
            false,
        ),
        option.bool(
            "77199",
            "Hollowborn Druid's Runed Cape",
            'Mode: [select] only\nShould the bot buy "Hollowborn Druid\'s Runed Cape" ?',
            false,
        ),
        option.bool(
            "77200",
            "Hollowborn Druid's Cape",
            'Mode: [select] only\nShould the bot buy "Hollowborn Druid\'s Cape" ?',
            false,
        ),
        option.bool(
            "77201",
            "Hollowborn Druid's Runes",
            'Mode: [select] only\nShould the bot buy "Hollowborn Druid\'s Runes" ?',
            false,
        ),
        option.bool(
            "77202",
            "Hollowborn Druid's Burning Cape",
            'Mode: [select] only\nShould the bot buy "Hollowborn Druid\'s Burning Cape" ?',
            false,
        ),
        option.bool(
            "77203",
            "Hollowborn Druid's Burning Aura",
            'Mode: [select] only\nShould the bot buy "Hollowborn Druid\'s Burning Aura" ?',
            false,
        ),
        option.bool(
            "77204",
            "Hollowborn Druid Rune Gate",
            'Mode: [select] only\nShould the bot buy "Hollowborn Druid Rune Gate" ?',
            false,
        ),
        option.bool(
            "77205",
            "Hollowborn Druid Staff",
            'Mode: [select] only\nShould the bot buy "Hollowborn Druid Staff" ?',
            false,
        ),
        option.bool(
            "77206",
            "Hollowborn Druid Spike",
            'Mode: [select] only\nShould the bot buy "Hollowborn Druid Spike" ?',
            false,
        ),
        option.bool(
            "77207",
            "Hollowborn Druid Spikes",
            'Mode: [select] only\nShould the bot buy "Hollowborn Druid Spikes" ?',
            false,
        ),
        option.bool(
            "77208",
            "Hollowborn Druid Gauntlet",
            'Mode: [select] only\nShould the bot buy "Hollowborn Druid Gauntlet" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HollowbornMerge.select,
});

export default function main(): void {
    const script = new HollowbornMerge();
    Core.bankingBlackList.push(
        "Hollowborn Adept",
        "Hollowborn Spirit",
        "Hollowborn Spite",
        "Hollowborn Locks",
        "Hollowborn Shag",
        "Hollowborn Blades",
        "Hollowborn Cleaver",
        "Hollowborn Executioner's Axe",
        "Druidic Soothsayer",
        "Druidic Soothsayer's Antlered Skull",
        "Druidic Soothsayer's Hooded Visage",
        "Druidic Soothsayer Hood",
        "Druidic Soothsayer's Runed Cape",
        "Druidic Soothsayer's Cape",
        "Druidic Soothsayer's Runes",
        "Druidic Soothsayer's Burning Cape",
        "Druidic Soothsayer's Burning Aura",
        "Druidic Soothsayer Rune Gate",
        "Druidic Soothsayer Staff",
        "Druidic Soothsayer Spike",
        "Druidic Soothsayer Spikes",
        "Druidic Soothsayer Gauntlet",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
