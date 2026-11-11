/*
name: Lothian Treasury Merge
description: This bot will farm the items belonging to the selected mode for the Lothian Treasury Merge [2475] in /queeniona
tags: lothian, treasury, merge, queeniona, dark, thunder, master, long, lightning, gloria, scarf, crownslayer, bananach, galvanic, tyrant, tyrants, stormkings, storm, bolt, sovereign, storms
*/
// Port of Scripts/Other/MergeShops/LothianTreasuryMerge.cs.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { ColdThunderMerge } from "./ColdThunderMerge";
import { FelixsGildedGearMerge } from "./FelixsGildedGearMerge";
import { LiaTaraHillLootMerge } from "./LiaTaraHillLootMerge";
import { LoughshineLootMerge } from "./LoughshineLootMerge";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";
import { QueenIona } from "../../ultrasv3/dependenciesmerge/QueenIona";

const QI = new QueenIona();
const Adv = new CoreAdvanced();
const AOR = new CoreAOR();
const FGGM = new FelixsGildedGearMerge();
const LLM = new LoughshineLootMerge();
const LTHLM = new LiaTaraHillLootMerge();
const CTM = new ColdThunderMerge();

export class LothianTreasuryMerge {
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
                case "Lothian's Lightning":

                case "Dark Thunder Master Locks":

                case "Dark Lightning Gloria":

                case "Skye Nobility Sash":
                    Core.farmingLogger(req.name, quant);
                    QI.fight(req.name, req.quantity, true);
                    break;
                case "Skye's Lightning":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9834);
                    AOR.coldThunderBoss(req.name, quant, false);
                    bot.wait.forPickup(req.name);
                    break;

                case "Priestess Eire's Cletiné":
                    Core.farmingLogger(req.name, quant);
                    AOR.coldThunderBoss(req.name, quant, false);
                    break;
                case "Skye Warden of the East":
                    Core.farmingLogger(req.name, quant);
                    FGGM.buyAllMerge(req.name);
                    break;
                case "Skye Warden of the West":
                    Core.farmingLogger(req.name, quant);
                    LLM.buyAllMerge(req.name);
                    break;
                case "Skye Warden of the South":
                    Core.farmingLogger(req.name, quant);
                    LTHLM.buyAllMerge(req.name);
                    break;
                case "Queen Iona's Royal Attire":
                    Core.farmingLogger(req.name, quant);
                    CTM.buyAllMerge(req.name);
                    break;
            }
        };
        AOR.terminaTemple(undefined, true);
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("queeniona", 2475, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "86834",
            "Dark Thunder Master",
            'Mode: [select] only\nShould the bot buy "Dark Thunder Master" ?',
            false,
        ),
        option.bool(
            "86837",
            "Dark Thunder Master Long Locks",
            'Mode: [select] only\nShould the bot buy "Dark Thunder Master Long Locks" ?',
            false,
        ),
        option.bool(
            "86841",
            "Dark Lightning Gloria and Scarf",
            'Mode: [select] only\nShould the bot buy "Dark Lightning Gloria and Scarf" ?',
            false,
        ),
        option.bool(
            "87926",
            "Crownslayer Bananach",
            'Mode: [select] only\nShould the bot buy "Crownslayer Bananach" ?',
            false,
        ),
        option.bool("86844", "Galvanic Tyrant", 'Mode: [select] only\nShould the bot buy "Galvanic Tyrant" ?', false),
        option.bool("86845", "Galvanic Tyrants", 'Mode: [select] only\nShould the bot buy "Galvanic Tyrants" ?', false),
        option.bool(
            "87950",
            "StormKing's Storm Bolt",
            'Mode: [select] only\nShould the bot buy "StormKing\'s Storm Bolt" ?',
            false,
        ),
        option.bool(
            "87713",
            "Sovereign of Storms",
            'Mode: [select] only\nShould the bot buy "Sovereign of Storms" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LothianTreasuryMerge.select,
});

export default function main(): void {
    const script = new LothianTreasuryMerge();
    Core.bankingBlackList.push(
        "Lothian's Lightning",
        "Skye's Lightning",
        "Dark Thunder Master Locks",
        "Dark Lightning Gloria",
        "Skye Nobility Sash",
        "Priestess Eire's Cletiné",
        "Skye Warden of the East",
        "Skye Warden of the West",
        "Skye Warden of the South",
        "Queen Iona's Royal Attire",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
