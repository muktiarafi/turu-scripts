/*
name: River Story
description: This will finish the River Story.
tags: story, quest, river
*/
// Port of Scripts/Story/River.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class River {
    storyLine(): void {
        if (Core.isCompletedBefore(74)) {
            return;
        }

        Story.preLoad(this.storyLine);

        // Bait and Switch 63
        Story.killQuest(63, "river", "River Fishman");

        // Restocking 64
        Story.killQuest(64, "river", "Zardman Fisher");

        // Spear Sabotage 65
        Story.killQuest(65, "river", "Zardman Fisher");

        // Retaliation 66
        Story.killQuest(66, "river", "Kuro");

        if (!Core.isMember) {
            Core.logger("You must be a Member to complete Fishing Bait and Flood of Power quests.");
            return;
        }

        // Fishing Bait 72
        Story.killQuest(72, "river", "Kuro");

        // Flood of Power 74
        Story.killQuest(74, "shallow", "Water Elemental");
    }
}

export default function main(): void {
    const script = new River();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
