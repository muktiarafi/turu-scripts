/*
name: Extinction Story
description: This will finish the Extinction Story.
tags: story, quest, extinction
*/
// Port of Scripts/Story/Extinction.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Extinction {
    storyLine(): void {
        if (Core.isCompletedBefore(3864)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Chopped HAMM 3855
        if (!Story.questProgression(3855)) {
            Core.ensureAccept(3855);
            Core.getMapItem(2956, 5, "extinction");
            Core.huntMonster("extinction", "Control Panel", "Control Panel Destroyed", 5);
            Core.ensureComplete(3855);
        }

        //Bad Dog 3856
        Story.killQuest(3856, "extinction", "Cyworg");

        //Pink Slime Yum! 3857
        if (!Story.questProgression(3857)) {
            Core.ensureAccept(3857);
            Core.huntMonster("extinction", "Pink Slime", "Pink Slime Slain", 5);
            Core.huntMonster("extinction", "Gelatinous Slime", "Gelatinous Slime Slain", 5);
            Core.ensureComplete(3857);
        }

        //Processed What? 3858
        Story.mapItemQuest(3858, "extinction", 2957, 5);

        //Another Locked Door 3859
        Story.killQuest(3859, "extinction", "Slimed Drone");

        //This Factory is On Fire 3860
        Story.killQuest(3860, "extinction", "Freezer Drone");

        //Frozen... Food? 3861
        Story.mapItemQuest(3861, "extinction", 2958, 5);

        //Fight Fire With Flammable Ingredients 3862
        Story.killQuest(3862, "extinction", "Lard");

        //The Last Lock 3863
        Story.killQuest(3863, "extinction", "Freezer Drone");

        //SN.O.W. Fall 3864
        Story.killQuest(3864, "extinction", "SN.O.W.");
    }
}

export default function main(): void {
    const script = new Extinction();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
