/*
name: Tower Story (Member)
description: This will finish the Tower Story.
tags: story, quest, tower, member
*/
// Port of Scripts/Story/Tower[mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Tower {
    storyLine(): void {
        if (!Core.isMember) {
            Core.logger("You must be a Member to complete Tower quests!");
            return;
        }

        if (Core.isCompletedBefore(1610)) {
            return;
        }

        Story.preLoad(this.storyLine);

        // Stone Cold Monster 1603
        Story.killQuest(1603, "trunk", "GreenGuard Basilisk");

        // Interview The Troops 1604
        Story.mapItemQuest(1604, "tower", 836, 4);

        // The Drop Spot 1605
        Story.mapItemQuest(1605, "tower", 837);

        // The Spider's Gem 1606
        Story.killQuest(1606, "greenguardeast", "Spider");

        // Enemies on the Other Side 1607
        Story.killQuest(1607, "tower", "Strange Knight");

        // Get Some Answers 1608
        Story.mapItemQuest(1608, "tower", 838);

        // Recovery of Stolen Goods 1609
        Story.mapItemQuest(1609, "tower", 839, 12);

        // Face the Traitor! 1610
        if (!Story.questProgression(1610)) {
            Core.ensureAccept(1610);
            Core.huntMonsterMapID("tower", 6, "Baxter Defeated!");
            Core.ensureComplete(1610);
        }
    }
}

export default function main(): void {
    const script = new Tower();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
