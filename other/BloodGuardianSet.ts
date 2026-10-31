/*
name: Blood Guardian Set
description: does the 'Blackened Incense' Quest for the blood guardian set.
tags: blood guardian set, blackened incense, set
*/
// Port of Scripts/Other/BloodGuardianSet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { BloodMoon } from "../story/BloodMoon";

const bloodMoon = new BloodMoon();

export class BloodGuardianSet {
    set: string[] = [
        "Ceremonial Assistant Pet",
        "Blood Guardian Armor",
        "Blood Guardian Shag",
        "Blood Guardian's Sword",
    ];

    example(): void {
        if (Core.checkInventory(this.set)) {
            return;
        }

        bloodMoon.bloodMoonSaga();

        //This is required... or so we think.
        Core.killMonster("bloodwarvamp", "r2", "Right", "*", "Mega Lycan Medal", 3);
        Core.chainComplete(6068);
        Core.killMonster("bloodwarvamp", "r2", "Right", "*", "Lycan Medal", 5);
        Core.chainComplete(6069);

        Core.addDrop(...this.set);
        Core.equipClass(ClassType.Solo);
        Core.registerQuests(6072);
        for (const item of this.set) {
            Core.farmingLogger(item, 1);
            while (!bot.shouldExit && !Core.checkInventory(item)) {
                Core.huntMonster("bloodwarvamp", "Lunar Blazebinder", "Blackened Incense", 5);
            }
            bot.wait.forPickup(item);
        }
        Core.cancelRegisteredQuests();
        Core.toBank(...this.set);
    }
}

export default function main(): void {
    const script = new BloodGuardianSet();
    Core.setOptions();

    script.example();
    Core.setOptions(false);
}
