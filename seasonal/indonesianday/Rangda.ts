/*
name: Rangda Story
description: This will finish the Rangda storyline.
tags: rangda-story, rangda, seasonal
*/
// Port of Scripts/Seasonal/IndonesianDay/Rangda.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class RangdaSeasonal {
    storyLine(): void {
        if (!Core.isSeasonalMapActive("rangda")) {
            return;
        }
        if (Core.isCompletedBefore(7622)) {
            return;
        }

        Story.preLoad(this.storyLine);

        // 7617 Gather Flowers
        if (!Story.questProgression(7617)) {
            Core.ensureAccept(7617);
            Core.huntMonster("rangda", "Flowering Bush", "Red Rose");
            Core.huntMonster("rangda", "Flowering Bush", "White Rose");
            Core.huntMonster("rangda", "Flowering Bush", "Kanthil Flower");
            Core.huntMonster("rangda", "Flowering Bush", "Telon Flower");
            Core.huntMonster("rangda", "Flowering Bush", "Orchid");
            Core.huntMonster("rangda", "Flowering Bush", "Jasmine");
            Core.huntMonster("rangda", "Flowering Bush", "Kenanga Flower");
            Core.ensureComplete(7617);
        }

        // 7618 Defeat the Minions
        Story.killQuest(7618, "rangda", "Leyak");

        // 7619 Create a Barrier
        if (!Story.questProgression(7619)) {
            Core.ensureAccept(7619);
            Core.getMapItem(7526, 4, "rangda");
            Core.huntMonster("rangda", "Leyak", "Blood of the Leyak", 4);
            Core.ensureComplete(7619);
        }

        // 7620 Purify the Tuyul
        Story.killQuest(7620, "rangda", "Tuyul");

        // 7621 Give an Offering
        if (!Story.questProgression(7621)) {
            Core.ensureAccept(7621);
            Core.getMapItem(7527, 1, "rangda");
            Core.huntMonster("rangda", "Leyak", "Evil Spirits Slain", 10);
            Core.ensureComplete(7621);
        }

        // 7622 Defeat Rangda
        Story.killQuest(7622, "rangda", "Rangda");

        Core.logger("Rangda Storyline Complete");
    }
}

export default function main(): void {
    const script = new RangdaSeasonal();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
