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
        if (!Story.questProgression(3634)) {
            Core.ensureAccept(3634);
            Core.huntMonster("chaosnorth", "Chaotic Symbiote", "Symbiote Slain", 10);
            Core.huntMonster("chaosnorth", "Chaorruption", "Chaorruption Cleansed", 10);
            Core.ensureComplete(3634);
        }

        // Book of Chaos and Flames 3635
        if (!Story.questProgression(3635)) {
            Core.ensureAccept(3635);
            Core.huntMonster("chaosnorth", "Chaorrupted Mage", "Chaos Magic Nullified", 13);
            Core.huntMonster("chaosnorth", "Chaorrupted Mage", "Tempus Chaos Amulet");
            Core.huntMonster("chaosnorth", "Chaorrupted Mage", "Book of Chaos and Flames");
            Core.ensureComplete(3635);
        }

        // Facets of Chaos 3636
        if (!Story.questProgression(3636)) {
            Core.ensureAccept(3636);
            Core.huntMonster("chaosnorth", "Chaos Gemrald", "Shard of Chaos", 13);
            Core.ensureComplete(3636);
        }

        // Chaos Eye Spy 3637
        if (!Story.questProgression(3637)) {
            Core.ensureAccept(3637);
            Core.huntMonster("chaosnorth", "Chaorruption", "Chaorrupted Tongue", 3);
            Core.huntMonster("chaosnorth", "Chaos Sp-eye", "Chaos Eyes", 3);
            Core.huntMonster("chaosnorth", "Chaorrupted Imp", "Imp Ears", 3);
            Core.huntMonster("chaosnorth", "Chaorrupted Mage", "Mage Nose", 3);
            Core.ensureComplete(3637);
        }

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
