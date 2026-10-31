/*
name: Lae Wedding Story
description: This will finish the Lae Wedding Story.
tags: story, quest, lae-wedding,they,lae,wedding,laewed
*/
// Port of Scripts/Story/LaeWedding.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class LaeWedding {
    useableMonsters!: string[];

    constructor() {
        this.useableMonsters = [
            "Possessed Rat", // UseableMonsters[0],
            "Possessed Spider", // UseableMonsters[1],
            "Vengeful Spirit", // UseableMonsters[2],
            "Wrathful Spirit", // UseableMonsters[3],
            "Haunted Closet", // UseableMonsters[4],
            "Blood Witch", // UseableMonsters[5]
        ];
    }

    storyline(): void {
        if (Core.isCompletedBefore(9953)) {
            return;
        }

        Story.preLoad(this.storyline);

        // 9944 | Wedding Reception
        Story.mapItemQuest(9944, "laewed", [13769, 13770]);

        // 9945 | Rats in the Walls
        if (!Story.questProgression(9945)) {
            Core.huntMonsterQuest(9945, ["laewed", this.useableMonsters[0], ClassType.Farm]);
        }

        // 9946 | Blissfully Unaware
        Story.mapItemQuest(9946, "laewed", [13771, 13772]);

        // 9947 | Caspar's Web
        if (!Story.questProgression(9947)) {
            Core.huntMonsterQuest(9947, ["laewed", this.useableMonsters[1], ClassType.Farm]);
        }

        // 9948 | Terrorized Tailors
        Story.mapItemQuest(9948, "laewed", [13773, 13774]);

        // 9949 | Occult Objection
        if (!Story.questProgression(9949)) {
            Core.ensureAccept(9949);
            Core.getMapItem(13775, 1, "laewed");
            Core.huntMonster("laewed", "Vengeful Spirit", "Vengeful Ectoplasm", 8);
            Core.ensureComplete(9949);
        }

        // 9950 | Wraithful
        if (!Story.questProgression(9950)) {
            Core.ensureAccept(9950);
            Core.getMapItem(13776, 1, "laewed");
            Core.huntMonster("laewed", "Wrathful Spirit", "Wrathful Ectoplasm", 6);
            Core.ensureComplete(9950);
        }

        // 9951 | Old, Blue, and…?
        if (!Story.questProgression(9951)) {
            Core.huntMonsterQuest(9951, ["laewed", this.useableMonsters[4], ClassType.Solo]);
        }

        // 9952 | Aisle Rampage
        if (!Story.questProgression(9952)) {
            Core.huntMonsterQuest(
                9952,
                ["laewed", this.useableMonsters[2], ClassType.Farm],
                ["laewed", this.useableMonsters[3], ClassType.Farm],
            );
        }

        // 9953 | Blood-Soaked Witchery
        if (!Story.questProgression(9953)) {
            Core.huntMonsterQuest(9953, ["laewed", this.useableMonsters[5], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new LaeWedding();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
