/*
name: VoidBattleMageSet
description: null
tags: null
*/
// Port of Scripts/Nation/Various/VoidBattleMageSet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { LairWar } from "../../story/VasalkarLairWar";

const War = new LairWar();

export class VoidBattleMageSet {
    getSet(): void {
        War.attack();

        const RewardOptions = Core.ensureLoad(6694).rewards;

        for (const item of RewardOptions) {
            bot.drops.add(item.name);
        }

        Core.registerQuests(6694);
        Core.equipClass(ClassType.Solo);

        //the foreach can be simplified as such:
        for (const Reward of RewardOptions.filter((item) => item.name != null)) {
            Core.killMonster("lairattack", "Eggs", "Left", "Flame Dragon General", Reward.name);
        }

        for (const item of RewardOptions) {
            Core.toBank(item.id);
        }

        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new VoidBattleMageSet();
    Core.setOptions();

    script.getSet();

    Core.setOptions(false);
}
