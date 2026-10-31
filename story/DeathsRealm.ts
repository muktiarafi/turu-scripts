/*
name: Death's Realm Story
description: This will finish the storyline in /deathsrealm.
tags: story, quest, death, deaths, realm, deathsrealm, deaths realm
*/
// Port of Scripts/Story/DeathsRealm.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class DeathsRealm {
    storyLine(): void {
        if (Core.isCompletedBefore(2430)) {
            return;
        }

        Story.preLoad(this.storyLine);

        Core.equipClass(ClassType.Farm);

        // Time is Running Out (2421)
        Story.killQuest(2421, "swordhavenundead", "Skeletal Soldier");

        // Thief of Hours (2422)
        if (!Story.questProgression(2422)) {
            Core.ensureAccept(2422);
            Core.killMonster("river", "Field1", "Left", "*", "Shiny Pearls", 7);
            Core.killMonster("lair", "Hole", "Left", "*", "Dragon Claws", 4);
            Core.killMonster("citadel", "m6", "Left", "*", "Tasty Cakes", 3);
            Core.huntMonster("boxes", "Sneeviltron", "Massive Sneevil Box");
            Core.killMonster("orecavern", "r2", "Left", "*", "Bag of Silver", 7);
            Core.huntMonster("creatures", "Red Bird", "Red Herring");
            Core.ensureComplete(2422);
        }

        // Death-dealing Blows (2423)
        if (!Story.questProgression(2423)) {
            Core.logger(
                'You need to get 5 kills in /doomarena or /bludrutbrawl for [2423] "Death-dealing Blows" quest, run the script again when you\'ve completed the quest.',
            );
            return;
        }

        // Fear the Reaper (2424)
        Story.killQuest(2424, "deathsrealm", "Undead Mage");

        // Master Death's Realm (2425)
        if (!Story.questProgression(2425)) {
            Core.ensureAccept(2425);
            Core.getMapItem(1485, 1, "deathsrealm");
            Core.huntMonster("deathsrealm", "Undead Mage", "Underworld Creature Slain", 10);
            Core.ensureComplete(2425);
        }

        // Real Live Hero-Training (2426)
        Story.mapItemQuest(2426, "trainers", 1491, undefined, { autoCompleteQuest: false });

        // The Living Library (2427)
        Story.killQuest(2427, "elemental", "Mana Imp");

        // Understanding Xhar Morghuil (2428)
        Story.mapItemQuest(2428, "deathsrealm", [1487, 1488, 1489]);

        // Door to Eternity (2429)
        Story.mapItemQuest(2429, "deathsrealm", 1490);

        // Death vs Death (2430)
        if (!Core.isCompletedBefore(2430)) {
            Core.equipClass(ClassType.Solo);
            Story.killQuest(2430, "deathsrealm", "Death Alive");
            Core.equipClass(ClassType.Farm);
        }
    }
}

export default function main(): void {
    const script = new DeathsRealm();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
