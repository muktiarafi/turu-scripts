/*
name: Enchanted Mountaineer & FlameHeart Warrior Set
description: This will do the quest to obtain the Enchanted Mountaineer and FlameHeart Warrior Sets.
tags: flameheart-warrior, enchanted-mountaineer, seasonal, frostvale
*/
// Port of Scripts/Seasonal/FrostvalInJuly/EnchantedMountaineerAndFlameHeartWarriorSets.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { IceStorm } from "./IceStorm";

const IS = new IceStorm();

export class EnchantedMountaineerAndFlameHeartWarriorSets {
    questFarming(): void {
        if (!Core.isSeasonalMapActive("BrightLights")) {
            return;
        }
        IS.storyline();

        const Rewards = Core.ensureLoad(8176).rewards.map((i) => i.name);
        Core.addDrop(...Rewards);

        let i = 0;

        while (!bot.shouldExit && !Core.checkInventory(Rewards, undefined, { toInv: false })) {
            //Bright Lights Festival Rewards 8176
            Core.ensureAccept(8176);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("BrightLights", "Fire Imp", "Fallen Stars", 25, { log: false });
            Core.ensureComplete(8176);
            i++;

            if (i % 5 === 0) {
                Core.jumpWait();
                Core.toBank(...Rewards);
            }
        }
        Core.toBank(...Rewards);
    }
}

export default function main(): void {
    const script = new EnchantedMountaineerAndFlameHeartWarriorSets();
    Core.setOptions();

    script.questFarming();

    Core.setOptions(false);
}
