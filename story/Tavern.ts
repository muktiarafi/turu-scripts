/*
name: Tavern
description: Quest from `Ulfgar Geirsson` in /tavern
tags: tavern, Ulfgar Geirsson
*/
// Port of Scripts/Story/Tavern.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Tavern {
    tavernStory(): void {
        if (Core.isCompletedBefore(3181)) {
            return;
        }

        Story.preLoad(this.tavernStory);

        // 3176 | Rune Escaped
        if (!Story.questProgression(3176)) {
            Core.huntMonsterQuest(3176, ["sandport", "Tomb Robber", ClassType.Farm]);
        }

        // 3177 | Hone in on the Horn
        if (!Story.questProgression(3177)) {
            Core.huntMonsterQuest(3177, ["mythsong", "French Horned Toadragon", ClassType.Solo]);
        }

        // 3178 | Barrier Carrier
        if (!Story.questProgression(3178)) {
            Core.huntMonsterQuest(3178, ["crashsite", "Barrier Bot", ClassType.Solo]);
        }

        // 3179 | Thor's Fishing Tale
        if (!Story.questProgression(3179)) {
            Core.huntMonsterQuest(3179, ["natatorium", "Anglerfish", ClassType.Farm]);
        }

        // 3180 | Skulls, Bones, and Runestones
        if (!Story.questProgression(3180)) {
            Core.huntMonsterQuest(3180, ["battleundera", "Bone Terror", ClassType.Farm]);
        }

        // 3181 | A Key Discovery: King with the Key
        if (!Story.questProgression(3181)) {
            Core.huntMonsterQuest(3181, ["kingcoal", "Frost King", ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new Tavern();
    // Core.BankingBlackList.AddRange(new[] { "item1", "Item2", "Etc" });
    Core.setOptions();

    script.tavernStory();

    Core.setOptions(false);
}
