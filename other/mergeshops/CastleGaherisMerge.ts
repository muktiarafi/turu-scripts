/*
name: CastleGaheris Merge
description: This bot will farm the items belonging to the selected mode for the CastleGaheris Merge [2465] in /castlegaheris
tags: castlegaheris, merge, castlegaheris, courtly, mana, scholar, scholars, warlocks, witchs, golden, snowflake, rapier, rapiers, hoarfrost, winter, solstice, arcane, craft
*/
// Port of Scripts/Other/MergeShops/CastleGaherisMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();

export class CastleGaherisMerge {
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
                case "Gaheris Sigil":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9829);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("castlegaheris", "Glacial Crystal", "Glacial Memory", 30, { log: false });
                        Core.huntMonster("castlegaheris", "Elemental Hybrid", "Hybrid Residue", 9, { log: false });
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("castlegaheris", "Thundersnow Storm", "Thundersnow Sigh", undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Courtly Mana Scholar Hair":

                case "Courtly Mana Scholar Locks":

                case "Militis Snowflake Rapier":

                case "Militis Snowflake Rapiers":

                case "Grimoire of Abra-Melin":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("castlegaheris", "Thundersnow Storm", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "Delicate Snowflake Rapier":

                case "Delicate Snowflake Rapiers":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("castlegaheris", "Glacial Crystal", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
            }
        };
        AOR.castleGaheris();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("castlegaheris", 2465, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "82701",
            "Courtly Mana Scholar",
            'Mode: [select] only\nShould the bot buy "Courtly Mana Scholar" ?',
            false,
        ),
        option.bool(
            "82704",
            "Mana Scholar's Warlock's Hat",
            "Mode: [select] only\nShould the bot buy \"Mana Scholar's Warlock's Hat\" ?",
            false,
        ),
        option.bool(
            "82705",
            "Mana Scholar's Witch's Hat",
            "Mode: [select] only\nShould the bot buy \"Mana Scholar's Witch's Hat\" ?",
            false,
        ),
        option.bool(
            "82709",
            "Golden Snowflake Rapier",
            'Mode: [select] only\nShould the bot buy "Golden Snowflake Rapier" ?',
            false,
        ),
        option.bool(
            "82710",
            "Golden Snowflake Rapiers",
            'Mode: [select] only\nShould the bot buy "Golden Snowflake Rapiers" ?',
            false,
        ),
        option.bool(
            "82713",
            "Hoarfrost Snowflake Rapier",
            'Mode: [select] only\nShould the bot buy "Hoarfrost Snowflake Rapier" ?',
            false,
        ),
        option.bool(
            "82714",
            "Hoarfrost Snowflake Rapiers",
            'Mode: [select] only\nShould the bot buy "Hoarfrost Snowflake Rapiers" ?',
            false,
        ),
        option.bool(
            "82716",
            "Winter Solstice Staff",
            'Mode: [select] only\nShould the bot buy "Winter Solstice Staff" ?',
            false,
        ),
        option.bool(
            "82717",
            "Mana Scholar's Arcane Craft",
            'Mode: [select] only\nShould the bot buy "Mana Scholar\'s Arcane Craft" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CastleGaherisMerge.select,
});

export default function main(): void {
    const script = new CastleGaherisMerge();
    Core.bankingBlackList.push(
        "Gaheris Sigil",
        "Courtly Mana Scholar Hair",
        "Courtly Mana Scholar Locks",
        "Delicate Snowflake Rapier",
        "Delicate Snowflake Rapiers",
        "Militis Snowflake Rapier",
        "Militis Snowflake Rapiers",
        "Grimoire of Abra-Melin",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
