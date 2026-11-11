/*
name: Castle Party Story
description: This will finish the storyline of Castle Party.
tags: castle party,castleparty,seasonal,aqwbirthday,tara,story,gifts
*/
// Port of Scripts/Seasonal/AqwBirthday/CastleParty.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class CastleParty {
    storyline(): void {
        if (Core.isCompletedBefore(10437)) {
            return;
        }

        Story.preLoad(this.storyline);

        //#region Useable Monsters
        const UseableMonsters = [
            "Lost Giftbox", // UseableMonsters[0],
            "Treasure Chest", // UseableMonsters[1],
            "Nulgath's Gift", // UseableMonsters[2],
            "Kathool's Gift", // UseableMonsters[3],
            "Legion Partycrasher", // UseableMonsters[4],
            "Noxus' Gift", // UseableMonsters[5],
            "Sally's Gift", // UseableMonsters[6],
            "Drakath's Gift", // UseableMonsters[7]
        ];
        //#endregion Useable Monsters
        // 10429 | Tara and Celestia's Gifts
        if (!Story.questProgression(10429)) {
            Core.huntMonsterQuest(10429, ["castleparty", UseableMonsters[0], ClassType.Farm]);
        }

        // 10430 | Heroes' Gifts
        if (!Story.questProgression(10430)) {
            Core.huntMonsterQuest(10430, ["castleparty", UseableMonsters[1], ClassType.Farm]);
        }

        // 10431 | Lorekeeper Gifts
        if (!Story.questProgression(10431)) {
            Core.ensureAccept(10431);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("castleparty", "Lost Giftbox", "Maya's Giftboxes");
            Core.huntMonster("castleparty", "Treasure Chest", "Muusa's Treasures");
            Core.ensureComplete(10431);
        }

        // 10432 | Legion's Gift
        if (!Story.questProgression(10432)) {
            Core.huntMonsterQuest(10432, ["castleparty", UseableMonsters[4], ClassType.Farm]);
        }

        // 10433 | Nation's Gift
        if (!Story.questProgression(10433)) {
            Core.huntMonsterQuest(10433, ["castleparty", UseableMonsters[2], ClassType.Solo]);
        }

        // 10434 | Kathool's Gift
        if (!Story.questProgression(10434)) {
            Core.huntMonsterQuest(10434, ["castleparty", UseableMonsters[3], ClassType.Solo]);
        }

        // 10435 | Noxus' Gift
        if (!Story.questProgression(10435)) {
            Core.huntMonsterQuest(10435, ["castleparty", UseableMonsters[5], ClassType.Solo]);
        }

        // 10436 | Sally's Gift
        if (!Story.questProgression(10436)) {
            Core.huntMonsterQuest(10436, ["castleparty", UseableMonsters[6], ClassType.Solo]);
        }

        // 10437 | Drakath's Gift
        if (!Story.questProgression(10437)) {
            Core.huntMonsterQuest(10437, ["castleparty", UseableMonsters[7], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new CastleParty();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
