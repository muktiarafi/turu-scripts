/*
name: DarkbloodWarMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/DarkbloodWarMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreQOM } from "../../story/queenofmonsters/CoreQoM";

const Adv = new CoreAdvanced();
const QOM = new CoreQOM();

export class DarkbloodWarMerge {
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
                case "Darkblood War Medal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5874, 5875);
                    //Acolyte's Medallions 5874, Acolyte's Mega Medallions 5875
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("kolyaban", "r2", "Left", "*", "Acolyte's Medallion", 4);
                        Core.killMonster("kolyaban", "r2", "Left", "*", "Acolyte's Mega Medallion", 2);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        QOM.completeEverything();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("kolyaban", 1420, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("40270", "Eremon's Armor", 'Mode: [select] only\nShould the bot buy "Eremon\'s Armor" ?', false),
        option.bool(
            "40154",
            "Anti-Kolyaban Armor",
            'Mode: [select] only\nShould the bot buy "Anti-Kolyaban Armor" ?',
            false,
        ),
        option.bool(
            "40156",
            "Anti-Kolyaban Helm",
            'Mode: [select] only\nShould the bot buy "Anti-Kolyaban Helm" ?',
            false,
        ),
        option.bool(
            "40157",
            "Anti-Kolyaban Cape",
            'Mode: [select] only\nShould the bot buy "Anti-Kolyaban Cape" ?',
            false,
        ),
        option.bool(
            "40155",
            "Anti-Kolyaban Trident",
            'Mode: [select] only\nShould the bot buy "Anti-Kolyaban Trident" ?',
            false,
        ),
        option.bool("40091", "Reshaper", 'Mode: [select] only\nShould the bot buy "Reshaper" ?', false),
        option.bool("40092", "Reshaper Sword", 'Mode: [select] only\nShould the bot buy "Reshaper Sword" ?', false),
        option.bool("40277", "Reshaper Swords", 'Mode: [select] only\nShould the bot buy "Reshaper Swords" ?', false),
        option.bool("40093", "Reshaper Hair", 'Mode: [select] only\nShould the bot buy "Reshaper Hair" ?', false),
        option.bool("40094", "Reshaper Helm", 'Mode: [select] only\nShould the bot buy "Reshaper Helm" ?', false),
        option.bool(
            "40095",
            "Horned Reshaper Helm",
            'Mode: [select] only\nShould the bot buy "Horned Reshaper Helm" ?',
            false,
        ),
        option.bool("40096", "Reshaper Hood", 'Mode: [select] only\nShould the bot buy "Reshaper Hood" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DarkbloodWarMerge.select,
});

export default function main(): void {
    const script = new DarkbloodWarMerge();
    Core.bankingBlackList.push("Darkblood War Medal ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
