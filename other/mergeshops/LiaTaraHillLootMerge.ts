/*
name: LiaTaraHill Loot Merge
description: This bot will farm the items belonging to the selected mode for the LiaTaraHill Loot Merge [2460] in /liatarahill
tags: liatarahill, loot, merge, liatarahill, gold, voucher, k, skye, cailleach, plasma, orbs, warden, south, wardens, ornate, obelisk, shattered
*/
// Port of Scripts/Other/MergeShops/LiaTaraHillLootMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();

export class LiaTaraHillLootMerge {
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
                    break;
                case "Golden Catalyst":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9815);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("liatarahill", "Undead Garde", "Garde's Brooch", 9, { log: false });
                        Core.huntMonster("liatarahill", "Garde Wraith", "Ghost Blossoms", 9, { log: false });
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("liatarahill", "Warden Illaria", "Illaria's Amulet", undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Plasma Orb":

                case "Drained Skye Obelisk":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("liatarahill", "Warden Illaria", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
            }
        };
        AOR.liaTaraHill();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("liatarahill", 2460, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("86350", "Skye Cailleach", 'Mode: [select] only\nShould the bot buy "Skye Cailleach" ?', false),
        option.bool(
            "86351",
            "Skye Cailleach Hood",
            'Mode: [select] only\nShould the bot buy "Skye Cailleach Hood" ?',
            false,
        ),
        option.bool("86558", "Plasma Orbs", 'Mode: [select] only\nShould the bot buy "Plasma Orbs" ?', false),
        option.bool(
            "86352",
            "Skye Warden of the South",
            'Mode: [select] only\nShould the bot buy "Skye Warden of the South" ?',
            false,
        ),
        option.bool(
            "86353",
            "Skye Warden's Ornate Mask",
            'Mode: [select] only\nShould the bot buy "Skye Warden\'s Ornate Mask" ?',
            false,
        ),
        option.bool("87186", "Skye Obelisk", 'Mode: [select] only\nShould the bot buy "Skye Obelisk" ?', false),
        option.bool(
            "87185",
            "Shattered Skye Obelisk",
            'Mode: [select] only\nShould the bot buy "Shattered Skye Obelisk" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LiaTaraHillLootMerge.select,
});

export default function main(): void {
    const script = new LiaTaraHillLootMerge();
    Core.bankingBlackList.push("Salvaged Skye Armament", "Golden Catalyst", "Plasma Orb", "Drained Skye Obelisk");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
