/*
name: Shatter Sword Story
description: This will finish the Shatter Sword Story.
tags: story, quest, shatter-sword
*/
// Port of Scripts/Story/Shattersword.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Shattersword {
    storyLine(): void {
        if (Core.isCompletedBefore(2690)) {
            return;
        }

        if (!Core.isMember) {
            Core.logger("Shattersword is a member-only storyline.");
            return;
        }

        Story.preLoad(this.storyLine);

        // King vs Beast starts slot 108. The next quest stays locked until it is complete.
        if (!Core.isCompletedBefore(2680)) {
            Core.join("shattersword");

            if (!Core.isCompletedBefore(2680, false)) {
                Core.ensureAccept(2680);
                Core.ensureComplete(2680);
            }

            if (!Core.isCompletedBefore(2680, false)) {
                Core.logger(
                    "King vs Beast [2680] did not complete. Shattersword cannot continue until this quest is unlocked.",
                    undefined,
                    { stopBot: true },
                );
                return;
            }
        }

        // Secure Shattersword Cavern 2681
        if (!Story.questProgression(2681)) {
            Core.ensureAccept(2681);
            Core.getMapItem(1642, 4, "shattersword");
            Core.killMonster("shattersword", "Enter", "Spawn", "Forest Imp", "Imp Removed", 5, { log: false });
            Core.ensureComplete(2681);
        }

        // Shatter Fallen Warriors 2682
        if (!Story.questProgression(2682)) {
            Core.ensureAccept(2682);
            Core.killMonster("shattersword", "r2", "Left", "Fallen Warrior", "Guards Slain", 4, { log: false });
            Core.ensureComplete(2682);
        }

        // Corruption Cleansed 2683
        if (!Story.questProgression(2683)) {
            Core.ensureAccept(2683);
            Core.killMonster("shattersword", "r3", "Left", "Dark Fairy", "Faerie Defeated", 6, { log: false });
            Core.killMonster("shattersword", "r3", "Left", "Dark Fairy", "Taint Reduced", 5, { log: false });
            Core.ensureComplete(2683);
        }

        // Decimate the Defiler's Army 2684
        if (!Story.questProgression(2684)) {
            Core.ensureAccept(2684);
            Core.killMonster("shattersword", "r6", "Right", "Shattersword Prisoner", "Minions Slain", 6, {
                log: false,
            });
            Core.ensureComplete(2684);
        }

        // Explosive Protection Poison 2685
        if (!Story.questProgression(2685)) {
            Core.ensureAccept(2685);
            Core.getMapItem(1643, 6, "shattersword");
            Core.getMapItem(1644, 3, "shattersword");
            Core.getMapItem(1645, 4, "shattersword");
            Core.killMonster("shattersword", "r2", "Left", "Fallen Warrior", "Flint and Striker", undefined, {
                log: false,
            });
            Core.ensureComplete(2685);
        }

        // Gravelyn's Stolen Soldiers 2686
        if (!Story.questProgression(2686)) {
            Core.ensureAccept(2686);
            Core.killMonster("shattersword", "r6", "Right", "Shattersword Prisoner", "Attackers Slain", 7, {
                log: false,
            });
            Core.ensureComplete(2686);
        }

        // Dark Sparks 2691
        if (!Story.questProgression(2691)) {
            Core.ensureAccept(2691);
            Core.killMonster("shattersword", "r3", "Left", "Dark Fairy", "Dark Spark", 25, { log: false });
            Core.ensureComplete(2691);
        }

        // When Wild Elves Attack! 2687
        if (!Story.questProgression(2687)) {
            Core.ensureAccept(2687);
            Core.killMonster("shattersword", "r7", "Right", "Forest Elf", "Treewalker Sandals", undefined, {
                log: false,
            });
            Core.killMonster("shattersword", "r7", "Right", "Forest Elf", "Rappelling Gear", undefined, { log: false });
            Core.killMonster("shattersword", "r7", "Right", "Forest Elf", "Sap-B-Gone", 3, { log: false });
            Core.ensureComplete(2687);
        }

        // Tree of Light 2688
        if (!Story.questProgression(2688)) {
            Core.ensureAccept(2688);
            Core.killMonster("shattersword", "Enter", "Spawn", "Forest Imp", "Imp Slain", 6, { log: false });
            Core.ensureComplete(2688);
        }

        // Purity Beats Corruption 2689
        if (!Story.questProgression(2689)) {
            Core.ensureAccept(2689);
            Core.getMapItem(1646, 7, "shattersword");
            Core.getMapItem(1647, 7, "shattersword");
            Core.killMonster("shattersword", "r6", "Right", "Shattersword Prisoner", "Guards Slain", 5, { log: false });
            Core.ensureComplete(2689);
        }

        // Hero vs Beast 2690
        if (!Story.questProgression(2690)) {
            Core.ensureAccept(2690);
            Core.killMonster("shattersword", "r11", "Left", "Graveclaw the Defiler", "Graveclaw Slain", undefined, {
                log: false,
            });
            Core.ensureComplete(2690);
        }
    }
}

export default function main(): void {
    const script = new Shattersword();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
