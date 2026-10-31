/*
name: Vindicator Badge
description: Farms "Vindicator Badge"
tags: vindicator, badge, hollowborn, farm
*/
// Port of Scripts/Hollowborn/Materials/VindicatorBadge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class VindicatorBadge {
    getMax(): number {
        const quest = bot.quests.ensureLoad(10299);
        if (quest == null) {
            return 1;
            // Default max stack if quest is not found
        }
        const req = quest.requirements.find((r) => r.name === "Vindicator Badge") ?? null;
        return req?.maxStack ?? 1;
    }

    getVindicatorBadge(quant: number | null = null): void {
        const badgeQuant = quant ?? this.getMax();
        const item = "Vindicator Badge";
        if (Core.checkInventory(item, badgeQuant)) {
            return;
        }

        bot.quests.updateQuest(8297);
        Core.farmingLogger(item, badgeQuant);
        Core.addDrop(item, "Eagle Heart", "Boar Heart", "Vindicator Seal");
        Core.equipClass(ClassType.Farm);
        Core.registerQuests(Core.isMember ? 10296 : 8299);

        while (!bot.shouldExit && !Core.checkInventory(item, badgeQuant)) {
            Core.equipClass(ClassType.Farm);
            Core.killMonster("trygve", "r3", "Left", "Blood Eagle", "Eagle Heart", 8, { log: false });
            Core.killMonster("trygve", "r4", "Left", "Rune Boar", "Boar Heart", 8, { log: false });
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("trygve", "Gramiel", "Vindicator Seal", undefined, { log: false });
            bot.wait.forPickup(item);
        }

        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new VindicatorBadge();
    Core.setOptions();
    script.getVindicatorBadge(script.getMax());
    Core.setOptions(false);
}
