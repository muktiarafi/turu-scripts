/*
name: Magic Thief Story
description: This will finish the Magic Thief Story.
tags: story, quest, magic-thief
*/
// Port of Scripts/Story/MagicThief.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class MagicThief {
    storyline(): void {
        if (Core.isCompletedBefore(1916)) {
            return;
        }

        // 1908|Sounds Like Cysero
        Story.mapItemQuest(1908, "twilightslums", 952);

        // 1909|Magic-flavored Misery
        Story.killQuest(1909, "twilightslums", "Subrysa");

        // 1910|Sending out a Stress-OS
        Story.mapItemQuest(1910, "twilightslums", 954);

        // 1911|Lock-Blocked
        Story.mapItemQuest(1911, "palace", 955);

        // 1912|Bridge Over Troubled Wellmet
        Story.mapItemQuest(1912, "palace", 956);

        // 1913|Focus on the Locus
        Story.mapItemQuest(1913, "twilightslums", 957);

        // 1914|Locus Located
        Story.mapItemQuest(1914, "twilightslums", 958);

        // 1915|Demented Deorysa
        if (!Story.questProgression(1915)) {
            Core.ensureAccept(1915);
            Core.huntMonster("palace", "Deorysa", "Deorysa Slain", 15);
            Core.ensureComplete(1915);
        }

        // 1916|Traitor Takedown
        Story.chainQuest(1916);
    }
}

export default function main(): void {
    const script = new MagicThief();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
