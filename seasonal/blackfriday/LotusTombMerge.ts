/*
name: LotusTomb Merge
description: This bot will farm the items belonging to the selected mode for the LotusTomb Merge [2492] in /lotustomb
tags: lotustomb, merge, lotustomb, chaotic, pathshaper, scar, ripper, morph, rippers, edges, unending, light, bow, arrow, arrows, scepter
*/
// Port of Scripts/Seasonal/BlackFriday/LotusTombMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreShadowofDoom } from "./shadowofdoom/CoreShadowofDoom";

const Adv = new CoreAdvanced();
const SoD = new CoreShadowofDoom();

export class LotusTombMerge {
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
                case "Corrupted Hieroglyph":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(
                            9921,
                            ["lotustomb", SoD.umLotusTomb[4], ClassType.Solo],
                            ["lotustomb", SoD.umLotusTomb[2], ClassType.Farm],
                            ["lotustomb", SoD.umLotusTomb[3], ClassType.Farm],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        SoD.lotusTomb();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("lotustomb", 2492, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "87844",
            "Chaotic Pathshaper",
            'Mode: [select] only\nShould the bot buy "Chaotic Pathshaper" ?',
            false,
        ),
        option.bool(
            "87848",
            "Chaotic Pathshaper Visage",
            'Mode: [select] only\nShould the bot buy "Chaotic Pathshaper Visage" ?',
            false,
        ),
        option.bool(
            "87851",
            "Chaotic Scar Ripper",
            'Mode: [select] only\nShould the bot buy "Chaotic Scar Ripper" ?',
            false,
        ),
        option.bool(
            "87847",
            "Chaotic Pathshaper Morph",
            'Mode: [select] only\nShould the bot buy "Chaotic Pathshaper Morph" ?',
            false,
        ),
        option.bool(
            "87852",
            "Chaotic Scar Rippers",
            'Mode: [select] only\nShould the bot buy "Chaotic Scar Rippers" ?',
            false,
        ),
        option.bool(
            "87854",
            "Chaotic Scar Edges",
            'Mode: [select] only\nShould the bot buy "Chaotic Scar Edges" ?',
            false,
        ),
        option.bool(
            "88822",
            "Unending Light Rune",
            'Mode: [select] only\nShould the bot buy "Unending Light Rune" ?',
            false,
        ),
        option.bool(
            "88825",
            "Unending Light Bow",
            'Mode: [select] only\nShould the bot buy "Unending Light Bow" ?',
            false,
        ),
        option.bool(
            "88826",
            "Unending Light Arrow",
            'Mode: [select] only\nShould the bot buy "Unending Light Arrow" ?',
            false,
        ),
        option.bool(
            "88827",
            "Unending Light Arrows",
            'Mode: [select] only\nShould the bot buy "Unending Light Arrows" ?',
            false,
        ),
        option.bool(
            "88828",
            "Unending Light Bow and Arrow",
            'Mode: [select] only\nShould the bot buy "Unending Light Bow and Arrow" ?',
            false,
        ),
        option.bool(
            "88823",
            "Unending Light Aura",
            'Mode: [select] only\nShould the bot buy "Unending Light Aura" ?',
            false,
        ),
        option.bool(
            "88824",
            "Unending Light Scepter",
            'Mode: [select] only\nShould the bot buy "Unending Light Scepter" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LotusTombMerge.select,
});

export default function main(): void {
    const script = new LotusTombMerge();
    Core.bankingBlackList.push("Corrupted Hieroglyph");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
