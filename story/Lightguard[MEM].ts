/*
name: Lightguard Story
description: This will finish the Lightguard Story.
tags: story, quest, light-guard
*/
// Port of Scripts/Story/Lightguard[MEM].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Lightguard {
    storyLine(): void {
        if (!Core.isMember) {
            Core.logger("Michem Quests Is Member Only. Skipping this Script");
            return;
        }

        if (Core.isCompletedBefore(2036)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Barely Made It 2031
        Story.mapItemQuest(2031, "doomwood", 983);

        //Plant Food 2032
        Story.killQuest(2032, "doomwood", "Doomwood Treeant");

        //Supplies Party 2033
        if (!Story.questProgression(2033)) {
            Core.ensureAccept(2033);
            Core.huntMonster("doomwood", "Doomwood Bonemuncher", "Michem's Pack", 1);
            Core.huntMonster("doomwood", "Doomwood Bonemuncher", "Lightguard Supply Crate", 10);
            Core.ensureComplete(2033);
        }

        //Copious Notes 2034
        Story.killQuest(2034, "doomwood", "Doomwood Bonemuncher");

        //Lightguard Keystone 2035
        Story.mapItemQuest(2035, "lightguard", 982);

        //Defend Lightguard Keep! 2036
        Story.killQuest(2036, "lightguard", "Mysterious Spirit");
    }
}

export default function main(): void {
    const script = new Lightguard();
    Core.setOptions();
    script.storyLine();
    Core.setOptions(false);
}
