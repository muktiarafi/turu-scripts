/*
name: Dance Guru Merge
description: This script farms all the materials for Dance Guru Merge.
tags: dance guru, merge, seasonal, carnaval
*/
// Port of Scripts/Seasonal/Carnaval/DanceGuruMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { DanceGuru } from "./DanceGuru";

const Adv = new CoreAdvanced();
const DG = new DanceGuru();

export class DanceGuruMerge {
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
                case "Spirit Beads":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7957);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("danceguru", "Crow", "Bead Shards", 20, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Pássaro Rosa Cape":

                case "Pano Azul":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("danceguru", "Carnaval Harpy", req.name, quant, { isTemp: false, log: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        DG.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("danceguru", 1976, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("59646", "Cabelo Bonita", 'Mode: [select] only\nShould the bot buy "Cabelo Bonita" ?', false),
        option.bool("59645", "Cabelo de Festa", 'Mode: [select] only\nShould the bot buy "Cabelo de Festa" ?', false),
        option.bool(
            "59653",
            "Pássaro Rosa Outfit",
            'Mode: [select] only\nShould the bot buy "Pássaro Rosa Outfit" ?',
            false,
        ),
        option.bool(
            "59655",
            "Pássaro Rosa Headpiece Morph",
            'Mode: [select] only\nShould the bot buy "Pássaro Rosa Headpiece Morph" ?',
            false,
        ),
        option.bool(
            "59657",
            "Pássaro Rosa Headdress Morph",
            'Mode: [select] only\nShould the bot buy "Pássaro Rosa Headdress Morph" ?',
            false,
        ),
        option.bool(
            "59660",
            "Pássaro Rosa Wrap",
            'Mode: [select] only\nShould the bot buy "Pássaro Rosa Wrap" ?',
            false,
        ),
        option.bool(
            "59662",
            "Pássaro Rosa Dual Fan",
            'Mode: [select] only\nShould the bot buy "Pássaro Rosa Dual Fan" ?',
            false,
        ),
        option.bool(
            "59705",
            "Evil Abada Outfit",
            'Mode: [select] only\nShould the bot buy "Evil Abada Outfit" ?',
            false,
        ),
        option.bool(
            "59706",
            "Good Abada Outfit",
            'Mode: [select] only\nShould the bot buy "Good Abada Outfit" ?',
            false,
        ),
        option.bool(
            "59704",
            "Chaos Abada Outfit",
            'Mode: [select] only\nShould the bot buy "Chaos Abada Outfit" ?',
            false,
        ),
        option.bool(
            "59707",
            "Hollowborn Abada Outfit",
            'Mode: [select] only\nShould the bot buy "Hollowborn Abada Outfit" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DanceGuruMerge.select,
});

export default function main(): void {
    const script = new DanceGuruMerge();
    Core.bankingBlackList.push("Spirit Beads", "Pássaro Rosa Cape", "Pano Azul");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
