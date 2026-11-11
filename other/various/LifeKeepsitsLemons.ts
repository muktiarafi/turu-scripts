/*
name: Life Keeps Its Lemons
description: Life Keeps Its Lemons
tags: LifeKeepsItsLemons, Life Keeps Its Lemons, Lemons
*/
// Port of Scripts/Other/Various/LifeKeepsitsLemons.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { Extinction } from "../../story/Extinction";

export class LifeKeepsitsLemons {
    private get extinction(): Extinction {
        return new Extinction();
    }

    getItems(): void {
        this.extinction.storyLine();
        const QuestID = 10054;

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
                Core.ensureAccept(10054);
                Core.equipClass(ClassType.Farm);
                Core.huntMonster("extinction", "Lard", "Lemon Lard", 10);
                Core.huntMonster("extinction", "Gelatinous Slime", "Slime Gelatin", 10);
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("extinction", "SN.O.W. Challenge", "SN.O.W. Ice", 1, { isTemp: false });
                Core.ensureComplete(10054);
            }

            Core.jumpWait();
            Core.toBank(Reward.id);
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new LifeKeepsitsLemons();
    Core.setOptions();

    script.getItems();

    Core.setOptions(false);
}
