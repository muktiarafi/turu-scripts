/*
name: Gramiel's Emblem
description: Farms "Gramiel's Emblem"
tags: gramiel, emblem, hollowborn, vindicator, farm
*/
// Port of Scripts/Hollowborn/Materials/GramielsEmblem.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class GramielsEmblem {
    getMax(): number {
        const quest = bot.quests.ensureLoad(10299);
        if (quest == null) {
            return 1;
            // Default max stack if quest is not found
        }
        const req = quest.requirements.find((r) => r.name === "Gramiel's Emblem") ?? null;
        return req?.maxStack ?? 1;
    }

    getGramielsEmblem(quant: number | null = null): void {
        const emblemQuant = quant ?? this.getMax();
        const item = "Gramiel's Emblem";
        if (Core.checkInventory(item, emblemQuant)) {
            return;
        }

        Core.farmingLogger(item, emblemQuant);
        Core.addDrop(item);
        Core.equipClass(ClassType.Solo);

        Core.huntMonster("dawnsanctum", "Celestial Gramiel", item, emblemQuant, { isTemp: false });
        bot.wait.forPickup(item);
    }
}

export default function main(): void {
    const script = new GramielsEmblem();
    Core.setOptions();
    script.getGramielsEmblem(script.getMax());
    Core.setOptions(false);
}
