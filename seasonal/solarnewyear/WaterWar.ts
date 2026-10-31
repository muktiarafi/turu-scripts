/*
name: WaterWar
description: null
tags: null
*/
// Port of Scripts/Seasonal/SolarNewYear/WaterWar.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class WaterWar {
    storyLine(): void {
        if (Core.isCompletedBefore(6821)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Sploosh Some Solars! 6814
        Story.killQuest(6814, "waterwar", "Solar Elemental");

        //Sploosh Some Bigger Solars! 6816
        Story.killQuest(6816, "waterwar", "Solar Elemental");

        //Curious Monkeys 6815
        Story.killQuest(6815, "waterwar", "Temple Gibbon");

        //Owwie! 6817
        Story.killQuest(6817, "waterwar", "Aloe");

        //Naughty Monkeys 6818
        Story.killQuest(6818, "waterwar", "Temple Gibbon");

        //The Big One 6819
        Story.killQuest(6819, "waterwar", "Solar Flare");

        // Ow, The Blisters 6820
        Story.killQuest(6820, "waterwar", "Aloe");

        // Even Naughtier Monkeys 6821
        Story.killQuest(6821, "waterwar", "Temple Gibbon");
    }
}

export default function main(): void {
    const script = new WaterWar();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
