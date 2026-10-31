/*
name: BrightForestMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/BrightForestMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreSoC } from "../../story/shadowsofchaos/CoreSoC";

const Adv = new CoreAdvanced();
const SoC = new CoreSoC();

export class BrightForestMerge {
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
                // This item is also gotten just from the mobs the the area, so you'll twice as much ¯\_(ツ)_/¯
                case "ShadowFlame Armor Scrap":
                    SoC.completeCoreSoC();
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(7768);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        //The Shadows Recede 7768
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("BrightForest", "Shadowflame Scout", 'ShadowFlame Troops "Informed"', 30, {
                            log: false,
                        });
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster(
                            "BrightForest",
                            "ShadowFlame Dragon",
                            'ShadowFlame Dragon "Informed"',
                            undefined,
                            { log: false },
                        );
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("brightforest", 1911, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "56862",
            "ShadowFlame Empress",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Empress" ?',
            false,
        ),
        option.bool("56863", "Shadowed Empress", 'Mode: [select] only\nShould the bot buy "Shadowed Empress" ?', false),
        option.bool(
            "56864",
            "ShadowFlame Empress Hair",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Empress Hair" ?',
            false,
        ),
        option.bool(
            "56865",
            "ShadowFlame Empress Hair + Morph",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Empress Hair + Morph" ?',
            false,
        ),
        option.bool(
            "56866",
            "ShadowFlame Empress Locks",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Empress Locks" ?',
            false,
        ),
        option.bool(
            "56867",
            "ShadowFlame Empress Locks + Morph",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Empress Locks + Morph" ?',
            false,
        ),
        option.bool(
            "56868",
            "ShadowFlame Empress Cape",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Empress Cape" ?',
            false,
        ),
        option.bool(
            "56869",
            "ShadowCharged Empress Blade",
            'Mode: [select] only\nShould the bot buy "ShadowCharged Empress Blade" ?',
            false,
        ),
        option.bool(
            "56870",
            "ShadowFlame Empress Blade",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Empress Blade" ?',
            false,
        ),
        option.bool(
            "56967",
            "ShadowFlame DoomLight",
            'Mode: [select] only\nShould the bot buy "ShadowFlame DoomLight" ?',
            false,
        ),
        option.bool(
            "56968",
            "ShadowFlame DoomLight Helm",
            'Mode: [select] only\nShould the bot buy "ShadowFlame DoomLight Helm" ?',
            false,
        ),
        option.bool(
            "56969",
            "ShadowFlame DoomLight Cloak",
            'Mode: [select] only\nShould the bot buy "ShadowFlame DoomLight Cloak" ?',
            false,
        ),
        option.bool(
            "56970",
            "ShadowFlame DoomLight Blade",
            'Mode: [select] only\nShould the bot buy "ShadowFlame DoomLight Blade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BrightForestMerge.select,
});

export default function main(): void {
    const script = new BrightForestMerge();
    Core.bankingBlackList.push("ShadowFlame Armor Scrap ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
