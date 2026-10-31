/*
name: Bingwen's Quests
description: Completes Bingwen's Quests in akibacny.
tags: seasonal, yokai, akibacny, akiba new year, story, bingwen
*/
// Port of Scripts/Seasonal/AkibaNewYear/Bingwen.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Bingwen {
    storyline(): void {
        if (Core.isCompletedBefore(7339) || !Core.isSeasonalMapActive("akibacny")) {
            return;
        }

        Story.preLoad(this.storyline);
        //Find Bingwen (7328)
        Story.mapItemQuest(7328, "akibacny", 6976);

        //Pay the Piper (7329)
        Story.killQuest(7329, "akibacny", "Lin Kuei");

        //Pieces of Pipes (7330)
        Story.killQuest(7330, "akibacny", ["Lingzhi", "Lingzhi"]);

        //Oil it up (7331)
        Story.killQuest(7331, "akibacny", "Bamboo Treeant");

        //Get Me an Audience (7332)
        Story.mapItemQuest(7332, "akibacny", [6977, 6978, 6979, 6980, 6981, 6982]);

        //Meet Me at the Palace (7333)
        Story.mapItemQuest(7333, "akibacny", 6983);

        //Catch Some Rats (7334)
        Story.mapItemQuest(7334, "akibacny", 6984, 5);

        //Make Some Traps (7335)
        Story.mapItemQuest(7335, "akibacny", 6985, 6);
        Story.killQuest(7335, "akibacny", "Red Chicken");

        //Those Rats are Mean (7336)
        Story.killQuest(7336, "akibacny", "Mean Rat");

        //EEEEK (7337)
        Story.killQuest(7337, "akibacny", "Ratassassin");

        //Smoke them Out (7338)
        Story.killQuest(7338, "akibacny", ["Lingzhi", "Fiery Lantern"]);

        //Defeat Hinezumi! (7339)
        Core.equipClass(ClassType.Solo);
        Story.killQuest(7339, "akibacny", "Hinezumi");
    }
}

export default function main(): void {
    const script = new Bingwen();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
