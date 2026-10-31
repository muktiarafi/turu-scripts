/*
name: Gamehaven Story
description: This will finish the Gamehaven Story.
tags: story, quest, gamehaven
*/
// Port of Scripts/Story/GameHaven.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Gamehaven {
    storyline(): void {
        if (!Core.isMember || Core.isCompletedBefore(953)) {
            return;
        }

        Story.preLoad(this.storyline);

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

        // Inventory In Your Inventory
        Story.mapItemQuest(945, "warehouse", 270, 10);

        // Sneevil Sabotage
        Story.killQuest(946, "warehouse", "Delivery Sneevil");

        // A Bribe for the Bride
        Story.killQuest(947, "warehouse", "Snapper Shrub");

        // Hey There Lie-lah
        Story.mapItemQuest(948, "warehouse", 272);

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
    const script = new Gamehaven();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
