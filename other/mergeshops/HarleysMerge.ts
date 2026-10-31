/*
name: Harleys Merge
description: This bot will farm the items belonging to the selected mode for the Harleys Merge [2572] in /trainers
tags: harleys, merge, trainers, battleon, warlord, grizzled, eyepatch, scarred, banner, cloak, warbeast, armaments
*/
// Port of Scripts/Other/MergeShops/HarleysMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class HarleysMerge {
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
                case "Harley's Reinforced Steel":
                    if (
                        !Core.checkInventory(
                            [
                                "ArchPaladin",
                                "Chaos Avenger",
                                "Verus DoomKnight",
                                "Void Highlord",
                                "Void Highlord (IoDA)",
                            ],
                            undefined,
                            { any: true },
                        )
                    ) {
                        Core.logger(
                            "These Classes are not required, but making killing the boss... possible atleast solo: AP/VDk/CAV/VHL. if you dont have *any* of them... good luck killing it",
                            "**WARNING**",
                        );
                        Core.logger(
                            `Bot will use ${bot.player?.currentClass} to farm Harley's Reinforced Steel`,
                            "WARNING",
                        );
                    } else {
                        for (const ClassName of [
                            "Chaos Avenger",
                            "Verus DoomKnight",
                            "Void Highlord",
                            "Void Highlord (IoDA)",
                            "ArchPaladin",
                        ]) {
                            if (Core.checkInventory(ClassName)) {
                                Core.unbank(ClassName);
                                Core.equip(ClassName);
                                Core.logger(`Using ${ClassName} for farming Harley's Reinforced Steel`);
                                break;
                            }
                            continue;
                        }
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(10177);
                    Core.killMonster("trainers", "r3", "Left", "Warlord Harley", req.name, req.quantity);
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("trainers", 2572, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("91591", "Battleon Warlord", 'Mode: [select] only\nShould the bot buy "Battleon Warlord" ?', false),
        option.bool(
            "91592",
            "Grizzled Warlord Eyepatch",
            'Mode: [select] only\nShould the bot buy "Grizzled Warlord Eyepatch" ?',
            false,
        ),
        option.bool(
            "91593",
            "Grizzled Warlord Eyepatch Locks",
            'Mode: [select] only\nShould the bot buy "Grizzled Warlord Eyepatch Locks" ?',
            false,
        ),
        option.bool(
            "91594",
            "Battleon Warlord Eyepatch",
            'Mode: [select] only\nShould the bot buy "Battleon Warlord Eyepatch" ?',
            false,
        ),
        option.bool(
            "91595",
            "Battleon Warlord Eyepatch Locks",
            'Mode: [select] only\nShould the bot buy "Battleon Warlord Eyepatch Locks" ?',
            false,
        ),
        option.bool(
            "91596",
            "Battleon Warlord Hair",
            'Mode: [select] only\nShould the bot buy "Battleon Warlord Hair" ?',
            false,
        ),
        option.bool(
            "91597",
            "Battleon Warlord Locks",
            'Mode: [select] only\nShould the bot buy "Battleon Warlord Locks" ?',
            false,
        ),
        option.bool(
            "91598",
            "Grizzled Battleon Warlord Hair",
            'Mode: [select] only\nShould the bot buy "Grizzled Battleon Warlord Hair" ?',
            false,
        ),
        option.bool(
            "91599",
            "Battleon Warlord Scarred Locks",
            'Mode: [select] only\nShould the bot buy "Battleon Warlord Scarred Locks" ?',
            false,
        ),
        option.bool(
            "91600",
            "Battleon Warlord Banner",
            'Mode: [select] only\nShould the bot buy "Battleon Warlord Banner" ?',
            false,
        ),
        option.bool(
            "91601",
            "Battleon Warlord Cape",
            'Mode: [select] only\nShould the bot buy "Battleon Warlord Cape" ?',
            false,
        ),
        option.bool(
            "91602",
            "Battleon Warlord Banner Cloak",
            'Mode: [select] only\nShould the bot buy "Battleon Warlord Banner Cloak" ?',
            false,
        ),
        option.bool(
            "91603",
            "Battleon Warbeast Blade",
            'Mode: [select] only\nShould the bot buy "Battleon Warbeast Blade" ?',
            false,
        ),
        option.bool(
            "91604",
            "Battleon Warbeast Blades",
            'Mode: [select] only\nShould the bot buy "Battleon Warbeast Blades" ?',
            false,
        ),
        option.bool(
            "91605",
            "Battleon Warbeast Axe",
            'Mode: [select] only\nShould the bot buy "Battleon Warbeast Axe" ?',
            false,
        ),
        option.bool(
            "91606",
            "Battleon Warbeast Axes",
            'Mode: [select] only\nShould the bot buy "Battleon Warbeast Axes" ?',
            false,
        ),
        option.bool(
            "92773",
            "Battleon Warbeast Armaments",
            'Mode: [select] only\nShould the bot buy "Battleon Warbeast Armaments" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HarleysMerge.select,
});

export default function main(): void {
    const script = new HarleysMerge();
    Core.bankingBlackList.push("Harley's Reinforced Steel");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
