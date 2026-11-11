/*
name: Memory of my Father
description: Farms quest 10835 until all four random rewards are owned.
tags: memory of my father, drakath, crownsreach, slugwrath, quest rewards
*/
// Port of Scripts/Chaos/MemoryOfMyFather.cs.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";

export class MemoryOfMyFather {
    readonly rewards: string[] = [
        "Royal Dictator's Formal Wear",
        "King Drakath Slugwrath Morph",
        "Royal Dictator's Ceremonial Cape",
        "Commemorative Statue of Slugwrath",
    ];

    getRewards(): void {
        Core.equipClass(ClassType.Solo);
        bot.drops.add(...this.rewards);

        while (!bot.shouldExit && !Core.checkInventory(this.rewards, undefined, { toInv: false })) {
            Core.ensureAccept(10835);
            Core.huntMonster("hiddenduat", "Pharaoh Neith", "Pharaoh Neith Defeated");
            Core.huntMonster("deepforest", "Aberrant Horror", "Aberrant Horror Defeated");
            Core.huntMonster("wardwarf", "Ultra D'wain Jonsen", "Ultra D'wain Jonsen Defeated");
            Core.huntMonster("queenbattle", "Proto Chaos Champion", "Proto Chaos Champion Defeated");
            Core.ensureComplete(10835);

            for (const reward of this.rewards) {
                bot.wait.forPickup(reward);
            }
        }
    }
}

export default function main(): void {
    const script = new MemoryOfMyFather();
    Core.bankingBlackList.push(...script.rewards);
    Core.setOptions();
    try {
        script.getRewards();
    } finally {
        Core.setOptions(false);
    }
}
