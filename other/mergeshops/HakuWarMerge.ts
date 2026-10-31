/*
name: Haku War Merge
description: This bot will farm the items belonging to the selected mode for the Haku War Merge [2416] in /hakuwar
tags: haku, war, merge, hakuwar, yokai, dragonslayer, noble, beard, cloak, quiver, luminous, mikazuki, kisshoten, naginata, seven, fang, dragonbane, tanto, enchanted
*/
// Port of Scripts/Other/MergeShops/HakuWarMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDOY } from "../../story/dragonsofyokai/CoreDOY";

const Adv = new CoreAdvanced();
const DOY = new CoreDOY();

export class HakuWarMerge {
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
                case "Village's Grace":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9601, 9602);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("hakuwar", "Enter", "Spawn", "*", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        DOY.hakuWar();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("hakuwar", 2416, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "83795",
            "Yokai Dragonslayer",
            'Mode: [select] only\nShould the bot buy "Yokai Dragonslayer" ?',
            false,
        ),
        option.bool(
            "83796",
            "Noble Yokai Dragonslayer Helm",
            'Mode: [select] only\nShould the bot buy "Noble Yokai Dragonslayer Helm" ?',
            false,
        ),
        option.bool(
            "83797",
            "Yokai Dragonslayer Helm",
            'Mode: [select] only\nShould the bot buy "Yokai Dragonslayer Helm" ?',
            false,
        ),
        option.bool(
            "83798",
            "Noble Yokai Dragonslayer Beard",
            'Mode: [select] only\nShould the bot buy "Noble Yokai Dragonslayer Beard" ?',
            false,
        ),
        option.bool(
            "83799",
            "Yokai Dragonslayer Beard",
            'Mode: [select] only\nShould the bot buy "Yokai Dragonslayer Beard" ?',
            false,
        ),
        option.bool(
            "83803",
            "Yokai Dragonslayer War Cloak",
            'Mode: [select] only\nShould the bot buy "Yokai Dragonslayer War Cloak" ?',
            false,
        ),
        option.bool(
            "83805",
            "Yokai Dragonslayer Quiver Cloak",
            'Mode: [select] only\nShould the bot buy "Yokai Dragonslayer Quiver Cloak" ?',
            false,
        ),
        option.bool(
            "83808",
            "Luminous Mikazuki",
            'Mode: [select] only\nShould the bot buy "Luminous Mikazuki" ?',
            false,
        ),
        option.bool(
            "83809",
            "Dual Luminous Mikazuki",
            'Mode: [select] only\nShould the bot buy "Dual Luminous Mikazuki" ?',
            false,
        ),
        option.bool(
            "83812",
            "Kisshoten Naginata",
            'Mode: [select] only\nShould the bot buy "Kisshoten Naginata" ?',
            false,
        ),
        option.bool("83806", "Seven Fang Blade", 'Mode: [select] only\nShould the bot buy "Seven Fang Blade" ?', false),
        option.bool(
            "83807",
            "Seven Fang Blades",
            'Mode: [select] only\nShould the bot buy "Seven Fang Blades" ?',
            false,
        ),
        option.bool("83810", "Dragonbane Tanto", 'Mode: [select] only\nShould the bot buy "Dragonbane Tanto" ?', false),
        option.bool(
            "83811",
            "Dual Dragonbane Tanto",
            'Mode: [select] only\nShould the bot buy "Dual Dragonbane Tanto" ?',
            false,
        ),
        option.bool(
            "83814",
            "Enchanted Yokai Dragonslayer",
            'Mode: [select] only\nShould the bot buy "Enchanted Yokai Dragonslayer" ?',
            false,
        ),
        option.bool(
            "83815",
            "Enchanted Noble Yokai Dragonslayer Helm",
            'Mode: [select] only\nShould the bot buy "Enchanted Noble Yokai Dragonslayer Helm" ?',
            false,
        ),
        option.bool(
            "83816",
            "Enchanted Yokai Dragonslayer Helm",
            'Mode: [select] only\nShould the bot buy "Enchanted Yokai Dragonslayer Helm" ?',
            false,
        ),
        option.bool(
            "83817",
            "Enchanted Noble Yokai Dragonslayer Beard",
            'Mode: [select] only\nShould the bot buy "Enchanted Noble Yokai Dragonslayer Beard" ?',
            false,
        ),
        option.bool(
            "83818",
            "Enchanted Yokai Dragonslayer Beard",
            'Mode: [select] only\nShould the bot buy "Enchanted Yokai Dragonslayer Beard" ?',
            false,
        ),
        option.bool(
            "83821",
            "Enchanted Yokai Dragonslayer War Cloak",
            'Mode: [select] only\nShould the bot buy "Enchanted Yokai Dragonslayer War Cloak" ?',
            false,
        ),
        option.bool(
            "83823",
            "Enchanted Yokai Dragonslayer Quiver Cloak",
            'Mode: [select] only\nShould the bot buy "Enchanted Yokai Dragonslayer Quiver Cloak" ?',
            false,
        ),
        option.bool(
            "83824",
            "Enchanted Seven Fang Blade",
            'Mode: [select] only\nShould the bot buy "Enchanted Seven Fang Blade" ?',
            false,
        ),
        option.bool(
            "83825",
            "Enchanted Seven Fang Blades",
            'Mode: [select] only\nShould the bot buy "Enchanted Seven Fang Blades" ?',
            false,
        ),
        option.bool(
            "83826",
            "Enchanted Luminous Mikazuki",
            'Mode: [select] only\nShould the bot buy "Enchanted Luminous Mikazuki" ?',
            false,
        ),
        option.bool(
            "83827",
            "Dual Enchanted Luminous Mikazuki",
            'Mode: [select] only\nShould the bot buy "Dual Enchanted Luminous Mikazuki" ?',
            false,
        ),
        option.bool(
            "83828",
            "Enchanted Dragonbane Tanto",
            'Mode: [select] only\nShould the bot buy "Enchanted Dragonbane Tanto" ?',
            false,
        ),
        option.bool(
            "83829",
            "Dual Enchanted Dragonbane Tanto",
            'Mode: [select] only\nShould the bot buy "Dual Enchanted Dragonbane Tanto" ?',
            false,
        ),
        option.bool(
            "83830",
            "Enchanted Kisshoten Naginata",
            'Mode: [select] only\nShould the bot buy "Enchanted Kisshoten Naginata" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HakuWarMerge.select,
});

export default function main(): void {
    const script = new HakuWarMerge();
    Core.bankingBlackList.push("Village's Grace");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
