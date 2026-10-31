/*
name: Blood Moon Lycan Merge
description: This bot will farm the items belonging to the selected mode for the Blood Moon Lycan Merge [1488] in /bloodwarlycan
tags: blood, moon, lycan, merge, bloodwarlycan, alpha, surfboard, lunar, blaze, werepyre, warrior, morph, wings, weretato, pet
*/
// Port of Scripts/Other/MergeShops/BloodMoonLycanMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { BloodMoon } from "../../story/BloodMoon";

const Adv = new CoreAdvanced();
const BM = new BloodMoon();

export class BloodMoonLycanMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            const currentQuant = req.temp ? bot.tempInv.getQuantity(req.name) : bot.inventory.getQuantity(req.name);
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
                case "Sapphires":
                    Core.registerQuests(6070, 6071, 6073);
                    Core.logger(`Farming ${req.name} (${currentQuant}/${quant})`);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("bloodwarlycan", "Blood Guardian", "Vampire Medal", 5);
                        Core.huntMonster("bloodwarlycan", "Blood Guardian", "Mega Vampire Medal", 3);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Rubies":
                    Core.registerQuests(6068, 6069, 6072);
                    Core.logger(`Farming ${req.name} (${currentQuant}/${quant})`);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("bloodwarvamp", "Lunar Blazebinder", "Lycan Medal", 5);
                        Core.huntMonster("bloodwarvamp", "Lunar Blazebinder", "Mega Lycan Medal", 3);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        BM.bloodMoonSaga();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("bloodwarlycan", 1488, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "41788",
            "Alpha Lycan Surfboard",
            'Mode: [select] only\nShould the bot buy "Alpha Lycan Surfboard" ?',
            false,
        ),
        option.bool(
            "41789",
            "Lunar Blaze Surfboard",
            'Mode: [select] only\nShould the bot buy "Lunar Blaze Surfboard" ?',
            false,
        ),
        option.bool("41711", "Werepyre Warrior", 'Mode: [select] only\nShould the bot buy "Werepyre Warrior" ?', false),
        option.bool("41712", "Werepyre Morph", 'Mode: [select] only\nShould the bot buy "Werepyre Morph" ?', false),
        option.bool("41713", "Werepyre Wings", 'Mode: [select] only\nShould the bot buy "Werepyre Wings" ?', false),
        option.bool(
            "41714",
            "Werepyre Warrior Blade",
            'Mode: [select] only\nShould the bot buy "Werepyre Warrior Blade" ?',
            false,
        ),
        option.bool("41787", "Weretato Pet", 'Mode: [select] only\nShould the bot buy "Weretato Pet" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BloodMoonLycanMerge.select,
});

export default function main(): void {
    const script = new BloodMoonLycanMerge();
    Core.bankingBlackList.push("Sapphires", "Rubies");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
