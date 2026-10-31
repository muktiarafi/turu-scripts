/*
name: Nythera Saga Story
description: This will finish the Nythera Saga Story.
tags: story, quest, nythera
*/
// Port of Scripts/Story/NytheraSaga.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class NytheraSaga {
    doAll(): void {
        if (Core.isCompletedBefore(904)) {
            return;
        }

        this.northlands();
        this.kingCoal();
        this.swallowed();
        this.blindingSnow();
        this.void();
    }

    northlands(): void {
        if (Core.isCompletedBefore(444)) {
            return;
        }

        Story.preLoad(this.northlands);

        //Element of Surprise 437
        if (!Story.questProgression(437)) {
            Core.ensureAccept(437);
            Core.getMapItem(77, 1, "NorthLands");
            Core.huntMonster("northlands", "Snow Golem", "Code Notes", 1);
            Core.ensureComplete(437);
        }

        //Interrogation 438
        Story.killQuest(438, "NorthLands", "Snow Golem");

        //Locked on Combinations 439
        if (!Story.questProgression(439)) {
            Core.ensureAccept(439);
            Core.huntMonster("northlands", "Snow Golem", "Second Combination Number 3", 1);
            Core.huntMonster("northlands", "Snow Golem", "Third Combination Number 4", 1);
            Core.huntMonster("northlands", "Snow Golem", "Fourth Combination Number 7", 1);
            Core.ensureComplete(439);
        }

        //Combo Breaker 440
        Story.killQuest(440, "NorthLands", "Snow Golem");

        //Open the Door 8690
        Story.mapItemQuest(8690, "NorthLands", 80);

        //The Cave 8689
        Story.mapItemQuest(8689, "NorthLands", 10205);

        //Aisha's Minion 443
        Story.killQuest(443, "NorthLands", "Water Draconian");

        //Aisha 444
        Story.killQuest(444, "NorthLands", "Aisha's Drake");
    }

    kingCoal(): void {
        if (Core.isCompletedBefore(449)) {
            return;
        }

        //Yellow Snow Cone 447
        if (!Story.questProgression(447)) {
            Core.ensureAccept(447);
            Core.huntMonster("kingcoal", "Snow Golem", "Yellow Snow Syrup Bottle", 2);
            Core.huntMonster("kingcoal", "Snow Golem", "Shaved Ice Bundle", 8);
            Core.ensureComplete(447);
        }

        //Cool Down Items 448
        Story.killQuest(448, "KingCoal", "Snow Golem");

        //Take a Chill Pill 449
        Story.killQuest(449, "KingCoal", "Snow Golem");
    }

    swallowed(): void {
        if (Core.isCompletedBefore(455)) {
            return;
        }

        Story.preLoad(this.swallowed);

        //Defeat 10 Viruses 450
        Story.killQuest(450, "Swallowed", "Germs");

        //Defeat 10 More 451
        Story.killQuest(451, "Swallowed", "Germs");

        //30? No way! 452
        Story.killQuest(452, "Swallowed", "Germs");

        //Add 10 More 453
        Story.killQuest(453, "Swallowed", "Germs");

        //50 is RIGHT OUT! 454
        Story.killQuest(454, "Swallowed", "Germs");

        //Anything but Common 455
        Story.killQuest(455, "Swallowed", "Rhinovirus");
    }

    blindingSnow(): void {
        if (Core.isCompletedBefore(900)) {
            return;
        }

        Story.preLoad(this.blindingSnow);

        //Chasing After a Girl 898
        if (!Story.questProgression(898)) {
            Core.ensureAccept(898);
            if (!Core.checkInventory("C.P.S.")) {
                Core.addDrop("C.P.S.");
                Core.getMapItem(233, 10, "BlindingSnow");
                Core.getMapItem(235, 1, "Northlands");
            }
            Core.ensureComplete(898);
        }

        //Tracking Down Nythera 899
        Story.killQuest(899, "BlindingSnow", "Nythera");

        //Searching for Splinters 900
        Story.killQuest(900, "BlindingSnow", "Chaorrupted Wolf");
    }

    void(): void {
        if (Core.isCompletedBefore(904)) {
            return;
        }

        Story.preLoad(this.void);

        //A-Void-ing The Larva 901
        Story.killQuest(901, "Void", "Void Larva");

        //Spawn Point 902
        Story.killQuest(902, "Void", "Void Elemental");

        //Null and Void Spheres 903
        if (!Story.questProgression(903)) {
            Core.ensureAccept(903);
            Core.huntMonster("palooza", "Discordia", "Red Void Sphere", 1, { isTemp: false });
            Core.huntMonster("palooza", "Discordia", "Blue Void Sphere", 1, { isTemp: false });
            Core.huntMonster("palooza", "Discordia", "Green Void Sphere", 1, { isTemp: false });
            Core.huntMonster("palooza", "Discordia", "Yellow Void Sphere", 1, { isTemp: false });
            Core.ensureComplete(903);
        }

        //Enter the Great Void Dragon's Lair 904
        Story.killQuest(904, "Void", "Void Dragon");
    }
}

export default function main(): void {
    const script = new NytheraSaga();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
