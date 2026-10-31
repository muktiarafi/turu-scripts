/*
name: EnchantedFrozenClaymore
description: null
tags: null
*/
// Port of Scripts/Other/Weapons/EnchantedFrozenClaymore.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { DragonFableOrigins } from "../../story/DragonFableOrigins";

const DFO = new DragonFableOrigins();

export class EnchantedFrozenClaymore {
    getSword(): void {
        if (Core.checkInventory("Enchanted Frozen Claymore")) {
            return;
        }

        DFO.dragonFableOriginsAll();
        Core.equipClass(ClassType.Solo);

        Core.addDrop("Ice Shard");

        while (!bot.shouldExit && !Core.checkInventory(43712, 50)) {
            Core.ensureAccept(6311);
            Core.huntMonster("northmountain", "Izotz", "Ice Crystal");
            Core.ensureComplete(6311);
            bot.wait.forPickup("Ice Shard");
        }
        Core.buyItem("northmountain", 1595, "Enchanted Frozen Claymore");
    }
}

export default function main(): void {
    const script = new EnchantedFrozenClaymore();
    Core.setOptions();

    script.getSword();

    Core.setOptions(false);
}
