/*
name: Chaos Militia Merge
description: This bot will farm the items belonging to the selected mode for the Chaos Militia Merge [1890] in /crownsreach
tags: chaos, militia, merge, crownsreach, chaotic, savage, morph, , skullcap, hammer, accoutrements, mage, robe, iaste
*/
// Port of Scripts/Other/MergeShops/ChaosMilitiaMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Daily = new CoreDailies();

export class ChaosMilitiaMerge {
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
                case "Heroic Berserker":

                case "Heroic Berserker Shag":

                case "Heroic Berserker Locks":

                case "Heroic Berserker Skullcap":

                case "Heroic Berserker Blade":

                case "Heroic Berserker Hammer":

                case "Heroic Berserker Axe":

                case "Heroic Berserker Accoutrements":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("chaosmilitia", "Xiang", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Militia Merit":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(5775, "citadel", "Inquisitor Guard");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Darkblood Guards":
                    Core.farmingLogger(req.name, quant);
                    Adv.buyItem("falguard", 544, req.name, quant);
                    break;
                case "Enchanted Dark Blood":
                    Core.farmingLogger(req.name, quant);
                    Daily.enchantedDarkBlood();
                    if (!Core.checkInventory(req.name, quant)) {
                        Core.logger(
                            `${req.name} is a daily quest drop, you have ${bot.inventory.getQuantity(req.name)} out of ${quant}. Run the script again tomorrow.`,
                        );
                    }
                    break;
            }
        };
        Farm.chaosREP();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("crownsreach", 1890, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("55291", "Chaotic Savage", 'Mode: [select] only\nShould the bot buy "Chaotic Savage" ?', false),
        option.bool(
            "55292",
            "Chaotic Savage Morph",
            'Mode: [select] only\nShould the bot buy "Chaotic Savage Morph" ?',
            false,
        ),
        option.bool(
            "55293",
            "Chaotic Savage Morph + Locks",
            'Mode: [select] only\nShould the bot buy "Chaotic Savage Morph + Locks" ?',
            false,
        ),
        option.bool(
            "55294",
            "Chaotic Savage Skullcap",
            'Mode: [select] only\nShould the bot buy "Chaotic Savage Skullcap" ?',
            false,
        ),
        option.bool(
            "55299",
            "Chaotic Savage Blade",
            'Mode: [select] only\nShould the bot buy "Chaotic Savage Blade" ?',
            false,
        ),
        option.bool(
            "55298",
            "Chaotic Savage Hammer",
            'Mode: [select] only\nShould the bot buy "Chaotic Savage Hammer" ?',
            false,
        ),
        option.bool(
            "55297",
            "Chaotic Savage Axe",
            'Mode: [select] only\nShould the bot buy "Chaotic Savage Axe" ?',
            false,
        ),
        option.bool(
            "55296",
            "Chaotic Savage Accoutrements",
            'Mode: [select] only\nShould the bot buy "Chaotic Savage Accoutrements" ?',
            false,
        ),
        option.bool("55279", "Chaos Mage Robe", 'Mode: [select] only\nShould the bot buy "Chaos Mage Robe" ?', false),
        option.bool("55281", "Chaos Mage Cape", 'Mode: [select] only\nShould the bot buy "Chaos Mage Cape" ?', false),
        option.bool("55282", "Chaos Mage Staff", 'Mode: [select] only\nShould the bot buy "Chaos Mage Staff" ?', false),
        option.bool("55280", "Chaos Mage Helm", 'Mode: [select] only\nShould the bot buy "Chaos Mage Helm" ?', false),
        option.bool("73216", "Iaste Armor", 'Mode: [select] only\nShould the bot buy "Iaste Armor" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ChaosMilitiaMerge.select,
});

export default function main(): void {
    const script = new ChaosMilitiaMerge();
    Core.bankingBlackList.push(
        "Heroic Berserker",
        "Militia Merit",
        "Heroic Berserker Shag",
        "Heroic Berserker Locks",
        "Heroic Berserker Skullcap",
        "Heroic Berserker Blade",
        "Heroic Berserker Hammer",
        "Heroic Berserker Axe",
        "Heroic Berserker Accoutrements",
        "Darkblood Guards",
        "Enchanted Dark Blood",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
