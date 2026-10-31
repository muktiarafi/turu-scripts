/*
name: Golden Arena (Extra)
description: This will finish the Golden Arena quest.
tags: story, quest, queen-of-monsters, golden-arena, extra
*/
// Port of Scripts/Story/QueenofMonsters/Extra/GoldenArena.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";

const Story = new CoreStory();

export class GoldenArena {
    storyLine(): void {
        if (Core.isCompletedBefore(6085)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Greenguard Champion Badge 6076
        Story.killQuest(6076, "DragonChallenge", "Greenguard Dragon");

        //Draconic Laurel Challenge 6077
        Story.killQuest(6077, "GoldenArena", "Blessed Dragon");

        //Inquisitor's Champion Badge 6078
        Story.killQuest(6078, "Citadel", "Grand Inquisitor");

        //Grand Laurel Challenge 6079
        Story.killQuest(6079, "GoldenArena", "Blessed Inquisitor");

        //SkyGuard Champion Badge 6080
        Story.killQuest(6080, "Airship", "Gladius");

        //Aeriel Laurel Challenge 6081
        Story.killQuest(6081, "GoldenArena", "Blessed Gladius");

        //Fallen Champion Badge 6082
        Story.killQuest(6082, "northstar", "Karok The Fallen");

        //Ascension Laurel Challenge 6083
        Story.killQuest(6083, "GoldenArena", "Blessed Karok");

        //Seraphic Champion Badge 6084
        Story.killQuest(6084, "Envy ", "Queen of Envy");

        //Golden Laurel Challenge 6085
        Story.killQuest(6085, "GoldenArena", "Queen of Hope");
    }
}

export default function main(): void {
    const script = new GoldenArena();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
