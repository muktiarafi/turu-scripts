/*
name: Darkon Garden
description: This will finish the Darkon Garden quest.
tags: story, quest, elegy-of-madness, darkon, garden
*/
// Port of Scripts/Story/ElegyofMadness(Darkon)/DarkonGarden.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class DarkonGarden {
    storyLine(): void {
        if (Core.isCompletedBefore(7494)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Picking Flowers 7485
        Story.mapItemQuest(7485, "garden", 7324, 10);

        //Bunny Food 7486
        Story.killQuest(7486, "garden", "Creature 343");

        //Feed the Bunnies 7487
        Story.mapItemQuest(7487, "garden", 7325, 10);

        //Control the Bunnies 7488
        Story.killQuest(7488, "garden", "Creature 83");

        //Time for Tea 7489
        Story.killQuest(7489, "garden", "Creature 343");

        //Needs Somethinig Else... 7490
        Story.killQuest(7490, "garden", "Creature 72");

        //Snacktime 7491
        Story.killQuest(7491, "garden", "Creature 83");

        //Big, MEAN Bunnies 7492
        if (!Story.questProgression(7492)) {
            Core.ensureAccept(7492);
            Core.getMapItem(7326, 1, "garden");
            Core.huntMonster("garden", "Creature 35", "Mutated Tongue", 5);
            Core.ensureComplete(7492);
        }

        //What Crack? 7493
        Story.mapItemQuest(7493, "garden", 7327);

        //OMG What is THAT? 7494
        Story.killQuest(7494, "garden", "Creature 12");
    }
}

export default function main(): void {
    const script = new DarkonGarden();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
