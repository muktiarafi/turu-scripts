/*
name: Senlin-Mas's Quests
description: Completes Senlin-Mas's Quests in akibacny.
tags: seasonal, yokai, akibacny, akiba new year, story, senlin-mas
*/
// Port of Scripts/Seasonal/AkibaNewYear/SenlinMas.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();
const Farm = new CoreFarms();

export class SenlinMas {
    storyline(): void {
        if (Core.isCompletedBefore(3335) || !Core.isSeasonalMapActive("akibacny")) {
            return;
        }

        Story.preLoad(this.storyline);

        Farm.experience(50);
        Core.equipClass(ClassType.Farm);

        // Prove Yourself  3321
        Story.killQuest(3321, "yokairiver", "Kappa Ninja");

        // Culling the Corruption 3322
        Story.killQuest(3322, "akibacny", ["Xingzhi", "Lingzhi"]);

        // The Core of the Problem 3323
        Story.killQuest(3323, "akibacny", "Lingzhi");

        // Essentially Pure 3324
        Story.killQuest(3324, "pines", "Red Shell Turtle");

        // Salve-ation 3325
        Story.mapItemQuest(3325, "akibacny", 2448, 6);

        // Not So Much 3326
        Story.killQuest(3326, "pines", "Pine Troll");

        // Berry Sturdy 3327
        Story.killQuest(3327, "farm", "Treeant");

        // Oil of... what? 3328
        Story.killQuest(3328, "faerie", "Chainsaw Sneevil");

        // No One Likes Taking Medicine 3329
        Story.killQuest(3329, "akibacny", "Lingzhi");

        // Nip it in the Bud 3330
        Story.killQuest(3330, "akibacny", "Lingzhi");

        // Finding Yaomo 3331
        Story.mapItemQuest(3331, "akibacny", 2449, 1);

        // Sort of Like a Keycard 3332
        Story.killQuest(3332, "akibacny", "Lingzhi");

        // Defeat Yaomo 3333
        Core.equipClass(ClassType.Solo);
        Story.killQuest(3333, "akibacny", "Yaomo");
        Core.equipClass(ClassType.Farm);

        // Mushroom Compost 3334
        Story.killQuest(3334, "akibacny", "Lingzhi");

        // Tainted Qi 3335
        Story.killQuest(3335, "akibacny", "Xingzhi");

        /*
        these are unlocked by default and dont need the rest
        // // Shushunned 3336
        // Story.KillQuest(3336, "akibacny", "Shushen");

        // // Tainted Hearts 3337
        // Story.KillQuest(3337, "akibacny", "Hoku");

        // // Corrupt Collection 3338
        // Story.KillQuest(3338, "akibacny", new[] { "Lingzhi", "Xingzhi", "Hoku", "Shushen" });

        // // Cute Lil Devils 3339
        // Story.KillQuest(3339, "akibacny", "Mogui");

        // // Little Ghosts 3340
        // Story.KillQuest(3340, "akibacny", new[] { "Shushen", "Mogui" });

        // // Defeat Ultra Yaomo 3341
        // Story.KillQuest(3341, "akibacny", "Ultra Yaomo");
        */
    }
}

export default function main(): void {
    const script = new SenlinMas();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
