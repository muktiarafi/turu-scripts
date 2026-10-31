/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/SunSetSaga/CoreSunSet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { CoreOasis } from "../oasis/CoreOasis";

const Story = new CoreStory();
const COA = new CoreOasis();

export class CoreSunSet {
    doAll(): void {
        this.templeofDoom();
    }

    templeofDoom(): void {
        COA.doAll();
        if (Core.isCompletedBefore(10845)) {
            return;
        }

        Story.preLoad(this.templeofDoom);

        const UseableMonsters = ["Aegis of Order", "Doom Leech", "Emptiness", "Sentinel of Order", "Tainted Paladin"];

        // 10836 | Within a Raw Wound
        if (!Story.questProgression(10836)) {
            Story.mapItemQuest(10836, "templeofdoom", [16097, 16101], undefined, { autoCompleteQuest: false });
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("templeofdoom", UseableMonsters[2], "Erased Text", 12);
            Core.ensureComplete(10836);
        }

        // 10837 | Trust is the Cure
        if (!Story.questProgression(10837)) {
            Story.mapItemQuest(10837, "templeofdoom", [16102, 16114], undefined, { autoCompleteQuest: false });
            Core.huntMonsterQuest(10837, ["templeofdoom", UseableMonsters[1], ClassType.Farm]);
            // Drained Leech x15
        }

        // 10838 | Inferiority Builds Character
        if (!Story.questProgression(10838)) {
            Story.mapItemQuest(10838, "templeofdoom", [16115, 16116, 16117], undefined, { autoCompleteQuest: false });
            Core.huntMonsterQuest(10838, ["templeofdoom", UseableMonsters[4], ClassType.Farm]);
            // Corrupted Gold x6
        }

        // 10839 | Mission Briefing
        if (!Story.questProgression(10839)) {
            Story.mapItemQuest(10839, "templeofdoom", [16118, 16119]);
        }

        // 10840 | The Light's Reward
        if (!Story.questProgression(10840)) {
            Story.mapItemQuest(10840, "templeofdoom", 16120, undefined, { autoCompleteQuest: false });
            Core.huntMonsterQuest(10840, ["templeofdoom", UseableMonsters[4], ClassType.Farm]);
            // Erased Paladin x15
        }

        // 10841 | Wordless Cipher
        if (!Story.questProgression(10841)) {
            Story.mapItemQuest(10841, "templeofdoom", 16121);
        }

        // 10842 | Attention! Salute!
        if (!Story.questProgression(10842)) {
            Story.mapItemQuest(10842, "templeofdoom", [16122, 16123, 16124], undefined, { autoCompleteQuest: false });
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("templeofdoom", UseableMonsters[2], "Deletion Denied", 18);
            Core.ensureComplete(10842);
        }

        // 10843 | All Roads Lead To…
        if (!Story.questProgression(10843)) {
            Story.mapItemQuest(10843, "templeofdoom", 16125, 3);
        }

        // 10844 | Law and Order
        if (!Story.questProgression(10844)) {
            Core.huntMonsterQuest(10844, ["templeofdoom", UseableMonsters[0], ClassType.Solo]);
            // Aegis' Stone Veil x6
        }

        // 10845 | There's an Order to These Things
        if (!Story.questProgression(10845)) {
            Core.huntMonsterQuest(10845, ["templeofdoom", UseableMonsters[3], ClassType.Solo]);
            // Sentinel of Order Defeated x1
        }
    }
}
