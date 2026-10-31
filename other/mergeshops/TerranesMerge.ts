/*
name: TerranesMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/TerranesMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreQOM } from "../../story/queenofmonsters/CoreQoM";

const Adv = new CoreAdvanced();
const QOM = new CoreQOM();

export class TerranesMerge {
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
                case "Feather of Purity":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(6287);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("guardiantree", "Blossoming Treeant", "Treeant Blossom Nectar", 3);
                        Core.huntMonster("guardiantree", "Myconid", "Myconid Spore", 3);
                        Core.huntMonster("guardiantree", "Corrupted Zard", "Corrupted Zard", 3);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Bow of Semiramis":

                case "Blade of Semiramis":

                case "Daggers of Semiramis":

                case "Staff of Semiramis":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("guardiantree", "Terrane", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        QOM.theReshaper(true);
        Adv.startBuyAllMerge("guardiantree", 1584, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("43470", "Feral Hedgehog", 'Mode: [select] only\nShould the bot buy "Feral Hedgehog" ?', false),
        option.bool("43498", "Dark Druid", 'Mode: [select] only\nShould the bot buy "Dark Druid" ?', false),
        option.bool("43499", "Dark Fur Wrap", 'Mode: [select] only\nShould the bot buy "Dark Fur Wrap" ?', false),
        option.bool(
            "43500",
            "Dark Druid's Staff",
            'Mode: [select] only\nShould the bot buy "Dark Druid\'s Staff" ?',
            false,
        ),
        option.bool(
            "43501",
            "Dark Druid's Blade",
            'Mode: [select] only\nShould the bot buy "Dark Druid\'s Blade" ?',
            false,
        ),
        option.bool(
            "43502",
            "Dark Druid's Locks",
            'Mode: [select] only\nShould the bot buy "Dark Druid\'s Locks" ?',
            false,
        ),
        option.bool(
            "43503",
            "Dark Druid's Horned Locks",
            'Mode: [select] only\nShould the bot buy "Dark Druid\'s Horned Locks" ?',
            false,
        ),
        option.bool(
            "43504",
            "Dark Druid's Hood",
            'Mode: [select] only\nShould the bot buy "Dark Druid\'s Hood" ?',
            false,
        ),
        option.bool(
            "43505",
            "Dark Hood + Horns",
            'Mode: [select] only\nShould the bot buy "Dark Hood + Horns" ?',
            false,
        ),
        option.bool(
            "43472",
            "Purified BeastMaster",
            'Mode: [select] only\nShould the bot buy "Purified BeastMaster" ?',
            false,
        ),
        option.bool(
            "43473",
            "Purified BeastMaster Horns",
            'Mode: [select] only\nShould the bot buy "Purified BeastMaster Horns" ?',
            false,
        ),
        option.bool(
            "43474",
            "Purified BeastMaster Locks",
            'Mode: [select] only\nShould the bot buy "Purified BeastMaster Locks" ?',
            false,
        ),
        option.bool(
            "43490",
            "Wings of Semiramis",
            'Mode: [select] only\nShould the bot buy "Wings of Semiramis" ?',
            false,
        ),
        option.bool("43489", "Semiramis Cape", 'Mode: [select] only\nShould the bot buy "Semiramis Cape" ?', false),
        option.bool(
            "43484",
            "Enchanted BeastMaster Blade",
            'Mode: [select] only\nShould the bot buy "Enchanted BeastMaster Blade" ?',
            false,
        ),
        option.bool(
            "43476",
            "Enchanted BeastMaster Bow",
            'Mode: [select] only\nShould the bot buy "Enchanted BeastMaster Bow" ?',
            false,
        ),
        option.bool(
            "43479",
            "Enchanted BeastMaster Daggers",
            'Mode: [select] only\nShould the bot buy "Enchanted BeastMaster Daggers" ?',
            false,
        ),
        option.bool(
            "43481",
            "Enchanted BeastMaster Staff",
            'Mode: [select] only\nShould the bot buy "Enchanted BeastMaster Staff" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TerranesMerge.select,
});

export default function main(): void {
    const script = new TerranesMerge();
    Core.bankingBlackList.push(
        "Feather of Purity",
        "Blade of Semiramis",
        "Bow of Semiramis",
        "Daggers of Semiramis",
        "Staff of Semiramis ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
