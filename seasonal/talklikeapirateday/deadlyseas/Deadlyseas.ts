/*
name: Deadlyseas
description: Completes the quest chain in /deadlyseas.
tags: deadlyseas, story, quests, deadlyseas
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/DeadlySeas/Deadlyseas.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";

const Story = new CoreStory();

export class Deadlyseas {
    storyline(): void {
        if (Core.isCompletedBefore(10866)) {
            return;
        }

        Story.preLoad(this.storyline);

        const UseableMonsters = [
            "Isthmian Eel",
            "Isthmian Guard",
            "Isthmian Leviathan",
            "Mermaid Hunter",
            "PunkStream Crew",
        ];

        // 10857 | Drama Alert
        Story.killQuest(10857, "deadlyseas", UseableMonsters[4]);
        // Punkstream Doubloon x12

        // 10858 | Poaching Karma
        Story.killQuest(10858, "deadlyseas", UseableMonsters[3]);
        // Desiccated Mermaid Fin x6

        // 10859 | Interested Sponsors
        Story.killQuest(10859, "deadlyseas", [
            UseableMonsters[4], // Punkstream Token x3
            UseableMonsters[3], // OMERga 3 Oil x3
        ]);

        // 10860 | Hoist the Anchor
        Story.mapItemQuest(10860, "deadlyseas", [16189, 16190, 16191]);

        // 10861 | A Bad Eeling
        if (!Story.questProgression(10861)) {
            Core.ensureAccept(10861);
            Core.getMapItem(16192, 1, "deadlyseas");
            Core.huntMonster("deadlyseas", "Isthmian Eel", "Eel Skin", 12);
            Core.ensureComplete(10861);
        }

        // 10862 | Manatees and Mermaids
        if (!Story.questProgression(10862)) {
            Core.ensureAccept(10862);
            Core.join("deadlyseas");
            bot.map.jump("r6", "Left", false);
            bot.wait.forCellChange("r6");
            Core.sleep();
            Core.getMapItem(16193, 1, "deadlyseas");
            Core.ensureComplete(10862);
        }

        // 10863 | R-eel-ed In
        Story.killQuest(10863, "deadlyseas", UseableMonsters[0]);
        // Jagged Teeth x50

        // 10864 | Angler's Game
        Story.mapItemQuest(10864, "deadlyseas", [16195, 16196]);

        // 10865 | Sons of Isthmia
        Story.killQuest(10865, "deadlyseas", UseableMonsters[1]);
        // Isthmian Pearl x6

        // 10866 | The rEELper
        Story.killQuest(10866, "deadlyseas", UseableMonsters[2]);
        // Isthmian Leviathan Defeated x1
    }
}

export default function main(): void {
    const script = new Deadlyseas();
    Core.setOptions();
    script.storyline();
    Core.setOptions(false);
}
