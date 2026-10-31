/*
name: Magic magicmeadow Story
description: This will finish the Magic magicmeadow storyline.
tags: magic, magicmeadow, seasonal, april, fools
*/
// Port of Scripts/Seasonal/AprilFools/Magicmeadow.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Magicmeadow {
    completeStory(): void {
        if (Core.isCompletedBefore(9183)) {
            Core.logger("StoryLine Complet: Magic magicmeadow");
            return;
        }

        Story.preLoad(this.completeStory);

        // 9176 Claws and Effect
        Story.mapItemQuest(9176, "magicmeadow", 11466);

        // 9177 Dog and Pony Show
        Story.mapItemQuest(9177, "magicmeadow", 11467);

        // 9178 Fine Vulpine
        Story.mapItemQuest(9178, "magicmeadow", 11468);

        // 9179 Feathered Foray
        Story.mapItemQuest(9179, "magicmeadow", 11469);

        // 9180 Carrot Quest
        Story.mapItemQuest(9180, "magicmeadow", 11470);

        // 9181 Funguy
        Story.mapItemQuest(9181, "magicmeadow", 11471);

        // 9182 Bone Voyage
        Story.mapItemQuest(9182, "magicmeadow", 11472);

        // 9183 The Pearly Gaits
        Story.mapItemQuest(9183, "magicmeadow", 11473);
    }
}

export default function main(): void {
    const script = new Magicmeadow();
    Core.setOptions();

    script.completeStory();
    Core.setOptions(false);
}
