/*
name: Sword Haven Maze
description: This will finish the ShadowVoid Story.
tags: story, quest, Sword Haven Maze, SwordHavenMaze
*/
// Port of Scripts/Story/SwordHavenMaze.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class SwordHavenMaze {
    swordHavenMazeQuests(): void {
        if (Core.isCompletedBefore(10809)) {
            return;
        }

        Story.preLoad(this.swordHavenMazeQuests);

        //#region Useable Monsters
        const UseableMonsters = [
            "Noble Ghost", // UseableMonsters[0],
            "Feral Boar", // UseableMonsters[1],
            "Undead Prisoner", // UseableMonsters[2],
            "Extinction Artist", // UseableMonsters[3],
            "Aficionado Cosima ", // UseableMonsters[4]
        ];
        //#endregion Useable Monsters
        // 10800 | Luxury Rubbish
        if (!Story.questProgression(10800)) {
            Story.mapItemQuest(10800, "swordhavenmaze", 15945);
        }

        // 10801 | Castaigne Cup
        if (!Story.questProgression(10801)) {
            Story.mapItemQuest(10801, "swordhavenmaze", 15946);
        }

        // 10802 | Dethrix Dollars
        if (!Story.questProgression(10802)) {
            Story.mapItemQuest(10802, "swordhavenmaze", 15947);
        }

        // 10803 | Nothing but Numbers
        if (!Story.questProgression(10803)) {
            Story.mapItemQuest(10803, "swordhavenmaze", 15948);
        }

        // 10804 | Call for Retrial
        if (!Story.questProgression(10804)) {
            Story.mapItemQuest(10804, "swordhavenmaze", 15949);
        }

        // 10806 | With Love
        if (!Story.questProgression(10806)) {
            Story.mapItemQuest(10806, "swordhavenmaze", 15950);
        }

        // 10807 | Reeking Rinds
        if (!Story.questProgression(10807)) {
            Story.mapItemQuest(10807, "swordhavenmaze", 15951);
        }

        // 10808 | Pig-ment
        if (!Story.questProgression(10808)) {
            Core.huntMonsterQuest(10808, ["swordhavenmaze", UseableMonsters[3], ClassType.Solo]);
        }

        // 10809 | Passing Passepied
        if (!Story.questProgression(10809)) {
            Core.huntMonsterQuest(10809, ["swordhavenmaze", UseableMonsters[4], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new SwordHavenMaze();
    Core.setOptions();

    script.swordHavenMazeQuests();

    Core.setOptions(false);
}
