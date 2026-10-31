/*
name: Daibh's Merge
description: Farms the materials needed for Daibh's Merge in luck.
tags: luck, seasonal, daibh's merge, shamrock, fair, merge
*/
// Port of Scripts/Seasonal/LuckyDay/DaibhsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../../legion/CoreLegion";

const Adv = new CoreAdvanced();
const Leg = new CoreLegion();

export class DaibhsMerge {
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
                case "Golden Ticket":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.join("luck");
                        Core.sendPackets("%xt%zm%getMapItem%10173%101%");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Makai Token":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.join("luck");
                        Core.sendPackets("%xt%zm%getMapItem%10173%5679%");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Legion Token":
                    Leg.farmLegionToken(quant);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("luck", 1565, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("43097", "Dark Void Monk", 'Mode: [select] only\nShould the bot buy "Dark Void Monk" ?', false),
        option.bool("43180", "Dark Void Knight", 'Mode: [select] only\nShould the bot buy "Dark Void Knight" ?', false),
        option.bool("43135", "Legion Fan", 'Mode: [select] only\nShould the bot buy "Legion Fan" ?', false),
        option.bool("43138", "Dual Legion Fans", 'Mode: [select] only\nShould the bot buy "Dual Legion Fans" ?', false),
        option.bool(
            "43193",
            "Void Monk's Flame",
            'Mode: [select] only\nShould the bot buy "Void Monk\'s Flame" ?',
            false,
        ),
        option.bool(
            "43194",
            "Void Knight's Blade",
            'Mode: [select] only\nShould the bot buy "Void Knight\'s Blade" ?',
            false,
        ),
        option.bool(
            "47764",
            "Dual Lucky Caladbolgs",
            'Mode: [select] only\nShould the bot buy "Dual Lucky Caladbolgs" ?',
            false,
        ),
        option.bool(
            "47765",
            "Lucky Paragon Pet",
            'Mode: [select] only\nShould the bot buy "Lucky Paragon Pet" ?',
            false,
        ),
        option.bool(
            "47802",
            "Lucky Paragon Plate",
            'Mode: [select] only\nShould the bot buy "Lucky Paragon Plate" ?',
            false,
        ),
        option.bool(
            "47803",
            "Lucky Paragon Helm",
            'Mode: [select] only\nShould the bot buy "Lucky Paragon Helm" ?',
            false,
        ),
        option.bool(
            "47804",
            "Lucky Paragon Cape",
            'Mode: [select] only\nShould the bot buy "Lucky Paragon Cape" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DaibhsMerge.select,
});

export default function main(): void {
    const script = new DaibhsMerge();
    Core.bankingBlackList.push("Golden Ticket", "Makai Token", "Legion Token");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
