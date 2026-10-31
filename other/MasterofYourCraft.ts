/*
name: Master of Your Craft
description: Farms "All Drops" From Quest: "Master of Your Craft".
tags: master of your craft, drops
*/
// Port of Scripts/Other/MasterofYourCraft.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";

const Adv = new CoreAdvanced();

export class MasterofYourCraft {
    readonly rewards: string[] = [
        "Master Trainer",
        "GrandMaster Trainer",
        "Master Trainer's Helm + Locks",
        "Master Trainer's Helm",
        "Master Trainer's Minion",
        "Master Trainer's Sword",
    ];

    moyc(): void {
        const quest = Core.initializeWithRetries(() => bot.quests.ensureLoad(3051));
        if (quest == null) {
            Core.logger('Quest "Master of Your Craft" not found', undefined, { stopBot: true });
            return;
        }
        const rewards = [...quest.rewards];

        if (!Core.checkInventory("Dragon of Time")) {
            Core.logger('Missing "Dragon of Time", to continue', undefined, { stopBot: true });
        }

        Core.unbank("Dragon of Time");
        Core.equip("Dragon of Time");
        Adv.smartEnhance("Dragon of Time");

        for (const reward of rewards) {
            if (Core.checkInventory(reward.id, undefined, { toInv: false })) {
                continue;
            }
            Core.addDrop(reward.id);
        }

        Core.registerQuests(quest.id);
        while (!bot.shouldExit && rewards.some((reward) => !Core.checkInventory(reward.id))) {
            Core.huntMonster("chchallenge", "Training Golem", "Rounds Won");
            for (const reward of rewards) {
                if (bot.inventory.contains(reward.id)) {
                    Core.toBank(reward.id);
                }
            }
        }
    }
}

export default function main(): void {
    const script = new MasterofYourCraft();
    Core.bankingBlackList.push(...script.rewards);
    Core.setOptions();

    script.moyc();

    Core.setOptions(false);
}
