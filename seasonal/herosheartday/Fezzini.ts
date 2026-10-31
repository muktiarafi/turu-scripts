/*
name: Fezzini Story
description: This will complete the Fezzini story quest.
tags: story, quest, seasonal, fezzini, hero, heart
*/
// Port of Scripts/Seasonal/HerosHeartDay/Fezzini.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class FezziniStory {
    fezziniScript(): void {
        if (!Core.isSeasonalMapActive("fezzini")) {
            return;
        }
        if (Core.isCompletedBefore(7389)) {
            return;
        }

        Story.preLoad(this.fezziniScript);

        //The Dancing Dead
        if (!Story.questProgression(7377)) {
            Core.ensureAccept(7377);
            Core.killMonster("fezzini", "Enter", "Spawn", "Zombie Dancer", "Zombie Defeated", 10);
            Core.ensureComplete(7377);
        }

        //Rats n' Goo
        Story.killQuest(7378, "fezzini", ["Street Rat", "Zombie Goo"]);

        //Get a Clue
        if (!Story.questProgression(7379)) {
            Core.ensureAccept(7379);
            Core.killMonster("fezzini", "Enter", "Spawn", "Zombie Dancer", "A Clue?", 10);
            Core.ensureComplete(7379);
        }

        //Find Lim
        Story.mapItemQuest(7380, "fezzini", 7100);

        //Bottle Time
        if (!Story.questProgression(7381)) {
            Core.ensureAccept(7381);
            Core.killMonster("fezzini", "Enter", "Spawn", "Zombie Dancer", "Little Bottle", 6);
            Core.ensureComplete(7381);
        }

        //Get Some Fur
        Story.killQuest(7382, "fezzini", ["Zombie Goo", "Street Rat"]);

        //Go Tell Beleen
        Story.mapItemQuest(7383, "fezzini", 7101);

        //Ask Around
        Story.mapItemQuest(7384, "fezzini", [7102, 7103, 7104, 7105, 7106]);

        //Zombie Invasion
        Story.killQuest(7385, "fezzini", "Zombie Dancer");

        //Castle Zombies
        Story.killQuest(7386, "fezzini", "Hostile Minion");

        //Warn the King and Queen
        Story.mapItemQuest(7387, "fezzini", 7107);

        //Monstrous Guards!
        Story.killQuest(7388, "fezzini", "Monstrous Guard");

        //It's Salvaza!
        Story.killQuest(7389, "fezzini", "Salvaza");
    }
}

export default function main(): void {
    const script = new FezziniStory();
    Core.setOptions();

    script.fezziniScript();

    Core.setOptions(false);
}
