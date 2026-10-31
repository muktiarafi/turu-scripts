/*
name: Djinn Guard Story
description: This will finish the Djinn Guard Story.
tags: story, quest, djinn-guard
*/
// Port of Scripts/Story/DjinnGuard.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";
import { DjinnGateStory } from "./DjinnGate";

const Story = new CoreStory();
const djinnGateStory = new DjinnGateStory();

export class DjinnGuard {
    completeDjinnGuard(): void {
        djinnGateStory.djinnGate();
        if (Core.isCompletedBefore(6274)) {
            return;
        }

        Story.preLoad(this.completeDjinnGuard);

        //Trial of Water 6270
        Story.killQuest(6270, "DjinnGuard", "Jaan al Bahar");

        //Trial of Air 6271
        Story.killQuest(6271, "DjinnGuard", "Jaan al Hawa");

        //Trial of Earth 6272
        Story.killQuest(6272, "DjinnGuard", "Jaan al Ard");

        //Trial of Fire 6273
        Story.killQuest(6273, "DjinnGuard", "Jaan al Nair");

        //Blessing of the Guardian 6274
        Story.killQuest(6274, "DjinnGuard", "Image of Crulon");
    }
}

export default function main(): void {
    const script = new DjinnGuard();
    Core.setOptions();

    script.completeDjinnGuard();

    Core.setOptions(false);
}
