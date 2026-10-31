/*
name: Awe Merge
description: This bot will farm the items belonging to the selected mode for the Awe Merge [632] in /museum
tags: awe, merge, museum, prime, spear, guardian, guardians, armored, dragon, pet, flameborn, iceborn, windborn, earthborn, stormborn, waterborn, lightborn, darkborn, baby, enchanted
*/
// Port of Scripts/Good/GearOfAwe/AweMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { ArmorOfAwe } from "./ArmorOfAwe";
import { CoreAwe } from "./CoreAwe";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Awe = new CoreAwe();
const AoA = new ArmorOfAwe();

export class AweMerge {
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
                case "Aura of Awe":
                    if (!Core.isMember) {
                        Core.logger("You need to be member.");
                        break;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(2939);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("crashsite", "Mithril Man", "Evolution Of Awe", 13, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Blade of Awe":

                case "Spear of Awe":

                case "Dagger of Awe":

                case "Staff of Awe":

                case "Guardian Dragon Pet":
                    Adv.buyItem("museum", 631, req.name);
                    break;
                case "Guardian Patent":
                    if (bot.flash.get<number>("world.myAvatar.objData.intAQ") > 0) {
                        Adv.buyItem("museum", 53, "Guardian Patent");
                        break;
                    } else {
                        Core.logger("Active Aq Guardian Acc Required for this Item.");
                    }
                    break;
                case "Baby Red Dragon":
                    Adv.buyItem("AriaPet", 12, req.name);
                    break;
                case "Armor of Awe":
                    AoA.getArmor();
                    break;
                case "Cape of Awe":
                    Awe.getAweRelic("Cape", 4178, 1, 1, "doomvault", "Binky");
                    Adv.buyItem("museum", 1129, "Cape of Awe");
                    break;
            }
        };
        Farm.bladeofAweREP();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("museum", 632, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "17586",
            "Prime Blade of Awe",
            'Mode: [select] only\nShould the bot buy "Prime Blade of Awe" ?',
            false,
        ),
        option.bool(
            "17608",
            "Prime Staff of Awe",
            'Mode: [select] only\nShould the bot buy "Prime Staff of Awe" ?',
            false,
        ),
        option.bool(
            "17609",
            "Prime Spear of Awe",
            'Mode: [select] only\nShould the bot buy "Prime Spear of Awe" ?',
            false,
        ),
        option.bool(
            "17610",
            "Prime Dagger of Awe",
            'Mode: [select] only\nShould the bot buy "Prime Dagger of Awe" ?',
            false,
        ),
        option.bool(
            "17587",
            "Guardian Blade of Awe",
            'Mode: [select] only\nShould the bot buy "Guardian Blade of Awe" ?',
            false,
        ),
        option.bool(
            "17588",
            "Guardian's Prime Blade of Awe",
            'Mode: [select] only\nShould the bot buy "Guardian\'s Prime Blade of Awe" ?',
            false,
        ),
        option.bool(
            "17803",
            "Armored Guardian Dragon Pet",
            'Mode: [select] only\nShould the bot buy "Armored Guardian Dragon Pet" ?',
            false,
        ),
        option.bool(
            "64231",
            "Flameborn Blade of Awe",
            'Mode: [select] only\nShould the bot buy "Flameborn Blade of Awe" ?',
            false,
        ),
        option.bool(
            "64232",
            "Iceborn Blade of Awe",
            'Mode: [select] only\nShould the bot buy "Iceborn Blade of Awe" ?',
            false,
        ),
        option.bool(
            "64233",
            "Windborn Blade of Awe",
            'Mode: [select] only\nShould the bot buy "Windborn Blade of Awe" ?',
            false,
        ),
        option.bool(
            "64234",
            "Earthborn Blade of Awe",
            'Mode: [select] only\nShould the bot buy "Earthborn Blade of Awe" ?',
            false,
        ),
        option.bool(
            "64235",
            "Stormborn Blade of Awe",
            'Mode: [select] only\nShould the bot buy "Stormborn Blade of Awe" ?',
            false,
        ),
        option.bool(
            "64236",
            "Waterborn Blade of Awe",
            'Mode: [select] only\nShould the bot buy "Waterborn Blade of Awe" ?',
            false,
        ),
        option.bool(
            "64237",
            "Lightborn Blade of Awe",
            'Mode: [select] only\nShould the bot buy "Lightborn Blade of Awe" ?',
            false,
        ),
        option.bool(
            "64238",
            "Darkborn Blade of Awe",
            'Mode: [select] only\nShould the bot buy "Darkborn Blade of Awe" ?',
            false,
        ),
        option.bool(
            "73246",
            "Baby Dragon of Awe",
            'Mode: [select] only\nShould the bot buy "Baby Dragon of Awe" ?',
            false,
        ),
        option.bool(
            "68891",
            "Enchanted Armor of Awe",
            'Mode: [select] only\nShould the bot buy "Enchanted Armor of Awe" ?',
            false,
        ),
        option.bool(
            "68892",
            "Enchanted Cape of Awe",
            'Mode: [select] only\nShould the bot buy "Enchanted Cape of Awe" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AweMerge.select,
});

export default function main(): void {
    const script = new AweMerge();
    Core.bankingBlackList.push(
        "Aura of Awe",
        "Blade of Awe",
        "Staff of Awe",
        "Spear of Awe",
        "Dagger of Awe",
        "Guardian Patent",
        "Guardian Dragon Pet",
        "Baby Red Dragon",
        "Armor of Awe",
        "Cape of Awe",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
