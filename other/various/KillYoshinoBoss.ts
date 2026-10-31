/*
name: KillYoshinoBoss
description: null
tags: null
*/
// Port of Scripts/Other/Various/KillYoshinoBoss.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { BoostType, bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class KillYoshinoBoss {
    yoshino(): void {
        if (!bot.quests.isAvailable(5720)) {
            return;
        }

        Core.equipClass(ClassType.Solo);

        Core.addDrop("Limited Event Coin");
        Core.ensureAccept(5720);
        Core.killMonster("yoshino", "r2", "Right", "*", "Limited Event Monster Proof");
        Core.jumpWait();
        Farm.toggleBoost(BoostType.Gold);
        Core.sleep();
        Core.ensureComplete(5720);
        bot.wait.forPickup("Limited Event Coin");
        Farm.toggleBoost(BoostType.Gold, false);
    }
}

export default function main(): void {
    const script = new KillYoshinoBoss();
    Core.setOptions();

    script.yoshino();
    Core.setOptions(false);
}
