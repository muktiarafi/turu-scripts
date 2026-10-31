/*
name: Pooka Story
description: This will complete the Pooka story quest.
tags: story, quest, pooka, seasonal, lucky
*/
// Port of Scripts/Seasonal/LuckyDay/Pooka.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class PookaStory {
    completePooka(): void {
        if (!Core.isSeasonalMapActive("pooka")) {
            return;
        }
        if (Core.isCompletedBefore(7962)) {
            return;
        }

        Story.preLoad(this.completePooka);

        Core.addDrop("Amethyst Faerie Wings");

        //Luck Boost
        Story.killQuest(7959, "pooka", "Sneevilchaun");

        //Safe Space
        Story.killQuest(7960, "pooka", "Lucky Treeant");

        //Tricksy Gold
        Story.killQuest(7961, "pooka", "Faerie");

        //You Feel Lucky?
        Story.killQuest(7962, "pooka", "Pooka");
    }
}

export default function main(): void {
    const script = new PookaStory();
    Core.setOptions();

    script.completePooka();

    Core.setOptions(false);
}
