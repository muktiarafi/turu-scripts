/*
name: Shinkansen Story
description: This will finish the Shinkansen Story.
tags: story, quest, shinkansen
*/
// Port of Scripts/Story/Shinkansen.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Shinkansen {
    storyline(): void {
        if (Core.isCompletedBefore(8124)) {
            return;
        }

        Story.preLoad(this.storyline);

        // Snack Run 8116
        if (!Story.questProgression(8116)) {
            Core.ensureAccept(8116);
            Core.getMapItem(8496, 3, "Shinkansen");
            Core.huntMonster("shinkansen", "Temptation 1", "Temptations Kicked", 3);
            Core.ensureComplete(8116);
        }

        // Clean Up Crew 8117
        Story.killQuest(8117, "Shinkansen", "Trash Pile");

        // Asking "Nicely" 8118
        Story.killQuest(8118, "Shinkansen", "Civilian");

        // Get a Ticket 8119 & Buy Tickets 8120
        if (!Story.questProgression(8119)) {
            if (!Core.checkInventory("Shinkansen Tickets", 2)) {
                Core.addDrop("Shinkansen Tickets");

                Core.registerQuests(8118);
                while (!Core.checkInventory("Credits", 8)) {
                    Core.huntMonster("Shinkansen", "Civilian", 'Credits "Donated"', 4);
                }
                Core.cancelRegisteredQuests();

                Core.chainComplete(8120);
                bot.wait.forPickup("Shinkansen Tickets");
            }
            Core.chainComplete(8119);
        }

        // Defeat the Soldiers  8121
        Story.killQuest(8121, "Shinkansen", "Crystallis Soldier");

        // Shinkansen Key 8122
        Story.killQuest(8122, "Shinkansen", "Crystallis Soldier");

        // The Twin Saints 8123
        if (!Story.questProgression(8123)) {
            Core.ensureAccept(8123);
            Core.huntMonster("shinkansen", "Saint Apa", "Saint Apa Defeated", 1);
            Core.huntMonster("shinkansen", "Saint Eta", "Saint Eta Defeated", 1);
            Core.ensureComplete(8123);
        }

        // Sometimes Losing is Winning 8124
        Story.killQuest(8124, "Shinkansen", "Crystallis Soldier");
    }
}

export default function main(): void {
    const script = new Shinkansen();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
