/*
name: Chairman Platinum's Evolving Environmental Art Gallery
description: This script will finish the storyline in /ebilart.
tags: ebilart, ebil, art, ebil art, april fools, seasonal, story, ai, art gallery
*/
// Port of Scripts/Seasonal/AprilFools/EbilArt.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class EbilArt {
    storyLine(): void {
        if (Core.isCompletedBefore(9659) || !Core.isSeasonalMapActive("ebilart")) {
            return;
        }

        Story.preLoad(this.storyLine);

        Core.equipClass(ClassType.Farm);

        // Going Going Is Bananas (9650)
        Story.killQuest(9650, "ebilart", "GorillAIphant");

        // Your FrAInds! (9651)
        Story.mapItemQuest(9651, "ebilart", [12874, 12875]);

        // Green Soy Fodder (9652)
        Story.killQuest(9652, "ebilart", "AI Clones");

        // WIPs (9653)
        Story.mapItemQuest(9653, "ebilart", 12876, 4);

        // Anatomical Nightmare (9654)
        Story.killQuest(9654, "ebilart", "UNUNSkellingdens");

        // Dead Eyed (9655)
        Story.mapItemQuest(9655, "ebilart", [12877, 12878]);

        // Unspecified Seafood (9656)
        Story.killQuest(9656, "ebilart", "Fish");

        // Too Literal (9657)
        Story.mapItemQuest(9657, "ebilart", [12879, 12880]);

        // Oversaturation (9658)
        Story.killQuest(9658, "ebilart", ["Fish", "UNUNSkellingdens"]);

        // Pull the Plug (9659)
        if (!Core.isCompletedBefore(9659)) {
            Core.equipClass(ClassType.Solo);
            Story.killQuest(9659, "ebilart", "Ebil AI Blender");
            Core.equipClass(ClassType.Farm);
        }
    }
}

export default function main(): void {
    const script = new EbilArt();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
