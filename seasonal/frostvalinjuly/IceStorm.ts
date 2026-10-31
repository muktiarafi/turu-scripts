/*
name: Ice Storm
description: This script completes the questline in /icestorm.
tags: ice, storm, seasonal, frostvale, july, storyline
*/
// Port of Scripts/Seasonal/FrostvalInJuly/IceStorm.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class IceStorm {
    storyline(): void {
        if (Core.isCompletedBefore(8176) || !Core.isSeasonalMapActive("icestorm")) {
            return;
        }

        Story.preLoad(this.storyline);

        // 6423|Gathering Information
        Story.mapItemQuest(6423, "icestorm", [5925, 5926, 5927]);

        // 6424|A Test of Alliance
        if (!Story.questProgression(6424)) {
            Core.ensureAccept(6424);
            Core.getMapItem(5928, 1, "lair");
            Core.huntMonster("lair", "Wyvern", "Wyvern Defeated", 6);
            Core.ensureComplete(6424);
        }

        // 6425|Inspiring the Young
        if (!Story.questProgression(6425)) {
            Core.ensureAccept(6425);
            Core.huntMonster("icestorm", "Earth Dragonling", "Gift Discovered", 1);
            Core.huntMonster("icestorm", "Earth Dragonling", "Dragonling Inspired", 8);
            Core.ensureComplete(6425);
        }

        // 6426|Following the Path
        Story.mapItemQuest(6426, "icestorm", 5929);
        Story.mapItemQuest(6426, "icestorm", 5930, 6);

        // 6427|Party Crashers
        Story.killQuest(6427, "icestorm", "Dragon Hunter");

        // 6428|Protect the Dragonlings
        if (!Story.questProgression(6428)) {
            Core.ensureAccept(6428);
            Core.huntMonster("icestorm", "Fire Dragonling", "Fire Dragonling Evacuated", 4);
            Core.huntMonster("icestorm", "Wind Dragonling", "Wind Dragonling Evacuated", 4);
            Core.huntMonster("icestorm", "Water Dragonling", "Water Dragonling Evacuated", 4);
            Core.huntMonster("icestorm", "Earth Dragonling", "Earth Dragonling Evacuated", 4);
            Core.ensureComplete(6428);
        }

        // 6429|The Ultimate Party Pooper
        Story.killQuest(6429, "icestorm", "Duncan");

        // 6430|Returning the Gifts
        Story.mapItemQuest(6430, "icestorm", 5931, 4);

        // 8173|Bang, Smash, BOOM
        Story.killQuest(8173, "brightlights", "Chaos Gemrald");

        // 8174|Fire and Fuses
        if (!Story.questProgression(8174)) {
            Core.ensureAccept(8174);
            Core.huntMonster("brightlights", "Water Goblin", "Fuse", 5);
            Core.huntMonster("brightlights", "Fire Imp", "Saltpeter", 5);
            Core.ensureComplete(8174);
        }

        // 8175|Light up the Night
        if (!Story.questProgression(8175)) {
            Core.ensureAccept(8175);
            Core.huntMonster("kingcoal", "Frost King", "Gold Powder", 2);
            Core.huntMonster("blindingsnow", "Nythera", "Indigo Powder", 5);
            Core.huntMonster("northlandlight", "Santy Claws", "Red Powder", 5);
            Core.huntMonster("brightlights", "Water Draconian", "Blue Powder", 15);
            Core.huntMonster("brightlights", "HoliDrake", "Silver Powder", 2);
            Core.ensureComplete(8175);
        }
    }
}

export default function main(): void {
    const script = new IceStorm();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
