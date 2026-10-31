/*
name: Pirate Hunt Story
description: Completes the storyline in piratehunt
tags: piratehunt, story, saga
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/PirateHunt.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class PirateHuntStory {
    pirateHuntSaga(): void {
        if (Core.isCompletedBefore(10399)) {
            return;
        }

        Story.preLoad(this.pirateHuntSaga);

        // Ensure bot keeps required flags for final quest
        Core.addDrop(
            "Belladonna's Flag",
            "Bourgeois' Flag",
            "Pirated Tech's Flag",
            "Merry Celeste's Flag",
            "Mercurius' Flag",
        );

        // 10389 - My Unfair Lady
        Core.equipClass(ClassType.Farm);
        Story.killQuest(10389, "piratehunt", "Belladonna Pirate");

        // 10390 - Bumbling Bellamy
        Core.equipClass(ClassType.Solo);
        Story.killQuest(10390, "piratehunt", "Captain Bellamy");

        // 10391 - Verich City
        Core.equipClass(ClassType.Farm);
        Story.killQuest(10391, "piratehunt", "Bourgeois Pirate");

        // 10392 - From the Top
        Core.equipClass(ClassType.Solo);
        Story.killQuest(10392, "piratehunt", "Captain Verich");

        // 10393 - Technical Piracy
        Core.equipClass(ClassType.Farm);
        Story.killQuest(10393, "piratehunt", "Pirated Tech");

        // 10394 - Subversive Sailor
        Core.equipClass(ClassType.Solo);
        Story.killQuest(10394, "piratehunt", "Captain Chamfer");

        // 10395 - Plundered Souls
        Core.equipClass(ClassType.Farm);
        Story.killQuest(10395, "piratehunt", "Merry Celeste Crew");

        // 10396 - Salty Spirit
        Core.equipClass(ClassType.Solo);
        Story.killQuest(10396, "piratehunt", "Captain Haines");

        // 10397 - Nautical Narcissism
        Core.equipClass(ClassType.Farm);
        Story.killQuest(10397, "piratehunt", "Mercurius Pirate");

        // 10398 - Mercurious
        Core.equipClass(ClassType.Solo);
        if (!Story.questProgression(10398)) {
            Core.ensureAccept(10398);
            Core.huntMonster("piratehunt", "Captain Mercurius", "Mercurius' Funny Hat", 1);
            Core.huntMonster("piratehunt", "Dragonsworn Larunda", "Larunda's Counterfeit Amulet", 1);
            Core.ensureComplete(10398);
        }

        // 10399 - Scurvy Most Wanted
        Story.chainQuest(10399);
    }
}

export default function main(): void {
    const script = new PirateHuntStory();
    Core.setOptions();

    script.pirateHuntSaga();

    Core.setOptions(false);
}
