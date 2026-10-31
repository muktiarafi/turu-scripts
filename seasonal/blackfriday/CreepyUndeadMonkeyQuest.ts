/*
name: Creepy Undead Monkey
description: This will do the Creepy Undead Monkey quest to obtain all of the reward items.
tags: creepy-undead-monkey, black-friday, seasonal
*/
// Port of Scripts/Seasonal/BlackFriday/CreepyUndeadMonkeyQuest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreIsleOfFotia } from "../../story/isleoffotia/CoreIsleOfFotia";

const Fotia = new CoreIsleOfFotia();

export class CreepyUndeadMonkeyQuest {
    randomReward(): void {
        if (!Core.isMember && !this.calculateFriday13()) {
            Core.logger("You must be Member or wait until a week before Friday the 13th to access /twig.");
            return;
        }

        Fotia.underRealm();

        const QuestRewards = Core.questRewards(4106);
        bot.drops.add(...QuestRewards);
        let i = 0;

        if (!Core.checkInventory("Golden Bough")) {
            Core.addDrop("Golden Bough");
            Core.equipClass(ClassType.Farm);

            Core.ensureAccept(3010);
            Core.huntMonster("UnderRealm", "Underworld Soul", "Souls Released", 8);
            Core.ensureComplete(3010);
        }

        bot.quests.updateQuest(3010);
        Core.registerQuests(4106);
        for (const Reward of QuestRewards) {
            if (Core.checkInventory(Reward, undefined, { toInv: false })) {
                Core.logger(`${Reward} found.`);
                continue;
            }

            Core.farmingLogger(Reward, 1);
            while (!bot.shouldExit && !Core.checkInventory(Reward, undefined, { toInv: false })) {
                Core.equipClass(ClassType.Farm);
                Core.huntMonster("alliance", "Good Soldier", "Good Soldier's Face");
                Core.huntMonster("alliance", "Evil Soldier", "Evil Soldier's Skull");
                Core.huntMonster("neverlore", "Whablobble", "Whablobble Tongue");
                Core.huntMonster("thespan", "Minx Fairy", "Minx Fairy Wings");
                Core.huntMonster("battlecon", "BrutalCorn", "Evil Con Corny");
                Core.huntMonster("crossroads", "Lemurphant", "Lemurphant's Peanuts");
                Core.huntMonster("arcangrove", "Gorillaphant", "Fresh Gorilla Paw");
                Core.huntMonster("arcangrove", "Gorillaphant", "Bananas in pajamas");
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("battlefowl", "Chickencow", "Chickencow Head");
                Core.huntMonster("mafic", "Scoria Serpent", "Scoria Serpent Charmer");
                Core.huntMonster("underrealm", "Grief", "Grief's Tears");
                Core.huntMonster("deepchaos", "Kathool", "Kathool... All of him");
                Core.huntMonster("twig", "Sweetish Fish", "Candy from a Sweetish Fish");

                i++;

                if (i % 5 === 0) {
                    Core.toBank(...QuestRewards);
                }
            }
        }
    }

    calculateFriday13(): boolean {
        return (
            new Date(
                new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth() + 1 - 1, 13).getTime(),
            ).getDay() === 5 /* Friday */ && new Date(Date.now()).getDate() >= 5
        );
    }
}

export default function main(): void {
    const script = new CreepyUndeadMonkeyQuest();
    Core.bankingBlackList.push("Twisted Monkey Paw");
    Core.setOptions();

    script.randomReward();

    Core.setOptions(false);
}
