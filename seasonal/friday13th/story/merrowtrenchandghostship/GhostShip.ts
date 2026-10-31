/*
name: Ghost Ship
description: Completes the Ghost Ship storyline after Merrow Trench.
tags: ghost ship, story, seasonal, friday the 13th
*/
// Port of Scripts/Seasonal/Friday13th/Story/MerrowTrenchAndGhostShip/GhostShip.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../../../core/CoreBots";
import { CoreStory } from "../../../../core/CoreStory";

const Story = new CoreStory();

export class GhostShip {
    storyline(): void {
        if (Core.isCompletedBefore(7101)) {
            return;
        }

        if (!Core.isCompletedBefore(7084)) {
            Core.logger("Complete the Merrow Trench storyline first.", undefined, { messageBox: true, stopBot: true });
            return;
        }

        Story.preLoad(this.storyline);

        Story.killQuest(7089, "ghostship", "Spectro-Plasm");
        Story.killQuest(7090, "ghostship", "Spooky Sailor");
        Story.killQuest(7091, "ghostship", "Spectro-Plasm");
        Story.killQuest(7092, "ghostship", "Ghostly Fishwing");
        Story.mapItemQuest(7093, "ghostship", 6695);
        Story.killQuest(7094, "ghostship", "Ghostly Fishwing");
        Story.mapItemQuest(7095, "ghostship", 6696);
        Story.killQuest(7096, "ghostship", "Ghostly Fishwing");
        Story.mapItemQuest(7097, "ghostship", 6697);
        Story.killQuest(7098, "ghostship", "Sea Wraith");

        if (!Story.questProgression(7099)) {
            Core.ensureAccept(7099);
            Core.huntMonster("ghostship", "Ghostly Eel", "Monster Slain", 9);
            Core.jump("r9", "Left");
            bot.wait.forPickup("Reach the Door");
            Core.ensureComplete(7099);
        }

        if (!Story.questProgression(7100)) {
            Core.ensureAccept(7100);
            Core.getMapItem(6698, 1, "ghostship");
            Core.huntMonster("ghostship", "Ghostly Eel", "Ghostly Electricity", 8);
            Core.ensureComplete(7100);
        }
        Story.killQuest(7101, "ghostship", "Cursed Cecaelia");
    }
}

export default function main(): void {
    const script = new GhostShip();
    Core.setOptions();
    script.storyline();
    Core.setOptions(false);
}
