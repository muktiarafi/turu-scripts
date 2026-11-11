/*
name: Yokai Hunt
description: Completes the quests in yokaihunt.
tags: yokai, seasonal, akiba-new-year, yokaihunt, story, baoyu lin, ai no miko, yue huang
*/
// Port of Scripts/Seasonal/AkibaNewYear/YokaiHunt.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class YokaiHunt {
    doAll(): void {
        this.aiNoMiko();
        this.yueHuang();
        this.baoyuLin();
        this.aiNoMiko2();
        this.shiWaLam();
    }

    aiNoMiko(): void {
        if (Core.isCompletedBefore(7941) || !Core.isSeasonalMapActive("yokaihunt")) {
            return;
        }

        Story.preLoad(this.aiNoMiko);

        //Nope-perabo (7936)
        Story.killQuest(7936, "yokaihunt", "Ox Nopperabo");

        //Intel Processor (7937)
        Story.killQuest(7937, "yokaihunt", "Golden Ox Guard");

        //Scout Out (7938)
        Story.mapItemQuest(7938, "yokaihunt", 8133);
        Story.killQuest(7938, "yokaihunt", "Golden Ox Guard");

        //Re-info-source-ments (7939)
        Story.killQuest(7939, "yokaihunt", "Golden Ox Guard");

        //Yokai Ox Spirit (7940)
        Story.killQuest(7940, "yokaihunt", "Ox Yokai Spirit");

        //Etokoun Captured (7941)
        Core.equipClass(ClassType.Solo);
        Story.killQuest(7941, "yokaihunt", "Etokoun");
    }

    yueHuang(): void {
        if (Core.isCompletedBefore(9098) || !Core.isSeasonalMapActive("yokaihunt")) {
            return;
        }

        this.aiNoMiko();

        Story.preLoad(this.yueHuang);

        //Vitamoon (9092)
        if (!Story.questProgression(9092)) {
            Core.ensureAccept(9092);
            Core.huntMonster("natatorium", "Anglerfish", "Angler Oil", 7);
            Core.huntMonster("natatorium", "Merdraconian", "Draconian Oil", 7);
            Core.ensureComplete(9092);
        }

        //Fill'er Up (9093)
        if (!Story.questProgression(9093)) {
            Core.ensureAccept(9093);
            Core.killMonster("wanders", "r5", "Left", "Lotus Spider", "Lotus Seeds", 10, { log: false });
            Core.huntMonster("battlefowl", "ChickenCow", "Chickencow Egg", 3, { log: false });
            Core.ensureComplete(9093);
        }

        //Mirror Flowers (9094)
        if (!Story.questProgression(9094)) {
            Core.ensureAccept(9094);
            Core.huntMonster("guardiantree", "Blossoming Treeant", "Fresh Blossoms", 8);
            Core.huntMonster("guardiantree", "Seed Spitter", "Fresh Seeds", 8);
            Core.ensureComplete(9094);
        }

        //Moon's Reflection (9095)
        if (!Story.questProgression(9095)) {
            Core.ensureAccept(9095);
            Core.huntMonster("beachparty", "Water Elemental", "Sparkling Water", 9);
            Core.huntMonster("beachparty", "Boiling Elemental", "Boiling Water", 9);
            Core.ensureComplete(9095);
        }

        //Shifting Faces (9096)
        if (!Story.questProgression(9096)) {
            Core.ensureAccept(9096);
            Core.huntMonster("safiria", "Albino Bat ", "White Bat", 10);
            Core.huntMonster("safiria", "Chaos Lycan", "Violet Wolf", 10);
            Core.ensureComplete(9096);
        }

        //Eto... Bleh (9097)
        Core.equipClass(ClassType.Solo);
        Story.killQuest(9097, "yokaihunt", "Etokoun");

        //Elixir of the Moon (9098)
        Story.killQuest(9098, "yokaihunt", "Elixir Etokoun");
    }

    baoyuLin(): void {
        if (Core.isCompletedBefore(9575) || !Core.isSeasonalMapActive("yokaihunt")) {
            return;
        }

        this.yueHuang();

        Story.preLoad(this.baoyuLin);

        // Art of Resilience (9571)
        Story.killQuest(9571, "zhu", "Plum Treeant");

        // Lucky Red (9572)
        if (!Story.questProgression(9572)) {
            Core.ensureAccept(9572);
            Core.huntMonster("shipwreck", "Gilded Merdraconian", "Merdraconian Coins", 15);
            Core.huntMonster("shipwreck", "Lobthulhu", "Lobthulu's Gold Bar", 1);
            Core.ensureComplete(9572);
        }

        // Palm Soot (9573)
        Story.killQuest(9573, "burningbeach", "Lava Guardian");

        // Hong of the West (9574)
        Story.killQuest(9574, "ashfallcamp", "Smoldur");

        // Baihong Guan Ri (9575)
        Story.killQuest(9575, "yokaihunt", "Mutou Hong");
    }

    aiNoMiko2(): void {
        if (Core.isCompletedBefore(10060) || !Core.isSeasonalMapActive("yokaihunt")) {
            return;
        }

        this.baoyuLin();

        Story.preLoad(this.aiNoMiko2);

        //#region Useable Monsters
        const UseableMonsters = [
            "Ox Nopperabo", // UseableMonsters[0],
            "Golden Ox Guard", // UseableMonsters[1],
            "Ox Yokai Spirit", // UseableMonsters[2],
            "Etokoun", // UseableMonsters[3],
            "Elixir Etokoun", // UseableMonsters[4],
            "Mutou Hong", // UseableMonsters[5],
            "Zhenzhu Shé", // UseableMonsters[6]
        ];
        //#endregion Useable Monsters
        // 10056 | Xionghuang Remedy
        if (!Story.questProgression(10056)) {
            Core.ensureAccept(10056);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("yokairiver", "Kappa Ninja", "Kappa Spirits", 8);
            Core.huntMonster("yokairiver", "Funa-yurei", "Funa-Yurei Powder", 8);
            Core.ensureComplete(10056);
        }

        // 10057 | Calabash Elixir
        if (!Story.questProgression(10057)) {
            Core.huntMonsterQuest(10057, ["yokaihunt", UseableMonsters[4], ClassType.Solo]);
        }

        // 10058 | Duàn Qiáo
        if (!Story.questProgression(10058)) {
            Core.huntMonsterQuest(10058, ["hakuvillage", "Mountain Oni", ClassType.Farm]);
        }

        // 10059 | Sangharama's Blessing
        if (!Story.questProgression(10059)) {
            Core.huntMonsterQuest(10059, ["shogunwar", "Shadow Samurai", ClassType.Farm]);
        }

        // 10060 | Lady Suzhen
        if (!Story.questProgression(10060)) {
            Core.huntMonsterQuest(10060, ["yokaihunt", UseableMonsters[6], ClassType.Solo]);
        }
    }

    shiWaLam(): void {
        if (Core.isCompletedBefore(10590) || !Core.isSeasonalMapActive("yokaihunt")) {
            return;
        }

        this.aiNoMiko2();
        Story.preLoad(this.shiWaLam);

        // 10586 | Wartime Kaidan
        if (!Story.questProgression(10586)) {
            Core.huntMonsterQuest(10586, ["yokaiwar", "Samurai Nopperabo", ClassType.Farm]);
        }

        // 10587 | Act of Loyalty
        if (!Story.questProgression(10587)) {
            Core.huntMonsterQuest(10587, ["shogunwar", "Shadow Samurai", ClassType.Farm]);
        }

        // 10588 | Natural Betrayal
        if (!Story.questProgression(10588)) {
            Core.ensureAccept(10588);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("hakuwar", "Dark Zmey", "Zmey Alexandrite", 9);
            Core.huntMonster("hakuwar", "Kitsune Spy", "Kitsune Kinchaku", 9);
            Core.ensureComplete(10588);
        }

        // 10589 | Coming Conflict
        if (!Story.questProgression(10589)) {
            Core.huntMonsterQuest(10589, ["shadowbattleon", "Ouro Spawn", ClassType.Farm]);
        }

        // 10590 | Chi Tu
        if (!Story.questProgression(10590)) {
            Core.huntMonsterQuest(10590, ["yokaihunt", "Red Hare", ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new YokaiHunt();
    Core.setOptions();

    script.doAll();
    Core.setOptions(false);
}
