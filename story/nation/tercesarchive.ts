/*
name: tercesarchive
description: This will finish the tercesarchive quest.
tags: story, quest, tercesarchive, nation
*/
// Port of Scripts/Story/Nation/tercesarchive.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { OblivionTundra } from "./OblivionTundra";

const Story = new CoreStory();
const oblivionTundra = new OblivionTundra();

export class TercesArchive {
    storyLine(): void {
        if (Core.isCompletedBefore(10557)) {
            return;
        }

        oblivionTundra.storyline();

        Story.preLoad(this.storyLine);

        //#region Useable Monsters
        const UseableMonsters = [
            "Oblivion Magus", // UseableMonsters[0],
            "Fiendish Devourer", // UseableMonsters[1],
            "Nightmare Fiend", // UseableMonsters[2],
            "Wasted Clone", // UseableMonsters[3],
            "Fiend of Voracity", // UseableMonsters[4]
        ];
        //#endregion Useable Monsters
        // 10549 | Oblivious Oblivion
        if (!Story.questProgression(10549)) {
            Core.huntMonsterQuest(10549, ["tercesarchive", UseableMonsters[0], ClassType.Farm]);
        }

        // 10550 | Tongue and Cheek
        if (!Story.questProgression(10550)) {
            Core.huntMonsterQuest(10550, ["tercesarchive", UseableMonsters[1], ClassType.Farm]);
        }

        // 10551 | O.T.
        if (!Story.questProgression(10551)) {
            Core.huntMonsterQuest(
                10551,
                ["tercesarchive", UseableMonsters[1], ClassType.Farm],
                ["tercesarchive", UseableMonsters[0], ClassType.Farm],
            );
        }

        // 10552 | The Fiend is in the Details
        if (!Story.questProgression(10552)) {
            Story.mapItemQuest(10552, "tercesarchive", 15393);
            Story.mapItemQuest(10552, "tercesarchive", 15394);
        }

        // 10553 | Soulectomy
        if (!Story.questProgression(10553)) {
            Core.huntMonsterQuest(10553, ["tercesarchive", UseableMonsters[3], ClassType.Farm]);
        }

        // 10554 | A Nation Night Terror
        if (!Story.questProgression(10554)) {
            Core.huntMonsterQuest(10554, ["tercesarchive", UseableMonsters[2], ClassType.Farm]);
        }

        // 10555 | Point of No Return
        if (!Story.questProgression(10555)) {
            Core.huntMonsterQuest(
                10555,
                ["tercesarchive", UseableMonsters[3], ClassType.Farm],
                ["tercesarchive", UseableMonsters[2], ClassType.Farm],
            );
        }

        // 10556 | All Appetite
        if (!Story.questProgression(10556)) {
            Core.huntMonsterQuest(10556, ["tercesarchive", UseableMonsters[4], ClassType.Solo]);
        }

        // 10557 | Adimonde's Invitation
        if (!Story.questProgression(10557)) {
            Story.mapItemQuest(10557, "tercesarchive", 15395);
        }
    }
}

export default function main(): void {
    const script = new TercesArchive();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
