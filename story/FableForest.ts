/*
name: Fable Forest Story
description: This will finish the Fable Forest Story.
tags: story, quest, fable-forest
*/
// Port of Scripts/Story/FableForest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class FableForest {
    storyLine(): void {
        if (Core.isCompletedBefore(3313)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Cowering Zardman Quests
        //Axe Marks the Spot 3300
        Story.killQuest(3300, "greendragon", "Greenguard Dragon");

        //Get Choppin' 3301
        Story.mapItemQuest(3301, "fableforest", 2425);

        //Fae Quests
        //Fight Fire with Fire Elementals 3302
        Story.killQuest(3302, "fableforest", "Fire Elemental");

        // Man's Best Fiend 3304
        Story.killQuest(3304, "fableforest", "Bloodwolf");

        // Water Softener 3305
        Story.killQuest(3305, "fableforest", "Water Elemental");

        // Swimming with Sneevils 3306
        Story.killQuest(3306, "fableforest", "Aqueevil");

        // 100% Natural 3307
        Story.killQuest(3307, "fableforest", "Earth Elemental");

        // Conquer the Satyr 3308
        Story.killQuest(3308, "fableforest", "Undead Satyr");

        // Air Heads 3309
        Story.killQuest(3309, "fableforest", "Wind Elemental");

        // The Forest & Furious 3310
        Story.killQuest(3310, "fableforest", "Forest Fury");

        // Mystery Tree 3311
        Story.mapItemQuest(3311, "fableforest", 2424);

        // Guidance from the Guardian 3313
        Story.killQuest(3313, "fableforest", "Forest Guardian");

        // // Get Fired Up 3314
        // Story.KillQuest(0000, "fableforest", "mob");

        // // Marine Biology 3315
        // Story.KillQuest(0000, "fableforest", "mob");

        // // Air Current Affairs 3316
        // Story.KillQuest(0000, "fableforest", "mob");

        // // Back to your Roots 3317
        // Story.KillQuest(0000, "fableforest", "mob");

        // // Classified Chaos 3318
        // Story.KillQuest(0000, "fableforest", "mob");
    }
}

export default function main(): void {
    const script = new FableForest();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
