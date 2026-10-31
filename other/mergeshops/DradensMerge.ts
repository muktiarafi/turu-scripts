/*
name: Dradens Merge
description: This bot will farm the items belonging to the selected mode for the Dradens Merge [1137] in /phoenixrise
tags: dradens, merge, phoenixrise, phoenix, tempest, general, firestorm, banner, fyreborn, mauler, corundum, carver, cavernous, horned
*/
// Port of Scripts/Other/MergeShops/DradensMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class DradensMerge {
    // [Can Change] This should only be changed by the author.
    // If true, it will not stop the script if the default case triggers and the user chose to only get mats
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
                case "Phoenix Gate Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    if (!Core.isMember) {
                        Core.registerQuests(4214);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("phoenixrise", "Firestorm Tiger", "Tigerskin", 5, { log: false });
                            Core.huntMonster("phoenixrise", "Infernal Goblin", "Strips of Goblin Leather", 3, {
                                log: false,
                            });
                            Core.huntMonster("phoenixrise", "Lava Troll", "Lava Globule", 4, { log: false });
                            bot.wait.forPickup(req.name);
                        }
                        Core.cancelRegisteredQuests();
                    } else {
                        Core.farmingLogger(req.name, quant);
                        Core.equipClass(ClassType.Solo);
                        Core.registerQuests(4215);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("phoenixrise", "Cinderclaw", "Minotiger Horn", undefined, { log: false });
                            Core.huntMonster("phoenixrise", "Gargrowl", "Stone Shard", undefined, { log: false });
                            Core.huntMonster("phoenixrise", "Pyrric Ursus", "Crystal Pommel", undefined, {
                                log: false,
                            });
                            bot.wait.forPickup(req.name);
                        }
                        Core.cancelRegisteredQuests();
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("phoenixrise", 1137, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "29516",
            "Blade of the Phoenix",
            'Mode: [select] only\nShould the bot buy "Blade of the Phoenix" ?',
            false,
        ),
        option.bool(
            "29294",
            "Tempest General Helm",
            'Mode: [select] only\nShould the bot buy "Tempest General Helm" ?',
            false,
        ),
        option.bool(
            "29295",
            "Firestorm General",
            'Mode: [select] only\nShould the bot buy "Firestorm General" ?',
            false,
        ),
        option.bool(
            "29494",
            "Phoenixrise Banner Cape",
            'Mode: [select] only\nShould the bot buy "Phoenixrise Banner Cape" ?',
            false,
        ),
        option.bool("29488", "Fyreborn Mauler", 'Mode: [select] only\nShould the bot buy "Fyreborn Mauler" ?', false),
        option.bool(
            "29489",
            "Corundum Carver Cape",
            'Mode: [select] only\nShould the bot buy "Corundum Carver Cape" ?',
            false,
        ),
        option.bool(
            "29490",
            "Cavernous Carver Axe",
            'Mode: [select] only\nShould the bot buy "Cavernous Carver Axe" ?',
            false,
        ),
        option.bool(
            "29491",
            "Fyreborn Horned Locks",
            'Mode: [select] only\nShould the bot buy "Fyreborn Horned Locks" ?',
            false,
        ),
        option.bool(
            "29492",
            "Fyreborn Horned Helm",
            'Mode: [select] only\nShould the bot buy "Fyreborn Horned Helm" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DradensMerge.select,
});

export default function main(): void {
    const script = new DradensMerge();
    Core.bankingBlackList.push("Phoenix Gate Token");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
