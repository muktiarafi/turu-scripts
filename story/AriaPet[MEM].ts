/*
name: Aria Pet Story (Member)
description: This will finish the Aria Pet quest.
tags: story, quest, aria, pet, member
*/
// Port of Scripts/Story/AriaPet[MEM].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class AriaPet {
    storyLine(): void {
        if (!Core.isMember) {
            Core.logger("Aria Pet Storyline Is Member Only. Skipping this Script");
            return;
        }

        if (Core.isCompletedBefore(46)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Pet Food Delivery 10
        Story.killQuest(10, "farm", "Scarecrow");

        //Starving Pets 41
        Story.killQuest(41, "sewer", "Greenrat");

        //Picky Eaters 42
        Story.killQuest(42, "river", "River Fishman");

        //Missing Crate 43
        Story.killQuest(43, "pirates", "Shark Bait");

        //Wilderness 44
        Story.killQuest(44, "guru", "Trobble");

        //Trobble Bath 45
        Story.killQuest(45, "swordhaven", "Slime");

        //Home Sick 46
        Story.killQuest(46, "marsh2", "Soulseeker");
    }
}

export default function main(): void {
    const script = new AriaPet();
    Core.setOptions();
    script.storyLine();
    Core.setOptions(false);
}
