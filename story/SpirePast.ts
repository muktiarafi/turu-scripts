/*
name: Spire Past Story
description: This will finish the Spire Past Story.
tags: story, quest, spirepast
*/
// Port of Scripts/Story/SpirePast.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class SpirePast {
    storyline(): void {
        if (Core.isCompletedBefore(6834)) {
            return;
        }

        Story.preLoad(this.storyline);

        //Battle Azal (6824)
        Story.killQuest(6824, "dreadrock", "Azal the Infernal");

        //Journal Entry 1 (6825)
        Story.killQuest(6825, "spirepast", "Infernal Imp");

        //Journal Entry 15 (6826)
        Story.killQuest(6826, "spirepast", "Infernal Imp");

        //Journal Entry 56 (6827)
        Story.killQuest(6827, "spirepast", "Rookie Guard");

        //Journal Entry 77 (6828)
        Story.killQuest(6828, "spirepast", "Infernal Imp");

        //Journal Entry 151 (6829)
        Story.killQuest(6829, "spirepast", "Celestial Knight");

        //Journal Entry 324 (6830)
        Story.killQuest(6830, "spirepast", "Celestial Knight");

        //Journal Entry 583 (6831)
        if (!Story.questProgression(6831)) {
            Core.ensureAccept(6831);
            Core.huntMonster("spirepast", "Infernal Guard", "Guard Tackled", 1);
            Core.huntMonster("spirepast", "Infernal Hound", "Hound Attacked", 1);
            Core.ensureComplete(6831);
        }

        //Journal Entry 600 (6832)
        Story.killQuest(6832, "spirepast", "Infernal Hound");

        //Journal Entry 826 (6833)
        Story.killQuest(6833, "spirepast", "Celestial Knight");

        //Journal Entry 1000 (6834)
        Story.killQuest(6834, "spirepast", "Infernal Guard Captain");
    }
}

export default function main(): void {
    const script = new SpirePast();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
