/*
name: IconicArtifactQuest
description: Does the IconicArtifactQuest Quest, for the Krenos Spirit Katana
tags: iconicartifactquest, treasure, hunt, treasure hunt, krenos spirit katana
*/
// Port of Scripts/Other/TreasureHunts/IconicArtifactQuest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class IconicArtifact {
    iconicArtifactQuest(): void {
        if (Core.checkInventory("Krenos Spirit Katana")) {
            Core.logger('"Krenos Spirit Katana" Owned.');
            return;
        }
        Core.addDrop("Krenos Spirit Katana");
        // Iconic ArtifactQuest
        Core.ensureAccept(9804);

        Core.equipClass(ClassType.Solo);
        Core.huntMonster("shimazu", "Shimazu", "First Rune");
        Core.getMapItem(13328, undefined, "evilmarsh");
        Core.huntMonster("seraphicwarlaken", "Rayce", "Third Rune");
        bot.quests.updateQuest(4077);
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("pyrewatch", "Firestorm Major", "Fourth Rune");
        Core.getMapItem(13329, undefined, "icewindpass");

        Core.ensureComplete(9804);
    }
}

export default function main(): void {
    const script = new IconicArtifact();
    Core.bankingBlackList.push("Krenos Spirit Katana");
    Core.setOptions();

    script.iconicArtifactQuest();

    Core.setOptions(false);
}
