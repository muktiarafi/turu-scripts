/*
name: World Soul
description: This will finish the World Soul quest.
tags: story, quest, legion, world-soul
*/
// Port of Scripts/Story/Legion/WorldSoul.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class WorldSoul {
    worldSoulQuests(): void {
        if (Core.isCompletedBefore(6245)) {
            return;
        }

        Story.preLoad(this.worldSoulQuests);

        if (!Core.isCompletedBefore(6245)) {
            Core.ensureAccept(6238);
            Core.huntMonster("worldsoul", "Dwakel Infiltrator", "Void Cortex");
            Core.huntMonster("worldsoul", "Dwakel Infiltrator", "Paradox Processor");
            Core.huntMonster("worldsoul", "Dwakel Infiltrator", "Thermal Vent");
            Core.huntMonster("worldsoul", "Dwakel Infiltrator", "Dwakel Defeated", 6);
            Core.ensureComplete(6238);
        }
        Story.killQuest(6239, "worldsoul", "Divine Water Elemental");

        Story.killQuest(6240, "worldsoul", "Divine Fire Elemental");

        if (!Story.questProgression(6241)) {
            Core.ensureAccept(6241);
            Core.getMapItem(5681, 3, "worldsoul");
            Core.huntMonster("worldsoul", "Skeletal Squatter", "Iron Lightblade", 6);
            Core.ensureComplete(6241);
        }

        Story.killQuest(6242, "worldsoul", "Radioactive Hydra");

        if (!Story.questProgression(6243)) {
            Core.ensureAccept(6243);
            Core.getMapItem(5680, 1, "worldsoul");
            Core.huntMonster("worldsoul", "Legion Dreadmarch", "Legion Soldiers Defeated", 20);
            Core.ensureComplete(6243);
        }

        if (!Story.questProgression(6244)) {
            Core.ensureAccept(6244);
            Core.getMapItem(5682, 1, "worldsoul");
            Core.huntMonster("worldsoul", "Legion Dreadmarch", "Legion Amulets", 3);
            Core.ensureComplete(6244);
        }

        Story.killQuest(6245, "worldsoul", "Core Guardian");
    }
}

export default function main(): void {
    const script = new WorldSoul();
    Core.setOptions();

    script.worldSoulQuests();

    Core.setOptions(false);
}
