/*
name: Vanquish The Betrayers Quest Rewards
description: Farms quest rewards from `Vanquish The Betrayers` [9932] in /voidrefuge, /fiendpast and /darkalliance.
tags: voidrefuge,seasonal,nulgath,birthday, quest rewards,vanquish the betrayers,fiend's trophy,fiends trophy,fiend trophy,fiend's draconic,fiends draconic,fiend draconic
*/
// Port of Scripts/Seasonal/StaffBirthdays/Nulgath/VanquishTheBetrayers.cs.

import { bot } from "turu";
import { ClassType, Core } from "../../../core/CoreBots";

export class VanquishTheBetrayers {
    questID = 9932;

    getRewards(): void {
        const RewardOptions = Core.ensureLoad(this.questID).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.name);
        }

        Core.equipClass(ClassType.Farm);

        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                // C# returns here, so the rewards after the first one you own were never farmed.
                continue;
            }

            Core.farmingLogger(Reward.name, 1);

            Core.huntMonsterQuestChoose(
                this.questID,
                Reward.name,
                ["voidrefuge", "Nation Outrider", ClassType.Farm],
                ["fiendpast", "Scarvitas", ClassType.Farm],
                ["darkalliance", "Shadowblade", ClassType.Farm],
            );
            Core.jumpWait();
            bot.wait.forPickup(Reward.name);
            Core.toBank(Reward.name);
        }
    }
}

export default function main(): void {
    const script = new VanquishTheBetrayers();
    Core.setOptions();

    script.getRewards();

    Core.setOptions(false);
}
