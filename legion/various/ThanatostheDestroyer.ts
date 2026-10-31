/*
name: ThanatostheDestroyer
description: null
tags: null
*/
// Port of Scripts/Legion/Various/ThanatostheDestroyer.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreIsleOfFotia } from "../../story/isleoffotia/CoreIsleOfFotia";

const coreIsleOfFotia = new CoreIsleOfFotia();

export class ThanatostheDestroyer {
    getRewards(): void {
        if (
            !Core.checkInventory("Thanatos Paragon Pet") ||
            Core.checkInventory(Core.ensureLoad(4101).rewards.map((i) => i.name))
        ) {
            Core.logger("Pet not owned, or All Items already owned.", undefined, { stopBot: true });
        } else {
            Core.logger("Thanatos Paragon Pet owned, continuing.");
        }

        const RewardOptions = Core.ensureLoad(4101).rewards;
        const QuestRewards = RewardOptions.map((x) => x.name);

        coreIsleOfFotia.underRealm();

        bot.drops.add(...QuestRewards);

        Core.equipClass(ClassType.Solo);
        Core.registerQuests(4101);
        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.id, undefined, { toInv: false })) {
                Core.logger(`${Reward.name} Found.`);
            } else {
                Core.farmingLogger(Reward.name, 1);
                while (!bot.shouldExit && !Core.checkInventory(Reward.id)) {
                    Core.huntMonster("underrealm", "Death", "Become Death", undefined, { log: false });
                }
                bot.wait.forPickup(Reward.id);
                Core.toBank(Reward.id);
            }
        }
        Core.cancelRegisteredQuests();
        Core.logger(`Jobs Done 👍`);
    }
}

export default function main(): void {
    const script = new ThanatostheDestroyer();
    Core.setOptions();

    script.getRewards();

    Core.setOptions(false);
}
