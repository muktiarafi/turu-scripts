/*
name: Exaltia Tower Story
description: This will finish the Exaltia Tower story.
tags: story, quest, exaltia, exaltia tower, timeinn, dot
*/
// Port of Scripts/Story/ExaltiaTower.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class ExaltiaTower {
    storyLine(): void {
        if (Core.isCompletedBefore(8151)) {
            return;
        }

        Story.preLoad(this.storyLine);

        Core.addDrop("Exalted Node", "Exalted Forgemetal", "Exalted Relic Piece", "Exalted Artillery Shard");

        //Unlocking the Antechamber 8146
        if (!Story.questProgression(8146)) {
            Core.ensureAccept(8146);
            Core.huntMonster("timeinn", "Ice Elemental", "Key Ice Essence", 3);
            Core.huntMonster("timeinn", "Fire Elemental", "Key Fire Essence", 3);
            Core.ensureComplete(8146);
        }

        //Ezrajal 8147
        Story.killQuest(8147, "timeinn", "Ezrajal");

        //Unlocking the Reliquary 8148
        if (!Story.questProgression(8148)) {
            Core.ensureAccept(8148);
            Core.huntMonster("timeinn", "Nature Elemental", "Key Nature Essence", 3);
            Core.huntMonster("timeinn", "Wind Elemental", "Key Wind Essence", 3);
            Core.ensureComplete(8148);
        }

        //The Warden 8149
        Story.killQuest(8149, "timeinn", "The Warden");

        //Unlocking the Apex 8150
        if (!Story.questProgression(8150)) {
            Core.ensureAccept(8150);
            Core.huntMonster("timeinn", "Energy Elemental", "Key Energy Essence", 3);
            Core.huntMonster("timeinn", "Water Elemental", "Key Water Essence", 3);
            Core.ensureComplete(8150);
        }

        //The Engineer 8151
        Story.killQuest(8151, "timeinn", "The Engineer");
    }
}

export default function main(): void {
    const script = new ExaltiaTower();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
