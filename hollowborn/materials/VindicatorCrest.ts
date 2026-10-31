/*
name: Vindicator Crest
description: Farms "Vindicator Crest"
tags: vindicator crest, hollowborn, vindicator, farm
*/
// Port of Scripts/Hollowborn/Materials/VindicatorCrest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class VindicatorCrest {
    getMax(): number {
        const quest = bot.quests.ensureLoad(9865);
        if (quest == null) {
            return 1;
        }
        const req = quest.rewards.find((r) => r.name === "Vindicator Crest") ?? null;
        return req?.maxStack ?? 1;
    }

    getVindicatorCrest(quant: number | null = null): void {
        const crestQuant = quant ?? this.getMax();
        const item = "Vindicator Crest";
        if (Core.checkInventory(item, crestQuant)) {
            return;
        }

        Core.farmingLogger(item, crestQuant);
        Core.addDrop(item, "Vindicated Blades", "Vindicated Chain", "Vindicated Scripture");
        Core.equipClass(ClassType.Farm);
        Core.registerQuests(Core.isMember ? 10298 : 9865);

        while (!bot.shouldExit && !Core.checkInventory(item, crestQuant)) {
            Core.huntMonsterMapID("neotower", 12, "Vindicated Blades", undefined, { log: false });
            Core.huntMonsterMapID("neotower", 17, "Vindicated Chain", undefined, { log: false });
            Core.huntMonsterMapID("neotower", 28, "Vindicated Scripture", undefined, { log: false });
            bot.wait.forPickup(item);
        }

        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new VindicatorCrest();
    Core.setOptions();
    script.getVindicatorCrest(script.getMax());
    Core.setOptions(false);
}
