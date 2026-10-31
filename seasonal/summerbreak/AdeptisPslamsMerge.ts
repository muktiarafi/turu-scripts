/*
name: Adeptis Pslams Merge
description: This bot will farm the items belonging to the selected mode for the Adeptis Pslams Merge [2588] in /sunkencity
tags: adeptis, pslams, merge, sunkencity, riptide, helicoprion, adept, lure, caeruleum, newborn, chimeric, aurichalcum, lance, ceremonial, trident, enlightened
*/
// Port of Scripts/Seasonal/SummerBreak/AdeptisPslamsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { SunkenCity } from "./SunkenCity";

const Adv = new CoreAdvanced();
const SC = new SunkenCity();

export class AdeptisPslamsMerge {
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
                case "Sea Creature Membrane":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(93822);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, req.quantity)) {
                        Core.huntMonsterQuest(10275, "sunkencity", "Merdrathoolian");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Oxidized Steel":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(93823);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, req.quantity)) {
                        Core.huntMonsterQuest(10276, "sunkencity", "Nereid Princess");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Riptide Helicoprion":

                case "Riptide Helicoprion Helm":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(94014);
                    Core.huntMonster("sunkencity", "Nereid Princess", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                //#endregion
            }
        };
        SC.sagaName();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("sunkencity", 2588, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "94015",
            "Riptide Helicoprion Adept",
            'Mode: [select] only\nShould the bot buy "Riptide Helicoprion Adept" ?',
            false,
        ),
        option.bool(
            "94017",
            "Riptide Helicoprion Locks",
            'Mode: [select] only\nShould the bot buy "Riptide Helicoprion Locks" ?',
            false,
        ),
        option.bool(
            "94018",
            "Riptide Helicoprion Lure",
            'Mode: [select] only\nShould the bot buy "Riptide Helicoprion Lure" ?',
            false,
        ),
        option.bool(
            "94019",
            "Riptide Helicoprion Lure Locks",
            'Mode: [select] only\nShould the bot buy "Riptide Helicoprion Lure Locks" ?',
            false,
        ),
        option.bool(
            "94021",
            "Caeruleum Newborn",
            'Mode: [select] only\nShould the bot buy "Caeruleum Newborn" ?',
            false,
        ),
        option.bool(
            "94024",
            "Chimeric Aurichalcum Lance",
            'Mode: [select] only\nShould the bot buy "Chimeric Aurichalcum Lance" ?',
            false,
        ),
        option.bool(
            "94025",
            "Ceremonial Aurichalcum Trident",
            'Mode: [select] only\nShould the bot buy "Ceremonial Aurichalcum Trident" ?',
            false,
        ),
        option.bool(
            "94026",
            "Enlightened Aurichalcum Trident",
            'Mode: [select] only\nShould the bot buy "Enlightened Aurichalcum Trident" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AdeptisPslamsMerge.select,
});

export default function main(): void {
    const script = new AdeptisPslamsMerge();
    Core.bankingBlackList.push(
        "Sea Creature Membrane",
        "Oxidized Steel",
        "Riptide Helicoprion",
        "Riptide Helicoprion Helm",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
