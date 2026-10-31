/*
name: VoidDestroyer
description: null
tags: null
*/
// Port of Scripts/Nation/Various/VoidDestroyer.cs.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export class VoidDestroyer {
    readonly rewards: string[] = [
        "Void Destroyer",
        "Void Destruction Blade",
        "Void Spear of War",
        "Horned Void War Helm",
        "Crested Void War Helm",
        "Wrap of the Void",
        "Tainted Destruction Blade",
        "Toxic Void Katana",
        "Dual Toxic Void Katanas",
    ];

    getDestroyer(): void {
        if (Core.checkInventory(this.rewards)) {
            Core.logger(`All rewards already owned`);
            return;
        }

        // Track only relevant rewards from quest 5661
        bot.drops.add(
            ...Core.ensureLoad(5661)
                .rewards.filter((x) => x != null && this.rewards.includes(x.name))
                .map((x) => x.name),
        );

        // Loop until all desired rewards are in inventory
        while (!bot.shouldExit && !Core.checkInventory(this.rewards, undefined, { toInv: false })) {
            Core.ensureAccept(5661);
            Nation.supplies("Unidentified 4");
            Nation.farmTaintedGem(1);
            Nation.farmDarkCrystalShard(1);
            Nation.essenceofNulgath(1);
            Nation.farmGemofNulgath(1);

            Core.ensureComplete(5661);

            // Wait for any desired drops that appeared
            for (const reward of this.rewards) {
                if (bot.drops.current.some((d) => d.name === reward)) {
                    bot.wait.forPickup(reward);
                }
            }
        }
        Core.logger(`All rewards collected, banking them;\n` + ` ${bot.drops.current.map((d) => d.name).join(", ")}`);
        Core.toBank(...this.rewards);
    }
}

export default function main(): void {
    const script = new VoidDestroyer();
    Core.setOptions();

    script.getDestroyer();

    Core.setOptions(false);
}
