/*
name: Deleuze Tundra Merge
description: This bot will farm the items belonging to the selected mode for the Deleuze Tundra Merge [2520] in /deleuzetundra
tags: deleuze, tundra, merge, deleuzetundra, fiendish, bloodhunter, bow, oblivions, final, call, abyss, boiling, blood, awakened, fiend, naginata, bloodhunt, nul, contract
*/
// Port of Scripts/Nation/MergeShops/DeleuzeTundraMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { DeleuzeTundraStory } from "../../story/nation/DeleuzeTundra";

const Adv = new CoreAdvanced();
const DT = new DeleuzeTundraStory();

export class DeleuzeTundraMerge {
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
                case "Geode of Oblivion":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(10033);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.killMonster("deleuzetundra", "r4", "Left", "Oblivion Magus", "Honeycomb Flesh", 8);
                        Core.killMonster("deleuzetundra", "Enter", "Spawn", "Empty Creature", "Empty Carcass", 8);
                        Core.equipClass(ClassType.Solo);
                        Core.killMonster("deleuzetundra", "r5", "Left", "Oblivion's Herald", "Obsidian Bone Shard");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Outrider's Broken Blade":
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("deleuzetundra", "r2", "Left", "Nation Outrider", req.name, req.quantity, {
                        isTemp: req.temp,
                    });
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        DT.deleuzeTundra();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("deleuzetundra", 2520, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "83950",
            "Fiendish Bloodhunter Bow",
            'Mode: [select] only\nShould the bot buy "Fiendish Bloodhunter Bow" ?',
            false,
        ),
        option.bool(
            "83948",
            "Oblivion's Final Call",
            'Mode: [select] only\nShould the bot buy "Oblivion\'s Final Call" ?',
            false,
        ),
        option.bool(
            "83947",
            "Oblivion's Abyss Staff",
            'Mode: [select] only\nShould the bot buy "Oblivion\'s Abyss Staff" ?',
            false,
        ),
        option.bool(
            "79254",
            "Boiling Blood Staff",
            'Mode: [select] only\nShould the bot buy "Boiling Blood Staff" ?',
            false,
        ),
        option.bool(
            "75319",
            "Awakened Fiend Naginata",
            'Mode: [select] only\nShould the bot buy "Awakened Fiend Naginata" ?',
            false,
        ),
        option.bool(
            "83939",
            "Fiendish Bloodhunt Dagger",
            'Mode: [select] only\nShould the bot buy "Fiendish Bloodhunt Dagger" ?',
            false,
        ),
        option.bool(
            "83940",
            "Fiendish Bloodhunt Daggers",
            'Mode: [select] only\nShould the bot buy "Fiendish Bloodhunt Daggers" ?',
            false,
        ),
        option.bool(
            "91088",
            "Nul Contract Dagger",
            'Mode: [select] only\nShould the bot buy "Nul Contract Dagger" ?',
            false,
        ),
        option.bool(
            "91089",
            "Nul Contract Daggers",
            'Mode: [select] only\nShould the bot buy "Nul Contract Daggers" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DeleuzeTundraMerge.select,
});

export default function main(): void {
    const script = new DeleuzeTundraMerge();
    Core.bankingBlackList.push("Geode of Oblivion", "Outrider's Broken Blade");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
