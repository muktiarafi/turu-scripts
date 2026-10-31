/*
name: Pirate Blood War Merge
description: This bot will farm the items belonging to the selected mode for the Pirate Blood War Merge [2482] in /piratebloodhub
tags: pirate, blood, war, merge, piratebloodhub, enchanted, isles, corsair, corsairs, accoutrements, battle, morph, patch, skull, pet, cutlass, cutlasses, siren, poacher, beard, eyepatch, vampiric, bloodthirst, whip, backup, golden, anchor, gold, chain, hook, hooks
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/PirateBloodWarMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class PirateBloodWarMerge {
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
                case "Blood Testament Trophy":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9868, 9869);
                    Core.killMonster("piratevampire", "r2", "Left", "*", req.name, quant, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("piratebloodhub", 2482, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "88172",
            "Enchanted Blood Isles Corsair",
            'Mode: [select] only\nShould the bot buy "Enchanted Blood Isles Corsair" ?',
            false,
        ),
        option.bool(
            "88173",
            "Enchanted Corsair's Accoutrements",
            'Mode: [select] only\nShould the bot buy "Enchanted Corsair\'s Accoutrements" ?',
            false,
        ),
        option.bool(
            "88174",
            "Enchanted Corsair's Battle Morph",
            'Mode: [select] only\nShould the bot buy "Enchanted Corsair\'s Battle Morph" ?',
            false,
        ),
        option.bool(
            "88175",
            "Enchanted Corsair's Patch",
            'Mode: [select] only\nShould the bot buy "Enchanted Corsair\'s Patch" ?',
            false,
        ),
        option.bool(
            "88176",
            "Enchanted Corsair's Hat",
            'Mode: [select] only\nShould the bot buy "Enchanted Corsair\'s Hat" ?',
            false,
        ),
        option.bool(
            "88180",
            "Blood Isles Skull Pet",
            'Mode: [select] only\nShould the bot buy "Blood Isles Skull Pet" ?',
            false,
        ),
        option.bool(
            "88181",
            "Enchanted Blood Isles Cutlass",
            'Mode: [select] only\nShould the bot buy "Enchanted Blood Isles Cutlass" ?',
            false,
        ),
        option.bool(
            "88182",
            "Enchanted Blood Isles Cutlasses",
            'Mode: [select] only\nShould the bot buy "Enchanted Blood Isles Cutlasses" ?',
            false,
        ),
        option.bool(
            "88269",
            "Siren Poacher Beard",
            'Mode: [select] only\nShould the bot buy "Siren Poacher Beard" ?',
            false,
        ),
        option.bool(
            "80988",
            "Siren Poacher Patch",
            'Mode: [select] only\nShould the bot buy "Siren Poacher Patch" ?',
            false,
        ),
        option.bool(
            "80989",
            "Siren Poacher Eyepatch and Locks",
            'Mode: [select] only\nShould the bot buy "Siren Poacher Eyepatch and Locks" ?',
            false,
        ),
        option.bool(
            "88039",
            "Vampiric Bloodthirst Whip",
            'Mode: [select] only\nShould the bot buy "Vampiric Bloodthirst Whip" ?',
            false,
        ),
        option.bool(
            "88194",
            "Blood Isles Backup Guns",
            'Mode: [select] only\nShould the bot buy "Blood Isles Backup Guns" ?',
            false,
        ),
        option.bool("88195", "Golden Anchor", 'Mode: [select] only\nShould the bot buy "Golden Anchor" ?', false),
        option.bool(
            "88214",
            "Gold Chain and Hook",
            'Mode: [select] only\nShould the bot buy "Gold Chain and Hook" ?',
            false,
        ),
        option.bool(
            "88215",
            "Gold Chain and Hooks",
            'Mode: [select] only\nShould the bot buy "Gold Chain and Hooks" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: PirateBloodWarMerge.select,
});

export default function main(): void {
    const script = new PirateBloodWarMerge();
    Core.bankingBlackList.push("Blood Testament Trophy");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
