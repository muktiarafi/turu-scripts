/*
name: Corrupted Gem Blade
description: does 'Drudgen the Salesman' for "Corrupted Gem Blade"
tags: corrupted gem blade, nation, drudgen the assistant, drudgen the salesman
*/
// Port of Scripts/Other/Weapons/CorruptedGemBlade.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreNation } from "../../nation/CoreNation";

const Nation = new CoreNation();

export class CorruptedGemBlade {
    drudgentheSalesman(): void {
        if (Core.checkInventory("Corrupted Gem Blade") || !Core.checkInventory("Drudgen the Assistant")) {
            return;
        }

        Core.addDrop(...Nation.bagDrops);
        Core.addDrop("Corrupted Gem Blade");

        Core.registerQuests(605, 2857);
        while (!bot.shouldExit && !Core.checkInventory("Corrupted Gem Blade")) {
            Nation.supplies("Voucher of Nulgath (non-mem)");
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("cloister", "Acornent", "Diamonds of Time", undefined, { isTemp: false, log: false });
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("evilmarsh", "Tainted Elemental", "Tainted Rune of Evil", undefined, { log: false });
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new CorruptedGemBlade();
    Core.setOptions();

    script.drudgentheSalesman();

    Core.setOptions(false);
}
