/*
name: Nukemichi Story (Member)
description: This will finish the Nukemichi Story.
tags: story, quest, nukemichi, member
*/
// Port of Scripts/Story/Nukemichi[mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Nukemichi {
    nukemichiQuests(): void {
        if (!Core.isMember) {
            Core.logger("You must be a Member to access Nukemichi's quests!");
            return;
        }

        if (Core.isCompletedBefore(1592)) {
            return;
        }

        Story.preLoad(this.nukemichiQuests);

        // Trusted Sources 1587
        Story.mapItemQuest(1587, "akiba", 794, 10);

        // Shades Of Gray 1588
        Story.mapItemQuest(1588, "akiba", 795);

        // Hiding In Shadows 1589
        Story.killQuest(1589, "akiba", "Kage Nopperabo");

        // Fading Light 1590
        Story.killQuest(1590, "akiba", "Kage Nopperabo");

        // Candles in the Dark 1591
        Story.mapItemQuest(1591, "akiba", 796, 8);

        // Shadow Battle! 1592
        Story.killQuest(1592, "akiba", "Shadow Nukemichi");
    }
}

export default function main(): void {
    const script = new Nukemichi();
    Core.setOptions();

    script.nukemichiQuests();

    Core.setOptions(false);
}
