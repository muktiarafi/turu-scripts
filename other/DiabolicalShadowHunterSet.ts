/*
name: Hikaru Quest Rewards
description: farms quest rewards from `Hit List` in /lostvilla
tags: lostvilla, Hikaru, quest rewards, diabolical shadowhunter, diabolical,shadow hunter, hit list, hitlist
*/
// Port of Scripts/Other/DiabolicalShadowHunterSet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { LostVilla } from "../story/LostVilla";

const LV = new LostVilla();

export class DiabolicalShadowHunterSet {
    questID = 10053;

    getRewards(): void {
        const RewardOptions = Core.ensureLoad(this.questID).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.id);
        }

        Core.equipClass(ClassType.Farm);

        for (const Reward of RewardOptions) {
            Core.logger(
                Core.checkInventory(Reward.id, undefined, { toInv: false })
                    ? `${Reward.name}: ✅`
                    : `${Reward.name} ❌`,
            );

            if (Core.checkInventory(Reward.id, undefined, { toInv: false })) {
                continue;
            }

            Core.farmingLogger(Reward.name, 1);
            while (!bot.shouldExit && !Core.checkInventory(Reward.id)) {
                Core.ensureAccept(10053);
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("brokenwoods", "Eldritch Amalgamation", "Eldritch Amalgamation's Strained Eye");
                Core.huntMonster("backroom", "Book Wyrm", "Book Wyrm's Wretched Vein", 2);
                Core.huntMonster("lostvilla", "Eldritch Parasite", "Eldritch Parasite's Infested Arteries", 12);
                Core.huntMonster("lostvilla", "Covetous Disgrace", "Covetous Disgrace's Mangled Rib", 3);
                Core.equipClass(ClassType.Farm);
                Core.huntMonster("lostvilla", "Mutilated Atrocity", "Mutilated Atrocity's Dismembered Winglet", 5);
                Core.ensureComplete(10053);
            }

            Core.jumpWait();
            Core.toBank(Reward.id);
        }
    }
}

export default function main(): void {
    const script = new DiabolicalShadowHunterSet();
    Core.setOptions();

    LV.storyline();
    script.getRewards();

    Core.setOptions(false);
}
