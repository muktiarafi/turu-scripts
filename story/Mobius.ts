/*
name: Mobius Story
description: This will finish the Mobius Story.
tags: story, quest, mobius
*/
// Port of Scripts/Story/Mobius.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";
import { Core13LoC } from "./lordsofchaos/Core13LoC";

const Story = new CoreStory();
const LoC = new Core13LoC();

export class Mobius {
    doAll(): void {
        this.storyLine();
        this.saathel();
        this.gravelynandVictoria();
    }

    storyLine(): void {
        if (Core.isCompletedBefore(2375)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Waking History 2365
        Story.mapItemQuest(2365, "mobius", 1465);

        //Gathering Shadows 2366
        Story.mapItemQuest(2366, "mobius", 1463, 10);

        //A Less Direct Path 2367
        Story.killQuest(2367, "mobius", "Fire Imp");

        //Interference 2368
        Story.killQuest(2368, "mobius", "Fire Imp");

        //The Race Is On 2369
        Story.mapItemQuest(2369, "mobius", 1464, 10);

        //The Darkness Inside 2370
        Story.killQuest(2370, "mobius", "Slugfit");

        //The Luna 2371
        Story.mapItemQuest(2371, "mobius", 1466);

        //Star of the Wild 2372
        Story.killQuest(2372, "Guru", "Wisteria");

        //Star of the Seas 2373
        Story.killQuest(2373, "natatorium", "Marianus");

        //The Star of Earth 2374
        Story.killQuest(2374, "pines", "Pine Troll");

        //Star of the Flames 2375
        Story.killQuest(2375, "greendragon", "Greenguard Dragon");
    }

    saathel(): void {
        if (Core.isCompletedBefore(2364)) {
            return;
        }

        Story.preLoad(this.saathel);

        // The Dead City 2354
        Story.mapItemQuest(2354, "mobius", 1465);

        //Grains of Chaos 2355
        Story.killQuest(2355, "mobius", "Chaos Sp-eye");

        //Call of the Sun 2356
        Story.mapItemQuest(2356, "mobius", 1461, 10);

        //Shattered Past 2357
        Story.killQuest(2357, "mobius", "Chaos Sp-eye");

        //The Spoiler 2358
        Story.mapItemQuest(2358, "mobius", 1462, 10);

        //Heart Of The Sun 2359
        Story.killQuest(2359, "mobius", "Slugfit");

        //The Sol 2360
        Story.mapItemQuest(2360, "mobius", 1466);

        //Star of the Wild 2361
        Story.killQuest(2361, "Guru", "Wisteria");

        //Star of the Seas 2362
        Story.killQuest(2362, "natatorium", "Marianus");

        //Star of the Earth 2363
        Story.killQuest(2363, "pines", "Pine Troll");

        //The Star of Flames 2364
        Story.killQuest(2364, "greendragon", "Greenguard Dragon");
    }

    gravelynandVictoria(): void {
        if (Core.isCompletedBefore(3370)) {
            return;
        }

        Story.preLoad(this.gravelynandVictoria);

        LoC.ledgermayne();
        LoC.escherion();
        LoC.vath();

        //You'll Poke Your Eye Out 3366
        Story.killQuest(3366, "mobius", "Chaos Sp-eye");

        //Imp-roved Arrows 3367
        Story.killQuest(3367, "mobius", "Fire Imp");

        //Raiders of the Lost Armory 3368
        Story.killQuest(3368, "mobius", "Cyclops Raider");

        //Subtle Persuasion 3369
        Story.killQuest(3369, "faerie", "Cyclops Warlord");

        //Mobilize Mobius 3370
        Story.mapItemQuest(3370, "mobius", 2504, 6);
    }
}

export default function main(): void {
    const script = new Mobius();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
