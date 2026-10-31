/*
name: Twilly's Treasure Pile
description: This will do the Twilly's Treasure Pile quest and obtain all of the rewards.
tags: twillys-treasure-pile, seasonal, aqw-anniversary
*/
// Port of Scripts/Seasonal/AqwBirthday/TwillyTreasurePile.cs.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class TwillyTreasurePile {
    getAll(): void {
        const CheckHouseInventory = (itemNames: string[]): boolean => {
            for (const item of itemNames) {
                if (!bot.house.contains(item)) {
                    return false;
                } else {
                    continue;
                }
            }
            return true;
        };
        const HouseItems = ["Zard Rider Statue", "Twilly's Treasure Pile", "20th Anniversary Balloon"];
        const RewardsList = Core.ensureLoad(8925).rewards.map((x) => x.name);
        //house Items
        if (RewardsList.includes("Zard Rider Statue")) RewardsList.splice(RewardsList.indexOf("Zard Rider Statue"), 1);
        if (RewardsList.includes("Twilly's Treasure Pile"))
            RewardsList.splice(RewardsList.indexOf("Twilly's Treasure Pile"), 1);
        if (RewardsList.includes("20th Anniversary Balloon"))
            RewardsList.splice(RewardsList.indexOf("20th Anniversary Balloon"), 1);
        const Rewards = [...RewardsList];

        if (
            Core.checkInventory(Rewards, undefined, { toInv: false }) &&
            CheckHouseInventory(HouseItems) &&
            Core.isSeasonalMapActive("yulgarparty")
        ) {
            return;
        }

        bot.drops.add(...Rewards);
        bot.drops.add(...HouseItems);

        Core.equipClass(ClassType.Solo);
        //Twilly's Treasure Pile 8925
        Core.registerQuests(8925);
        // C# declares the counter inside the loop, so it is always 1 and the loop never banks.
        let i = 0;
        while (!bot.shouldExit && !Core.checkInventory(Rewards) && !CheckHouseInventory(HouseItems)) {
            Core.huntMonster("yulgarparty", "Treasure Pile", "Twilly's Treasure Defeated");
            i++;
            if (i % 5 === 0) {
                Core.jumpWait();
                Core.toBank(...Rewards);
            }
        }
        Core.cancelRegisteredQuests();
        Core.jumpWait();
        Core.toBank(...Rewards);
        Core.toBank(...HouseItems);
    }
}

export default function main(): void {
    const script = new TwillyTreasurePile();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
