/*
name: Infernal Paradise
description: This will finish the Aranx' quests in /infernalparadise.
tags: story, quest, queen of monster, celestial realm, infernalparadise,aranx, extra,qom
*/
// Port of Scripts/Story/QueenofMonsters/Extra/InfernalParadise.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";
import { CelestialPast } from "./CelestialPast";

const Story = new CoreStory();
const CP = new CelestialPast();

export class InfernalParadise {
    storyline(): void {
        if (Core.isCompletedBefore(10081)) {
            return;
        }

        CP.completeCeletialPast();

        Story.preLoad(this.storyline);

        //#region Useable Monsters
        const UseableMonsters = [
            "Infernal Mage", // UseableMonsters[0],
            "Infernal Malxas", // UseableMonsters[1],
            "Infernal Knight", // UseableMonsters[2],
            "Akh-a", // UseableMonsters[3],
            "Maah-na", // UseableMonsters[4],
            "Azalith", // UseableMonsters[5]
        ];
        //#endregion Useable Monsters
        // 10073 | Revoked Devotion
        if (!Story.questProgression(10073)) {
            Core.huntMonsterQuest(10073, ["infernalparadise", UseableMonsters[0], ClassType.Farm]);
        }

        // 10074 | Reverence is Fear
        Story.mapItemQuest(10074, "infernalparadise", 14158, 5);

        // 10075 | Incidental Fall
        if (!Story.questProgression(10075)) {
            Core.huntMonsterQuest(10075, ["infernalparadise", UseableMonsters[1], ClassType.Solo]);
        }

        // 10076 | Knight-Erratic
        if (!Story.questProgression(10076)) {
            Core.huntMonsterQuest(10076, ["infernalparadise", UseableMonsters[2], ClassType.Farm]);
        }

        // 10077 | Terrified Terrors
        Story.mapItemQuest(10077, "infernalparadise", 14159, 5);

        // 10078 | Eudaimonia
        if (!Story.questProgression(10078)) {
            Core.ensureAccept(10078);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("infernalparadise", "Akh-a", "Akh-a's Halo");
            Core.huntMonster("infernalparadise", "Maah-na", "Maah-na's Halo");
            Core.ensureComplete(10078);
        }

        // 10079 | Giver and Redeemer
        Story.mapItemQuest(10079, "infernalparadise", 14160, 6);

        // 10080 | Losing the Cause
        if (!Story.questProgression(10080)) {
            Core.huntMonsterQuest(10080, ["infernalparadise", UseableMonsters[0], ClassType.Farm]);
        }

        // 10083 | Building Doubts
        if (!Story.questProgression(10083)) {
            Core.huntMonsterQuest(10083, ["infernalparadise", UseableMonsters[2], ClassType.Farm]);
        }

        // 10081 | Azalith the Disavowed
        if (!Story.questProgression(10081)) {
            Core.huntMonsterQuest(10081, ["infernalparadise", UseableMonsters[5], ClassType.Dodge]);
        }
    }
}

export default function main(): void {
    const script = new InfernalParadise();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
