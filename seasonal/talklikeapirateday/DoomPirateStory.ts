/*
name: Doom Pirate
description: This script will complete the storyline in /doompirate
tags: doom, pirate, story, dusk, doompirate, gallaeon
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/DoomPirateStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class DoomPirate {
    storyline(): void {
        if (!Core.isSeasonalMapActive("doompirate") || Core.isCompletedBefore(9354)) {
            return;
        }

        Story.preLoad(this.storyline);

        // Spare Hydra Heads (9353)
        if (!Story.questProgression(9353)) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAccept(9353);
            Core.huntMonsterMapID("doompirate", 1, "Silver Doubloon", 6);
            Core.ensureComplete(9353);
        }

        // Chasing Crimson October (9354)
        if (!Story.questProgression(9354)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(9354);
            Core.huntMonsterMapID("doompirate", 3, "Dented Naval Medal");
            Core.ensureComplete(9354);
        }
    }
}

export default function main(): void {
    const script = new DoomPirate();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
