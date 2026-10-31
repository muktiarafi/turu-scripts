/*
name: Grenstory
description: This script will complete the questline in grenstory.
tags: grenstory, seasonal, grenwog, easter
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/Grenstory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Grenstory {
    storyline(): void {
        if (Core.isCompletedBefore(4936) || !Core.isSeasonalMapActive("grenstory")) {
            return;
        }

        Story.preLoad(this.storyline);

        // Egg-Streme Attraction (4925)
        Story.killQuest(4925, "grenstory", "Chinchilizard");

        // Rotten Eggs?! (4926)
        Story.killQuest(4926, "grenstory", "Imposter Egg");

        // Protect the Grenwog (4927)
        Story.killQuest(4927, "grenstory", "Lemurphant");

        // Ceremony at Risk (4928)
        Story.killQuest(4928, "grenstory", ["Jurassic Orc", "Jurassic Orc", "Jurassic Orc"]);

        // Bloodtusk Vision Quest (4929)
        Story.killQuest(4929, "grenstory", ["Ravine Tigriff", "Chinchilizard", "Rhison", "Lemurphant"]);

        // Armed with Spirit (4930)
        Story.killQuest(4930, "grenstory", ["Lemurphant", "Rhison", "Dinoid"]);

        // Cheers to You! (4931)
        Story.killQuest(4931, "grenstory", ["Rhison", "Imposter Egg", "Chinchilizard", "Chinchilizard"]);

        // Staff of Heroes (4932)
        Story.killQuest(4932, "grenstory", "Ravine Tigriff");

        // Ritual of Heroes (4933)
        Story.killQuest(4933, "grenstory", "Jurassic Grenwog");

        // Grelot: Grenwog Gauntlet (4934)
        if (!Story.questProgression(4934)) {
            Core.addDrop("Grenwog Defeated");
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(4934);
            Core.huntMonster("grenstory", "Jurassic Grenwog", "Grenwog Defeated", 50, { isTemp: false, log: false });
            Core.ensureComplete(4934);
            Core.equipClass(ClassType.Farm);
        }
    }
}

export default function main(): void {
    const script = new Grenstory();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
