/*
name: AureateAegisSet
description: Does the `The Empty Mountains Cold` quest for the rewards
tags: the empty mountains cold, gole den, aureate aegis set
*/
// Port of Scripts/Other/Armor/AureateAegisSet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { Core13LoC } from "../../story/lordsofchaos/Core13LoC";

const Adv = new CoreAdvanced();
const LOC = new Core13LoC();

export class AureateAegisSet {
    getSet(): void {
        if (Core.checkInventory(Core.questRewards(9241))) {
            return;
        }

        Core.addDrop(...Core.questRewards(9241));
        LOC.vath();

        while (!bot.shouldExit && !Core.checkInventory(Core.questRewards(9241))) {
            Core.ensureAccept(9241);
            Core.huntMonster("darkheart", "Toxic Grove Spider", "Cavern Gold", 1000, { isTemp: false });
            Core.huntMonster(`templedelve`, "Doomed Troll", "Troll's Gold", 1000, { isTemp: false });
            Core.huntMonster(`greed`, "Sneevil Looter", "Looter's Gold", 1000, { isTemp: false });
            Core.huntMonster(`greed`, "Goregold", "Goregold's Gold", 250, { isTemp: false });
            Adv.buyItem("alchemyacademy", 2115, "Gold Voucher 500k", 60);

            Core.ensureComplete(9241);
        }
    }
}

export default function main(): void {
    const script = new AureateAegisSet();
    Core.setOptions();

    script.getSet();

    Core.setOptions(false);
}
