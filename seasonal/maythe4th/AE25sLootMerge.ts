/*
name: AE25s Loot Merge
description: This bot will farm the items belonging to the selected mode for the AE25s Loot Merge [2575] in /twigguhunt
tags: ae25s, loot, merge, twigguhunt, fourth, guardian, balance, morph, goggles, eyewear, consular
*/
// Port of Scripts/Seasonal/MayThe4th/AE25sLootMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { AE25Quests } from "./AE25Story";

const Adv = new CoreAdvanced();
const AE25 = new AE25Quests();

export class AE25sLootMerge {
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
                case "Obliterator Droid's Generator":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        if (Core.isMember) {
                            Core.huntMonsterQuest(10229, "twigguhunt", "Obliterator Droid");
                        }
                        Core.huntMonsterQuest(10228, "twigguhunt", "Obliterator Droid");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Droid Scrap":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("twigguhunt", "r2", "Down", "*", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
            }
        };
        AE25.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("twigguhunt", 2575, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "93302",
            "Fourth Guardian of Balance",
            'Mode: [select] only\nShould the bot buy "Fourth Guardian of Balance" ?',
            false,
        ),
        option.bool(
            "93303",
            "Fourth Guardian Morph",
            'Mode: [select] only\nShould the bot buy "Fourth Guardian Morph" ?',
            false,
        ),
        option.bool(
            "93304",
            "Fourth Guardian Visage",
            'Mode: [select] only\nShould the bot buy "Fourth Guardian Visage" ?',
            false,
        ),
        option.bool(
            "93305",
            "Fourth Guardian Goggles",
            'Mode: [select] only\nShould the bot buy "Fourth Guardian Goggles" ?',
            false,
        ),
        option.bool(
            "93306",
            "Fourth Guardian Eyewear",
            'Mode: [select] only\nShould the bot buy "Fourth Guardian Eyewear" ?',
            false,
        ),
        option.bool(
            "93307",
            "Fourth Guardian Cape",
            'Mode: [select] only\nShould the bot buy "Fourth Guardian Cape" ?',
            false,
        ),
        option.bool(
            "93312",
            "Fourth Consular of Balance",
            'Mode: [select] only\nShould the bot buy "Fourth Consular of Balance" ?',
            false,
        ),
        option.bool(
            "93313",
            "Fourth Consular Goggles",
            'Mode: [select] only\nShould the bot buy "Fourth Consular Goggles" ?',
            false,
        ),
        option.bool(
            "93314",
            "Fourth Consular Eyewear",
            'Mode: [select] only\nShould the bot buy "Fourth Consular Eyewear" ?',
            false,
        ),
        option.bool(
            "93315",
            "Fourth Consular Cape",
            'Mode: [select] only\nShould the bot buy "Fourth Consular Cape" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AE25sLootMerge.select,
});

export default function main(): void {
    const script = new AE25sLootMerge();
    Core.bankingBlackList.push("Obliterator Droid's Generator", "Droid Scrap");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
