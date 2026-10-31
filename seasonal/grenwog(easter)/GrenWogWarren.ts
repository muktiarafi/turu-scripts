/*
name: GrenWogWarren
description: This script will complete the questline in grenwogwarren.
tags: grenstory, seasonal, grenwogwarren, easter
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/GrenWogWarren.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class GrenWogWarren {
    storyline(): void {
        if (Core.isCompletedBefore(10152)) {
            return;
        }

        Story.preLoad(this.storyline);

        //#region Useable Monsters
        const UseableMonsters = [
            "Grenwog", // UseableMonsters[0],
            "Sugar Grenwog", // UseableMonsters[1],
            "Draconic Grenwog", // UseableMonsters[2],
            "Jurassic Grenwog", // UseableMonsters[3],
            "Elixir Grenwog", // UseableMonsters[4],
            "Alpha Cabdury", // UseableMonsters[5]
        ];
        //#endregion Useable Monsters
        // 10148 | Classic Original
        if (!Story.questProgression(10148)) {
            Core.huntMonsterQuest(10148, ["grenwogwarren", UseableMonsters[0], ClassType.Solo]);
        }

        // 10149 | Sweet Buckteeth
        if (!Story.questProgression(10149)) {
            Core.huntMonsterQuest(10149, ["grenwogwarren", UseableMonsters[1], ClassType.Solo]);
        }

        // 10150 | Tastes Like Chicken
        if (!Story.questProgression(10150)) {
            Core.huntMonsterQuest(10150, ["grenwogwarren", UseableMonsters[2], ClassType.Solo]);
        }

        // 10151 | Jurassic Instinct
        if (!Story.questProgression(10151)) {
            Core.huntMonsterQuest(10151, ["grenwogwarren", UseableMonsters[3], ClassType.Solo]);
        }

        // 10152 | Rapid Cycling
        if (!Story.questProgression(10152)) {
            Core.huntMonsterQuest(10152, ["grenwogwarren", UseableMonsters[4], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new GrenWogWarren();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
