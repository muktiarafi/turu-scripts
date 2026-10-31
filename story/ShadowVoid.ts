/*
name: Shadow Void Story
description: This will finish the ShadowVoid Story.
tags: story, quest, shadow-void
*/
// Port of Scripts/Story/ShadowVoid.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class ShadowVoid {
    shadowVoidQuests(): void {
        if (!bot.quests.isUnlocked(7123)) {
            Core.logger("Quests are locked You Should Finish Lords Of Chaos story script first");
            return;
        }
        if (Core.isCompletedBefore(7131)) {
            Core.logger("StoryLine Complete:   Shadowvoid");
            return;
        }

        Story.preLoad(this.shadowVoidQuests);

        //Pieces of Light 7123
        Story.killQuest(7123, "ShadowVoid", "Light Matter");

        //Cloak of Silk 7124
        Story.killQuest(7124, "ShadowVoid", "Shadowsprite");

        //Bridge of Shadows 7125
        Story.killQuest(7125, "ShadowVoid", "Light Matter");

        //Clear the Shadowfiends 7126
        Story.killQuest(7126, "ShadowVoid", "Shadowfiend");

        //Feed the Doomblade 7127
        Story.killQuest(7127, "ShadowVoid", "Shadowfiend");

        //Build Another Bridge 7128
        if (!Story.questProgression(7128)) {
            Core.ensureAccept(7128);
            Core.huntMonster("shadowvoid", "Shadowfiend", "Shadow Matter", 6);
            Core.huntMonster("shadowvoid", "Light Matter", "Bright Oil", 5);
            Core.ensureComplete(7128);
        }

        //Find Safiria 7129
        Story.mapItemQuest(7129, "ShadowVoid", 6765);

        //Dissolve the Chains 7130
        if (!Story.questProgression(7130)) {
            Core.ensureAccept(7130);
            Core.getMapItem(6766, 1, "ShadowVoid");
            Core.huntMonster("shadowvoid", "Light Matter", "Bright Acid", 3);
            Core.ensureComplete(7130);
        }

        //Fragment of Doom 7131
        Story.killQuest(7131, "ShadowVoid", "Fragment of Doom");
    }
}

export default function main(): void {
    const script = new ShadowVoid();
    Core.setOptions();

    script.shadowVoidQuests();

    Core.setOptions(false);
}
