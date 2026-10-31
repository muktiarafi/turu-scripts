/*
name: UnderGround Lab Story
description: This will finish the UnderGround Lab Story.
tags: story, quest, under-ground-lab
*/
// Port of Scripts/Story/UnderGroundLab.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class UnderGroundLab {
    partofundergroundlabb(): void {
        if (Core.isCompletedBefore(3157)) {
            return;
        }

        Story.preLoad(this.partofundergroundlabb);
        Core.equipClass(ClassType.Farm);

        Core.addDrop("Unicorn Essence");

        // Hunt for the Brutal Intruder
        Story.mapItemQuest(3148, "undergroundlab", [2144, 2145, 2146, 2147, 2148]);

        // Brutal Detection Desired
        Story.mapItemQuest(3149, "undergroundlab", [2150, 2151]);
        Story.mapItemQuest(3149, "undergroundlabb", [2152, 2153]);

        // Silence the Green Screamers
        Story.killQuest(3150, "undergroundlabb", "Green Screamer");

        // Soundbooth of Horrors
        Story.killQuest(3151, "undergroundlabb", "Soundbooth Horror");

        // Skeletons in the Server Closet
        Story.killQuest(3152, "undergroundlabb", "Closet Skeleton");

        // Server Gremlags
        Story.killQuest(3153, "undergroundlabb", "Server Gremlin");

        // Window Slayer
        Story.killQuest(3154, "undergroundlabb", "Window");

        // Gamer Fuel
        if (!Story.questProgression(3155)) {
            Core.ensureAccept(3155);
            Core.huntMonster("undergroundlabb", "Invisible Ninjas", "Sushi", 1);
            Core.huntMonster("undergroundlabb", "Invisible Ninjas", "Pocky", 1);
            Core.huntMonster("undergroundlabb", "Invisible Ninjas", "Coffee", 1);
            Core.huntMonster("undergroundlabb", "Invisible Ninjas", "TableGum", 1);
            Core.ensureComplete(3155);
        }

        // Key to Doom
        Core.equipClass(ClassType.Solo);
        Story.killQuest(3156, "undergroundlabb", "Rabid Server Hamster");

        // UltraBrutal Battle
        Story.killQuest(3157, "undergroundlabb", "Ultra Brutalcorn");
    }
}

export default function main(): void {
    const script = new UnderGroundLab();
    Core.setOptions();

    script.partofundergroundlabb();

    Core.setOptions(false);
}
