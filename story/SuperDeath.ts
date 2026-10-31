/*
name: Super Death Story
description: This will finish the Super Death Story.
tags: story, quest, superdeath
*/
// Port of Scripts/Story/SuperDeath.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class SuperDeath {
    storyLine(): void {
        if (Core.isCompletedBefore(8032)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //SMASH a Path 8015
        Story.killQuest(8015, "SuperDeath", "Shadow Cave Yeti");

        //Cold Open the Portal 8016
        if (!Story.questProgression(8016)) {
            Core.ensureAccept(8016);
            Core.getMapItem(8330, 1, "SuperDeath");
            Core.huntMonster("superdeath", "Shadow Cave Yeti", "HeroSmash Essences", 4);
            Core.huntMonster("superdeath", "Shadow Lava Crab", "Volcano Essences", 2);
            Core.huntMonster("superdeath", "Shadow Collector", "Mall Essence", 1);
            Core.huntMonster("superdeath", "Shadow Cave Yeti", "Ingiru Essence", 1);
            Core.ensureComplete(8016);
        }

        //VolcaNO Thank You 8017
        Story.killQuest(8017, "SuperDeath", "Igneous Lava Crab");

        //Return to Cinder 8018
        Story.killQuest(8018, "SuperDeath", "Cinder Bender");

        //Hottica 8019
        Story.killQuest(8019, "SuperDeath", "Hottica");

        //Liquidate Liberate 8020
        Story.killQuest(8020, "SuperDeath", "Slime Collector");

        //Lord of the Mall 8021
        Story.killQuest(8021, "SuperDeath", "Slime Lord");

        //Electina 8022
        Story.killQuest(8022, "SuperDeath", "Electina");

        //Carpool Lane 8023
        Story.killQuest(8023, "SuperDeath", "Rider");

        //The BlasterMaster 8024
        Story.killQuest(8024, "SuperDeath", "Blaster Master");

        //General Smash 8025
        Story.killQuest(8025, "SuperDeath", "General Smash");

        //Left In-giRuins 8026
        Story.killQuest(8026, "SuperDeath", "Cave Yeti");

        //Rock Me Khali May-eus 8027
        Story.killQuest(8027, "SuperDeath", "Khali May");

        //Charries 8028
        Story.killQuest(8028, "SuperDeath", "Charries");

        //Shadow Realm Cleansing 8029
        Story.killQuest(8029, "SuperDeath", "Shadow Cave Bandit");

        //Forging the Shadow Key 8030
        if (!Story.questProgression(8030)) {
            Core.ensureAccept(8030);
            Core.huntMonster("superdeath", "Shadow Goo Pup", "Key Fragment #4", 1);
            Core.huntMonster("superdeath", "Shadow Mutant", "Key Fragment #1", 1);
            Core.huntMonster("superdeath", "Shadow Scorpion", "Key Fragment #2", 1);
            Core.huntMonster("superdeath", "Shadow Cave Bandit", "Key Fragment #3", 1);
            Core.ensureComplete(8030);
        }

        //Charge the Key 8031
        if (!Story.questProgression(8031)) {
            Core.ensureAccept(8031);
            Core.huntMonster("superdeath", "Hottica", "Hottica Key Charge", 1);
            Core.huntMonster("superdeath", "Electina", "Electina Key Charge", 1);
            Core.huntMonster("superdeath", "General Smash", "General Smash Key Charge", 1);
            Core.huntMonster("superdeath", "Charries", "Charries Key Charge", 1);
            Core.ensureComplete(8031);
        }

        //Super Death 8032
        Story.killQuest(8032, "SuperDeath", "Super Death");
    }
}

export default function main(): void {
    const script = new SuperDeath();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
