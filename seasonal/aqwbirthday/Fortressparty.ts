/*
name: Fortressparty
description: Completes the quest chain in /fortressparty.
tags: fortressparty, story, quests, fortressparty
*/
// Port of Scripts/Seasonal/AqwBirthday/Fortressparty.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Fortressparty {
    storyline(): void {
        if (Core.isCompletedBefore(10892)) {
            return;
        }

        Story.preLoad(this.storyline);

        const UseableMonsters = [
            "Alteon Cosplayer",
            "Athon Cosplayer",
            "Doom Figment",
            "Drago Cosplayer",
            "Empire Reveler",
            "Fiend Servant",
            "Hopeful Shadow",
            "Photoghoulpher",
            "Shadowmuncher",
        ];

        // 10883 | Party Crashout
        Story.killQuest(10883, "fortressparty", UseableMonsters[4]);
        // Stolen Presents x12

        // 10884 | Cake Conquest
        Story.killQuest(10884, "fortressparty", UseableMonsters[8]);
        // Cake Slice x60

        // 10885 | Spirited Photography
        Story.killQuest(10885, "fortressparty", UseableMonsters[7]);
        // Broken Camera x12

        // 10886 | Pain Proxy
        Story.killQuest(10886, "fortressparty", UseableMonsters[5]);
        // Fiend Servant Subdued x1

        // 10887 | Mar-Athon of Sorrow
        Story.killQuest(10887, "fortressparty", UseableMonsters[1]);
        // Athon Costume x1

        // 10888 | King of the Party
        Story.killQuest(10888, "fortressparty", UseableMonsters[0]);
        // King Alteon Costume x1

        // 10889 | Fate's Facilitators
        Story.killQuest(10889, "fortressparty", UseableMonsters[2]);
        // Doom Residue x6

        // 10890 | Here, Kitty Kitty!
        Story.killQuest(10890, "fortressparty", UseableMonsters[3]);
        // Drago Costume x1

        // 10891 | Ruined Surprise
        Story.mapItemQuest(10891, "fortressparty", 16250);

        // 10892 | Just a Dad
        Story.killQuest(10892, "fortressparty", UseableMonsters[6]);
        // Hopeful Shadow Defeated x1
    }
}

export default function main(): void {
    const script = new Fortressparty();
    Core.setOptions();
    script.storyline();
    Core.setOptions(false);
}
