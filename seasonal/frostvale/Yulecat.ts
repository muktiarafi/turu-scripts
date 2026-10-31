/*
name: Yulecat Drops
description: This will repeatedly kill Yulecat until you got all of the drops.
tags: yulecat-drops, seasonal, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/Yulecat.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class Yulecat {
    getDrops(): void {
        if (!Core.isSeasonalMapActive("yulecat")) {
            Core.logger("This seasonal map is not available right now.");
            return;
        }

        const DropsM = [
            "Festive Flying Piggy Guard",
            "Northlands Hunter Blades",
            "Northlands Hunter Winged Helm",
            "Ziri's Holiday Horror Kitty",
        ];

        const Drops = [
            "Festive Wand",
            "Furred Hunter's Cape",
            "Holiday Party Piggy Guard",
            "Kitty Yu-Yule Guard",
            "Kitty's Last Lunch",
            "Northlands BeastHunter",
            "Northlands Hunter Blade",
            "Northlands Hunter Helmet",
        ];

        const MemDrops = [...DropsM, ...Drops];

        if ((Core.checkInventory(MemDrops) && Core.isMember) || (Core.checkInventory(Drops) && !Core.isMember)) {
            Core.logger("You already have all of the items.");
            return;
        }
        Core.equipClass(ClassType.Solo);

        if (Core.isMember) {
            Core.addDrop(...MemDrops);
        } else {
            Core.addDrop(...Drops);
        }

        if (Core.isMember) {
            while (!bot.shouldExit && !Core.checkInventory(MemDrops)) {
                for (const drop of MemDrops) {
                    Core.huntMonster("yulecat", "Kitty Yu Yule", drop, undefined, { isTemp: false });
                }
            }
        } else {
            while (!bot.shouldExit && !Core.checkInventory(Drops)) {
                for (const drop of Drops) {
                    Core.huntMonster("yulecat", "Kitty Yu Yule", drop, undefined, { isTemp: false });
                }
            }
        }
    }
}

export default function main(): void {
    const script = new Yulecat();
    Core.setOptions();

    script.getDrops();

    Core.setOptions(false);
}
