/*
name: Dwarves Vs Giants Story
description: This will finish the Dwarves Vs Giants story.
tags: story, quest, DVG
*/
// Port of Scripts/Story/DwarvesVsGiants.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class DwarvesVsGiants {
    storyLine(): void {
        if (Core.isCompletedBefore(Core.isMember ? 2785 : 2783)) {
            return;
        }

        Story.preLoad(this.storyLine);

        Core.equipClass(ClassType.Solo);

        // Defeat Drram 2778
        Story.killQuest(2778, "dvg", "Draam");

        // Take On Tergum 2779
        Story.killQuest(2779, "dvg", "Tergum");

        // Smack Down Slork 2780
        Story.killQuest(2780, "dvg", "Slork");

        // Crush Krashh 2781
        Story.killQuest(2781, "dvg", "Krashh");

        // Win The Exhibition Match 2782
        if (!Story.questProgression(2782)) {
            Core.ensureAccept(2782);
            Core.huntMonster("dvg", "Blixx", "Blixx Defeated", 1);
            Core.huntMonster("dvg", "Meatball", "Meatball Defeated", 1);
            Core.ensureComplete(2782);
        }

        // Mow Down Munthor 2783
        Story.killQuest(2783, "dvg", "Munthor");

        if (Core.isMember) {
            // Challenge Meatball 2784
            Story.killQuest(2784, "dvgchallenge", "Meatball");

            // Challenge Blixx 2785
            Story.killQuest(2785, "dvgchallenge", "Blixx");
        }
    }
}

export default function main(): void {
    const script = new DwarvesVsGiants();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
