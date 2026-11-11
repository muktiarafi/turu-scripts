/*
name: Atlas Kingdom Story
description: This will finish General Slaine's questline in /atlaskingdom.
tags: story, quest, legion,dage,atlas,kingdom,atlas-kingdom,general slaine,slaine,atlaskingdom
*/
// Port of Scripts/Story/Legion/AtlasKingdom.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { AtlasPromenade } from "./AtlasPromenade";

const Story = new CoreStory();
const AP = new AtlasPromenade();

export class AtlasKingdom {
    storyline(): void {
        if (Core.isCompletedBefore(10125)) {
            return;
        }

        AP.storyline();
        Story.preLoad(this.storyline);

        //#region Useable Monsters
        const UseableMonsters = [
            "Atlas Knight", // UseableMonsters[0],
            "Atlas Light Magus", // UseableMonsters[1],
            "Coelho", // UseableMonsters[2],
            "Atlas Leo", // UseableMonsters[3],
            "Atlas Elite", // UseableMonsters[4],
            "Executioner Ladon", // UseableMonsters[5]
        ];
        //#endregion Useable Monsters
        // 10116 | Knight's Honor
        if (!Story.questProgression(10116)) {
            Core.ensureAccept(10116);
            Core.getMapItem(14252, 1, "atlaskingdom");
            Core.huntMonster("atlaskingdom", "Atlas Knight", "Knight's Head", 9);
            Core.ensureComplete(10116);
        }

        // 10117 | Drawn Light
        Story.mapItemQuest(10117, "atlaskingdom", [14253, 14254, 14255]);

        // 10118 | Sterile Life
        if (!Story.questProgression(10118)) {
            Core.huntMonsterQuest(10118, ["atlaskingdom", UseableMonsters[1], ClassType.Farm]);
        }

        // 10119 | Lost Generations
        Story.mapItemQuest(10119, "atlaskingdom", [14256, 14257]);

        // 10120 | The Snitch
        if (!Story.questProgression(10120)) {
            Core.huntMonsterQuest(10120, ["atlaskingdom", UseableMonsters[2], ClassType.Solo]);
        }

        // 10121 | Atlantides' Eve
        Story.mapItemQuest(10121, "atlaskingdom", [14258, 14259, 14260]);

        // 10122 | Lowly Form
        if (!Story.questProgression(10122)) {
            Core.huntMonsterQuest(10122, ["atlaskingdom", UseableMonsters[3], ClassType.Solo]);
        }

        // 10123 | Enduring Sacrilege
        if (!Story.questProgression(10123)) {
            Core.huntMonsterQuest(10123, ["atlaskingdom", UseableMonsters[4], ClassType.Solo]);
        }

        // 10124 | Blood of the Hesperides
        if (!Story.questProgression(10124)) {
            Core.ensureAccept(10124);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("atlaskingdom", "Atlas Leo", "Leo's Mane", 4);
            Core.huntMonster("atlaskingdom", "Atlas Elite", "Elite's Rose", 4);
            Core.ensureComplete(10124);
        }

        // 10125 | Prota Sparasso
        if (!Story.questProgression(10125)) {
            Core.huntMonsterQuest(10125, ["atlaskingdom", UseableMonsters[5], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new AtlasKingdom();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
