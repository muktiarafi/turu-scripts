/*
name: Fortress Delve Story
description: This will complete the Fortress Delve story.
tags: story, quest, fortress, delve, legion, staff, birthday
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/FortressDelve.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";
import { TempleDelve } from "../nulgath/TempleDelve";

const Story = new CoreStory();
const TD = new TempleDelve();

export class FortressDelve {
    doStory(): void {
        TD.storyline();
        if (Core.isCompletedBefore(9169)) {
            return;
        }
        if (!Core.isSeasonalMapActive("fortressdelve")) {
            return;
        }

        Story.preLoad(this.doStory);

        //Budding Scolex 9160
        Story.killQuest(9160, "fortressdelve", "Doom Worm");

        //Scuffling Shadows 9161
        Story.mapItemQuest(9161, "fortressdelve", 11345);
        Story.mapItemQuest(9161, "fortressdelve", 11346, 2);
        Story.mapItemQuest(9161, "fortressdelve", 11347, 3);

        //Humans DNI 9162
        if (!Story.questProgression(9162)) {
            Core.ensureAccept(9162);
            Core.getMapItem(11348, 1, "fortressdelve");
            Core.huntMonster("fortressdelve", "Doomed Beast", "Beast's Vein", 7);
            Core.ensureComplete(9162);
        }

        //Scion's Privilege 9163
        if (!Story.questProgression(9163)) {
            Core.ensureAccept(9163);
            Core.getMapItem(11349, 1, "fortressdelve");
            Core.huntMonster("fortressdelve", "Doom Worm", "Worm Disintegrated", 6);
            Core.ensureComplete(9163);
        }

        //A Man-Cave and a Box of Scraps 9164
        if (!Story.questProgression(9164)) {
            Core.ensureAccept(9164);
            Core.getMapItem(11350, 1, "fortressdelve");
            Core.huntMonster("fortressdelve", "Legion Dreadmarch", "Dreadmarch Armor Scraps", 6);
            Core.ensureComplete(9164);
        }

        //The Glare of the Light... 9165
        if (!Story.questProgression(9165)) {
            Core.ensureAccept(9165);
            Core.getMapItem(11351, 1, "fortressdelve");
            Core.huntMonster("fortressdelve", "Delirious Elemental", "Elemental Rune", 7);
            Core.ensureComplete(9165);
        }

        //...Pierces the Deepest Shadowsl 9166
        if (!Story.questProgression(9166)) {
            Core.ensureAccept(9166);
            Core.getMapItem(11352, 1, "fortressdelve");
            Core.huntMonster("fortressdelve", "Enlightened Shadow", "Glowing Armor Scrap", 7);
            Core.ensureComplete(9166);
        }

        //Lonely Supremacy 9167
        if (!Story.questProgression(9167)) {
            Core.ensureAccept(9167);
            Core.getMapItem(11353, 1, "fortressdelve");
            Core.huntMonster("fortressdelve", "Legion Dreadmarch", "Dreadmarch Badge", 8);
            Core.ensureComplete(9167);
        }

        //The Condemner 9168
        if (!Story.questProgression(9168)) {
            Core.ensureAccept(9168);
            Core.huntMonster("fortressdelve", "Enlightened Shadow", "Light Vein", 6);
            Core.huntMonster("fortressdelve", "Delirious Elemental", "Elemental Shard", 6);
            Core.ensureComplete(9168);
        }

        //Lost Light, Astero 9169
        Story.killQuest(9169, "fortressdelve", "Astero");
    }
}

export default function main(): void {
    const script = new FortressDelve();
    Core.setOptions();

    script.doStory();
    Core.setOptions(false);
}
