/*
name: All accs bank all
description: banks all items on all accs in the "thefamily.txt" file.
tags: bank, army, all
*/
// Port of Scripts/Army/OneClient/AllRankAllClasses.cs.

import { bot } from "turu";
import { CoreArmyLite } from "../CoreArmyLite";
import { Core } from "../../core/CoreBots";
import { RankUpAll } from "../../tools/RankUpAllClasses";

const Army = new CoreArmyLite();
const RUA = new RankUpAll();

export class AllRankAllClasses {
    doTheThing(): void {
        // C# falls back to a random Twilly/Twig after "Twilly", which never happens.
        bot.options.reloginServer = bot.options.reloginServer || "Twilly";

        while (!bot.shouldExit && Army.doForAll()) {
            // TEMPORARY Game4000 inventory change. Remove after the client inventory fix.
            if (Core.inventoryBagFreeSlots <= 0) {
                continue;
            }
            RUA.rankUpAllClasses();
        }
    }
}

export default function main(): void {
    Core.setOptions();

    // DoTheThing();
    bot.log(
        'OneClient scripts area bit fucked, and i just cant fix the "not logging into full server" issue.. so they will be disabled -- please use the normal varients of the scripts.',
    );

    Core.setOptions(false);
}
