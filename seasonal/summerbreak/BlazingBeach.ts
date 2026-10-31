/*
name: Blazing Beach Story
description: This will finish the Blazing Beach Story Line.
tags: story, quest, blazing-beach, summer-break
*/
// Port of Scripts/Seasonal/SummerBreak/BlazingBeach.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class BlazingBeachStory {
    storyLine(): void {
        if (!Core.isSeasonalMapActive("blazingbeach")) {
            return;
        }

        if (Core.isCompletedBefore(8708)) {
            return;
        }

        Story.preLoad(this.storyLine);

        // (Volca)No Trespassing
        Story.killQuest(8702, "blazingbeach", "Burning Bombadier");

        // Piracy for Pyromancers
        if (!Story.questProgression(8703)) {
            Core.ensureAccept(8703);
            Core.huntMonster("blazingbeach", "Magma Pirate", "Superheated Blade", 7);
            Core.huntMonster("blazingbeach", "Scalding Shooter", "Burning Blunderbuss", 5);
            Core.huntMonster("blazingbeach", "Magma Pirate", "Stolen Supplies", 10);
            Core.ensureComplete(8703);
        }

        // Canned Heat
        if (!Story.questProgression(8704)) {
            Core.ensureAccept(8704);
            Core.getMapItem(10252, 1, "blazingbeach");
            Core.huntMonster("blazingbeach", "Burning Bombadier", "Packed Firebomb", 4);
            Core.ensureComplete(8704);
        }

        // Dau Go
        if (!Story.questProgression(8705)) {
            Core.ensureAccept(8705);
            Core.huntMonster("blazingbeach", "Dao Treeant", "Cavern Wood", 12, { log: false });
            Core.killMonster("blazingbeach", "r2", "Right", "Burning Bombadier", "Redistributed Loot", 12, {
                log: false,
            });
            Core.huntMonster("burningbeach", "Water Goblin", "Goblin Canteen", 5, { log: false });
            Core.ensureComplete(8705);
        }
        // Bãi Cháy
        if (!Story.questProgression(8706)) {
            Core.ensureAccept(8706);
            Core.huntMonster("burningbeach", "Lavazard", "Lizard Lava", 5, { log: false });
            Core.huntMonster("burningbeach", "Lava Guardian", "Mage Magma", 5, { log: false });
            Core.huntMonster("blazingbeach", "Ruby Golem", "Flame Ruby", 3, { log: false });

            Core.ensureComplete(8706);
        }

        // Sung Sot
        if (!Story.questProgression(8707)) {
            Core.ensureAccept(8707);
            Core.getMapItem(10253, 1, "blazingbeach");
            Core.huntMonster("burningbeach", "Maladrite", "Maladrite's Storm Core", 1);
            Core.huntMonster("burningbeach", "Shark", "Shark Skin", 5);
            Core.ensureComplete(8707);
        }

        // Ha Long
        Story.killQuest(8708, "blazingbeach", "Magma Blazebeard");
    }
}

export default function main(): void {
    const script = new BlazingBeachStory();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
