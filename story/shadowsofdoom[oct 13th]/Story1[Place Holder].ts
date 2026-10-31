/*
name: Story1[Place Holder]
description: null
tags: null
*/
// Port of Scripts/Story/ShadowsofDoom[Oct 13th]/Story1[Place Holder].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Story1 {
    sagaName(): void {
        if (Core.isCompletedBefore(0)) {
            return;
        }

        Story.preLoad(this.sagaName);

        Story.killQuest(0, "mapname", "MonsterName");
        Story.killQuest(0, "mapname", ["Monstername", "Monstername"]);
        Story.mapItemQuest(0, "mapname", 1, 1);
        Story.mapItemQuest(0, "mapname", [0, 0, 0]);
        Story.chainQuest(0);
    }
}

export default function main(): void {
    const script = new Story1();
    Core.setOptions();

    script.sagaName();
    Core.setOptions(false);
}
