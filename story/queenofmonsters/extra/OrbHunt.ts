/*
name: Orb Hunt (Extra)
description: This will finish the Orb Hunt quest.
tags: story, quest, queen-of-monsters, orb-hunt, extra
*/
// Port of Scripts/Story/QueenofMonsters/Extra/OrbHunt.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";

const Story = new CoreStory();

export class OrbHunt {
    orbHuntSaga(): void {
        if (Core.isCompletedBefore(8349)) {
            return;
        }

        Story.preLoad(this.orbHuntSaga);

        // 8302|Fallen Nopperabo
        Story.killQuest(8302, "queenreign", "Samurai Nopperabo");

        // 8303|Samurai of Jaaku
        Story.killQuest(8303, "queenreign", "Shadow Samurai");

        // 8304|Constructing the Portal
        if (!Story.questProgression(8304)) {
            Core.ensureAccept(8304);
            Core.huntMonster("queenreign", "Samurai Nopperabo", "Yokai Energy", 3);
            Core.huntMonster("queenreign", "Shadow Samurai", "Shadow Energy", 3);
            Story.mapItemQuest(8304, "queenreign", 9120);
        }
        // 8305|Into the Yokai Realm
        Story.killQuest(8305, "queenreign", "Tsukumo-Gami");

        // 8306|Jaaku's Shadow
        Story.killQuest(8306, "queenreign", "Jaaku's Shadow");

        // 8307|The Forces of Jaaku
        Story.killQuest(8307, "queenreign", "Tsukumo-Gami");

        // 8308|The Wind Orb
        Story.killQuest(8308, "queenreign", "Jaaku");

        // 8309|Super Spreaders
        Story.killQuest(8309, "queenreign", "Plague Spreader");

        // 8310|Sample Size
        Story.mapItemQuest(8310, "queenreign", 9121, 4);

        // 8311|Moss You Be This Nasty
        Story.killQuest(8311, "queenreign", "Plaguemoss");

        // 8312|Infected With The Cure
        if (!Story.questProgression(8312)) {
            Core.ensureAccept(8312);
            Core.getMapItem(9122, 4, "queenreign");
            Core.huntMonster("queenreign", "Plaguemoss", "Cure Tested", 4);
            Core.ensureComplete(8312);
        }

        // 8313|Hurtful Healing
        Story.killQuest(8313, "queenreign", "Plaguemoss");

        // 8314|The Energy Orb
        Story.killQuest(8314, "queenreign", "Extriki");

        // 8315|Amethite, Am I Right?
        Story.killQuest(8315, "queenreign", "Calcified Amethite");

        // 8316|Reinforcements Deployed
        Story.mapItemQuest(8316, "queenreign", 9123, 4);

        // 8317|Wyrms Below
        Story.killQuest(8317, "queenreign", "Calcified Wyrm");

        // 8318|Lair Located
        if (!Story.questProgression(8318)) {
            Core.ensureAccept(8318);
            Core.getMapItem(9124, 1, "queenreign");
            Core.huntMonster("queenreign", "Calcified Remains", "Calcified Remains Defeated", 6);
            Core.ensureComplete(8318);
        }

        // 8319|The Earth Orb
        Story.killQuest(8319, "queenreign", "Grou'luu");

        // 8320|Goblin Down Water
        Story.killQuest(8320, "queenreign", "Water Goblin");

        // 8321|Spawn of the Salt Sower
        Story.killQuest(8321, "queenreign", "Sa-Laatan Spawn");

        // 8322|Faerie in Danger
        Story.killQuest(8322, "queenreign", "Water Goblin");

        // 8323|Fertility Ward
        Story.mapItemQuest(8323, "queenreign", 9125, 5);

        // 8324|Path to Sa-Laatan
        Story.killQuest(8324, "queenreign", "Water Goblin");

        // 8325|The Water Orb
        Story.killQuest(8325, "queenreign", "Sa-Laatan");

        // 8326|Water. Earth. Energy? Air.
        if (!Story.questProgression(8326)) {
            Core.ensureAccept(8326);
            Core.huntMonster("queenreign", "Sa-Laatan", "Sa-Lataan Defeated", 1);
            Core.huntMonster("queenreign", "Grou'luu", "Grou'luu Defeated", 1);
            Core.huntMonster("queenreign", "Extriki", "Extriki Defeated", 1);
            Core.huntMonster("queenreign", "Jaaku", "Jaaku Defeated", 1);
            Core.ensureComplete(8326);
        }

        // 8328|Plant Stalk-ers
        Story.killQuest(8328, "orbhunt", "Seed Stalker");

        // 8329|Rage Against the Mach-Wing
        Story.killQuest(8329, "orbhunt", "Ragewing");

        // 8330|Tower Wards
        Story.mapItemQuest(8330, "orbhunt", 9156, 4);
        Story.mapItemQuest(8330, "orbhunt", 9157, 4);

        // 8331|The Final Barrier
        Story.killQuest(8331, "orbhunt", "Seed Stalker");

        // 8332|The Fire Orb
        Story.killQuest(8332, "orbhunt", "Chamat");

        // 8333|Lotus Be Done With This
        Story.killQuest(8333, "orbhunt", "Lotus Spider");

        // 8334|Lightless Light
        Story.killQuest(8334, "orbhunt", "Suffocated Light");

        // 8335|Suffocation Investigation
        Story.mapItemQuest(8335, "orbhunt", 9158, 4);

        // 8336|Gone With the Djinn
        if (!Story.questProgression(8336)) {
            Core.ensureAccept(8336);
            Core.getMapItem(9159, 1, "orbhunt");
            Core.huntMonster("orbhunt", "Lotus Spider", "Djinn Energy Restored", 10);
            Core.ensureComplete(8336);
        }

        // 8337|The Light Orb
        Story.killQuest(8337, "orbhunt", "Sek Duat I");

        // 8338|The Light Orb, Part II
        Story.killQuest(8338, "orbhunt", "Horothotep");

        // 8339|Nax-ty Beasts
        Story.killQuest(8339, "orbhunt", "Nax Beast");

        // 8340|Children of the Night
        if (!Story.questProgression(8340)) {
            Core.ensureAccept(8340);
            Core.getMapItem(9160, 4, "orbhunt");
            Core.huntMonster("orbhunt", "Hive", "Battles Overturned", 8);
            Core.ensureComplete(8340);
        }

        // 8341|We've Woken The Hive
        Story.killQuest(8341, "orbhunt", "Hive");

        // 8342|Ritual Disruption
        if (!Story.questProgression(8342)) {
            Core.ensureAccept(8342);
            Core.getMapItem(9161, 4, "orbhunt");
            Core.getMapItem(9162, 1, "orbhunt");
            Core.huntMonster("orbhunt", "Hive", "Minion Defeated", 10);
            Core.ensureComplete(8342);
        }

        // 8343|The Darkness Orb
        Story.killQuest(8343, "orbhunt", "Kolyaban");

        // 8344|The Infernal Cold
        Story.killQuest(8344, "orbhunt", "Ice Infernal");

        // 8345|Light a Fire
        Story.mapItemQuest(8345, "orbhunt", 9163, 4);

        // 8346|We Ani-must Win
        Story.killQuest(8346, "orbhunt", "Animus of Ice");

        // 8347|Bones For Stones
        if (!Story.questProgression(8347)) {
            Core.ensureAccept(8347);
            Core.huntMonster("orbhunt", "Lotus Spider", "Bones of Light", 4);
            Core.huntMonster("orbhunt", "Hive", "Bones of Monster", 4);
            Core.huntMonster("orbhunt", "Ice Infernal", "Bones of Ice", 4);
            Core.huntMonster("orbhunt", "Seed Stalker", "Bones of Mana", 4);
            Core.ensureComplete(8347);
        }

        // 8348|The Ice Orb
        Story.killQuest(8348, "orbhunt", "Quetzal");

        // 8349|A Hymn of Ice and Fire, and Light and Dark
        if (!Story.questProgression(8349)) {
            Core.ensureAccept(8349);
            Core.huntMonster("orbhunt", "Chamat", "Chamat Defeated", 1);
            Core.huntMonster("orbhunt", "Horothotep", "Horothotep Defeated", 1);
            Core.huntMonster("orbhunt", "Kolyaban", "Kolyaban Defeated", 1);
            Core.huntMonster("orbhunt", "Quetzal", "Quetzal Defeated", 1);
            Core.ensureComplete(8349);
        }
    }
}

export default function main(): void {
    const script = new OrbHunt();
    Core.setOptions();

    script.orbHuntSaga();

    Core.setOptions(false);
}
