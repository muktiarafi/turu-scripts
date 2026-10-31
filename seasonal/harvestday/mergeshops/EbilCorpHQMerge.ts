/*
name: Ebil Corp HQ Merge
description: This will get all or selected items on this merge shop.
tags: ebil-corp-hq-merge, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/MergeShops/EbilCorpHQMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreHarvestDay } from "../CoreHarvestDay";

const Adv = new CoreAdvanced();
const HarvestDay = new CoreHarvestDay();

export class EbilHQMerge {
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
                case "EbilCoin":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    //Core.RegisterQuests(8408); // Problem Exists Between Chairman and Keyboard
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(8408);
                        Core.huntMonster("ebilcorphq", "Master Chairman", "Master Chairman Destroyed (again)", 10);
                        Core.ensureCompleteMulti(8408);
                    }
                    //Core.CancelRegisteredQuests();
                    break;
                case "Ebil Operative":

                case "Ebil Operative Hair + Mask":

                case "Ebil Operative Protective Gear":

                case "Ebil Operative Hair + Muffler":

                case "Ebil Operative Hair + Scarf":

                case "Ebil Operative Edgy Hair + Mask":

                case "Ebil Operative Edgy Protective Gear":

                case "Ebil Operative Edgy Hair + Scarf":

                case "Ebil Operative Edgy Hair + Muffler":

                case "Ebil Operative Mask Helm":

                case "Ebil Operative Helm + Scarf":

                case "Ebil Operative Hood + Mask":

                case "Ebil Operative Crossed Baton Blades":

                case "Ebil Operative Cape":

                case "Ebil Operative Baton Blade":

                case "Ebil Operative Death Blade":

                case "Ebil Operative Long Baton":

                case "Ebil Operative Tactical Rifle":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("ebilcorphq", "Master Chairman", req.name, undefined, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        HarvestDay.ebilCorpHQ();

        Core.addDrop(...this.neededItems);
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("ebilcorphq", 2067, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "65106",
            "Prismatic Ebil Operative",
            'Mode: [select] only\nShould the bot buy "Prismatic Ebil Operative" ?',
            false,
        ),
        option.bool(
            "65107",
            "Prismatic Operative Hair + Mask",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Hair + Mask" ?',
            false,
        ),
        option.bool(
            "65108",
            "Prismatic Operative Protective Gear",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Protective Gear" ?',
            false,
        ),
        option.bool(
            "65109",
            "Prismatic Operative Hair + Muffler",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Hair + Muffler" ?',
            false,
        ),
        option.bool(
            "65110",
            "Prismatic Operative Hair + Scarf",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Hair + Scarf" ?',
            false,
        ),
        option.bool(
            "65111",
            "Prismatic Operative Edgy Hair + Mask",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Edgy Hair + Mask" ?',
            false,
        ),
        option.bool(
            "65112",
            "Prismatic Operative Edgy Protective Gear",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Edgy Protective Gear" ?',
            false,
        ),
        option.bool(
            "65113",
            "Prismatic Operative Edgy Hair + Scarf",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Edgy Hair + Scarf" ?',
            false,
        ),
        option.bool(
            "65114",
            "Prismatic Operative Edgy Hair + Muffler",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Edgy Hair + Muffler" ?',
            false,
        ),
        option.bool(
            "65115",
            "Prismatic Operative's Masked Helm",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative\'s Masked Helm" ?',
            false,
        ),
        option.bool(
            "65116",
            "Prismatic Operative Helm + Scarf",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Helm + Scarf" ?',
            false,
        ),
        option.bool(
            "65117",
            "Prismatic Operative Hooded Mask",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Hooded Mask" ?',
            false,
        ),
        option.bool(
            "65118",
            "Prismatic Operative Crossed Baton Blades",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Crossed Baton Blades" ?',
            false,
        ),
        option.bool(
            "65119",
            "Prismatic Operative Cape",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Cape" ?',
            false,
        ),
        option.bool(
            "65120",
            "Prismatic Operative Baton Blade",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Baton Blade" ?',
            false,
        ),
        option.bool(
            "65121",
            "Prismatic Operative Death Blade",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Death Blade" ?',
            false,
        ),
        option.bool(
            "65122",
            "Prismatic Operative Long Baton",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Long Baton" ?',
            false,
        ),
        option.bool(
            "65123",
            "Prismatic Operative Tactical Rifle",
            'Mode: [select] only\nShould the bot buy "Prismatic Operative Tactical Rifle" ?',
            false,
        ),
    ];

    neededItems: string[] = [
        "EbilCoin",
        "Ebil Operative",
        "Ebil Operative Hair + Mask",
        "Ebil Operative Protective Gear",
        "Ebil Operative Hair + Muffler",
        "Ebil Operative Hair + Scarf",
        "Ebil Operative Edgy Hair + Mask",
        "Ebil Operative Edgy Protective Gear",
        "Ebil Operative Edgy Hair + Scarf",
        "Ebil Operative Edgy Hair + Muffler",
        "Ebil Operative Mask Helm",
        "Ebil Operative Helm + Scarf",
        "Ebil Operative Hood + Mask",
        "Ebil Operative Crossed Baton Blades",
        "Ebil Operative Cape",
        "Ebil Operative Baton Blade",
        "Ebil Operative Death Blade",
        "Ebil Operative Long Baton",
        "Ebil Operative Tactical Rifle",
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: EbilHQMerge.select,
});

export default function main(): void {
    const script = new EbilHQMerge();
    Core.bankingBlackList.push(...script.neededItems);
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
