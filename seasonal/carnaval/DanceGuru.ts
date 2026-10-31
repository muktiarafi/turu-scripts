/*
name: Dance Guru
description: This script farms Diego's and Batista's Quests in danceguru.
tags: dance guru, carnaval, seasonal, storyline, batista, diego
*/
// Port of Scripts/Seasonal/Carnaval/DanceGuru.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class DanceGuru {
    storyline(): void {
        if (Core.isCompletedBefore(7956) || !Core.isSeasonalMapActive("danceguru")) {
            return;
        }

        Story.preLoad(this.storyline);

        //Coconutty (7943)
        if (!Story.questProgression(7943)) {
            Core.ensureAccept(7943);
            Core.huntMonster("danceguru", "Palm Treeant", "Coconut Water", 8);
            Core.huntMonster("danceguru", "Palm Treeant", "Coconut Shavings", 8);
            Core.ensureComplete(7943);
        }

        //Gift Giving (7944)
        if (!Story.questProgression(7944)) {
            Core.ensureAccept(7944);
            Core.getMapItem(8177, 5, "danceguru");
            Core.huntMonster("danceguru", "Crow", "Beads", 7);
            Core.ensureComplete(7944);
        }

        //Clear the Forest (7945)
        Story.killQuest(7945, "danceguru", "Crow");

        //Songs for Dancing (7946)
        Story.killQuest(7946, "danceguru", "Crow");

        //Search! (7947)
        Story.mapItemQuest(7947, "danceguru", 8178);

        //Below the Parade (7948)
        Story.mapItemQuest(7948, "danceguru", 8179);

        //Light it Up (7949)
        Story.killQuest(7949, "danceguru", "Sewer Shroom");

        //Imp-terrogation (7950)
        Story.killQuest(7950, "danceguru", "Voodoo Doll");

        //Snack Time? (7951)
        Story.killQuest(7951, "danceguru", "Sewer Rat");

        //Grime Time (7952)
        Story.killQuest(7952, "danceguru", "Sewer Rat");

        //Save Them (7953)
        Story.mapItemQuest(7953, "danceguru", 8180, 6);

        //Skeleton Party (7954)
        Story.killQuest(7954, "danceguru", "Skele-Tones");

        //Monstrous Feathers (7955)
        Story.killQuest(7955, "danceguru", "Carnaval Harpy");

        //Remove the Mask (7956)
        Core.equipClass(ClassType.Solo);
        Story.killQuest(7956, "danceguru", "Bicho Papao");
    }
}

export default function main(): void {
    const script = new DanceGuru();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
