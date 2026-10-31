/*
name: Beleen's Gifts
description: Farms the materials needed for Beleen's Gifts Merge in canalshore.
tags: beleen's gifts, merge, love, canalshore, seasonal
*/
// Port of Scripts/Seasonal/HerosHeartDay/BeleensGiftsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class BeleensGiftsMerge {
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
                case "Beleen's Gratitude":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    if (Core.isMember) {
                        Core.registerQuests(7355);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("canalshore", "Fishwing", "Fishwing Defeated", 6, { log: false });
                            Core.huntMonster("canalshore", "MerSiren", "MerSiren Defeated", 8, { log: false });
                            bot.wait.forPickup(req.name);
                        }
                    } else {
                        Core.registerQuests(7351);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("canalshore", "Water Elemental", "Water Elemental Defeated", 5, {
                                log: false,
                            });
                            bot.wait.forPickup(req.name);
                        }
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Townspeople's Affection":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    if (Core.isMember) {
                        Core.registerQuests(7355);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("canalshore", "Fishwing", "Fishwing Defeated", 6, { log: false });
                            Core.huntMonster("canalshore", "MerSiren", "MerSiren Defeated", 8, { log: false });
                            bot.wait.forPickup(req.name);
                        }
                    } else {
                        Core.registerQuests(7350);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("canalshore", "Trapped Snack", "Civilian Rescued", 4, { log: false });
                            Core.huntMonster("canalshore", "MerSiren", "MerSiren Defeated", 5, { log: false });
                            bot.wait.forPickup(req.name);
                        }
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Astice's Claw":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    if (Core.isMember) {
                        Core.registerQuests(7356);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("canalshore", "Astice", "Broken Claw", undefined, { log: false });
                            bot.wait.forPickup(req.name);
                        }
                    } else {
                        Core.registerQuests(7352);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("canalshore", "Astice", "Astice Defeated", undefined, { log: false });
                            bot.wait.forPickup(req.name);
                        }
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("canalshore", 1833, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "53228",
            "Leviathan Warrior",
            'Mode: [select] only\nShould the bot buy "Leviathan Warrior" ?',
            false,
        ),
        option.bool(
            "53229",
            "Leviathan Warrior's Helm",
            'Mode: [select] only\nShould the bot buy "Leviathan Warrior\'s Helm" ?',
            false,
        ),
        option.bool(
            "53230",
            "Leviathan Warrior's Helm + Locks",
            'Mode: [select] only\nShould the bot buy "Leviathan Warrior\'s Helm + Locks" ?',
            false,
        ),
        option.bool(
            "53231",
            "Leviathan Warrior's Crown",
            'Mode: [select] only\nShould the bot buy "Leviathan Warrior\'s Crown" ?',
            false,
        ),
        option.bool(
            "53232",
            "Leviathan Warrior Morph",
            'Mode: [select] only\nShould the bot buy "Leviathan Warrior Morph" ?',
            false,
        ),
        option.bool(
            "53233",
            "Leviathan Warrior Morph + Locks",
            'Mode: [select] only\nShould the bot buy "Leviathan Warrior Morph + Locks" ?',
            false,
        ),
        option.bool(
            "53234",
            "Leviathan Warrior's Back Trident",
            'Mode: [select] only\nShould the bot buy "Leviathan Warrior\'s Back Trident" ?',
            false,
        ),
        option.bool(
            "53235",
            "Leviathan Warrior's Trident",
            'Mode: [select] only\nShould the bot buy "Leviathan Warrior\'s Trident" ?',
            false,
        ),
        option.bool(
            "53236",
            "Dual Leviathan Warrior Tridents",
            'Mode: [select] only\nShould the bot buy "Dual Leviathan Warrior Tridents" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BeleensGiftsMerge.select,
});

export default function main(): void {
    const script = new BeleensGiftsMerge();
    Core.bankingBlackList.push("Beleen's Gratitude", "Townspeople's Affection", "Astice's Claw");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
