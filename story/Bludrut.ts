/*
name: Bludrut Story
description: This will complete the Bludrut story.
tags: story, quest, bludrut
*/
// Port of Scripts/Story/Bludrut.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Bludrut {
    storyLine(): void {
        if ((Core.isMember && Core.isCompletedBefore(1692)) || (!Core.isMember && Core.isCompletedBefore(102))) {
            return;
        }

        Story.preLoad(this.storyLine);

        // [[[ bludrut ]]]

        //Stone Endurance 100
        Story.killQuest(100, "bludrut", "Rattlebones");

        //Heart of Stone 101
        Story.killQuest(101, "bludrut", "Rock Elemental");

        // [[[ bludrut2 ]]]

        //Fire Endurance 102
        Story.killQuest(102, "bludrut2", "Shadow Creeper");

        if (Core.isMember) {
            Story.killQuest(103, "bludrut2", "Fire Elemental");
        }

        // [[[ bludrut3 ]]]

        if (Core.isMember) {
            //Water Endurance 104
            Story.killQuest(104, "bludrut3", "Siren");

            //Liquid Soul 105
            Story.killQuest(105, "bludrut3", "Ice Elemental");
        }

        // [[[ bludrut4 ]]]

        if (Core.isMember) {
            //Dark Endurance 106
            Story.killQuest(106, "bludrut4", "Shadow Serpent");

            //Heart of Darkness 107
            Story.killQuest(107, "bludrut4", "Evil Elemental");
        }

        if (Core.isMember) {
            //Lost Memories 1685
            Story.mapItemQuest(1685, "bludrut", 891);

            //Remembering... 1686
            Story.killQuest(1686, "bludrut", "Rattlebones");

            //A Personal Effect 1687
            Story.killQuest(1687, "bludrut2", "Shadow Creeper");

            //The Unintentional Tomb 1688
            Story.mapItemQuest(1688, "bludrut2", 892);

            //The Spirit Speaks 1689
            if (!Story.questProgression(1689)) {
                Core.ensureAccept(1689);
                Core.huntMonster("bludrut2", "Shadow Creeper", "Shadow Creeper Tallow", 5);
                Core.huntMonster("bludrut", "Rattlebones", "Rattlebones' Bones", 5);
                Core.huntMonster("bludrut", "Rock Elemental", "Rock Elemental Spark");
                Core.ensureComplete(1689);
            }

            //Unseen Monsters 1690
            Story.mapItemQuest(1690, "bludrut3", 894);

            //Stop IT! 1691
            Story.killQuest(1691, "bludrut3", "IT");

            //Sad Farewells 1692
            Story.mapItemQuest(1692, "bludrut2", 893);
        }
    }
}

export default function main(): void {
    const script = new Bludrut();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
