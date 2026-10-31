/*
name: Shadowflame War Medal
description: farms "Item" from uest: "shadow medals, mega shadow medals".
tags: shadowflame war medal, shadow medal, mega shadow medal
*/
// Port of Scripts/Other/ShadowflameWarMedal.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { CoreSoC } from "../story/shadowsofchaos/CoreSoC";
import { CoreSoW } from "../story/shadowsofwar/CoreSoW";

const SoW = new CoreSoW();
const SoC = new CoreSoC();

export class ShadowflameWarMedal {
    medals(quant = 300): void {
        if (Core.checkInventory("ShadowFlame War Medal", quant)) {
            return;
        }

        SoW.shadowWar();
        SoC.dualPlane();
        Core.farmingLogger("ShadowFlame War Medal", quant);
        Core.equipClass(ClassType.Farm);
        Core.registerQuests(7685, 7686);
        while (!bot.shouldExit && !Core.checkInventory("ShadowFlame War Medal", quant)) {
            Core.huntMonster("chaosamulet", "Shadowflame Warrior", "Shadow Medal", 5, { log: false });
            Core.huntMonster("chaosamulet", "Shadowflame Warrior", "Mega Shadow Medal", 3, { log: false });
            bot.wait.forPickup("ShadowFlame War Medal");
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new ShadowflameWarMedal();
    Core.setOptions();

    script.medals();

    Core.setOptions(false);
}
