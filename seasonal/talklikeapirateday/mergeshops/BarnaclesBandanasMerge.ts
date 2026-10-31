/*
name: Barnacle's Bandanas Merge
description: This bot will farm the items belonging to the selected mode for the Barnacles Bandanas Merge [984] in /pirates
tags: tlapd, talk-like-a-pirate-day, seasonal, barnacle, bandanas, merge, pirates, chaos, bandana, undead, legion, rotting, naval, icy, galactic, doom, chrono, bright, blazing, toxic
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/BarnaclesBandanasMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class BarnaclesBandanasMerge {
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
                case "Scrap of Cloth":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        for (const mon of [3, 7, 15, 10]) {
                            const M = bot.monsters.mapMonsters.find((x) => x != null && x.mapId === mon) ?? null;
                            if (M == null) {
                                continue;
                            }

                            if (bot.map.name !== "tlapd") {
                                Core.join("tlapd");
                            }
                            if (bot.player.cell !== M!.cell) {
                                Core.jump(M.cell);
                            }

                            if (M != null && M.hp >= 0) {
                                bot.hunt.monster(M.mapId);
                            }

                            if (Core.checkInventory(req.name, quant)) {
                                break;
                            }
                        }
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("pirates", 984, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("25492", "Chaos Bandana", 'Mode: [select] only\nShould the bot buy "Chaos Bandana" ?', false),
        option.bool(
            "25493",
            "Undead Legion Bandana",
            'Mode: [select] only\nShould the bot buy "Undead Legion Bandana" ?',
            false,
        ),
        option.bool("25494", "Rotting Bandana", 'Mode: [select] only\nShould the bot buy "Rotting Bandana" ?', false),
        option.bool("25495", "Naval Bandana", 'Mode: [select] only\nShould the bot buy "Naval Bandana" ?', false),
        option.bool("25496", "Legion Bandana", 'Mode: [select] only\nShould the bot buy "Legion Bandana" ?', false),
        option.bool("25497", "Icy Bandana", 'Mode: [select] only\nShould the bot buy "Icy Bandana" ?', false),
        option.bool("25498", "Galactic Bandana", 'Mode: [select] only\nShould the bot buy "Galactic Bandana" ?', false),
        option.bool("25499", "Doom Bandana", 'Mode: [select] only\nShould the bot buy "Doom Bandana" ?', false),
        option.bool("25500", "Chrono Bandana", 'Mode: [select] only\nShould the bot buy "Chrono Bandana" ?', false),
        option.bool("25501", "Bright Bandana", 'Mode: [select] only\nShould the bot buy "Bright Bandana" ?', false),
        option.bool("25502", "Blazing Bandana", 'Mode: [select] only\nShould the bot buy "Blazing Bandana" ?', false),
        option.bool("56385", "Toxic Bandana", 'Mode: [select] only\nShould the bot buy "Toxic Bandana" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BarnaclesBandanasMerge.select,
});

export default function main(): void {
    const script = new BarnaclesBandanasMerge();
    Core.bankingBlackList.push("Scrap of Cloth");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
