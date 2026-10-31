/*
name: Frozen Northlands Story
description: This will finish the Frozen Northlands Story.
tags: story, quest, frozen-northlands
*/
// Port of Scripts/Story/FrozenNorthlands.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class FrozenNorthlands {
    storyline(): void {
        if (!Core.isMember) {
            Core.logger("This is a member-only storyline.");
            return;
        }

        if (Core.isCompletedBefore(3638)) {
            return;
        }

        Story.preLoad(this.storyline);

        // Cleanse the Chaorruption 3634
        Story.killQuest(3634, "chaosnorth", ["Chaotic Symbiote", "Chaorruption"]);

        // Book of Chaos and Flames 3635
        Story.killQuest(3635, "chaosnorth", ["Chaorrupted Mage", "Chaorrupted Mage", "Chaorrupted Mage"]);

        // Facets of Chaos 3636
        if (!Story.questProgression(3636)) {
            Core.ensureAccept(3636);
            Core.huntMonster("chaosnorth", "Chaos Gemrald", "Shard of Chaos", 13);
            Core.ensureComplete(3636);
        }

        // Chaos Eye Spy 3637
        Story.killQuest(3637, "chaosnorth", ["Chaorruption", "Chaos Sp-Eye", "Chaorrupted Imp", "Chaorrupted Mage"]);

        // Defeat Chaorrupted Xan Illusion 3638
        Story.killQuest(3638, "chaosnorth", "Chaorrupted Xan");
    }
}

export default function main(): void {
    const script = new FrozenNorthlands();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
