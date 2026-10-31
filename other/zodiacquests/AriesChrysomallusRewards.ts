/*
name: Aries Chrysomallus Rewards
description: does the "aries chrysomallus" quest for the rewards.
tags: aries chrysomallus, quest rewards, darkblood starshard, kolyaban, arcangrove, kylokos, zodiac
*/
// Port of Scripts/Other/ZodiacQuests/AriesChrysomallusRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class AriesChrysomallusRewards {
    example(): void {
        if (Core.checkInventory(Core.questRewards(9192))) {
            return;
        }

        const RewardOptions = Core.ensureLoad(9192).rewards;
        for (const item of RewardOptions) {
            bot.drops.add(item.name);
        }

        Core.equipClass(ClassType.Farm);
        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                Core.logger(`${Reward.name} Found.`);
            } else {
                while (!bot.shouldExit && !Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                    //Aries Chrysomallus
                    Core.ensureAccept(9192);
                    Core.killMonster("Kolyaban", "r2", "Left", "*", "Darkblood Starshard", 20, {
                        isTemp: false,
                        log: false,
                    });
                    Core.ensureComplete(9192, Reward.id);
                }
            }
            Core.cancelRegisteredQuests();
        }
    }
}

export default function main(): void {
    const script = new AriesChrysomallusRewards();
    Core.setOptions();

    script.example();
    Core.setOptions(false);
}
