/*
name: Nation Merge
description: This bot will farm the items belonging to the selected mode for the Nation Merge [1206] in /shadowblast
tags: nation, merge, shadowblast, polish, pet, soulstealer, horned, void, executioner, blood, star, archfiend
*/
// Port of Scripts/Nation/MergeShops/NationMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreNSOD } from "../../evil/nsod/CoreNSOD";
import { CoreNation } from "../CoreNation";
import { NationLoyaltyRewarded } from "../NationLoyaltyRewarded";

const Adv = new CoreAdvanced();
const Nation = new CoreNation();
const NLR = new NationLoyaltyRewarded();
const NSOD = new CoreNSOD();

export class NationMerge {
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
                //#region Known items
                case "Diamond Badge of Nulgath":
                    NLR.farmQuest([req.name], quant);
                    break;
                case "Emblem of Nulgath":
                    Nation.emblemofNulgath(quant);
                    break;
                case "Blood Gem of the Archfiend":
                    Nation.farmBloodGem(quant);
                    break;
                case "Totem of Nulgath":
                    Nation.farmTotemofNulgath(quant);
                    break;
                case "Void Aura":
                    NSOD.voidAuras(quant);
                    break;
                case "Archfiend's Favor":
                    Nation.approvalAndFavor(0, quant);
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shadowblast", 1206, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("33172", "Polish Pet", 'Mode: [select] only\nShould the bot buy "Polish Pet" ?', false),
        option.bool(
            "33176",
            "Nation Soulstealer",
            'Mode: [select] only\nShould the bot buy "Nation Soulstealer" ?',
            false,
        ),
        option.bool(
            "33177",
            "Nation SoulStealer Hood",
            'Mode: [select] only\nShould the bot buy "Nation SoulStealer Hood" ?',
            false,
        ),
        option.bool(
            "33178",
            "Nation SoulStealer Horned Hood",
            'Mode: [select] only\nShould the bot buy "Nation SoulStealer Horned Hood" ?',
            false,
        ),
        option.bool("33162", "Void Executioner", 'Mode: [select] only\nShould the bot buy "Void Executioner" ?', false),
        option.bool(
            "67269",
            "Blood Star of the Archfiend",
            'Mode: [select] only\nShould the bot buy "Blood Star of the Archfiend" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NationMerge.select,
});

export default function main(): void {
    const script = new NationMerge();
    Core.bankingBlackList.push(
        "Diamond Badge of Nulgath",
        "Emblem of Nulgath",
        "Blood Gem of the Archfiend",
        "Totem of Nulgath",
        "Void Aura",
        "Archfiend's Favor",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
