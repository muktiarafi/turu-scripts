/*
name: Pirates Story (Member)
description: This will finish the Pirates Story.
tags: story, quest, pirates, member
*/
// Port of Scripts/Story/Pirates[Member].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Pirates {
    storyLine(): void {
        if (Core.isCompletedBefore(1541) || !Core.isMember) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Shape of the Ship? 1534
        Story.mapItemQuest(1534, "pirates", 769, 3);

        //Skeleton Crew, Skeleton Key 1535
        Story.killQuest(1535, "pirates", "Undead Pirate");

        //Dead Journal 1536
        Story.mapItemQuest(1536, "pirates", 770);

        //Sold Out! 1537
        Story.killQuest(1537, "pirates", "Undead Pirate");

        //Abandon All Hope... 1538
        Story.killQuest(1538, "pirates", "Undead Pirate");

        //In The Drink 1539
        Story.killQuest(1539, "pirates", "Undead Pirate");

        //Below Decks 1540
        Story.mapItemQuest(1540, "pirates", 771, 10);

        //Blow Stuff Up! 1541
        if (!Story.questProgression(1541)) {
            Core.ensureAccept(1541);
            Core.getMapItem(772, 10, "pirates");
            Core.huntMonster("pirates", "Undead Pirate", "Fuse", 10);
            Core.ensureComplete(1541);
        }
    }
}

export default function main(): void {
    const script = new Pirates();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
