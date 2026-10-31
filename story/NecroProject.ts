/*
name: Necro Project
description: This will finish the Necro Project story.
tags: story, quest, necroproject, sally
*/
// Port of Scripts/Story/NecroProject.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class NecroProject {
    storyLine(): void {
        if (Core.isCompletedBefore(9901)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //#region Useable Monsters
        const UseableMonsters = [
            "Noxborg", // UseableMonsters[0],
            "Noxore", // UseableMonsters[1],
            "Noxustrian", // UseableMonsters[2],
            "Imperial Noxus", // UseableMonsters[3]
        ];
        //#endregion Useable Monsters
        // 9897 | In-Field Study
        if (!Story.questProgression(9897)) {
            Core.huntMonsterQuest(9897, ["necrocavern", "Shadowstone Elemental", ClassType.Farm]);
        }

        // 9898 | Technilliterate
        if (!Story.questProgression(9898)) {
            Core.huntMonsterQuest(9898, ["necroproject", UseableMonsters[0], ClassType.Solo]);
        }

        // 9899 | Odd Tastes
        if (!Story.questProgression(9899)) {
            Core.huntMonsterQuest(9899, ["necroproject", UseableMonsters[1], ClassType.Solo]);
        }

        // 9900 | My Toxic Pony
        if (!Story.questProgression(9900)) {
            Core.huntMonsterQuest(9900, ["necroproject", UseableMonsters[2], ClassType.Solo]);
        }

        // 9901 | Hand-Me-Down
        if (!Story.questProgression(9901)) {
            Core.huntMonsterQuest(9901, ["necroproject", UseableMonsters[3], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new NecroProject();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
