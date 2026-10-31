/*
name: Elders Blood (Army)
description: One-client version of the Elders' Blood daily
tags: daily, dailies, army, elders, blood, vhl, void highlord, oneclient
*/
// Port of Scripts/Army/OneClient/EldersBlood.cs.

import { bot } from "turu";
import { CoreArmyLite } from "../CoreArmyLite";
import { Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";

const Army = new CoreArmyLite();
const Dailies = new CoreDailies();

export class ArmyEldersBlood {
    eldersBlood(): void {
        // C# falls back to a random Twilly/Twig after "Twilly", which never happens.
        bot.options.reloginServer = bot.options.reloginServer || "Twilly";

        while (!bot.shouldExit && Army.doForAll()) {
            // TEMPORARY Game4000 inventory change. Remove after the client inventory fix.
            if (Core.inventoryBagFreeSlots <= 0) {
                continue;
            }
            Dailies.eldersBlood();
        }
    }
}

export default function main(): void {
    Core.setOptions();

    // EldersBlood();
    bot.log(
        'OneClient scripts area bit fucked, and i just cant fix the "not logging into full server" issue.. so they will be disabled -- please use the normal varients of the scripts.',
    );

    Core.setOptions(false);
}
