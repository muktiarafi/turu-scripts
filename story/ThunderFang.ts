/*
name: Thunderfang Story
description: does the quest from dragonmaster stormscythe in /thunderfang
tags: story, thunderfang, stormcachemerge
*/
// Port of Scripts/Story/ThunderFang.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class ThunderFang {
    storyLine(): void {
        if (Core.isCompletedBefore(4246)) {
            return;
        }

        Story.preLoad(this.storyLine);

        // Hailstone Ore 4240
        Story.killQuest(4240, "thunderfang", "Storm Draconian");

        // Scroll of Fury 4241
        Story.killQuest(4241, "thunderfang", "Lightning Ball");

        // Shards and Sparks 4242
        if (!Story.questProgression(4242)) {
            Core.ensureAccept(4242);
            Core.huntMonster("thunderfang", "Energy Elemental", "Energy Gem", 3);
            Core.huntMonster("thunderfang", "Lightning Ball", "Lightning Spark", 5);
            Core.ensureComplete(4242);
        }

        // Hunt for the Storm Cache 4243
        Story.killQuest(4243, "thunderfang", "Energy Elemental");

        // Lord of Thunderfang Spire 4244
        if (Core.isMember) {
            Story.killQuest(4244, "thunderfang", "Tonitru");
        }

        // Storm Strike Shards 4245
        Story.killQuest(4245, "thunderfang", "Lightning Ball");

        // Claim the Tempestas Egg 4246
        Story.killQuest(4246, "thunderfang", "Storm Draconian");
    }
}

export default function main(): void {
    const script = new ThunderFang();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
