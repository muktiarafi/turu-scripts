/*
name: Dark Hunt Merge
description: This bot will farm the items belonging to the selected mode for the Dark Hunt Merge [1102] in /darkfortress
tags: dark, hunt, merge, darkfortress, bone, crusher, knight, skull, centurion, cocar, dos, mortosvivos, dançarinos
*/
// Port of Scripts/Legion/MergeShops/DarkHuntMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();

export class DarkHuntMerge {
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
                case "Ultra Shifting Plane Gem":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("darkfortress", "r3", "Left", "*", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Cocar dos Dançarinos":

                case "Dançarinos da Legião":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("darkfortress", "Dage the Evil", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Dage's Favor":
                    Core.farmingLogger(req.name, quant);
                    Legion.approvalAndFavor(0, quant);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("darkfortress", 1102, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "28667",
            "Bone Crusher Knight",
            'Mode: [select] only\nShould the bot buy "Bone Crusher Knight" ?',
            false,
        ),
        option.bool(
            "28668",
            "Skull Crusher Helm",
            'Mode: [select] only\nShould the bot buy "Skull Crusher Helm" ?',
            false,
        ),
        option.bool(
            "28669",
            "Centurion Bone Crusher",
            'Mode: [select] only\nShould the bot buy "Centurion Bone Crusher" ?',
            false,
        ),
        option.bool(
            "28670",
            "Centurion Bone Crusher Helm",
            'Mode: [select] only\nShould the bot buy "Centurion Bone Crusher Helm" ?',
            false,
        ),
        option.bool(
            "92242",
            "Cocar dos Mortos-Vivos",
            'Mode: [select] only\nShould the bot buy "Cocar dos Mortos-Vivos" ?',
            false,
        ),
        option.bool(
            "92241",
            "Dançarinos Mortos-Vivos",
            'Mode: [select] only\nShould the bot buy "Dançarinos Mortos-Vivos" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DarkHuntMerge.select,
});

export default function main(): void {
    const script = new DarkHuntMerge();
    Core.bankingBlackList.push(
        "Ultra Shifting Plane Gem",
        "Cocar dos Dançarinos",
        "Dage's Favor",
        "Dançarinos da Legião",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
