/*
name: Victor Matsuri Story (Pre-Masakado)
description: Runs Empress Ai No Miko's questline in /victormatsuri up to (but not including) the Masakado quest (10295). Used as a setup step before handing off to the dedicated Masakado army script. Quest 10295 must be handled separately via MasakadoKingsEchoArmy.
tags: victor matsuri, victormatsuri, empress ai no miko, story, pre-masakado, eclipse, rite of ascension
*/
// Port of Scripts/Ultrasv3/Entwined Eclipse/VictorMatsuriStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class VictorMatsuriStory {
    /**
     * Runs quests 10290–10294 in /victormatsuri. Quest 10295 (Masakado / Kanmu Heishi)
     * is intentionally NOT handled here — call MasakadoKingsEchoArmy afterwards to
     * accept, fight, and complete it.
     *
     * @param merge If true, stops after 10291 (matches the original VictorMatsuri.Storyline merge gate).
     */
    storyline(merge = false): void {
        // If 10294 (the last quest we handle) is already done, there's nothing left for us.
        if (merge ? Core.isCompletedBefore(10291) : Core.isCompletedBefore(10294)) {
            return;
        }

        Story.preLoad(this.storyline);

        //#region Useable Monsters
        const UseableMonsters = [
            "Kitsune Himawari", // UseableMonsters[0]
            "NeOni", // UseableMonsters[1]
            "Narcis Arrhythmia", // UseableMonsters[2]
            "Haruki Matsuoka", // UseableMonsters[3]
            "Lady Laidronette", // UseableMonsters[4]
        ];
        //#endregion Useable Monsters
        // 10290 | In Kuzunoha's Image
        if (!Story.questProgression(10290)) {
            Core.huntMonsterQuest(10290, ["victormatsuri", UseableMonsters[0], ClassType.Solo]);
        }

        // 10291 | NeOni Blue
        if (!Story.questProgression(10291)) {
            Core.huntMonsterQuest(10291, ["victormatsuri", UseableMonsters[1], ClassType.Solo]);
        }

        if (merge) {
            return;
        }

        // 10292 | Embodiment of Scarlet
        if (!Story.questProgression(10292)) {
            Core.huntMonsterQuest(10292, ["victormatsuri", UseableMonsters[2], ClassType.Solo]);
        }

        // 10293 | Onihitokuchi
        if (!Story.questProgression(10293)) {
            Core.huntMonsterQuest(10293, ["victormatsuri", UseableMonsters[3], ClassType.Solo]);
        }

        // 10294 | Tsukihime
        if (!Story.questProgression(10294)) {
            Core.huntMonsterQuest(10294, ["victormatsuri", UseableMonsters[4], ClassType.Solo]);
        }

        // 10295 | Kanmu Heishi — intentionally NOT handled. Run MasakadoKingsEchoArmy next.
    }
}

export default function main(): void {
    const script = new VictorMatsuriStory();
    Core.setOptions();
    script.storyline();
    Core.setOptions(false);
}
