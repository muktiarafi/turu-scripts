/*
name: Ravenscar Story
description: This will finish the Ravenscar Story quests.
tags: story, quest, legion, ravenscar, raven scar, raven, scar, dage
*/
// Port of Scripts/Story/Legion/Ravenscar.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Ravenscar {
    storyline(): void {
        if (Core.isCompletedBefore(2907)) {
            return;
        }

        Story.preLoad(this.storyline);

        Core.equipClass(ClassType.Farm);

        // Hunt for the Amulet (2901)
        Story.mapItemQuest(2901, "ravenscar", 1767);

        // Slay the Necromancer's Soldiers (2902)
        if (!Story.questProgression(2902)) {
            Core.ensureAccept(2902);
            Core.huntMonster("ravenscar", "Restless Undead", "Crumpled Book Page", 1);
            Core.huntMonster("ravenscar", "Restless Undead", "Undead Slain", 6);
            Core.ensureComplete(2902);
        }

        // The Book of Portals (2903)
        Story.mapItemQuest(2903, "ravenscar", 1768);

        // Battle for a Lost Love (2904)
        Story.killQuest(2904, "ravenscar", "Restless Undead");

        // Into the Blight (2905)
        Story.killQuest(2905, "ravenscar", "Undead Soldier");

        // Gateway Guardian (2906)
        Story.killQuest(2906, "ravenscar", "Shadowman");

        // Blightbringer's Doom (2907)
        Story.mapItemQuest(2907, "ravenscar", 1769);
    }
}

export default function main(): void {
    const script = new Ravenscar();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
