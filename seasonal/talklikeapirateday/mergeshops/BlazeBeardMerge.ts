/*
name: Blazebeard Merge
description: Farms the Blazebeard Merge [108] in /blazebeard.
tags: blazebeard, merge, blazebeard, merge
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/BlazeBeardMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class BlazebeardMerge {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Alpha Pirate Class Token":
                    Core.farmingLogger(req.name, quant);
                    if (!Core.checkInventory("Classic Alpha Pirate")) {
                        Core.logger(
                            "Cannot automate Classic Alpha Pirate [22] for New Alpha Pirate Class [4552] from this map.",
                            undefined,
                            { messageBox: true, stopBot: true },
                        );
                    }
                    Core.registerQuests(4552);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("blazebeard", "Undead Pirate", "Rusty Nail", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Blaze Gem":

                // #FROM CASE STORAGE
                case "Explorer Pistol":
                    // #FROM CASE STORAGE
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ManaCannon", "Blazebeard", req.name, undefined, { isTemp: false });
                    break;
                case "Pirate Class Token":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(252, 1)) {
                        while (!bot.shouldExit && !Core.checkInventory(252, 1)) {
                            Core.logger("Recursive quest dependency detected at New Pirate Class [4551].", undefined, {
                                messageBox: true,
                                stopBot: true,
                            });
                            bot.wait.forPickup(252);
                        }
                        Core.ensureAccept(4551);
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("blazebeard", "Undead Pirate", "Rusty Nail", 1);
                        Core.ensureComplete(4551);
                        bot.wait.forPickup(252);
                    }
                    Core.registerQuests(4551);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("blazebeard", "Undead Pirate", "Rusty Nail", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Pirate Mage Token":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(Core.isMember ? 4531 : 4528);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("blazebeard", "Pirate Crew", "Crew Member Beaten", 10);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(`The bot hasn't been taught how to get ${req.name}.`, undefined, {
                        messageBox: shouldStop,
                        stopBot: shouldStop,
                    });
                    break;
                }
            }
        };
        Adv.startBuyAllMerge("blazebeard", 108, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool(
            "31158",
            "Crimson Pirate Mage",
            'Mode: [select] only\nShould the bot buy "Crimson Pirate Mage" ?',
            false,
        ),
        option.bool(
            "35079",
            "Platinum Pirate Mage",
            'Mode: [select] only\nShould the bot buy "Platinum Pirate Mage" ?',
            false,
        ),
        option.bool(
            "31165",
            "Crimson Pirate Mage Weapons",
            'Mode: [select] only\nShould the bot buy "Crimson Pirate Mage Weapons" ?',
            false,
        ),
        option.bool(
            "31166",
            "Pirate Mage Side Cutlass",
            'Mode: [select] only\nShould the bot buy "Pirate Mage Side Cutlass" ?',
            false,
        ),
        option.bool("31281", "Alpha Pirate", 'Mode: [select] only\nShould the bot buy "Alpha Pirate" ?', false),
        option.bool("31176", "Pirate", 'Mode: [select] only\nShould the bot buy "Pirate" ?', false),
        option.bool(
            "31227",
            "Dual Great Golden Pistols",
            'Mode: [select] only\nShould the bot buy "Dual Great Golden Pistols" ?',
            false,
        ),
        option.bool(
            "31178",
            "Dual Pirate Mage Flintlock",
            'Mode: [select] only\nShould the bot buy "Dual Pirate Mage Flintlock" ?',
            false,
        ),
        option.bool(
            "31179",
            "Dual Pirate Mage Cutlasses",
            'Mode: [select] only\nShould the bot buy "Dual Pirate Mage Cutlasses" ?',
            false,
        ),
        option.bool(
            "31180",
            "Pirate Mage Flintlock and Cutlass",
            'Mode: [select] only\nShould the bot buy "Pirate Mage Flintlock and Cutlass" ?',
            false,
        ),
        option.bool(
            "31170",
            "Pirate Mage Flintlock",
            'Mode: [select] only\nShould the bot buy "Pirate Mage Flintlock" ?',
            false,
        ),
        option.bool(
            "31224",
            "Golden Explorer Pistol",
            'Mode: [select] only\nShould the bot buy "Golden Explorer Pistol" ?',
            false,
        ),
        option.bool(
            "31225",
            "Great Golden Explorer Pistol",
            'Mode: [select] only\nShould the bot buy "Great Golden Explorer Pistol" ?',
            false,
        ),
        option.bool(
            "31159",
            "Crimson Pirate Mage Hood",
            'Mode: [select] only\nShould the bot buy "Crimson Pirate Mage Hood" ?',
            false,
        ),
        option.bool(
            "31160",
            "Crimson Pirate Mage Tricorn",
            'Mode: [select] only\nShould the bot buy "Crimson Pirate Mage Tricorn" ?',
            false,
        ),
        option.bool(
            "31161",
            "Crimson Pirate Mage Tricorn Locks",
            'Mode: [select] only\nShould the bot buy "Crimson Pirate Mage Tricorn Locks" ?',
            false,
        ),
        option.bool(
            "31162",
            "Crimson Pirate Mage Hat",
            'Mode: [select] only\nShould the bot buy "Crimson Pirate Mage Hat" ?',
            false,
        ),
        option.bool(
            "31164",
            "Crimson Pirate Mage Locks",
            'Mode: [select] only\nShould the bot buy "Crimson Pirate Mage Locks" ?',
            false,
        ),
        option.bool(
            "35081",
            "Platinum Pirate Mage Tricorn Locks",
            'Mode: [select] only\nShould the bot buy "Platinum Pirate Mage Tricorn Locks" ?',
            false,
        ),
        option.bool(
            "35080",
            "Platinum Pirate Mage Tricorn",
            'Mode: [select] only\nShould the bot buy "Platinum Pirate Mage Tricorn" ?',
            false,
        ),
        option.bool(
            "31172",
            "Pirate Mage SpellBook",
            'Mode: [select] only\nShould the bot buy "Pirate Mage SpellBook" ?',
            false,
        ),
        option.bool(
            "31177",
            "Alpha Ferret Pirate",
            'Mode: [select] only\nShould the bot buy "Alpha Ferret Pirate" ?',
            false,
        ),
        option.bool(
            "31167",
            "Pirate Mage Skull Staff",
            'Mode: [select] only\nShould the bot buy "Pirate Mage Skull Staff" ?',
            false,
        ),
        option.bool(
            "31168",
            "Pirate Mage Harpoon",
            'Mode: [select] only\nShould the bot buy "Pirate Mage Harpoon" ?',
            false,
        ),
        option.bool(
            "31169",
            "Pirate Mage Flintlock Staff",
            'Mode: [select] only\nShould the bot buy "Pirate Mage Flintlock Staff" ?',
            false,
        ),
        option.bool(
            "31171",
            "Pirate Mage Cutlass",
            'Mode: [select] only\nShould the bot buy "Pirate Mage Cutlass" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BlazebeardMerge.select,
});

export default function main(): void {
    const script = new BlazebeardMerge();
    Core.bankingBlackList.push(
        "Alpha Pirate Class Token",
        "Blaze Gem",
        "Explorer Pistol",
        "Pirate Class Token",
        "Pirate Mage Token",
    );
    Core.setOptions();
    script.buyAllMerge();
    Core.setOptions(false);
}
