/*
name: FiendVoid
description: This will finish the FiendVoid quest.
tags: story, quest, FiendVoid, nation
*/
// Port of Scripts/Story/Nation/FiendVoid.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { TercesArchive } from "./tercesarchive";

const Story = new CoreStory();
const TA = new TercesArchive();

export class FiendVoid {
    fiendVoid_Questline(): void {
        if (Core.isCompletedBefore(10569)) {
            return;
        }

        TA.storyLine();

        Story.preLoad(this.fiendVoid_Questline);

        //#region Useable Monsters
        const UseableMonsters = [
            "Blood Fiend", // UseableMonsters[0],
            "The Hushed", // UseableMonsters[1],
            "Blood Coccoon", // UseableMonsters[2],
            "Void Fang", // UseableMonsters[3],
            "Arachnid Seeker", // UseableMonsters[4],
            "Crystalized Coccoon", // UseableMonsters[5],
            "Archfiend Casimir", // UseableMonsters[6]
        ];
        //#endregion Useable Monsters
        // 10560 | Hemophilia
        if (!Story.questProgression(10560)) {
            Core.huntMonsterQuest(10560, ["fiendvoid", UseableMonsters[0], ClassType.Farm]);
        }

        // 10561 | A Dash of Hope
        if (!Story.questProgression(10561)) {
            Core.huntMonsterQuest(10561, ["fiendvoid", UseableMonsters[1], ClassType.Farm]);
        }

        // 10562 | Blood Cultivation
        if (!Story.questProgression(10562)) {
            Story.mapItemQuest(10562, "fiendvoid", 15413);
            Story.mapItemQuest(10562, "fiendvoid", 15415);
        }

        // 10563 | Forever Fall
        if (!Story.questProgression(10563)) {
            Core.ensureAccept(10563);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("fiendvoid", "The Hushed", "Acrid Smoke", 3);
            Core.huntMonster("fiendvoid", "Blood Fiend", "Ball of Veins", 6);
            Core.ensureComplete(10563);
        }

        // 10564 | Hydrops Fetalis
        if (!Story.questProgression(10564)) {
            Core.huntMonsterQuest(10564, ["fiendvoid", UseableMonsters[2], ClassType.Solo]);
        }

        // 10565 | Skimmed Off the Top
        if (!Story.questProgression(10565)) {
            Core.huntMonsterQuest(10565, ["fiendvoid", UseableMonsters[3], ClassType.Farm]);
        }

        // 10566 | Sleeping Soldier
        if (!Story.questProgression(10566)) {
            if (!Story.questProgression(10566)) {
                Core.ensureAccept(10566);
                Core.getMapItem(15414, 1, "fiendvoid");
                Core.huntMonster("fiendvoid", "Arachnid Seeker", "Crystalized Pupa", 9);
                Core.ensureComplete(10566);
            }
        }

        // 10567 | Espadachina
        if (!Story.questProgression(10567)) {
            Core.huntMonsterQuest(10567, ["fiendvoid", UseableMonsters[5], ClassType.Solo]);
        }

        // 10568 | Ingrained in Flesh
        if (!Story.questProgression(10568)) {
            Core.ensureAccept(10568);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("fiendvoid", "Void Fang", "Mutated Scales", 2);
            Core.huntMonster("fiendvoid", "Arachnid Seeker", "Seeker Legs", 40);
            Core.ensureComplete(10568);
        }

        // 10569 | I Know, Therefore I Suffer
        if (!Story.questProgression(10569)) {
            Core.huntMonsterQuest(10569, ["fiendvoid", UseableMonsters[6], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new FiendVoid();
    Core.setOptions();

    script.fiendVoid_Questline();

    Core.setOptions(false);
}
