/*
name: BloodAncientMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/BloodAncientMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Safiria } from "../../story/Safiria[Member]";

const Adv = new CoreAdvanced();
const safiria = new Safiria();

export class BloodAncientMerge {
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
                case "Ancient Vitae":
                    safiria.storyLine();
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop("Safiria's Blood Sample");
                    Core.registerQuests(1947);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Ancient Vitae 1947
                        Core.huntMonster("battledoom", "Shadow Safiria", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("safiria", 391, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("11747", "Blood Ancient", 'Mode: [select] only\nShould the bot buy "Blood Ancient" ?', false),
        option.bool(
            "11749",
            "Blood Ancient Short Hair",
            'Mode: [select] only\nShould the bot buy "Blood Ancient Short Hair" ?',
            false,
        ),
        option.bool(
            "11750",
            "Blood Ancient Long Hair",
            'Mode: [select] only\nShould the bot buy "Blood Ancient Long Hair" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BloodAncientMerge.select,
});

export default function main(): void {
    const script = new BloodAncientMerge();
    Core.bankingBlackList.push("Ancient Vitae ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
