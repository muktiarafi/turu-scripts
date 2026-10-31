/*
name: ShadowslayerSummoningRitual
description: null
tags: null
*/
// Port of Scripts/Other/Various/ShadowslayerSummoningRitual.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { BuyScrolls, Scrolls } from "../../farm/BuyScrolls";
import { Core7DD } from "../../story/7deadlydragons/Core7DD";
import { ShadowSlayerK } from "../../story/ShadowSlayerK";

const Daily = new CoreDailies();
const Adv = new CoreAdvanced();
const ShadowStory = new ShadowSlayerK();
const DD = new Core7DD();
const Scroll = new BuyScrolls();

export class ShadowslayerSummoningRitual {
    getAll(MovetoQuest2 = false, itemFarm: string | null = null): void {
        ShadowStory.storyline();

        const RewardOptions = Core.ensureLoad(8835).rewards;
        const RewardsList: string[] = [];
        for (const Item of RewardOptions) {
            RewardsList.push(Item.name);
        }

        let Rewards = [...RewardsList];

        Core.addDrop(...Rewards);

        let count = 0;
        count = Core.checkSpaces(count, ...Rewards);

        this.shadowSlayersApprentice();

        // If itemFarm is not null, adjust the Rewards array to contain only the specified item
        if (!!itemFarm) {
            Rewards = [itemFarm];
        }

        for (const item of Rewards) {
            // Check if we need to move to Quest 2 or if the item is already in the inventory
            if (
                (!MovetoQuest2 && Core.checkInventory(item, undefined, { toInv: false })) ||
                (MovetoQuest2 && Core.checkInventory("Sparkly Shadowslayer Relic"))
            ) {
                continue;
            }

            // Loop to acquire the item or relic
            while (
                !bot.shouldExit &&
                ((!MovetoQuest2 && !Core.checkInventory(item, undefined, { toInv: false })) ||
                    (MovetoQuest2 && !Core.checkInventory("Sparkly Shadowslayer Relic")))
            ) {
                Core.logger(
                    `Getting ${item}. Rewards Left: ${Rewards.length - count} more item` +
                        (Rewards.length - count > 1 ? "s" : ""),
                );
                Core.ensureAccept(8835);

                Scroll.buyScroll(Scrolls.SpiritRend, 30);
                Scroll.buyScroll(Scrolls.Eclipse, 15);
                Scroll.buyScroll(Scrolls.BlessedShard, 30);

                Core.addDrop("Meat Ration", "Grain Ration", "Dairy Ration");

                while (!bot.shouldExit && !Core.checkInventory("Meat Ration")) {
                    Core.ensureAccept(8263);
                    Core.huntMonster("cellar", "GreenRat", "Green Mystery Meat", 10);
                    Core.ensureComplete(8263);
                    bot.wait.forPickup("Meat Ration");
                }

                while (!bot.shouldExit && !Core.checkInventory("Grain Ration", 2)) {
                    Core.ensureAccept(8264);
                    Core.killMonster("castletunnels", "r5", "Left", "Blood Maggot", "Bundle of Rice", 3);
                    Core.ensureComplete(8264);
                    bot.wait.forPickup("Grain Ration");
                }

                while (!bot.shouldExit && !Core.checkInventory("Dairy Ration")) {
                    Core.ensureAccept(8265);
                    Core.killMonster("odokuro", "Boss", "Right", "O-dokuro", "Bone Hurt Juice", 5);
                    Core.ensureComplete(8265);
                    bot.wait.forPickup("Dairy Ration");
                }

                Core.ensureComplete(8835);
                Core.toBank(item);
            }

            // Abandon unnecessary quests
            const AbandonThese = [2309, 2317, 8263, 8264, 8265, 8835];
            bot.quests.unregisterQuests(...AbandonThese);
            Core.abandonQuest(...AbandonThese);
        }
    }

    shadowSlayersApprentice(): void {
        if (!Core.checkInventory("ShadowSlayer's Apprentice")) {
            Core.farmingLogger("ShadowSlayer's Apprentice", 1);
            Core.addDrop("Shadowslayer Apprentice Badge");
            Core.huntMonster("chaosbeast", "Kathool", "Chibi Eldritch Yume", undefined, { isTemp: false });
            Core.ensureAccept(8266);
            Daily.eldersBlood();
            if (!Core.checkInventory("Holy Wasabi")) {
                Core.addDrop("Holy Wasabi");
                Core.ensureAccept(1075);

                Core.equipClass(ClassType.Farm);
                Core.huntMonster("doomwood", "Doomwood Ectomancer", "Dried Wasabi Powder", 4);
                Core.getMapItem(428, 1, "lightguard");
                Core.join("lightguard");

                Core.ensureComplete(1075);
                bot.wait.forPickup("Holy Wasabi");
            }
            Adv.buyItem("alchemyacademy", 2036, "Sage Tonic", 3);
            DD.hazMatSuit();
            Core.huntMonster("sloth", "Phlegnn", "Unnatural Ooze", 8);
            Core.huntMonster("beehive", "Killer Queen Bee", "Sleepy Honey");
            Core.ensureComplete(8266);
            Core.buyItem("safiria", 2044, "ShadowSlayer's Apprentice");
        }
    }
}

export default function main(): void {
    const script = new ShadowslayerSummoningRitual();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
