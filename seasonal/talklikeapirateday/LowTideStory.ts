/*
name: Low Tide Story
description: This will finish the Low Tide Story Quest.
tags: story, quest, low-tide, pirate
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/LowTideStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class LowTideStory {
    storyline(): void {
        if (!Core.isSeasonalMapActive("lowtide")) {
            return;
        }
        if (Core.isCompletedBefore(8845)) {
            return;
        }

        Story.preLoad(this.storyline);

        //Precious Rocks 8836
        Story.killQuest(8836, "lowtide", "Lone Pirate");

        //Fake Seagull Food 8837
        Story.mapItemQuest(8837, "lowtide", 10520, 5);

        //Summer Chill 8838
        Story.killQuest(8838, "lowtide", "Ghostly Eel");

        //Committed to the Sea 8839
        if (!Story.questProgression(8839)) {
            Core.ensureAccept(8839);
            Core.logger('Doing Quest: [8839] - "Committed to the Sea"', "QuestProgression");
            Core.huntMonster("lowtide", "Ghostly Eel", "Eels Exorcized", 6);
            Core.huntMonster("lowtide", "Lone Pirate", "Pirates Apprehended", 8);
            Core.getMapItem(10521, 5, "lowtide");
            Core.ensureComplete(8839);
            Core.logger('Completed Quest: [8839] - "Committed to the Sea"', "TryComplete");
        } else {
            Core.logger('Already Completed: [8839] - "Committed to the Sea"', "QuestProgression");
        }

        //Briny Gelatin 8840
        Story.killQuest(8840, "lowtide", "Spectral Jellyfish");

        //Sleeping with the Fishes 8841
        Story.mapItemQuest(8841, "lowtide", 10522, 3);

        //Local Delicacies 8842
        if (!Story.questProgression(8842)) {
            Core.ensureAccept(8842);
            Core.huntMonster("lowtide", "Ghostly Eel", "Eel Guts", 6);
            Core.huntMonster("lowtide", "Spectral Jellyfish", "Translucent Tentacle", 6);
            Core.ensureComplete(8842);
        }

        //Myriad Andromeda 8843
        if (!Story.questProgression(8843)) {
            Core.ensureAccept(8843);
            Core.getMapItem(10523, 1, "lowtide");
            Core.huntMonster("lowtide", "Lone Pirate", "Fake Gold Teeth", 7);
            Core.ensureComplete(8843);
        }

        //Ebbing Grudge 8844
        Story.mapItemQuest(8844, "lowtide", 10524);

        //Honeyed Apologies 8845
        Story.killQuest(8845, "lowtide", "Exiled General Miel");
    }
}

export default function main(): void {
    const script = new LowTideStory();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
