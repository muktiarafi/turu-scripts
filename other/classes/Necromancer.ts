/*
name: Necromancer
description: null
tags: null
*/
// Port of Scripts/Other/Classes/Necromancer.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class Necromancer {
    getNecromancer(rankUpClass = true): void {
        if (Core.checkInventory("Necromancer")) {
            if (rankUpClass) {
                Adv.rankUpClass("Necromancer");
            }

            return;
        }

        Farm.doomWoodREP();
        Core.buyItem("lightguard", 277, "NUE Necronomicon");
        Core.equipClass(ClassType.Solo);
        Core.killMonster("maul", "r3", "Down", "Creature Creation", "Creature Shard", undefined, {
            isTemp: false,
            publicRoom: true,
        });
        Core.buyItem("necrotower", 285, "Necromancer");

        if (rankUpClass) {
            Adv.rankUpClass("Necromancer");
        }
    }
}

export default function main(): void {
    const script = new Necromancer();
    Core.setOptions();

    script.getNecromancer();

    Core.setOptions(false);
}
