/*
name: Stillins Merge
description: Farms the Stillins Merge [2806] in /kiyametgrove.
tags: kiyametgrove, merge, stillins, merge
*/
// Port of Scripts/Other/MergeShops/StillinsShop.cs.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { KiyametGrove } from "../../story/KiyametGrove";

const Adv = new CoreAdvanced();
const Kiyamet = new KiyametGrove();

export class StillinsShop {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Apocalyptic Colossus Guard":

                case "Apocalyptic Student’s Hair":

                case "Apocalyptic Student’s Locks":

                case "Apocalyptic Student’s Mistake":

                case "Golem Hand Gauntlets":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("kiyametgrove", "Overcharged Colossus", req.name, quant, { isTemp: req.temp });
                    break;
                case "Azure Rune":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(10937);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("kiyametgrove", "Overcharged Colossus", "Overcharged Golem Stone", 1);
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
        Kiyamet.storyline();
        Adv.startBuyAllMerge("kiyametgrove", 2806, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool(
            "104781",
            "Apocalyptic Student’s Tattoos",
            'Mode: [select] only\nShould the bot buy "Apocalyptic Student’s Tattoos" ?',
            false,
        ),
        option.bool(
            "104787",
            "Apocalyptic Student’s Accoutrements",
            'Mode: [select] only\nShould the bot buy "Apocalyptic Student’s Accoutrements" ?',
            false,
        ),
        option.bool(
            "104788",
            "Apocalyptic Pillar Backblade",
            'Mode: [select] only\nShould the bot buy "Apocalyptic Pillar Backblade" ?',
            false,
        ),
        option.bool(
            "104789",
            "Apocalyptic Student’s Wraps",
            'Mode: [select] only\nShould the bot buy "Apocalyptic Student’s Wraps" ?',
            false,
        ),
        option.bool(
            "104790",
            "Overcharged Colossus Guard",
            'Mode: [select] only\nShould the bot buy "Overcharged Colossus Guard" ?',
            false,
        ),
        option.bool(
            "104793",
            "Apocalyptic Student’s Pillars",
            'Mode: [select] only\nShould the bot buy "Apocalyptic Student’s Pillars" ?',
            false,
        ),
        option.bool(
            "104795",
            "Overcharged Golem Gauntlets",
            'Mode: [select] only\nShould the bot buy "Overcharged Golem Gauntlets" ?',
            false,
        ),
        option.bool(
            "104796",
            "Back Arm Sword Gauntlet",
            'Mode: [select] only\nShould the bot buy "Back Arm Sword Gauntlet" ?',
            false,
        ),
        option.bool(
            "104783",
            "Apocalyptic Student’s Blind Hair",
            'Mode: [select] only\nShould the bot buy "Apocalyptic Student’s Blind Hair" ?',
            false,
        ),
        option.bool(
            "104785",
            "Apocalyptic Student’s Blind Locks",
            'Mode: [select] only\nShould the bot buy "Apocalyptic Student’s Blind Locks" ?',
            false,
        ),
        option.bool(
            "104792",
            "Apocalyptic Student’s Pillar",
            'Mode: [select] only\nShould the bot buy "Apocalyptic Student’s Pillar" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: StillinsShop.select,
});

export default function main(): void {
    const script = new StillinsShop();
    Core.bankingBlackList.push(
        "Apocalyptic Colossus Guard",
        "Apocalyptic Student’s Hair",
        "Apocalyptic Student’s Locks",
        "Apocalyptic Student’s Mistake",
        "Azure Rune",
        "Golem Hand Gauntlets",
    );
    Core.setOptions();
    script.buyAllMerge();
    Core.setOptions(false);
}
