/*
name: Ice Plane Story
description: This will finish the Ice Plane Story.
tags: story, quest, ice plane, iceplane, ice, plane, glace, quetzal
*/
// Port of Scripts/Story/IcePlane.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class IcePlane {
    storyLine(): void {
        if (Core.isCompletedBefore(5783)) {
            return;
        }

        Story.preLoad(this.storyLine);

        Core.equipClass(ClassType.Farm);

        // Find the Core (5777)
        Story.killQuest(5777, "iceplane", "Spirit of Ice");

        // Make a Bridge (5778)
        if (!Story.questProgression(5778)) {
            Core.ensureAccept(5778);
            Core.getMapItem(5218, 1, "iceplane");
            Core.huntMonster("iceplane", "Frozen Jellyfish", "Eternal Crystal", 21);
            Core.ensureComplete(5778);
        }

        // Don't Fall (5779)
        Story.mapItemQuest(5779, "iceplane", [5219, 5220]);

        // Defeat the Shade (5780)
        if (!Core.isCompletedBefore(5780)) {
            Core.equipClass(ClassType.Solo);
            if (!Story.questProgression(5780)) {
                Core.ensureAccept(5780);
                Core.getMapItem(5221, 1, "iceplane");
                Core.huntMonster("iceplane", "Crystalline Shade", "Frozen Soul", 1);
                Core.ensureComplete(5780);
            }
            Core.equipClass(ClassType.Farm);
        }

        // Ice is Sharp (5781)
        Story.killQuest(5781, "iceplane", "Frostblade");

        // Release the Energy (5782)
        Story.killQuest(5782, "iceplane", "Animus of Ice");

        // Defeat the Enfield (5783)
        if (!Core.isCompletedBefore(5783)) {
            Core.equipClass(ClassType.Solo);
            Story.killQuest(5783, "iceplane", "Enfield");
            Core.equipClass(ClassType.Farm);
        }
    }
}

export default function main(): void {
    const script = new IcePlane();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
