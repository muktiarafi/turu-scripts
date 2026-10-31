/*
name: Candied Costumes Merge
description: This bot will farm the items belonging to the selected mode for the Candied Costumes Merge [1761] in /candyshop
tags: candied, costumes, merge, candyshop, fairy, tale, wanderer, flesh, ripper, horned, backblades, force, guardian, , beard, back, light, super, scion, ninja, sidemask, scarf, pigtails, masked, backfan, fan, scroll, lightning, ball, balls, lady, vayle, costume, enchanted, tactical, agent, alpha, bravo, gasmask, morph, ol, reliable, zombie, buster, busters, blaster, blasters
*/
// Port of Scripts/Seasonal/Mogloween/MergeShops/CandiedCostumesMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreFarms } from "../../../core/CoreFarms";
import { CoreMogloween } from "../CoreMogloween";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const CMoging = new CoreMogloween();

export class CandiedCostumesMerge {
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
                case "MarshMeowllows":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    //Chocolate and Caramel Cravings 7120
                    Core.registerQuests(7120);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("twigsarcade", "Clucky Moo", "Chocolate Candy", 10);
                        Core.killMonster("pie", "r5", "Left", "Gourdo", "Pumpkin Caramel", 10);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Horehound Bits":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    //Loads of Gummies and Lollies 7121
                    Core.registerQuests(7121);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("twigsarcade", "Baby", "Gummy Babies", 10);
                        Core.huntMonster("pie", "Myst Imp", "Licked Lollies", 10);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Kitty Cordials":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    //Fizzies and Stickies and Gooies OH MY 7122
                    Core.registerQuests(7122);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("twigsarcade", "Ectoplasm", "GOO-dies", 6);
                        Core.huntMonster("chromafection", "Free Samples", "Sour Stickies", 6);
                        Core.huntMonster("candyshop", "Sugarrush Ghoul", "Fuzzy Fizzies", 6);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Candied Jalapeno":

                case "Spicy Sample":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("candyshop", "Sugarrush Ghoul", req.name, undefined, { isTemp: false });
                    break;
                case "Gold Voucher 25k":
                    Farm.voucher(req.name, req.quantity);
                    break;
                case "Tactical Agent Alpha":

                case "Tactical Agent Bravo":

                case "Tactical Agent Bravo Beard":

                case "Tactical Agent Bravo Locks":

                case "Tactical Alpha Rifle":

                case "Tactical Alpha Rifles":

                case "Backup Ol Reliable Zombie Buster":

                case "Gummy Brains":
                    Core.huntMonster("mogloweengrave", "Zombie Terror", req.name, quant, { isTemp: req.temp });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("mogloween")) {
            return;
        }

        CMoging.chromafection();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("candyshop", 1761, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "42610",
            "Fairy Tale Wanderer",
            'Mode: [select] only\nShould the bot buy "Fairy Tale Wanderer" ?',
            false,
        ),
        option.bool("47883", "Flesh Ripper", 'Mode: [select] only\nShould the bot buy "Flesh Ripper" ?', false),
        option.bool(
            "47884",
            "Horned Flesh Ripper Mask",
            'Mode: [select] only\nShould the bot buy "Horned Flesh Ripper Mask" ?',
            false,
        ),
        option.bool(
            "47885",
            "Flesh Ripper Mask",
            'Mode: [select] only\nShould the bot buy "Flesh Ripper Mask" ?',
            false,
        ),
        option.bool(
            "47886",
            "Flesh Ripper Cape",
            'Mode: [select] only\nShould the bot buy "Flesh Ripper Cape" ?',
            false,
        ),
        option.bool(
            "47887",
            "Flesh Ripper Backblades",
            'Mode: [select] only\nShould the bot buy "Flesh Ripper Backblades" ?',
            false,
        ),
        option.bool(
            "47888",
            "Flesh Ripper Blade",
            'Mode: [select] only\nShould the bot buy "Flesh Ripper Blade" ?',
            false,
        ),
        option.bool(
            "50424",
            "Dual Flesh Ripper Blades",
            'Mode: [select] only\nShould the bot buy "Dual Flesh Ripper Blades" ?',
            false,
        ),
        option.bool("48497", "Force Guardian", 'Mode: [select] only\nShould the bot buy "Force Guardian" ?', false),
        option.bool(
            "48498",
            "Force Guardian Helm",
            'Mode: [select] only\nShould the bot buy "Force Guardian Helm" ?',
            false,
        ),
        option.bool(
            "48499",
            "Force Guardian Hair + Beard",
            'Mode: [select] only\nShould the bot buy "Force Guardian Hair + Beard" ?',
            false,
        ),
        option.bool(
            "48500",
            "Force Guardian Hair",
            'Mode: [select] only\nShould the bot buy "Force Guardian Hair" ?',
            false,
        ),
        option.bool(
            "48501",
            "Force Guardian Locks",
            'Mode: [select] only\nShould the bot buy "Force Guardian Locks" ?',
            false,
        ),
        option.bool(
            "48502",
            "Force Guardian Back Staves",
            'Mode: [select] only\nShould the bot buy "Force Guardian Back Staves" ?',
            false,
        ),
        option.bool(
            "48503",
            "Force Guardian Staff + Cape",
            'Mode: [select] only\nShould the bot buy "Force Guardian Staff + Cape" ?',
            false,
        ),
        option.bool(
            "48504",
            "Force Guardian Daggers",
            'Mode: [select] only\nShould the bot buy "Force Guardian Daggers" ?',
            false,
        ),
        option.bool(
            "48505",
            "Force Guardian Light Staff",
            'Mode: [select] only\nShould the bot buy "Force Guardian Light Staff" ?',
            false,
        ),
        option.bool(
            "48507",
            "Force Guardian Light Blade",
            'Mode: [select] only\nShould the bot buy "Force Guardian Light Blade" ?',
            false,
        ),
        option.bool(
            "48655",
            "Super Scion Ninja",
            'Mode: [select] only\nShould the bot buy "Super Scion Ninja" ?',
            false,
        ),
        option.bool("48656", "Super Scion Hair", 'Mode: [select] only\nShould the bot buy "Super Scion Hair" ?', false),
        option.bool(
            "48657",
            "Super Scion SideMask",
            'Mode: [select] only\nShould the bot buy "Super Scion SideMask" ?',
            false,
        ),
        option.bool(
            "48658",
            "Super Scion SideMask + Scarf",
            'Mode: [select] only\nShould the bot buy "Super Scion SideMask + Scarf" ?',
            false,
        ),
        option.bool(
            "48659",
            "Super Scion Hair + Scarf",
            'Mode: [select] only\nShould the bot buy "Super Scion Hair + Scarf" ?',
            false,
        ),
        option.bool("48660", "Super Scion Mask", 'Mode: [select] only\nShould the bot buy "Super Scion Mask" ?', false),
        option.bool(
            "48661",
            "Super Scion Locks",
            'Mode: [select] only\nShould the bot buy "Super Scion Locks" ?',
            false,
        ),
        option.bool(
            "48662",
            "Super Scion Mask + Locks",
            'Mode: [select] only\nShould the bot buy "Super Scion Mask + Locks" ?',
            false,
        ),
        option.bool(
            "48663",
            "Super Scion Locks + Pigtails",
            'Mode: [select] only\nShould the bot buy "Super Scion Locks + Pigtails" ?',
            false,
        ),
        option.bool(
            "48664",
            "Super Scion Pigtails + SideMask",
            'Mode: [select] only\nShould the bot buy "Super Scion Pigtails + SideMask" ?',
            false,
        ),
        option.bool(
            "48665",
            "Super Scion Masked Pigtails + SideMask",
            'Mode: [select] only\nShould the bot buy "Super Scion Masked Pigtails + SideMask" ?',
            false,
        ),
        option.bool("48666", "Super Scion Cape", 'Mode: [select] only\nShould the bot buy "Super Scion Cape" ?', false),
        option.bool(
            "48667",
            "Super Scion BackFan",
            'Mode: [select] only\nShould the bot buy "Super Scion BackFan" ?',
            false,
        ),
        option.bool(
            "48668",
            "Super Scion Fan + Cape",
            'Mode: [select] only\nShould the bot buy "Super Scion Fan + Cape" ?',
            false,
        ),
        option.bool(
            "48669",
            "Super Scion Back Swords",
            'Mode: [select] only\nShould the bot buy "Super Scion Back Swords" ?',
            false,
        ),
        option.bool(
            "48670",
            "Super Scion Back Scroll",
            'Mode: [select] only\nShould the bot buy "Super Scion Back Scroll" ?',
            false,
        ),
        option.bool(
            "48671",
            "Super Scion BackBlades + Cape",
            'Mode: [select] only\nShould the bot buy "Super Scion BackBlades + Cape" ?',
            false,
        ),
        option.bool(
            "48672",
            "Super Scion Blade",
            'Mode: [select] only\nShould the bot buy "Super Scion Blade" ?',
            false,
        ),
        option.bool(
            "48673",
            "Dual Super Scion Blades",
            'Mode: [select] only\nShould the bot buy "Dual Super Scion Blades" ?',
            false,
        ),
        option.bool(
            "48674",
            "Super Scion Lightning Ball",
            'Mode: [select] only\nShould the bot buy "Super Scion Lightning Ball" ?',
            false,
        ),
        option.bool(
            "48675",
            "Dual Super Scion Balls",
            'Mode: [select] only\nShould the bot buy "Dual Super Scion Balls" ?',
            false,
        ),
        option.bool(
            "64298",
            "Lady Vayle Costume",
            'Mode: [select] only\nShould the bot buy "Lady Vayle Costume" ?',
            false,
        ),
        option.bool(
            "84120",
            "Enchanted Tactical Agent Alpha",
            'Mode: [select] only\nShould the bot buy "Enchanted Tactical Agent Alpha" ?',
            false,
        ),
        option.bool(
            "84121",
            "Enchanted Tactical Agent Bravo",
            'Mode: [select] only\nShould the bot buy "Enchanted Tactical Agent Bravo" ?',
            false,
        ),
        option.bool(
            "84122",
            "Tactical Agent Bravo Gasmask",
            'Mode: [select] only\nShould the bot buy "Tactical Agent Bravo Gasmask" ?',
            false,
        ),
        option.bool(
            "84123",
            "Tactical Agent Alpha Gasmask",
            'Mode: [select] only\nShould the bot buy "Tactical Agent Alpha Gasmask" ?',
            false,
        ),
        option.bool(
            "84129",
            "Tactical Agent Bravo Beard Morph",
            'Mode: [select] only\nShould the bot buy "Tactical Agent Bravo Beard Morph" ?',
            false,
        ),
        option.bool(
            "84130",
            "Tactical Agent Bravo Visage",
            'Mode: [select] only\nShould the bot buy "Tactical Agent Bravo Visage" ?',
            false,
        ),
        option.bool(
            "84146",
            "Tactical Alpha Gun",
            'Mode: [select] only\nShould the bot buy "Tactical Alpha Gun" ?',
            false,
        ),
        option.bool(
            "84147",
            "Tactical Alpha Guns",
            'Mode: [select] only\nShould the bot buy "Tactical Alpha Guns" ?',
            false,
        ),
        option.bool(
            "84140",
            "Ol' Reliable Zombie Buster",
            'Mode: [select] only\nShould the bot buy "Ol\' Reliable Zombie Buster" ?',
            false,
        ),
        option.bool(
            "84141",
            "Ol' Reliable Zombie Busters",
            'Mode: [select] only\nShould the bot buy "Ol\' Reliable Zombie Busters" ?',
            false,
        ),
        option.bool(
            "84142",
            "Tactical Alpha Blaster",
            'Mode: [select] only\nShould the bot buy "Tactical Alpha Blaster" ?',
            false,
        ),
        option.bool(
            "84143",
            "Tactical Alpha Blasters",
            'Mode: [select] only\nShould the bot buy "Tactical Alpha Blasters" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CandiedCostumesMerge.select,
});

export default function main(): void {
    const script = new CandiedCostumesMerge();
    Core.bankingBlackList.push(
        "MarshMeowllows",
        "Horehound Bits",
        "Kitty Cordials",
        "Gummy Brains",
        "Gold Voucher 25k",
        "Tactical Agent Alpha",
        "Tactical Agent Bravo",
        "Tactical Agent Bravo Beard",
        "Tactical Agent Bravo Locks",
        "Tactical Alpha Rifle",
        "Tactical Alpha Rifles",
        "Backup Ol Reliable Zombie Buster",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
