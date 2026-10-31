/*
name: Seraphic War
description: This will finish the Seraphic War quest.
tags: story, quest, legion, seraphic-war
*/
// Port of Scripts/Story/Legion/SeraphicWar.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class SeraphicWar_Story {
    seraphicWar_Questline(): void {
        if (Core.isCompletedBefore(6245)) {
            return;
        }

        Story.preLoad(this.seraphicWar_Questline);

        //Get the Parts
        if (!Story.questProgression(6238)) {
            Core.ensureAccept(6238);
            Core.huntMonster("worldsoul", "Dwakel Infiltrator", "Dwakel Defeated", 6);
            Core.huntMonster("worldsoul", "Dwakel Infiltrator", "Void Cortex", 1);
            Core.huntMonster("worldsoul", "Dwakel Infiltrator", "Paradox Processor", 1);
            Core.huntMonster("worldsoul", "Dwakel Infiltrator", "Thermal Vent", 1);
            Core.ensureComplete(6238);
        }
        //Get the Water
        Story.killQuest(6239, "worldsoul", "Divine Water Elemental");
        //Get the Fire
        Story.killQuest(6240, "worldsoul", "Divine Fire Elemental");
        //Gather Armaments
        if (!Story.questProgression(6241)) {
            Core.ensureAccept(6241);
            Core.getMapItem(5681, 3, "worldsoul");
            Core.huntMonster("worldsoul", "Skeletal Squatter", "Iron Lightblade", 6);
            Core.ensureComplete(6241);
        }
        //Plutonium For Power
        Story.killQuest(6242, "worldsoul", "Radioactive Hydra");
        //Defeat the Undead
        if (!Story.questProgression(6243)) {
            Core.ensureAccept(6243);
            Core.getMapItem(5680, 1, "worldsoul");
            Core.huntMonster("worldsoul", "Legion Dreadmarch", "Legion Soldiers Defeated", 20);
            Core.ensureComplete(6243);
        }
        //Remove the Ward
        if (!Story.questProgression(6244)) {
            Core.ensureAccept(6244);
            Core.huntMonster("worldsoul", "Legion Dreadmarch", "Legion Amulets", 3);
            Story.mapItemQuest(6244, "worldsoul", 5682);
        }
        //Defeat the Guardian
        Story.killQuest(6245, "worldsoul", "Core Guardian");
    }
}

export default function main(): void {
    const script = new SeraphicWar_Story();
    Core.setOptions();

    script.seraphicWar_Questline();

    Core.setOptions(false);
}
