/*
name: Deleuze Tundra Story
description: This will finish the deleuzetundra Story.
tags: story, quest, deleuzetundra
*/
// Port of Scripts/Story/Nation/DeleuzeTundra.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { VoidChasm } from "./VoidChasm";

const Story = new CoreStory();
const VC = new VoidChasm();

export class DeleuzeTundraStory {
    deleuzeTundra(): void {
        if (Core.isCompletedBefore(10031)) {
            return;
        }

        VC.storyline();

        Story.preLoad(this.deleuzeTundra);
        //#region Useable Monsters
        const UseableMonsters = [
            "Empty Creature", // UseableMonsters[0],
            "Nation Outrider", // UseableMonsters[1],
            "Oblivion Magus", // UseableMonsters[2],
            "Oblivion's Herald", // UseableMonsters[3],
            "Blighted Zubami", // UseableMonsters[4]
        ];
        //#endregion Useable Monsters
        // 10023 | Empty Eyes
        if (!Story.questProgression(10023)) {
            Core.huntMonsterQuest(10023, ["deleuzetundra", UseableMonsters[0], ClassType.Farm]);
        }

        // 10024 | Infectious Sleep
        if (!Story.questProgression(10024)) {
            Core.huntMonsterQuest(10024, ["deleuzetundra", UseableMonsters[1], ClassType.Farm]);
        }

        // 10025 | Cadaveric Spasm
        if (!Story.questProgression(10025)) {
            Core.ensureAccept(10025);
            Story.mapItemQuest(10025, "deleuzetundra", 14048, 5);
            Story.mapItemQuest(10025, "deleuzetundra", 14049);
        }

        // 10026 | Nihil Scholars
        if (!Story.questProgression(10026)) {
            Core.huntMonsterQuest(10026, ["deleuzetundra", UseableMonsters[2], ClassType.Farm]);
        }

        // 10027 | Id and Superego
        if (!Story.questProgression(10027)) {
            Story.mapItemQuest(10027, "deleuzetundra", [14050, 14051]);
        }

        // 10028 | Sleepflying
        if (!Story.questProgression(10028)) {
            if (!Story.questProgression(10028)) {
                Core.ensureAccept(10028);
                Core.getMapItem(14052, 1, "deleuzetundra");
                Core.huntMonster("deleuzetundra", "Empty Creature", "Void Heart", 3);
                Core.ensureComplete(10028);
            }
        }

        // 10029 | Battle-Weary
        if (!Story.questProgression(10029)) {
            if (!Story.questProgression(10029)) {
                Core.ensureAccept(10029);
                Core.getMapItem(14053, 5, "deleuzetundra");
                Core.huntMonster("deleuzetundra", "Nation Outrider", "Blunt Blade", 15);
                Core.ensureComplete(10029);
            }
        }

        // 10030 | Self-Destructive Spell
        if (!Story.questProgression(10030)) {
            if (!Story.questProgression(10030)) {
                Core.ensureAccept(10030);
                Core.getMapItem(14054, 1, "deleuzetundra");
                Core.huntMonster("deleuzetundra", "Oblivion Magus", "Obliteration Rune", 15);
                Core.ensureComplete(10030);
            }
        }

        // 10031 | Allure of the Void
        if (!Story.questProgression(10031)) {
            Core.huntMonsterQuest(10031, ["deleuzetundra", UseableMonsters[3], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new DeleuzeTundraStory();
    Core.setOptions();

    script.deleuzeTundra();

    Core.setOptions(false);
}
