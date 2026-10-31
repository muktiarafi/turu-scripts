/*
name: Isthmiacastle
description: Completes the quest chain in /isthmiacastle.
tags: isthmiacastle, story, quests, isthmiacastle
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/DeadlySeas/Isthmiacastle.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";
import { Deadlyseas } from "./Deadlyseas";

const Story = new CoreStory();
const Prerequisite = new Deadlyseas();

export class Isthmiacastle {
    storyline(): void {
        if (Core.isCompletedBefore(10878)) {
            return;
        }

        Prerequisite.storyline();

        Story.preLoad(this.storyline);

        const UseableMonsters = ["Isthmian Eel", "Isthmian Guard", "Mersoul", "Reaper of the Sea", "Reaper Shark"];

        // 10869 | Elf Loser vs Pirate Beauty, Live Now!
        Story.mapItemQuest(10869, "isthmiacastle", 16208);

        // 10870 | Haddock Enough
        Story.killQuest(10870, "isthmiacastle", UseableMonsters[1]);
        // Isthmian Sea Biscuit x3

        // 10871 | Rogue Carp
        if (!Story.questProgression(10871)) {
            Core.ensureAccept(10871);
            Core.getMapItem(16209, 1, "isthmiacastle");
            Core.huntMonster("isthmiacastle", "Isthmian Eel", "Eel Stomach Stone", 6);
            Core.ensureComplete(10871);
        }

        // 10872 | Carpe Die
        Story.killQuest(10872, "isthmiacastle", [
            UseableMonsters[1], // Guard's Spindle Shell x4
            UseableMonsters[0], // Knotted Eel x6
        ]);

        // 10873 | Nurse Shark
        if (!Story.questProgression(10873)) {
            Core.ensureAccept(10873);
            Core.getMapItem(16210, 1, "isthmiacastle");
            Core.huntMonster("isthmiacastle", "Reaper Shark", "Shark Scythe", 12);
            Core.ensureComplete(10873);
        }

        // 10874 | Fish are Friends
        Story.mapItemQuest(10874, "isthmiacastle", 16211);
        Story.mapItemQuest(10874, "isthmiacastle", 16214, 10);

        // 10875 | Dead Management
        if (!Story.questProgression(10875)) {
            Core.ensureAccept(10875);
            Core.getMapItem(16212, 1, "isthmiacastle");
            Core.huntMonster("isthmiacastle", "Isthmian Eel", "Guard's Sand Dollar", 2);
            Core.ensureComplete(10875);
        }

        // 10876 | Dream of the Lost
        Story.mapItemQuest(10876, "isthmiacastle", 16213);

        // 10877 | Ghostly Vitreolus
        Story.killQuest(10877, "isthmiacastle", UseableMonsters[2]);
        // Pearlescent Silt x6

        // 10878 | Reaper Leviathan
        Story.killQuest(10878, "isthmiacastle", UseableMonsters[3]);
        // Reaper of the Sea Defeated x1
    }
}

export default function main(): void {
    const script = new Isthmiacastle();
    Core.setOptions();
    script.storyline();
    Core.setOptions(false);
}
