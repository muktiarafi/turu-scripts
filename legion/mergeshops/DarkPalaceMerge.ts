/*
name: DarkPalaceMerge
description: null
tags: null
*/
// Port of Scripts/Legion/MergeShops/DarkPalaceMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();

export class DarkPalaceMerge {
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
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
                case "Axe Of Cerberus":

                case "Shadow of Cerberus":

                case "Flail Of Cerberus":

                case "Dark Palace Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("dagefortress", "Grrrberus", req.name, req.quantity, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("dagefortress", 1144, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("29583", "Screaming Might", 'Mode: [select] only\nShould the bot buy "Screaming Might" ?', false),
        option.bool(
            "29780",
            "Victor's Trophy Spear",
            'Mode: [select] only\nShould the bot buy "Victor\'s Trophy Spear" ?',
            false,
        ),
        option.bool(
            "29889",
            "Commander of Cerberus",
            'Mode: [select] only\nShould the bot buy "Commander of Cerberus" ?',
            false,
        ),
        option.bool(
            "29890",
            "General of Cerberus",
            'Mode: [select] only\nShould the bot buy "General of Cerberus" ?',
            false,
        ),
        option.bool(
            "29898",
            "Axe and Shield of Cerberus",
            'Mode: [select] only\nShould the bot buy "Axe and Shield of Cerberus" ?',
            false,
        ),
        option.bool(
            "29897",
            "Flail and Shield of Cerberus",
            'Mode: [select] only\nShould the bot buy "Flail and Shield of Cerberus" ?',
            false,
        ),
        option.bool("29903", "Hood Of Cerberus", 'Mode: [select] only\nShould the bot buy "Hood Of Cerberus" ?', false),
        option.bool(
            "29902",
            "Visage of Cerberus",
            'Mode: [select] only\nShould the bot buy "Visage of Cerberus" ?',
            false,
        ),
        option.bool(
            "29901",
            "Demon Helm of Cerberus",
            'Mode: [select] only\nShould the bot buy "Demon Helm of Cerberus" ?',
            false,
        ),
        option.bool(
            "29900",
            "Skull Helm of Cerberus",
            'Mode: [select] only\nShould the bot buy "Skull Helm of Cerberus" ?',
            false,
        ),
        option.bool(
            "29891",
            "Cloak of the Underworld",
            'Mode: [select] only\nShould the bot buy "Cloak of the Underworld" ?',
            false,
        ),
        option.bool(
            "29893",
            "Underworld Watchdog",
            'Mode: [select] only\nShould the bot buy "Underworld Watchdog" ?',
            false,
        ),
        option.bool(
            "29892",
            "Pre-furred Cape of Cerberus",
            'Mode: [select] only\nShould the bot buy "Pre-furred Cape of Cerberus" ?',
            false,
        ),
        option.bool("29894", "Cerberus' Bane", 'Mode: [select] only\nShould the bot buy "Cerberus\' Bane" ?', false),
        option.bool(
            "29899",
            "Skull Of Cerberus",
            'Mode: [select] only\nShould the bot buy "Skull Of Cerberus" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DarkPalaceMerge.select,
});

export default function main(): void {
    const script = new DarkPalaceMerge();
    Core.bankingBlackList.push(
        "Dark Palace Token",
        "Shadow of Cerberus",
        "Legion Token",
        "Axe Of Cerberus",
        "Flail Of Cerberus ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
