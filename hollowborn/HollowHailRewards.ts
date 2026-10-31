/*
name: Hollow Hail Quest Rewards
description: Farms quest rewards from "With Every Wind", "Hail To The King", and "Cold, Cold, COLD!" quests
tags: Hollow Hail, hollow, hail, hollowborn, With Every Wind, Hail To The King, Cold Cold COLD
*/
// Port of Scripts/Hollowborn/HollowHailRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";
import { BuyScrolls, Scrolls } from "../farm/BuyScrolls";
import { HollowSoul } from "./materials/HollowSoul";
import { AcielsGiftsMerge } from "./mergeshops/AcielsGiftsMerge";

const AGM = new AcielsGiftsMerge();
const BS = new BuyScrolls();
const HS = new HollowSoul();
const Farm = new CoreFarms();

export class HollowHailRewards {
    private readonly requiredForLater: string[] = [
        // Shared requirement
        "The Hollow Hail", // Required for Hail To The King
        "Hollowborn Frost King's Scepter",
        "Hollowborn Frost Queen's Scythe",
        "Hollowborn Frost King's Cowl",
        "Hollowborn Frost Queen's Tiara", // Required for Cold, Cold, COLD!
        "Hollowborn Frost King",
        "Hollowborn Frost Queen",
    ];

    private static readonly withEveryWindQuestID = 10604;
    private static readonly hailToTheKingQuestID = 10605;
    private static readonly coldColdCOLDQuestID = 10606;

    getAllRewards(): void {
        AGM.buyAllMerge("The Hollow Hail");
        this.withEveryWindQuestRewards();
        this.hailToTheKingQuestRewards();
        this.coldColdCOLDQuestRewards();
    }

    withEveryWindQuestRewards(): void {
        const quest = Core.initializeWithRetries(() => bot.quests.ensureLoad(HollowHailRewards.withEveryWindQuestID));

        if (quest == null) {
            Core.logger(
                `Failed to load quest with ID ${HollowHailRewards.withEveryWindQuestID}. Cannot proceed with With Every Wind rewards.`,
            );
            return;
        }

        if (quest?.acceptRequirements?.length > 0) {
            for (const req of quest.acceptRequirements) {
                Core.unbank(req.name);
            }
        }

        const rewardOptions = quest?.rewards;
        if (rewardOptions == null || rewardOptions.length === 0) {
            Core.logger("No With Every Wind quest rewards found.");
            return;
        }

        // Register all drops once
        for (const item of rewardOptions) {
            Core.addDrop(item.name);
        }

        const rewardCount = rewardOptions.length;

        for (let i = 0; i < rewardCount; i++) {
            const reward = rewardOptions[i];

            if (Core.checkInventory(reward.name, undefined, { toInv: false })) {
                Core.logger(`[✓] ${reward.name} already owned — skipping (${i + 1}/${rewardCount})`);
                continue;
            }

            Core.logger(
                `╔═[ WITH EVERY WIND :: ${i + 1}/${rewardCount} ]═╗\n` +
                    `║  Target : ${reward.name}\n` +
                    `║  ID     : ${reward.id}\n` +
                    `╚══════════════════════════════════════════════╝`,
            );

            Core.ensureAccept(HollowHailRewards.withEveryWindQuestID);

            // Solo Phase
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("kingcoal", "Frost King", "Frost King's Story", undefined, { isTemp: false });
            Core.huntMonster("banished", "Desterrat Moya", "The Scythe of Awe", undefined, { isTemp: false });
            Core.huntMonster("northstar", "Karok the Fallen", "FrozenFear Crystal", undefined, { isTemp: false });

            // Farm Phase
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("marsh2", "Soulseeker", "Soulseeker's Grim Hood", undefined, { isTemp: false });
            Core.huntMonster("noobshire", "Kittarian Mouse Flayer", "Pitchfork", undefined, { isTemp: false });
            Core.huntMonster("doomwood", "Doomwood Soldier", "Cheering Skull Cape", undefined, { isTemp: false });

            Core.ensureComplete(HollowHailRewards.withEveryWindQuestID, reward.id);
            Core.jumpWait();

            if (!this.requiredForLater.includes(reward.name)) {
                Core.toBank(reward.name);
                Core.logger(`[📦 BANKED] ${reward.name}`);
            } else {
                Core.logger(`[🔒 KEPT] ${reward.name} (needed for later quest)`);
            }

            Core.logger(`[✔ COMPLETED] ${reward.name} secured.`);
        }

        Core.logger("All With Every Wind rewards processed.");
    }

    hailToTheKingQuestRewards(): void {
        const quest = Core.initializeWithRetries(() => bot.quests.ensureLoad(HollowHailRewards.hailToTheKingQuestID));

        if (quest == null) {
            Core.logger(
                `Failed to load quest with ID ${HollowHailRewards.hailToTheKingQuestID}. Cannot proceed with Hail To The King rewards.`,
            );
            return;
        }

        if (Core.questRewardsInt(quest.id).every((x) => Core.checkInventory(x))) {
            return;
        }

        if (quest?.acceptRequirements?.length > 0) {
            for (const req of quest.acceptRequirements) {
                Core.unbank(req.name);
            }
        }

        Core.addDrop(...(quest?.rewards?.map((r) => r.name) ?? []));

        Core.logger("╔═[ HAIL TO THE KING ]═╗");
        Core.ensureAccept(HollowHailRewards.hailToTheKingQuestID);

        // Solo Phase
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("icedungeon", "Shade of Kyanos", "Warrior of Kyanos", undefined, { isTemp: false });
        Core.huntMonster("yulgarparty", "Treasure Pile", "Highborn Necromancer", undefined, { isTemp: false });

        // Farm Phase
        Core.equipClass(ClassType.Farm);
        Core.killMonster("noxustower", "r13", "Left", "*", "Human Soul", 151, { isTemp: false });
        BS.buyScroll(Scrolls.Frostbite, 9, true);

        Core.ensureComplete(HollowHailRewards.hailToTheKingQuestID);
        Core.jumpWait();

        const rewardName = (quest?.rewards?.[0] ?? null)?.name ?? "reward";
        if (!this.requiredForLater.includes(rewardName)) {
            Core.toBank(rewardName);
            Core.logger(`[📦 BANKED] ${rewardName}`);
        } else {
            Core.logger(`[🔒 KEPT] ${rewardName} (needed for later quest)`);
        }

        Core.logger("Hail to the King complete.");
    }

    coldColdCOLDQuestRewards(): void {
        if (!Core.isMember) {
            Core.logger('Membership required for "Cold, Cold, COLD!" quest.');
            return;
        }

        const quest = Core.initializeWithRetries(() => bot.quests.ensureLoad(HollowHailRewards.coldColdCOLDQuestID));

        if (quest == null) {
            Core.logger(
                `Failed to load quest with ID ${HollowHailRewards.coldColdCOLDQuestID}. Cannot proceed with Cold, Cold, COLD! rewards.`,
            );
            return;
        }

        if (Core.questRewardsInt(quest.id).every((x) => Core.checkInventory(x))) {
            return;
        }

        if (quest?.acceptRequirements?.length > 0) {
            for (const req of quest.acceptRequirements) {
                Core.unbank(req.name);
            }
        }

        Core.addDrop(...(quest?.rewards?.map((r) => r.name) ?? []));

        Core.logger("╔═[ COLD COLD COLD ]═╗");
        Core.ensureAccept(HollowHailRewards.coldColdCOLDQuestID);

        // Solo/Pre-farm Phase
        Core.equipClass(ClassType.Solo);
        HS.getYaSoulsHeeeere(3000);
        Farm.battleUnderB("Bone Dust", 206);

        // Farm Phase
        // incase we didnt farm it in the last quest
        Core.equipClass(ClassType.Farm);
        Core.killMonster("noxustower", "r13", "Left", "*", "Human Soul", undefined, { isTemp: false });

        Core.ensureComplete(HollowHailRewards.coldColdCOLDQuestID);
        Core.jumpWait();

        const rewardName = (quest?.rewards?.[0] ?? null)?.name ?? "reward";
        if (!this.requiredForLater.includes(rewardName)) {
            Core.toBank(rewardName);
            Core.logger(`[📦 BANKED] ${rewardName}`);
        } else {
            Core.logger(`[🔒 KEPT] ${rewardName} (needed for later quest)`);
        }

        Core.logger("Cold, Cold, COLD! complete.");
    }
}

export default function main(): void {
    const script = new HollowHailRewards();
    Core.setOptions();
    script.getAllRewards();
    Core.setOptions(false);
}
