/*
name: SuperDeathMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/SuperDeathMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { SuperDeath } from "../../story/SuperDeath";

const Adv = new CoreAdvanced();
const superDeath = new SuperDeath();

export class SuperDeathMerge {
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
                case "Fame Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8033);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("superdeath", "Cave Yeti", "Normal Monsters Defeated", 5);
                        Core.huntMonster("superdeath", "Shadow Mutant", "Shadow Monsters Defeated", 5);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Yergen's HeroSmash Trophy":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("superdeath", "Super Death", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        superDeath.storyLine();
        Adv.startBuyAllMerge("superdeath", 1992, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "60589",
            "Ultimate Evil Armor",
            'Mode: [select] only\nShould the bot buy "Ultimate Evil Armor" ?',
            false,
        ),
        option.bool(
            "60590",
            "Ultimate Evil Helm",
            'Mode: [select] only\nShould the bot buy "Ultimate Evil Helm" ?',
            false,
        ),
        option.bool(
            "60586",
            "Ultimate Evil Sword",
            'Mode: [select] only\nShould the bot buy "Ultimate Evil Sword" ?',
            false,
        ),
        option.bool(
            "60585",
            "Ultimate Evil Scythe",
            'Mode: [select] only\nShould the bot buy "Ultimate Evil Scythe" ?',
            false,
        ),
        option.bool(
            "60591",
            "Ultimate Good Armor",
            'Mode: [select] only\nShould the bot buy "Ultimate Good Armor" ?',
            false,
        ),
        option.bool(
            "60592",
            "Ultimate Good Helm",
            'Mode: [select] only\nShould the bot buy "Ultimate Good Helm" ?',
            false,
        ),
        option.bool(
            "60593",
            "Ultimate Good Poleaxe",
            'Mode: [select] only\nShould the bot buy "Ultimate Good Poleaxe" ?',
            false,
        ),
        option.bool(
            "60594",
            "Ultimate Good Sword",
            'Mode: [select] only\nShould the bot buy "Ultimate Good Sword" ?',
            false,
        ),
        option.bool(
            "60637",
            "Little Green Alien",
            'Mode: [select] only\nShould the bot buy "Little Green Alien" ?',
            false,
        ),
        option.bool(
            "60598",
            "Little Green Alien Morph",
            'Mode: [select] only\nShould the bot buy "Little Green Alien Morph" ?',
            false,
        ),
        option.bool(
            "60600",
            "Crashlanded Autopsy Morph",
            'Mode: [select] only\nShould the bot buy "Crashlanded Autopsy Morph" ?',
            false,
        ),
        option.bool("60604", "Goblin Head", 'Mode: [select] only\nShould the bot buy "Goblin Head" ?', false),
        option.bool("60596", "Braindy Head", 'Mode: [select] only\nShould the bot buy "Braindy Head" ?', false),
        option.bool("60597", "Kitty Helm", 'Mode: [select] only\nShould the bot buy "Kitty Helm" ?', false),
        option.bool("60640", "Pencil", 'Mode: [select] only\nShould the bot buy "Pencil" ?', false),
        option.bool("60639", "Jumbo Pencil", 'Mode: [select] only\nShould the bot buy "Jumbo Pencil" ?', false),
        option.bool(
            "60638",
            "Ebiltime Chatbomb",
            'Mode: [select] only\nShould the bot buy "Ebiltime Chatbomb" ?',
            false,
        ),
        option.bool(
            "60630",
            "Crusader's Blade",
            'Mode: [select] only\nShould the bot buy "Crusader\'s Blade" ?',
            false,
        ),
        option.bool(
            "60607",
            "Yergen's Award of Yergen",
            'Mode: [select] only\nShould the bot buy "Yergen\'s Award of Yergen" ?',
            false,
        ),
        option.bool(
            "60608",
            "Yergen's Award of Awards",
            'Mode: [select] only\nShould the bot buy "Yergen\'s Award of Awards" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SuperDeathMerge.select,
});

export default function main(): void {
    const script = new SuperDeathMerge();
    Core.bankingBlackList.push("Fame Token", "Yergen's HeroSmash Trophy ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
