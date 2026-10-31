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
                Core.huntMonsterQuest(
                    10053,
                    ["brokenwoods", "Eldritch Amalgamation", ClassType.Solo],
                    ["backroom", "Book Wyrm", ClassType.Solo],
                    ["lostvilla", "Eldritch Parasite", ClassType.Solo],
                    ["lostvilla", "Covetous Disgrace", ClassType.Solo],
                    ["lostvilla", "Mutilated Atrocity", ClassType.Farm],
                );
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
