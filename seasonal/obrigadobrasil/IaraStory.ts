/*
name: Iara Story
description: This will finish the Iara seasonal storyline.
tags: iara, story, seasonal
*/
// Port of Scripts/Seasonal/ObrigadoBrasil/IaraStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Iara {
    storyLine(): void {
        if (Core.isCompletedBefore(8261) || !Core.isSeasonalMapActive("iara")) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Elemental Balance 8258
        Story.killQuest(8258, "iara", "Earth Elemental");

        //Bandits and Treasure Hunters 8259
        if (!Story.questProgression(8259)) {
            Core.ensureAccept(8259);
            Core.huntMonster("iara", "Bandit", "Bandit Captured", 3);
            Core.huntMonster("iara", "Treasure Hunter", "Treasure Hunter Scared Off", 3);
            Core.ensureComplete(8259);
        }

        //Plants be Spooky 8260
        Story.killQuest(8260, "iara", "Seed Spitter");

        //The Test of Will 8261
        Story.killQuest(8261, "iara", "Iara");
    }
}

export default function main(): void {
    const script = new Iara();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
