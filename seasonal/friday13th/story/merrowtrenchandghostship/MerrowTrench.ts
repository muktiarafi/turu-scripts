/*
name: Merrow Trench
description: Completes the Merrow Trench storyline.
tags: merrow trench, story, seasonal, friday the 13th
*/
// Port of Scripts/Seasonal/Friday13th/Story/MerrowTrenchAndGhostShip/MerrowTrench.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../../../core/CoreBots";
import { CoreStory } from "../../../../core/CoreStory";

const Story = new CoreStory();

export class MerrowTrench {
    storyline(): void {
        if (Core.isCompletedBefore(7084)) {
            return;
        }

        Story.preLoad(this.storyline);

        Story.killQuest(7074, "merrowtrench", "Waterlogged Zombie");
        Story.killQuest(7075, "merrowtrench", "Fishwing");

        if (!Story.questProgression(7076)) {
            Core.ensureAccept(7076);
            Core.join("merrowtrench");
            Core.jump("r4", "Left");
            bot.wait.forPickup("Meet Voltaire");
            Core.ensureComplete(7076);
        }

        Story.killQuest(7077, "merrowtrench", "Merdraconian Squatter");
        Story.killQuest(7078, "merrowtrench", "Electric Eel");
        Story.killQuest(7079, "merrowtrench", "Waterlogged Zombie");
        Story.killQuest(7080, "merrowtrench", "Moaney McBoney");
        Story.killQuest(7081, "merrowtrench", "Merdraconian Squatter");
        Story.mapItemQuest(7082, "merrowtrench", 6691);
        if (!Story.questProgression(7083)) {
            Core.ensureAccept(7083);
            Core.getMapItem(6692, 1, "merrowtrench");
            Core.huntMonster("merrowtrench", "Electric Eel", "Explosive Electricity", 10);
            Core.ensureComplete(7083);
        }
        Story.killQuest(7084, "merrowtrench", "Cecaelia");
    }
}

export default function main(): void {
    const script = new MerrowTrench();
    Core.setOptions();
    script.storyline();
    Core.setOptions(false);
}
