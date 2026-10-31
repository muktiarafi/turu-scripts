/*
name: Dwarfhold story
description: This will finish the Dwarfhold story.
tags: story, quest, dwarfhold
*/
// Port of Scripts/Story/Dwarfhold.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";
import { Core13LoC } from "./lordsofchaos/Core13LoC";

const Story = new CoreStory();
const LoC = new Core13LoC();

export class Dwarfhold {
    doAll(): void {
        this.storyLine();
        this.gravelynandVictoria();
    }

    storyLine(): void {
        if (Core.isCompletedBefore(1757)) {
            return;
        }

        Story.preLoad(this.storyLine);

        this.gravelynandVictoria();

        if (Core.isMember) {
            //The Tools and the Talent 1743
            Story.killQuest(1743, "dwarfhold", "Chaotic Draconian");

            //The Shining 1744
            Story.killQuest(1744, "dwarfhold", "Glow Worm");

            //Your Ad Here 1745
            Story.mapItemQuest(1745, "dwarfhold", 929, 12);

            //Coal Hard Facts 1746
            Story.mapItemQuest(1746, "dwarfhold", 930, 15);

            //Material World 1747
            Story.killQuest(1747, "dwarfhold", "Chaotic Draconian");

            //You're A Gem 1748
            Story.killQuest(1748, "dwarfhold", "Chaotic Draconian");

            //Ore Eaters 1749
            Story.killQuest(1749, "dwarfhold", "Glow Worm");

            //More Tools? Really? 1750
            Story.killQuest(1750, "dwarfhold", "Amadeus");

            //The Strapping Hero 1751
            Story.killQuest(1751, "dwarfhold", "Albino Bat");

            //The UnderHammers 1752
            Story.mapItemQuest(1752, "dwarfhold", 931, 8);

            //Fighting Back 1753
            Story.killQuest(1753, "dwarfhold", "Chaos Drow");

            //Product 1754
            Story.killQuest(1754, "dwarfhold", "Glow Worm");

            //Earn Your Stripes 1755
            Story.killQuest(1755, "dwarfhold", "Albino Bat");

            //Stay Sharp  1756
            Story.mapItemQuest(1756, "dwarfhold", 932, 10);

            //Get Us Some Business! 1757
            Story.killQuest(1757, "dwarfhold", "Albino Bat");
        }
    }

    gravelynandVictoria(): void {
        if (Core.isCompletedBefore(3380)) {
            return;
        }

        Story.preLoad(this.gravelynandVictoria);

        LoC.ledgermayne();
        LoC.escherion();
        LoC.vath();

        //Whats Worse Than Drow? 3376
        Story.killQuest(3376, "dwarfhold", "Chaos Drow");

        //We Can Replenish Our Armory Too! 3377
        Story.killQuest(3377, "dwarfhold", "Chaotic Draconian");

        //Begemralded 3378
        Story.killQuest(3378, "dwarfhold", "Gemrald");

        //Natural Resources 3379
        Story.killQuest(3379, "dwarfhold", "Glow Worm");

        //Rally the Troops 3380
        Story.mapItemQuest(3380, "dwarfhold", [2506, 2508, 2509, 2510, 2511]);
    }
}

export default function main(): void {
    const script = new Dwarfhold();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
