/*
name: crulonwedding
description: does the 3 story quest for /crulonwed
tags: crulonwed, weekly, story
*/
// Port of Scripts/Story/Crulonwed.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Crulonwedding {
    storyLine(TestMode = false): void {
        if (Core.isCompletedBefore(9850)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //#region Useable Monsters
        const UseableMonsters = [
            "King Almoravid", // UseableMonsters[0]
            "Jaan al Nair",
            "Silver Elemental",
        ];
        //#endregion Useable Monsters
        // 9848 | The Red Rival
        if (!Story.questProgression(9848)) {
            Core.huntMonsterQuest(9848, ["djinnguard", UseableMonsters[1], ClassType.Solo]);
        }

        // 9849 | Pale Invocation
        if (!Story.questProgression(9849)) {
            Core.huntMonsterQuest(9849, ["towerofmirrors", UseableMonsters[2], ClassType.Farm]);
        }

        // 9850 | Moon's Self-Reflection
        if (!Story.questProgression(9850)) {
            Core.huntMonsterQuest(9850, ["crulonwed", UseableMonsters[0], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new Crulonwedding();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
