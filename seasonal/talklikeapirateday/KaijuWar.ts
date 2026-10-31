/*
name: Kaiju War
description: This will farm the Kaiju War items.
tags: farm, pirate, kaiju, war
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/KaijuWar.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class KaijuWar {
    allLoot: string[] = [
        "Dark Corsair Eyepatch + Locks",
        "Dark Corsair Bandanna",
        "Dark Corsair Tricorn + Locks",
        "Dark Corsair Hair",
        "Crossed Silver Corsair Cutlasses",
        "Silver Corsair Cutlass",
        "Dark Corsair Hat and Locks",
        "Dark Corsair Eyepatch + Beard",
        "Dark Corsair Tricorn",
        "Dark Corsair Beard",
        "Crossed Dark Corsair Cutlasses",
        "Dark Corsair Cutlass",
        "Dark Corsair",
        "Crossed Golden Corsair Cutlasses",
        "Gold Corsair Cutlass",
        "Dual Golden Corsair Cutlasses",
        "Dual Silver Corsair Cutlasses",
        "Dual Dark Corsair Cutlasses",
        "Dark Corsair Silver Back Gear",
        "Dark Corsair Gold Back Gear",
        "Kaiju Cannoneer",
        "Cannoneer Bandana",
    ];

    booty: string[] = [
        "Dark Corsair Eyepatch + Locks",
        "Dark Corsair Bandanna",
        "Dark Corsair Tricorn + Locks",
        "Dark Corsair Hair",
        "Crossed Silver Corsair Cutlasses",
        "Silver Corsair Cutlass",
        "Dark Corsair Hat and Locks",
        "Dark Corsair Eyepatch + Beard",
        "Dark Corsair Tricorn",
        "Dark Corsair Beard",
        "Crossed Dark Corsair Cutlasses",
        "Dark Corsair Cutlass",
        "Dark Corsair",
        "Crossed Golden Corsair Cutlasses",
        "Gold Corsair Cutlass",
    ];

    mech: string[] = ["Dual Golden Corsair Cutlasses", "Dual Silver Corsair Cutlasses", "Dual Dark Corsair Cutlasses"];
    capn: string[] = ["Dark Corsair Silver Back Gear", "Dark Corsair Gold Back Gear"];
    kaiju: string[] = ["Kaiju Cannoneer", "Cannoneer Bandana"];

    kaijuItems(): void {
        const FirstThree = (): void => {
            Core.addDrop(...this.booty);
            Core.equipClass(ClassType.Farm);
            Core.registerQuests(6006, 6007, 6008);
            while (!bot.shouldExit && !Core.checkInventory(this.booty, undefined, { toInv: false })) {
                Core.killMonster("kaijuwar", "r5", "Left", "*", undefined, undefined, { log: false });
            }
            Core.cancelRegisteredQuests();
            Core.toBank(...this.booty);
        };
        const CallMech = (): void => {
            Core.addDrop(...this.mech);
            Core.equipClass(ClassType.Farm);
            Core.registerQuests(6009);
            while (!bot.shouldExit && !Core.checkInventory(this.mech, undefined, { toInv: false })) {
                Core.huntMonster("kaijuwar", "Ship's Mechanic", "Can o' Diesel", 5);
            }
            Core.cancelRegisteredQuests();
            Core.toBank(...this.mech);
        };
        const Captain = (): void => {
            Core.addDrop(...this.capn);
            Core.equipClass(ClassType.Solo);
            Core.registerQuests(6010);
            while (!bot.shouldExit && !Core.checkInventory(this.capn, undefined, { toInv: false })) {
                Core.huntMonster("kaijuwar", "Captain Kraylox", "Defeat Cap'n Kraylox");
            }
            Core.cancelRegisteredQuests();
            Core.toBank(...this.capn);
        };
        const Kraken = (): void => {
            Core.addDrop(...this.kaiju);
            Core.equipClass(ClassType.Solo);
            Core.registerQuests(6011);
            while (!bot.shouldExit && !Core.checkInventory(this.kaiju, undefined, { toInv: false })) {
                Core.huntMonster("kaijuwar", "Klashex", "Defeat Klashex");
            }
            Core.cancelRegisteredQuests();
            Core.toBank(...this.kaiju);
        };
        if (!Core.isSeasonalMapActive("kaijuwar")) {
            return;
        }

        if (Core.checkInventory(this.allLoot, undefined, { toInv: false })) {
            return;
        }

        if (!Core.checkInventory(this.booty, undefined, { toInv: false })) {
            FirstThree();
        }

        if (!Core.checkInventory(this.mech, undefined, { toInv: false })) {
            CallMech();
        }

        if (!Core.checkInventory(this.capn, undefined, { toInv: false })) {
            Captain();
        }

        if (!Core.checkInventory(this.kaiju, undefined, { toInv: false })) {
            Kraken();
        }
    }
}

export default function main(): void {
    const script = new KaijuWar();
    Core.setOptions();

    script.kaijuItems();

    Core.setOptions(false);
}
