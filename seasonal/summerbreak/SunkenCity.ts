/*
name: SunkenCity
description: Does the quests from /SunkenCity
tags: sunkencity, sunken city, story, weekly
*/
// Port of Scripts/Seasonal/SummerBreak/SunkenCity.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class SunkenCity {
    sagaName(): void {
        if (Core.isCompletedBefore(10276) || !Core.isSeasonalMapActive("sunkencity")) {
            return;
        }

        Story.preLoad(this.sagaName);

        //#region Useable Monsters
        const UseableMonsters = [
            "Necro Adipocere", // UseableMonsters[0],
            "Merdrathoolian", // UseableMonsters[1],
            "Nereid Princess", // UseableMonsters[2]
        ];
        //#endregion Useable Monsters
        // 10274 | Amensalism
        if (!Story.questProgression(10274)) {
            Core.huntMonsterQuest(10274, ["sunkencity", UseableMonsters[0], ClassType.Farm]);
        }

        // 10275 | Mutualism
        if (!Story.questProgression(10275)) {
            Core.huntMonsterQuest(10275, ["sunkencity", UseableMonsters[1], ClassType.Farm]);
        }

        // 10276 | Symbiogenesis
        if (!Story.questProgression(10276)) {
            Core.huntMonsterQuest(10276, ["sunkencity", UseableMonsters[2], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new SunkenCity();
    Core.setOptions();

    script.sagaName();

    Core.setOptions(false);
}
