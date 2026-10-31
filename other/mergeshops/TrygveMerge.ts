/*
name: TrygveMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/TrygveMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreHollowbornStory } from "../../story/hollowborn/CoreHollowbornStory";

const Adv = new CoreAdvanced();
const HB = new CoreHollowbornStory();

export class TrygveMerge {
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
                case "Vindicator Badge":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8299);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.killMonster("trygve", "r3", "Left", "Blood Eagle", "Eagle Heart", 8);
                        Core.killMonster("trygve", "r4", "Left", "Rune Boar", "Boar Heart", 8);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("trygve", "Gramiel", "Vindicator Seal");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Silver Vindicator Sword":

                case "Silver Vindicator Swords":

                case "Silver Vindicator Hood":

                case "Silver Vindicator Recruit":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("trygve", "Vindicator Recruit", req.name, quant, { isTemp: req.temp });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Silver Vindicator Blade":

                case "Silver Vindicator Helm":

                case "Silver Vindicator Soldier":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("trygve", "Vindicator Soldier", req.name, quant, { isTemp: req.temp });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Dawn Vindicator Lieutenant Helm":

                case "Dawn Vindicator Lieutenant":

                case "Silver Vindicator Bow":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("trygve", "Gramiel", req.name, quant, { isTemp: req.temp });
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        HB.trygve();
        Adv.startBuyAllMerge("trygve", 2054, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "63936",
            "Dawn Vindicator Recruit",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator Recruit" ?',
            false,
        ),
        option.bool(
            "63995",
            "Dawn Vindicator Hood",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator Hood" ?',
            false,
        ),
        option.bool(
            "63980",
            "Dawn Vindicator Sword",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator Sword" ?',
            false,
        ),
        option.bool(
            "63939",
            "Dawn Vindicator Soldier",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator Soldier" ?',
            false,
        ),
        option.bool(
            "63940",
            "Dawn Vindicator Helm",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator Helm" ?',
            false,
        ),
        option.bool(
            "63979",
            "Dawn Vindicator Blade",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator Blade" ?',
            false,
        ),
        option.bool(
            "63981",
            "Dawn Vindicator Bow",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator Bow" ?',
            false,
        ),
        option.bool(
            "63989",
            "Dawn Vindicator Captain",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator Captain" ?',
            false,
        ),
        option.bool(
            "63990",
            "Dawn Vindicator Captain Helm",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator Captain Helm" ?',
            false,
        ),
        option.bool(
            "63985",
            "Dawn Vindicator Inquisitor",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator Inquisitor" ?',
            false,
        ),
        option.bool(
            "63986",
            "Dawn Vindicator Inquisitor Helm",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator Inquisitor Helm" ?',
            false,
        ),
        option.bool(
            "90204",
            "Dawn Vindicator Swords",
            'Mode: [select] only\nShould the bot buy "Dawn Vindicator Swords" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TrygveMerge.select,
});

export default function main(): void {
    const script = new TrygveMerge();
    Core.bankingBlackList.push(
        "Vindicator Badge",
        "Silver Vindicator Recruit",
        "Silver Vindicator Hood",
        "Silver Vindicator Sword",
        "Silver Vindicator Soldier",
        "Silver Vindicator Helm",
        "Silver Vindicator Blade",
        "Silver Vindicator Bow",
        "Dawn Vindicator Lieutenant",
        "Dawn Vindicator Lieutenant Helm ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
