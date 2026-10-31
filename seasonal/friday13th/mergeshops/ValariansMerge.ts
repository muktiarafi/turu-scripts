/*
name: Valarian's Merge
description: This will get all or selected items on this merge shop.
tags: valarians-merge, friday-the-13th, seasonal
*/
// Port of Scripts/Seasonal/Friday13th/MergeShops/ValariansMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreFriday13th } from "../story/CoreFriday13th";

const Adv = new CoreAdvanced();
const F13 = new CoreFriday13th();

export class ValariansMerge {
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
                case "Zenobia's Moglinberry Juice":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9056);
                    //9056 | Magic Dance
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("blackmaze", "Globlin", "Globlin Wings", 7);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("blackmaze", "Vi'eel Dreaddacovra", "White Scale");
                        Core.huntMonster("blackmaze", "Shadow Fernando", "Purple Flame");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        F13.blackMaze();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("blackmaze", 2218, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("75022", "The Harvester", 'Mode: [select] only\nShould the bot buy "The Harvester" ?', false),
        option.bool(
            "75023",
            "The Harvester's Drill Morph",
            'Mode: [select] only\nShould the bot buy "The Harvester\'s Drill Morph" ?',
            false,
        ),
        option.bool(
            "75024",
            "The Harvester's Grin",
            'Mode: [select] only\nShould the bot buy "The Harvester\'s Grin" ?',
            false,
        ),
        option.bool(
            "75026",
            "The Harvester's Grin + Locks",
            'Mode: [select] only\nShould the bot buy "The Harvester\'s Grin + Locks" ?',
            false,
        ),
        option.bool(
            "75034",
            "Zenobia's BerryStain Splash",
            'Mode: [select] only\nShould the bot buy "Zenobia\'s BerryStain Splash" ?',
            false,
        ),
        option.bool(
            "75035",
            "Zenobia's BerryStain Blade",
            'Mode: [select] only\nShould the bot buy "Zenobia\'s BerryStain Blade" ?',
            false,
        ),
        option.bool(
            "75036",
            "Zenobia's BerryStain Blades",
            'Mode: [select] only\nShould the bot buy "Zenobia\'s BerryStain Blades" ?',
            false,
        ),
        option.bool(
            "75037",
            "The Harvester's Katana",
            'Mode: [select] only\nShould the bot buy "The Harvester\'s Katana" ?',
            false,
        ),
        option.bool(
            "75038",
            "The Harvester's Katanas",
            'Mode: [select] only\nShould the bot buy "The Harvester\'s Katanas" ?',
            false,
        ),
        option.bool(
            "75041",
            "The Harvester's Gauntlet",
            'Mode: [select] only\nShould the bot buy "The Harvester\'s Gauntlet" ?',
            false,
        ),
        option.bool(
            "75042",
            "The Harvester's XL Gauntlets",
            'Mode: [select] only\nShould the bot buy "The Harvester\'s XL Gauntlets" ?',
            false,
        ),
        option.bool(
            "75155",
            "Goblin King's Formalwear",
            'Mode: [select] only\nShould the bot buy "Goblin King\'s Formalwear" ?',
            false,
        ),
        option.bool(
            "75156",
            "Goblin King's Mirrored Outfit",
            'Mode: [select] only\nShould the bot buy "Goblin King\'s Mirrored Outfit" ?',
            false,
        ),
        option.bool(
            "75159",
            "Goblin King's Spikes + Hat",
            'Mode: [select] only\nShould the bot buy "Goblin King\'s Spikes + Hat" ?',
            false,
        ),
        option.bool(
            "75160",
            "Goblin Queen's Locks + Hat",
            'Mode: [select] only\nShould the bot buy "Goblin Queen\'s Locks + Hat" ?',
            false,
        ),
        option.bool("75162", "Li'l Dewdo Pet", 'Mode: [select] only\nShould the bot buy "Li\'l Dewdo Pet" ?', false),
        option.bool(
            "75166",
            "Mystical Glass Orb Wand",
            'Mode: [select] only\nShould the bot buy "Mystical Glass Orb Wand" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ValariansMerge.select,
});

export default function main(): void {
    const script = new ValariansMerge();
    Core.bankingBlackList.push("Zenobia's Moglinberry Juice");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
