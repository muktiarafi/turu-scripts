/*
name: ChaorrupterUnlocked
description: null
tags: null
*/
// Port of Scripts/Other/Weapons/ChaorrupterUnlocked.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced, EnhancementType } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ChaorrupterUnlocked {
    //public ChaosWarMerge CWM = new();

    getYourSword(): void {
        if (Core.checkInventory("Chaorrupter Unlocked")) {
            return;
        }

        Core.addDrop("Chaos Eye", "Chaos Tentacle");

        // CWM.BuyAllMerge("Chaorrupter Unlocked", mergeOptionsEnum.select); //Other method until it's fixed
        Core.equipClass(ClassType.Farm);
        if (Core.isMember) {
            Core.logger("Farming Chaorrupter Unlocked (Legend)");
            Core.killMonster("chaoswar", "r2", "Spawn", "*", "Chaos Eye", 100, { isTemp: false, log: false });
            Core.killMonster("chaoswar", "r13", "Left", "*", "Chaos Tentacle", 100, { isTemp: false, log: false });
            Core.buyItem("chaoswar", 642, 17873, 1, 10987);
        } else {
            Core.logger("Farming Chaorrupter Unlocked (Free Player)");
            Core.killMonster("chaoswar", "r2", "Spawn", "*", "Chaos Eye", 250, { isTemp: false, log: false });
            Core.killMonster("chaoswar", "r13", "Left", "*", "Chaos Tentacle", 250, { isTemp: false, log: false });
            Core.buyItem("chaoswar", 642, 17932, 1, 10986);
        }
        Adv.enhanceItem("Chaorrupter Unlocked", EnhancementType.Lucky);
    }
}

export default function main(): void {
    const script = new ChaorrupterUnlocked();
    Core.setOptions();

    script.getYourSword();

    Core.setOptions(false);
}
