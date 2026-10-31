/*
name: Alnswick Castle Merge
description: This bot will farm the items belonging to the selected mode for the Alnswick Castle Merge [2360] in /cursedcastle
tags: alnswick, castle, merge, cursedcastle, vampiric, gentlefolk, red, eyed, aristohat, morph, stache, aristocap, dapper, bloodshot, crimson, vampire, wings, winged, cloak, wind, soul, starved, jiangshi, cap, talisman, sedge, bandaged, glare, sealed, coffin, haunted, tuanshan, jiangshis, weaponry, claw, claws
*/
// Port of Scripts/Seasonal/Mogloween/MergeShops/AlnswickCastleMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreMogloween } from "../CoreMogloween";

const Adv = new CoreAdvanced();
const coreMogloween = new CoreMogloween();

export class AlnswickCastleMerge {
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
                case "Candy Dragon Egg":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    // Host of Honor 9455
                    Core.registerQuests(9455);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("cursedcastle", "Luminous Fungus", "Grilled Shroom Caps", 6);
                        Core.huntMonster("cursedcastle", "Noble Gargoyle", "Decorated Gargoyle", 6);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("cursedcastle", "Unborn Brood", "Unborn Brood Defeated");

                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Jiangshi":

                case "Jiangshi Hair":

                case "Jiangshi Cap":

                case "Jiangshi Locks":

                case "Jiangshi Bandages":

                case "Jiangshi Talisman Locks":

                case "Jiangshi Talisman Hair":

                case "Jiangshi Hat":
                    Core.huntMonster("cursedcastle", "Noble Ghost", req.name, quant, { isTemp: req.temp });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("cursedcastle")) {
            return;
        }

        coreMogloween.cursedCastle();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("cursedcastle", 2360, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "81206",
            "Vampiric Gentlefolk",
            'Mode: [select] only\nShould the bot buy "Vampiric Gentlefolk" ?',
            false,
        ),
        option.bool(
            "81209",
            "Vampiric Red Eyed Aristohat Morph",
            'Mode: [select] only\nShould the bot buy "Vampiric Red Eyed Aristohat Morph" ?',
            false,
        ),
        option.bool(
            "81210",
            "Vampiric Aristohat Stache Morph",
            'Mode: [select] only\nShould the bot buy "Vampiric Aristohat Stache Morph" ?',
            false,
        ),
        option.bool(
            "81211",
            "Vampiric Aristohat Morph",
            'Mode: [select] only\nShould the bot buy "Vampiric Aristohat Morph" ?',
            false,
        ),
        option.bool(
            "81212",
            "Vampiric Aristocap Visage",
            'Mode: [select] only\nShould the bot buy "Vampiric Aristocap Visage" ?',
            false,
        ),
        option.bool(
            "81213",
            "Vampiric Red Eyed Aristocap Visage",
            'Mode: [select] only\nShould the bot buy "Vampiric Red Eyed Aristocap Visage" ?',
            false,
        ),
        option.bool(
            "81214",
            "Dapper Vampiric Aristocap Visage",
            'Mode: [select] only\nShould the bot buy "Dapper Vampiric Aristocap Visage" ?',
            false,
        ),
        option.bool(
            "81215",
            "Vampiric Bloodshot Aristocap Visage",
            'Mode: [select] only\nShould the bot buy "Vampiric Bloodshot Aristocap Visage" ?',
            false,
        ),
        option.bool(
            "81216",
            "Vampiric Aristocap",
            'Mode: [select] only\nShould the bot buy "Vampiric Aristocap" ?',
            false,
        ),
        option.bool(
            "81217",
            "Dapper Vampiric Aristohat Morph",
            'Mode: [select] only\nShould the bot buy "Dapper Vampiric Aristohat Morph" ?',
            false,
        ),
        option.bool(
            "81219",
            "Crimson Vampire Wings",
            'Mode: [select] only\nShould the bot buy "Crimson Vampire Wings" ?',
            false,
        ),
        option.bool(
            "81220",
            "Crimson Winged Cloak",
            'Mode: [select] only\nShould the bot buy "Crimson Winged Cloak" ?',
            false,
        ),
        option.bool(
            "81226",
            "Staff of Crimson Wind",
            'Mode: [select] only\nShould the bot buy "Staff of Crimson Wind" ?',
            false,
        ),
        option.bool(
            "80452",
            "Soul Starved Jiangshi",
            'Mode: [select] only\nShould the bot buy "Soul Starved Jiangshi" ?',
            false,
        ),
        option.bool("80455", "Jiangshi Morph", 'Mode: [select] only\nShould the bot buy "Jiangshi Morph" ?', false),
        option.bool("80456", "Jiangshi Visage", 'Mode: [select] only\nShould the bot buy "Jiangshi Visage" ?', false),
        option.bool(
            "80459",
            "Jiangshi Hat Morph",
            'Mode: [select] only\nShould the bot buy "Jiangshi Hat Morph" ?',
            false,
        ),
        option.bool(
            "80460",
            "Jiangshi Cap Visage",
            'Mode: [select] only\nShould the bot buy "Jiangshi Cap Visage" ?',
            false,
        ),
        option.bool(
            "80463",
            "Jiangshi Talisman Morph",
            'Mode: [select] only\nShould the bot buy "Jiangshi Talisman Morph" ?',
            false,
        ),
        option.bool(
            "80464",
            "Jiangshi Talisman Visage",
            'Mode: [select] only\nShould the bot buy "Jiangshi Talisman Visage" ?',
            false,
        ),
        option.bool(
            "80465",
            "Jiangshi Sedge Hat",
            'Mode: [select] only\nShould the bot buy "Jiangshi Sedge Hat" ?',
            false,
        ),
        option.bool(
            "80467",
            "Jiangshi Bandaged Glare",
            'Mode: [select] only\nShould the bot buy "Jiangshi Bandaged Glare" ?',
            false,
        ),
        option.bool(
            "80468",
            "Talisman Sealed Coffin",
            'Mode: [select] only\nShould the bot buy "Talisman Sealed Coffin" ?',
            false,
        ),
        option.bool("80476", "Haunted Tuanshan", 'Mode: [select] only\nShould the bot buy "Haunted Tuanshan" ?', false),
        option.bool(
            "80477",
            "Jiangshi's Haunted Weaponry",
            'Mode: [select] only\nShould the bot buy "Jiangshi\'s Haunted Weaponry" ?',
            false,
        ),
        option.bool("80478", "Jiangshi Claw", 'Mode: [select] only\nShould the bot buy "Jiangshi Claw" ?', false),
        option.bool("80479", "Jiangshi Claws", 'Mode: [select] only\nShould the bot buy "Jiangshi Claws" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AlnswickCastleMerge.select,
});

export default function main(): void {
    const script = new AlnswickCastleMerge();
    Core.bankingBlackList.push(
        "Candy Dragon Egg",
        "Jiangshi",
        "Jiangshi Hair",
        "Jiangshi Locks",
        "Jiangshi Hat",
        "Jiangshi Cap",
        "Jiangshi Talisman Hair",
        "Jiangshi Talisman Locks",
        "Jiangshi Bandages",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
