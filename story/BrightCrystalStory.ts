/*
name: Bright Crystal Story
description: This will complete the Bright Crystal story.
tags: story, quest, bright-crystal
*/
// Port of Scripts/Story/BrightCrystalStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class BrightCrystalStory {
    crystalBrightQuests(): void {
        if (Core.isCompletedBefore(4967)) {
            return;
        }

        Story.preLoad(this.crystalBrightQuests);

        //Street Team 4953
        Story.mapItemQuest(4953, "dreamforest", 4326, 5);

        //De-Pesting 4954
        Core.equipClass(ClassType.Farm);
        if (!Story.questProgression(4954)) {
            Core.ensureAccept(4954);
            Core.huntMonster("dreamforest", "Crow", "Crows Shooed", 4);
            Core.huntMonster("dreamforest", "Green Rat", "Rats Shooed", 4);
            Core.ensureComplete(4954);
        }

        //Earning That Guest Pass 4955
        Story.mapItemQuest(4955, "dreamforest", 4327, 4);
        Story.mapItemQuest(4955, "dreamforest", 4328, 3);
        Story.mapItemQuest(4955, "dreamforest", 4329);

        //Low On Caffeine 4956
        Story.mapItemQuest(4956, "northpointe", 4330);

        //Feels like a Dream 4957
        Story.mapItemQuest(4957, "dreamforest", 4331, 5);

        //Give me a Ticket 4958
        Core.equipClass(ClassType.Farm);
        Story.killQuest(4958, "dreamforest", "Crow");

        //For an Elephant Ride? 4959
        Story.mapItemQuest(4959, "dreamforest", 4332);

        //Trainers 4960
        Story.mapItemQuest(4960, "dreamforest", 4333, 6);
        Story.mapItemQuest(4960, "dreamforest", 4334);

        //Tumblers 4961
        if (!Story.questProgression(4961)) {
            Core.ensureAccept(4961);
            Core.huntMonster("dreamforest", "Acrobat", "Acrobat Defeated", 4);
            Core.huntMonster("dreamforest", "Acrobat", "Midway Ticket", 1);
            Core.ensureComplete(4961);
        }

        //Head to the Midway 4962
        if (!Story.questProgression(4962)) {
            Core.ensureAccept(4962);
            Core.huntMonster("dreamforest", "Acrobat", "Acrobats Know Nothing", 3);
            Core.huntMonster("dreamforest", "Fire Dancer", "Fire Dancers Seem Confused", 3);
            Core.huntMonster("dreamforest", "Elephant Trainer", "Trainers Haven't Seen Him", 3);
            Core.ensureComplete(4962);
        }

        //Balloons 4963
        if (!Story.questProgression(4963)) {
            Core.ensureAccept(4963);
            Core.huntMonsterMapID("dreamforest", 19, "Prize Ticket", 10);
            Core.ensureComplete(4963);
        }

        //Out of the Shadows 4964
        if (!Story.questProgression(4964)) {
            Core.ensureAccept(4964);
            Core.huntMonster("dreamforest", "Living Shadow", "Shadows", 4);
            Core.huntMonsterMapID("dreamforest", 9, "Darkness", 4);
            Core.ensureComplete(4964);
        }

        //Follow the Footprints 4965
        Story.mapItemQuest(4965, "dreamforest", 4335, 10);

        //Help Miranda 4967
        if (!Story.questProgression(4967)) {
            Core.ensureAccept(4967);
            Core.huntMonsterMapID("dreamforest", 23, "Geist Defeated");
            Core.ensureComplete(4967);
        }
    }
}

export default function main(): void {
    const script = new BrightCrystalStory();
    Core.setOptions();

    script.crystalBrightQuests();

    Core.setOptions(false);
}
