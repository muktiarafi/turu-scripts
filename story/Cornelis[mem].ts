/*
name: Cornelis Story (Member)
description: This will complete the Cornelis story.
tags: story, quest, cornelis, member
*/
// Port of Scripts/Story/Cornelis[mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Cornelis {
    storyLine(): void {
        if (!Core.isMember || Core.isCompletedBefore(1632)) {
            return;
        }

        Story.preLoad(this.storyLine);

        // The Missing Vault 1625
        Story.mapItemQuest(1625, "cornelis", 856);

        // The Shattered Lens 1626
        Story.mapItemQuest(1626, "cornelis", 857, 20);

        // The Frame Up 1627
        Story.killQuest(1627, "cornelis", "Gargoyle");

        // The Lenscrafter 1628
        if (!Story.questProgression(1628)) {
            Core.ensureAccept(1628);
            Core.buyItem("yulgar", 366, "The Lens of Cornelis");
            Core.ensureComplete(1628);
        }

        // The Hidden Vault 1629
        Story.mapItemQuest(1629, "cornelis", 858);

        // The Guardian 1630
        Story.killQuest(1630, "cornelis", "Gargantugoyle");

        //The Family Jewels 1631
        Story.mapItemQuest(1631, "cornelis", 859);

        // [BADGE] Cornelis Reborn 1632
        Core.ensureAccept(1632);
        Core.huntMonster("cornelis", "Gargoyle", "Gargoyle Horn", 100, { isTemp: false, log: false });
        Core.ensureComplete(1632);
    }
}

export default function main(): void {
    const script = new Cornelis();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
