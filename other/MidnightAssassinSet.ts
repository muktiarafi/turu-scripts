/*
name: Midnight Assassin Set
description: farms the "Midnight Assassin" set from Quest: "Vampire Medals, Mega Vampire Medals".
tags: vampire medals, mega vampire medals, set
*/
// Port of Scripts/Other/MidnightAssassinSet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, type EventMap } from "turu";
import { Core } from "../core/CoreBots";
import { BloodMoon } from "../story/BloodMoon";

const bloodMoon = new BloodMoon();

export class MidnightAssassinSet {
    getAll(): void {
        const ItemDropped = (item: EventMap["itemDropped"]): void => {
            if (rewards.includes(item.name)) {
                count++;
                Core.logger(`Got ${item.name}, ${rewards.length - count} items to go`);
            }
        };
        const rewards = [
            "Midnight Assassin Daggers",
            "Midnight Assassin Dirk",
            "Midnight Assassin",
            "Midnight Assassin Helm",
        ];
        if (Core.checkInventory(rewards)) {
            return;
        }

        let count = 0;

        count = Core.checkSpaces(count, ...rewards);
        Core.addDrop(...rewards);

        bloodMoon.bloodMoonSaga();

        Core.registerQuests(6070, 6071);
        bot.events.on("itemDropped", ItemDropped);
        Core.logger(
            `Farm for the Midnight Assassin set started. Farming to get ${rewards.length - count} more item` +
                (rewards.length - count > 1 ? "s" : ""),
        );

        while (!bot.shouldExit && !Core.checkInventory(rewards)) {
            Core.huntMonster("bloodwarlycan", "Vampiric Knight", "Vampire Medal", 5);
            Core.huntMonster("bloodwarlycan", "Vampiric Knight", "Mega Vampire Medal", 3);
            bot.wait.forPickup("*");
        }

        bot.events.off("itemDropped", ItemDropped);
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new MidnightAssassinSet();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
