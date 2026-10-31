/*
name: Marsh 2 Story (Member)
description: This will finish the Marsh 2 Story.
tags: story, quest, marsh2, member
*/
// Port of Scripts/Story/Marsh2[MEM].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Marsh2 {
    storyLine(): void {
        if (!Core.isMember) {
            Core.logger("Marsh 2 Storyline Is Member Only. Skipping this Script");
            return;
        }

        if (Core.isCompletedBefore(1481)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Clueless 1474
        Story.mapItemQuest(1474, "marsh2", 720, 8);

        //Filling In The Puzzle 1475
        Story.killQuest(1475, "marsh2", "Undead Berserker");

        //The Eyes (and Teeth) Have It 1476
        if (!Story.questProgression(1476)) {
            Core.ensureAccept(1476);
            Core.huntMonster("marsh2", "Ghoul", "Ghoul Tooth", 10);
            Core.huntMonster("marsh2", "Marsh Lurker", "Marsh Lurker's Eye", 12);
            Core.ensureComplete(1476);
        }

        //Halfway There 1477
        if (!Story.questProgression(1477)) {
            Core.ensureAccept(1477);
            Core.huntMonster("marsh2", "Lich", "Mossy Bone", 15);
            Core.huntMonster("marsh2", "Lesser Shadow Serpent", "Shadow Serpent Venom", 1);
            Core.ensureComplete(1477);
        }

        //Charge It 1478
        if (!Story.questProgression(1478)) {
            Core.ensureAccept(1478);
            Core.huntMonster("marsh2", "Thrax Ironhide", "Positive Charge", 1);
            Core.huntMonster("marsh2", "Lesser Groglurk", "Negative Charge", 1);
            Core.ensureComplete(1478);
        }

        //What Was That?! 1479
        Story.mapItemQuest(1479, "marsh2", 723);

        //The Mudluk Vault 1480
        Story.killQuest(1480, "marsh2", "Marsh Vault Guardian");

        //Recovering Mudluk History 1481
        Story.mapItemQuest(1481, "marsh2", 721);
    }
}

export default function main(): void {
    const script = new Marsh2();
    Core.setOptions();
    script.storyLine();
    Core.setOptions(false);
}
