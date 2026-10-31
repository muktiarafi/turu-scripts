/*
name: Flames of Love
description: Farms the 2 drops from `Flames of Love` 
tags: FlamesofLove, flames of love, 5 percent
*/
// Port of Scripts/Other/FivePercentDrops.cs/FlamesofLove.cs.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class FlamesofLove {
    foL(): void {
        // C# assigns the reward items to a string[] (it doesn't compile); their names are meant.
        const rewards = (Core.initializeWithRetries(() => bot.quests.ensureLoad(10787))?.rewards ?? []).map(
            (x) => x.name,
        );

        if (Core.checkInventory(rewards)) {
            return;
        }

        Core.addDrop(...rewards);
        Core.registerQuests(10787);

        while (!bot.shouldExit && !Core.checkInventory(rewards)) {
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("fireplanewar", "Shadefire Onslaught", "Flame of Passion", 8);

            Core.equipClass(ClassType.Solo);
            Core.huntMonster("skytower", "Sunstone", "Sunlit Warmth", 8);
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new FlamesofLove();
    Core.setOptions();

    script.foL();

    Core.setOptions(false);
}
