/*
name: Aranx Quests
description: This script will do all quests of aranx in /darkdimension, /icedimension, /Ivoliss, /Pocketdimension and /sanddimension
tags: aranx, darkdimension, icedimension, ivoliss, pocketdimension, sanddimension
*/
// Port of Scripts/Story/AranxQuests.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class AranxQuests {
    storyLine(): void {
        if (Core.isCompletedBefore(6508)) {
            return;
        }

        Story.preLoad(this.storyLine);
        //Find the Resonance 6496
        Story.killQuest(6496, "pocketdimension", "Nothing");

        //Tune it up! 6497
        Story.mapItemQuest(6497, "pocketdimension", 5988, 3);

        //Explore the Ice Dimension 6498
        if (!Story.questProgression(6498)) {
            Core.ensureAccept(6498);
            Core.getMapItem(5989, 1, "icedimension");
            Core.huntMonster("icedimension", "Ice Spitter", "Enemies Defeated", 10);
            Core.ensureComplete(6498);
        }

        //Open the Next Dimension 6499
        if (!Story.questProgression(6499)) {
            Core.ensureAccept(6499);
            Core.getMapItem(5990, 5, "icedimension");
            Core.huntMonster("icedimension", "Ice Elemental", "Frigid Resonance", 5);
            Core.ensureComplete(6499);
        }

        //Explore the Sand Dimension 6500
        if (!Story.questProgression(6500)) {
            Core.ensureAccept(6500);
            Core.getMapItem(5991, 1, "sanddimension");
            Core.huntMonster("sanddimension", "Lotus Spider", "Enemies Defeated", 10);
            Core.ensureComplete(6500);
        }

        //Open the 3rd Dimension 6501
        if (!Story.questProgression(6501)) {
            Core.ensureAccept(6501);
            Core.getMapItem(5992, 5, "sanddimension");
            Core.huntMonster("sanddimension", "Lotus Spider", "Arid Resonance", 5);
            Core.ensureComplete(6501);
        }

        //Explore the Dark Dimension 6502
        if (!Story.questProgression(6502)) {
            Core.ensureAccept(6502);
            Core.getMapItem(5993, 1, "darkdimension");
            Core.huntMonster("darkdimension", "Void Phoenix", "Enemies Defeated", 10);
            Core.ensureComplete(6502);
        }

        //Open the 4th Dimension 6503
        if (!Story.questProgression(6503)) {
            Core.ensureAccept(6503);
            Core.getMapItem(5994, 5, "darkdimension");
            Core.huntMonster("darkdimension", "Void Phoenix", "Dark Resonance", 5);
            Core.ensureComplete(6503);
        }

        //Find Arthelyn 6504
        Story.mapItemQuest(6504, "ivoliss", 5995);

        //Get the Key 6505
        Core.equipClass(ClassType.Solo);
        Story.killQuest(6505, "ivoliss", "ivoliss");

        //Free Arthelyn 6506
        Story.mapItemQuest(6506, "ivoliss", 5996);
        Story.mapItemQuest(6506, "ivoliss", 5998);

        //Reach Arthelyn 6507
        Story.mapItemQuest(6507, "ivoliss", 5997);

        //Defeat Arthelyn 6508
        Story.killQuest(6508, "ivoliss", "Arthelyn");
    }
}

export default function main(): void {
    const script = new AranxQuests();
    Core.setOptions();

    script.storyLine();
    Core.setOptions(false);
}
