/*
name: Heart of the Sea Story
description: This will finish the Heart of the Sea Story Quest.
tags: story, quest, heart-of-the-sea, pirate
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/HeartOfTheSeaStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class HeartOfTheSeaStory {
    heartOfTheSea(): void {
        if (!Core.isSeasonalMapActive("HeartOfTheSea")) {
            return;
        }
        if (Core.isCompletedBefore(6520)) {
            return;
        }

        Story.preLoad(this.heartOfTheSea);

        // Puff Those Fish 6511
        Story.killQuest(6511, "HeartOfTheSea", "Pufferfish");

        // Question the Merdraconians 6512
        Story.killQuest(6512, "HeartOfTheSea", "Merdraconian");

        // Reveal the Ship 6513
        if (!Story.questProgression(6513)) {
            Core.ensureAccept(6513);
            Core.getMapItem(5999, 5, "HeartOfTheSea");
            Core.huntMonster("heartofthesea", "Jellyfish", "Jellyfish Stingers", 8);
            Core.ensureComplete(6513);
        }

        // Find the Way In 6514
        Story.mapItemQuest(6514, "HeartOfTheSea", 6000);

        // Take Some Treasure 6515
        Story.mapItemQuest(6515, "HeartOfTheSea", 6001, 5);

        // Get Rid of the Grislytooth Pirates 6516
        Story.killQuest(6516, "HeartOfTheSea", "Grislytooth Pirate");

        // Interrogate the Pirates 6517
        if (!Story.questProgression(6517)) {
            Core.ensureAccept(6517);
            Core.huntMonster("heartofthesea", "First Mate Blackfang", "First Mate Interrogated", 1);
            Core.huntMonster("heartofthesea", "Quartermaster Greenfin", "Quartermaster Interrogated", 1);
            Core.huntMonster("heartofthesea", "Boatswain Rotbelly", "Boatswain Interrogated", 1);
            Core.ensureComplete(6517);
        }

        // Find the Hold 6518
        if (!Story.questProgression(6518)) {
            Core.ensureAccept(6518);
            Core.getMapItem(6002, 5, "HeartOfTheSea");
            Core.huntMonster("heartofthesea", "Jellyfish", "BIG Stingers", 5);
            Core.ensureComplete(6518);
        }

        // Get that Treasure!  6519
        Story.mapItemQuest(6519, "HeartOfTheSea", 6003);

        // Take out Scurvyfins McKrill 6520
        Story.killQuest(6520, "HeartOfTheSea", "Scurvyfins McKrill");
    }
}

export default function main(): void {
    const script = new HeartOfTheSeaStory();
    Core.setOptions();

    script.heartOfTheSea();

    Core.setOptions(false);
}
