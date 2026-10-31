/*
name: Fell Beast Merge
description: This bot will farm the items belonging to the selected mode for the Fell Beast Merge [879] in /darkdungeon
tags: fell, beast, merge, darkdungeon, lumenomancer, righteous, deliverance, lumenomancers, gift, woe, undead, th, egg, pet, cockatrice, hatchling
*/
// Port of Scripts/Other/MergeShops/FellBeastMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { DarkDungeon } from "../../story/DarkDungeon";

const Adv = new CoreAdvanced();
const Dark = new DarkDungeon();

export class FellBeastMerge {
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
                case "Dungeon Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.killMonster("darkdungeon", "r9", "Left", "Cockatrice", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
            }
        };
        Dark.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("darkdungeon", 879, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("24111", "Lumenomancer", 'Mode: [select] only\nShould the bot buy "Lumenomancer" ?', false),
        option.bool(
            "24117",
            "Righteous Deliverance",
            'Mode: [select] only\nShould the bot buy "Righteous Deliverance" ?',
            false,
        ),
        option.bool(
            "24115",
            "Lumenomancer's Gift",
            'Mode: [select] only\nShould the bot buy "Lumenomancer\'s Gift" ?',
            false,
        ),
        option.bool(
            "24118",
            "Lumenomancer's Woe",
            'Mode: [select] only\nShould the bot buy "Lumenomancer\'s Woe" ?',
            false,
        ),
        option.bool(
            "24113",
            "Lumenomancer's Helm",
            'Mode: [select] only\nShould the bot buy "Lumenomancer\'s Helm" ?',
            false,
        ),
        option.bool(
            "24114",
            "Lumenomancer's Undead Visage",
            'Mode: [select] only\nShould the bot buy "Lumenomancer\'s Undead Visage" ?',
            false,
        ),
        option.bool(
            "24112",
            "Lumenomancer's Cape and Sword",
            'Mode: [select] only\nShould the bot buy "Lumenomancer\'s Cape and Sword" ?',
            false,
        ),
        option.bool("24142", "13th Egg Pet", 'Mode: [select] only\nShould the bot buy "13th Egg Pet" ?', false),
        option.bool(
            "24140",
            "Cockatrice Hatchling",
            'Mode: [select] only\nShould the bot buy "Cockatrice Hatchling" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FellBeastMerge.select,
});

export default function main(): void {
    const script = new FellBeastMerge();
    Core.bankingBlackList.push("Dungeon Token");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
