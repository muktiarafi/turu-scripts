/*
name: Free as a Bird Merge
description: This bot will farm the items belonging to the selected mode for the Free as a Bird Merge [2361] in /birdswithharms
tags: free, as, a, bird, merge, birdswithharms, gryphonclaw, knights, scythe, wings, guard, crested, knight, warriors, warrior
*/
// Port of Scripts/Seasonal/HarvestDay/MergeShops/FreeasaBirdMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class FreeasaBirdMerge {
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
                case "Stymphalian's Bronze Feather":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    // Muck and Feather 9462
                    Core.registerQuests(9462);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterMapID("birdswithharms", 33, "Bronze Feather");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("birdswithharms", 2361, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "73547",
            "GryphonClaw Knight's Scythe",
            'Mode: [select] only\nShould the bot buy "GryphonClaw Knight\'s Scythe" ?',
            false,
        ),
        option.bool(
            "73546",
            "GryphonClaw Knight's Blades",
            'Mode: [select] only\nShould the bot buy "GryphonClaw Knight\'s Blades" ?',
            false,
        ),
        option.bool(
            "73545",
            "GryphonClaw Knight's Blade",
            'Mode: [select] only\nShould the bot buy "GryphonClaw Knight\'s Blade" ?',
            false,
        ),
        option.bool(
            "73543",
            "GryphonClaw Knight's Wings",
            'Mode: [select] only\nShould the bot buy "GryphonClaw Knight\'s Wings" ?',
            false,
        ),
        option.bool(
            "73541",
            "GryphonClaw Knight's Guard Helm",
            'Mode: [select] only\nShould the bot buy "GryphonClaw Knight\'s Guard Helm" ?',
            false,
        ),
        option.bool(
            "73540",
            "GryphonClaw Knight's Crested Helm",
            'Mode: [select] only\nShould the bot buy "GryphonClaw Knight\'s Crested Helm" ?',
            false,
        ),
        option.bool(
            "73539",
            "GryphonClaw Knight",
            'Mode: [select] only\nShould the bot buy "GryphonClaw Knight" ?',
            false,
        ),
        option.bool(
            "73538",
            "GryphonClaw Warrior's Blades",
            'Mode: [select] only\nShould the bot buy "GryphonClaw Warrior\'s Blades" ?',
            false,
        ),
        option.bool(
            "73537",
            "GryphonClaw Warrior's Blade",
            'Mode: [select] only\nShould the bot buy "GryphonClaw Warrior\'s Blade" ?',
            false,
        ),
        option.bool(
            "73536",
            "GryphonClaw Warrior's Wings",
            'Mode: [select] only\nShould the bot buy "GryphonClaw Warrior\'s Wings" ?',
            false,
        ),
        option.bool(
            "73535",
            "GryphonClaw Guard Helm",
            'Mode: [select] only\nShould the bot buy "GryphonClaw Guard Helm" ?',
            false,
        ),
        option.bool(
            "73534",
            "GryphonClaw Warrior's Crested Helm",
            'Mode: [select] only\nShould the bot buy "GryphonClaw Warrior\'s Crested Helm" ?',
            false,
        ),
        option.bool(
            "73533",
            "GryphonClaw Warrior",
            'Mode: [select] only\nShould the bot buy "GryphonClaw Warrior" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FreeasaBirdMerge.select,
});

export default function main(): void {
    const script = new FreeasaBirdMerge();
    Core.bankingBlackList.push("Stymphalian's Bronze Feather");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
