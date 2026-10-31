/*
name: Deadfly Merge
description: This will get all or selected items on this merge shop.
tags: deadfly-merge, friday-the-13th, seasonal
*/
// Port of Scripts/Seasonal/Friday13th/MergeShops/DeadflyMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreFriday13th } from "../story/CoreFriday13th";

const Adv = new CoreAdvanced();
const F13 = new CoreFriday13th();

export class DeadflyMerge {
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
                case "Ragged Cloth Scrap":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8212);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Underworld Home Renovations 8212
                        Core.huntMonster("RotFinger", "Rotfinger", "Rotfinger Parts", 3);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Deadfly's Armor":

                case "Deadfly Morph":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("DeadFly", "Deadfly", req.name, undefined, { isTemp: false });
                    break;
                case "Rotfinger's Bow":

                case "Rotfinger's ArmBlades":

                case "Rotfinger's Scythe":

                case "Rotfinger's Staff":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("RotFinger", "Rotfinger", req.name, undefined, { isTemp: false });
                    break;
            }
        };
        F13.deadfly();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("deadfly", 2037, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("62803", "Necro Deadfly", 'Mode: [select] only\nShould the bot buy "Necro Deadfly" ?', false),
        option.bool(
            "62804",
            "Necro Deadfly's Morph",
            'Mode: [select] only\nShould the bot buy "Necro Deadfly\'s Morph" ?',
            false,
        ),
        option.bool(
            "62650",
            "Necrotfinger's Bow",
            'Mode: [select] only\nShould the bot buy "Necrotfinger\'s Bow" ?',
            false,
        ),
        option.bool(
            "62652",
            "Necrotfinger's ArmBlades",
            'Mode: [select] only\nShould the bot buy "Necrotfinger\'s ArmBlades" ?',
            false,
        ),
        option.bool(
            "62654",
            "Necrotfinger's Scythe",
            'Mode: [select] only\nShould the bot buy "Necrotfinger\'s Scythe" ?',
            false,
        ),
        option.bool(
            "62656",
            "Necrotfinger's Staff",
            'Mode: [select] only\nShould the bot buy "Necrotfinger\'s Staff" ?',
            false,
        ),
        option.bool("62802", "Doom Deadfly", 'Mode: [select] only\nShould the bot buy "Doom Deadfly" ?', false),
        option.bool(
            "62875",
            "Doom Deadfly's Morph",
            'Mode: [select] only\nShould the bot buy "Doom Deadfly\'s Morph" ?',
            false,
        ),
        option.bool(
            "62751",
            "Thirteenth Goalie Mask",
            'Mode: [select] only\nShould the bot buy "Thirteenth Goalie Mask" ?',
            false,
        ),
        option.bool(
            "62847",
            "Thirteenth Zard Pet",
            'Mode: [select] only\nShould the bot buy "Thirteenth Zard Pet" ?',
            false,
        ),
        option.bool(
            "62715",
            "BlackSkulls Weapon Kit",
            'Mode: [select] only\nShould the bot buy "BlackSkulls Weapon Kit" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DeadflyMerge.select,
});

export default function main(): void {
    const script = new DeadflyMerge();
    Core.bankingBlackList.push(
        "Ragged Cloth Scrap",
        "Deadfly's Armor",
        "Deadfly Morph",
        "Rotfinger's Bow",
        "Rotfinger's ArmBlades",
        "Rotfinger's Scythe",
        "Rotfinger's Staff ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
