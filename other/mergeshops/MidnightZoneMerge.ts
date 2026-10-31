/*
name: Midnight Zone Merge
description: This bot will farm the items belonging to the selected mode for the Midnight Zone Merge [2302] in /midnightzone
tags: midnight, zone, merge, midnightzone, elven, heritage, guardian, morph, dark, forest, shawl, silver, edged, lamenter, lamenters, ranger, rustic, quiver, immortal, yew, bow
*/
// Port of Scripts/Other/MergeShops/MidnightZoneMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();

export class MidnightZoneMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    protectRequiredItems(): void {
        const items = ["Undine Base Scrip", "Water Elf Pearl"];

        for (const item of items) {
            if (!Core.bankingBlackList.includes(item)) {
                Core.bankingBlackList.push(item);
            }
        }
    }

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
                case "Undine Base Scrip":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("sunlightzone", "Infernal Illusion", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Water Elf Pearl":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9302);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("midnightzone", "Sparagmos", "Memory Card", undefined, { log: false });
                        Core.huntMonster("midnightzone", "Shadow Viscera", "Fleshy Shadows", 8, { log: false });
                        Core.huntMonster("midnightzone", "Venerated Wraith", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        this.protectRequiredItems();
        AOR.midnightZone();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("midnightzone", 2302, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "77487",
            "Elven Heritage Guardian",
            'Mode: [select] only\nShould the bot buy "Elven Heritage Guardian" ?',
            false,
        ),
        option.bool(
            "77488",
            "Elven Heritage Helm",
            'Mode: [select] only\nShould the bot buy "Elven Heritage Helm" ?',
            false,
        ),
        option.bool(
            "77489",
            "Elven Guardian Morph",
            'Mode: [select] only\nShould the bot buy "Elven Guardian Morph" ?',
            false,
        ),
        option.bool(
            "77490",
            "Dark Forest Shawl",
            'Mode: [select] only\nShould the bot buy "Dark Forest Shawl" ?',
            false,
        ),
        option.bool(
            "77491",
            "Silver Edged Lamenter",
            'Mode: [select] only\nShould the bot buy "Silver Edged Lamenter" ?',
            false,
        ),
        option.bool(
            "77492",
            "Silver Edged Lamenters",
            'Mode: [select] only\nShould the bot buy "Silver Edged Lamenters" ?',
            false,
        ),
        option.bool(
            "77493",
            "Elven Heritage Ranger",
            'Mode: [select] only\nShould the bot buy "Elven Heritage Ranger" ?',
            false,
        ),
        option.bool(
            "77494",
            "Elven Heritage Hood",
            'Mode: [select] only\nShould the bot buy "Elven Heritage Hood" ?',
            false,
        ),
        option.bool(
            "77495",
            "Elven Ranger Morph",
            'Mode: [select] only\nShould the bot buy "Elven Ranger Morph" ?',
            false,
        ),
        option.bool(
            "77496",
            "Rustic Elven Quiver",
            'Mode: [select] only\nShould the bot buy "Rustic Elven Quiver" ?',
            false,
        ),
        option.bool("77497", "Immortal Yew Bow", 'Mode: [select] only\nShould the bot buy "Immortal Yew Bow" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MidnightZoneMerge.select,
});

export default function main(): void {
    const script = new MidnightZoneMerge();
    script.protectRequiredItems();
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
