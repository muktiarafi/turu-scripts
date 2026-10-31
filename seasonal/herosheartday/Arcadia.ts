/*
name: Arcadia
description: This will complete the Arcadia story quest.
tags: arcadia, seasonal, heros-heart-day, heart, hero, story
*/
// Port of Scripts/Seasonal/HerosHeartDay/Arcadia.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Arcadia {
    completeStory(): void {
        if (Core.isCompletedBefore(8520)) {
            return;
        }

        if (!Core.isSeasonalMapActive("Arcadia")) {
            return;
        }

        Story.preLoad(this.completeStory);
        Core.equipClass(ClassType.Farm);

        // Cotton Candy Sky 8507
        Story.killQuest(8507, "Arcadia", "Spirit Butterfly");

        // Sticking Your Neck Out 8508
        Story.mapItemQuest(8508, "Arcadia", 9625);

        // Melty Blood 8509
        Story.mapItemQuest(8509, "Arcadia", 9626);
        Story.killQuest(8509, "Arcadia", "Shadowfall Warrior");

        // Poincare Recurrence 8510
        Story.mapItemQuest(8510, "Arcadia", 9630);
        Story.killQuest(8510, "Arcadia", "Spirit Butterfly");

        // Princess Carry 8511
        Story.mapItemQuest(8511, "Arcadia", 9631);
        Story.killQuest(8511, "Arcadia", "Spirit Butterfly");

        // Flowers for a Crown  8512
        Story.mapItemQuest(8512, "Arcadia", 9632, 4);

        // Tea Diffusion  8513
        Story.mapItemQuest(8513, "Arcadia", 9627);
        Story.killQuest(8513, "Arcadia", "Phantasm");

        // Road Not Taken  8514
        Story.mapItemQuest(8514, "Arcadia", 9633, 4);
        Story.killQuest(8514, "Arcadia", "Spirit Butterfly");

        // Squeaky Toy 8515
        Story.mapItemQuest(8515, "Arcadia", 9634);
        Story.killQuest(8515, "Arcadia", "Phantasm");

        // Vantablack 8516
        Story.mapItemQuest(8516, "Arcadia", 9635, 3);
        Story.killQuest(8516, "Arcadia", "Lightguard Wraith");

        // Salt Bin 8517
        Story.mapItemQuest(8517, "Arcadia", 9628);

        // Four Princesses  8518
        Story.mapItemQuest(8518, "Arcadia", 9636);
        Story.killQuest(8518, "Arcadia", "Lightguard Wraith");

        // Unconditional 8519
        Core.equipClass(ClassType.Solo);
        Story.killQuest(8519, "Arcadia", "Agape");

        // Separation Anxiety 8520
        if (!Story.questProgression(8520)) {
            Core.ensureAccept(8520);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("arcadia", "Agape", "Agape Petal", 1);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("arcadia", "Spirit Butterfly", "Paper Butterfly Wings", 8);
            Core.huntMonster("arcadia", "Lightguard Wraith", "Armor Paint Residue", 8);
            Core.ensureComplete(8520);
        }
    }
}

export default function main(): void {
    const script = new Arcadia();
    Core.setOptions();

    script.completeStory();
    Core.setOptions(false);
}
