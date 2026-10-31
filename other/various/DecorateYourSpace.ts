/*
name: DecorateYourSpace
description: null
tags: null
*/
// Port of Scripts/Other/Various/DecorateYourSpace.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class DecorateYourSpace {
    getthestuff(): void {
        const RewardOptions = Core.ensureLoad(7782).rewards;
        const RewardsList: string[] = [];
        for (const Item of RewardOptions) {
            RewardsList.push(Item.name);
        }

        const Rewards = [...RewardsList];

        Core.addDrop(...Rewards);

        Core.equipClass(ClassType.Farm);

        Core.registerQuests(7782);
        while (!bot.shouldExit && !Core.checkInventory(Rewards)) {
            Core.killMonster("yokaigrave", "r2", "Left", "*", "Graves Cleared", 10, { log: false });
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new DecorateYourSpace();
    Core.setOptions();

    script.getthestuff();

    Core.setOptions(false);
}
