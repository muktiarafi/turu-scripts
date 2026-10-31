/*
name: Yguasu Falls Story
description: This will complete the Yguasu Falls story.
tags: story, quest, hero, heart, yguasu falls, seasonal
*/
// Port of Scripts/Seasonal/HerosHeartDay/YguasuFalls.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class YguasuFalls {
    doStory(): void {
        if (Core.isCompletedBefore(9587) || !Core.isSeasonalMapActive("yguasu")) {
            return;
        }

        Story.preLoad(this.doStory);

        // Designer Scales 9580
        Story.killQuest(9580, "yguasu", "Boiuna");

        // Harpy-Pecked 9581
        Story.killQuest(9581, "yguasu", "Harpy Dancer");

        // Dancer Incognito 9582
        Story.mapItemQuest(9582, "yguasu", 12688);
        Story.killQuest(9582, "yguasu", "Lovely Mask");

        // Costume Check 9583
        Story.killQuest(9583, "yguasu", ["Boiuna", "Harpy Dancer"]);

        // Transformative Medicine 9584
        Story.killQuest(9584, "yguasu", "Lobisomen");

        // Rocked My Life 9585
        Story.mapItemQuest(9585, "yguasu", 12689);
        Story.killQuest(9585, "yguasu", "Boiuna");

        // Reaching Palm Fronds 9586
        Story.mapItemQuest(9586, "yguasu", 12690);
        Story.killQuest(9586, "yguasu", "Lobisomen");

        // That's M'Boi 9587
        Story.killQuest(9587, "yguasu", "M'Boi");
    }
}

export default function main(): void {
    const script = new YguasuFalls();
    Core.setOptions();

    script.doStory();

    Core.setOptions(false);
}
