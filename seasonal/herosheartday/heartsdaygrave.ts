/*
name: heartsdaygrave
description: This will complete the heartsdaygrave quest.
tags: story, quest, seasonal, heartsdaygrave, heart
*/
// Port of Scripts/Seasonal/HerosHeartDay/heartsdaygrave.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class HeartsDayGrave {
    doStory(): void {
        if (Core.isCompletedBefore(10601)) {
            return;
        }

        Story.preLoad(this.doStory);

        //#region Useable Monsters
        const UseableMonsters = [
            "Heartbroken Zombie", // UseableMonsters[0],
            "Hearty Gift", // UseableMonsters[1],
            "Dark Love Knight", // UseableMonsters[2],
            "Vaioh's Warriors", // UseableMonsters[3],
            "Illusionist Zio", // UseableMonsters[4],
            "Warlord Vaioh", // UseableMonsters[5]
        ];
        //#endregion Useable Monsters
        // 10592 | Heartless Monsters
        if (!Story.questProgression(10592)) {
            Core.huntMonsterQuest(10592, ["heartsdaygrave", UseableMonsters[0], ClassType.Farm]);
        }

        // 10593 | Heart Throb
        if (!Story.questProgression(10593)) {
            Core.huntMonsterQuest(10593, ["heartsdaygrave", UseableMonsters[1], ClassType.Farm]);
        }

        // 10594 | Love in Every Form
        if (!Story.questProgression(10594)) {
            Core.huntMonsterQuest(10594, ["heartsdaygrave", UseableMonsters[2], ClassType.Farm]);
        }

        // 10595 | Love's Call
        if (!Story.questProgression(10595)) {
            Core.huntMonsterQuest(10595, ["heartsdaygrave", UseableMonsters[3], ClassType.Farm]);
        }

        // 10596 | Eat Your Heart Out
        if (!Story.questProgression(10596)) {
            Core.huntMonsterQuest(
                10596,
                ["heartsdaygrave", UseableMonsters[0], ClassType.Farm],
                ["heartsdaygrave", UseableMonsters[1], ClassType.Farm],
            );
        }

        // 10597 | Undead Wing-Liches (and Wing-Cutie)
        if (!Story.questProgression(10597)) {
            Story.mapItemQuest(10597, "heartsdaygrave", 15490);
            Story.mapItemQuest(10597, "heartsdaygrave", 15491);
        }

        // 10598 | Deranged Duty
        if (!Story.questProgression(10598)) {
            Core.huntMonsterQuest(
                10598,
                ["heartsdaygrave", UseableMonsters[2], ClassType.Farm],
                ["heartsdaygrave", UseableMonsters[3], ClassType.Farm],
            );
        }

        // 10599 | The Dead and the Restless
        if (!Story.questProgression(10599)) {
            Story.mapItemQuest(10599, "heartsdaygrave", 15492, 7);
        }

        // 10600 | Work Obligations
        if (!Story.questProgression(10600)) {
            Core.huntMonsterQuest(10600, ["heartsdaygrave", UseableMonsters[4], ClassType.Boss]);
        }

        // 10601 | Does Your Heart Quiver?
        if (!Story.questProgression(10601)) {
            Core.huntMonsterQuest(10601, ["heartsdaygrave", UseableMonsters[5], ClassType.Boss]);
        }
    }
}

export default function main(): void {
    const script = new HeartsDayGrave();
    Core.setOptions();

    script.doStory();

    Core.setOptions(false);
}
