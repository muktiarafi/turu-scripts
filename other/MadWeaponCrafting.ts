/*
name: Mad Weapon Crafting
description: Farms "All Drops" From Quest: "Mad Weapon Crafting".
tags: mad weapon crafting, drops
*/
// Port of Scripts/Other/MadWeaponCrafting.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";
import { CoreToD } from "../story/throneofdarkness/CoreToD";

const ToD = new CoreToD();

export class MadWeaponCrafting {
    getAll(): void {
        const RewardOptions = Core.ensureLoad(7070).rewards;
        const RewardList = RewardOptions.map((x) => x.name);
        const Rewards = [...RewardList];

        if (Core.checkInventory(Rewards, undefined, { toInv: false })) {
            return;
        }

        bot.drops.add(...Rewards);

        ToD.shiftingPyramid();
        Core.registerQuests(7070);
        while (!bot.shouldExit && !Core.checkInventory(Rewards, undefined, { toInv: false })) {
            //Mad Weapon Crafting 7070
            while (!bot.shouldExit && !Core.checkInventory("Anti-Matter Gem", 15)) {
                //Reflections of Victory 5188
                Core.addDrop("Anti-Matter Gem");
                Core.ensureAccept(5188);
                Core.huntMonster("Whitehole", "Dimensional Crystal", "Crystal Shards", 5);
                Core.ensureComplete(5188);
            }
            Core.huntMonster("Artixpointe", "Enchanted Sushi", "Sushi!!!");
            Core.huntMonster("Citadel", "Grizzly Bear", "Bear Feet", 2);
            Core.jump("Enter", "Spawn");
            Core.toBank(...Rewards);
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new MadWeaponCrafting();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
