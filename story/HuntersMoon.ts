/*
name: Hunter's Moon Story
description: This will finish the Hunter's Moon Story.
tags: story, quest, hunters-moon
*/
// Port of Scripts/Story/HuntersMoon.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class HuntersMoon {
    storyLine(): void {
        if (Core.isCompletedBefore(6810)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //#region Marchosias Fight
        // Curse of the Moon 6699
        Story.killQuest(6699, "marchosiasfight", "Marchosias");
        //#endregion
        //#region Hunter's Moon
        // Put out the Fire 6700
        Story.killQuest(6700, "huntersmoon", "Dark Fire");

        // The Most Dire of Beasts 6701
        Story.killQuest(6701, "huntersmoon", "Eclipsed One");

        // Find the Elder 6702
        Story.mapItemQuest(6702, "huntersmoon", 6195);

        // Send them Home 6703
        Story.mapItemQuest(6703, "huntersmoon", 6194, 6);

        // Who are the Blood Moon Clan? 6704
        Story.killQuest(6704, "huntersmoon", "Blood Moon Hooligan");

        // Light the Torches 6705
        Story.killQuest(6705, "huntersmoon", "Dark Fire");

        // Gather the Blood 6706
        Story.killQuest(6706, "huntersmoon", "Eclipsed One");

        // Find the Skull! 6707
        if (!Story.questProgression(6707)) {
            Core.ensureComplete(6707);
            Core.killMonster("huntersmoon", "r6", "Left", "Marchosias Acolyte", "Skull of Voland");
            Core.ensureComplete(6707);
        }

        // Tree of Wisdom 6708
        Story.mapItemQuest(6708, "huntersmoon", 6193);

        // Shards of Moonlight 6709
        Story.mapItemQuest(6709, "huntersmoon", 6192, 10);

        // Moon-Struck 6710
        Story.killQuest(6710, "huntersmoon", "Eclipsed One");

        // Offer the Skull 6711
        Story.mapItemQuest(6711, "huntersmoon", 6191);

        // The Fighting Spirit 6712
        Story.killQuest(6712, "huntersmoon", "Spirit of Voland");
        //#endregion
        //#region Moon Cursed Lair
        // Moon Crystals 6799
        Story.killQuest(6799, "mooncursedlair", "Shard of Moonlight");

        // Eclipsed Blood 6800
        Story.killQuest(6800, "mooncursedlair", "Eclipsed One");

        // Heart of the Bear 6801
        Story.killQuest(6801, "mooncursedlair", "Tainted Grizzly");

        // Forge of the Moon 6802
        Story.mapItemQuest(6802, "mooncursedlair", 6325);

        // Bear-ly Alive 6803
        Story.killQuest(6803, "mooncursedlair", "Corrupted Bear");

        // Cleanse the Filth 6804
        Story.killQuest(6804, "mooncursedlair", "Corrupted Sludge");

        // Search the Cave 6805
        Story.mapItemQuest(6805, "mooncursedlair", 6326);

        // Clear the Eclipse 6806
        Story.killQuest(6806, "mooncursedlair", "Eclipsed One");

        // Interrogation 6807
        Story.killQuest(6807, "mooncursedlair", "Blood Moon Minion");

        // Search for Clues 6808
        Story.killQuest(6808, "mooncursedlair", "Matted Yuck");

        // Check the Nest 6809
        Story.mapItemQuest(6809, "mooncursedlair", 6327);

        // Defeat Marchosias! 6810
        Story.killQuest(6810, "mooncursedlair", "Marchosias");
        //#endregion
    }
}

export default function main(): void {
    const script = new HuntersMoon();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
