/*
name: ByrodaxMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/ByrodaxMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ByrodaxMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
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
                case "Space Jetsam":
                    Core.equipClass(ClassType.Solo);
                    Core.killMonster("byrodax", "r9", "Right", "Byro-Dax Monstrosity", req.name, req.quantity, {
                        isTemp: req.temp,
                    });
                    bot.wait.forPickup(req.name);
                    break;
                case "Space Flotsam":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("byrodax", "Security Droid", req.name, req.quantity, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("byrodax", 1886, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "48722",
            "Hyperspace Marine",
            'Mode: [select] only\nShould the bot buy "Hyperspace Marine" ?',
            false,
        ),
        option.bool(
            "48723",
            "Hyperspace Marine Helm",
            'Mode: [select] only\nShould the bot buy "Hyperspace Marine Helm" ?',
            false,
        ),
        option.bool(
            "48724",
            "Hyperspace Marine Hairstyle",
            'Mode: [select] only\nShould the bot buy "Hyperspace Marine Hairstyle" ?',
            false,
        ),
        option.bool(
            "48725",
            "Hyperspace Marine Cape",
            'Mode: [select] only\nShould the bot buy "Hyperspace Marine Cape" ?',
            false,
        ),
        option.bool(
            "48726",
            "Hyperspace Marine Sword",
            'Mode: [select] only\nShould the bot buy "Hyperspace Marine Sword" ?',
            false,
        ),
        option.bool(
            "48728",
            "Hyperspace Marine Sword + Shield",
            'Mode: [select] only\nShould the bot buy "Hyperspace Marine Sword + Shield" ?',
            false,
        ),
        option.bool(
            "54902",
            "Tiny Goo'd Rubber Treeant",
            'Mode: [select] only\nShould the bot buy "Tiny Goo\'d Rubber Treeant" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ByrodaxMerge.select,
});

export default function main(): void {
    const script = new ByrodaxMerge();
    Core.bankingBlackList.push("Space Jetsam", "Space Flotsam");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
