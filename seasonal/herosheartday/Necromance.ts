/*
name: Necromance
description: This will complete the Necromance story quest.
tags: necromance, seasonal, heros-heart-day, heart, hero, story
*/
// Port of Scripts/Seasonal/HerosHeartDay/Necromance.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Necromance {
    completeStory(): void {
        if (Core.isCompletedBefore(4068)) {
            return;
        }

        if (!Core.isSeasonalMapActive("necromance")) {
            return;
        }

        Story.preLoad(this.completeStory);

        // Cupid's Courier (4039)
        Story.mapItemQuest(4039, "necromance", 3151);

        // Last Minute Gift Ideas (4040)
        Story.mapItemQuest(4040, "love", 3152, 12);
        Story.killQuest(4040, "love", ["Love Shrub", "Huggy-Bear"]);

        // Cravin' a Raven (4041)
        Story.killQuest(4041, "judgement", "Raven");

        // Owl Always Love You (4042)
        Story.killQuest(4042, "pines", "LeatherWing");

        // This is My Broom STICK! (4043)
        Story.killQuest(4043, "farm", "Scarecrow");

        // Yes We Candle! (4044)
        Story.killQuest(4044, "darkoviaforest", "Blood Maggot");

        // Itty Bitty Kitty (4045)
        Story.killQuest(4045, "beleensdream", "Disgruntled DoomKitten");

        // Clock Blocker (4046)
        Story.killQuest(4046, "timevoid", "Time-Travel Fairy");

        // Shoots! And Ladders (4047)
        Story.killQuest(4047, "giant", "Red Ant");

        // Mirror Image (4048)
        Story.killQuest(4048, "battleoff", "Evil Moglin");

        // Opal Omen (4049)
        Story.killQuest(4049, "earthstorm", "Amethite");

        // A Salt with a Deadly Weapon (4050)
        if (!Story.questProgression(4050)) {
            Core.ensureAccept(4050);
            Core.huntMonster("willowcreek", "Snail", "Iodized Salt", 3);
            Core.huntMonster("waterstorm", "Deep Dweller", "Sea Salt");
            Core.ensureComplete(4050);
        }

        // Mind your Manors, Magpie (4051)
        Story.killQuest(4051, "manor", "Bird of Paradise");

        // Umbrella for my Bella (4052)
        Story.killQuest(4052, "junkyard", "Tsukumo-Gami");

        // Bat Crazy! (4053)
        Story.killQuest(4053, "darkoviagrave", "Albino Bat");

        // Present the Presents (4065)
        if (!Story.questProgression(4065)) {
            Core.ensureAccept(4065);
            while (!Core.checkInventory("Presents for Nastasia", 13)) {
                Core.ensureAccept(4053);
                Core.huntMonster("darkoviagrave", "Albino Bat", "Perfect Pet Bat");
                Core.ensureComplete(4053);
                bot.wait.forPickup("Presents for Nastasia");
            }
            Core.ensureComplete(4065);
        }

        // I Want Tibia Your Valentine (4066)
        Story.killQuest(4066, "love", "Forlorn Love");

        // Kill Nastasia (4067)
        Story.killQuest(4067, "necromance", "Nastasia");

        // Gravelyn Stops Nastasia! (4068)
        Story.killQuest(4068, "necromance", "Nastasia");
    }
}

export default function main(): void {
    const script = new Necromance();
    Core.setOptions();

    script.completeStory();
    Core.setOptions(false);
}
