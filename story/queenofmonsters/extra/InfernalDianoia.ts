/*
name: Infernal Dianoia
description: This will finish the Azalith's quests in /infernaldianoia.
tags: story, quest, queen of monster, celestial realm, infernaldianoia,aranx,azalith, extra,qom
*/
// Port of Scripts/Story/QueenofMonsters/Extra/InfernalDianoia.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";
import { InfernalParadise } from "./InfernalParadise";

const Story = new CoreStory();
const IP = new InfernalParadise();

export class InfernalDianoia {
    storyline(): void {
        if (Core.isCompletedBefore(10094)) {
            return;
        }

        IP.storyline();

        Story.preLoad(this.storyline);

        //#region Useable Monsters
        const UseableMonsters = [
            "Infernal Pegasus", // UseableMonsters[0],
            "Bright Dominion", // UseableMonsters[1],
            "Fallen Arthelyn", // UseableMonsters[2],
            "Eudae", // UseableMonsters[3],
            "Avatar of Life", // UseableMonsters[4],
            "Avatar of Spirits", // UseableMonsters[5],
            "Avatar of Time", // UseableMonsters[6],
            "Aranx, Nightstar", // UseableMonsters[7]
        ];
        //#endregion Useable Monsters
        // 10085 | Fallen Feathers
        if (!Story.questProgression(10085)) {
            Core.huntMonsterQuest(10085, ["infernaldianoia", UseableMonsters[0], ClassType.Farm]);
        }

        // 10086 | Seven Heavens
        if (!Story.questProgression(10086)) {
            Core.huntMonsterQuest(10086, ["infernaldianoia", UseableMonsters[1], ClassType.Farm]);
        }

        // 10087 | Omniscient Judgement
        Story.mapItemQuest(10087, "infernaldianoia", 14174, 7);

        // 10088 | Rapturous Ascent
        if (!Story.questProgression(10088)) {
            Core.huntMonsterQuest(
                10088,
                ["infernaldianoia", UseableMonsters[0], ClassType.Farm],
                ["infernaldianoia", UseableMonsters[1], ClassType.Farm],
            );
        }

        // 10089 | Broken Stoicism
        if (!Story.questProgression(10089)) {
            Core.huntMonsterQuest(10089, ["infernaldianoia", UseableMonsters[2], ClassType.Solo]);
        }

        // 10090 | Bitter Blessing
        if (!Story.questProgression(10090)) {
            Core.huntMonsterQuest(10090, ["infernaldianoia", UseableMonsters[3], ClassType.Solo]);
        }

        // 10091 | Life and Spirits
        if (!Story.questProgression(10091)) {
            Core.huntMonsterQuest(
                10091,
                ["infernaldianoia", UseableMonsters[4], ClassType.Solo],
                ["infernaldianoia", UseableMonsters[5], ClassType.Solo],
            );
        }

        // 10092 | On Your Time
        if (!Story.questProgression(10092)) {
            Core.huntMonsterQuest(10092, ["infernaldianoia", UseableMonsters[6], ClassType.Solo]);
        }

        // 10093 | Rapid Metanoia
        if (!Story.questProgression(10093)) {
            Core.huntMonsterQuest(10093, ["infernaldianoia", UseableMonsters[3], ClassType.Solo]);
        }

        // 10094 | Filial Impiety
        if (!Story.questProgression(10094)) {
            Core.huntMonsterQuest(10094, ["infernaldianoia", UseableMonsters[7], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new InfernalDianoia();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
