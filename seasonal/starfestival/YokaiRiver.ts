/*
name: Yokai River
description: This script will complete the storyline in /yokaistarriver.
tags: star, festival, yokai, yokaistarriver, river, story, seasonal
*/
// Port of Scripts/Seasonal/StarFestival/YokaiRiver.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { Akiba } from "./Akiba";

const Story = new CoreStory();
const akiba = new Akiba();

export class YokaiRiver {
    storyline(): void {
        if (Core.isCompletedBefore(6448) || !Core.isSeasonalMapActive("yokaistarriver")) {
            return;
        }

        akiba.storyline();

        Story.preLoad(this.storyline);

        // Gather the Spirits (6443)
        if (!Story.questProgression(6443)) {
            Core.ensureAccept(6443);
            Core.getMapItem(5949, 5, "yokaistarriver");
            Core.huntMonster("yokaistarriver", "Ghostly Chickencow", "Spirit Captured", 10);
            Core.ensureComplete(6443);
        }

        // Spiders and Dreamsilk (6444)
        Story.killQuest(6444, "yokaistarriver", "Spirit Spider");

        // Dye-ing to Reunite (6445)
        Story.killQuest(6445, "yokaistarriver", "Fallen Star");

        // Clear Water to Clear Skies (6446)
        Story.killQuest(6446, "yokaistarriver", "Funa-yurei");

        // 1,000 Cranes to 1,000 Wishes (6447)
        Story.mapItemQuest(6447, "yokaistarriver", 5950, 18);

        // Slay Uji No Hashihime (6448)
        Story.killQuest(6448, "yokaistarriver", "Uji No Hashihime");
    }
}

export default function main(): void {
    const script = new YokaiRiver();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
