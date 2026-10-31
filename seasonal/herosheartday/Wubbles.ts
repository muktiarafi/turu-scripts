/*
name: Wubbles
description: This will complete the Wubbles story quest.
tags: wubbles, seasonal, heros-heart-day, heart, hero, story
*/
// Port of Scripts/Seasonal/HerosHeartDay/Wubbles.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Wubbles {
    completeStory(): void {
        if (Core.isCompletedBefore(6737)) {
            return;
        }

        if (!Core.isSeasonalMapActive("wubbles")) {
            return;
        }

        Story.preLoad(this.completeStory);

        // Get the Costume! (6727)
        Story.mapItemQuest(6727, "wubbles", 6211);

        // Get the Shinies! (6728)
        Story.killQuest(6728, "catacombs", "Scorpion Cultist");

        // Best Smell EVER! (6729)
        if (!Story.questProgression(6729)) {
            Core.ensureAccept(6729);
            Core.killMonster("wanders", "r5", "Left", "Lotus Spider", "Lotus Pollen", 8);
            Core.ensureComplete(6729);
        }

        // Shimmer and Shine! (6730)
        Story.killQuest(6730, "dreamnexus", "Aether Serpent");

        // Feel the WUB! (6731)
        Story.mapItemQuest(6731, "battleontown", [6212, 6213, 6214, 6215, 6216, 6217, 6218]);

        // The Cult of WUB (6732)
        Story.killQuest(6732, "wubblevania", "Charmed Cultist");

        // Get the Wub Charms! (6733)
        Story.killQuest(6733, "wubblevania", [
            "Charmed Cysero",
            "Charmed Bev",
            "Charmed Alina",
            "Charmed Warlic",
            "Charmed Lim",
            "Charmed Niamara",
            "Charmed Murp",
        ]);

        // Squishies! (6734)
        Story.killQuest(6734, "wubblevania", "Wubwub");

        // Get on his Nerves! (6735)
        Story.mapItemQuest(6735, "wubblevania", 6219, 9);

        // Take the Stone! (6736)
        Story.mapItemQuest(6736, "wubblevania", 6220);

        // Take out Mr. Wubbles! (6737)
        Story.killQuest(6737, "wubblevania", "Mr. Wubbles");
    }
}

export default function main(): void {
    const script = new Wubbles();
    Core.setOptions();

    script.completeStory();
    Core.setOptions(false);
}
