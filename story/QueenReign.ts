/*
name: Queen Reign Story
description: This will finish the Queen Reign Story.
tags: story, quest, queen-reign
*/
// Port of Scripts/Story/QueenReign.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class QueenReign {
    doAll(): void {
        this.fourthHeroOfBalance();
        this.eleventhHeroOfBalance();
        this.thirdAndTwelfthHeroOfBalance();
        this.tenthHeroOfBalance();
    }

    fourthHeroOfBalance(): void {
        //Fourth Hero of Balance
        if (Core.isCompletedBefore(8308)) {
            return;
        }

        //Fallen Nopperabo
        Story.killQuest(8302, "queenreign", "Samurai Nopperabo");

        //Samurai of Jaaku
        Story.killQuest(8303, "queenreign", "Shadow Samurai");

        //Constructing the Portal
        if (!Story.questProgression(8304)) {
            Core.ensureAccept(8304);
            Core.huntMonster("queenreign", "Samurai Nopperabo", "Yokai Energy", 3);
            Core.huntMonster("queenreign", "Shadow Samurai", "Shadow Energy", 3);
            Story.mapItemQuest(8304, "queenreign", 9120);
        }

        //Into the Yokai Realm
        Story.killQuest(8305, "queenreign", "Tsukumo-Gami");

        //Jaaku's Shadow
        Story.killQuest(8306, "queenreign", "Jaaku's Shadow");

        //The Forces of Jaaku
        Story.killQuest(8307, "queenreign", "Jaaku's Shadow");

        //The Wind Orb
        Story.killQuest(8308, "queenreign", "Jaaku");
    }

    eleventhHeroOfBalance(): void {
        //Eleventh Hero of Balance
        if (Core.isCompletedBefore(8314)) {
            return;
        }

        //Super Spreaders
        Story.killQuest(8309, "queenreign", "Plague Spreader");

        //Sample Size
        Story.mapItemQuest(8310, "queenreign", 9121, 4);

        //Moss You Be This Nasty
        Story.killQuest(8311, "queenreign", "Plaguemoss");

        //Infected With The Cure
        if (!Story.questProgression(8312)) {
            Core.ensureAccept(8312);
            Core.getMapItem(9122, 4, "queenreign");
            Core.huntMonster("queenreign", "Plague Spreader", "Cure Tested", 4);
            Core.ensureComplete(8312);
        }

        //Hurtful Healing
        Story.killQuest(8313, "queenreign", "Plague Spreader");

        //The Energy Orb
        Story.killQuest(8314, "queenreign", "Extriki");
    }

    thirdAndTwelfthHeroOfBalance(): void {
        //Third And Twelfth Hero of Balance
        if (Core.isCompletedBefore(8319)) {
            return;
        }

        //Amethite, Am I Right?
        Story.killQuest(8315, "queenreign", "Calcified Amethite");

        //Reinforcements Deployed
        Story.mapItemQuest(8316, "queenreign", 9123, 4);

        //Wyrms Below
        Story.killQuest(8317, "queenreign", "Calcified Wyrm");

        //Lair Located
        if (!Story.questProgression(8318)) {
            Core.ensureAccept(8318);
            Core.getMapItem(9124, 1, "queenreign");
            Core.huntMonster("queenreign", "Calcified Remains", "Calcified Remains Defeated", 6);
            Core.ensureComplete(8318);
        }

        //The Earth Orb
        Story.killQuest(8319, "queenreign", "Grou'luu");
    }

    tenthHeroOfBalance(): void {
        //Tenth Hero of Balance
        if (Core.isCompletedBefore(8325)) {
            return;
        }

        //Goblin Down Water
        Story.killQuest(8320, "queenreign", "Water Goblin");

        //Spawn of the Salt Sower
        Story.killQuest(8321, "queenreign", "Sa-Laatan Spawn");

        //Faerie in Danger
        Story.killQuest(8322, "queenreign", "Sa-Laatan Spawn");

        //Fertility Ward
        Story.mapItemQuest(8323, "queenreign", 9125, 5);

        //Path to Sa-Laatan
        Story.killQuest(8324, "queenreign", "Water Goblin");

        //The Water Orb
        Story.killQuest(8325, "queenreign", "Sa-Laatan");
    }
}

export default function main(): void {
    const script = new QueenReign();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
