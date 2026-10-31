/*
name: Vampire Lord Merge
description: This will buy all the ingredients for the Vampire Lord merge and merge them.
tags: merge, mogloween, seasonal, vampire, lord
*/
// Port of Scripts/Seasonal/Mogloween/MergeShops/VampireLordMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class VampireLordMerge {
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
                case "Blood Moon Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    // Core.RegisterQuests(Core.IsMember ? 6060 : 6059); // uncomment when registerquest is fixed. if more then 1 item is found in inv it only complets once then afks/
                    while (!bot.shouldExit && !Core.checkInventory("Blood Moon Token", quant)) {
                        Core.ensureAccept(Core.isMember ? 6060 : 6059);
                        Core.killMonster("bloodmoon", "r12a", "Left", "Black Unicorn", "Black Blood Vial", undefined, {
                            isTemp: false,
                        });
                        Core.killMonster("bloodmoon", "r4a", "Left", "Lycan Guard", "Moon Stone", undefined, {
                            isTemp: false,
                        });
                        Core.ensureComplete(Core.isMember ? 6060 : 6059);
                        bot.wait.forPickup("Blood Moon Token");
                    }
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("mogloween")) {
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("mogloween", 1477, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("41575", "Vampire Lord (Class)", 'Mode: [select] only\nShould the bot buy "Vampire Lord" ?', false),
        option.bool("41619", "Vampire Lord", 'Mode: [select] only\nShould the bot buy "Vampire Lord" ?', false),
        option.bool(
            "41623",
            "Vampire Lord Morph",
            'Mode: [select] only\nShould the bot buy "Vampire Lord Morph" ?',
            false,
        ),
        option.bool(
            "41621",
            "Vampire Lord Locks Morph",
            'Mode: [select] only\nShould the bot buy "Vampire Lord Locks Morph" ?',
            false,
        ),
        option.bool(
            "41624",
            "Vampire Lord Cape",
            'Mode: [select] only\nShould the bot buy "Vampire Lord Cape" ?',
            false,
        ),
        option.bool(
            "41666",
            "Enraged Vampire Morph",
            'Mode: [select] only\nShould the bot buy "Enraged Vampire Morph" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: VampireLordMerge.select,
});

export default function main(): void {
    const script = new VampireLordMerge();
    Core.bankingBlackList.push("Blood Moon Token ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
