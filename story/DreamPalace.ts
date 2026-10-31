/*
name: Dream Palace Story
description: This will finish the Dream Palace Story.
tags: story, quest, dream-palace
*/
// Port of Scripts/Story/DreamPalace.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class DreamPalace {
    storyLine(): void {
        if (Core.isCompletedBefore(7874)) {
            return;
        }

        Story.preLoad(this.storyLine);

        // Potent Ruby 7869
        if (!Story.questProgression(7869)) {
            Core.ensureAccept(7869);
            Core.huntMonster("dreampalace", "Flaming Harpy", "Monster Slain", 6);
            Core.huntMonster("dreampalace", "Golmoth", "Potent Ruby", 1);
            Core.ensureComplete(7869);
        }

        // Mystic Sapphire 7870
        if (!Story.questProgression(7870)) {
            Core.ensureAccept(7870);
            Core.huntMonster("dreampalace", "Zelkur", "Mystic Sapphire", 1);
            Core.huntMonster("dreampalace", "Lotus Spider", "Monster Slain", 6);
            Core.ensureComplete(7870);
        }

        // Living Emerald 7871
        if (!Story.questProgression(7871)) {
            Core.ensureAccept(7871);
            Core.huntMonster("dreampalace", "Palace Hound", "Monster Slain", 6);
            Core.huntMonster("dreampalace", "Gazeroth", "Living Emerald", 1);
            Core.ensureComplete(7871);
        }

        // Ethereal Diamond 7872
        if (!Story.questProgression(7872)) {
            Core.ensureAccept(7872);
            Core.huntMonster("dreampalace", "Zal", "Ethereal Diamond", 1);
            Core.huntMonster("dreampalace", "Ethereal Harpy", "Monster Slain", 6);
            Core.ensureComplete(7872);
        }

        // Open the Door 7873
        Story.mapItemQuest(7873, "dreampalace", 7944);

        // Zahad 7874
        if (!Story.questProgression(7874)) {
            Core.ensureAccept(7874);
            Core.huntMonster("dreampalace", "Guardian Hound", "Monster Slain", 6);
            Core.huntMonster("dreampalace", "Zahad", "Zahad's Golden Orb", 1);
            Core.ensureComplete(7874);
        }
    }
}

export default function main(): void {
    const script = new DreamPalace();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
