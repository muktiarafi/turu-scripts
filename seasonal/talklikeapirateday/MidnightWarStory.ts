/*
name: Midnight War
description: This script will complete the storyline in /midnightcrown and /midnightwar
tags: midnight-war, midnight-crown, flintfang, bonnie blood, rustclaw, tlapd, talk-like-a-pirate-day, seasonal
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MidnightWarStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class MidnightWar {
    storyline(): void {
        if (Core.isCompletedBefore(5417) || !Core.isSeasonalMapActive("midnightwar")) {
            return;
        }

        Story.preLoad(this.storyline);

        // The New Swabbie (5388)
        Story.killQuest(5388, "midnightcrown", "Spike the Swabbie");

        // It's A Thankless Job (5389)
        Story.mapItemQuest(5389, "midnightcrown", [4746, 4747], 4);

        // Gunpowder, Lots! (5390)
        if (!Story.questProgression(5390)) {
            Core.ensureAccept(5390);
            Core.getMapItem(4748, 5, "midnightcrown");
            Core.huntMonster("midnightcrown", "Scoundrel", "Gunpowder", 5);
            Core.ensureComplete(5390);
        }

        // Boar-ed of Seafood (5391)
        Story.killQuest(5391, "midnightcrown", "Island Boar");

        // This Boar Is On Fire (5392)
        Story.mapItemQuest(5392, "midnightcrown", 4749, 4);
        Story.mapItemQuest(5392, "midnightcrown", [4750, 4751]);

        // Pirates Be Stealthy! (5393)
        Story.mapItemQuest(5393, "midnightcrown", 4752);

        // It Pays To Be Prepared! (5394)
        if (!Story.questProgression(5394)) {
            Core.ensureAccept(5394);
            Core.getMapItem(4753, 1, "midnightcrown");
            Core.huntMonster("midnightcrown", "Scoundrel", "Stolen Silver", 9);
            Core.ensureComplete(5394);
        }

        // A Bit O' Protein (5395)
        Story.killQuest(5395, "midnightcrown", "Island Boar");

        // Meals on Wheels (5396)
        Story.mapItemQuest(5396, "midnightcrown", 4754, 5);

        // Decoratin' Time! (5397)
        Story.killQuest(5397, "midnightcrown", "Rapscallion");

        // Catch Some Fireflies (5398)
        Story.mapItemQuest(5398, "midnightcrown", [4755, 4756], 4);

        // Black Veil Courier Service (5399)
        Story.mapItemQuest(5399, "midnightcrown", 4757, 6);

        // Bring Me the Bounty of the Black Veil! (5402)
        Story.killQuest(5402, "midnightwar", "Black Veil Pirate");

        // Defeat Flintfang (5417)
        Story.killQuest(5417, "midnightwar", "Flintfang");
    }
}

export default function main(): void {
    const script = new MidnightWar();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
