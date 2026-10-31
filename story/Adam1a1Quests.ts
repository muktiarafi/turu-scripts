/*
name: Poison Forest Story
description: This will finish the Poison Forest Story.
tags: story, quest, poison-forest
*/
// Port of Scripts/Story/Adam1a1Quests.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Adam1a1Quest {
    storyline(): void {
        if (Core.isCompletedBefore(8014)) {
            return;
        }

        //Coffee for the Mind 8009
        if (!Story.questProgression(8009)) {
            Core.ensureAccept(8009);
            Core.huntMonster("vendorbooths", "Caffeine Imp", "Coffee Beans", 10);
            Core.huntMonster("djinn", "Lamia", "Tasty Poison", 10);
            Core.huntMonster("charredpath", "Toxic Wisteria", "Necessary Antidote");
            Core.ensureComplete(8009);
        }

        //Ectoplasm for the Body 8010
        if (!Story.questProgression(8010)) {
            Core.ensureAccept(8010);
            Core.huntMonster("doomwood", "Doomwood Ectomancer", "Refined Ectoplasm", 10);
            Core.huntMonster("ectocave", "Ektorax", "Ektorax's Ectoplasm");
            Core.ensureComplete(8010);
        }

        //Secretteller's Building Materials 8011
        if (!Story.questProgression(8011)) {
            Core.ensureAccept(8011);
            Core.huntMonster("extinction", "Slimed Drone", "Iron II.0", 4, { isTemp: false });
            Core.huntMonster("doomwood", "Doomwood Treeant", "Wood", 10);
            Core.huntMonster("crashsite", "Dwakel Blaster", "Big Iron Bolts", 10);
            Core.huntMonster("portalmaze", "Time Wraith", "Piece of Cake", 5);
            Core.ensureComplete(8011);
        }
    }
}

export default function main(): void {
    const script = new Adam1a1Quest();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
