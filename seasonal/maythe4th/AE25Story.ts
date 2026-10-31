/*
name: AE-25's Quests
description: This script will complete AE-25's Quests in /twigguhunt.
tags: ae25,ae-25,twigguhunt,twiggu hunt,may the 4th,seasonal, story, quests, may4th
*/
// Port of Scripts/Seasonal/MayThe4th/AE25Story.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { TwigguHunt } from "./TwigguHunt";

const Story = new CoreStory();
const TH = new TwigguHunt();

export class AE25Quests {
    storyline(): void {
        if (Core.isCompletedBefore(10227) || !Core.isSeasonalMapActive("twigguhunt")) {
            return;
        }

        TH.storyline();

        Story.preLoad(this.storyline);

        //#region Useable Monsters
        const UseableMonsters = [
            "Scout Droid", // UseableMonsters[0],
            "Infantry Droid", // UseableMonsters[1],
            "Bodyguard Droid", // UseableMonsters[2],
            "Twiggu's Bodyguard", // UseableMonsters[3],
            "Twiggu", // UseableMonsters[4],
            "Obliterator Droid", // UseableMonsters[5]
        ];
        //#endregion Useable Monsters
        // 10224 | Swab the Deck
        if (!Story.questProgression(10224)) {
            Core.huntMonsterQuest(
                10224,
                ["twigguhunt", UseableMonsters[1], ClassType.Farm],
                ["twigguhunt", UseableMonsters[0], ClassType.Farm],
            );
        }

        // 10225 | Raise the Sails
        if (!Story.questProgression(10225)) {
            Core.huntMonsterQuest(10225, ["twigguhunt", UseableMonsters[2], ClassType.Farm]);
        }

        // 10226 | Onward!
        Story.mapItemQuest(10226, "twigguhunt", 14416);
        Story.killQuest(10226, "twigguhunt", UseableMonsters[2]);

        // 10227 | Batten Down the Hatches
        if (!Story.questProgression(10227)) {
            Core.huntMonsterQuest(10227, ["twigguhunt", UseableMonsters[5], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new AE25Quests();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
