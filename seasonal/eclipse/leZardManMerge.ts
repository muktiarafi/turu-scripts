/*
name: leZard Man Merge
description: This bot will farm the items belonging to the selected mode for the leZard Man Merge [2428] in /battleon
tags: lezard, man, merge, battleon, void, stareater, blackout, stareaters, morph, ravenous, grin, flare, tusk, tusks, tail, tentacles, total, solar, eclipse, chibi, buddy, collapse, knights, glasses, , adventurers, double, puffs, astral, symbiote, alignment, greatsword, greatswords
*/
// Port of Scripts/Seasonal/Eclipse/leZardManMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreSummer } from "../../story/summer2015adventuremap/CoreSummer";

const Farm = new CoreFarms();
const Coll = new CoreSummer();
const Adv = new CoreAdvanced();

export class leZardManMerge {
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
                case "Cosmic Dust":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9678);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("starsinc", "r2", "Left", "*", "Star Dust", 30, { log: false });
                    }
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Cosmic Aura":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9679);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("blackholesun", "Black Light Elemental", "Black Light Aura", 7);
                        Core.killMonster("dreadspace", "r22", "Left", "Troblor", "Star Scrap Metal", 10, {
                            isTemp: false,
                        });
                        // while (!Bot.ShouldExit && !Core.CheckInventory("Star Scrap Metal", 10))
                        // {
                        //     Core.EnsureAccept(4289);
                        //     Core.KillMonster("dreadspace", "r20", "Right", "*", "Golden Spork of Justice", log: false);
                        //     Core.EnsureCompleteMulti(4289);
                        //     Bot.Wait.ForPickup("Star Scrap Metal");
                        // }
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonsterMapID("whitehole", 49, "Vortex Essence", 12);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Astral Alignment Sword":

                case "Astral Alignment Swords":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("starfield", "Astral Spirit", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        Farm.experience(95);
        //for `Star Scrap Metal`
        Coll.deadmoor();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("battleon", 2428, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("83480", "Void Star-Eater", 'Mode: [select] only\nShould the bot buy "Void Star-Eater" ?', false),
        option.bool("85305", "BlackOut Armor", 'Mode: [select] only\nShould the bot buy "BlackOut Armor" ?', false),
        option.bool(
            "83481",
            "Star-Eater's Morph",
            'Mode: [select] only\nShould the bot buy "Star-Eater\'s Morph" ?',
            false,
        ),
        option.bool(
            "83482",
            "Star-Eater's Ravenous Grin Morph",
            'Mode: [select] only\nShould the bot buy "Star-Eater\'s Ravenous Grin Morph" ?',
            false,
        ),
        option.bool("85306", "BlackOut Morph", 'Mode: [select] only\nShould the bot buy "BlackOut Morph" ?', false),
        option.bool(
            "83488",
            "Star-Eater's Void Flare",
            'Mode: [select] only\nShould the bot buy "Star-Eater\'s Void Flare" ?',
            false,
        ),
        option.bool(
            "83489",
            "Star-Eater's Tusk",
            'Mode: [select] only\nShould the bot buy "Star-Eater\'s Tusk" ?',
            false,
        ),
        option.bool(
            "83490",
            "Star-Eater's Tusks",
            'Mode: [select] only\nShould the bot buy "Star-Eater\'s Tusks" ?',
            false,
        ),
        option.bool(
            "83483",
            "Star-Eater's Tail",
            'Mode: [select] only\nShould the bot buy "Star-Eater\'s Tail" ?',
            false,
        ),
        option.bool(
            "83484",
            "Star-Eater's Tentacles",
            'Mode: [select] only\nShould the bot buy "Star-Eater\'s Tentacles" ?',
            false,
        ),
        option.bool(
            "83485",
            "Star-Eater's Tail and Tentacles",
            'Mode: [select] only\nShould the bot buy "Star-Eater\'s Tail and Tentacles" ?',
            false,
        ),
        option.bool(
            "85307",
            "Total Solar Eclipse",
            'Mode: [select] only\nShould the bot buy "Total Solar Eclipse" ?',
            false,
        ),
        option.bool(
            "83487",
            "Star-Eater's Chibi Buddy",
            'Mode: [select] only\nShould the bot buy "Star-Eater\'s Chibi Buddy" ?',
            false,
        ),
        option.bool(
            "83486",
            "Star-Eater's Void Collapse",
            'Mode: [select] only\nShould the bot buy "Star-Eater\'s Void Collapse" ?',
            false,
        ),
        option.bool(
            "85321",
            "Knight's Total Eclipse Solar Glasses",
            'Mode: [select] only\nShould the bot buy "Knight\'s Total Eclipse Solar Glasses" ?',
            false,
        ),
        option.bool(
            "85320",
            "Knight's Total Eclipse Solar Glasses + Locks",
            'Mode: [select] only\nShould the bot buy "Knight\'s Total Eclipse Solar Glasses + Locks" ?',
            false,
        ),
        option.bool(
            "85319",
            "Adventurer's Total Eclipse Solar Glasses",
            'Mode: [select] only\nShould the bot buy "Adventurer\'s Total Eclipse Solar Glasses" ?',
            false,
        ),
        option.bool(
            "85322",
            "Total Eclipse Solar Glasses + Double Puffs",
            'Mode: [select] only\nShould the bot buy "Total Eclipse Solar Glasses + Double Puffs" ?',
            false,
        ),
        option.bool("92191", "Astral Symbiote", 'Mode: [select] only\nShould the bot buy "Astral Symbiote" ?', false),
        option.bool(
            "92253",
            "Astral Alignment Greatsword",
            'Mode: [select] only\nShould the bot buy "Astral Alignment Greatsword" ?',
            false,
        ),
        option.bool(
            "92254",
            "Astral Alignment Greatswords",
            'Mode: [select] only\nShould the bot buy "Astral Alignment Greatswords" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: leZardManMerge.select,
});

export default function main(): void {
    const script = new leZardManMerge();
    Core.bankingBlackList.push("Cosmic Dust", "Cosmic Aura", "Astral Alignment Sword", "Astral Alignment Swords");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
