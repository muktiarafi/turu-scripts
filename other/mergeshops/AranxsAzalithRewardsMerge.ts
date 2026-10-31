/*
name: Aranxs Azalith Rewards Merge
description: This bot will farm the items belonging to the selected mode for the Aranxs Azalith Rewards Merge [2488] in /apexazalith
tags: aranxs, azalith, rewards, merge, apexazalith, akhas, wings, akha, companion, spear, shield, celestial, wanderer, annals, runic, choir, wanderers, sceptre, scythe, infernal, maahnas, robes, freed
*/
// Port of Scripts/Other/MergeShops/AranxsAzalithRewardsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class AranxsAzalithRewardsMerge {
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
                case "Infernalis Penna":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(
                            9887,
                            ["champazalith", "Maah-na", ClassType.Solo],
                            ["champazalith", "Akh-a", ClassType.Solo],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Infernalis Oculus":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Dodge);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(9888, ["champazalith", "Azalith", ClassType.Dodge]);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Divina Voluntas":
                    Farm.experience(80);
                    Core.logger(`${req.name} cannot be farmed solo, use army.`);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("apexazalith", 2488, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("88586", "Akh-a's Wings", 'Mode: [select] only\nShould the bot buy "Akh-a\'s Wings" ?', false),
        option.bool("88587", "Akh-a Companion", 'Mode: [select] only\nShould the bot buy "Akh-a Companion" ?', false),
        option.bool("88588", "Akh-a's Spear", 'Mode: [select] only\nShould the bot buy "Akh-a\'s Spear" ?', false),
        option.bool(
            "88589",
            "Akh-a's Spear and Shield",
            'Mode: [select] only\nShould the bot buy "Akh-a\'s Spear and Shield" ?',
            false,
        ),
        option.bool(
            "88590",
            "Celestial Wanderer",
            'Mode: [select] only\nShould the bot buy "Celestial Wanderer" ?',
            false,
        ),
        option.bool(
            "88591",
            "Celestial Wanderer Hair",
            'Mode: [select] only\nShould the bot buy "Celestial Wanderer Hair" ?',
            false,
        ),
        option.bool("88592", "Celestial Annals", 'Mode: [select] only\nShould the bot buy "Celestial Annals" ?', false),
        option.bool(
            "88593",
            "Celestial Runic Choir",
            'Mode: [select] only\nShould the bot buy "Celestial Runic Choir" ?',
            false,
        ),
        option.bool(
            "88594",
            "Celestial Wanderer's Sceptre",
            'Mode: [select] only\nShould the bot buy "Celestial Wanderer\'s Sceptre" ?',
            false,
        ),
        option.bool(
            "88595",
            "Celestial Wanderer's Scythe",
            'Mode: [select] only\nShould the bot buy "Celestial Wanderer\'s Scythe" ?',
            false,
        ),
        option.bool(
            "88596",
            "Infernal Wanderer",
            'Mode: [select] only\nShould the bot buy "Infernal Wanderer" ?',
            false,
        ),
        option.bool(
            "88597",
            "Infernal Wanderer Hood",
            'Mode: [select] only\nShould the bot buy "Infernal Wanderer Hood" ?',
            false,
        ),
        option.bool("88598", "Infernal Annals", 'Mode: [select] only\nShould the bot buy "Infernal Annals" ?', false),
        option.bool(
            "88599",
            "Infernal Runic Choir",
            'Mode: [select] only\nShould the bot buy "Infernal Runic Choir" ?',
            false,
        ),
        option.bool(
            "88600",
            "Infernal Wanderer's Scythe",
            'Mode: [select] only\nShould the bot buy "Infernal Wanderer\'s Scythe" ?',
            false,
        ),
        option.bool("88601", "Maah-na's Robes", 'Mode: [select] only\nShould the bot buy "Maah-na\'s Robes" ?', false),
        option.bool("88602", "Maah-na's Hood", 'Mode: [select] only\nShould the bot buy "Maah-na\'s Hood" ?', false),
        option.bool("88603", "Maah-na's Wings", 'Mode: [select] only\nShould the bot buy "Maah-na\'s Wings" ?', false),
        option.bool(
            "88604",
            "Maah-na's Freed Wings",
            'Mode: [select] only\nShould the bot buy "Maah-na\'s Freed Wings" ?',
            false,
        ),
        option.bool(
            "88636",
            "Celestial Wanderer Hood",
            'Mode: [select] only\nShould the bot buy "Celestial Wanderer Hood" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AranxsAzalithRewardsMerge.select,
});

export default function main(): void {
    const script = new AranxsAzalithRewardsMerge();
    Core.bankingBlackList.push("Infernalis Penna", "Infernalis Oculus", "Divina Voluntas");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
