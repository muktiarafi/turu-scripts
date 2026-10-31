/*
name: Wentira
description: This script will complete the storyline in /wentira.
tags: royal wentira, agung palakka, seasonal, indonesia
*/
// Port of Scripts/Seasonal/IndonesianDay/Wentira.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Wentira {
    storyline(): void {
        if (!Core.isSeasonalMapActive("wentira") || Core.isCompletedBefore(9341)) {
            return;
        }

        Story.preLoad(this.storyline);

        // Ritual Greed (9340)
        Story.killQuest(9340, "wentira", "Pesugihan Boar");

        // Dark Dance (9341)
        Core.equipClass(ClassType.Solo);
        Story.killQuest(9341, "wentira", "Kabasaran Waranei");
        Core.equipClass(ClassType.Farm);
    }
}

export default function main(): void {
    const script = new Wentira();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
