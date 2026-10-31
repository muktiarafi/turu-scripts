/*
name: PockeyMogs Story
description: Compeletes the PockeyMogs Story
tags: lim, pockeymogs,
*/
// Port of Scripts/Story/PockeymogsStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class PockeyMogsStory {
    pockeyMogs(): void {
        if (Core.isCompletedBefore(5272)) {
            return;
        }

        Story.preLoad(this.pockeyMogs);

        //Mogzard 5261
        Core.equipClass(ClassType.Farm);
        Story.killQuest(5261, "greenguardwest", "Mogzard");

        //Fishlin 5262
        Story.killQuest(5262, "river", "Fishlin");

        //Groglin 5263
        Story.killQuest(5263, "sewer", "Groglin");

        //Mogdrake 5264
        Story.killQuest(5264, "willowcreek", "Mogdrake");

        //Mucklin 5265
        Story.killQuest(5265, "swordhaven", "Mucklin");

        //Linix 5266
        Story.killQuest(5266, "arcangrove", "Linix");

        //Pockey-Chew 5267
        Story.mapItemQuest(5267, "crossroads", 4613);

        //Pukasnooze vs the Moglurker 5268
        Story.killQuest(5268, "pockeymogs", "Moglurker");

        //Pukasnooze vs Zaplin 5269
        Story.killQuest(5269, "pockeymogs", "Zaplin");

        //Pukasnooze vs Blood Moggot 5270
        Story.killQuest(5270, "pockeymogs", "Blood Moggot");

        //Pukasnooze vs Flamog 5271
        Story.killQuest(5271, "pockeymogs", "Flamog");

        //Pukasnooze vs Vizally 5272
        Story.killQuest(5272, "pockeymogs", "Vizally");
    }
}

export default function main(): void {
    const script = new PockeyMogsStory();
    Core.setOptions();

    script.pockeyMogs();
    Core.setOptions(false);
}
