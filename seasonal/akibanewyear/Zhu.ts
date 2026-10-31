/*
name: Zhu's Quests
description: Completes Zhu's Quests in zhu.
tags: seasonal, yokai, akiba new year, zhu, akibacny, story
*/
// Port of Scripts/Seasonal/AkibaNewYear/Zhu.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Zhu {
    storyline(): void {
        if (Core.isCompletedBefore(6723) || !Core.isSeasonalMapActive("zhu")) {
            return;
        }

        Story.preLoad(this.storyline);

        //Shake a Tailfeather (6713)
        Story.killQuest(6713, "akibacny", "Red Chicken");

        //Get Incensed (6714)
        Story.killQuest(6714, "akibacny", "Lingzhi");

        //Smell that Smell (6715)
        Story.mapItemQuest(6715, "akibacny", 6196);

        //A Gift of Plums (6716)
        Story.killQuest(6716, "zhu", "Plum Treeant");

        //A Taste of Truffles (6717)
        Story.killQuest(6717, "zhu", "Heizhi");

        //Om Nom Nom (6718)
        Story.mapItemQuest(6718, "zhu", 6197, 5);
        Story.killQuest(6718, "zhu", "BigTruffle");

        //Follow the Tracks (6719)
        Story.mapItemQuest(6719, "zhu", 6198, 3);
        Story.killQuest(6719, "zhu", "Mogui");

        //Get out of Here! (6720)
        Story.mapItemQuest(6720, "zhu", 6199);

        //Smackdown! (6721)
        Story.killQuest(6721, "zhu", "Xingzhi");

        //The Acorn (6722)
        Story.mapItemQuest(6722, "zhu", 6200);

        //Let Me Out! (6723)
        Core.equipClass(ClassType.Solo);
        Story.killQuest(6723, "zhu", "Jing");
    }
}

export default function main(): void {
    const script = new Zhu();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
