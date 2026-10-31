/*
name: Wheel of Love Story
description: This will complete the Wheel of Love story quest.
tags: story, quest, wheel, love, seasonal, hero, heart
*/
// Port of Scripts/Seasonal/HerosHeartDay/WheelOfLove.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class WheeleOfLove {
    doWheeleOfLove(): void {
        this.wheelOfLoveDungeon();
        this.wheelOfLoveQuest();
    }

    wheelOfLoveDungeon(): void {
        if (!Core.isSeasonalMapActive("wheeloflove")) {
            return;
        }
        if (Core.isCompletedBefore(5693)) {
            return;
        }

        Story.preLoad(this.wheelOfLoveDungeon);

        // The Golden Heart
        Story.killQuest(5684, "wheeloflove", "Love Shrub");

        // The Red Room
        Story.mapItemQuest(5685, "wheeloflove", 5146, 6);

        // Get out of here
        Story.mapItemQuest(5686, "wheeloflove", 5147, 4);
        Story.killQuest(5686, "wheeloflove", "Lava Slime");

        // Spooky Cupid
        Story.killQuest(5687, "wheeloflove", "Undead Cherub");

        // Get a Bullseye
        Story.mapItemQuest(5688, "wheeloflove", 5148);

        // And They Called it Puppy Love
        Story.killQuest(5689, "wheeloflove", "Puppy Love");

        // Gotta Get the Keys
        Story.killQuest(5690, "wheeloflove", "Lil' Poot");

        // They Already Lost
        Story.killQuest(5691, "wheeloflove", "Last Year's Loser");

        // A Long Time Ago
        Story.killQuest(5692, "wheeloflove", "Lost Love");

        // Is His Name Herbie?
        Story.killQuest(5693, "wheeloflove", "Love Bug");
    }

    wheelOfLoveQuest(): void {
        const RewardOptions = Core.ensureLoad(5694).rewards;
        const RewardsList: string[] = [];
        for (const Item of RewardOptions) {
            RewardsList.push(Item.name);
        }

        const Rewards = [...RewardsList];

        if (Core.checkInventory(Rewards)) {
            return;
        }
        Core.addDrop(...Rewards);
        while (!bot.shouldExit && !Core.checkInventory(Rewards)) {
            Core.ensureAccept(5694);
            Core.huntMonster("wheeloflove", "Undead Cherub", "Unlove Dart", 13);
            Core.ensureCompleteChoose(5694, Rewards);
            Core.sleep();
        }
    }
}

export default function main(): void {
    const script = new WheeleOfLove();
    Core.setOptions();

    script.doWheeleOfLove();

    Core.setOptions(false);
}
