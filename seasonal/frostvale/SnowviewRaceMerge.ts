/*
name: Snowview Race Merge
description: This bot will farm the items belonging to the selected mode for the Snowview Race Merge [2196] in /snowviewrace
tags: snowview, race, merge, snowviewrace, frigid, festive, wear, morph, paperboy, cap, papergirl, ice, halation, bell, flail
*/
// Port of Scripts/Seasonal/Frostvale/SnowviewRaceMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFrostvale } from "./story/CoreFrostvale";

const Adv = new CoreAdvanced();
const FV = new CoreFrostvale();

export class SnowviewRaceMerge {
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
                case "Turkey Leg?":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9027);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("snowviewrace", "Aurora Vaderix", "Aurora Wing", undefined, { log: false });
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("snowviewrace", "Bandit Fletcher", "Bandit Leader Bounty", 3, { log: false });
                        Core.huntMonster("snowviewrace", "Juvenile Vaderix", "Vaderix Drumstick", 7, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        FV.snowviewRace();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("snowviewrace", 2196, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "74639",
            "Frigid Festive Wear",
            'Mode: [select] only\nShould the bot buy "Frigid Festive Wear" ?',
            false,
        ),
        option.bool("74640", "Frigid Hair", 'Mode: [select] only\nShould the bot buy "Frigid Hair" ?', false),
        option.bool("74641", "Frigid Locks", 'Mode: [select] only\nShould the bot buy "Frigid Locks" ?', false),
        option.bool(
            "74642",
            "Frigid Hair Morph",
            'Mode: [select] only\nShould the bot buy "Frigid Hair Morph" ?',
            false,
        ),
        option.bool(
            "74643",
            "Frigid Locks Morph",
            'Mode: [select] only\nShould the bot buy "Frigid Locks Morph" ?',
            false,
        ),
        option.bool(
            "74644",
            "Frigid Paperboy Cap",
            'Mode: [select] only\nShould the bot buy "Frigid Paperboy Cap" ?',
            false,
        ),
        option.bool(
            "74645",
            "Frigid Papergirl Cap",
            'Mode: [select] only\nShould the bot buy "Frigid Papergirl Cap" ?',
            false,
        ),
        option.bool(
            "74646",
            "Frigid Ice Halation",
            'Mode: [select] only\nShould the bot buy "Frigid Ice Halation" ?',
            false,
        ),
        option.bool("74647", "Frigid Ice Staff", 'Mode: [select] only\nShould the bot buy "Frigid Ice Staff" ?', false),
        option.bool(
            "74648",
            "Frigid Bell Flail",
            'Mode: [select] only\nShould the bot buy "Frigid Bell Flail" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SnowviewRaceMerge.select,
});

export default function main(): void {
    const script = new SnowviewRaceMerge();
    Core.bankingBlackList.push("Turkey Leg?");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
