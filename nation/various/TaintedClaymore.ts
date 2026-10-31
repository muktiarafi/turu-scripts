/*
name: Tainted Claymore
description: This script farms the Tainted Claymore weapon.
tags: claymore, nulgath, skew, warrior, blade, enchant, poisonous deal
*/
// Port of Scripts/Nation/Various/TaintedClaymore.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreStory } from "../../core/CoreStory";

const Farm = new CoreFarms();
const Story = new CoreStory();

export class TaintedClaymore {
    doAll(): void {
        this.preReq();
        this.getWep();
    }

    preReq(): void {
        if (Core.isCompletedBefore(324)) {
            return;
        }

        Story.preLoad(this.preReq);

        //Adorable Sisters
        Story.mapItemQuest(319, "tavern", 56, 7);

        //Warm and Furry
        Story.killQuest(320, "pines", "Pine Grizzly");

        //Shell Rock
        Story.killQuest(321, "pines", "Red Shell Turtle");

        //Bear Facts
        Story.killQuest(322, "pines", "Twistedtooth");

        //The Spittoon Saloon
        Story.killQuest(324, "pines", "Red Shell Turtle");
    }

    getWep(): void {
        if (Core.checkInventory("Tainted Claymore")) {
            return;
        }

        Core.addDrop("Tainted Claymore");

        Farm.evilREP(8);

        Core.ensureAccept(121);
        Core.huntMonster("battleundera", "Undead Berserker", "Warrior Claymore Blade", undefined, { isTemp: false });
        Core.ensureComplete(121);
    }
}

export default function main(): void {
    const script = new TaintedClaymore();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
