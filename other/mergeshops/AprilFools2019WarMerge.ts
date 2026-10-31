/*
name: AprilFools2019WarMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/AprilFools2019WarMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class AprilFools2019WarMerge {
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
                case "Punadin Badge":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("pal9001", "Baby Sharkcaster", "Punadin Badge");
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("pal9001", 1709, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("48035", "Nekomancer", 'Mode: [select] only\nShould the bot buy "Nekomancer" ?', false),
        option.bool(
            "48042",
            "Nekomancer Morph Locks",
            'Mode: [select] only\nShould the bot buy "Nekomancer Morph Locks" ?',
            false,
        ),
        option.bool("48040", "Nekomancer Locks", 'Mode: [select] only\nShould the bot buy "Nekomancer Locks" ?', false),
        option.bool(
            "48041",
            "Nekomancer Hood Locks",
            'Mode: [select] only\nShould the bot buy "Nekomancer Hood Locks" ?',
            false,
        ),
        option.bool(
            "48043",
            "Nekomancer Morph Hood Locks",
            'Mode: [select] only\nShould the bot buy "Nekomancer Morph Hood Locks" ?',
            false,
        ),
        option.bool(
            "48038",
            "Nekomancer Morph Hair",
            'Mode: [select] only\nShould the bot buy "Nekomancer Morph Hair" ?',
            false,
        ),
        option.bool(
            "48037",
            "Nekomancer Hood Hair",
            'Mode: [select] only\nShould the bot buy "Nekomancer Hood Hair" ?',
            false,
        ),
        option.bool(
            "48039",
            "Nekomancer Morph Hood Hair",
            'Mode: [select] only\nShould the bot buy "Nekomancer Morph Hood Hair" ?',
            false,
        ),
        option.bool("48036", "Nekomancer Hair", 'Mode: [select] only\nShould the bot buy "Nekomancer Hair" ?', false),
        option.bool("48045", "Nekosmasher Mace", 'Mode: [select] only\nShould the bot buy "Nekosmasher Mace" ?', false),
        option.bool(
            "48046",
            "Neko Spindle Staff",
            'Mode: [select] only\nShould the bot buy "Neko Spindle Staff" ?',
            false,
        ),
        option.bool(
            "48049",
            "Nekomancer Deadly Empress Cape",
            'Mode: [select] only\nShould the bot buy "Nekomancer Deadly Empress Cape" ?',
            false,
        ),
        option.bool("48044", "Nekomancer Tail", 'Mode: [select] only\nShould the bot buy "Nekomancer Tail" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AprilFools2019WarMerge.select,
});

export default function main(): void {
    const script = new AprilFools2019WarMerge();
    Core.bankingBlackList.push("Punadin Badge ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
