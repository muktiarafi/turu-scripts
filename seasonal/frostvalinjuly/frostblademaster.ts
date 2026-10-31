/*
name: Frost Blade Master
description: Does the seasonal quests of frostblademaster in /akibalight
tags: frost, blade, master, seasonal, akiba, light
*/
// Port of Scripts/Seasonal/FrostvalInJuly/frostblademaster.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class FrostBladeMaster {
    sagaName(): void {
        if (Core.isCompletedBefore(6992) || !Core.isSeasonalMapActive("akibalight")) {
            Core.logger("You've already completed this storyline");

            return;
        }
        Story.preLoad(this.sagaName);

        //Decorations - Paper Lanterns 6982
        if (!Story.questProgression(6982)) {
            Core.ensureAccept(6982);
            Core.killMonster("junkyard", "r2", "Left", "Tsukumo-Gami", "Festival Lantern", 11);
            Core.ensureComplete(6982);
        }

        //Decorations - Light Them Up 6983
        Story.killQuest(6983, "greenshell", "Tsurubebi");

        //Decorations - Streamers 6984
        Story.killQuest(6984, "yokaiboat", "Kappa Ninja");

        //Time to Decorate 6985
        Story.mapItemQuest(6985, "akibalight", 49148, 8);
        Story.mapItemQuest(6985, "akibalight", 49149, 11);

        //Nekomimis Gift 6986
        Story.killQuest(6986, "yokaigrave", "Skello Kitty");

        //Mitsu Bishis Gift 6987
        if (!Story.questProgression(6987)) {
            Core.ensureAccept(6987);
            Core.huntMonster("bamboo", "Tanuki", "Bamboo Carafe", 1);
            Core.huntMonster("bamboo", "Tanuki", "Bamboo Cup", 4);
            Core.ensureComplete(6987);
        }

        //Kunoichis Gift 6988
        Story.killQuest(6988, "pirates", "Fishwing");

        //Kages Gift 6989
        Story.killQuest(6989, "hachiko", "Ninja Nopperabo");

        //Dinner Time 6990
        Story.killQuest(6990, "pirates", "Shark Bait");

        //Fireworks 6991
        Story.killQuest(6991, "odokuro", "O-dokuro");

        //Search for Gifts 6992
        Story.killQuest(6992, "bamboo", "Bamboo Wisp");
    }
}

export default function main(): void {
    const script = new FrostBladeMaster();
    Core.setOptions();

    script.sagaName();
    Core.setOptions(false);
}
