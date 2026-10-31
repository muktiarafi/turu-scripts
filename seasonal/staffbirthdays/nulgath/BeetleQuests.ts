/*
name: Beetle Quests and Rewards
description: This will complete the Beetle General Pet quest.
tags: quest, beetle, general, warlord, pet, staff, birthday, nulgath, void beetle, void,void beetle warlord, beetle general
*/
// Port of Scripts/Seasonal/StaffBirthdays/Nulgath/BeetleQuests.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreHollowborn } from "../../../hollowborn/CoreHollowborn";
import { CoreNation } from "../../../nation/CoreNation";
import { TempleSiegeMerge } from "./TempleSiegeMerge";

const TSM = new TempleSiegeMerge();
const Nation = new CoreNation();
const HB = new CoreHollowborn();

export class BeetleQuests {
    private static get adv(): CoreAdvanced {
        return new CoreAdvanced();
    }

    everything(): void {
        this.generalRewards();
        this.warlordRewards();
    }

    petAndArmor(): void {
        this.getBeetleWarlord();
        this.warlordRewards("Void Beetle Warlord");
    }

    getBeetleWarlord(): void {
        if (Core.checkInventory(75663)) {
            Core.logger('"Beetle Warlord Pet" owned.');
            return;
        }

        if (!Core.checkInventory(75653)) {
            TSM.buyAllMerge("Beetle General Pet");
        }

        if (!Core.checkInventory(75663)) {
            Core.addDrop("Red Ant Pet", "Beetle EXP", "Beetle Warlord Pet");
            Core.ensureAccept(9077);
            while (!bot.shouldExit && !Core.checkInventory("Beetle EXP", 8)) {
                Core.ensureAccept(9076);
                Core.huntMonster("giant", "Red Ant", "Red Ant Pet", undefined, { isTemp: false });
                Nation.essenceofNulgath(10);
                HB.freshSouls(1, 10);
                Core.ensureCompleteChoose(9076);
                Core.jumpWait();
            }
            BeetleQuests.adv.buyItem("tercessuinotlim", 1951, "Unmoulded Fiend Essence");
            Core.ensureComplete(9077);
            bot.wait.forPickup(75663);
        }
    }

    warlordRewards(rewardItemName: string | null = null, quant = 1): void {
        this.getBeetleWarlord();

        Core.addDrop("Baby Chaos Dragon", "Reaper's Soul");
        const RewardOptions = Core.ensureLoad(9078).rewards;
        RewardOptions.splice(
            0,
            RewardOptions.length,
            ...RewardOptions.filter((x) => !((item) => item.name === "Beetle EXP")(x)),
        );

        if (!!rewardItemName) {
            const rewardItem = RewardOptions.find((x) => x.name === rewardItemName) ?? null;
            if (rewardItem == null) {
                Core.logger("The specified reward item name is not available as a reward.");
                return;
            }

            Core.addDrop(rewardItem.name);

            Core.farmingLogger(rewardItem.name, rewardItem.maxStack);
            while (!bot.shouldExit && !Core.checkInventory(rewardItem.id, quant)) {
                Core.ensureAccept(9078);
                Nation.farmTotemofNulgath(1);
                Core.equipClass(ClassType.Farm);
                Core.huntMonster("dragonchallenge", "Chaos Dragon", "Baby Chaos Dragon", undefined, { isTemp: false });
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("thevoid", "Reaper", "Reaper's Soul", undefined, { isTemp: false });
                Core.ensureComplete(9078, rewardItem.id);
                Core.toBank(rewardItem.id);
            }
        } else {
            Core.addDrop(...Core.questRewards(9078));
            for (const item of RewardOptions) {
                Core.farmingLogger(item.name, item.maxStack);
                while (!bot.shouldExit && !Core.checkInventory(item.id, item.maxStack)) {
                    Core.ensureAccept(9078);
                    Nation.farmTotemofNulgath(1);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("dragonchallenge", "Chaos Dragon", "Baby Chaos Dragon", undefined, {
                        isTemp: false,
                    });
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("thevoid", "Reaper", "Reaper's Soul", undefined, { isTemp: false });
                    Core.ensureComplete(9078, item.id);
                    Core.toBank(item.id);
                }
            }
        }
    }

    generalRewards(): void {
        TSM.buyAllMerge("Beetle General Pet");

        const RewardOptions = Core.ensureLoad(9076).rewards;
        RewardOptions.splice(
            0,
            RewardOptions.length,
            ...RewardOptions.filter((x) => !((item) => item.name === "Beetle EXP")(x)),
        );
        Core.addDrop(...Core.questRewards(9076));

        for (const item of RewardOptions) {
            Core.farmingLogger(item.name, item.maxStack);
            while (!bot.shouldExit && !Core.checkInventory(item.id, undefined, { toInv: false })) {
                Core.ensureAccept(9076);
                Core.huntMonster("giant", "Red Ant", "Red Ant Pet", undefined, { isTemp: false });
                Nation.essenceofNulgath(10);
                HB.freshSouls(1, 10);
                Core.ensureComplete(9076, item.id);
                Core.jumpWait();
                Core.toBank(item.id);
            }
            if (bot.config!.get<boolean>("BankExtras")) {
                Core.toBank(item.id);
            }
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "BeetleQuests",
    [
        Core.skipOptions,
        option.bool(
            "GetCosmetics",
            "Pet + Cosmetics?",
            "get the Cosmetics from both pets...? Or only get the 2 pets + the Armor",
            false,
        ),
        option.bool("BankExtras", "Bank Cosmetics?", "Bank cosmetic rewards, or fill your inventory?", false),
    ],
    true,
);

export default function main(): void {
    const script = new BeetleQuests();
    if (bot.config!.get<boolean>("GetCosmetics")) {
        Core.bankingBlackList.push(...Core.questRewards(9077, 9078));
    } else {
        Core.bankingBlackList.push("Beetle Warlord Pet", "Beetle General Pet", "Beetle EXP");
    }
    Core.setOptions();

    if (bot.config!.get<boolean>("GetCosmetics")) {
        script.everything();
    } else {
        script.petAndArmor();
    }

    Core.setOptions(false);
}
