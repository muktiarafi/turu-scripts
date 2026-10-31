/*
name: Loves Curse
description: This will complete the Loves Curse story quest.
tags: story, quest, hero, heart, seasonal, loves, curse
*/
// Port of Scripts/Seasonal/HerosHeartDay/LovesCurse.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class LovesCurse {
    storyline(): void {
        if (!Core.isSeasonalMapActive("lovescurse") || Core.isCompletedBefore(1671)) {
            return;
        }

        Story.preLoad(this.storyline);

        // Intro To Love (1665)
        Story.chainQuest(1665);

        //Find the Rest of J6 (1656)
        if (!Story.questProgression(1656)) {
            Core.ensureAccept(1656);
            Core.huntMonster("curseshore", "Escaped Ghostly Zardman", "Cyborg Arm", 2);
            Core.huntMonster("curseshore", "Escaped Ghostly Zardman", "Cyborg Leg", 2);
            Core.huntMonster("curseshore", "Escaped Ghostly Zardman", "Cyborg Chassis", 1);
            Core.ensureComplete(1656);
        }

        //Mer'Angel Hunting (1657)
        Story.mapItemQuest(1657, "curseshore", 865);

        //Into the Underworld (1666)
        Story.chainQuest(1666);

        //Search for the Cursed Lovers (1658)
        Story.mapItemQuest(1658, "curseblue", 866);

        //Love Ghosts (1667)
        Story.chainQuest(1667);

        //Sing the Blues (1659)
        Story.killQuest(1659, "curseblue", "Ghostly Aracara");

        //Land of the Red (1660)
        Story.mapItemQuest(1660, "cursered", 868);

        //Help Moore (1668)
        Story.chainQuest(1668);

        //Find the Source of the Curse (1661)
        if (!Story.questProgression(1661)) {
            Core.ensureAccept(1661);
            Core.huntMonster("cursered", "Cyclops Warlord Ghost", "Key of True Love", 1);
            Core.huntMonster("cursered", "Cyclops Warlord Ghost", "Key of Eternity", 1);
            Core.ensureComplete(1661);
        }

        //Defeat the CurseMaker (1662)
        Story.killQuest(1662, "mercutio", "*");

        //Mercutio (1669)
        Story.chainQuest(1669);

        //One Moore Time (1663)
        Story.mapItemQuest(1663, "cursered", 869);

        //Out of Time (1670)
        Story.chainQuest(1670);

        //You Only Get One Shot at True Love (1664)
        Story.mapItemQuest(1664, "curseblue", 867);

        //Happy Ending (1671)
        Story.chainQuest(1671);
    }
}

export default function main(): void {
    const script = new LovesCurse();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
