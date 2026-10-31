/*
name: Shadowed War Mage Set
description: Farms "All Drops" From Mob: "ShadowKnight Gar".
tags: shadowknight gar, set
*/
// Port of Scripts/Other/ShadowedWarMageSet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, type EventMap } from "turu";
import { ClassType, Core } from "../core/CoreBots";

export class ShadowedWarMageSet {
    getAll(): void {
        const ItemDropped = (item: EventMap["itemDropped"]): void => {
            if (rewards.includes(item.name)) {
                count++;
                Core.logger(`Got ${item.name}, ${rewards.length - count} items to go`);
            }
        };
        const rewards = [
            "Dual Shadow War-Mage Blades",
            "Shadowed War-Mage",
            "Shadowed War-Mage Back-blade",
            "Shadowed War-Mage Blade",
            "Shadowed War-Mage Hat",
            "Shadowed War-Mage Scarf",
            "Shadowed War-Mage Scarf + Hat",
            "Shadowed War-Mage Staff",
            "Shadowed War-Mage Staff Cape",
        ];
        if (Core.checkInventory(rewards)) {
            return;
        }

        let count = 0;

        count = Core.checkSpaces(count, ...rewards);
        Core.addDrop(...rewards);

        Core.equipClass(ClassType.Solo);

        bot.events.on("itemDropped", ItemDropped);
        Core.logger(
            `Farm for the Shadowed War-Mage set started. Farming to get ${rewards.length - count} more item` +
                (rewards.length - count > 1 ? "s" : ""),
        );
        while (!bot.shouldExit && !Core.checkInventory(rewards)) {
            for (const item of rewards) {
                Core.huntMonster("timestream", "ShadowKnight Gar", item, undefined, { isTemp: false });
                bot.wait.forPickup(item);
            }
        }

        bot.events.off("itemDropped", ItemDropped);
    }
}

export default function main(): void {
    const script = new ShadowedWarMageSet();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
