/*
name: Manor Story
description: This will finish the Manor Story.
tags: story, quest, manor
*/
// Port of Scripts/Story/Manor.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Manor {
    storyLine(): void {
        if (Core.isCompletedBefore(1062)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Hard Water 1058
        Story.killQuest(1058, "Manor", "Amethyst Golem");

        //Raising the Stakes 1059
        Story.mapItemQuest(1059, "Manor", 403, 10);

        //Stop! Potion Time. 1060
        if (!Story.questProgression(1060)) {
            Core.ensureAccept(1060);
            Core.getMapItem(402, 1, "Manor");
            Core.huntMonster("manor", "Frigid Frogdrake", "Frigid Frogdrake Horn", 7);
            Core.ensureComplete(1060);
        }

        //Inscrutable Motivation 1061
        Story.mapItemQuest(1061, "Manor", 404, 10);

        //Paradise is Not So Nice 1062
        Story.killQuest(1062, "Manor", "Bird of Paradise");
    }
}

export default function main(): void {
    const script = new Manor();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
