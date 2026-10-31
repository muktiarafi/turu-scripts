/*
name: Zoda's Quests
description: This script will complete Zoda's Quests in /zorbaspalace.
tags: zodas, zorbas, palace, seasonal, story, quests, may4th
*/
// Port of Scripts/Seasonal/MayThe4th/Zoda.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();
const Farm = new CoreFarms();

export class Zoda {
    storyline(): void {
        if (Core.isCompletedBefore(8651) || !Core.isSeasonalMapActive("zorbaspalace")) {
            return;
        }

        Story.preLoad(this.storyline);

        // Dig Deep (8644)
        Story.killQuest(8644, "dwarfhold", "Glow Worm");

        // The Fire Within (8645)
        Story.killQuest(8645, "firestorm", "Living Fire");

        // Spare Parts (8646)
        Story.killQuest(8646, "thespan", "Training Globe");

        // Diplomatic Solution (8647)
        if (!Story.questProgression(8647)) {
            this.assembledSword();
        }

        // The Path Quests (8648, 8649, 8650)
        if (!Core.isCompletedBefore(8648) && !Core.isCompletedBefore(8649) && !Core.isCompletedBefore(8650)) {
            this.assembledSword();

            if (Farm.factionRank("Good") === 10) {
                Core.addDrop("Goregold Resisted");
                Story.killQuest(8648, "greed", "Goregold");
            } else if (Farm.factionRank("Evil") === 10) {
                Core.addDrop("Fifth Sepulchure Defeated");
                Story.killQuest(8649, "murdermoon", "Fifth Sepulchure");
            } else {
                Farm.chaosREP();
                Core.addDrop("Ledgermayne Defeated");
                Story.killQuest(8650, "ledgermayne", "Ledgermayne");
            }
        }

        // Search the Pit (8651)
        Core.equipClass(ClassType.Solo);
        Story.killQuest(8651, "zorbaspit", "ZorBLATT");
    }

    assembledSword(): void {
        if (Core.checkInventory("Assembled Sword")) {
            return;
        }

        Core.addDrop("Assembled Sword");
        Core.ensureAccept(8647);
        if (!Core.checkInventory(["Wired Innards", "Sword Billet"])) {
            Core.ensureAccept(8646);
            Core.huntMonster("thespan", "Training Globe", "Spare Wires", 10);
            Core.ensureComplete(8646);
        }
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("zorbaspalace", "Zorba the Bakk");
        Core.ensureComplete(8647);
    }
}

export default function main(): void {
    const script = new Zoda();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
