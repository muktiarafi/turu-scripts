/*
name: Oblivion Tundra Story
description: This script will complete the storyline in /obliviontundra.
tags: obliviontundra, oblivion, tundra, nation, nulgath, story, the hushed
*/
// Port of Scripts/Story/Nation/OblivionTundra.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { DeleuzeTundraStory } from "./DeleuzeTundra";

const Story = new CoreStory();
const DT = new DeleuzeTundraStory();

export class OblivionTundra {
    storyline(): void {
        if (Core.isCompletedBefore(10045)) {
            return;
        }

        DT.deleuzeTundra();

        Story.preLoad(this.storyline);

        //#region Useable Monsters
        const UseableMonsters = [
            "Empty Creature", // UseableMonsters[0],
            "Hushed", // UseableMonsters[1],
            "Withered Archfiend", // UseableMonsters[2],
            "Oblivion Magus ", // UseableMonsters[3],
            "Ettin Fiend", // UseableMonsters[4],
            "Archfiend Oblivion", // UseableMonsters[5],
            "Infinity Pool", // UseableMonsters[6]
        ];
        //#endregion Useable Monsters
        // 10036 | Indignant Stubbornness
        if (!Story.questProgression(10036)) {
            Core.ensureAccept(10036);
            Core.getMapItem(14064, 1, "obliviontundra");
            Core.huntMonster("obliviontundra", "Empty Creature", "Pale Pelt", 12);
            Core.ensureComplete(10036);
        }

        // 10037 | Over the Edge
        Story.mapItemQuest(10037, [
            [14065, 5, "obliviontundra"],
            [14066, 1, "obliviontundra"],
        ]);

        // 10038 | Restless Pride
        if (!Story.questProgression(10038)) {
            Core.huntMonsterQuest(10038, ["obliviontundra", UseableMonsters[1], ClassType.Farm]);
        }

        // 10039 | Greywater
        if (!Story.questProgression(10039)) {
            Core.huntMonsterQuest(
                10039,
                ["obliviontundra", UseableMonsters[1], ClassType.Farm],
                ["obliviontundra", UseableMonsters[0], ClassType.Farm],
            );
        }

        // 10040 | A Fiendish Waste
        if (!Story.questProgression(10040)) {
            Core.huntMonsterQuest(10040, ["obliviontundra", UseableMonsters[2], ClassType.Solo]);
        }

        // 10041 | Inevitable Departure
        Story.mapItemQuest(10041, [
            [14067, 3, "obliviontundra"],
            [14068, 1, "obliviontundra"],
        ]);

        // 10042 | Emptiness Embodied
        if (!Story.questProgression(10042)) {
            Core.huntMonsterQuest(10042, ["obliviontundra", UseableMonsters[3], ClassType.Farm]);
        }

        // 10043 | Ice Ages Past
        if (!Story.questProgression(10043)) {
            Core.huntMonsterQuest(10043, ["obliviontundra", UseableMonsters[4], ClassType.Farm]);
        }

        // 10044 | Stirring Darkness
        if (!Story.questProgression(10044)) {
            Core.huntMonsterQuest(
                10044,
                ["obliviontundra", UseableMonsters[3], ClassType.Farm],
                ["obliviontundra", UseableMonsters[4], ClassType.Farm],
            );
        }

        // 10045 | Remember to Breathe
        if (!Story.questProgression(10045)) {
            Core.huntMonsterQuest(10045, ["obliviontundra", UseableMonsters[5], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new OblivionTundra();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
