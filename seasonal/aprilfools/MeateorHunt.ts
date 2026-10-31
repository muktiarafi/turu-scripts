/*
name: Meateor Hunt Story
description: This will finish the Meateor Hunt storyline.
tags: meateor-hunt, seasonal, april-fools
*/
// Port of Scripts/Seasonal/AprilFools/MeateorHunt.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class MeateorHunt {
    storyLine(): void {
        if (!Core.isSeasonalMapActive("MeateorTown")) {
            return;
        }
        if (Core.isCompletedBefore(8628)) {
            Core.logger("StoryLine Complet: Meateor Hunt");
            return;
        }

        Story.preLoad(this.storyLine);

        //Defeat the Giant ChickenCow
        Story.killQuest(8612, "MeateorTown", "Giant ChickenCow");

        //Chick Your Surroundings
        if (!Story.questProgression(8614)) {
            Core.ensureAccept(8614);
            Core.huntMonster("EarthStorm", "Blue Chick", "Tiny Blue Freggment");
            Core.huntMonster("Mythsong", "Pink Chick", "Tiny Pink Freggment");
            Core.huntMonster("WaterStorm", "Purple Chick", "Tiny Purple Freggment");
            Core.huntMonster("GreenguardWest", "Green Chick", "Tiny Green Freggment");
            Core.huntMonster("DarkoviaGrave", "Rainbow Chick", "Tiny Rainbow Freggment");
            Core.ensureComplete(8614);
        }

        //PainFowl Recollection
        Story.killQuest(8615, "Battlefowl", "Chicken");

        //Empty Nest Syndrome
        if (!Story.questProgression(8616)) {
            Core.ensureAccept(8616);
            Core.huntMonsterMapID("Uppercity", 8, "Nested Freggment", 8);
            Core.ensureComplete(8616);
        }

        //Comet-ted to Memory
        if (!Story.questProgression(8617)) {
            Core.ensureAccept(8617);
            Core.huntMonster("comet", "Vaderix", "Slimy Freggments", 5);
            Core.huntMonster("comet", "Vaderix", "Even Slimier Freggment", 1);
            Core.ensureComplete(8617);
        }

        //Right Under Your Nose
        Story.killQuest(8618, "BattleFowl", "ChickenCow");

        //Don't Chicken Out!
        if (!Story.questProgression(8619)) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAccept(8619);
            Core.huntMonster("BattleFowl", "Sabertooth Chicken", "Pointy Freggment", 8);
            Core.huntMonster("MeateorTown", "Red Chicken", "Red Freggment", 10);
            Core.huntMonster("DfLesson", "Chaotic Chicken", "Chaotic Freggment", 6);
            Core.ensureComplete(8619);
        }
        //Ashville Hot
        if (!Story.questProgression(8620)) {
            Core.ensureAccept(8620);
            Core.huntMonster("ashfallcamp", "Blackrawk", "Black Rocky Freggment", 1);
            Core.huntMonster("ashfallcamp", "Smoldur", "Smoldering Freggment", 1);
            Core.huntMonster("ashfallcamp", "Infernus", "Infernal Freggment", 1);
            Core.ensureComplete(8620);
        }

        //Holy (Chicken)Cow!
        if (!Story.questProgression(8621)) {
            Core.ensureAccept(8621);
            Core.huntMonster("crashruins", "Unlucky Explorer", "Ruined Freggment", 8);
            Core.huntMonster("crashruins", "CluckMoo Idol", "Idolized Freggment", 1);
            Core.ensureComplete(8621);
        }

        //Chilling Tales of Chicken Cows
        if (!Story.questProgression(8622)) {
            Core.ensureAccept(8622);
            Core.huntMonster("northlands", "Ice Symbiote", "Frosty Freggment", 15);
            Core.huntMonster("northlands", "Ice Symbiote", "25 Below Freggment", 1);
            Core.ensureComplete(8622);
        }

        //Cowissa
        bot.quests.updateQuest(8000);
        Core.equipClass(ClassType.Solo);
        Story.killQuest(8623, "astravia", "The Moon");

        //Collection Dejection
        if (!Story.questProgression(8624)) {
            Core.ensureAccept(8624);
            Core.huntMonster("future", "The Collector", "Collected Freggment", 10);
            Core.huntMonster("future", "The Collector", "Private Collection Freggment", 3);
            Core.ensureComplete(8624);
        }

        //Poached Eggs
        if (!Story.questProgression(8625)) {
            Core.ensureAccept(8625);
            Core.huntMonster("byrodax", "Byro-Dax Monstrosity", "Poached Freggment", 1);
            Core.huntMonster("byrodax", "Space Goop", "Goopy Freggment", 6);
            Core.huntMonster("byrodax", "Mutated Critter", "Mutated Freggment", 12);
            Core.ensureComplete(8625);
        }

        //Dumpster Diving
        if (!Story.questProgression(8626)) {
            Core.ensureAccept(8626);
            Core.huntMonster("junkhoard", "Magpie Junk Heap", "Heaping Freggment", 1);
            Core.huntMonster("junkhoard", "Junk Golem", "Trashy Freggment", 10);
            Core.huntMonster("junkhoard", "Magpie", "Stolen Freggment", 8);
            Core.ensureComplete(8626);
        }

        //A Dreadful Dinner
        Story.killQuest(8627, "Dreadspace", "Troblor");

        //Succeed or Fry Trying
        if (!Story.questProgression(8628)) {
            Core.ensureAccept(8628);
            Core.huntMonster("thirdspell", "Great Solar Elemental", "Fried Freggment", 3);
            Core.huntMonster("thirdspell", "Sun Flare", "Boiled Freggment", 12);
            Core.huntMonster("thirdspell", "Solar Incarnation ", "Sun-Cooked Freggment", 1);
            Core.ensureComplete(8628);
        }
    }
}

export default function main(): void {
    const script = new MeateorHunt();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
