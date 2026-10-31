/*
name: Dark Festa
description: Completes Batista's Quests in darkfesta.
tags: dark festa, batista, carnaval, seasonal, story
*/
// Port of Scripts/Seasonal/Carnaval/DarkFesta.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class DarkFesta {
    storyline(): void {
        if (Core.isCompletedBefore(6774) || !Core.isSeasonalMapActive("darkfesta")) {
            return;
        }

        Story.preLoad(this.storyline);

        //Gather the Flames (6762)
        Story.killQuest(6762, "darkfesta", "Mula Sem Cabeça");

        //Branching Out (6763)
        Story.killQuest(6763, "darkfesta", "Bamboo Treeant");

        //Torch the Torches (6764)
        Story.mapItemQuest(6764, "darkfesta", 6291, 6);

        //Explore Boitata's Lair (6765)
        Story.mapItemQuest(6765, "darkfesta", 6292, 6);
        Story.mapItemQuest(6765, "darkfesta", 6293);

        //Destroy the Growth (6766)
        Story.mapItemQuest(6766, "darkfesta", 6294);

        //Reduce the Darkness (6767)
        Story.killQuest(6767, "darkfesta", "Darkness Elemental");

        if (!Story.questProgression(6768)) {
            //Just a Little Snack (6769)
            Core.ensureAcceptmultiple(6768, 6769);
            Core.huntMonster("darkfesta", "Bamboo Treeant", "Bamboo Leaves", 8);
            Core.ensureComplete(6769);
            Core.ensureComplete(6768);
        }

        //Scales for Feathers (6770)
        Story.mapItemQuest(6770, "darkfesta", 6295, 4);

        //Time for Fire (6771)
        Story.killQuest(6771, "darkfesta", "Mula Sem Cabeça");

        //A Shot in the... Dark (6772)
        Story.mapItemQuest(6772, "darkfesta", 6296);

        //Reduce the Shadow (6773)
        Story.killQuest(6773, "darkfesta", "Infectious Shadow");

        //Light Him Up (6774)
        Core.equipClass(ClassType.Solo);
        Story.killQuest(6774, "darkfesta", "Dark Boitata");
    }
}

export default function main(): void {
    const script = new DarkFesta();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
