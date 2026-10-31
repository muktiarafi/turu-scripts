/*
name: Lycan Shaman Set
description: farms the "Lycan Shaman" set from Quest: "Blood Rage".
tags: blood rage, lycan shaman, set
*/
// Port of Scripts/Other/LycanShamanSet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, type EventMap } from "turu";
import { Core } from "../core/CoreBots";
import { BloodMoon } from "../story/BloodMoon";

const bloodMoon = new BloodMoon();

export class LycanShamanSet {
    getAll(): void {
        const ItemDropped = (item: EventMap["itemDropped"]): void => {
            if (rewards.includes(item.name)) {
                count++;
                Core.logger(`Got ${item.name}, ${rewards.length - count} items to go`);
            }
        };
        const rewards = ["Lycan Shaman", "Lycan Shaman Helm", "Lycan Shaman's Familiar", "Lycan Shaman Staff"];
        if (Core.checkInventory(rewards)) {
            return;
        }

        let count = 0;

        count = Core.checkSpaces(count, ...rewards);
        Core.addDrop(...rewards);

        bloodMoon.bloodMoonSaga();

        Core.registerQuests(6073);
        bot.events.on("itemDropped", ItemDropped);
        Core.logger(
            `Farm for the Lycan Shaman set started. Farming to get ${rewards.length - count} more item` +
                (rewards.length - count > 1 ? "s" : ""),
        );

        while (!bot.shouldExit && !Core.checkInventory(rewards)) {
            Core.huntMonster("bloodwarlycan", "Blood Guardian", "Ruby Crest", 5);
            bot.wait.forPickup("*");
        }

        bot.events.off("itemDropped", ItemDropped);
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new LycanShamanSet();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
