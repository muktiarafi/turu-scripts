/*
name: CtrlAltDelMemberBadge
description: null
tags: null
*/
// Port of Scripts/Other/Badges/CtrlAltDelMemberBadge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class CtrlAltDelMemberBadge {
    badge(): void {
        if (!Core.isMember || Core.isCompletedBefore(953)) {
            return;
        }

        // Map - GameHavaen:
        Core.equipClass(ClassType.Farm);

        // Agree to help Ethan
        Story.chainQuest(940);

        // Clues for the Clueless
        Story.mapItemQuest(941, "gamehaven", 267, 10);

        // Laundry Day
        Story.killQuest(942, "gamehaven", "Evil Arcade Machine");

        // Strategy Guides are Key
        Story.killQuest(943, "gamehaven", "Evil Console Machine");

        // Investigate the Storage Room
        Story.mapItemQuest(944, "gamehaven", 269);

        // Map - WareHouse:

        // Inventory In Your Inventory
        Story.mapItemQuest(945, "WareHouse", 270, 10);

        // Sneevil Sabotage
        Story.killQuest(946, "WareHouse", "Delivery Sneevil");

        // A Bribe for the Bride
        Story.killQuest(947, "WareHouse", "Snapper Shrub");

        // Hey There Lie-lah
        Story.mapItemQuest(948, "WareHouse", 272);

        // Map - Arcadion:
        Core.equipClass(ClassType.Solo);

        // Fuel for Fought
        Story.mapItemQuest(950, "arcadion", 271, 8);

        // In Ctrl of Controllers
        Story.killQuest(951, "arcadion", "Megadude");

        // To Form a Platform
        Story.killQuest(952, "arcadion", "Blue Hedgehog");

        // The Infamous Plumber
        Story.killQuest(953, "arcadion", "Orc Plumber");
    }
}

export default function main(): void {
    const script = new CtrlAltDelMemberBadge();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
