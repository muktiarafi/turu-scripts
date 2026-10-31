/*
name: Super Slayin Badge
description: This will get the Super Slayin Badge.
tags: super-slayin, badge, seasonal, april-fools
*/
// Port of Scripts/Seasonal/AprilFools/SuperSLAYIN'Badge(GardenQuest).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class SuperSLAYINBadge {
    getBadgeANDDoStory(): void {
        //Progress Check
        if (Core.isCompletedBefore(8006)) {
            return;
        }
        if (!Core.isSeasonalMapActive("gardenquest")) {
            return;
        }

        //Preload Quests
        Story.preLoad(this.getBadgeANDDoStory);

        bot.drops.start();

        //BATTLE: Broccoli vs Hero
        Story.killQuest(8002, "gardenquest", "Angry Broccoli");

        //BATTLE: Radish vs Hero
        Story.killQuest(8003, "gardenquest", "Overconfident Radish");

        //BATTLE: Karrot vs Hero
        Story.killQuest(8004, "gardenquest", "Silly Karrot");

        //BATTLE: Vegetable Prince vs Hero
        Story.killQuest(8005, "gardenquest", "Vegetable Prince");

        //BATTLE: SUPER Vegetable Prince vs Hero
        Story.killQuest(8006, "gardenquest", "Super Prince");
    }
}

export default function main(): void {
    const script = new SuperSLAYINBadge();
    Core.setOptions();

    script.getBadgeANDDoStory();

    Core.setOptions(false);
}
