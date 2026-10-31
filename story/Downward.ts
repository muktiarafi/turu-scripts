/*
name: Downward Story
description: This will complete the Downward Story.
tags: story, quest, downward
*/
// Port of Scripts/Story/Downward.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Downward {
    storyLine(): void {
        if (Core.isCompletedBefore(2884)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Warlic's Letter To Rayst 2861
        Story.mapItemQuest(2861, "arcangrove", 1752);

        //Rayst's Response 2862
        Story.mapItemQuest(2862, "battleontown", 1753);

        //Chat With Cysero 2863
        Story.mapItemQuest(2863, "battleontown", 1754);

        //You'll Never Get Me, Copper! 2864
        Story.killQuest(2864, "lair", "Bronze Draconian");

        //Lode Me Up 2865
        Story.killQuest(2865, "cornelis", "Gargoyle");

        //The Spark 2866
        Story.killQuest(2866, "Noobshire", "Kittarian Mouse Eater");

        //GI-ANTS 2867
        Story.killQuest(2867, "giant", "Red Ant");

        //What Big Teeth You Have 2868
        Story.killQuest(2868, "mudluk", "Swamp Lurker");

        //Speak To Alina 2869
        Story.mapItemQuest(2869, "battleontown", 1755);

        //Return The Potion To Cysero 2870
        Story.mapItemQuest(2870, "battleontown", 1756);

        //Enter the Entrance 2871
        Story.killQuest(2871, "downward", "Unearthed Skeleton");

        //Can You Dig It? 2872
        Story.killQuest(2872, "downward", "Rotfeeder Worm");

        //Snip Snip 2873
        Story.killQuest(2873, "downward", "Rotfeeder Worm");

        //Resonations 2874
        Story.mapItemQuest(2874, "downward", 1757, 6);

        //Eureka! 2875
        Story.killQuest(2875, "downward", "Rotfeeder Worm");

        //Push-Button Start 2876
        Story.mapItemQuest(2876, "downward", 1758);

        //Out Of Coal 2877
        Story.killQuest(2877, "downward", "Rotfeeder Worm");

        //Start The Reaction 2878
        Story.mapItemQuest(2878, "downward", 1759, 8);

        //Start Her Up 2879
        Story.mapItemQuest(2879, "downward", 1760);

        //We Have Arrived! 2880
        Story.killQuest(2880, "downward", "Mana Crystalized Undead");

        //Hardened Crystals 2881
        Story.killQuest(2881, "downward", "Gemmed Burrower");

        //Quadtanium? 2882
        Story.mapItemQuest(2882, "downward", 1761, 6);

        //Capacitance 2883
        Story.killQuest(2883, "downward", "Gemmed Burrower");

        //The Heart Of The World 2884
        Story.killQuest(2884, "downward", "Crystal Mana Construct");
    }
}

export default function main(): void {
    const script = new Downward();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
