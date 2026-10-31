/*
name: The Conqueror of Glacera
description: This script will complete "The Conqueror of Glacera" [9492] quest.
tags: glacera, karok, wings, fallen, runed, glaceran, loyalty, sigil, frigid, scythe, vengeance, conqueror
*/
// Port of Scripts/Other/TheConquerorOfGlacera.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { FrostSpiritReaver } from "./classes/FrostSpiritReaver";
import { GlaceraStory } from "../story/Glacera";

const IWP = new GlaceraStory();
const FSR = new FrostSpiritReaver();

export class TheConquerorOfGlacera {
    doQuest(): void {
        if (Core.checkInventory(Core.questRewards(9492))) {
            return;
        }

        // Pet Prereq
        Core.huntMonster("northstar", "Karok The Fallen", "Karok Companion", undefined, { isTemp: false });

        Core.ensureAccept(9492);

        Core.addDrop("Rime Token", "Glaceran Gem", "Ice Chunk", "Glaceran Attunement");

        Core.equipClass(ClassType.Farm);

        // Rime Token
        Core.killMonster("battlegroundd", "r2", "Left", "*", "Rime Token", 200, { isTemp: false });

        // Glaceran Gem
        if (!Core.checkInventory("Glaceran Gem", 500)) {
            IWP.iceWindPass();
            Core.equipClass(ClassType.Farm);
            Core.registerQuests(5597, 5598);
            while (!bot.shouldExit && !Core.checkInventory("Glaceran Gem", 500)) {
                while (!bot.shouldExit && bot.map.name !== "icewindwar") {
                    Core.join("icewindwar");
                    Core.sleep();
                }

                while (!bot.shouldExit && bot.player.cell !== "r2") {
                    Core.jump("r2");
                    Core.sleep();
                }

                for (const mob of bot.monsters.currentAvailableMonsters.filter((m) => m.cell === "r2")) {
                    bot.kill.monster(mob.mapId);
                    if (Core.checkInventory("Glaceran Gem", 500)) {
                        break;
                    }
                }
            }

            Core.cancelRegisteredQuests();
            bot.wait.forPickup("Glaceran Gem");
        }

        // Ice Chunk
        Core.killMonster("northmountain", "r3", "Left", "*", "Ice Chunk", 600, { isTemp: false });

        // Glaceran Attunement
        FSR.glaceranAttunement(10);

        Core.equipClass(ClassType.Farm);
        Core.unbank("Rime Token", "Glaceran Gem", "Ice Chunk", "Glaceran Attunement");

        Core.ensureComplete(9492);
    }
}

export default function main(): void {
    const script = new TheConquerorOfGlacera();
    Core.setOptions();

    script.doQuest();
    Core.setOptions(false);
}
