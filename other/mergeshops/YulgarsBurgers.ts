/*
name: Yulgars Burgers Merge
description: Farms the Yulgars Burgers Merge [1884] in /borgars.
tags: borgars, merge, yulgars, burgers, merge
*/
// Port of Scripts/Other/MergeShops/YulgarsBurgers.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class YulgarsBurgers {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Burger Buns":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(7522);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("borgars", "Burglinster", "Burglinster Cured", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Cowbell":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(7511);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.logger(
                            "Cannot automate Heavy Cream [54722] for Creamy! [7511] from this map.",
                            undefined,
                            { messageBox: true, stopBot: true },
                        );
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Fish Oil":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(7514);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.logger(
                            "Cannot automate Fishwing Filet [54725] for Filet o' Fishwing [7514] from this map.",
                            undefined,
                            { messageBox: true, stopBot: true },
                        );
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Sugar Cubes":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(7512);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.logger("Cannot automate Sugar [54723] for Sacchar-Imp [7512] from this map.", undefined, {
                            messageBox: true,
                            stopBot: true,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(`The bot hasn't been taught how to get ${req.name}.`, undefined, {
                        messageBox: shouldStop,
                        stopBot: shouldStop,
                    });
                    break;
                }
            }
        };
        // FILL_QUEST_UNLOCK: Add the story call that completes "An Aspiring Burgermonger" [7521] to unlock "Burglinster's Revenge" [7522].
        Adv.startBuyAllMerge("borgars", 1884, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool("54738", "ChickencowMancer", 'Mode: [select] only\nShould the bot buy "ChickencowMancer" ?', false),
        option.bool("54646", "BorgarMonger", 'Mode: [select] only\nShould the bot buy "BorgarMonger" ?', false),
        option.bool("54651", "Dual Borgars", 'Mode: [select] only\nShould the bot buy "Dual Borgars" ?', false),
        option.bool(
            "54780",
            "Burger and Spatula",
            'Mode: [select] only\nShould the bot buy "Burger and Spatula" ?',
            false,
        ),
        option.bool(
            "54647",
            "BorgarMonger Hair",
            'Mode: [select] only\nShould the bot buy "BorgarMonger Hair" ?',
            false,
        ),
        option.bool(
            "54652",
            "BorgarMonger Morph Locks",
            'Mode: [select] only\nShould the bot buy "BorgarMonger Morph Locks" ?',
            false,
        ),
        option.bool(
            "54740",
            "Chickencowl + Locks",
            'Mode: [select] only\nShould the bot buy "Chickencowl + Locks" ?',
            false,
        ),
        option.bool("54741", "ChickenCowl", 'Mode: [select] only\nShould the bot buy "ChickenCowl" ?', false),
        option.bool("54648", "BorgarMonger Hat", 'Mode: [select] only\nShould the bot buy "BorgarMonger Hat" ?', false),
        option.bool(
            "54649",
            "Triple BorgarMonger Hat",
            'Mode: [select] only\nShould the bot buy "Triple BorgarMonger Hat" ?',
            false,
        ),
        option.bool("54782", "Bowl of Salad", 'Mode: [select] only\nShould the bot buy "Bowl of Salad" ?', false),
        option.bool("54758", "Chicken Fingers", 'Mode: [select] only\nShould the bot buy "Chicken Fingers" ?', false),
        option.bool("54650", "Borgar", 'Mode: [select] only\nShould the bot buy "Borgar" ?', false),
        option.bool("54781", "Slice of Cake", 'Mode: [select] only\nShould the bot buy "Slice of Cake" ?', false),
        option.bool(
            "54744",
            "ChickencowMancer's Staff",
            'Mode: [select] only\nShould the bot buy "ChickencowMancer\'s Staff" ?',
            false,
        ),
        option.bool(
            "54745",
            "ChickencowMancer's Blade",
            'Mode: [select] only\nShould the bot buy "ChickencowMancer\'s Blade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: YulgarsBurgers.select,
});

export default function main(): void {
    const script = new YulgarsBurgers();
    Core.bankingBlackList.push("Burger Buns", "Cowbell", "Fish Oil", "Sugar Cubes");
    Core.setOptions();
    script.buyAllMerge();
    Core.setOptions(false);
}
