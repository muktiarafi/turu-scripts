/*
name: Tunnel Of Love Story
description: This will complete the Tunnel of Love story in /tunneloflove.
tags: story, quest, seasonal, hero, heart,valentines,tunneloflove,tunnel of love,big daddy,hero's heart day
*/
// Port of Scripts/Seasonal/HerosHeartDay/TunnelOfLove.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class TunnelOfLove {
    storyline(): void {
        if (Core.isCompletedBefore(10071) || !Core.isSeasonalMapActive("tunneloflove")) {
            return;
        }

        Story.preLoad(this.storyline);

        //#region Useable Monsters
        const UseableMonsters = [
            "Rosey Moth", // UseableMonsters[0],
            "Love Knight", // UseableMonsters[1],
            "Galanoth", // UseableMonsters[2],
            "Mourner", // UseableMonsters[3],
            "Oubliette", // UseableMonsters[4]
        ];
        //#endregion Useable Monsters
        // 10062 | Live Decor
        if (!Story.questProgression(10062)) {
            Core.huntMonsterQuest(10062, ["tunneloflove", UseableMonsters[0], ClassType.Farm]);
        }

        // 10063 | A Past Storm
        Story.mapItemQuest(10063, "tunneloflove", [14138, 14139]);

        // 10064 | Employee Sniping
        if (!Story.questProgression(10064)) {
            Core.huntMonsterQuest(10064, ["tunneloflove", UseableMonsters[1], ClassType.Farm]);
        }

        // 10065 | Auntie Celeste
        Story.mapItemQuest(10065, "tunneloflove", 14140);

        // 10066 | A Cold Reception
        if (!Story.questProgression(10066)) {
            Core.huntMonsterQuest(10066, ["tunneloflove", UseableMonsters[2], ClassType.Solo]);
        }

        // 10067 | Lethal Lethe
        Story.mapItemQuest(10067, "tunneloflove", 14141);

        // 10068 | Missing Orpheus
        if (!Story.questProgression(10068)) {
            Core.huntMonsterQuest(10068, ["tunneloflove", UseableMonsters[3], ClassType.Farm]);
        }

        // 10069 | Mentor and Student
        Story.mapItemQuest(10069, "tunneloflove", [14142, 14143]);

        // 10070 | Rosy Hues
        if (!Story.questProgression(10070)) {
            Core.huntMonsterQuest(
                10070,
                ["tunneloflove", UseableMonsters[0], ClassType.Farm],
                ["tunneloflove", UseableMonsters[1], ClassType.Farm],
            );
        }

        // 10071 | Oubliable
        if (!Story.questProgression(10071)) {
            Core.huntMonsterQuest(10071, ["tunneloflove", UseableMonsters[4], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new TunnelOfLove();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
