/*
name: Guru Story
description: This will finish the Guru Story.
tags: story, quest, guru
*/
// Port of Scripts/Story/Guru.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Guru {
    storyLine(): void {
        if ((Core.isMember && Core.isCompletedBefore(53)) || (!Core.isMember && Core.isCompletedBefore(52))) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Golden Shrooms 47
        Story.mapItemQuest(47, "Guru", 20, 10);

        //Blue Feathers 48
        Story.killQuest(48, "Guru", "Trobble");

        //Flying Tails 49
        Story.killQuest(49, "Guru", "LeatherWing");

        //Mixing Pot 50
        if (!Story.questProgression(50)) {
            Core.join("guru");
            Core.ensureAccept(50);
            Core.logger("Buggy quest >> this will kill all 3 guru chests until it gets the `Cauldron`");
            while (!bot.shouldExit && !Core.checkInventory(356)) {
                for (const cell of ["Field2", "Field3", "Field4"]) {
                    Core.jump(cell);
                    bot.kill.monster("Guru Chest");
                    if (bot.tempInv.contains(356)) {
                        break;
                    }
                }
            }
            Core.ensureComplete(50);
        }

        //Hungry for a Recipe 51
        Story.killQuest(51, "River", "River Fishman");

        //Missing Ingredient 52
        Story.killQuest(52, "Guru", "Wisteria");

        if (Core.isMember) {
            //Delicious Ingredient 53
            Story.killQuest(53, "Guru", "Wisteria");
        }
    }
}

export default function main(): void {
    const script = new Guru();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
