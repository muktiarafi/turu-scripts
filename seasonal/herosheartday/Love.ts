/*
name: Love
description: This will complete the Love story quest.
tags: love, seasonal, heros-heart-day, heart, hero, story
*/
// Port of Scripts/Seasonal/HerosHeartDay/Love.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Love {
    completeStory(): void {
        if (Core.isCompletedBefore(513)) {
            return;
        }

        if (!Core.isSeasonalMapActive("love")) {
            return;
        }

        Story.preLoad(this.completeStory);

        // In The Mood (506)
        Story.killQuest(506, "love", "Mood Slime");

        // Hedge Trimming (507)
        Story.killQuest(507, "love", "Love Shrub");

        // Bear Hugs (508)
        Story.killQuest(508, "love", "Huggy-Bear");

        // Stoopid Kewpid (509)
        Story.killQuest(509, "love", "Kewpid");

        // Paper Heart (510)
        Story.killQuest(510, "citadel", "Inquisitor Guard");

        // Imp Ink (511)
        Core.joinSWF("mobius", "ChiralValley/town-Mobius-21Feb14.swf", "Slugfit", "Bottom");
        Story.killQuest(511, "mobius", "Slugfit");

        // Heart Shaped Scale (512)
        Story.killQuest(512, "lair", "Red Dragon");

        // Special Delivery (513)
        Story.mapItemQuest(513, "love", 98);
    }
}

export default function main(): void {
    const script = new Love();
    Core.setOptions();

    script.completeStory();
    Core.setOptions(false);
}
