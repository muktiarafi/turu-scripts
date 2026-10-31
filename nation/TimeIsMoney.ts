/*
name: TimeIsMoney
description: null
tags: null
*/
// Port of Scripts/Nation/TimeIsMoney.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";

export class TimeIsMoney {
    farmingQuest(): void {
        const Rewards = Core.ensureLoad(6185).rewards.map((i) => i.name);
        Core.addDrop(...Rewards);

        if (!Core.checkInventory(42581)) {
            Core.logger('You Don\'t Have "Bounty Hunter Blade Pet". Pet is required for doing the quests.');
            return;
        }
        for (let i = 0; i < Rewards.length; i++) {
            if (bot.inventory.isMaxStack(Rewards[i])) {
                Core.logger(`${Rewards[i]} is max stack Checking next item in the "Time is Money" Quest's Rewards`);
            } else {
                while (!bot.inventory.isMaxStack(Rewards[i])) {
                    //Time is Money 6185
                    Core.ensureAccept(6185);

                    Core.joinSWF("mobius", "ChiralValley/town-Mobius-21Feb14.swf", "Slugfit", "Bottom");
                    Core.huntMonster("Mobius", "Slugfit", "Slugfit Horn", 5);
                    Core.huntMonster("Mobius", "Fire Imp", "Imp Flame", 3);
                    Core.huntMonster("bamboo", "Tanuki", "Tanuki Ears", 3);
                    Core.killMonster("greenguardwest", "West12", "Up", "Big Bad Boar", "Wereboar Tusk", 2);
                    Core.huntMonster("junkyard", "Onibaba", "Onibaba Nails", 5);

                    Core.ensureComplete(6185);
                }
            }
        }
    }
}

export default function main(): void {
    const script = new TimeIsMoney();
    Core.setOptions();

    script.farmingQuest();

    Core.setOptions(false);
}
