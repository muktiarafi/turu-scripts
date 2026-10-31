/*
name: DeepTrobbleTreasureChest
description: Does the "Deep Trobble Treasure Chest" quest for the rewards [random drops]
tags: deep, trobble, treasure, chest, rewards, grim first mort on yer back, grim skull 'n flag, marauder's monkey mace, captain chinchillarrrr on yer back, captain chinchillarrrr pet, beleen's balloon cutelass, beleen's balloon cutelasses, gunpowder beach, gunpowder beach, pearl dust arm shuriken, astravian corsair, astravian corsair hat, astravian corsair hat, astravian corsair hat + locks, astravian corsair's coat, astravian corsair coat and blade
*/
// Port of Scripts/Other/Various/DeepTrobbleTreasureChest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class DeepTrobbleTreasureChest {
    doQuest(): void {
        for (const map of ["hiddendepths", "midnightwar", "kaijuwar", "cetoleonwar", "dragoncapital"]) {
            if (!Core.isSeasonalMapActive(map)) {
                return;
            }
        }

        this.randomReward(9407);
    }

    private randomReward(questID = 0, quant = 1): void {
        let i = 1;

        const RewardOptions = Core.ensureLoad(questID).rewards;

        for (const item of RewardOptions) {
            bot.drops.add(item.name);
        }

        const QuestRewards = RewardOptions.map((x) => x.name);

        Core.equipClass(ClassType.Solo);
        Core.registerQuests(questID);
        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                Core.logger(`${Reward.name} Found.`);
            } else {
                Core.farmingLogger(Reward.name, 1);
                while (!bot.shouldExit && !Core.checkInventory(Reward.name, quant, { toInv: false })) {
                    Core.huntMonster("hiddendepths", "Aquamancer", "Aquamancer's Key");
                    Core.huntMonster("midnightwar", "Flintfang", "Flintfang's Key");
                    Core.huntMonster("kaijuwar", "Captain Kraylox", "Kraylox' Key");
                    Core.huntMonster("cetoleonwar", "Nomura", "Nomura's Key");
                    Core.huntMonster("dragoncapital", "Leviathanius", "Leviathanius' Key");

                    i++;

                    if (i % 5 === 0) {
                        Core.jumpWait();
                        Core.toBank(...QuestRewards);
                    }
                }
            }
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new DeepTrobbleTreasureChest();
    Core.setOptions();

    Core.oneTimeMessage(
        "read if u want",
        "drops P1 [section 1 on wiki] are random\n" +
            "drops P2[section 2 on wiki] are guaranteed  1 by 1 till u get them all",
        undefined,
        true,
    );

    script.doQuest();

    Core.setOptions(true);
}
