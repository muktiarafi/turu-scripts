/*
name: Martial Artist (Class)
description: This script will get Martial Artist class.
tags: Martial Artist, early game, class
*/
// Port of Scripts/Other/Classes/MartialArtist.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreStory } from "../../core/CoreStory";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Story = new CoreStory();

export class MartialArtist {
    getMartialArtist(rankUpClass = true): void {
        if (Core.checkInventory("Martial Artist")) {
            if (rankUpClass) {
                Adv.rankUpClass("Martial Artist");
            }
            return;
        }

        Core.addDrop("Martial Artist");
        Core.addDrop(88662, 88661, 88660);

        if (!Core.checkInventory("Martial Artist")) {
            // Lvl 65 is required
            Farm.experience(65);

            // 9922 | Join My Dojo
            Core.chainComplete(9922);

            // 9923 | 500 Punches and 500 Kicks
            if (!Story.questProgression(9923)) {
                Core.logger('Quest is required, we\'ll stack mats via "Deathly Slow Start [9933]" After');
                Core.ensureAccept(9923);

                Core.huntMonster("nexus", "Frogzard", "Frogzard Defeated", 500, { isTemp: false });
                Core.huntMonster("arcangrove", "Gorillaphant", "Gorillaphant Defeated", 500, { isTemp: false });
                Core.huntMonster("etherwardes", "Water Dragon Warrior", "Dragon Defeated", 500, { isTemp: false });

                Core.ensureComplete(9923);
            }

            //stack and then turn in to  get all required mats for the rest...
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(Core.isMember ? 9911 : 9902);
            Core.huntMonster(
                "dreadfight",
                "SUPER Dreadhaven General",
                "Dreadhaven General's Soul Fragment",
                Core.isMember ? 200 : 400,
                { isTemp: false },
            );
            bot.quests.updateQuest(9607);
            Core.huntMonster("hakuwar", "Zakhvatchik", "Zakhvatchik's Soul Fragment", Core.isMember ? 200 : 400, {
                isTemp: false,
            });
            Core.huntMonster("towerofdoom5", "Creel", "Creel's Soul Fragment", Core.isMember ? 200 : 400, {
                isTemp: false,
            });

            Core.ensureCompleteMulti(Core.isMember ? 9911 : 9902);
            for (const i of [88662, 88661, 88660]) {
                bot.wait.forPickup(i);
            }

            Core.chainComplete(9933);

            for (const Q of Core.fromTo(9924, 9927)) {
                // 9933 | Deathly Slow Start
                // 9924 | Discount Diploma
                // 9925 | One Million Miles Searching
                // 9926 | Ughhhhhh
                // 9927 | Work Smarter, Not Harder
                Core.chainComplete(Q);
            }
        }

        // Ensure quest is complete before buying
        if (!Story.questProgression(9928)) {
            Story.killQuest(9928, "hakuvillage", "The Master");
            bot.wait.forQuestComplete(9928);
        }

        Core.buyItem("hakuvillage", 2490, "Martial Artist");
        bot.wait.forPickup("Martial Artist");

        if (rankUpClass) {
            Adv.rankUpClass("Martial Artist");
        }
    }

    goldFarm(Gold = 100000000): void {
        if (bot.player.gold >= Gold) {
            return;
        }

        while (!bot.shouldExit && bot.player.gold <= Gold) {
            // Dreadhaven General's Soul Fragment (10): Join dreadfight, kill Dreadhaven General
            // Zakhvatchik's Soul Fragment (10): Join hakuwar, kill Zakhvatchik (last room)
            // Creel's Soul Fragment (10): Join towerofdoom5, kill Creel (last room)
            Core.huntMonsterQuest(
                9933,
                ["dreadfight", "SUPER Dreadhaven General", ClassType.Solo],
                ["hakuwar", "Zakhvatchik", ClassType.Solo],
                ["towerofdoom5", "Creel", ClassType.Solo],
            );
            bot.wait.forQuestComplete(9933);
        }
    }
}

export default function main(): void {
    const script = new MartialArtist();
    Core.setOptions();

    script.getMartialArtist();

    Core.setOptions(false);
}
