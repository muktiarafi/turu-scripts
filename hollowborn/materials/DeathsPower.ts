/*
name: Death's Power
description: Farms "Death's Power"
tags: death's power,deaths power, death,power, shadowattack,death, hollowborn
*/
// Port of Scripts/Hollowborn/Materials/DeathsPower.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class DeathsPower {
    getMax(): number {
        const quest = bot.quests.ensureLoad(10299);
        if (quest == null) {
            return 1;
            // Default max stack if quest is not found
        }
        const req = quest.requirements.find((r) => r.name === "Death's Power") ?? null;
        return req?.maxStack ?? 1;
    }

    getDP(quant: number | null = null): void {
        const DPQuant = quant ?? this.getMax();
        if (Core.checkInventory("Death's Power", DPQuant)) {
            return;
        }

        Core.ensureAccept(10299);
        // Quest needs to be accepted for Death's Power to drop
        Core.addDrop("Death's Power");
        Core.farmingLogger("Death's Power", DPQuant);
        Core.equipClass(ClassType.Solo);
        Core.killMonster("shadowattack", "Boss", "Left", "Death", "Death's Power", DPQuant, { isTemp: false });
    }
}

export default function main(): void {
    const script = new DeathsPower();
    Core.setOptions();

    script.getDP(script.getMax());

    Core.setOptions(false);
}
