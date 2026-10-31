/*
name: DarkDungeon
description: This script finish all dark dungeon quests storyline in /darkdungeon
tags: dark, dungeon, story, line, mirror, drakath
*/
// Port of Scripts/Story/DarkDungeon.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class DarkDungeon {
    storyline(): void {
        if (Core.isCompletedBefore(3543)) {
            return;
        }

        Story.preLoad(this.storyline);
        //Quiz the Locals 3538
        Story.mapItemQuest(3538, "darkdungeon", [2671, 2672, 2673]);

        //Slay the Minions 3539
        Story.killQuest(3539, "darkdungeon", "Dungeon Minion");

        //Free the Fallen 3540
        Story.killQuest(3540, "darkdungeon", "Dungeon Paladin");

        //Shining a Light 3541
        if (!Story.questProgression(3541)) {
            Core.ensureAccept(3541);
            Core.getMapItem(2674, 4, "darkdungeon");
            Core.huntMonster("darkdungeon", "Shadow Imp", "Shadow Dispelled", 10);
            Core.ensureComplete(3541);
        }

        //Break the Doors Down 3542
        Story.mapItemQuest(3542, "darkdungeon", 2679, 5);

        //The Best vs The Beast 3543
        Story.killQuest(3543, "darkdungeon", "Cockatrice");
    }
}

export default function main(): void {
    const script = new DarkDungeon();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
