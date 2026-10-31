/*
name: Pirate Alliance Story
description: Completes the storyline in /piratealliance
tags: pirate alliance,alliance,tlapd,piratealliance, story, pirate,captain rubharb
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/PirateAlliance.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { PirateHuntStory } from "./PirateHunt";

const Story = new CoreStory();
const PH = new PirateHuntStory();

export class PirateAlliance {
    storyline(): void {
        if (Core.isCompletedBefore(10409)) {
            return;
        }

        PH.pirateHuntSaga();
        Story.preLoad(this.storyline);

        //#region Useable Monsters
        const UseableMonsters = [
            "PunkStream Crew", // UseableMonsters[0],
            "Thalassarath Pirate", // UseableMonsters[1],
            "S.S. Phantom Pirate", // UseableMonsters[2],
            "Captain Wary", // UseableMonsters[3],
            "Captain Bloch", // UseableMonsters[4],
            "Captain Squalus", // UseableMonsters[5],
            "Phantom Jaws", // UseableMonsters[6]
        ];
        //#endregion Useable Monsters
        // 10400 | A Pirate's Stake
        if (!Story.questProgression(10400)) {
            Core.ensureAccept(10400);
            Core.getMapItem(14926, 1, "piratealliance");
            Core.huntMonster("piratealliance", "PunkStream Crew", "Streaming Device", 12);
            Core.ensureComplete(10400);
        }

        // 10401 | Thalassalings
        if (!Story.questProgression(10401)) {
            Core.huntMonsterQuest(10401, ["piratealliance", UseableMonsters[1], ClassType.Farm]);
        }

        // 10402 | No Tales
        if (!Story.questProgression(10402)) {
            Core.huntMonsterQuest(10402, ["piratealliance", UseableMonsters[2], ClassType.Farm]);
        }

        // 10403 | Live on Punt
        if (!Story.questProgression(10403)) {
            Core.huntMonsterQuest(10403, ["piratealliance", UseableMonsters[3], ClassType.Solo]);
        }

        // 10404 | A Growing Crew
        if (!Story.questProgression(10404)) {
            Core.huntMonsterQuest(10404, ["piratealliance", UseableMonsters[1], ClassType.Farm]);
        }

        // 10406 | Bloch-Head
        if (!Story.questProgression(10406)) {
            Core.huntMonsterQuest(10406, ["piratealliance", UseableMonsters[4], ClassType.Solo]);
        }

        // 10405 | A Right and Salty Death
        if (!Story.questProgression(10405)) {
            Core.huntMonsterQuest(10405, ["piratealliance", UseableMonsters[2], ClassType.Farm]);
        }

        // 10407 | Slip 'n' Slide
        Story.mapItemQuest(10407, "piratealliance", 14927, 5);

        // 10408 | Red Sea Spurdog
        if (!Story.questProgression(10408)) {
            Core.huntMonsterQuest(10408, ["piratealliance", UseableMonsters[5], ClassType.Solo]);
        }

        // 10409 | Blood Bloom
        if (!Story.questProgression(10409)) {
            Core.huntMonsterQuest(10409, ["piratealliance", UseableMonsters[6], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new PirateAlliance();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
