/*
name: Ultra Moglin Pets Quests
description: This script will do all the quests of Moglin Pets you own.
tags: moglin pets, seasonal, easter, quests, ultra moglin, pets, grenwog, twig, twilly,zorbak,houseguest
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/UltraMoglinQuests.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";

export class UltraMoglinPets {
    doAll(): void {
        this.twigPet();
        this.twillyPet();
        this.zorbakPet();
    }

    twigPet(): void {
        if (Core.checkInventory(Core.questRewards(10200)) || !Core.checkInventory("Ultra Twig's Gift Pet")) {
            return;
        }

        Core.addDrop(...Core.questRewards(10200));

        // Ultra Twig's Gift Quest [10200]
        Core.farmingLogger(Core.questRewards(10200)[0], 1);
        Core.huntMonsterQuest(10200, ["river", "Zardman Fisher", ClassType.Farm], ["river", "Kuro", ClassType.Farm]);
    }

    twillyPet(): void {
        if (Core.checkInventory(Core.questRewards(10199)) || !Core.checkInventory("Ultra Twilly's Gift Pet")) {
            return;
        }

        Core.addDrop(...Core.questRewards(10199));

        // Ultra Twilly's Gift Quest [10199]
        Core.huntMonsterQuest(10199, ["farm", "Treeant", ClassType.Farm]);
    }

    zorbakPet(): void {
        if (Core.checkInventory(Core.questRewards(10201)) || !Core.checkInventory("Ultra Zorbak's Gift Pet")) {
            return;
        }

        Core.addDrop(...Core.questRewards(10201));

        // Ultra Zorbak's Gift Quest [10201]
        Core.huntMonsterQuest(10201, ["graveyard", "Skeletal Warrior", ClassType.Farm]);
    }
}

export default function main(): void {
    const script = new UltraMoglinPets();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
