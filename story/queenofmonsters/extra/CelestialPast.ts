/*
name: Celestial Past (Extra)
description: This will finish the Celestial Past quest.
tags: story, quest, queen-of-monsters, celestial-past, extra
*/
// Port of Scripts/Story/QueenofMonsters/Extra/CelestialPast.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";

const Story = new CoreStory();

export class CelestialPast {
    completeCeletialPast(): void {
        if (Core.isCompletedBefore(7681)) {
            return;
        }

        Story.preLoad(this.completeCeletialPast);

        //Wayfarer Potion 7674
        if (!Story.questProgression(7674)) {
            Core.ensureAccept(7674);
            Core.huntMonster("celestialpast", "Blessed Deer", "Leaf of Visibility", 1);
            Core.huntMonster("celestialpast", "Blessed Bear", "Root of Clarity", 1);
            Core.huntMonster("celestialpast", "Blessed Centaur", "Spice of Direction", 1);
            Core.huntMonster("celestialpast", "Blessed Hydra", "Broth", 1);
            Core.ensureComplete(7674);
        }

        //The Path Revealed 7675
        if (!Story.questProgression(7675)) {
            Core.ensureAccept(7675);
            Core.getMapItem(7592, 1, "CelestialPast");
            Core.huntMonster("celestialpast", "Blessed Deer", "Beasts Cleared", 5);
            Core.ensureComplete(7675);
        }

        //Well of Knowledge 7676
        if (!Story.questProgression(7676)) {
            Core.ensureAccept(7676);
            Core.getMapItem(7593, 1, "CelestialPast");
            Core.huntMonster("celestialpast", "Blessed Deer", "Beasts Defeated", 7);
            Core.ensureComplete(7676);
        }

        //Gather the Artifacts 7677
        if (!Story.questProgression(7677)) {
            Core.ensureAccept(7677);
            Core.getMapItem(7594, 1, "CelestialPast");
            Core.huntMonster("celestialpast", "Blessed Deer", "Horn of Blessed Gold", 1);
            Core.huntMonster("celestialpast", "Blessed Centaur", "Tail of Blessed Centaur", 1);
            Core.huntMonster("celestialpast", "Blessed Hydra", "Blessed Green Water", 1);
            Core.huntMonster("celestialpast", "Blessed Bear", "Blessed Bear Claw", 1);
            Core.ensureComplete(7677);
        }

        //Oh Well, Oh Well Guardian 7678
        if (!Story.questProgression(7678)) {
            Core.ensureAccept(7678);
            Core.getMapItem(7595, 1, "CelestialPast");
            Core.huntMonster("celestialpast", "Well Guardian", "Well Guardian Defeated", 1);
            Core.ensureComplete(7678);
        }

        //Infernal Commands 7679
        Story.killQuest(7679, "CelestialPast", "Infernal Soldier");

        //Forward Unto Azalith 7680
        Story.killQuest(7680, "CelestialPast", "Infernal Soldier");

        //Azalith Faced 7681    [Confront Quest] - You must die here to complete it
        if (!Story.questProgression(7681)) {
            Core.ensureAccept(7681);

            while (!bot.shouldExit && !bot.tempInv.contains(56077)) {
                if (bot.map.name !== "CelestialPast") {
                    /* Azalith Faced */
                    Core.join("CelestialPast");
                }
                if (bot.player.cell !== "r11a") {
                    Core.jump("r11a", "Left");
                }

                if (!bot.player.inCombat) {
                    bot.combat.attack("*");
                }

                bot.sleep(500);
                if (bot.tempInv.contains(56077)) {
                    /* Azalith Faced */
                    Core.jumpWait();
                    break;
                }
            }

            Core.ensureComplete(7681);
        }
    }
}

export default function main(): void {
    const script = new CelestialPast();
    Core.setOptions();

    script.completeCeletialPast();

    Core.setOptions(false);
}
