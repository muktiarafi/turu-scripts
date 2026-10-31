/*
name: Tournament Story
description: This will finish the Tournament Story.
tags: story, quest, tournament
*/
// Port of Scripts/Story/Tournament.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Tournament {
    storyLine(): void {
        if (Core.isCompletedBefore(2717)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Guard Swordhaven 2708
        if (!Story.questProgression(2708)) {
            Core.ensureAccept(2708);
            Core.getMapItem(1682, 5, "tournament");
            Core.huntMonster("tournament", "Suspicious Spy Bot ", "Bot Disabled", 5);
            Core.ensureComplete(2708);
        }

        //Stalkers and Mercenaries 2709
        if (!Story.questProgression(2709)) {
            Core.ensureAccept(2709);
            Core.huntMonster("tournament", "Mercenary", "Mercenary Slain", 4);
            Core.huntMonster("tournament", "SandStalker", "Intruder Slain", 3);
            Core.ensureComplete(2709);
        }

        //Brave the Bandits 2710
        Story.killQuest(2710, "tournament", "Greenguard Bandit");

        //Find the Princesses! 2711
        if (!Story.questProgression(2711)) {
            Core.ensureAccept(2711);
            Core.getMapItem(1683, 1, "tournament");
            Core.huntMonster("tournament", "Princess Tara", "Tara is Safe", 1);
            Core.ensureComplete(2711);
        }

        //Find Princess Brittany! 2712
        Story.mapItemQuest(2712, "tournament", 1684);

        //Battle Khai Kaldun 2713
        Story.killQuest(2713, "tournament", "Khai Khaldun");

        //Battle Johann Wryce 2714
        Story.killQuest(2714, "tournament", "Johann Wryce");

        //Battle the Knight of Thorns 2715
        Story.killQuest(2715, "tournament", "Knight of Thorns");

        //Battle Roderick 2716
        Story.killQuest(2716, "tournament", "Roderick");

        //Battle Lord Brentan 2717
        Story.killQuest(2717, "tournament", "Lord Brentan");
    }
}

export default function main(): void {
    const script = new Tournament();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
