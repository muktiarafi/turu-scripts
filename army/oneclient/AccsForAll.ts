/*
name: Army Free 500 accs
description: the 500 free acs quest
tags: acs, free, thefamily, army.
*/
// Port of Scripts/Army/OneClient/AccsForAll.cs.

import { bot } from "turu";
import { CoreArmyLite } from "../CoreArmyLite";
import { Core } from "../../core/CoreBots";
import { FreeAcs } from "../../other/freeacgifts[yearly]/202xFreeAcs";

const Army = new CoreArmyLite();
const ACs = new FreeAcs();

export class ArmyFreeAcs {
    doit(): void {
        Core.oneTimeMessage("Only for army", "This is intended for use with an army, not for solo players.");
        // C# falls back to a random Twilly/Twig after "Twilly", which never happens.
        bot.options.reloginServer = bot.options.reloginServer || "Twilly";

        while (!bot.shouldExit && Army.doForAll()) {
            ACs.getYourAcsHere();
        }
    }
}

export default function main(): void {
    Core.setOptions();

    // Doit();

    bot.log(
        'OneClient scripts area bit fucked, and i just cant fix the "not logging into full server" issue.. so they will be disabled -- please use the normal varients of the scripts.',
    );

    Core.setOptions(false);
}
