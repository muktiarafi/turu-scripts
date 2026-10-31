/*
name: Titan Attack Gear Merge
description: This bot will farm the items belonging to the selected mode for the Titan Attack Gear Merge [2149] in /titanattack
tags: titan, attack, gear, merge, titanattack, paladin, paladins, cloak, , vindicator, xl, titans, primaris, cut, morph, chainsword, chainswords, hammer, hammers, powerfist
*/
// Port of Scripts/Other/MergeShops/TitanAttackGearMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { TitanAttackStory } from "../../story/TitanAttack";

const Adv = new CoreAdvanced();
const TAS = new TitanAttackStory();

export class TitanAttackGearMerge {
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
                case "AntiTitan Supplies":
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("titanattack", "r9", "Left", "*", req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Golden Sun Seal":

                case "Titan Paladin's Blade":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titanattack", "Titanic Paladin", req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Vindicator Titan":

                case "Vindicator Titan's Axe":

                case "Titanic Fluid":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titanattack", "Titanic Vindicator", req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Holy Wasabi Jar":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titanattack", "Supply Caravan", req.name, quant, { isTemp: false });
                    break;
                case "Holy Hand Grenade":
                    Adv.buyItem("castle", 88, 1843, quant, 1847);
                    break;
            }
        };
        TAS.doAll();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("titanattack", 2149, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("68025", "Titan Paladin", 'Mode: [select] only\nShould the bot buy "Titan Paladin" ?', false),
        option.bool(
            "68026",
            "Titan Paladin's Helm",
            'Mode: [select] only\nShould the bot buy "Titan Paladin\'s Helm" ?',
            false,
        ),
        option.bool(
            "68027",
            "Titan Paladin's Cloak",
            'Mode: [select] only\nShould the bot buy "Titan Paladin\'s Cloak" ?',
            false,
        ),
        option.bool(
            "68028",
            "Titan Paladin's Cloak + Blade",
            'Mode: [select] only\nShould the bot buy "Titan Paladin\'s Cloak + Blade" ?',
            false,
        ),
        option.bool(
            "71441",
            "Titan Paladin's Blades",
            'Mode: [select] only\nShould the bot buy "Titan Paladin\'s Blades" ?',
            false,
        ),
        option.bool(
            "68036",
            "Vindicator Titan XL",
            'Mode: [select] only\nShould the bot buy "Vindicator Titan XL" ?',
            false,
        ),
        option.bool(
            "68037",
            "Vindicator Titan's Helm",
            'Mode: [select] only\nShould the bot buy "Vindicator Titan\'s Helm" ?',
            false,
        ),
        option.bool(
            "68038",
            "Vindicator Titan's Cloak",
            'Mode: [select] only\nShould the bot buy "Vindicator Titan\'s Cloak" ?',
            false,
        ),
        option.bool(
            "68040",
            "Vindicator Titan's Axes",
            'Mode: [select] only\nShould the bot buy "Vindicator Titan\'s Axes" ?',
            false,
        ),
        option.bool("77740", "Primaris Paladin", 'Mode: [select] only\nShould the bot buy "Primaris Paladin" ?', false),
        option.bool(
            "77741",
            "Primaris Paladin's Cut",
            'Mode: [select] only\nShould the bot buy "Primaris Paladin\'s Cut" ?',
            false,
        ),
        option.bool(
            "77742",
            "Primaris Paladin's Locks",
            'Mode: [select] only\nShould the bot buy "Primaris Paladin\'s Locks" ?',
            false,
        ),
        option.bool(
            "77743",
            "Primaris Paladin's Morph",
            'Mode: [select] only\nShould the bot buy "Primaris Paladin\'s Morph" ?',
            false,
        ),
        option.bool(
            "77744",
            "Primaris Paladin's Helmet",
            'Mode: [select] only\nShould the bot buy "Primaris Paladin\'s Helmet" ?',
            false,
        ),
        option.bool(
            "77745",
            "Primaris Paladin's Hooded Helmet",
            'Mode: [select] only\nShould the bot buy "Primaris Paladin\'s Hooded Helmet" ?',
            false,
        ),
        option.bool(
            "77746",
            "Primaris Paladin's Cape",
            'Mode: [select] only\nShould the bot buy "Primaris Paladin\'s Cape" ?',
            false,
        ),
        option.bool(
            "77748",
            "Primaris Paladin's Chainsword",
            'Mode: [select] only\nShould the bot buy "Primaris Paladin\'s Chainsword" ?',
            false,
        ),
        option.bool(
            "77749",
            "Primaris Paladin's Chainswords",
            'Mode: [select] only\nShould the bot buy "Primaris Paladin\'s Chainswords" ?',
            false,
        ),
        option.bool(
            "77750",
            "Primaris Paladin's Hammer",
            'Mode: [select] only\nShould the bot buy "Primaris Paladin\'s Hammer" ?',
            false,
        ),
        option.bool(
            "77751",
            "Primaris Paladin's Hammers",
            'Mode: [select] only\nShould the bot buy "Primaris Paladin\'s Hammers" ?',
            false,
        ),
        option.bool(
            "77752",
            "Primaris Paladin's Axe",
            'Mode: [select] only\nShould the bot buy "Primaris Paladin\'s Axe" ?',
            false,
        ),
        option.bool(
            "77753",
            "Primaris Paladin's PowerFist",
            'Mode: [select] only\nShould the bot buy "Primaris Paladin\'s PowerFist" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TitanAttackGearMerge.select,
});

export default function main(): void {
    const script = new TitanAttackGearMerge();
    Core.bankingBlackList.push(
        "AntiTitan Supplies",
        "Titanic Fluid",
        "Titan Paladin's Blade",
        "Vindicator Titan",
        "Vindicator Titan's Axe",
        "Golden Sun Seal",
        "Holy Wasabi Jar",
        "Holy Hand Grenade",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
