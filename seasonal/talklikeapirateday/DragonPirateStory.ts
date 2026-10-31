/*
name: Dragon Pirate Story
description: This will finish the Dragon Pirate Story Line.
tags: story, quest, dragon, pirate
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/DragonPirateStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class DragonPirateStory {
    dragonPirate(): void {
        if (!Core.isSeasonalMapActive("dragonpirate")) {
            return;
        }
        if (Core.isCompletedBefore(8275)) {
            return;
        }

        Story.preLoad(this.dragonPirate);

        // 8268 They Be Draconian
        Story.killQuest(8268, "dragonpirate", "Pirate Draconian");

        // 8269 Pirate Pals
        Story.killQuest(8269, "dragonpirate", "Pirate Wyvern");

        // 8270 Commandeer The Vessel
        if (!Story.questProgression(8270)) {
            Core.ensureAccept(8270);
            Core.getMapItem(8930, 1, "dragonpirate");
            Core.huntMonster("dragonpirate", "Pirate Draconian", "Enemies Cleared", 6);
            Core.ensureComplete(8270);
        }

        // 8271 There Be Dragon
        Story.killQuest(8271, "dragonpirate", "Dragon Pirate");

        // 8272 Man the Cannon
        Story.killQuest(8272, "dragonpirate", "Dragon Gunner");

        // 8273 Boarding Party
        if (!Story.questProgression(8273)) {
            Core.ensureAccept(8273);
            Core.getMapItem(8931, 1, "dragonpirate");
            Core.huntMonster("dragonpirate", "Dragon Pirate", "Boarding Planks Collected", 5);
            Core.ensureComplete(8273);
        }

        // 8274 The Mates First
        Story.killQuest(8274, "dragonpirate", "Pirate Draconian");

        // 8275 Captain Scalebeard
        Story.killQuest(8275, "dragonpirate", "Scalebeard");
    }
}

export default function main(): void {
    const script = new DragonPirateStory();
    Core.setOptions();

    script.dragonPirate();

    Core.setOptions(false);
}
