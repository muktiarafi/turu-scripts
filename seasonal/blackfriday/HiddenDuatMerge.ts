/*
name: HiddenDuat Merge
description: This bot will farm the items belonging to the selected mode for the HiddenDuat Merge [2501] in /hiddenduat
tags: hiddenduat, merge, hiddenduat, apophis, medjai, bangs, morph, horned, dark, umbral, scythe, aaru, bow
*/
// Port of Scripts/Seasonal/BlackFriday/HiddenDuatMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreShadowofDoom } from "./shadowofdoom/CoreShadowofDoom";

const Adv = new CoreAdvanced();
const CSoD = new CoreShadowofDoom();

export class HiddenDuatMerge {
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
                case "Crown of Chaos":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9965);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("hiddenduat", "Anubian Overseer", "Duanmutef Glyph", 6, { log: false });
                        Core.huntMonster("hiddenduat", "Pharaoh Neith", "Neith's Uraeus", undefined, { log: false });
                        Core.huntMonster("hiddenduat", "Umbral Chaos", "Apophis' Violet Favor", undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        CSoD.hiddenDuat();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("hiddenduat", 2501, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("88090", "Apophis Medjai", 'Mode: [select] only\nShould the bot buy "Apophis Medjai" ?', false),
        option.bool(
            "88091",
            "Apophis Medjai Hair",
            'Mode: [select] only\nShould the bot buy "Apophis Medjai Hair" ?',
            false,
        ),
        option.bool(
            "88092",
            "Apophis Medjai Locks",
            'Mode: [select] only\nShould the bot buy "Apophis Medjai Locks" ?',
            false,
        ),
        option.bool(
            "88093",
            "Apophis Medjai Bangs",
            'Mode: [select] only\nShould the bot buy "Apophis Medjai Bangs" ?',
            false,
        ),
        option.bool(
            "88094",
            "Apophis Medjai Morph",
            'Mode: [select] only\nShould the bot buy "Apophis Medjai Morph" ?',
            false,
        ),
        option.bool(
            "88095",
            "Apophis Medjai Visage",
            'Mode: [select] only\nShould the bot buy "Apophis Medjai Visage" ?',
            false,
        ),
        option.bool(
            "88096",
            "Apophis Medjai Bangs Visage",
            'Mode: [select] only\nShould the bot buy "Apophis Medjai Bangs Visage" ?',
            false,
        ),
        option.bool(
            "88097",
            "Apophis Medjai Horned Morph",
            'Mode: [select] only\nShould the bot buy "Apophis Medjai Horned Morph" ?',
            false,
        ),
        option.bool(
            "88098",
            "Apophis Medjai Horned Visage",
            'Mode: [select] only\nShould the bot buy "Apophis Medjai Horned Visage" ?',
            false,
        ),
        option.bool(
            "88099",
            "Apophis Medjai Helm",
            'Mode: [select] only\nShould the bot buy "Apophis Medjai Helm" ?',
            false,
        ),
        option.bool("88100", "Dark Medjai Cape", 'Mode: [select] only\nShould the bot buy "Dark Medjai Cape" ?', false),
        option.bool(
            "88103",
            "Umbral Scythe of Aaru",
            'Mode: [select] only\nShould the bot buy "Umbral Scythe of Aaru" ?',
            false,
        ),
        option.bool(
            "88104",
            "Umbral Bow of Aaru",
            'Mode: [select] only\nShould the bot buy "Umbral Bow of Aaru" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HiddenDuatMerge.select,
});

export default function main(): void {
    const script = new HiddenDuatMerge();
    Core.bankingBlackList.push("Crown of Chaos");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
