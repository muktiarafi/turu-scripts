/*
name: Blaze Beard Story
description: This will finish the Blaze Beard Story Quest.
tags: story, quest, blaze-beard, pirate
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/BlazeBeardStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class BlazeBeard {
    // string[] RequiredItems = { "Pirate Booty I", "Pirate Booty II", "Pirate Booty III", "Pirate Booty IV", "Pirate Booty V", "Pirate Booty VI", "Pirate Booty VII", "Pirate Booty VIII", "Pirate Booty IX", "Pirate Booty X", "Pirate Booty XI", "Pirate Booty XII", "Pirate Booty XIII", "Pirate Booty XIV", "Pirate Booty XV" };

    tokenQuests(): void {
        const QuestLogic = (): void => {
            switch (Story.legacyQuestId) {
                case 4514:
                    Core.huntMonster("CrashSite", "Barrier Bot", "Dwakel Scrap Metal", 10);
                    break;
                case 4515:
                    Core.huntMonster("Mafic", "Living Fire", "Mysterious Molten Metal", 12);
                    break;
                case 4516:
                    Core.huntMonster("Elemental", "Mana Falcon", "Mana Droplets", 12);
                    break;
                case 4517:
                    Core.huntMonster("EarthStorm", "Earth Elemental", "No Explosion", 15);
                    break;
                case 4518:
                    Core.getMapItem(3725, 12, "BlazeBeard");
                    break;
                case 4519:
                    Core.getMapItem(3725, 12, "BlazeBeard");
                    break;
                case 4520:
                    Core.huntMonster("BlazeBeard", "Pirate Plunderer", "Blazebeard's Plans", 5);
                    break;
                case 4521:
                    Core.huntMonster("BlazeBeard", "Pirate Plunderer", "Blazebeard's Plans", 5);
                    break;
                case 4522:
                    Core.huntMonster("BlazeBeard", "Pirate Captain", "Captain Defeated");
                    break;
                case 4523:
                    Core.huntMonster("ManaCannon", "Pirate Gunner", "Hand Cannons", 6);
                    break;
                case 4524:
                    Core.huntMonster("ManaCannon", "Pirate Plunderer", "Location Researched", 10);
                    break;
                case 4525:
                    Core.huntMonster("ManaCannon", "Pirate Crew", "Crew Defeated", 15);
                    break;
                case 4526:
                    Core.huntMonster("ManaCannon", "Pirate Caster", "Pirate Caster Defeated", 15);
                    break;
                case 4527:
                    Core.huntMonster("ManaCannon", "Blazebeard", "Blazebeard Doused");
                    break;
            }
        };
        if (Core.checkInventory("Pirate Booty XV") || !Core.isSeasonalMapActive("BlazeBeard")) {
            return;
        }

        Story.preLoad(this.tokenQuests);

        Story.legacyQuestManager(
            QuestLogic,
            4513,
            4514,
            4515,
            4516,
            4517,
            4518,
            4519,
            4520,
            4521,
            4522,
            4523,
            4524,
            4525,
            4526,
            4527,
        );
    }
}

export default function main(): void {
    const script = new BlazeBeard();
    // Core.BankingBlackList.AddRange(RequiredItems);
    Core.setOptions();

    script.tokenQuests();

    Core.setOptions(false);
}
