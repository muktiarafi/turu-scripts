/*
name: (Class) Vampire Lord
description: This will farm the Blood Moon Token for the Vampire Lord class.
tags: class, mogloween, seasonal, vampire, vampire lord
*/
// Port of Scripts/Seasonal/Mogloween/VampireLord(Class).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class VampireLord {
    getClass(rankUpClass = false): void {
        if (!Core.isSeasonalMapActive("mogloween")) {
            return;
        }
        if (Core.checkInventory(41575, undefined, { toInv: false })) {
            return;
        }

        Core.farmingLogger("Blood Moon Token", 300);
        Core.addDrop("Blood Moon Token");
        Core.equipClass(ClassType.Solo);

        while (!bot.shouldExit && !Core.checkInventory("Blood Moon Token", 300)) {
            Core.ensureAccept(Core.isMember ? 6060 : 6059);

            //farm 33x turn-in quants
            Core.killMonster("bloodmoon", "r12a", "Left", "Black Unicorn", "Black Blood Vial", 99, { isTemp: false });
            Core.killMonster("bloodmoon", "r4a", "Left", "Lycan Guard", "Moon Stone", 33, { isTemp: false });

            //turning x33
            Core.ensureCompleteMulti(Core.isMember ? 6060 : 6059);
            bot.wait.forPickup("Blood Moon Token");
            if (bot.inventory.contains("Blood Moon Token", 300)) {
                break;
            }
        }
        Core.buyItem("mogloween", 1477, "Vampire Lord", undefined, 4496);

        if (rankUpClass) {
            Adv.rankUpClass("Vampire Lord");
        }
    }
}

export default function main(): void {
    const script = new VampireLord();
    Core.bankingBlackList.push("Blood Moon Token");
    Core.setOptions();

    script.getClass(true);

    Core.setOptions(false);
}
