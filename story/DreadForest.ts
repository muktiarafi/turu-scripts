/*
name: Dread Forest Story
description: This will finish the Dread Forest Story.
tags: story, quest, dread-forest
*/
// Port of Scripts/Story/DreadForest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class DreadForest {
    storyline(): void {
        if (Core.isCompletedBefore(8722)) {
            return;
        }

        Story.preLoad(this.storyline);

        // Empty Fealty 8711
        Story.killQuest(8711, "dreadforest", "Treacherous Bandit");

        // Bitter Sweet-Talker 8712
        if (!Story.questProgression(8712)) {
            Core.ensureAccept(8712);
            Core.getMapItem(10267, 1, "dreadforest");
            Core.huntMonster("dreadforest", "Noble\u2019s Servant", "Stolen Amenities", 7);
            Core.ensureComplete(8712);
        }

        // Fake It Till You Make It 8713
        Story.killQuest(8713, "dreadforest", "Noble's Knight");

        // Decimation 8714
        Story.killQuest(8714, "dreadforest", "Treacherous Bandit");

        // Warning Beacon 8715
        if (!Story.questProgression(8715)) {
            Core.ensureAccept(8715);
            Core.getMapItem(10268, 1, "dreadforest");
            Core.huntMonster("dreadforest", "Noble's Knight", "Knight's Emblem", 7);
            Core.ensureComplete(8715);
        }

        // Strategy and Utility 8716
        Story.killQuest(8716, "dreadforest", "Reignolds' Knight");

        // Runaway 8717
        Story.mapItemQuest(8717, "dreadforest", [10269, 10270, 10271]);

        // Make - Up Artist 8718
        Story.killQuest(8718, "dreadforest", "Taxidermied Servant");

        // Piercing the Veil 8719
        if (!Story.questProgression(8719)) {
            Core.ensureAccept(8719);
            Core.huntMonster("dreadforest", "Taxidermied Servant", "Servants Eliminated", 7);
            Core.huntMonster("dreadforest", "Reignolds' Knight", "Knights Eliminated", 7);
            Core.ensureComplete(8719);
        }

        // Any Means Necessary 8720
        Story.killQuest(8720, "dreadforest", "Lord Reignolds");

        // Out of Sight, Out of Mind 8721
        Story.mapItemQuest(8721, "dreadforest", 10272);

        // Vulture Pickings 8722
        if (!Story.questProgression(8722)) {
            Core.ensureAccept(8722);
            Core.huntMonster("dreadforest", "Reignolds' Knight", "Valuable Metals", 8);
            Core.huntMonster("dreadforest", "Taxidermied Servant", "Gold Pouches", 8);
            Core.huntMonster("dreadforest", "Lord Reignolds", "Reignolds' Brooch", 1);
            Core.ensureComplete(8722);
        }
    }
}

export default function main(): void {
    const script = new DreadForest();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
