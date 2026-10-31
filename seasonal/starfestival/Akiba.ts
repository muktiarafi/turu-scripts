/*
name: Akiba
description: This script will complete the storyline in /akiba.
tags: star, festival, akiba, story, seasonal
*/
// Port of Scripts/Seasonal/StarFestival/Akiba.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Akiba {
    storyline(): void {
        if (Core.isCompletedBefore(6442) || !Core.isSeasonalMapActive("akiba")) {
            return;
        }

        Story.preLoad(this.storyline);

        // Decoration Preparation (6432)
        if (!Story.questProgression(6432)) {
            Core.ensureAccept(6432);
            Core.huntMonsterMapID("junkyard", 1, "Red Paper", 3, { log: false });
            Core.huntMonsterMapID("junkyard", 2, "Yellow Paper", 3, { log: false });
            Core.huntMonsterMapID("junkyard", 3, "Blue Paper", 3, { log: false });
            Core.huntMonsterMapID("junkyard", 4, "White Paper", 3, { log: false });
            Core.huntMonsterMapID("junkyard", 5, "Black Paper", 3, { log: false });
            Core.huntMonsterMapID("junkyard", 6, "Green Paper", 3, { log: false });
            Core.huntMonster("junkyard", "Onibaba", "Dark String", 5, { log: false });
            Core.ensureComplete(6432);
        }

        // Tanabata Tree of Wishes (6433)
        if (!Story.questProgression(6433)) {
            Core.ensureAccept(6433);
            Core.getMapItem(5946, 7, "bamboo");
            Core.huntMonster("bamboo", "Bamboo Wisp", "Wisp Light", 5);
            Core.ensureComplete(6433);
        }

        // Write a Wish Upon a Star (6434)
        Story.killQuest(6434, "yokaigrave", "Ninja Nopperabo");

        // Festival of Stars (6435)
        Story.mapItemQuest(6435, "akiba", 5951, 8);
        Story.mapItemQuest(6435, "akiba", 5952, 5);
        Story.mapItemQuest(6435, "akiba", 5953, 7);
        Story.mapItemQuest(6435, "akiba", 5954, 3);
        Story.mapItemQuest(6435, "akiba", 5955, 2);

        // The First Wish (6436)
        Story.mapItemQuest(6436, "dragonrune", 5947);

        // The Second Wish (6437)
        Story.killQuest(6437, "beleensdream", "Bluddron the Betrayer");

        // The Third Wish (6438)
        if (!Story.questProgression(6438)) {
            Core.ensureAccept(6438);
            Core.killMonster("wanders", "r2", "Left", "Kalestri Worshiper", "The Third Wish");
            Core.ensureComplete(6438);
        }

        // The Fourth Wish (6439)
        Story.killQuest(6439, "cleric", "Chaos Dragon");

        // The Fifth Wish (6440)
        Story.killQuest(6440, "skytower", "Moonstone");

        // The Sixth Wish (6441)
        Story.mapItemQuest(6441, "librarium", 5948);

        // The Seventh Wish (6442)
        Story.killQuest(6442, "lair", "Red Dragon");
    }
}

export default function main(): void {
    const script = new Akiba();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
