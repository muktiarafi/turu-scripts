/*
name: Neotower Merge
description: This bot will farm the items belonging to the selected mode for the Neotower Merge [2474] in /neotower
tags: neotower, merge, neotower, vindicator, assassin, priest, dawn, vindication, grace, texts, beast, tamer, claws
*/
// Port of Scripts/Hollowborn/MergeShops/NeotowerMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreHollowbornStory } from "../../story/hollowborn/CoreHollowbornStory";

const Adv = new CoreAdvanced();
const HB = new CoreHollowbornStory();

export class NeotowerMerge {
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
                /* MID's & there names:
                12 - Vindicator Assassin
                17 - Vindicator BeastTamer
                28 - Vindicator Priest
                */
                case "Vindicator Crest":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9865);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterMapID("neotower", 12, "Vindicated Blades");
                        Core.huntMonsterMapID("neotower", 17, "Vindicated Chain");
                        Core.huntMonsterMapID("neotower", 28, "Vindicated Scripture");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Vindicator Assassin Dirk":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonsterMapID("neotower", 12, req.name, 1, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
                case "Dawn Vindication Grimoires":

                case "Dawn Vindication Spellbooks":

                case "Dawn Vindication Tome":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.killMonster("neotower", "r10", "left", 28, req.id, quant, { isTemp: req.temp });
                        bot.wait.forPickup(req.id);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        HB.neoTower();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("neotower", 2474, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "87953",
            "Vindicator Assassin",
            'Mode: [select] only\nShould the bot buy "Vindicator Assassin" ?',
            false,
        ),
        option.bool(
            "87954",
            "Vindicator Assassin Mask",
            'Mode: [select] only\nShould the bot buy "Vindicator Assassin Mask" ?',
            false,
        ),
        option.bool(
            "87957",
            "Vindicator Assassin Daggers",
            'Mode: [select] only\nShould the bot buy "Vindicator Assassin Daggers" ?',
            false,
        ),
        option.bool(
            "87958",
            "Vindicator Priest",
            'Mode: [select] only\nShould the bot buy "Vindicator Priest" ?',
            false,
        ),
        option.bool(
            "87959",
            "Vindicator Priest Mask",
            'Mode: [select] only\nShould the bot buy "Vindicator Priest Mask" ?',
            false,
        ),
        option.bool(
            "87961",
            "Dawn Vindication Grace Texts",
            'Mode: [select] only\nShould the bot buy "Dawn Vindication Grace Texts" ?',
            false,
        ),
        option.bool(
            "87962",
            "Vindicator Priest Staff",
            'Mode: [select] only\nShould the bot buy "Vindicator Priest Staff" ?',
            false,
        ),
        option.bool(
            "87964",
            "Vindicator Beast Tamer",
            'Mode: [select] only\nShould the bot buy "Vindicator Beast Tamer" ?',
            false,
        ),
        option.bool(
            "87965",
            "Vindicator Beast Tamer Mask",
            'Mode: [select] only\nShould the bot buy "Vindicator Beast Tamer Mask" ?',
            false,
        ),
        option.bool(
            "87966",
            "Vindicator Beast Tamer Hood",
            'Mode: [select] only\nShould the bot buy "Vindicator Beast Tamer Hood" ?',
            false,
        ),
        option.bool(
            "87967",
            "Vindicator Beast Tamer Claws",
            'Mode: [select] only\nShould the bot buy "Vindicator Beast Tamer Claws" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NeotowerMerge.select,
});

export default function main(): void {
    const script = new NeotowerMerge();
    Core.bankingBlackList.push(
        "Vindicator Crest",
        "Vindicator Assassin Dirk",
        "Dawn Vindication Tome",
        "Dawn Vindication Spellbooks",
        "Dawn Vindication Grimoires",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
