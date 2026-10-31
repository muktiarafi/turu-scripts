/*
name: Contract Exchange
description: null
tags: bamblooze vs drudgen, contract exchange, pet,
*/
// Port of Scripts/Nation/ContractExchange.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../core/CoreBots";
import { ContractExchangeRewards, CoreNation } from "./CoreNation";

const Nation = new CoreNation();

export class ContractExchanging {
    contractExchangeItems: string[] = [
        "Drudgen the Assistant",
        "Tainted Gem",
        "Dark Crystal Shard",
        "Gem of Nulgath",
        "Blood Gem of the Archfiend",
    ];

    contractExchange(): void {
        if (!Core.checkInventory("Drudgen the Assistant")) {
            Core.logger("Missing: Drudgen the Assistant pet.", undefined, { stopBot: true });
            return;
        }

        Core.addDrop(...[...this.contractExchangeItems, ...Nation.bagDrops]);

        const maxOrChoose = bot.config!.get<boolean>("MaxorChoose");
        const rewardSelectAll =
            configEnum("RewardSelect", ContractExchangeRewards, ContractExchangeRewards.Tainted_Gem) ===
            ContractExchangeRewards.All;
        const taintedGem = bot.config!.get<boolean>("Tainted Gem");
        const darkCrystalShard = bot.config!.get<boolean>("Dark Crystal Shard");
        const gemOfNulgath = bot.config!.get<boolean>("Gem of Nulgath");
        const bloodGemOfArchfiend = bot.config!.get<boolean>("Blood Gem of the Archfiend");

        if (maxOrChoose) {
            if (!rewardSelectAll || !taintedGem || !darkCrystalShard || !gemOfNulgath || !bloodGemOfArchfiend) {
                Core.logger(
                    "Options conflict: Max bags is true, but ChooseReward must be set to All, and the last 4 options must be true. Setting MaxorChoose to false.",
                    undefined,
                    { stopBot: true },
                );
            }
        }

        for (const reward of (
            choices(ContractExchangeRewards).map(
                (n) => ContractExchangeRewards[n as keyof typeof ContractExchangeRewards],
            ) as ContractExchangeRewards[]
        ).filter((r) => r !== ContractExchangeRewards.All)) {
            const rewardName = ContractExchangeRewards[reward]?.replaceAll("_", " ");
            const item = Core.ensureLoad(870).rewards.find((x) => x.name === rewardName) ?? null;

            if (item == null) {
                Core.logger(`Item with name '${rewardName}' not found.`, undefined, { stopBot: true });
                continue;
            }

            if (!bot.config.get<boolean>(rewardName!)) {
                continue;
            }

            // Condition 2: Max bags is true, but one of the last 4 options is false
            if (maxOrChoose && (!taintedGem || !darkCrystalShard || !gemOfNulgath || !bloodGemOfArchfiend)) {
                Core.logger("Options conflict: Max bags is true, but one of the last 4 options is false.", undefined, {
                    stopBot: true,
                });
            }

            while (!bot.shouldExit && !Core.checkInventory(item.name, item.maxStack)) {
                Nation.farmContractExchage(rewardName, item.maxStack);
            }
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "ContractExchange",
    [
        Core.skipOptions,
        option.bool(
            "MaxorChoose",
            "Max bags or Choose",
            "Either choose to max the quest rewards or choose your reward manualy [true: max, false: choose]",
            true,
        ),
        option.choice(
            "RewardSelect",
            "Choose Your Quest Reward",
            "Select Your Quest Reward for Contract Exchange.",
            choices(ContractExchangeRewards),
            ContractExchangeRewards[ContractExchangeRewards.All],
        ),
        option.bool("Tainted Gem", "Farm Tainted Gem", 'Farm "Tainted Gem" to max stack', true),
        option.bool("Dark Crystal Shard", "Farm Dark Crystal Shard", 'Farm "Dark Crystal Shard" to max stack', true),
        option.bool("Gem of Nulgath", "Farm Gem of Nulgath", 'Farm "Gem of Nulgath" to max stack', true),
        option.bool(
            "Blood Gem of the Archfiend",
            "Farm Blood Gem of the Archfiend",
            'Farm "Blood Gem of the Archfiend" to max stack',
            true,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new ContractExchanging();
    Core.bankingBlackList.push(...script.contractExchangeItems);
    Core.setOptions();

    script.contractExchange();

    Core.setOptions(false);
}
