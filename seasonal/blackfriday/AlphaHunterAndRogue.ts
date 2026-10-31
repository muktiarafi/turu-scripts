/*
name: Alpha Hunter And Rogue Set
description: This will do the quest to obtain the Alpha Hunter and Rogue set.
tags: alpha-hunter, alpha-rogue, black-friday, seasonal
*/
// Port of Scripts/Seasonal/BlackFriday/AlphaHunterAndRogue.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class BlackFridayAlphaHunterRogue {
    getSets(toBank = true): void {
        if (!Core.isSeasonalMapActive("blackfridaywar")) {
            Core.logger("This bot is seasonal only.");
            return;
        }

        const AllRewards1 = Core.ensureLoad(6104).rewards;
        const AllRewards2 = Core.ensureLoad(6105).rewards;
        const AllRewards3 = Core.ensureLoad(6106).rewards;
        const AllRewards4 = Core.ensureLoad(6107).rewards;
        const AllRewardsArray = AllRewards1.concat(...AllRewards2)
            .concat(...AllRewards3)
            .concat(...AllRewards4)
            .map((x) => x.id);
        if (Core.checkInventory(AllRewardsArray, undefined, { toInv: false })) {
            return;
        }

        Core.equipClass(ClassType.Solo);
        Core.addDrop(...AllRewardsArray);
        Core.registerQuests(...Core.fromTo(6104, 6107));
        while (!bot.shouldExit && !Core.checkInventory(AllRewardsArray, undefined, { toInv: false })) {
            Core.killMonster("blackfridaywar", "r4", "Left", "*", undefined, undefined, { log: false });
            // TEMPORARY Game4000 inventory change. Remove after the client inventory fix.
            if (toBank && Core.inventoryBagFreeSlots === 0) {
                Core.toBank(...AllRewardsArray);
            }
        }
        Core.toBank(...AllRewardsArray);
    }
}

export const scriptOptions = defineScriptOptions("BlackFridayAlphaHunterRogue", [
    option.bool("toBank", "Bank Items", "Bank Items after you're done?", true),
]);

export default function main(): void {
    const script = new BlackFridayAlphaHunterRogue();
    Core.setOptions();

    script.getSets(bot.config!.get<boolean>("toBank"));

    Core.setOptions(false);
}
