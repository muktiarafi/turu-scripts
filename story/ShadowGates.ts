/*
name: Shadow Gates Story
description: This will finish the Shadow Gates Story.
tags: story, quest, shadowgates
*/
// Port of Scripts/Story/ShadowGates.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";
import { Core13LoC } from "./lordsofchaos/Core13LoC";

const Story = new CoreStory();
const Loc = new Core13LoC();

export class ShadowGates {
    storyLine(): void {
        Loc.prologue();

        if (Core.isCompletedBefore(3292)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Re-Stolen Keys 3285
        Story.killQuest(3285, "ShadowGates", "Chaorrupted Rogue");

        //Reagents of Chaos 3286
        Story.killQuest(3286, "ShadowGates", "Chaorrupted Mage");

        //Conscripted Chaorruption 3287
        Story.killQuest(3287, "ShadowGates", "Chaos Warrior");

        //Tools of Chaos 3288
        Story.killQuest(3288, "ShadowGates", "Chaorrupted Rogue");

        //Disarmingly Roguish 3289
        Story.mapItemQuest(3289, "ShadowGates", 2327);

        //Dock Blocked 3290
        Story.killQuest(3290, "ShadowGates", "Chaorrupted Mage");

        //Skull Smashing 3291
        Story.mapItemQuest(3291, "ShadowGates", 2328);

        //Destroy Chaorruption 3292
        Story.killQuest(3292, "ShadowGates", "Chaorruption");
    }
}

export default function main(): void {
    const script = new ShadowGates();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
