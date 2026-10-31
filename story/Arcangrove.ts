/*
name: Arcangrove Story
description: This will finish the Arcangrove story.
tags: story, quest, arcangrove, 13-lords-of-chaos
*/
// Port of Scripts/Story/Arcangrove.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";
import { Core13LoC } from "./lordsofchaos/Core13LoC";

const Story = new CoreStory();
const LoC = new Core13LoC();

export class Arcangrove {
    gravelynandVictoria(): void {
        if (Core.isCompletedBefore(3375)) {
            return;
        }

        LoC.ledgermayne();
        LoC.escherion();
        LoC.vath();

        Story.preLoad(this.gravelynandVictoria);

        // Gravelyn and Victoria Quests

        //Like Fireflies 3371
        Story.killQuest(3371, "arcangrove", "Chaos Sprites");

        //Like Siege Engines 3372
        Story.killQuest(3372, "arcangrove", "Gorillaphant");

        //Plants vs Chaos 3373
        if (!Story.questProgression(3373)) {
            Core.ensureAccept(3373);
            Core.getMapItem(2505, 6, "arcangrove");
            Core.huntMonster("arcangrove", "Seed Spitter", "Spitter Seed", 6);
            Core.ensureComplete(3373);
        }

        //Like Aloe... With Teeth 3374
        Story.killQuest(3374, "arcangrove", "Seed Spitter");

        //Kinda Like a Giant Bubble 3375
        Story.mapItemQuest(3375, "arcangrove", [2514, 2515, 2516, 2517]);
    }
}

export default function main(): void {
    const script = new Arcangrove();
    Core.setOptions();

    script.gravelynandVictoria();

    Core.setOptions(false);
}
