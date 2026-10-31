/*
name: PineappleSlayerSet
description: null
tags: null
*/
// Port of Scripts/Seasonal/HarvestDay/PineAppleSlayerSet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class PineappleSlayerSet {
    example(): void {
        if (
            !Core.isSeasonalMapActive("foulfarm") ||
            Core.checkInventory(Core.questRewards(9486), undefined, { toInv: false })
        ) {
            Core.logger(
                Core.checkInventory(Core.questRewards(9486)) ? "All rewards owned." : "seasonal map not available.",
            );
            return;
        }

        this.preReqs();

        const RewardOptions = Core.ensureLoad(9486).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.id);
        }

        Core.equipClass(ClassType.Solo);
        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.id, undefined, { toInv: false })) {
                continue;
            }

            Core.farmingLogger(Reward.name, 1);
            Core.ensureAccept(9486);
            Core.huntMonster("freakitiki", "Spineapple", "Fresh Pineapple", 10, { log: false });
            Core.ensureComplete(9486, Reward.id);

            bot.wait.forPickup(Reward.name);
            if (bot.config!.get<boolean>("BankAfter") && bot.inventory.contains(Reward.id)) {
                Core.toBank(Reward.name);
            }
        }
    }

    preReqs(): void {
        if (Core.isCompletedBefore(9486)) {
            return;
        }

        Story.preLoad(this.preReqs);

        if (!Story.questProgression(9484)) {
            Core.ensureAccept(9484);
            Core.huntMonster("foulfarm", "Foul Wishbone", "Wishbone", 10);
            Core.huntMonster("foulfarm", "Foul Fowl", "Foul Turkey");
            Core.huntMonster("harvest", "Turdraken", "Turdraken");
            Core.ensureComplete(9484);
        }

        if (!Story.questProgression(9485)) {
            Core.ensureAccept(9485);

            if (!Core.checkInventory("Boar's Feet in Salted-Butter Sauce")) {
                Core.addDrop("Boar's Feet recipe");
                Core.ensureAccept(1183);
                Core.huntMonster("bloodtusk", "Rhison", "Quart of Rhison Milk", 7);
                Core.huntMonster("bloodtusk", "Rhison", "Rhison Tears");
                Core.huntMonster("bloodtusk", "Horc Boar Scout", "Boar's Foot", 12);
                Core.ensureComplete(1183);
                bot.wait.forPickup("Boar's Feet recipe");
                Core.buyItem("bloodtusk", 304, "Boar's Feet in Salted-Butter Sauce");
                bot.wait.forPickup("Boar's Feet in Salted-Butter Sauce");
            }

            Core.huntMonster("grams", "Wereboar", "Wereboar Captured");
            Core.huntMonster("trygve", "Rune Boar", "Rune Boar Captured", 10);
            Core.ensureComplete(9485);
        }

        Story.killQuest(9486, "freakitiki", "Spineapple");
    }
}

export const scriptOptions = defineScriptOptions(
    "PineappleSlayerSet",
    [option.bool("BankAfter", "Bank After", "Bank all rewards after?", false), Core.skipOptions],
    true,
);

export default function main(): void {
    const script = new PineappleSlayerSet();
    Core.setOptions();

    script.example();

    Core.setOptions(false);
}
