/*
name: Battle Concert Class Quests
description: does the battle concert even quests for the classes.
tags: concert, metal necro, doom metal necro, neo metal necro
*/
// Port of Scripts/Other/Concerts/BattleConcert2023.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class BattleConcertClassQuests {
    battleConcertQuests(): void {
        if (Core.isCompletedBefore(9327)) {
            return;
        }

        Story.preLoad(this.battleConcertQuests);

        // Soulless Paps 9317
        Story.killQuest(9317, "skulldome", "Photoghoulpher");

        // Vanquished from the Premises 9318
        Story.killQuest(9318, "skullhall", "Necroupie");

        // Clear Space, Clear Mind  9319
        Story.mapItemQuest(9319, "skullhall", [11948, 11949]);
        Story.mapItemQuest(9319, "skullhall", 11950, 6);

        // Rusty Metal 9320
        Story.killQuest(9320, "skullhall", "Armored Zombie");

        // Concert Crush 9324
        if (!Story.questProgression(9324)) {
            Core.ensureAccept(9324);
            Core.huntMonster("skullarena", "Photoghoulpher", "Broken Polaroid", 3);
            Core.huntMonster("skullarena", "Necroupie", "Confiscated Ticket", 3);
            Core.ensureComplete(9324);
        }

        // Hashtag Dead Ugly 9322
        Story.killQuest(9322, "skullhall", "Photoghoulpher");

        // Ghoulish Fan Culture 9323
        Story.killQuest(9323, "skullhall", "Necroupie");

        // No Honor Among Rockers 9321
        if (!Story.questProgression(9321)) {
            Core.ensureAccept(9321);
            Core.huntMonster("skullarena", "Laryn", "Laryn's Mic");
            Core.huntMonster("skullarena", "Bellum", "Bellum's Tooth Pick");
            Core.ensureComplete(9321);
        }

        // Musical Altercations 9325
        if (!Story.questProgression(9325)) {
            Core.ensureAccept(9325);
            Core.huntMonster("skullarena", "Pit", "Pit's Moglinhide Guitar");
            Core.huntMonster("skullarena", "Medullos", "Medullos' Bony Drumstick");
            Core.ensureComplete(9325);
        }

        // Lacking Brain Substance 9326
        if (!Story.questProgression(9326)) {
            Core.ensureAccept(9326);

            Core.huntMonster("brainmeat", "Larythesia", "Laryn's Shiny Mic");
            Core.huntMonster("brainmeat", "Belluthesia", "Bellum's Shiny Toothpick");
            Core.huntMonster("brainmeat", "Pitesthesia", "Pit's Shiny Guitar");
            Core.huntMonster("brainmeat", "Medullothesia", "Medullos' Shiny Drumstick");
            Core.ensureComplete(9326);
        }

        // Farming Quest
        // Revive the Encore 9327
        Core.addDrop("Bone Pick");
        Story.killQuest(9327, "brainmeat", "Brain Matter");

        //Class Quest
        // Doom Metal Necro Class 9328
    }
}

export default function main(): void {
    const script = new BattleConcertClassQuests();
    Core.setOptions();

    script.battleConcertQuests();

    Core.setOptions(false);
}
