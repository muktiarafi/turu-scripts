/*
name: Shadow Slayer
description: This will finish the Shadow Slayer Story.
tags: story, quest, shadow-slayer
*/
// Port of Scripts/Story/ShadowSlayerK.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../core/CoreAdvanced";
import { ClassType, Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";
import { CoreStory } from "../core/CoreStory";
import { BuyScrolls, Scrolls } from "../farm/BuyScrolls";
import { Core7DD } from "./7deadlydragons/Core7DD";
import { GiantTaleStory } from "./GiantTaleStory";

const Story = new CoreStory();
const Daily = new CoreDailies();
const Adv = new CoreAdvanced();
const DD = new Core7DD();
const giantTaleStory = new GiantTaleStory();
const Scroll = new BuyScrolls();

export class ShadowSlayerK {
    doAll(): void {
        this.storyline();
        this.part2();
    }

    storyline(): void {
        if (Core.isCompletedBefore(8835)) {
            return;
        }

        Story.preLoad(this.storyline);
        Core.addDrop(
            "Shadowslayer Apprentice Badge",
            "Dairy Ration",
            "Grain Ration",
            "Meat Ration",
            "Holy Wasabi",
            "Racing Trophy",
        );

        // 8829 | Lend an Ear
        if (!Story.questProgression(8829)) {
            Core.ensureAccept(8829);
            Core.huntMonster("arcangrove", "Gorillaphant", "Gorillaphant Ear");
            Core.huntMonster("boxes", "Sneevil", "Sneevil Ear");
            Core.huntMonster("terrarium", "Dustbunny of Doom", "Dustbunny of Doom Ear");
            Core.huntMonster("uppercity", "Drow Assassin", "Drow Ear");
            Core.ensureComplete(8829);
        }

        // 8830 | The Voice from Yesterday
        if (!Story.questProgression(8830)) {
            Core.ensureAccept(8830);
            Adv.buyItem("Northpointe", 1085, "Dark Book");
            Core.huntMonster("Maxius", "Ghoul Minion", "Crimson BoneLord Tome", undefined, { isTemp: false });
            bot.quests.updateQuest(8060);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("backroom", "Book Wyrm", "Book of Monsters Mace", undefined, { isTemp: false });
            Core.buyItem("chronohub", 2024, "Chronomancer's Opus");
            Core.ensureComplete(8830);
        }

        // 8831 | Shadow Slayer Slayer
        Story.killQuest(8831, "newfinale", "Shadow Slayer");

        // 8832 | Dinner for Two
        if (!Story.questProgression(8832)) {
            Core.ensureAccept(8832);
            Core.huntMonster("dragonchallenge", "Greenguard Dragon", "Greenguard Dragon Ribs", undefined, {
                log: false,
            });
            Core.huntMonster("battlefowl", "ChickenCow", "Chickencow Wings", undefined, { log: false });
            Core.huntMonster("pirates", "Shark Bait", "Shark Bait Fillet", undefined, { log: false });
            Core.killMonster("greenguardwest", "West12", "Up", "Big Bad Boar", "Big Bad Boar Sausage", undefined, {
                log: false,
            });
            Core.huntMonster("trunk", "GreenGuard Basilisk", "GreenGuard Basilisk Tail", undefined, { log: false });
            Core.huntMonster("Well", "Gell Oh No", "Gell Oh No Jello", undefined, { log: false });
            Core.huntMonster("deathgazer", "Deathgazer", "Deathgazer Takoyaki", undefined, { log: false });
            Core.huntMonster("river", "Kuro", "Kuro Geso Karaage", undefined, { log: false });
            Core.ensureComplete(8832);
        }

        // 8833 | Preparedness Awareness
        if (!Story.questProgression(8833)) {
            Core.ensureAccept(8833);
            Core.buyItem("embersea", 1100, 1749, 25);
            Core.buyItem("embersea", 1100, 5572, 25);
            // Core.BuyItem("arcangrove", 211, "Mana Potion", 25);
            Core.huntMonster("cleric", "Chaos Dragon", "Medicinal Unguent");
            Core.ensureComplete(8833);
        }

        // 8834 | Quality Tea Time
        if (!Story.questProgression(8834)) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAccept(8834);
            if (!Core.checkInventory("Tea Cup (Mem)")) {
                giantTaleStory.doAll();
                while (!bot.shouldExit && !Core.checkInventory("Racing Trophy", 100)) {
                    Core.chainComplete(746);
                }
                Core.ensureAccept(741);
                Core.huntMonster("table", "Roach", "Gold Roach Leg", 10);
                Core.ensureComplete(741, 5401);
            }
            Core.huntMonster("sleuthhound", "Chair", "Rich Tea Leaves");
            Core.huntMonster("guru", "Wisteria", "Fragrant Wisteria Bloom");
            Core.huntMonster("hachiko", "Samurai Nopperabo", "Bitter Matcha");
            Story.killQuest(8834, "elemental", "Tree of Destiny", { getReward: false });
        }

        // 8835 | Shadowslayer Summoning Ritual
        if (!Story.questProgression(8835)) {
            if (!Core.checkInventory("ShadowSlayer's Apprentice")) {
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

            Core.ensureAccept(8835);
            Scroll.buyScroll(Scrolls.SpiritRend, 30);
            Scroll.buyScroll(Scrolls.Eclipse, 15);
            Scroll.buyScroll(Scrolls.BlessedShard, 30);
            if (!Core.checkInventory("Meat Ration")) {
                Core.ensureAccept(8263);
                Core.huntMonster("cellar", "GreenRat", "Green Mystery Meat", 10, { log: false });
                Core.ensureComplete(8263);
                bot.wait.forPickup("Meat Ration");
            }
            Core.registerQuests(8264);
            while (!bot.shouldExit && !Core.checkInventory("Grain Ration", 2)) {
                Core.killMonster("castletunnels", "r5", "Left", "Blood Maggot", "Bundle of Rice", 3, { log: false });
                bot.wait.forPickup("Grain Ration");
            }
            Core.cancelRegisteredQuests();
            if (!Core.checkInventory("Dairy Ration")) {
                Core.ensureAccept(8265);
                Core.killMonster("odokuro", "Boss", "Right", "O-dokuro", "Bone Hurt Juice", 5);
                Core.ensureComplete(8265);
                bot.wait.forPickup("Dairy Ration");
            }
            Core.ensureComplete(8835);
        }
    }

    part2(): void {
        if (Core.isCompletedBefore(9845)) {
            return;
        }

        Story.preLoad(this.part2);

        //#region Useable Monsters
        const UseableMonsters = [
            "Dire Wolf", // UseableMonsters[0],
            "Ghoul", // UseableMonsters[1],
            "Hunter", // UseableMonsters[2],
            "Tindalion Hound", // UseableMonsters[3],
            "Twisted Hunter", // UseableMonsters[4]
        ];
        //#endregion Useable Monsters
        // 9837 | Stalking Prey
        if (!Story.questProgression(9837)) {
            Core.huntMonsterQuest(9837, ["badmoon", UseableMonsters[0], ClassType.Farm]);
        }

        // 9838 | Super Creeps
        if (!Story.questProgression(9838)) {
            Core.huntMonsterQuest(9838, ["badmoon", UseableMonsters[1], ClassType.Solo]);
        }

        // 9839 | Sleepless Villagers
        Story.mapItemQuest(9839, "badmoon", Core.fromTo(13445, 13447));

        // 9840 | Suspicious Minds
        if (!Story.questProgression(9840)) {
            Core.huntMonsterQuest(
                9840,
                ["badmoon", UseableMonsters[0], ClassType.Farm],
                ["badmoon", UseableMonsters[1], ClassType.Solo],
            );
        }

        // 9841 | Get Out The Way
        if (!Story.questProgression(9841)) {
            Core.huntMonsterQuest(9841, ["badmoon", UseableMonsters[2], ClassType.Farm]);
        }

        // 9842 | Door Stuck
        if (!Story.questProgression(9842)) {
            if (!Story.questProgression(9842)) {
                Core.ensureAccept(9842);
                Core.getMapItem(13448, 3, "badmoon");
                Core.getMapItem(13449, 1, "badmoon");
                Core.huntMonster("badmoon", "Ghoul", "Pristine Phalanges", 1);
                Core.ensureComplete(9842);
            }
        }

        // 9843 | Nothing But A Hound Dog
        if (!Story.questProgression(9843)) {
            Core.huntMonsterQuest(9843, ["badmoon", UseableMonsters[3], ClassType.Solo]);
        }

        // 9844 | Coldest Regards
        if (!Story.questProgression(9844)) {
            Core.huntMonsterQuest(9844, ["badmoon", UseableMonsters[2], ClassType.Solo]);
        }

        // 9845 | No Different From Prey
        if (!Story.questProgression(9845)) {
            Core.huntMonsterQuest(9845, ["badmoon", UseableMonsters[4], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new ShadowSlayerK();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
