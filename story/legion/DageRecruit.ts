/*
name: Dage Recruit Story
description: This will complete the Dage Recruit story.
tags: story, quest, dage, recruit, legion, staff, birthday
*/
// Port of Scripts/Story/Legion/DageRecruit.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class DageRecruitStory {
    completeDageRecruit(): void {
        if (!Core.isSeasonalMapActive("dagerecruit")) {
            return;
        }
        if (Core.isCompletedBefore(8575)) {
            return;
        }

        Story.preLoad(this.completeDageRecruit);

        bot.drops.start();

        //Pop Goes the Makai
        Story.killQuest(8556, "dagerecruit", "Dark Makai");

        //Dispel Spell
        if (!Story.questProgression(8557)) {
            Core.ensureAccept(8557);
            Core.killMonster("dagerecruit", "Enter", "Spawn", "Dreadfiend", "Fiend Energy Collected", 4);
            Story.mapItemQuest(8557, "dagerecruit", 9883, 4);
        }

        //Dreadfiend Demolition
        if (!Story.questProgression(8558)) {
            Core.ensureAccept(8558);
            Core.killMonster("dagerecruit", "Enter", "Spawn", "Dreadfiend", "Dreadfiend Defeated", 6);
            Core.ensureComplete(8558);
        }

        //Graython Located
        Story.mapItemQuest(8559, "dagerecruit", 9884);

        //Defeat Graython
        if (!Story.questProgression(8560)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(8560);
            // Core.CutSceneFixer("dagerecruit", "r3", "Cut1", "Left");
            Core.killMonster("dagerecruit", "r3", "Left", "Graython", "Graython Defeated");
            Core.ensureComplete(8560);
        }

        //Island Sightseeing
        if (!Story.questProgression(8561)) {
            Core.ensureAccept(8561);
            Core.getMapItem(9885, 1, "dagerecruit");
            Core.huntMonster("dagerecruit", "Scared Wildcat", "Wildlife Cleared", 10);
            Core.ensureComplete(8561);
        }

        //Lure Crafted
        if (!Story.questProgression(8562)) {
            Core.ensureAccept(8562);
            Core.killMonster("dagerecruit", "Enter", "Spawn", "Dreadfiend", "Void Crystals", 3);
            Core.ensureComplete(8562);
        }

        //Lure Charged
        Story.killQuest(8563, "dagerecruit", "Scared Wildcat");

        //Place the Lure
        Story.mapItemQuest(8564, "dagerecruit", 9886);

        //Defeat Nuckelavee
        Story.killQuest(8565, "dagerecruit", "Nuckelavee");

        //Bloody the Fiends
        Story.killQuest(8566, "dagerecruit", "Bloodfiend");

        //Unstable Energies
        Story.killQuest(8567, "dagerecruit", "Bloodfiend");

        //Plant the Bombs
        Story.mapItemQuest(8568, "dagerecruit", 9887, 4);

        //Those Infernal Fiends
        Story.killQuest(8569, "dagerecruit", "Infernal Fiend");

        //Defeat Smaras
        Story.killQuest(8570, "dagerecruit", "Smaras");

        //Understanding Yokai
        Story.killQuest(8571, "dagerecruit", "Funa-yurei");

        // Covering Our Scent
        if (!Story.questProgression(8572)) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAccept(8572);
            Core.huntMonster("dagerecruit", "Funa-yurei", "Yokai Energy", 4);
            Story.mapItemQuest(8572, "dagerecruit", 9888, 4);
            Core.equipClass(ClassType.Solo);
        }

        //Can't Escape the Shadows
        Story.killQuest(8573, "dagerecruit", "Shadow Clone");

        //Last of the Defenses
        Story.killQuest(8574, "dagerecruit", "Shadow Clone");

        // Defeat Hebimaru
        if (!Story.questProgression(8575)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(8575);
            Core.huntMonster("dagerecruit", "Hebimaru", "Hebimaru Defeated");
            Core.ensureComplete(8575);
        }
        // Scorched Earth
        if (!Story.questProgression(8576)) {
            Core.ensureAccept(8576);
            Core.killMonster("dagerecruit", "Enter", "Spawn", "Dreadfiend", "Dreadfiend Defeated", 6);
            Core.huntMonster("dagerecruit", "Dark Makai", "Dark Makai Defeated", 6);
            Core.huntMonster("dagerecruit", "Bloodfiend ", "Bloodfiend Defeated", 6);
            Core.huntMonster("dagerecruit", "Infernal Fiend", "Infernal Fiend Defeated", 6);
            Core.ensureComplete(8576);
        }

        // Nation Badges / Mega Nation BadgesDreadfiend
        if (!Story.questProgression(8585)) {
            Core.ensureAccept(8585);
            Core.killMonster("darkwarlegion", "Enter", "Spawn", "Dreadfiend", "Dreadfiend Defeated", 6);
            Core.ensureComplete(8585);
        }

        // A Nation Defeated
        if (!Story.questProgression(8586)) {
            Core.ensureAccept(8586);
            Core.killMonster("darkwarlegion", "Enter", "Spawn", "Dreadfiend", "Nation's Dread", 5);
            Core.ensureComplete(8586);
        }

        // ManSlayer? More Like ManSLAIN
        Story.killQuest(8587, "darkwarlegion", "Manslayer Fiend");

        // Defeat Dirtlicker
        Story.killQuest(8588, "darkwarlegion", "Dirtlicker");
    }
}

export default function main(): void {
    const script = new DageRecruitStory();
    Core.setOptions();

    script.completeDageRecruit();

    Core.setOptions(false);
}
