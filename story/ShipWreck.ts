/*
name: Ship Wreck Story
description: This will finish the Ship Wreck Story.
tags: story, quest, shipwreck
*/
// Port of Scripts/Story/ShipWreck.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class ShipWreck {
    storyLine(): void {
        const QuestLogic = (): void => {
            switch (Story.legacyQuestId) {
                case 4418:
                    // Midas Touched 4418
                    Core.huntMonster("shipwreck", "Gilded Merdraconian", "Mangled Merdraconian", 10);
                    break;
                case 4419:
                    // Clearing the Cargo hold 4419
                    Core.huntMonster("shipwreck", "Cursed Pirate", "Pirate Interrogated", 4);
                    Core.huntMonster("shipwreck", "Gilded Crystal Undead", "Captured Crystal Crew", 8);
                    break;
                case 4420:
                    // Au-Dacity to Attack 4420
                    Core.huntMonster("shipwreck", "Cursed Pirate", "Pirate Pistols", 8);
                    break;
                case 4421:
                    // Getting the Gauntlet 4421
                    Core.huntMonster("shipwreck", "Cursed Pirate", "Snatched Material", 12);
                    break;
                case 4422:
                    // Against the Elements 4422
                    Core.huntMonster("shipwreck", "Gilded Water", "Liquified Living Water", 10);
                    break;
                case 4423:
                    // Gold Men Tell No Tales 4423
                    Core.huntMonster("shipwreck", "Cursed Pirate", "Detained Crewman", 12);
                    break;
                case 4424:
                    // Taking Sides 4424
                    Core.huntMonster("shipwreck", "Gilded Merdraconian", "Powerfully Persuaded Merdraconian", 11);
                    break;
                case 4425:
                    // Crystallized Crew 4425
                    Core.huntMonster("shipwreck", "Gilded Crystal Undead", "Crystallized Crowbar");
                    break;
                case 4426:
                    // Getting a Nubar of Gold 4426
                    Core.huntMonster("shipwreck", "Captain Nubar", "No More Nubar");
                    break;
                case 4427:
                    // Killer Coral 4427
                    Core.getMapItem(3573, 1, "shipwreck");
                    break;
                case 4428:
                    // Driving for Xergon 4428
                    Core.huntMonster("shipwreck", "Lobthulhu", "Lobster a la mode");
                    break;
            }
        };
        if (Core.checkInventory("Lobthulu Claw")) {
            return;
        }

        Story.legacyQuestManager(QuestLogic, 4418, 4419, 4420, 4421, 4422, 4423, 4424, 4425, 4426, 4427, 4428);

        Core.unbank(
            "Golden Scale",
            "Crystal Fragment",
            "Powder Flask",
            "Broken Anti-Au Crystal",
            "Flagon of Water",
            "Old Weapon",
            "Shell",
            "Crystallized Crowbar",
            "Trapdoor Key",
            "What is THAT?!",
        );
        // didn't add the last token to it
        Core.trashCan(
            "Golden Scale",
            "Crystal Fragment",
            "Powder Flask",
            "Broken Anti-Au Crystal",
            "Flagon of Water",
            "Old Weapon",
            "Shell",
            "Crystallized Crowbar",
            "Trapdoor Key",
            "What is THAT?!",
        );
    }
}

export default function main(): void {
    const script = new ShipWreck();
    Core.bankingBlackList.push(
        "Golden Scale",
        "Crystal Fragment",
        "Powder Flask",
        "Broken Anti-Au Crystal",
        "Flagon of Water",
        "Old Weapon",
        "Shell",
        "Crystallized Crowbar",
        "Trapdoor Key",
        "What is THAT?!",
        "Lobthulu Claw",
    );
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
