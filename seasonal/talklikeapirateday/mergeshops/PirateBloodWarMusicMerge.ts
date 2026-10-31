/*
name: Pirate Blood War Music Merge
description: This bot will farm the items belonging to the selected mode for the Pirate Blood War Music Merge [2483] in /piratebloodhub
tags: pirate, blood, war, music, merge, piratebloodhub, goth, musician, invese, fancy, pigtails, beanie, cut, cat, morph, messenger, bag, backup, guitar, rocker
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/PirateBloodWarMusicMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class PirateBloodWarMusicMerge {
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
                case "Gilded Sheet Music":
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
        Adv.startBuyAllMerge("piratebloodhub", 2483, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("86062", "Goth Musician", 'Mode: [select] only\nShould the bot buy "Goth Musician" ?', false),
        option.bool(
            "86063",
            "Invese Goth Musician",
            'Mode: [select] only\nShould the bot buy "Invese Goth Musician" ?',
            false,
        ),
        option.bool(
            "86070",
            "Fancy Goth Pigtails",
            'Mode: [select] only\nShould the bot buy "Fancy Goth Pigtails" ?',
            false,
        ),
        option.bool("86071", "Goth Beanie Cut", 'Mode: [select] only\nShould the bot buy "Goth Beanie Cut" ?', false),
        option.bool(
            "86072",
            "Goth Beanie Locks",
            'Mode: [select] only\nShould the bot buy "Goth Beanie Locks" ?',
            false,
        ),
        option.bool("86073", "Goth Beanie Hair", 'Mode: [select] only\nShould the bot buy "Goth Beanie Hair" ?', false),
        option.bool(
            "86077",
            "Goth Cat Beanie Cut",
            'Mode: [select] only\nShould the bot buy "Goth Cat Beanie Cut" ?',
            false,
        ),
        option.bool(
            "86078",
            "Goth Cat Beanie Locks",
            'Mode: [select] only\nShould the bot buy "Goth Cat Beanie Locks" ?',
            false,
        ),
        option.bool(
            "86081",
            "Fancy Goth Pigtails Visage",
            'Mode: [select] only\nShould the bot buy "Fancy Goth Pigtails Visage" ?',
            false,
        ),
        option.bool(
            "86082",
            "Goth Beanie Cut Morph",
            'Mode: [select] only\nShould the bot buy "Goth Beanie Cut Morph" ?',
            false,
        ),
        option.bool(
            "86083",
            "Goth Beanie Locks Visage",
            'Mode: [select] only\nShould the bot buy "Goth Beanie Locks Visage" ?',
            false,
        ),
        option.bool(
            "86084",
            "Goth Beanie Hair Visage",
            'Mode: [select] only\nShould the bot buy "Goth Beanie Hair Visage" ?',
            false,
        ),
        option.bool(
            "86088",
            "Goth Cat Beanie Cut Morph",
            'Mode: [select] only\nShould the bot buy "Goth Cat Beanie Cut Morph" ?',
            false,
        ),
        option.bool(
            "86089",
            "Goth Cat Beanie Locks Visage",
            'Mode: [select] only\nShould the bot buy "Goth Cat Beanie Locks Visage" ?',
            false,
        ),
        option.bool(
            "86090",
            "Goth Messenger Bag",
            'Mode: [select] only\nShould the bot buy "Goth Messenger Bag" ?',
            false,
        ),
        option.bool(
            "86092",
            "Backup Goth Guitar",
            'Mode: [select] only\nShould the bot buy "Backup Goth Guitar" ?',
            false,
        ),
        option.bool(
            "86097",
            "Goth Rocker Guitar",
            'Mode: [select] only\nShould the bot buy "Goth Rocker Guitar" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: PirateBloodWarMusicMerge.select,
});

export default function main(): void {
    const script = new PirateBloodWarMusicMerge();
    Core.bankingBlackList.push("Gilded Sheet Music");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
