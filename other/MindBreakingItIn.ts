/*
name: Mind Breaking It In
description: Farms "All Drops" From Quest: "Mind Breaking It In".
tags: mind breaking it in, mindbreaker, drops
*/
// Port of Scripts/Other/MindBreakingItIn.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../core/CoreAdvanced";
import { ClassType, Core } from "../core/CoreBots";

const Adv = new CoreAdvanced();

export class MindBreakingItIn {
    getRewards(): void {
        const RewardOptions = Core.ensureLoad(7672).rewards;
        const RewardList = RewardOptions.map((x) => x.name);
        const Rewards = [...RewardList];

        if (Core.checkInventory(Rewards)) {
            return;
        }

        if (!Core.checkInventory("MindBreaker")) {
            //Member Bonus 12k AC Shop will check if the player have the achievment
            Adv.buyItem("Battleon", 373, "MindBreaker");
            Adv.rankUpClass("MindBreaker");
        }

        for (let i = 0; i < Rewards.length; i++) {
            if (!Core.checkInventory(Rewards[i])) {
                Core.logger(`Getting ${Rewards[i]}`);
                //Mind-Breaking It In 7672
                Core.ensureAccept(7672);
                Core.equipClass(ClassType.Farm);
                Core.huntMonster("Somnia", "Deorysa", "Dream Devourers Vanquished", 50, { isTemp: false });
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("Somnia", "NightWyrm", "Nightwyrm Vanquished");
                Core.ensureCompleteChoose(7672, [Rewards[i]]);
            }
        }
        Core.toBank(...Rewards);
    }
}

export default function main(): void {
    const script = new MindBreakingItIn();
    Core.setOptions();

    script.getRewards();

    Core.setOptions(false);
}
