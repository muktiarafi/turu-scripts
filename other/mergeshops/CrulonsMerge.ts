/*
name: Crulons Merge
description: This bot will farm the items belonging to the selected mode for the Crulons Merge [2725] in /duatpalace
tags: crulons, merge, duatpalace, sandsea, cleric, morph, scepter, sedjem
*/
// Port of Scripts/Other/MergeShops/CrulonsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CrulonsMerge {
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
                case "Desert Incantation":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10742);
                    // TODO: Replace with actual quest ID
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("duatpalace", "Sphinx Guardian", "Sphinx Fur", 12, { isTemp: true });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("duatpalace", 2725, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("101098", "Sandsea Cleric", 'Mode: [select] only\nShould the bot buy "Sandsea Cleric" ?', false),
        option.bool(
            "101099",
            "Sandsea Cleric Morph",
            'Mode: [select] only\nShould the bot buy "Sandsea Cleric Morph" ?',
            false,
        ),
        option.bool(
            "101100",
            "Sandsea Cleric Visage",
            'Mode: [select] only\nShould the bot buy "Sandsea Cleric Visage" ?',
            false,
        ),
        option.bool(
            "101101",
            "Scepter of Sedjem",
            'Mode: [select] only\nShould the bot buy "Scepter of Sedjem" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CrulonsMerge.select,
});

export default function main(): void {
    const script = new CrulonsMerge();
    Core.bankingBlackList.push("Desert Incantation");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
