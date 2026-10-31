/*
name: CrownsreachDefenseMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/CrownsreachDefenseMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { ShadowflameWarMedal } from "../ShadowflameWarMedal";
import { CoreSoC } from "../../story/shadowsofchaos/CoreSoC";
import { CoreSoW } from "../../story/shadowsofwar/CoreSoW";

const Adv = new CoreAdvanced();
const SoW = new CoreSoW();
const SoC = new CoreSoC();
const SWM = new ShadowflameWarMedal();

export class CrownsreachDefenseMerge {
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
                case "ShadowFlame War Medal":
                    SWM.medals(quant);
                    break;
            }
        };
        SoW.shadowWar();
        SoC.dualPlane();
        Adv.startBuyAllMerge("chaosamulet", 1914, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "54290",
            "ShadowFlame Warlock",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Warlock" ?',
            false,
        ),
        option.bool(
            "54292",
            "ShadowFlame Warlock's Hat",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Warlock\'s Hat" ?',
            false,
        ),
        option.bool(
            "54293",
            "ShadowFlame Warlock's Hat + Locks",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Warlock\'s Hat + Locks" ?',
            false,
        ),
        option.bool(
            "54294",
            "ShadowFlame Warlock's Topper",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Warlock\'s Topper" ?',
            false,
        ),
        option.bool(
            "54295",
            "ShadowFlame Warlock's Topper + Locks",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Warlock\'s Topper + Locks" ?',
            false,
        ),
        option.bool(
            "54300",
            "ShadowFlame Warlock's Scythe",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Warlock\'s Scythe" ?',
            false,
        ),
        option.bool(
            "54259",
            "ShadowFlame Battle Staff",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Battle Staff" ?',
            false,
        ),
        option.bool(
            "54261",
            "ShadowFlame Battle Spear",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Battle Spear" ?',
            false,
        ),
        option.bool(
            "54302",
            "Shadow Warlock Commander",
            'Mode: [select] only\nShould the bot buy "Shadow Warlock Commander" ?',
            false,
        ),
        option.bool(
            "54303",
            "Shadow Commander's Hat",
            'Mode: [select] only\nShould the bot buy "Shadow Commander\'s Hat" ?',
            false,
        ),
        option.bool(
            "54304",
            "Shadow Commander's Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Shadow Commander\'s Hat + Locks" ?',
            false,
        ),
        option.bool(
            "54305",
            "Shadow Commander's Skull Hat",
            'Mode: [select] only\nShould the bot buy "Shadow Commander\'s Skull Hat" ?',
            false,
        ),
        option.bool(
            "54306",
            "Shadow Commander's Topper",
            'Mode: [select] only\nShould the bot buy "Shadow Commander\'s Topper" ?',
            false,
        ),
        option.bool(
            "54307",
            "Shadow Commander's Topper + Locks",
            'Mode: [select] only\nShould the bot buy "Shadow Commander\'s Topper + Locks" ?',
            false,
        ),
        option.bool(
            "54308",
            "Shadow Commander's Skull Topper",
            'Mode: [select] only\nShould the bot buy "Shadow Commander\'s Skull Topper" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CrownsreachDefenseMerge.select,
});

export default function main(): void {
    const script = new CrownsreachDefenseMerge();
    Core.bankingBlackList.push("ShadowFlame War Medal ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
