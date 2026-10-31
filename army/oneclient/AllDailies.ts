/*
name: Army All Dailies
description: One-client version of All Dailies
tags: all, dailies, army
*/
// Port of Scripts/Army/OneClient/AllDailies.cs.

import { bot, choices, defineScriptOptions, option } from "turu";
import { CoreArmyLite } from "../CoreArmyLite";
import { Core } from "../../core/CoreBots";
import { DailySet, FarmAllDailies } from "../../dailies/0AllDailies";

const FAD = new FarmAllDailies();
const Army = new CoreArmyLite();

export class ArmyAllDailies {
    checkACs(): void {
        // C# falls back to a random Twilly/Twig after "Twilly", which never happens.
        bot.options.reloginServer = bot.options.reloginServer || "Twilly";

        while (!bot.shouldExit && Army.doForAll()) {
            // TEMPORARY Game4000 inventory change. Remove after the client inventory fix.
            if (Core.inventoryBagFreeSlots <= 0) {
                continue;
            }
            FAD.doAllDailies(bot.config!.get<DailySet>("Select Dailies Set"));
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "ArmyAllDailies",
    [
        option.choice(
            "Select Dailies Set",
            "Dailies set: Recommended or All?",
            "only do the few that we recommend to make it a bit quicker?",
            choices(DailySet),
            DailySet.All,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    Core.setOptions();

    // CheckACs();
    bot.log(
        'OneClient scripts area bit fucked, and i just cant fix the "not logging into full server" issue.. so they will be disabled -- please use the normal varients of the scripts.',
    );

    Core.setOptions(false);
}
