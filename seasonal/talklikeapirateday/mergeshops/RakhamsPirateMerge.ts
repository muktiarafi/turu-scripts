/*
name: Rakham's Pirate Merge [Member]
description: This bot will farm the items belonging to the selected mode for the Rakhams Pirate Merge [350] in /pirates
tags: talk-like-a-pirate-day, seasonal, tlapd, rakham, pirate, merge, pirates, blunderbuss, boom, renegade, looter, handcannon, high, seas, captains, cutlass, bandana, looting, tricorn, terror, mermaids, hairpoon, calais, looters, raiment, bladed
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/RakhamsPirateMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { Pirates } from "../../../story/Pirates[Member]";

const Adv = new CoreAdvanced();
const Pir = new Pirates();

export class RakhamsPirateMerge {
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
                case "Pack Of Spices":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(1550);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("pirates", "Capt. Beard");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Gold Ingot":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(1548);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("pirates", "Undead Pirate");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Bolt Of Silk":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(1549);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("pirates", "Undead Pirate");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isMember) {
            return;
        }

        Pir.storyLine();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("pirates", 350, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "10535",
            "Blunderbuss of Boom",
            'Mode: [select] only\nShould the bot buy "Blunderbuss of Boom" ?',
            false,
        ),
        option.bool("10523", "Pirate Renegade", 'Mode: [select] only\nShould the bot buy "Pirate Renegade" ?', false),
        option.bool("10524", "Looter", 'Mode: [select] only\nShould the bot buy "Looter" ?', false),
        option.bool(
            "10534",
            "HandCannon of the High Seas",
            'Mode: [select] only\nShould the bot buy "HandCannon of the High Seas" ?',
            false,
        ),
        option.bool(
            "10537",
            "Captain's Cutlass of Boom",
            'Mode: [select] only\nShould the bot buy "Captain\'s Cutlass of Boom" ?',
            false,
        ),
        option.bool(
            "10539",
            "Bandana of Looting",
            'Mode: [select] only\nShould the bot buy "Bandana of Looting" ?',
            false,
        ),
        option.bool(
            "10540",
            "Pirate's Tricorn of Terror",
            'Mode: [select] only\nShould the bot buy "Pirate\'s Tricorn of Terror" ?',
            false,
        ),
        option.bool(
            "10542",
            "Mermaid's Hairpoon",
            'Mode: [select] only\nShould the bot buy "Mermaid\'s Hairpoon" ?',
            false,
        ),
        option.bool("10543", "Cutlass Calais", 'Mode: [select] only\nShould the bot buy "Cutlass Calais" ?', false),
        option.bool(
            "10545",
            "Looter's Raiment",
            'Mode: [select] only\nShould the bot buy "Looter\'s Raiment" ?',
            false,
        ),
        option.bool(
            "10536",
            "Bladed Blunderbuss of Boom",
            'Mode: [select] only\nShould the bot buy "Bladed Blunderbuss of Boom" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: RakhamsPirateMerge.select,
});

export default function main(): void {
    const script = new RakhamsPirateMerge();
    Core.bankingBlackList.push("Pack Of Spices", "Gold Ingot", "Bolt Of Silk");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
