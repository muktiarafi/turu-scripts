/*
name: Terces Invasion
description: This will finish the Terces Invasion storyline.
tags: story, quest, tercesinvasion, nation,nulgath, terces, invasion, jadzia
*/
// Port of Scripts/Story/Nation/TercesInvasion.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { TercesArchive } from "./tercesarchive";

const Story = new CoreStory();
const TA = new TercesArchive();

export class TercesInvasion {
    storyLine(): void {
        if (Core.isCompletedBefore(10581)) {
            return;
        }

        TA.storyLine();
        Story.preLoad(this.storyLine);

        //#region Useable Monsters
        const UseableMonsters = [
            "Bloodthirsty Void", // UseableMonsters[0],
            "Vampiric Devourer", // UseableMonsters[1],
            "Void Cultist", // UseableMonsters[2],
            "Archfiend Casimir", // UseableMonsters[3],
            "Archfiend Vigneron", // UseableMonsters[4],
            "Rodeleros Soldier", // UseableMonsters[5],
            "Infinity Pool", // UseableMonsters[6],
            "Elemental Fiend", // UseableMonsters[7],
            "Archfiend Rodeleros", // UseableMonsters[8]
        ];
        //#endregion Useable Monsters
        // 10572 | Walking Leeches
        if (!Story.questProgression(10572)) {
            Core.huntMonsterQuest(10572, ["tercesinvasion", UseableMonsters[0], ClassType.Farm]);
        }

        // 10573 | Taste for Evil
        if (!Story.questProgression(10573)) {
            Core.huntMonsterQuest(10573, ["tercesinvasion", UseableMonsters[1], ClassType.Farm]);
        }

        // 10574 | Infinite Knowledge
        if (!Story.questProgression(10574)) {
            Core.huntMonsterQuest(10574, ["tercesinvasion", UseableMonsters[2], ClassType.Farm]);
        }

        // 10575 | Return to Oblivion
        if (!Story.questProgression(10575)) {
            if (!Story.questProgression(10575)) {
                Core.ensureAccept(10575);
                Core.getMapItem(15432, 1, "tercesinvasion");
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("tercesinvasion", "Archfiend Casimir", "Archfiend Casimir Defeated", 1);
                Core.ensureComplete(10575);
            }
        }

        // 10576 | Blood Thinner
        if (!Story.questProgression(10576)) {
            if (!Story.questProgression(10576)) {
                Core.ensureAccept(10576);
                Core.getMapItem(15433, 1, "tercesinvasion");
                Core.huntMonster("tercesinvasion", "Archfiend Vigneron", "Archfiend Vigneron Defeated", 1);
                Core.ensureComplete(10576);
            }
        }

        // 10577 | Fiendish Wind
        if (!Story.questProgression(10577)) {
            Core.huntMonsterQuest(10577, ["tercesinvasion", UseableMonsters[5], ClassType.Farm]);
        }

        // 10578 | Nulgath's Contingency Plan
        if (!Story.questProgression(10578)) {
            Story.mapItemQuest(10578, "tercesinvasion", [15434, 15435, 15436]);
        }

        // 10579 | Dead Air
        if (!Story.questProgression(10579)) {
            Core.huntMonsterQuest(10579, ["tercesinvasion", UseableMonsters[7], ClassType.Farm]);
        }

        // 10580 | Billowing Hate
        if (!Story.questProgression(10580)) {
            Core.huntMonsterQuest(
                10580,
                ["tercesinvasion", UseableMonsters[5], ClassType.Farm],
                ["tercesinvasion", UseableMonsters[7], ClassType.Farm],
            );
        }

        // 10581 | The Swordmaiden
        if (!Story.questProgression(10581)) {
            Core.huntMonsterQuest(10581, ["tercesinvasion", UseableMonsters[8], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new TercesInvasion();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
