/*
name: Ubear Story
description: This will finish the Ubear Story.
tags: story, quest, ubear
*/
// Port of Scripts/Story/Ubear.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Ubear {
    storyLine(): void {
        if (Core.isCompletedBefore(7442)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Ubear Token 7430
        Story.buyQuest(7430, "ubear", 1851, "Ubear Token");

        //WHY ARE THERE BEES?! 7431
        Story.killQuest(7431, "ubear", "Giant Bee");

        //That’s How We’ll Get Ants 7432
        if (!Story.questProgression(7432)) {
            Core.ensureAccept(7432);
            Core.getMapItem(7199, 5, "ubear");
            Core.huntMonster("ubear", "Honey Glob", "Honey Cleaned", 10);
            Core.ensureComplete(7432);
        }

        //Door Jam 7433
        if (!Story.questProgression(7433)) {
            Core.ensureAccept(7433);
            Core.getMapItem(7200, 1, "ubear");
            Core.huntMonster("ubear", "Giant Bee", "Strong Stinger", 8);
            Core.ensureComplete(7433);
        }

        //Oh... gross 7434
        Story.killQuest(7434, "ubear", "Lil' Poot");

        //Blockage 7435
        Story.killQuest(7435, "ubear", "Cornholio");

        //LIMft Token 7436
        Story.buyQuest(7436, "limft", 1852, "LIMFT Token");

        //FIRE! 7437
        Story.killQuest(7437, "limft", "Electrical Fire");

        //Smoke! 7438
        if (!Story.questProgression(7438)) {
            Core.ensureAccept(7438);
            Core.getMapItem(7201, 6, "limft");
            Core.huntMonster("limft", "Smoke Elemental", "Smoke Elemental Slain", 10);
            Core.ensureComplete(7438);
        }

        //Scavengers 7439
        if (!Story.questProgression(7439)) {
            Core.ensureAccept(7439);
            Core.getMapItem(7202, 5, "limft");
            Core.huntMonster("limft", "Smoke Elemental", "Nuts", 5);
            Core.huntMonster("limft", "Smoke Elemental", "Bolts", 5);
            Core.ensureComplete(7439);
        }

        //Repair Time 7440
        Story.mapItemQuest(7440, "limft", 7203, 6);

        //Get Proof 7441
        Story.killQuest(7441, "limft", "Sock Golem");

        //Stop the (U)bear! 7442
        Story.killQuest(7442, "limft", "Ubear");
    }
}

export default function main(): void {
    const script = new Ubear();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
