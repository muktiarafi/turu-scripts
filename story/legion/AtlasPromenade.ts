/*
name: Atlas Promenade Story
description: This will finish General Rand's questline in /atlaspromenade.
tags: story, quest, legion,dage,atlas,promenade,atlas-promenade,general rand,rand,atlaspromenade
*/
// Port of Scripts/Story/Legion/AtlasPromenade.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { SevenCircles } from "./SevenCircles(War)";

const Story = new CoreStory();
const SCW = new SevenCircles();

export class AtlasPromenade {
    storyline(): void {
        if (Core.isCompletedBefore(10113)) {
            return;
        }

        SCW.circles();
        SCW.circlesWar();
        Story.preLoad(this.storyline);

        //#region Useable Monsters
        const UseableMonsters = [
            "Twisted Warrior", // UseableMonsters[0],
            "Lethe Wraith", // UseableMonsters[1],
            "Atlas Knight", // UseableMonsters[2],
            "Atlas Light Magus", // UseableMonsters[3],
            "Wrath Guard", // UseableMonsters[4],
            "Usurper Lord Slaine", // UseableMonsters[5]
        ];
        //#endregion Useable Monsters
        // 10105 | Legion Traditions
        if (!Story.questProgression(10105)) {
            Core.huntMonsterQuest(10105, ["atlaspromenade", UseableMonsters[0], ClassType.Farm]);
        }

        // 10106 | Two-Faced Reflection
        Story.mapItemQuest(10106, "atlaspromenade", 14204);

        // 10107 | Past Disturbed
        if (!Story.questProgression(10107)) {
            Core.huntMonsterQuest(10107, ["atlaspromenade", UseableMonsters[1], ClassType.Farm]);
        }

        // 10108 | Atlas Lies in Wait
        Story.mapItemQuest(10108, "atlaspromenade", 14205);

        // 10109 | Preparedness Next to Godliness
        if (!Story.questProgression(10109)) {
            Core.equipClass(ClassType.Solo);
            if (!Story.questProgression(10109)) {
                Core.ensureAccept(10109);
                Core.getMapItem(14206, 1, "atlaspromenade");
                Core.huntMonster("atlaspromenade", "Atlas Knight", "Knight's Soul Residue", 9);
                Core.ensureComplete(10109);
            }
        }

        // 10110 | Golden Youth
        if (!Story.questProgression(10110)) {
            Core.equipClass(ClassType.Solo);
            if (!Story.questProgression(10110)) {
                Core.ensureAccept(10110);
                Core.getMapItem(14207, 1, "atlaspromenade");
                Core.huntMonster("atlaspromenade", "Atlas Light Magus", "Mage's Soul Residue", 9);
                Core.ensureComplete(10110);
            }
        }

        // 10111 | Old Souls
        if (!Story.questProgression(10111)) {
            Core.ensureAccept(10111);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("atlaspromenade", "Atlas Light Magus", "Mage's Tally", 6);
            Core.huntMonster("atlaspromenade", "Atlas Knight", "Knight's Tally", 6);
            Core.ensureComplete(10111);
        }

        // 10114 | Digging Too Deep
        Story.mapItemQuest(10114, "atlaspromenade", 14208);

        // 10112 | Dis-graces
        if (!Story.questProgression(10112)) {
            Core.huntMonsterQuest(10112, ["atlaspromenade", UseableMonsters[4], ClassType.Farm]);
        }

        // 10113 | Lord of Scars
        if (!Story.questProgression(10113)) {
            Core.huntMonsterQuest(10113, ["atlaspromenade", UseableMonsters[5], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new AtlasPromenade();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
