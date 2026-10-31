/*
name: Dwarfhold Merge
description: This bot will farm the items belonging to the selected mode for the Dwarfhold Merge [2286] in /dwarfhold
tags: dwarfhold, merge, dwarfhold, armored, prospector, prospectors, braided, beard, spectacles, spectacled, practical, rucksack, geometric, silver, gilded, goggles, versatile, honored
*/
// Port of Scripts/Other/MergeShops/DwarfholdMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Core13LoC } from "../../story/lordsofchaos/Core13LoC";

const Adv = new CoreAdvanced();
const LoC = new Core13LoC();

export class DwarfholdMerge {
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
                case "Dwarven Metal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9237);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dwarfhold", "Chaos Drow", "Broken Drow Blade", 5, { log: false });
                        Core.huntMonster("dwarfhold", "Chaotic Draconian", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Dwarven Alloy":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9238);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("mooncursedlair", "Shard of Moonlight", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        LoC.vath();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("dwarfhold", 2286, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "77578",
            "Armored Dwarfhold Prospector",
            'Mode: [select] only\nShould the bot buy "Armored Dwarfhold Prospector" ?',
            false,
        ),
        option.bool(
            "77579",
            "Dwarfhold Prospector's Braided Beard",
            'Mode: [select] only\nShould the bot buy "Dwarfhold Prospector\'s Braided Beard" ?',
            false,
        ),
        option.bool(
            "77580",
            "Dwarfhold Prospector's Spectacles",
            'Mode: [select] only\nShould the bot buy "Dwarfhold Prospector\'s Spectacles" ?',
            false,
        ),
        option.bool(
            "77581",
            "Dwarfhold Prospector's Spectacled Locks",
            'Mode: [select] only\nShould the bot buy "Dwarfhold Prospector\'s Spectacled Locks" ?',
            false,
        ),
        option.bool(
            "77582",
            "Practical Dwarfhold Rucksack",
            'Mode: [select] only\nShould the bot buy "Practical Dwarfhold Rucksack" ?',
            false,
        ),
        option.bool(
            "77583",
            "Dwarfhold Geometric Silver Axe",
            'Mode: [select] only\nShould the bot buy "Dwarfhold Geometric Silver Axe" ?',
            false,
        ),
        option.bool(
            "77948",
            "Dwarfhold Geometric Silver Axes",
            'Mode: [select] only\nShould the bot buy "Dwarfhold Geometric Silver Axes" ?',
            false,
        ),
        option.bool(
            "77572",
            "Gilded Dwarfhold Prospector",
            'Mode: [select] only\nShould the bot buy "Gilded Dwarfhold Prospector" ?',
            false,
        ),
        option.bool(
            "77573",
            "Gilded Prospector's Braided Beard",
            'Mode: [select] only\nShould the bot buy "Gilded Prospector\'s Braided Beard" ?',
            false,
        ),
        option.bool(
            "77574",
            "Gilded Prospector's Goggles",
            'Mode: [select] only\nShould the bot buy "Gilded Prospector\'s Goggles" ?',
            false,
        ),
        option.bool(
            "77575",
            "Gilded Prospector's Goggles and Locks",
            'Mode: [select] only\nShould the bot buy "Gilded Prospector\'s Goggles and Locks" ?',
            false,
        ),
        option.bool(
            "77576",
            "Versatile Dwarfhold Rucksack",
            'Mode: [select] only\nShould the bot buy "Versatile Dwarfhold Rucksack" ?',
            false,
        ),
        option.bool(
            "77577",
            "Honored Gilded Axe",
            'Mode: [select] only\nShould the bot buy "Honored Gilded Axe" ?',
            false,
        ),
        option.bool(
            "77949",
            "Honored Gilded Axes",
            'Mode: [select] only\nShould the bot buy "Honored Gilded Axes" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DwarfholdMerge.select,
});

export default function main(): void {
    const script = new DwarfholdMerge();
    Core.bankingBlackList.push("Dwarven Metal", "Dwarven Alloy");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
