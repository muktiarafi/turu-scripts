/*
name: Burning Beach Story
description: This will finish the Burning Beach Story Line.
tags: story, quest, burning-beach, summer-break
*/
// Port of Scripts/Seasonal/SummerBreak/BurningBeach.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class BurningBeachStory {
    storyline(): void {
        if (!Core.isSeasonalMapActive("burningbeach")) {
            return;
        }

        if (Core.isCompletedBefore(7577)) {
            return;
        }

        Story.preLoad(this.storyline);

        //7573 | Suited to Shield
        if (!Story.questProgression(7573)) {
            Core.ensureAccept(7573);
            Core.huntMonster("burningbeach", "Shark", "Shark Skin", 5);
            Core.huntMonster("burningbeach", "Water Goblin", "Water Goblin Liver", 3);
            Core.ensureComplete(7573);
        }

        //7574 | Through Fumes and Flame
        Story.killQuest(7574, "burningbeach", "Lavazard");

        //7575 | Fiamme's Fang
        Story.killQuest(7575, "lavarun", "Phedra");

        //7576 | In Lava with Maladrite
        Story.killQuest(7576, "burningbeach", "Lava Guardian");

        //7577 | Fahrenheit FEAR - 51
        Story.killQuest(7577, "burningbeach", "Maladrite");
    }
}

export default function main(): void {
    const script = new BurningBeachStory();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
