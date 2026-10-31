/*
name: Twiggus Gear Merge
description: This bot will farm the items belonging to the selected mode for the Twiggus Gear Merge [2272] in /murdermoon
tags: twiggus, gear, merge, murdermoon, gold, voucher, k, astravian, enforcer, cap, flapped, cloaked, complete, halo, mace, sickle, sickles, backhand, lil, twiggu, guest, hoverpram, thruster, baby, pod, pet, murder, moon, base, hideout
*/
// Port of Scripts/Seasonal/MayThe4th/TwiggusGearMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class TwiggusGearMerge {
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
                case "Fwog Egg":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9223);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("murdermoon", "Tempest Soldier", undefined, undefined, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Astravian Enforcer Crescent Halo":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("murdermoon", "Fifth Sepulchure", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Large Hoverpram Shard":

                case "Hoverpram Fragments":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("zorbaspit", "Zorblatt", req.name, quant, { isTemp: req.temp });
                    break;
                case "Cyber Crystal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8065);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("murdermoon", "r2", "Left", "Tempest Soldier", "Tempest Soldier Badge", 5, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Salvaged Droid Part":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9703);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("twigguhunt", "r2", "Down", "*", "Broken Droid Part", 300, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("murdermoon")) {
            return;
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("murdermoon", 2272, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "77676",
            "Astravian Enforcer",
            'Mode: [select] only\nShould the bot buy "Astravian Enforcer" ?',
            false,
        ),
        option.bool(
            "77678",
            "Astravian Enforcer Hair",
            'Mode: [select] only\nShould the bot buy "Astravian Enforcer Hair" ?',
            false,
        ),
        option.bool(
            "77679",
            "Astravian Enforcer Locks",
            'Mode: [select] only\nShould the bot buy "Astravian Enforcer Locks" ?',
            false,
        ),
        option.bool(
            "77680",
            "Astravian Enforcer Cap",
            'Mode: [select] only\nShould the bot buy "Astravian Enforcer Cap" ?',
            false,
        ),
        option.bool(
            "77681",
            "Astravian Enforcer Cap and Locks",
            'Mode: [select] only\nShould the bot buy "Astravian Enforcer Cap and Locks" ?',
            false,
        ),
        option.bool(
            "77682",
            "Astravian Enforcer Flapped Cap",
            'Mode: [select] only\nShould the bot buy "Astravian Enforcer Flapped Cap" ?',
            false,
        ),
        option.bool(
            "77683",
            "Astravian Enforcer Flapped Cap and Locks",
            'Mode: [select] only\nShould the bot buy "Astravian Enforcer Flapped Cap and Locks" ?',
            false,
        ),
        option.bool(
            "77684",
            "Astravian Enforcer Helm",
            'Mode: [select] only\nShould the bot buy "Astravian Enforcer Helm" ?',
            false,
        ),
        option.bool(
            "77677",
            "Astravian Cloaked Enforcer",
            'Mode: [select] only\nShould the bot buy "Astravian Cloaked Enforcer" ?',
            false,
        ),
        option.bool(
            "77685",
            "Astravian Enforcer Cape",
            'Mode: [select] only\nShould the bot buy "Astravian Enforcer Cape" ?',
            false,
        ),
        option.bool(
            "77687",
            "Astravian Enforcer Complete Halo",
            'Mode: [select] only\nShould the bot buy "Astravian Enforcer Complete Halo" ?',
            false,
        ),
        option.bool(
            "77690",
            "Astravian Enforcer Mace",
            'Mode: [select] only\nShould the bot buy "Astravian Enforcer Mace" ?',
            false,
        ),
        option.bool(
            "77691",
            "Astravian Enforcer Sickle",
            'Mode: [select] only\nShould the bot buy "Astravian Enforcer Sickle" ?',
            false,
        ),
        option.bool(
            "77692",
            "Astravian Enforcer Sickles",
            'Mode: [select] only\nShould the bot buy "Astravian Enforcer Sickles" ?',
            false,
        ),
        option.bool(
            "77693",
            "Astravian Enforcer Backhand Sickle",
            'Mode: [select] only\nShould the bot buy "Astravian Enforcer Backhand Sickle" ?',
            false,
        ),
        option.bool(
            "77694",
            "Astravian Enforcer Backhand Sickles",
            'Mode: [select] only\nShould the bot buy "Astravian Enforcer Backhand Sickles" ?',
            false,
        ),
        option.bool(
            "77738",
            "L'il Twiggu Guest",
            'Mode: [select] only\nShould the bot buy "L\'il Twiggu Guest" ?',
            false,
        ),
        option.bool(
            "77919",
            "Hoverpram Thruster",
            'Mode: [select] only\nShould the bot buy "Hoverpram Thruster" ?',
            false,
        ),
        option.bool(
            "77737",
            "Baby Twiggu's Pod Pet",
            'Mode: [select] only\nShould the bot buy "Baby Twiggu\'s Pod Pet" ?',
            false,
        ),
        option.bool("86008", "Murder Moon Base", 'Mode: [select] only\nShould the bot buy "Murder Moon Base" ?', false),
        option.bool(
            "86007",
            "Twiggu's Hideout",
            'Mode: [select] only\nShould the bot buy "Twiggu\'s Hideout" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TwiggusGearMerge.select,
});

export default function main(): void {
    const script = new TwiggusGearMerge();
    Core.bankingBlackList.push(
        "Fwog Egg",
        "Astravian Enforcer Crescent Halo",
        "Large Hoverpram Shard",
        "Hoverpram Fragments",
        "Cyber Crystal",
        "Salvaged Droid Part",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
