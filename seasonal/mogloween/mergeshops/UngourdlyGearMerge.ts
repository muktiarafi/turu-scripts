/*
name: Ungourdly Gear Merge
description: This bot will farm the items belonging to the selected mode for the Ungourdly Gear Merge [2629] in /eldritchbattletown
tags: ungourdly, gear, merge, eldritchbattletown, gold, voucher, k, great, calabaza, pumpkin, kings, revenge, fever, kabocha, king, naginata, wrath
*/
// Port of Scripts/Seasonal/Mogloween/MergeShops/UngourdlyGearMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreMogloween } from "../CoreMogloween";

const Adv = new CoreAdvanced();
const coreMogloween = new CoreMogloween();

export class UngourdlyGearMerge {
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
                //#region Items not setup
                case "Acromegalia Seed":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.registerQuests(Core.isMember ? 10457 : 10454);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("eldritchbattletown", "Kathool Kultist", "Tier 2 Kathool Member Card", 6, {
                            isTemp: false,
                        });
                        Core.huntMonster("eldritchbattletown", "Dzeza Cultist", "Tier 2 Dzeza Member Card", 6, {
                            isTemp: false,
                        });
                        Core.huntMonster("eldritchbattletown", "Harvest Acromegalia", "Gourd Twinning", undefined, {
                            isTemp: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                //#endregion
            }
        };
        coreMogloween.eldritchbattletown();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("eldritchbattletown", 2629, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("57304", "Gold Voucher 25k", 'Mode: [select] only\nShould the bot buy "Gold Voucher 25k" ?', false),
        option.bool(
            "89573",
            "Great Calabaza Blade",
            'Mode: [select] only\nShould the bot buy "Great Calabaza Blade" ?',
            false,
        ),
        option.bool(
            "89574",
            "Great Calabaza Blades",
            'Mode: [select] only\nShould the bot buy "Great Calabaza Blades" ?',
            false,
        ),
        option.bool(
            "89575",
            "Pumpkin King's Revenge",
            'Mode: [select] only\nShould the bot buy "Pumpkin King\'s Revenge" ?',
            false,
        ),
        option.bool(
            "89576",
            "Dual Pumpkin King's Revenge",
            'Mode: [select] only\nShould the bot buy "Dual Pumpkin King\'s Revenge" ?',
            false,
        ),
        option.bool(
            "89577",
            "Pumpkin Fever Staff",
            'Mode: [select] only\nShould the bot buy "Pumpkin Fever Staff" ?',
            false,
        ),
        option.bool(
            "89578",
            "Kabocha King Naginata",
            'Mode: [select] only\nShould the bot buy "Kabocha King Naginata" ?',
            false,
        ),
        option.bool(
            "89579",
            "Pumpkin Fever Axe",
            'Mode: [select] only\nShould the bot buy "Pumpkin Fever Axe" ?',
            false,
        ),
        option.bool(
            "89580",
            "Pumpkin Fever Axes",
            'Mode: [select] only\nShould the bot buy "Pumpkin Fever Axes" ?',
            false,
        ),
        option.bool(
            "89581",
            "Pumpkin King's Wrath",
            'Mode: [select] only\nShould the bot buy "Pumpkin King\'s Wrath" ?',
            false,
        ),
        option.bool(
            "89582",
            "Dual Pumpkin King's Wrath",
            'Mode: [select] only\nShould the bot buy "Dual Pumpkin King\'s Wrath" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: UngourdlyGearMerge.select,
});

export default function main(): void {
    const script = new UngourdlyGearMerge();
    Core.bankingBlackList.push("Acromegalia Seed");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
