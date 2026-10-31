/*
name: Aiwass Blessings Merge
description: This bot will farm the items belonging to the selected mode for the Aiwass Blessings Merge [2619] in /sanctuaryaiwass
tags: aiwass, blessings, merge, sanctuaryaiwass, adamas, tenebris, warrior, rex, morph, horns, farblight, spines, ex, unbreakable, fist, fists, enchanted
*/
// Port of Scripts/Other/MergeShops/AiwassBlessingsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const AOR = new CoreAOR();

export class AiwassBlessingsMerge {
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
                //#region Gold
                case "Gold Voucher 100K":
                    Farm.voucher(req.name, req.quantity);
                    break;
                //#endregion
                //#region Yew Ember
                case "Yew Ember":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("warwickforest", "Rubedo Elemental", req.name, quant, { isTemp: false });
                    break;
                //#endregion
                //#region Aiwass Diamond
                case "Aiwass Diamond": {
                    const questID = Core.isMember ? 10387 : 10385;
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(questID);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("sanctuaryaiwass", "r9", "Top", "*", "Sal Alembroth", 1, { isTemp: false });
                        Core.killMonster("sanctuaryaiwass", "r9", "Top", "*", "Milk of Sulfur", 1, { isTemp: false });
                        Core.huntMonster("sanctuaryaiwass", "Anima Animus Aiwass", "Aeon Dream", 1, { isTemp: false });
                    }
                    Core.cancelRegisteredQuests();
                    break;
                }
                //#endregion
                //#region Drow Silver
                case "Drow Silver":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("thelimacity", "Drow Soldier", req.name, quant, { isTemp: false });
                    break;
                //#endregion
                //#region Drow, Hair, Locks, Farblight, Enchanted
                case "Adamas Tenebris Drow":

                case "Adamas Tenebris Hair":

                case "Adamas Tenebris Locks":

                case "Enchanted Tenebris Drow":

                case "Enchanted Tenebris Hair":

                case "Enchanted Tenebris Locks":

                case "Farblight Fur":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("sanctuaryaiwass", "Anima Animus Aiwass", req.name, req.quantity, {
                        isTemp: req.temp,
                    });
                    break;
                //#endregion
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
            }
        };
        AOR.sanctuaryAiwass();
        Adv.startBuyAllMerge("sanctuaryaiwass", 2619, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool(
            "95216",
            "Adamas Tenebris Warrior",
            'Mode: [select] only\nShould the bot buy "Adamas Tenebris Warrior" ?',
            false,
        ),
        option.bool(
            "95217",
            "Adamas Tenebris Rex",
            'Mode: [select] only\nShould the bot buy "Adamas Tenebris Rex" ?',
            false,
        ),
        option.bool(
            "95220",
            "Adamas Tenebris Morph",
            'Mode: [select] only\nShould the bot buy "Adamas Tenebris Morph" ?',
            false,
        ),
        option.bool(
            "95221",
            "Adamas Tenebris Visage",
            'Mode: [select] only\nShould the bot buy "Adamas Tenebris Visage" ?',
            false,
        ),
        option.bool(
            "95222",
            "Adamas Tenebris Helm",
            'Mode: [select] only\nShould the bot buy "Adamas Tenebris Helm" ?',
            false,
        ),
        option.bool(
            "95223",
            "Adamas Tenebris Horns",
            'Mode: [select] only\nShould the bot buy "Adamas Tenebris Horns" ?',
            false,
        ),
        option.bool("95225", "Farblight Spines", 'Mode: [select] only\nShould the bot buy "Farblight Spines" ?', false),
        option.bool(
            "95226",
            "Ex Tenebris Blade",
            'Mode: [select] only\nShould the bot buy "Ex Tenebris Blade" ?',
            false,
        ),
        option.bool("95227", "Dual Ex Tenebris", 'Mode: [select] only\nShould the bot buy "Dual Ex Tenebris" ?', false),
        option.bool(
            "95228",
            "Unbreakable Adamas Fist",
            'Mode: [select] only\nShould the bot buy "Unbreakable Adamas Fist" ?',
            false,
        ),
        option.bool(
            "95229",
            "Unbreakable Adamas Fists",
            'Mode: [select] only\nShould the bot buy "Unbreakable Adamas Fists" ?',
            false,
        ),
        option.bool(
            "95246",
            "Enchanted Tenebris Warrior",
            'Mode: [select] only\nShould the bot buy "Enchanted Tenebris Warrior" ?',
            false,
        ),
        option.bool(
            "95247",
            "Enchanted Tenebris Rex",
            'Mode: [select] only\nShould the bot buy "Enchanted Tenebris Rex" ?',
            false,
        ),
        option.bool(
            "95250",
            "Enchanted Tenebris Morph",
            'Mode: [select] only\nShould the bot buy "Enchanted Tenebris Morph" ?',
            false,
        ),
        option.bool(
            "95251",
            "Enchanted Tenebris Visage",
            'Mode: [select] only\nShould the bot buy "Enchanted Tenebris Visage" ?',
            false,
        ),
        option.bool(
            "95252",
            "Enchanted Tenebris Helm",
            'Mode: [select] only\nShould the bot buy "Enchanted Tenebris Helm" ?',
            false,
        ),
        option.bool(
            "95253",
            "Enchanted Tenebris Horns",
            'Mode: [select] only\nShould the bot buy "Enchanted Tenebris Horns" ?',
            false,
        ),
        option.bool(
            "95256",
            "Enchanted Ex Tenebris",
            'Mode: [select] only\nShould the bot buy "Enchanted Ex Tenebris" ?',
            false,
        ),
        option.bool(
            "95257",
            "Enchanted Dual Ex Tenebris",
            'Mode: [select] only\nShould the bot buy "Enchanted Dual Ex Tenebris" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AiwassBlessingsMerge.select,
});

export default function main(): void {
    const script = new AiwassBlessingsMerge();
    Core.bankingBlackList.push(
        "Yew Ember",
        "Aiwass Diamond",
        "Drow Silver",
        "Adamas Tenebris Drow",
        "Adamas Tenebris Hair",
        "Adamas Tenebris Locks",
        "Farblight Fur",
        "Enchanted Tenebris Drow",
        "Enchanted Tenebris Hair",
        "Enchanted Tenebris Locks",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
