/*
name: Trobbolier Pet (Member Only)
description: This will finish the required quest to obtain all of the Trobbolier Pets.
tags: trobbolier-pet, member, friday-the-13th, seasonal
*/
// Port of Scripts/Seasonal/Friday13th/TrobbolierPet[mem].cs.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFriday13th } from "./story/CoreFriday13th";

const F13 = new CoreFriday13th();

export class TrobbolierPet {
    getAll(): void {
        if (!Core.isMember) {
            return;
        }

        F13.wormhole();

        const rewardOptions = Core.ensureLoad(5067).rewards;

        const logMessage = ["Inventory Check for Reward Options:"];

        for (const item of rewardOptions) {
            const status = Core.checkInventory(item.name, undefined, { toInv: false }) ? "✔️" : "❌";
            logMessage.push(`- ${item.name}: ${status}`);
        }

        bot.log(logMessage.join("\n") + "\n");

        bot.drops.add(...rewardOptions.map((item) => item.name));
        Core.equipClass(ClassType.Farm);

        for (const item of rewardOptions) {
            while (!bot.shouldExit && !Core.checkInventory(item.id, undefined, { toInv: false })) {
                Core.ensureAccept(5067);
                Core.huntMonsterMapID("wormhole", 13, "Blue Trobbolier Fluff", 4, { log: false });
                Core.huntMonsterMapID("wormhole", 27, "Purple Trobbolier Fluff", 4, { log: false });
                Core.huntMonsterMapID("wormhole", 24, "Green Trobbolier Fluff", 4, { log: false });
                Core.huntMonsterMapID("wormhole", 11, "Red Trobbolier Fluff", 4, { log: false });
                Core.ensureCompleteChoose(5067, Core.questRewards(5067));
                bot.wait.forPickup("*");
                Core.toBank(
                    ...rewardOptions.filter((item) => bot.inventory.contains(item.name)).map((item) => item.name),
                );
                bot.drops.remove(item.id);
            }
        }
    }
}

export default function main(): void {
    const script = new TrobbolierPet();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
