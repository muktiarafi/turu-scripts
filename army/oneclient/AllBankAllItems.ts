/*
name: All accs bank all
description: banks all items on all accs in the "thefamily.txt" file.
tags: bank, army, all
*/
// Port of Scripts/Army/OneClient/AllBankAllItems.cs.

import { bot } from "turu";
import { CoreArmyLite } from "../CoreArmyLite";
import { Core } from "../../core/CoreBots";
import { BankAllItems } from "../../tools/BankAllItems";

const BAI = new BankAllItems();
const Army = new CoreArmyLite();

export class ArmyBankAllItems {
    allBankAll(): void {
        // C# falls back to a random Twilly/Twig after "Twilly", which never happens.
        bot.options.reloginServer = bot.options.reloginServer || "Twilly";

        while (!bot.shouldExit && Army.doForAll()) {
            BAI.bankAll(true, true, false, "");
            Core.logger('All "Allowed" items banked, onto the next Acc');

            // if either are enabled set them to empty, so the next acc doesnt try to
            if (Core.farmGearOn && Core.farmGear.length > 0) {
                Core.farmGear = [];
            }
            if (Core.soloGearOn && Core.soloGear.length > 0) {
                Core.soloGear = [];
            }
        }
    }
}

export default function main(): void {
    Core.setOptions();

    // AllBankAll();
    bot.log(
        'OneClient scripts area bit fucked, and i just cant fix the "not logging into full server" issue.. so they will be disabled -- please use the normal varients of the scripts.',
    );

    Core.setOptions(false);
}
