/*
name: GL-24K's Quests
description: This script will complete GL-24K's Quests in /twigguhunt.
tags: gl24k,gl-24k,twigguhunt,twiggu hunt,may the 4th,seasonal, story, quests, may4th
*/
// Port of Scripts/Seasonal/MayThe4th/TwigguHunt.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { MurderMoon } from "./MurderMoonStory";

const Story = new CoreStory();
const MM = new MurderMoon();

export class TwigguHunt {
    storyline(): void {
        if (Core.isCompletedBefore(9702) || !Core.isSeasonalMapActive("twigguhunt")) {
            return;
        }

        MM.murderMoonStory();

        Story.preLoad(this.storyline);

        Core.equipClass(ClassType.Farm);

        // Scout It Out (9698)
        Story.mapItemQuest(9698, "twigguhunt", 13131, 5);

        // No Bot Unbeaten (9699)
        Story.killQuest(9699, "twigguhunt", "Scout Droid");

        // If Memory Serves... (9700)
        Story.killQuest(9700, "twigguhunt", "Scout Droid");

        // Target Located (9701)
        Story.killQuest(9701, "twigguhunt", "Bodyguard Droid");

        // Bring Them In (9702)
        if (!Story.questProgression(9702)) {
            Core.equipClass(ClassType.Solo);
            Story.killQuest(9702, "twigguhunt", "Twiggu");
            Core.equipClass(ClassType.Farm);
        }
    }
}

export default function main(): void {
    const script = new TwigguHunt();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
