/*
name: Swaggy's Chateau
description: This will complete the Swaggy's Chateau story quest.
tags: swaggys-chateau, seasonal, heros-heart-day, heart, hero, story
*/
// Port of Scripts/Seasonal/HerosHeartDay/SwaggysChateau.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class SwaggysChateau {
    completeStory(): void {
        if (Core.isCompletedBefore(6198)) {
            return;
        }

        if (!Core.isSeasonalMapActive("chateau")) {
            return;
        }

        Story.preLoad(this.completeStory);

        // LET'S PINKIFY (6188)
        Story.mapItemQuest(6188, "chateau", [5623, 5624, 5625, 5626]);

        // HEART-SHAPED FRUIT (6189)
        Story.killQuest(6189, "chateau", "Love Shrub");

        // CH-CH-CH-INCHILLA (AND SLIME) (6190)
        Story.killQuest(6190, "chateau", ["Mood Slime", "Chinchilla"]);

        // Pay the Cover Charge (6191)
        if (!Story.questProgression(6191)) {
            Core.ensureAccept(6191);
            Core.buyItem("chateau", 1548, "Admit One", 3);
            Core.ensureComplete(6191);
        }

        // Get Some Clues (6192)
        if (!Story.questProgression(6192)) {
            Core.ensureAcceptmultiple(6192, 6193, 6194, 6195);
            Core.huntMonster("chateau", "Hopeless Romantic", "Pretty Flowers", 6, { log: false });
            Core.huntMonster("chateau", "Barista", '"Hot Drink"', 5, { log: false });
            Core.huntMonster("chateau", "Stray Foam", "Floor Cleaned", 6, { log: false });
            Core.getMapItem(5627, 3, "chateau");
            Core.ensureCompleteQuests(6193, 6194, 6195, 6192);
        }

        // The VIP Lounge (6196)
        Story.killQuest(6196, "chateau", "Important Guest");

        // Get Past the Bouncer (6197)
        Story.killQuest(6197, "chateau", "Bouncer");

        // Pinky the Unicorn??? (6198)
        Story.killQuest(6198, "chateau", "Pinky");
    }
}

export default function main(): void {
    const script = new SwaggysChateau();
    Core.setOptions();

    script.completeStory();
    Core.setOptions(false);
}
