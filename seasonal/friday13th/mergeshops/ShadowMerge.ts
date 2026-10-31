/*
name: Shadow Merge
description: This bot will farm the items belonging to the selected mode for the Shadow Merge [2347] in /shadowbattleon
tags: shadow, merge, shadowbattleon, fabled, doomknight, doom, forbidden, condemned, uprising, doomed, fate, reaper, lance, reborn, spear, enchanted
*/
// Port of Scripts/Seasonal/Friday13th/MergeShops/ShadowMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ShadowMerge {
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
                case "A Whisper":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9421, 9422);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.killMonster("shadowbattleon", "r7", "Left", "*", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shadowbattleon", 2347, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "73057",
            "Fabled Doomknight",
            'Mode: [select] only\nShould the bot buy "Fabled Doomknight" ?',
            false,
        ),
        option.bool(
            "73058",
            "Fabled Doomknight Helm",
            'Mode: [select] only\nShould the bot buy "Fabled Doomknight Helm" ?',
            false,
        ),
        option.bool(
            "73059",
            "Fabled Doom Blade",
            'Mode: [select] only\nShould the bot buy "Fabled Doom Blade" ?',
            false,
        ),
        option.bool(
            "80335",
            "Blade of Forbidden Doom",
            'Mode: [select] only\nShould the bot buy "Blade of Forbidden Doom" ?',
            false,
        ),
        option.bool(
            "80336",
            "Blades of Forbidden Doom",
            'Mode: [select] only\nShould the bot buy "Blades of Forbidden Doom" ?',
            false,
        ),
        option.bool(
            "80337",
            "Condemned Shadow Sword",
            'Mode: [select] only\nShould the bot buy "Condemned Shadow Sword" ?',
            false,
        ),
        option.bool(
            "80338",
            "Condemned Shadow Swords",
            'Mode: [select] only\nShould the bot buy "Condemned Shadow Swords" ?',
            false,
        ),
        option.bool(
            "80339",
            "Staff of Uprising Doom",
            'Mode: [select] only\nShould the bot buy "Staff of Uprising Doom" ?',
            false,
        ),
        option.bool(
            "80340",
            "Doomed Fate Reaper",
            'Mode: [select] only\nShould the bot buy "Doomed Fate Reaper" ?',
            false,
        ),
        option.bool(
            "80341",
            "Lance of Doom Reborn",
            'Mode: [select] only\nShould the bot buy "Lance of Doom Reborn" ?',
            false,
        ),
        option.bool(
            "80342",
            "Spear of Doom Reborn",
            'Mode: [select] only\nShould the bot buy "Spear of Doom Reborn" ?',
            false,
        ),
        option.bool(
            "80343",
            "Enchanted Blade of Forbidden Doom",
            'Mode: [select] only\nShould the bot buy "Enchanted Blade of Forbidden Doom" ?',
            false,
        ),
        option.bool(
            "80344",
            "Enchanted Blades of Forbidden Doom",
            'Mode: [select] only\nShould the bot buy "Enchanted Blades of Forbidden Doom" ?',
            false,
        ),
        option.bool(
            "80345",
            "Enchanted Condemned Shadow Sword",
            'Mode: [select] only\nShould the bot buy "Enchanted Condemned Shadow Sword" ?',
            false,
        ),
        option.bool(
            "80346",
            "Enchanted Condemned Shadow Swords",
            'Mode: [select] only\nShould the bot buy "Enchanted Condemned Shadow Swords" ?',
            false,
        ),
        option.bool(
            "80347",
            "Enchanted Staff of Uprising Doom",
            'Mode: [select] only\nShould the bot buy "Enchanted Staff of Uprising Doom" ?',
            false,
        ),
        option.bool(
            "80348",
            "Enchanted Doomed Fate Reaper",
            'Mode: [select] only\nShould the bot buy "Enchanted Doomed Fate Reaper" ?',
            false,
        ),
        option.bool(
            "80349",
            "Enchanted Lance of Doom Reborn",
            'Mode: [select] only\nShould the bot buy "Enchanted Lance of Doom Reborn" ?',
            false,
        ),
        option.bool(
            "80350",
            "Enchanted Spear of Doom Reborn",
            'Mode: [select] only\nShould the bot buy "Enchanted Spear of Doom Reborn" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShadowMerge.select,
});

export default function main(): void {
    const script = new ShadowMerge();
    Core.bankingBlackList.push("A Whisper");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
