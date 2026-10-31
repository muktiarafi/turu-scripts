/*
name: QueensReignMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/QueensReignMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class QueensReignMerge {
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
                case "Ancient Hourglass":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8326);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("queenreign", "Sa-Laatan", "Sa-Lataan Defeated");
                        Core.huntMonster("queenreign", "Grou'luu", "Grou'luu Defeated");
                        Core.huntMonster("queenreign", "Extriki", "Extriki Defeated");
                        Core.huntMonster("queenreign", "Jaaku", "Jaaku Defeated");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "LightningLord":

                case "LightningLord Helm":

                case "LightningLord Locks":

                case "LightningLord Rune":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("queenreign", "Extriki", req.name);
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("queenreign", 2058, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("64192", "Geomancer Armor", 'Mode: [select] only\nShould the bot buy "Geomancer Armor" ?', false),
        option.bool("64193", "Geomancer Hair", 'Mode: [select] only\nShould the bot buy "Geomancer Hair" ?', false),
        option.bool("64194", "Geomancer Cape", 'Mode: [select] only\nShould the bot buy "Geomancer Cape" ?', false),
        option.bool("64195", "Geomancer Dagger", 'Mode: [select] only\nShould the bot buy "Geomancer Dagger" ?', false),
        option.bool(
            "64248",
            "Prismatic LightningLord",
            'Mode: [select] only\nShould the bot buy "Prismatic LightningLord" ?',
            false,
        ),
        option.bool(
            "64249",
            "Prismatic LightningLord Helm",
            'Mode: [select] only\nShould the bot buy "Prismatic LightningLord Helm" ?',
            false,
        ),
        option.bool(
            "64250",
            "Prismatic LightningLord Locks",
            'Mode: [select] only\nShould the bot buy "Prismatic LightningLord Locks" ?',
            false,
        ),
        option.bool(
            "64251",
            "Prismatic LightningLord Rune",
            'Mode: [select] only\nShould the bot buy "Prismatic LightningLord Rune" ?',
            false,
        ),
        option.bool(
            "64258",
            "Magistral Aeromancer",
            'Mode: [select] only\nShould the bot buy "Magistral Aeromancer" ?',
            false,
        ),
        option.bool(
            "64260",
            "Magistral Sage's Hood",
            'Mode: [select] only\nShould the bot buy "Magistral Sage\'s Hood" ?',
            false,
        ),
        option.bool(
            "64261",
            "Magistral's Velificatio",
            'Mode: [select] only\nShould the bot buy "Magistral\'s Velificatio" ?',
            false,
        ),
        option.bool(
            "64262",
            "Magistral's Divine Velificatio",
            'Mode: [select] only\nShould the bot buy "Magistral\'s Divine Velificatio" ?',
            false,
        ),
        option.bool(
            "64263",
            "Magistral's Longbow",
            'Mode: [select] only\nShould the bot buy "Magistral\'s Longbow" ?',
            false,
        ),
        option.bool(
            "64264",
            "Magistral's Bow + Arrow",
            'Mode: [select] only\nShould the bot buy "Magistral\'s Bow + Arrow" ?',
            false,
        ),
        option.bool(
            "64265",
            "Magistral's Weather Staff",
            'Mode: [select] only\nShould the bot buy "Magistral\'s Weather Staff" ?',
            false,
        ),
        option.bool("64359", "Drenched Monk", 'Mode: [select] only\nShould the bot buy "Drenched Monk" ?', false),
        option.bool("64365", "Liquified Hood", 'Mode: [select] only\nShould the bot buy "Liquified Hood" ?', false),
        option.bool(
            "64361",
            "Drenched Pigtails",
            'Mode: [select] only\nShould the bot buy "Drenched Pigtails" ?',
            false,
        ),
        option.bool("64360", "Drenched Cut", 'Mode: [select] only\nShould the bot buy "Drenched Cut" ?', false),
        option.bool(
            "64367",
            "Drenched Ringstaff",
            'Mode: [select] only\nShould the bot buy "Drenched Ringstaff" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: QueensReignMerge.select,
});

export default function main(): void {
    const script = new QueensReignMerge();
    Core.bankingBlackList.push(
        "Ancient Hourglass",
        "LightningLord",
        "LightningLord Helm",
        "LightningLord Locks",
        "LightningLord Rune ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
