/*
name: Willow Creek Story
description: This will finish the Willow Creek Story.
tags: story, quest, willow-creek
*/
// Port of Scripts/Story/WillowCreek.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class WillowCreek {
    storyLine(): void {
        Story.preLoad(this.storyLine);

        // Willow Creek 27
        if (!Story.questProgression(27)) {
            Core.ensureAccept(27);
            Core.huntMonster("forest", "Zardman Grunt", "Hideous Zard Tail", 5);
            Core.huntMonster("forest", "Boss Zardman", "Chieftain's Head", 1);
            Core.ensureComplete(27);
        }

        // Can you do it? 59
        if (!Story.questProgression(59)) {
            Core.ensureAccept(59);
            Core.huntMonster("willowcreek", "Mosquito", "Mosquito Wing", 5);
            Core.huntMonster("willowcreek", "Frogdrake", "Frogdrake's Feet", 5);
            Core.ensureComplete(59);
        }

        // Backyard Zards 22
        Story.killQuest(22, "willowcreek", "Frogzard");

        // Attic Spiders 24
        Story.killQuest(24, "willowcreek", "Spider");

        // Storage Speyeders 58
        Story.killQuest(58, "willowcreek", "Speyeder");

        // Garden Snails 23
        Story.killQuest(23, "willowcreek", "Snail");

        // Dwakel Info 1219
        Story.mapItemQuest(1219, "willowcreek", 14);

        // Found Clue in Farmer's House 1599
        Story.mapItemQuest(1599, "willowcreek", 15);

        // Tempestuous Times 26
        Story.mapItemQuest(26, "willowcreek", 16);

        // The Bone? 25
        Story.killQuest(25, "willowcreek", "Werewolf");
    }
}

export default function main(): void {
    const script = new WillowCreek();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
