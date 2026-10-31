/*
name: CaptainLoresQuests
description: CaptainLores Questline
tags: storyline, captainlore, pollution, totengeldfactory
*/
// Port of Scripts/Seasonal/EarthDay/CaptainLoresQuests.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class CaptainLoresQuests {
    pollution(): void {
        if (Core.isCompletedBefore(6823) || !Core.isSeasonalMapActive("pollution")) {
            return;
        }

        Story.preLoad(this.pollution);

        // All Wet 620
        Story.killQuest(620, "pollution", ["Water Elemental", "Kuro"]);

        // Flame On 621
        Story.killQuest(621, "pollution", ["Fire Elemental", "Thermax"]);

        // Plant Matters 619
        Story.killQuest(619, "pollution", ["Rock Elemental", "Stone Golem"]);

        // Breaking Wind Turbines 618
        Story.killQuest(618, "pollution", ["Wind Elemental", "Ozone"]);

        // Chaos Footprint 622
        Story.killQuest(622, "pollution", "General Pollution");

        // Reduce, Reuse, Recycle 1036
        Story.killQuest(1036, "pollution", ["Fire Elemental", "Wind Elemental", "Water Elemental", "Rock Elemental"]);

        // Go Green like a Boss 1037
        Story.killQuest(1037, "pollution", ["Thermax", "Kuro", "Stone Golem", "Ozone"]);

        // Clean Up the Core 6823
        Story.killQuest(6823, "pollution", "Commodore Core");
    }

    totengeldFactory(): void {
        if (Core.isCompletedBefore(3474) || !Core.isSeasonalMapActive("totengeld")) {
            return;
        }

        Story.preLoad(this.totengeldFactory);

        // No More Chainsaws 3467
        Story.killQuest(3467, "totengeld", "Chainsaw Sneevil");

        // Cage Rage 3468
        Story.mapItemQuest(3468, "totengeld", 2604, 6);

        // Factory Cleanup 3469
        Story.killQuest(3469, "totengeld", "Toxic Waste");

        // Find A Way In 3470
        Story.killQuest(3470, "totengeld", "Horc Minion");

        // More Like DourDrank 3471
        Story.killQuest(3471, "totengeld", "Factory Sneevil");

        // Days Without Incident: 0 3472
        Story.mapItemQuest(3472, "totengeld", 2605, 4);
        Story.mapItemQuest(3472, "totengeld", 2606, 2);

        // Boot to the Head 3473
        Story.killQuest(3473, "totengeld", "Horc Minion");

        // Defeat CEO Totengeld 3474
        if (!Core.isCompletedBefore(3474)) {
            Core.huntMonster("totengeld", "CEO Totengeld", undefined, undefined, { log: false });
            Story.killQuest(3474, "totengeld", "Mecha Totengeld");
        }
    }
}

export default function main(): void {
    const script = new CaptainLoresQuests();
    Core.setOptions();

    script.pollution();
    script.totengeldFactory();

    Core.setOptions(false);
}
