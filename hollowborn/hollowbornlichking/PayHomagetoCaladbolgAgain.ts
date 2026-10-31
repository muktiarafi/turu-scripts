/*
name: Pay Homage to Caladbolg (Again)
description: farms the requirements, and does the quest "Pay Homage to Caladbolg (Again)"
tags: pay homage to caladbolg (again), caladbolg, hollowborn, hollowborn, lich, king, hollowborn lich king, hollowborn caladbolg, dual hollowborn caladbolgs, hollowborn caladbolg companion, hollowborn caladbolg battle companion
*/
// Port of Scripts/Hollowborn/HollowbornLichKing/PayHomagetoCaladbolgAgain.cs.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreHollowbornLichKing, CounterblowRewards } from "./CoreHollowbornLichKing";
import { HollowSoul } from "../materials/HollowSoul";
import { CoreLegion } from "../../legion/CoreLegion";
import { Caladbolg } from "../../legion/various/Caladbolg";

const Legion = new CoreLegion();
const coreHollowbornLichKing = new CoreHollowbornLichKing();
const HS = new HollowSoul();
const caladbolg = new Caladbolg();

export class PayHomagetoCaladbolgAgain {
    getRewards(): void {
        if (
            Core.ensureLoad(9641).rewards.every((reward) =>
                Core.checkInventory(reward.name, undefined, { toInv: false }),
            ) ||
            !Core.checkInventory("Altar Of the Hollowborn Caladbolg")
        ) {
            Core.logger(
                !Core.checkInventory("Altar Of the Hollowborn Caladbolg")
                    ? 'This bot requires you to have a "Altar Of the Hollowborn Caladbolg". Stopping the bot.'
                    : "All rewards owned, stopping the bot",
            );
            return;
        }

        const RewardOptions = Core.ensureLoad(9641).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.id);
        }

        caladbolg.getCaladbolg(false);
        if (!Core.checkInventory("Caladbolg")) {
            Core.logger("Caladbolg could not be obtained. Stopping the bot.");
            return;
        }

        coreHollowbornLichKing.counterblow(CounterblowRewards.Altar_Of_the_Hollowborn_Caladbolg);

        for (const Reward of RewardOptions) {
            // C# returns here, so owning the first reward ended the script before the others.
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                continue;
            }

            Core.logger(
                Core.checkInventory(Reward.id, undefined, { toInv: false })
                    ? `${Reward.name}: ✅`
                    : `${Reward.name} ❌`,
            );
            // Core.ResetQuest(9641);
            while (!bot.shouldExit && !Core.checkInventory(Reward.id)) {
                Core.ensureAccept(9641);
                Legion.farmLegionToken(5);
                HS.getYaSoulsHeeeere(1);
                Core.ensureCompleteMulti(9641);
            }

            Core.jumpWait();
            Core.toBank(Reward.name);
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new PayHomagetoCaladbolgAgain();
    Core.setOptions();

    script.getRewards();

    Core.setOptions(false);
}
