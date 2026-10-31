/*
name: Hollow Soul
description: Farms "Hollow Soul"
tags: hollow soul, shadowrealm, hollowborn
*/
// Port of Scripts/Hollowborn/Materials/HollowSoul.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class HollowSoul {
    private getMax(QuestID: number, item: string | null): number {
        const quest = bot.quests.ensureLoad(QuestID);
        if (quest == null) {
            return 1;
            // Default max stack if quest is not found
        }
        const req = quest.requirements.find((r) => r.name === item) ?? null;
        return req?.maxStack ?? 1;
    }

    getYaSoulsHeeeere(quant: number | null = 6000): void {
        const HSQuant = quant ?? this.getMax(10299, "Hollow Soul");
        if (Core.checkInventory("Hollow Soul", HSQuant)) {
            return;
        }

        Core.farmingLogger("Hollow Soul", HSQuant);
        Core.equipClass(ClassType.Solo);
        Core.killMonster("shadowrealm", "r9", "Left", "*", "Hollow Soul", HSQuant, { isTemp: false });
    }
}

export default function main(): void {
    const script = new HollowSoul();
    Core.bankingBlackList.push("Hollow Soul");
    Core.setOptions();
    script.getYaSoulsHeeeere();

    Core.setOptions(false);
}
