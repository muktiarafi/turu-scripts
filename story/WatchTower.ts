/*
name: WatchTower Story
description: This will finish the WatchTower Story.
tags: story, quest, watch-tower
*/
// Port of Scripts/Story/WatchTower.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class WatchTower {
    storyLine(): void {
        // if (Core.isCompletedBefore(2610))
        //     return;

        Story.preLoad(this.storyLine);

        //Chaos Investigation 2602
        if (!Story.questProgression(2602)) {
            Core.ensureAccept(2602);
            Core.getMapItem(1605, 6, "watchtower");
            Core.huntMonster("watchtower", "Chaorrupted Wolf", "Chaos Wolf Slain", 3);
            Core.huntMonster("watchtower", "Chaotic Gorillaphant", "Gorillaphant Slain", 3);
            Core.ensureComplete(2602);
        }

        //Hunt for Answers 2603
        if (!Story.questProgression(2603)) {
            Core.ensureAccept(2603);
            Core.huntMonster("watchtower", "Chaos Spider", "Vermin Cleared", 5);
            Core.huntMonster("watchtower", "StorageBox", "Tattered Page 1", 1);
            Core.ensureComplete(2603);
        }

        //Decryption Hunt 2604
        if (!Story.questProgression(2604)) {
            Core.ensureAccept(2604);
            Core.getMapItem(1606, 1, "watchtower");
            Core.huntMonster("watchtower", "Chaorrupted Knight", "Intruder Removed", 6);
            Core.ensureComplete(2604);
        }

        //Prisoner Breakout! 2605
        Story.killQuest(2605, "watchtower", "Chaorrupted Prisoner");

        //Hidden Secrets 2606
        if (!Story.questProgression(2606)) {
            Core.ensureAccept(2606);
            Core.getMapItems(
                [
                    [1607, 1],
                    [1608, 1],
                ],
                "watchtower",
            );
            Core.huntMonster("watchtower", "Chaos Gorillaphant", "Secret Guardian Defeated", 1);
            Core.ensureComplete(2606);
        }

        //Mage Mystery 2607
        if (!Story.questProgression(2607)) {
            Core.ensureAccept(2607);
            Core.getMapItem(1609, 4, "watchtower");
            Core.huntMonster("watchtower", "Chaos Sp-eye", "Sp-Eye Blinded", 13);
            Core.ensureComplete(2607);
        }

        //Take Back Remains 2608
        Story.killQuest(2608, "watchtower", "Chaorrupted Knight");

        //Activate Teleport Rune 2609
        if (!Story.questProgression(2609)) {
            Core.ensureAccept(2609);
            Core.getMapItem(1610, 1, "watchtower");
            Core.huntMonster("watchtower", "Chaorrupted Good Soldier", "Chaorrupted Blood", 1);
            Core.ensureComplete(2609);
        }

        //Chaos Knight Attacks 2610
        Story.killQuest(2610, "watchtower", "Chaos Knight");
    }
}

export default function main(): void {
    const script = new WatchTower();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
