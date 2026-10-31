/*
name: Cleric Story
description: This will complete the Cleric story.
tags: story, quest, cleric
*/
// Port of Scripts/Story/Cleric.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Cleric {
    storyLine(): void {
        if (Core.isCompletedBefore(2293)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Purely Elemental Knowledge 2288
        if (!Story.questProgression(2288)) {
            Core.ensureAccept(2288);
            Core.huntMonster("lair", "Dark Draconian", "Pure Darkness");
            Core.huntMonster("lair", "Golden Draconian", "Pure Light");
            Core.huntMonster("gilead", "Fire Elemental", "Pure Fire");
            Core.huntMonster("gilead", "Wind Elemental", "Pure Air");
            Core.huntMonster("gilead", "Earth Elemental", "Pure Earth");
            Core.huntMonster("gilead", "Water Elemental", "Pure Water");
            Core.huntMonster("kingcoal", "Ice Elemental", "Pure Ice");
            Core.huntMonster("airstorm", "Lightning Ball", "Pure Energy");
            Core.ensureComplete(2288);
        }

        //Animal vs Human? 2289
        if (!Story.questProgression(2289)) {
            Core.ensureAccept(2289);
            Core.huntMonster("bloodtuskwar", "Chaotic Vulture", "Avian Report");
            Core.huntMonster("bloodtuskwar", "Chaotic Chinchilizard", "Reptile Report");
            Core.huntMonster("bloodtuskwar", "Chaotic Rhison", "Mammal Report");
            Core.huntMonster("alliance", "Chaorrupted Evil Soldier", "Evil Human Report");
            Core.huntMonster("alliance", "Chaorrupted Good Soldier", "Good Human Report");
            Core.ensureComplete(2289);
        }

        //Gateways to Chaos? 2290
        if (!Story.questProgression(2290)) {
            Core.ensureAccept(2290);
            Core.huntMonster("sewer", "Grumble", "Grumble Portal Not Found");
            Core.huntMonster("boxes", "Grizzlespit", "Grizzlespit Portal Not Found");
            Core.huntMonster("j6", "Sketchy Dragon", "Sketchy Portal Not Found");
            Core.huntMonster("giant", "Giant Cat", "Giant Portal Not Found");
            Core.huntMonster("shadowfall", "Shadow Muncher", "ShadowMuncher Portal Not Found");
            Core.huntMonster("orctown", "General Porkon", "Porkon Portal Not Found");
            Core.ensureComplete(2290);
        }

        //The Nature of Chaos 2291
        Story.mapItemQuest(2291, "cleric", [1453, 1454, 1455, 1456, 1457]);

        //Chaos Theory 2292
        if (!Story.questProgression(2292)) {
            Core.ensureAccept(2292);
            Core.huntMonster("thespan", "Shadowscythe", "Shadowscythe Effluvium", 8);
            Core.huntMonster("thespan", "Shadowscythe", "Shadowscythe Plasma", 5);
            Core.ensureComplete(2292);
        }

        //A Little Chaos Goes a Long Way 2293
        if (!Story.questProgression(2293)) {
            Core.ensureAccept(2293);
            Core.huntMonster("cleric", "Chaos Turtle", "Full Chaorruption Sample");
            Core.huntMonster("cleric", "Chaos Dragon", "New Chaorruption Sample");
            Core.ensureComplete(2293);
        }
    }
}

export default function main(): void {
    const script = new Cleric();
    Core.setOptions();
    script.storyLine();
    Core.setOptions(false);
}
