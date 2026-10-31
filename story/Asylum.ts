/*
name: Asylum Story
description: This will complete the Asylum story.
tags: story, quest, asylum
*/
// Port of Scripts/Story/Asylum.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Asylum {
    storyLine(): void {
        if (Core.isCompletedBefore(2466)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Reflect Upon the Situation 2454
        Story.killQuest(2454, "mirrormaze", "Insane Ghoul");

        //Escape the Insanity! 2455
        Story.mapItemQuest(2455, "mirrormaze", 1522);

        //Smoke and Mirrors 2456
        Story.mapItemQuest(2456, "mirrormaze", 1523, 6);

        //Shot in the Dark 2457
        Story.killQuest(2457, "mirrormaze", "Insane Ghoul");

        //Cyser - Oh Where Art Thou? 2458
        Story.mapItemQuest(2458, "mirrormaze", 1524);

        // [[Catacombs]]

        //Tricks Trail Trackin 2459
        Story.mapItemQuest(2459, "catacombs", [1525, 1526, 1527, 1528, 1529, 1530]);

        //Cultivate Answers 2460
        Story.killQuest(2460, "catacombs", "Scorpion Cultist");

        //One Found Doll 2461
        Story.mapItemQuest(2461, "catacombs", 1531);

        //The Key to Saving Kimberly 2462
        Story.killQuest(2462, "catacombs", "Scorpion Cultist");

        //Right Tool for the Job 2463
        Story.mapItemQuest(2463, "catacombs", 1532, 10);

        //Pick the Lock 2464
        Story.mapItemQuest(2464, "catacombs", 1533);

        //Destroy DeSawed 2465
        if (!Story.questProgression(2465)) {
            Core.ensureAccept(2465);
            Core.killMonster("catacombs", "Frame6", "Left", "Dr. De'Sawed", "Disarmed De'Sawed");
            Core.ensureComplete(2465);
        }

        //Demolish DeSawed FOR REAL 2466
        if (!Story.questProgression(2466)) {
            Core.ensureAccept(2466);
            Core.killMonster("catacombs", "Boss2", "Left", "Dr. De'Sawed", "De'Sawed Defeated");
            Core.ensureComplete(2466);
        }
    }
}

export default function main(): void {
    const script = new Asylum();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
