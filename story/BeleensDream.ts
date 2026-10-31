/*
name: Beleen's Dream Story
description: This will complete the Beleen's Dream story.
tags: story, quest, beleens-dream
*/
// Port of Scripts/Story/BeleensDream.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class BeleensDream {
    storyLine(): void {
        if (Core.isCompletedBefore(3365)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Crabby Valentine 3356
        Story.killQuest(3356, "beleensdream", "Beach Crab");

        //Chinchillin' 3357
        Story.killQuest(3357, "beleensdream", "Chinchilla");

        //Confectionary Wisdom 3358
        Story.killQuest(3358, "beleensdream", "Fortune Cookie");

        //Loony balloons 3359
        if (!Story.questProgression(3359)) {
            Core.ensureAccept(3359);
            Core.getMapItem(2475, 1, "beleensdream");
            Core.getMapItem(2476, 3, "beleensdream");
            Core.huntMonster("beleensdream", "Bulloon", "Popped Air Heads", 4);
            Core.ensureComplete(3359);
        }

        //Disgruntled Draconians 3360
        Story.killQuest(3360, "beleensdream", "Disgruntled Draconian");

        //Paws n' D'awwws! 3361
        Story.killQuest(3361, "beleensdream", "Disgruntled Doomkitten");

        //Power of Love... Elementals 3362
        Story.killQuest(3362, "beleensdream", "Heart Elemental");

        //Red Velvet Cake Rope 3363
        if (!Story.questProgression(3363)) {
            Core.ensureAccept(3363);
            Core.huntMonster("beleensdream", "Beach Crab", "Crustacean Construct");
            Core.huntMonster("beleensdream", "Fortune Cookie", "Solidified Sugar");
            Core.huntMonster("beleensdream", "Bulloon", "Indestructible Latex");
            Core.huntMonster("beleensdream", "Disgruntled Draconian", "Draconian's Blade");
            Core.ensureComplete(3363);
        }

        //The Legendary Cherry 3364
        Story.mapItemQuest(3364, "beleensdream", 2477);

        //Your Just Deserts 3365
        Story.killQuest(3365, "beleensdream", "Bluddron the Betrayer");
    }
}

export default function main(): void {
    const script = new BeleensDream();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
