/*
name: Hall of Classes Merge
description: This bot will farm the items belonging to the selected mode for the Hall of Classes Merge [1876] in /classhall
tags: hall, of, classes, merge, classhall, shinobi, x, headband, , masked, katana, katanas, battle, berserker, blooded, faceguard, horned, wee, training, dummy, draconic, cuirass, gold, experienced, combatant, morph, metamorphosis, steel, winglets, silver, stream
*/
// Port of Scripts/Other/MergeShops/HallofClassesMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class HallofClassesMerge {
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
                case "Sword and Scroll Badge":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7505);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Studying the Rogue 7505
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("wardwarf", "Drow Assassin", "Poisoned Dagger", 4);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("wardwarf", "D'wain Jonsen", `Scroll: Opportunity's Strike`);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("classhall", 1876, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("54598", "Shinobi Armor", 'Mode: [select] only\nShould the bot buy "Shinobi Armor" ?', false),
        option.bool("54599", "Shinobi X", 'Mode: [select] only\nShould the bot buy "Shinobi X" ?', false),
        option.bool("54601", "Shinobi Headband", 'Mode: [select] only\nShould the bot buy "Shinobi Headband" ?', false),
        option.bool(
            "54603",
            "Shinobi Headband + Locks",
            'Mode: [select] only\nShould the bot buy "Shinobi Headband + Locks" ?',
            false,
        ),
        option.bool("54600", "Shinobi Mask", 'Mode: [select] only\nShould the bot buy "Shinobi Mask" ?', false),
        option.bool(
            "54602",
            "Shinobi Mask + Locks",
            'Mode: [select] only\nShould the bot buy "Shinobi Mask + Locks" ?',
            false,
        ),
        option.bool(
            "54604",
            "Shinobi Masked Hood",
            'Mode: [select] only\nShould the bot buy "Shinobi Masked Hood" ?',
            false,
        ),
        option.bool("54605", "Shinobi Hood", 'Mode: [select] only\nShould the bot buy "Shinobi Hood" ?', false),
        option.bool("54675", "Shinobi Katana", 'Mode: [select] only\nShould the bot buy "Shinobi Katana" ?', false),
        option.bool(
            "54681",
            "Dual Shinobi Katanas",
            'Mode: [select] only\nShould the bot buy "Dual Shinobi Katanas" ?',
            false,
        ),
        option.bool("54586", "Battle Berserker", 'Mode: [select] only\nShould the bot buy "Battle Berserker" ?', false),
        option.bool(
            "54587",
            "Blooded Berserker",
            'Mode: [select] only\nShould the bot buy "Blooded Berserker" ?',
            false,
        ),
        option.bool(
            "54588",
            "Battle Berserker Faceguard",
            'Mode: [select] only\nShould the bot buy "Battle Berserker Faceguard" ?',
            false,
        ),
        option.bool(
            "54589",
            "Battle Berserker Helmet",
            'Mode: [select] only\nShould the bot buy "Battle Berserker Helmet" ?',
            false,
        ),
        option.bool(
            "54590",
            "Battle Berserker Horned Faceguard",
            'Mode: [select] only\nShould the bot buy "Battle Berserker Horned Faceguard" ?',
            false,
        ),
        option.bool(
            "54591",
            "Battle Berserker Horned Helmet",
            'Mode: [select] only\nShould the bot buy "Battle Berserker Horned Helmet" ?',
            false,
        ),
        option.bool(
            "54585",
            "Wee Training Dummy",
            'Mode: [select] only\nShould the bot buy "Wee Training Dummy" ?',
            false,
        ),
        option.bool("84104", "Draconic Cuirass", 'Mode: [select] only\nShould the bot buy "Draconic Cuirass" ?', false),
        option.bool(
            "84105",
            "Draconic Cuirass Helm",
            'Mode: [select] only\nShould the bot buy "Draconic Cuirass Helm" ?',
            false,
        ),
        option.bool(
            "84106",
            "Gold Draconic Cuirass Helm",
            'Mode: [select] only\nShould the bot buy "Gold Draconic Cuirass Helm" ?',
            false,
        ),
        option.bool(
            "84107",
            "Experienced Combatant Morph",
            'Mode: [select] only\nShould the bot buy "Experienced Combatant Morph" ?',
            false,
        ),
        option.bool(
            "84108",
            "Experienced Combatant Visage",
            'Mode: [select] only\nShould the bot buy "Experienced Combatant Visage" ?',
            false,
        ),
        option.bool(
            "84111",
            "Draconic Metamorphosis Morph",
            'Mode: [select] only\nShould the bot buy "Draconic Metamorphosis Morph" ?',
            false,
        ),
        option.bool(
            "84112",
            "Draconic Metamorphosis Visage",
            'Mode: [select] only\nShould the bot buy "Draconic Metamorphosis Visage" ?',
            false,
        ),
        option.bool(
            "84113",
            "Draconic Cuirass Cape",
            'Mode: [select] only\nShould the bot buy "Draconic Cuirass Cape" ?',
            false,
        ),
        option.bool("84115", "Steel Winglets", 'Mode: [select] only\nShould the bot buy "Steel Winglets" ?', false),
        option.bool(
            "84116",
            "Silver Stream Sword",
            'Mode: [select] only\nShould the bot buy "Silver Stream Sword" ?',
            false,
        ),
        option.bool(
            "84117",
            "Silver Stream Swords",
            'Mode: [select] only\nShould the bot buy "Silver Stream Swords" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HallofClassesMerge.select,
});

export default function main(): void {
    const script = new HallofClassesMerge();
    Core.bankingBlackList.push("Sword and Scroll Badge ");

    script.buyAllMerge();

    Core.setOptions(false);
}
