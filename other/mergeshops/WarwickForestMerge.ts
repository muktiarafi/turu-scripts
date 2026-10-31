/*
name: WarwickForest Merge
description: This bot will farm the items belonging to the selected mode for the WarwickForest Merge [2706] in /warwickforest
tags: warwickforest, merge, warwickforest, adamas, flamespawn, raider, captain, lord, anjou, duke, formalwear, regalia, ashblight, fur, spines, ex, incendium, unbreakable, fist, fists, morph, horns, guard
*/
// Port of Scripts/Other/MergeShops/WarwickForestMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { FortLumaForgeMerge } from "./FortLumaForgeMerge";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();
const FLF = new FortLumaForgeMerge();

export class WarwickForestMerge {
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
                case "Red Flame of Rubedo":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.registerQuests(Core.isMember ? 10689 : 10688);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.killMonster("warwickforest", "r10", "Bottom", "*", "Rubedo Flicker");
                        Core.huntMonster("warwickforest", "Idea of a Champion", "Kolr's Needle");
                        Core.huntMonster("warwickforest", "Rubedo Match", "Alkahest", 100);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Yew Ember":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("warwickforest", "Rubedo Elemental", req.name, quant, { isTemp: false });
                    break;
                case "Blade of Citrinitas":
                    FLF.buyAllMerge(req.name);
                    break;
                case "Aiwass Diamond":
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(Core.isMember ? 10387 : 10385);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("sanctuaryaiwass", "r9", "Top", "*", "Sal Alembroth", 1, { isTemp: false });
                        Core.killMonster("sanctuaryaiwass", "r9", "Top", "*", "Milk of Sulfur", 1, { isTemp: false });
                        Core.huntMonster("sanctuaryaiwass", "Anima Animus Aiwass", "Aeon Dream", 1, { isTemp: false });
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        AOR.warWickForest();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("warwickforest", 2706, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "95230",
            "Adamas Flamespawn Raider",
            'Mode: [select] only\nShould the bot buy "Adamas Flamespawn Raider" ?',
            false,
        ),
        option.bool(
            "95231",
            "Adamas Flamespawn Captain",
            'Mode: [select] only\nShould the bot buy "Adamas Flamespawn Captain" ?',
            false,
        ),
        option.bool(
            "95232",
            "Adamas Flamespawn Lord",
            'Mode: [select] only\nShould the bot buy "Adamas Flamespawn Lord" ?',
            false,
        ),
        option.bool(
            "94858",
            "Anjou Duke Formalwear",
            'Mode: [select] only\nShould the bot buy "Anjou Duke Formalwear" ?',
            false,
        ),
        option.bool(
            "94859",
            "Anjou Duke Regalia",
            'Mode: [select] only\nShould the bot buy "Anjou Duke Regalia" ?',
            false,
        ),
        option.bool("100887", "Flame of Rubedo", 'Mode: [select] only\nShould the bot buy "Flame of Rubedo" ?', false),
        option.bool("100889", "Rubedo Crown", 'Mode: [select] only\nShould the bot buy "Rubedo Crown" ?', false),
        option.bool(
            "100890",
            "Vermillion Vertis Cape",
            'Mode: [select] only\nShould the bot buy "Vermillion Vertis Cape" ?',
            false,
        ),
        option.bool(
            "100891",
            "Rubedo Resonance Cape",
            'Mode: [select] only\nShould the bot buy "Rubedo Resonance Cape" ?',
            false,
        ),
        option.bool("95239", "Ashblight Fur", 'Mode: [select] only\nShould the bot buy "Ashblight Fur" ?', false),
        option.bool("95240", "Ashblight Spines", 'Mode: [select] only\nShould the bot buy "Ashblight Spines" ?', false),
        option.bool(
            "95242",
            "Dual Ex Incendium",
            'Mode: [select] only\nShould the bot buy "Dual Ex Incendium" ?',
            false,
        ),
        option.bool(
            "95243",
            "Unbreakable Flamespawn Fist",
            'Mode: [select] only\nShould the bot buy "Unbreakable Flamespawn Fist" ?',
            false,
        ),
        option.bool(
            "95244",
            "Unbreakable Flamespawn Fists",
            'Mode: [select] only\nShould the bot buy "Unbreakable Flamespawn Fists" ?',
            false,
        ),
        option.bool("94860", "Anjou Duke Hair", 'Mode: [select] only\nShould the bot buy "Anjou Duke Hair" ?', false),
        option.bool("94861", "Anjou Duke Locks", 'Mode: [select] only\nShould the bot buy "Anjou Duke Locks" ?', false),
        option.bool("94862", "Anjou Duke Morph", 'Mode: [select] only\nShould the bot buy "Anjou Duke Morph" ?', false),
        option.bool(
            "94863",
            "Anjou Duke Visage",
            'Mode: [select] only\nShould the bot buy "Anjou Duke Visage" ?',
            false,
        ),
        option.bool(
            "95233",
            "Adamas Flamespawn Morph",
            'Mode: [select] only\nShould the bot buy "Adamas Flamespawn Morph" ?',
            false,
        ),
        option.bool(
            "95234",
            "Adamas Flamespawn Visage",
            'Mode: [select] only\nShould the bot buy "Adamas Flamespawn Visage" ?',
            false,
        ),
        option.bool(
            "95235",
            "Adamas Flamespawn Horns Morph",
            'Mode: [select] only\nShould the bot buy "Adamas Flamespawn Horns Morph" ?',
            false,
        ),
        option.bool(
            "95236",
            "Adamas Flamespawn Horns Visage",
            'Mode: [select] only\nShould the bot buy "Adamas Flamespawn Horns Visage" ?',
            false,
        ),
        option.bool(
            "95237",
            "Adamas Flamespawn Helm",
            'Mode: [select] only\nShould the bot buy "Adamas Flamespawn Helm" ?',
            false,
        ),
        option.bool(
            "95238",
            "Adamas Flamespawn Guard",
            'Mode: [select] only\nShould the bot buy "Adamas Flamespawn Guard" ?',
            false,
        ),
        option.bool(
            "100888",
            "Flame of Rubedo Hood",
            'Mode: [select] only\nShould the bot buy "Flame of Rubedo Hood" ?',
            false,
        ),
        option.bool("100892", "Blade of Rubedo", 'Mode: [select] only\nShould the bot buy "Blade of Rubedo" ?', false),
        option.bool(
            "95241",
            "Ex Incendium Blade",
            'Mode: [select] only\nShould the bot buy "Ex Incendium Blade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: WarwickForestMerge.select,
});

export default function main(): void {
    const script = new WarwickForestMerge();
    Core.bankingBlackList.push("Red Flame of Rubedo", "Yew Ember");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
