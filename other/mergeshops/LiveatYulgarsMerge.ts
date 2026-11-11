/*
name: Live at Yulgars Merge
description: This bot will farm the items belonging to the selected mode for the Live at Yulgars Merge [377] in /yulgar
tags: live, at, yulgars, merge, yulgar, both, directions, groupie, trollok, fan, shirt, blue, hero, , cordless, mic, vinyl, record, platinum, wreckord, stand, dread, trolluk, azalea, rocks, guy
*/
// Port of Scripts/Other/MergeShops/LiveatYulgarsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class LiveatYulgarsMerge {
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
                //#region Items not setup
                case "Platinum Album Shard":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.ensureAccept(4199);
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("boxes", "Sneevil Boxer", "Broken Album Shard", 3);
                        Core.huntMonster("greenguardwest", "Slime", "Goo Glue", 3);
                        Core.ensureComplete(4199);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("yulgar", 377, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "29595",
            "Both Directions Groupie",
            'Mode: [select] only\nShould the bot buy "Both Directions Groupie" ?',
            false,
        ),
        option.bool(
            "29616",
            "Trollok Fan Shirt",
            'Mode: [select] only\nShould the bot buy "Trollok Fan Shirt" ?',
            false,
        ),
        option.bool("29617", "Blue Hero", 'Mode: [select] only\nShould the bot buy "Blue Hero" ?', false),
        option.bool("29621", "Axe Axe +15", 'Mode: [select] only\nShould the bot buy "Axe Axe +15" ?', false),
        option.bool("29622", "Cordless Mic", 'Mode: [select] only\nShould the bot buy "Cordless Mic" ?', false),
        option.bool("29623", "Vinyl Record", 'Mode: [select] only\nShould the bot buy "Vinyl Record" ?', false),
        option.bool("29624", "Platinum Record", 'Mode: [select] only\nShould the bot buy "Platinum Record" ?', false),
        option.bool("29625", "Wreckord Stand", 'Mode: [select] only\nShould the bot buy "Wreckord Stand" ?', false),
        option.bool("29626", "Dread Trolluk", 'Mode: [select] only\nShould the bot buy "Dread Trolluk" ?', false),
        option.bool("29627", "Blue Hero Mask", 'Mode: [select] only\nShould the bot buy "Blue Hero Mask" ?', false),
        option.bool("29628", "Azalea Rocks", 'Mode: [select] only\nShould the bot buy "Azalea Rocks" ?', false),
        option.bool("29629", "Azalea Guy", 'Mode: [select] only\nShould the bot buy "Azalea Guy" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LiveatYulgarsMerge.select,
});

export default function main(): void {
    const script = new LiveatYulgarsMerge();
    Core.bankingBlackList.push("Platinum Album Shard");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
