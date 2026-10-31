/*
name: Blood Isles Merge
description: This bot will farm the items belonging to the selected mode for the Blood Isles Merge [2484] in /bloodisles
tags: blood, isles, merge, bloodisles, copper, golem, commander, bandana, cap, commanders, navigator, silver, swashbuckler, morph, captain, swashbucklers, fancy, golden, armblade, armblades, testament, pirate
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/BloodIslesMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { BloodIsles } from "../BloodIslesStory";

const Adv = new CoreAdvanced();
const BI = new BloodIsles();

export class BloodIslesMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const UseableMonsters = [
                "Blood Moon Pirate", // UseableMonsters[0],
                "Drowned Werewolf", // UseableMonsters[1],
                "Vampiric Lamprey", // UseableMonsters[2],
                "Drowned Vampire", // UseableMonsters[3],
                "Blood Veil Pirate", // UseableMonsters[4],
                "Drowned Horde", // UseableMonsters[5],
                "Bloodthirsty Bonnie", // UseableMonsters[6],
                "Sea King Kurok", // UseableMonsters[7],
                "Merpyre", // UseableMonsters[8]
                "Feral Flintfang", // UseableMonsters[9]
            ];

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
                case "Blood Isle Booty":
                    Core.farmingLogger(req.name, quant);
                    // 9886 | Petty Proposition
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(9886);
                        Core.huntMonster("bloodisles", UseableMonsters[6], "Blood Captain Cap");
                        Core.huntMonster("bloodisles", UseableMonsters[7], "Kurok's Moon Ring");
                        Core.huntMonster("bloodisles", UseableMonsters[8], "Merpyre Scale");
                        Core.ensureComplete(9886);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Amira 2.0 Gear":
                    if (!Core.isMember) {
                        Core.logger("Members only map");
                        return;
                    }
                    Core.huntMonster("amira", "Amira 2.0", req.name, quant, { isTemp: req.temp });
                    break;
                case "Fancy Golden Scissors":
                    Core.huntMonster("bloodisles", UseableMonsters[8], req.name, quant, { isTemp: req.temp });
                    break;
                case "Dual Fancy Golden Scissors":
                    Core.huntMonster("bloodisles", UseableMonsters[8], req.name, quant, { isTemp: req.temp });
                    break;
            }
        };
        BI.doStory();
        Core.equipClass(ClassType.Solo);
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("bloodisles", 2484, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "79908",
            "Copper Golem Commander",
            'Mode: [select] only\nShould the bot buy "Copper Golem Commander" ?',
            false,
        ),
        option.bool(
            "79912",
            "Copper Golem Commander Visage",
            'Mode: [select] only\nShould the bot buy "Copper Golem Commander Visage" ?',
            false,
        ),
        option.bool(
            "79913",
            "Copper Golem Commander Bandana",
            'Mode: [select] only\nShould the bot buy "Copper Golem Commander Bandana" ?',
            false,
        ),
        option.bool(
            "79914",
            "Copper Golem Commander Cap",
            'Mode: [select] only\nShould the bot buy "Copper Golem Commander Cap" ?',
            false,
        ),
        option.bool(
            "79915",
            "Copper Golem Commander's Navigator",
            'Mode: [select] only\nShould the bot buy "Copper Golem Commander\'s Navigator" ?',
            false,
        ),
        option.bool(
            "79916",
            "Copper Golem Commander Gauntlets",
            'Mode: [select] only\nShould the bot buy "Copper Golem Commander Gauntlets" ?',
            false,
        ),
        option.bool(
            "79917",
            "Silver Swashbuckler",
            'Mode: [select] only\nShould the bot buy "Silver Swashbuckler" ?',
            false,
        ),
        option.bool(
            "79918",
            "Silver Swashbuckler Morph",
            'Mode: [select] only\nShould the bot buy "Silver Swashbuckler Morph" ?',
            false,
        ),
        option.bool(
            "79919",
            "Silver Swashbuckler Captain Morph",
            'Mode: [select] only\nShould the bot buy "Silver Swashbuckler Captain Morph" ?',
            false,
        ),
        option.bool(
            "79920",
            "Silver Swashbuckler Bandana Visage",
            'Mode: [select] only\nShould the bot buy "Silver Swashbuckler Bandana Visage" ?',
            false,
        ),
        option.bool(
            "79921",
            "Silver Swashbuckler Visage",
            'Mode: [select] only\nShould the bot buy "Silver Swashbuckler Visage" ?',
            false,
        ),
        option.bool(
            "79922",
            "Silver Swashbuckler Bandana",
            'Mode: [select] only\nShould the bot buy "Silver Swashbuckler Bandana" ?',
            false,
        ),
        option.bool(
            "79923",
            "Silver Swashbuckler Cap",
            'Mode: [select] only\nShould the bot buy "Silver Swashbuckler Cap" ?',
            false,
        ),
        option.bool(
            "79924",
            "Silver Swashbuckler's Navigator",
            'Mode: [select] only\nShould the bot buy "Silver Swashbuckler\'s Navigator" ?',
            false,
        ),
        option.bool(
            "79925",
            "Silver Swashbuckler Gauntlets",
            'Mode: [select] only\nShould the bot buy "Silver Swashbuckler Gauntlets" ?',
            false,
        ),
        option.bool(
            "88227",
            "Fancy Golden Armblade",
            'Mode: [select] only\nShould the bot buy "Fancy Golden Armblade" ?',
            false,
        ),
        option.bool(
            "88228",
            "Fancy Golden Armblades",
            'Mode: [select] only\nShould the bot buy "Fancy Golden Armblades" ?',
            false,
        ),
        option.bool(
            "88482",
            "Blood Testament Pirate",
            'Mode: [select] only\nShould the bot buy "Blood Testament Pirate" ?',
            false,
        ),
        option.bool(
            "88483",
            "Blood Testament Pirate Visage",
            'Mode: [select] only\nShould the bot buy "Blood Testament Pirate Visage" ?',
            false,
        ),
        option.bool(
            "88484",
            "Blood Testament Pirate Morph",
            'Mode: [select] only\nShould the bot buy "Blood Testament Pirate Morph" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BloodIslesMerge.select,
});

export default function main(): void {
    const script = new BloodIslesMerge();
    Core.bankingBlackList.push(
        "Blood Isle Booty",
        "Amira 2.0 Gear",
        "Fancy Golden Scissors",
        "Dual Fancy Golden Scissors",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
