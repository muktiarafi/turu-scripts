/*
name: Grace Orb
description: Farms "Grace Orb"
tags: grace orb, hollowborn, vindicator, farm
*/
// Port of Scripts/Hollowborn/Materials/GraceOrb.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class GraceOrb {
    getMax(): number {
        const quest = bot.quests.ensureLoad(9291);
        if (quest == null) {
            return 1;
        }
        const req = quest.rewards.find((r) => r.name === "Grace Orb") ?? null;
        return req?.maxStack ?? 1;
    }

    getGraceOrb(quant: number | null = null): void {
        const orbQuant = quant ?? this.getMax();
        if (Core.checkInventory("Grace Orb", orbQuant)) {
            return;
        }

        Core.registerQuests(Core.isMember ? 10297 : 9291);
        Core.addDrop("Grace Orb", "Grace Extracted");
        Core.farmingLogger("Grace Orb", orbQuant);
        Core.equipClass(ClassType.Farm);

        while (!bot.shouldExit && !Core.checkInventory("Grace Orb", orbQuant)) {
            Core.huntMonster("neofortress", "Vindicator Recruit", "Grace Extracted", 20, { log: false });
            bot.wait.forPickup("Grace Orb");
        }

        Core.cancelRegisteredQuests();
        bot.wait.forPickup("Grace Orb");
    }
}

export default function main(): void {
    const script = new GraceOrb();
    Core.setOptions();
    script.getGraceOrb(script.getMax());
    Core.setOptions(false);
}
