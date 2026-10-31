/*
name: Glacial Tomb Merge
description: This bot will farm the items belonging to the selected mode for the Glacial Tomb Merge [2377] in /glacetomb
tags: glacial, tomb, merge, glacetomb, arctic, necrodraugr, scholar, nether, morph, blessed, frostguarde, resonating, polaris, rapier, rapiers, awakening, frost, shatter, spear, lumen, ice, bright, astromancer, shillelagh
*/
// Port of Scripts/Seasonal/Frostvale/GlacialTombMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFrostvale } from "./story/CoreFrostvale";

const Adv = new CoreAdvanced();
const Frostvale = new CoreFrostvale();

export class GlacialTombMerge {
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
                case "Fimbul's Frost":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9507);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("glacetomb", "Draugr", "Frozen Marrow", 8);
                        Core.huntMonster("glacetomb", "Snow Fairy", "Crystalline Wings", 8);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonsterMapID("glacetomb", 7, "Valedictorian Speech");
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Frostguarde Blade":

                case "Frostguarde Blades":

                case "Polaris Duelist Rapiers":

                case "Polaris Duelist Rapier":

                case "Frost Shatter Spear":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonsterMapID("glacetomb", 7, req.name, 1, { isTemp: req.temp });
                    break;
            }
        };
        Frostvale.glaceTomb();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("glacetomb", 2377, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "82181",
            "Arctic Necro-Draugr",
            'Mode: [select] only\nShould the bot buy "Arctic Necro-Draugr" ?',
            false,
        ),
        option.bool(
            "82182",
            "Scholar of the Nether",
            'Mode: [select] only\nShould the bot buy "Scholar of the Nether" ?',
            false,
        ),
        option.bool(
            "82183",
            "Scholar of the Nether Morph",
            'Mode: [select] only\nShould the bot buy "Scholar of the Nether Morph" ?',
            false,
        ),
        option.bool(
            "67403",
            "Blessed Frostguarde Blade",
            'Mode: [select] only\nShould the bot buy "Blessed Frostguarde Blade" ?',
            false,
        ),
        option.bool(
            "67404",
            "Blessed Frostguarde Blades",
            'Mode: [select] only\nShould the bot buy "Blessed Frostguarde Blades" ?',
            false,
        ),
        option.bool(
            "67405",
            "Resonating Polaris Rapier",
            'Mode: [select] only\nShould the bot buy "Resonating Polaris Rapier" ?',
            false,
        ),
        option.bool(
            "67406",
            "Resonating Polaris Rapiers",
            'Mode: [select] only\nShould the bot buy "Resonating Polaris Rapiers" ?',
            false,
        ),
        option.bool(
            "67410",
            "Awakening Frost Shatter Spear",
            'Mode: [select] only\nShould the bot buy "Awakening Frost Shatter Spear" ?',
            false,
        ),
        option.bool("42494", "Lumen Ice Staff", 'Mode: [select] only\nShould the bot buy "Lumen Ice Staff" ?', false),
        option.bool(
            "27476",
            "Bright Astromancer Polearm",
            'Mode: [select] only\nShould the bot buy "Bright Astromancer Polearm" ?',
            false,
        ),
        option.bool(
            "82479",
            "Lumen Ice Shillelagh",
            'Mode: [select] only\nShould the bot buy "Lumen Ice Shillelagh" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GlacialTombMerge.select,
});

export default function main(): void {
    const script = new GlacialTombMerge();
    Core.bankingBlackList.push(
        "Fimbul's Frost",
        "Frostguarde Blade",
        "Frostguarde Blades",
        "Polaris Duelist Rapier",
        "Polaris Duelist Rapiers",
        "Frost Shatter Spear",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
