/*
name: WorthyOfTheBlade
description: null
tags: null
*/
// Port of Scripts/Legion/Various/WorthyOfTheBlade.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNation } from "../../nation/CoreNation";

const Farm = new CoreFarms();
const Nation = new CoreNation();

export class WorthyBlade {
    worthyOfTheBlade(): void {
        if (Core.checkInventory("SoulKeeper Blade")) {
            return;
        }

        Core.addDrop("SoulKeeper Blade", "SoulKeeper On your Back", "SoulKeeper Sword Pet");
        Core.ensureAccept(6738);
        Nation.essenceofNulgath(100);
        Core.addDrop("Undead Essence", "Undead Energy");
        Farm.battleUnderB("Undead Essence", 500);
        Farm.battleUnderB("Undead Energy", 500);
        while (!bot.shouldExit && !Core.checkInventory("Essence of Blade Master")) {
            Core.equipClass(ClassType.Farm);
            Core.addDrop("Essence of Blade Master");
            Core.huntMonster("underworld", "Blade Master", "Essence of Blade Master", 1, { isTemp: false });
        }
        while (!bot.shouldExit && !Core.checkInventory("Binky's Uni-horn")) {
            Core.equipClass(ClassType.Solo);
            Core.killMonster("doomvault", "r5", "Left", "Binky", "Binky's Uni-horn", undefined, {
                isTemp: false,
                publicRoom: true,
            });
        }
        Core.sleep(1500);
        Core.ensureComplete(6738);
    }
}

export default function main(): void {
    const script = new WorthyBlade();
    Core.setOptions();

    script.worthyOfTheBlade();

    Core.setOptions(false);
}
