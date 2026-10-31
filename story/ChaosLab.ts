/*
name: Chaoslab Story
description: Finishes the story of chaos lab
tags: story, questline, chaos, alina, artix, cysero, beleen, dage, hamster
*/
// Port of Scripts/Story/ChaosLab.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class ChaosLabStory {
    chaosLabQuests(): void {
        if (Core.isCompletedBefore(3567)) {
            return;
        }

        Story.preLoad(this.chaosLabQuests);

        //Survey the Damage 3556
        Story.mapItemQuest(3556, "chaoslab", [2704, 2706, 2707, 2708]);

        //Defeat Chaorrupted Alina 3557
        Core.equipClass(ClassType.Farm);
        Story.killQuest(3557, "chaoslab", "Chaos Alina");

        //Gather the Crystals 3558
        Story.killQuest(3558, "chaoslab", "Chaorrupted Moglin");

        //Cleanse Alina 3559
        Story.killQuest(3559, "chaoslab", "Chaos Alina");

        //Gather More Cystals 3560
        Story.killQuest(3560, "chaoslab", "Chaorrupted Moglin");

        //Cleanse Beleen 3561
        Story.killQuest(3561, "chaoslab", "Chaos Beleen");

        //Cleanse Cysero 3562
        Story.killQuest(3562, "chaoslab", "Chaos Cysero");

        //Cleanse Artix 3563
        Story.killQuest(3563, "chaoslab", "Chaos Artix");

        //Ficus Your Powers 3564
        Story.mapItemQuest(3564, "chaoslab", 2705);

        //Face the Hamster 3565
        Story.killQuest(3565, "chaoslab", "Chaotic Server Hamster");

        //Cleaning Up 3566
        if (!Story.questProgression(3566)) {
            Core.ensureAccept(3566);
            Core.huntMonster("chaoslab", "Chaos Alina", "Alina Cleansed", 1);
            Core.huntMonster("chaoslab", "Chaos Beleen", "Beleen Cleansed", 1);
            Core.huntMonster("chaoslab", "Chaos Cysero", "Cysero Cleansed", 1);
            Core.huntMonster("chaoslab", "Chaos Artix", "Artix Cleansed", 1);
            Core.ensureComplete(3566);
        }

        //MORE HAMSTER? 3567
        Story.killQuest(3567, "chaoslab", "Ultra Chaotic Server Hamster");
    }
}

export default function main(): void {
    const script = new ChaosLabStory();
    Core.setOptions();

    script.chaosLabQuests();

    Core.setOptions(false);
}
