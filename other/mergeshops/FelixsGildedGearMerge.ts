/*
name: Felixs Gilded Gear Merge
description: This bot will farm the items belonging to the selected mode for the Felixs Gilded Gear Merge [2446] in /castleeblana
tags: felixs, gilded, gear, merge, castleeblana, gold, voucher, k, skye, warrior, warriors, cloak, speirling, warden, east, gaheris
*/
// Port of Scripts/Other/MergeShops/FelixsGildedGearMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class FelixsGildedGearMerge {
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
                case "Salvaged Skye Armament":
                    Core.farmingLogger(req.name, quant);
                    Core.killMonster("castleeblana", "r2", "Left", "Skye Warrior", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    bot.wait.forPickup(req.name);
                    break;
                case "Liquid Gold Solution":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(9742);
                        Core.equipClass(ClassType.Farm);
                        Core.killMonster("castleeblana", "r6", "Left", "*", "Gorta's Soul", 12, { log: false });
                        Core.killMonster("castleeblana", "r5", "Left", "*", "Raven's Bauble", 12, { log: false });
                        Core.equipClass(ClassType.Solo);
                        Core.killMonster(
                            "castleeblana",
                            "r10",
                            "Left",
                            "Warden Indradeep",
                            "Rainfall Inscription",
                            undefined,
                            { log: false },
                        );
                        Core.ensureComplete(9742);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("castleeblana", 2446, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("85901", "Skye Warrior", 'Mode: [select] only\nShould the bot buy "Skye Warrior" ?', false),
        option.bool(
            "85902",
            "Skye Warrior Mask",
            'Mode: [select] only\nShould the bot buy "Skye Warrior Mask" ?',
            false,
        ),
        option.bool(
            "85903",
            "Skye Warrior's Cloak",
            'Mode: [select] only\nShould the bot buy "Skye Warrior\'s Cloak" ?',
            false,
        ),
        option.bool("85904", "Speirling Blade", 'Mode: [select] only\nShould the bot buy "Speirling Blade" ?', false),
        option.bool("85905", "Speirling Blades", 'Mode: [select] only\nShould the bot buy "Speirling Blades" ?', false),
        option.bool(
            "85906",
            "Skye Warden of the East",
            'Mode: [select] only\nShould the bot buy "Skye Warden of the East" ?',
            false,
        ),
        option.bool(
            "85907",
            "Skye Warden of the East Mask",
            'Mode: [select] only\nShould the bot buy "Skye Warden of the East Mask" ?',
            false,
        ),
        option.bool(
            "85908",
            "Skye Warden of the East Cape",
            'Mode: [select] only\nShould the bot buy "Skye Warden of the East Cape" ?',
            false,
        ),
        option.bool(
            "85909",
            "Speirling Gaheris Blade",
            'Mode: [select] only\nShould the bot buy "Speirling Gaheris Blade" ?',
            false,
        ),
        option.bool(
            "85910",
            "Speirling Gaheris Blades",
            'Mode: [select] only\nShould the bot buy "Speirling Gaheris Blades" ?',
            false,
        ),
        option.bool(
            "86152",
            "Skye Warrior Hood",
            'Mode: [select] only\nShould the bot buy "Skye Warrior Hood" ?',
            false,
        ),
        option.bool("86153", "Skye Warden Hood", 'Mode: [select] only\nShould the bot buy "Skye Warden Hood" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FelixsGildedGearMerge.select,
});

export default function main(): void {
    const script = new FelixsGildedGearMerge();
    Core.bankingBlackList.push("Salvaged Skye Armament", "Liquid Gold Solution");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
