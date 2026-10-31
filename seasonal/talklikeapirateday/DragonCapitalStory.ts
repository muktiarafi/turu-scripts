/*
name: Dragon Capital Story
description: This will finish the Dragon Capital Story Quest.
tags: story, quest, dragon, capital, pirate
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/DragonCapitalStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { DragonPirateStory } from "./DragonPirateStory";

const Story = new CoreStory();
const DPS = new DragonPirateStory();

export class DragonCapitalStory {
    dragonCapital(): void {
        if (!Core.isSeasonalMapActive("dragoncapital")) {
            return;
        }

        if (Core.isCompletedBefore(8287)) {
            return;
        }

        DPS.dragonPirate();

        Story.preLoad(this.dragonCapital);

        // 8279 Dracon-you Not
        Story.killQuest(8279, "dragoncapital", "Pirate Draconian");

        // 8280 Fighting Pirates is a Drag(on)
        Story.killQuest(8280, "dragoncapital", "Dragon Pirate");

        // 8281 Prepping a Trap
        if (!Story.questProgression(8281)) {
            Core.ensureAccept(8281);
            Core.huntMonster("dragoncapital", "Dragon Pirate", "Spade", 1);
            Core.huntMonster("dragoncapital", "Dragon Pirate", "Rope", 4);
            Core.huntMonster("dragoncapital", "Dragon Pirate", "Smoke Bombs", 4);
            Core.ensureComplete(8281);
        }

        // 8282 Planting a Surprise
        Story.mapItemQuest(8282, "dragoncapital", 8995, 4);

        // 8283 Water Droppings
        Story.killQuest(8283, "dragoncapital", "Water Elemental");

        // 8284 Titan Suckers
        Story.killQuest(8284, "dragoncapital", "Titan Leech");

        // 8285 T' The Throne Room
        Story.killQuest(8285, "dragoncapital", "Titan Leech");

        // 8286 Get Past Scalebeard
        Story.killQuest(8286, "dragoncapital", "Empowered Scalebeard");

        // 8287 The Water Titan
        Story.killQuest(8287, "dragoncapital", "Leviathanius");
    }
}

export default function main(): void {
    const script = new DragonCapitalStory();
    Core.setOptions();

    script.dragonCapital();

    Core.setOptions(false);
}
