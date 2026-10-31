/*
name: Argentos Merge
description: This bot will farm the items belonging to the selected mode for the Argentos Merge [2517] in /frozenbalemorale
tags: argentos, merge, frozenbalemorale, sterling, dragonlord, noble, dragonberserker, dragonbulwark, armet, plumed, fury, plated, rage, dragons, blessing, dragonknight, scythe, drake, halberd, masterblade
*/
// Port of Scripts/Other/MergeShops/ArgentosMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ArgentosMerge {
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
                case "Sterling Silver":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(9991, "frozenbalemorale", "Kall Haxa");
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("frozenbalemorale", 2517, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "90081",
            "Sterling Dragonlord",
            'Mode: [select] only\nShould the bot buy "Sterling Dragonlord" ?',
            false,
        ),
        option.bool(
            "90082",
            "Noble Sterling Dragonlord",
            'Mode: [select] only\nShould the bot buy "Noble Sterling Dragonlord" ?',
            false,
        ),
        option.bool(
            "90083",
            "Sterling DragonBerserker",
            'Mode: [select] only\nShould the bot buy "Sterling DragonBerserker" ?',
            false,
        ),
        option.bool(
            "90085",
            "Sterling DragonBulwark",
            'Mode: [select] only\nShould the bot buy "Sterling DragonBulwark" ?',
            false,
        ),
        option.bool(
            "90087",
            "Sterling Noble Armet",
            'Mode: [select] only\nShould the bot buy "Sterling Noble Armet" ?',
            false,
        ),
        option.bool(
            "90088",
            "Sterling Plumed Armet",
            'Mode: [select] only\nShould the bot buy "Sterling Plumed Armet" ?',
            false,
        ),
        option.bool(
            "90089",
            "Sterling DragonBerserker Helm",
            'Mode: [select] only\nShould the bot buy "Sterling DragonBerserker Helm" ?',
            false,
        ),
        option.bool(
            "90090",
            "Noble DragonBerserker Helm",
            'Mode: [select] only\nShould the bot buy "Noble DragonBerserker Helm" ?',
            false,
        ),
        option.bool(
            "90091",
            "DragonBerserker Fury Helm",
            'Mode: [select] only\nShould the bot buy "DragonBerserker Fury Helm" ?',
            false,
        ),
        option.bool(
            "90092",
            "DragonBerserker Plated Helm",
            'Mode: [select] only\nShould the bot buy "DragonBerserker Plated Helm" ?',
            false,
        ),
        option.bool(
            "90093",
            "Plumed DragonBerserker Helm",
            'Mode: [select] only\nShould the bot buy "Plumed DragonBerserker Helm" ?',
            false,
        ),
        option.bool(
            "90094",
            "DragonBerserker Rage Helm",
            'Mode: [select] only\nShould the bot buy "DragonBerserker Rage Helm" ?',
            false,
        ),
        option.bool(
            "90096",
            "Sterling Dragon's Blessing",
            'Mode: [select] only\nShould the bot buy "Sterling Dragon\'s Blessing" ?',
            false,
        ),
        option.bool(
            "90102",
            "Sterling Dragonknight Scythe",
            'Mode: [select] only\nShould the bot buy "Sterling Dragonknight Scythe" ?',
            false,
        ),
        option.bool(
            "90103",
            "Sterling Drake Halberd",
            'Mode: [select] only\nShould the bot buy "Sterling Drake Halberd" ?',
            false,
        ),
        option.bool(
            "90104",
            "Sterling Dragonlord MasterBlade",
            'Mode: [select] only\nShould the bot buy "Sterling Dragonlord MasterBlade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ArgentosMerge.select,
});

export default function main(): void {
    const script = new ArgentosMerge();
    Core.bankingBlackList.push("Sterling Silver");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
