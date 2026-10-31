/*
name: He Limed Me
description: Farms The Random Rewards from `He Limed Me`
tags: HeLimedMe, He Limed Me, He, Limed, Me
*/
// Port of Scripts/Other/Various/HeLimedMe.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { Extinction } from "../../story/Extinction";

export class HeLimedMe {
    private get extinction(): Extinction {
        return new Extinction();
    }

    getItems(): void {
        this.extinction.storyLine();
        const QuestID = 10585;

        const RewardOptions = Core.initializeWithRetries(() => Core.ensureLoad(QuestID).rewards);

        if (RewardOptions == null) {
            Core.logger("Failed to load quest rewards.");
            return;
        }

        Core.addDrop(...Core.questRewards(QuestID));

        Core.equipClass(ClassType.Solo);

        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                Core.logger(`${Reward.name} Owned!`);
                continue;
            }

            Core.farmingLogger(Reward.name);
            while (!bot.shouldExit && !Core.checkInventory(Reward.id)) {
                Core.ensureAccept(QuestID);
                Core.huntMonster("Ectocave", "Ektorax", "Regurgitated Key");
                Core.killMonster("ectocave", "r1", "Left", "*", "Ecto Slime", 50);
                Core.ensureComplete(QuestID);
            }

            Core.jumpWait();
            Core.toBank(Reward.id);
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new HeLimedMe();
    Core.setOptions();

    script.getItems();

    Core.setOptions(false);
}
