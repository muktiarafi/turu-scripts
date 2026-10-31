/*
name: Big Daddys Wardrobe Merge
description: This bot will farm the items belonging to the selected mode for the Big Daddys Wardrobe Merge [2560] in /tunneloflove
tags: big, daddys, wardrobe, merge, tunneloflove, lovely, moonlighters, moonlighter, heart, hearts, arcane, rouge, cowl, morph, silphium, rapier, potion, rapiers, crystalized, alchemist, daddy, cherub
*/
// Port of Scripts/Seasonal/HerosHeartDay/BigDaddysWardrobeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { TunnelOfLove } from "./TunnelOfLove";

const Adv = new CoreAdvanced();
const TOL = new TunnelOfLove();

export class BigDaddysWardrobeMerge {
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
                case "Heart-Shaped Gem":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("tunneloflove", "Love Knight", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Lovely Laurel":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(
                            10072,
                            ["tunneloflove", "Love Knight", ClassType.Farm],
                            ["tunneloflove", "Oubliette", ClassType.Solo],
                            ["tunneloflove", "Rosey Moth", ClassType.Farm],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Burning Flame":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("tunneloflove", "Galanoth", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Moth-Spun Silk":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("tunneloflove", "Rosey Moth", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Pink Diamond":

                case "Silphium Love Potions":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("tunneloflove", "Oubliette", req.name, quant, { isTemp: req.temp, log: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("tunneloflove")) {
            return;
        }
        TOL.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("tunneloflove", 2560, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "92011",
            "Lovely Moonlighters",
            'Mode: [select] only\nShould the bot buy "Lovely Moonlighters" ?',
            false,
        ),
        option.bool(
            "92010",
            "Lovely Moonlighter",
            'Mode: [select] only\nShould the bot buy "Lovely Moonlighter" ?',
            false,
        ),
        option.bool("92006", "Heart of Hearts", 'Mode: [select] only\nShould the bot buy "Heart of Hearts" ?', false),
        option.bool(
            "92005",
            "Arcane Rouge Cowl",
            'Mode: [select] only\nShould the bot buy "Arcane Rouge Cowl" ?',
            false,
        ),
        option.bool(
            "92004",
            "Arcane Rouge Hood",
            'Mode: [select] only\nShould the bot buy "Arcane Rouge Hood" ?',
            false,
        ),
        option.bool(
            "92003",
            "Arcane Rouge Visage",
            'Mode: [select] only\nShould the bot buy "Arcane Rouge Visage" ?',
            false,
        ),
        option.bool(
            "92002",
            "Arcane Rouge Morph",
            'Mode: [select] only\nShould the bot buy "Arcane Rouge Morph" ?',
            false,
        ),
        option.bool("92001", "Arcane Rouge", 'Mode: [select] only\nShould the bot buy "Arcane Rouge" ?', false),
        option.bool(
            "91382",
            "Silphium Rapier and Potion",
            'Mode: [select] only\nShould the bot buy "Silphium Rapier and Potion" ?',
            false,
        ),
        option.bool("91379", "Silphium Rapiers", 'Mode: [select] only\nShould the bot buy "Silphium Rapiers" ?', false),
        option.bool("91378", "Silphium Rapier", 'Mode: [select] only\nShould the bot buy "Silphium Rapier" ?', false),
        option.bool(
            "91377",
            "Crystalized Hearts",
            'Mode: [select] only\nShould the bot buy "Crystalized Hearts" ?',
            false,
        ),
        option.bool(
            "91374",
            "Silphium Alchemist",
            'Mode: [select] only\nShould the bot buy "Silphium Alchemist" ?',
            false,
        ),
        option.bool("47386", "Big Daddy Cherub", 'Mode: [select] only\nShould the bot buy "Big Daddy Cherub" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BigDaddysWardrobeMerge.select,
});

export default function main(): void {
    const script = new BigDaddysWardrobeMerge();
    Core.bankingBlackList.push(
        "Heart-Shaped Gem",
        "Lovely Laurel",
        "Burning Flame",
        "Moth-Spun Silk",
        "Pink Diamond",
        "Silphium Love Potions",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
