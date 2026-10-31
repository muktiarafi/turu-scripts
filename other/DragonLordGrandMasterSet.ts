/*
name: DragonLord Grand Master
description: farms the "DragonLord Grand Master" set from Quest: "The Flame Dragon".
tags: dragonlord grand master, set
*/
// Port of Scripts/Other/DragonLordGrandMasterSet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, type EventMap } from "turu";
import { Core } from "../core/CoreBots";
import { LairWar } from "../story/VasalkarLairWar";

const War = new LairWar();

export class DragonLordGrandMasterSet {
    getSet(): void {
        const ItemDropped = (item: EventMap["itemDropped"]): void => {
            if (rewards.includes(item.name)) {
                count++;
                Core.logger(`Got ${item.name}, ${rewards.length - count} items to go`);
            }
        };
        const rewards = Core.ensureLoad(6689).rewards.map((i) => i.name);
        if (Core.checkInventory(rewards)) {
            return;
        }

        let count = 0;
        count = Core.checkSpaces(count, ...rewards);
        Core.addDrop(...rewards);
        War.defend();

        Core.registerQuests(6689);
        bot.events.on("itemDropped", ItemDropped);
        Core.logger(
            `Farm for the DragonLord GrandMaster set started. Farming to get ${rewards.length - count} more item` +
                (rewards.length - count > 1 ? "s" : ""),
        );

        while (!Core.checkInventory(rewards)) {
            Core.killMonster("lairdefend", "Eggs", "Left", "Flame Dragon General", undefined, undefined, {
                log: false,
            });
            bot.wait.forPickup("*");
        }

        bot.events.off("itemDropped", ItemDropped);
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new DragonLordGrandMasterSet();
    Core.setOptions();

    script.getSet();

    Core.setOptions(false);
}
