/*
name: Lae Wedding Merge
description: This bot will farm the items belonging to the selected mode for the Lae Wedding Merge [2496] in /laewed
tags: lae, wedding, merge, laewed, gothic, altar, tender, dark, wings, spear, undying, love, chalice, chalices, hollowborn, witch, witchs, broom, shadow
*/
// Port of Scripts/Other/MergeShops/LaeWeddingMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { LaeWedding } from "../../story/LaeWedding";

const Adv = new CoreAdvanced();
const LW = new LaeWedding();

export class LaeWeddingMerge {
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
                case "Spectral Memento":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(
                            9954,
                            ["laewed", LW.useableMonsters[2], ClassType.Farm],
                            ["laewed", LW.useableMonsters[3], ClassType.Farm],
                            ["laewed", LW.useableMonsters[5], ClassType.Solo],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        LW.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("laewed", 2496, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "89286",
            "Gothic Altar Tender",
            'Mode: [select] only\nShould the bot buy "Gothic Altar Tender" ?',
            false,
        ),
        option.bool(
            "89287",
            "Gothic Altar Tender Hair",
            'Mode: [select] only\nShould the bot buy "Gothic Altar Tender Hair" ?',
            false,
        ),
        option.bool(
            "89288",
            "Gothic Altar Tender Locks",
            'Mode: [select] only\nShould the bot buy "Gothic Altar Tender Locks" ?',
            false,
        ),
        option.bool("89289", "Dark Altar Wings", 'Mode: [select] only\nShould the bot buy "Dark Altar Wings" ?', false),
        option.bool("89290", "Dark Altar Spear", 'Mode: [select] only\nShould the bot buy "Dark Altar Spear" ?', false),
        option.bool(
            "87518",
            "Undying Love Chalice",
            'Mode: [select] only\nShould the bot buy "Undying Love Chalice" ?',
            false,
        ),
        option.bool(
            "87519",
            "Undying Love Chalices",
            'Mode: [select] only\nShould the bot buy "Undying Love Chalices" ?',
            false,
        ),
        option.bool("89273", "Hollowborn Witch", 'Mode: [select] only\nShould the bot buy "Hollowborn Witch" ?', false),
        option.bool(
            "89275",
            "Hollowborn Witch Visage",
            'Mode: [select] only\nShould the bot buy "Hollowborn Witch Visage" ?',
            false,
        ),
        option.bool(
            "89277",
            "Hollowborn Witch's Wand",
            'Mode: [select] only\nShould the bot buy "Hollowborn Witch\'s Wand" ?',
            false,
        ),
        option.bool(
            "89278",
            "Hollowborn Witch's Broom",
            'Mode: [select] only\nShould the bot buy "Hollowborn Witch\'s Broom" ?',
            false,
        ),
        option.bool(
            "89280",
            "Hollowborn Witch Shadow Visage",
            'Mode: [select] only\nShould the bot buy "Hollowborn Witch Shadow Visage" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LaeWeddingMerge.select,
});

export default function main(): void {
    const script = new LaeWeddingMerge();
    Core.bankingBlackList.push("Spectral Memento");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
