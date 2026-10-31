/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/ThroneofDarkness/CoreToD.cs.
// Not ported (FarmerJoe's DoAll doesn't reach them): CompleteToD, CastleofBones, BoneTowerAll, ParadoxPortal, DeepSpace, BaconCatFortress, LaserSharkInvasion, DeathPit, DeathPitPVP, FourthDimensionalPyramid, Yasaris.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class CoreToD {
    doAll = false;

    shiftingPyramid(): void {
        if (Core.isCompletedBefore(5187)) return;

        if (this.doAll) Core.logger("Sekt - The Eternal: Shifting Pyramid");
        Story.preLoad(this.shiftingPyramid);

        // Hunt for the Infinity Codex
        if (!Story.questProgression(5166)) {
            Core.ensureAccept(5166);
            Core.killMonster("whitehole", "r2", "Left", "Vortex Mage", "Infinity Text Page", 8);
            Core.ensureComplete(5166);
        }

        // Sacrific and Survival
        if (!Story.questProgression(5167)) {
            Core.ensureAccept(5167);
            Core.huntMonster("whitehole", "Vortex Naga", "Naga Slain", 3);
            Core.huntMonster("whitehole", "Vortex Hawk", "Hawk Slain", 3);
            Core.ensureComplete(5167);
        }

        // The Cartouche of Isis
        if (!Story.questProgression(5168)) {
            Core.ensureAccept(5168);
            Core.huntMonster("whitehole", "Gate Goblin", "Balm Cartouche");
            Core.ensureComplete(5168);
        }

        // The Cartouche of Ma'at
        if (!Story.questProgression(5169)) {
            Core.ensureAccept(5169);
            Core.huntMonster("whitehole", "Vortex Walker", "Scale Cartouche Fragment", 5);
            Core.ensureComplete(5169);
        }

        // Bound to Do Good
        if (!Story.questProgression(5170)) {
            Core.ensureAccept(5170);
            Core.huntMonster("whitehole", "Dimensional Crystal", "Quartz", 3);
            Core.huntMonster("whitehole", "Gate Goblin", "Lime", 2);
            Core.huntMonster("whitehole", "Vortex Matter", "Natron");
            Core.ensureComplete(5170);
        }

        // Honor the Goddess Isis
        Story.mapItemQuest(5171, "whitehole", 4539);

        // Stick to the Task
        if (!Story.questProgression(5172)) {
            Core.ensureAccept(5172);
            Core.killMonster("whitehole", "r3", "Left", "Dimensional Crystal", "Quartz", 4);
            Core.killMonster("whitehole", "r6", "Left", "Gate Goblin", "Lime", 1);
            Core.killMonster("whitehole", "r10", "Left", "Vortex Matter", "Ash", 3);
            Core.ensureComplete(5172);
        }

        // Honor the Goddess Ma'at
        Story.mapItemQuest(5173, "whitehole", 4540, 4);
        Story.mapItemQuest(5173, "whitehole", 4542);

        // Duty is light as a feather
        if (!Story.questProgression(5174)) {
            Core.ensureAccept(5174);
            Core.huntMonster("whitehole", "Vortex Hawk", "Feather of Ma'at");
            Core.ensureComplete(5174);
        }

        // Judgement... or Justice?
        if (!Story.questProgression(5175)) {
            Core.ensureAccept(5175);
            Core.huntMonster("whitehole", "Hand of Ma'at", "Judgement Passed");
            Core.ensureComplete(5175);
        }

        // The Cartouche of Thoth
        if (!Story.questProgression(5176)) {
            Core.ensureAccept(5176);
            Core.huntMonster("whitehole", "Vortex Mage", "Scroll Cartouche");
            Core.ensureComplete(5176);
        }

        // Make Your Mark
        Story.mapItemQuest(5177, "whitehole", 4541, 4);

        // The Cartouche of Kebechet
        if (!Story.questProgression(5178)) {
            Core.ensureAccept(5178);
            Core.huntMonster("whitehole", "Vortex Naga", "Cartouche Fragment", 6);
            Core.ensureComplete(5178);
        }

        // Honor the Goddess Kebechet
        Story.mapItemQuest(5179, "whitehole", 4543);

        // Destroy to Purify
        if (!Story.questProgression(5180)) {
            Core.ensureAccept(5180);
            Core.huntMonster("whitehole", "Vortex Crystal", "Natron", 5);
            Core.ensureComplete(5180);
        }

        // Guardian of the Vortex
        if (!Story.questProgression(5181)) {
            Core.ensureAccept(5181);
            Core.huntMonster("whitehole", "Vortex Guardian", "Guardian Slain");
            Core.ensureComplete(5181);
        }

        // Stick with it
        if (!Story.questProgression(5182)) {
            Core.ensureAccept(5182);
            Core.huntMonster("whitehole", "Dimensional Crystal", "Quartz", 2);
            Core.huntMonster("whitehole", "Gate Goblin", "Lime", 4);
            Core.huntMonster("whitehole", "Vortex Matter", "Ash", 1);
            Core.ensureComplete(5182);
        }

        // Honor the God Thoth
        Story.mapItemQuest(5183, "whitehole", 4544);

        // The Brightest Cartouches
        if (!Story.questProgression(5184)) {
            Core.ensureAccept(5184);
            Core.huntMonster("whitehole", "Dimensional Crystal", "Sun Cartouche");
            Core.huntMonster("whitehole", "Dimensional Crystal", "Sky Cartouche");
            Core.huntMonster("whitehole", "Vortex Matter", "Star Cartouche");
            Core.huntMonster("whitehole", "Vortex Crystal", "Moon Cartouche");
            Core.ensureComplete(5184);
        }

        // Honor the Astral Deities
        Story.mapItemQuest(5185, "whitehole", 4545, 4);

        // Serpent of the Stars
        if (!Story.questProgression(5186)) {
            Core.ensureAccept(5186);
            Core.huntMonster("whitehole", "Mehensi Serpent", "Mehen Slain");
            Core.ensureComplete(5186);
        }

        // The Infinity Shield
        Story.mapItemQuest(5187, "whitehole", 4546);
    }

    shatterGlassMaze(): void {
        if (Core.isCompletedBefore(5313)) return;

        if (this.doAll) Core.logger("Scarletta - The Sorceress: ShatterGlass Maze");
        Story.preLoad(this.shatterGlassMaze);

        if (!Story.questProgression(5298)) {
            Core.ensureAccept(5298);
            Core.getMapItem(4678, 1, "hedgemaze");

            Core.huntMonster("hedgemaze", "Knight's Reflection", "Knight's Reflection Dispersed", 1);
            Core.ensureComplete(5298);
        }

        Core.equipClass(ClassType.Solo);
        if (!Story.questProgression(5299)) {
            Core.ensureAccept(5299);
            Core.huntMonster("hedgemaze", "Mirrored Shard", "Mirror Shard Slain", 4);
            Core.huntMonsterMapID("hedgemaze", 48, "Hedge Goblin Slain", 4);
            Core.huntMonsterMapID("hedgemaze", 20, "Minotaur Slain", 3);
            Story.mapItemQuest(5299, "hedgemaze", 4679);
        }

        Story.killQuest(5300, "hedgemaze", "Knight's Reflection");

        Story.mapItemQuest(5301, "hedgemaze", 4680);

        Story.killQuest(5302, "hedgemaze", "Hedge Goblin");

        Story.mapItemQuest(5303, "hedgemaze", 4681, 12);

        Story.killQuest(5304, "hedgemaze", "Mirrored Shard");

        Story.mapItemQuest(5305, "hedgemaze", 4682);

        Core.equipClass(ClassType.Solo);
        Story.killQuest(5306, "hedgemaze", "Minotaur Prime");

        Story.mapItemQuest(5307, "hedgemaze", 4683);

        Story.mapItemQuest(5308, "hedgemaze", 4684);

        Story.mapItemQuest(5309, "hedgemaze", 4685, 5);

        if (!Story.questProgression(5310)) {
            Core.ensureAccept(5310);
            Core.killMonster("hedgemaze", "r21", "Right", "*", "Maze Monster Killed", 8);
            Core.ensureComplete(5310);
        }

        Story.mapItemQuest(5311, "hedgemaze", 4686);

        Core.equipClass(ClassType.Solo);
        Story.killQuest(5312, "hedgemaze", "Shattered Knight");

        Story.killQuest(5313, "hedgemaze", "Resurrected Minotaur");
    }

    towerofMirrors(): void {
        if (Core.isCompletedBefore(5332)) return;

        Core.logger(`${Core.soloClass}, ${Core.farmClass}`);

        this.shatterGlassMaze();

        if (this.doAll) Core.logger("Scarletta - The Sorceress: Tower of Mirrors");
        Story.preLoad(this.towerofMirrors);

        // Drink Me
        if (!Story.questProgression(5314)) {
            Core.ensureAccept(5314);
            Core.huntMonster("towerofmirrors", "Glassgoyle", "Glass Powder", 8);
            Core.huntMonster("towerofmirrors", "Glass Serpent", "Reflective Venom", 4);
            Core.ensureComplete(5314);
        }

        // The Key To Success
        if (!Story.questProgression(5315)) {
            Core.ensureAccept(5315);
            Core.getMapItems(
                [
                    [4691, 1],
                    [4692, 1],
                ],
                "towerofmirrors",
            );
            Core.huntMonster("towerofmirrors", "Silver Elemental", "Mirror Key", 1);
            Core.ensureComplete(5315);
        }

        // Phanatics
        if (!Story.questProgression(5316)) {
            Core.ensureAccept(5316);
            Core.huntMonster("towerofmirrors", "Phans", "Mosh Past the Phans", 8);
            Core.huntMonster("towerofmirrors", "Phans", "Backstage Pass", 1);
            Core.ensureComplete(5316);
        }

        // But I Have A Backstage Pass!
        if (!Story.questProgression(5317)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(5317);
            Core.huntMonsterMapID("towerofmirrors", 36, "Lathannos the Reversed Defeated");
            Core.ensureComplete(5317);
        }

        // True Love
        if (!Story.questProgression(5318)) {
            Core.ensureAccept(5318);
            Core.getMapItems(
                [
                    [4687, 1],
                    [4693, 1],
                ],
                "towerofmirrors",
            );
            Core.huntMonster("towerofmirrors", "Silver Elemental", "Andres' Mirror Key", 1);
            Core.ensureComplete(5318);
        }

        // Turn to the Left
        if (!Story.questProgression(5319)) {
            Core.ensureAccept(5319);
            Core.huntMonster("towerofmirrors", "Runway Wraith", "Runway Wraith Defeated", 6);
            Core.huntMonster("towerofmirrors", "Runway Wraith", "Avant-Garde Footwear", 1);
            Core.huntMonster("towerofmirrors", "Runway Wraith", "Retro Wig", 1);
            Core.huntMonster("towerofmirrors", "Runway Wraith", "Someone's Wearable Art Project", 1);
            Core.ensureComplete(5319);
        }

        // Now Turn to the Right
        if (!Story.questProgression(5320)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(5320);
            Core.huntMonsterMapID("towerofmirrors", 40, "Lukrisio the Buffed Defeated");
            Core.ensureComplete(5320);
        }

        // Or Maybe THIS Is True Love
        if (!Story.questProgression(5321)) {
            Core.ensureAccept(5321);
            Core.getMapItems(
                [
                    [4688, 1],
                    [4694, 1],
                ],
                "towerofmirrors",
            );
            Core.huntMonster("towerofmirrors", "Silver Elemental", "Gisele's Mirror Key", 1);
            Core.ensureComplete(5321);
        }

        // Those Harpies!
        if (!Story.questProgression(5322)) {
            Core.ensureAccept(5322);
            Core.huntMonster("towerofmirrors", "Pageant Mom", "Pageant Mom Defeated", 8);
            Core.huntMonster("towerofmirrors", "Pageant Mom", "Pageant Sash", 1);
            Core.ensureComplete(5322);
        }

        // Drink your Go-Go Juice
        if (!Story.questProgression(5323)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(5323);
            Core.huntMonsterMapID("towerofmirrors", 45, "Mendeskar the Smudged Defeated");
            Core.ensureComplete(5323);
        }

        // Oh Sure, Why Not
        if (!Story.questProgression(5324)) {
            Core.ensureAccept(5324);
            Core.getMapItems(
                [
                    [4689, 1],
                    [4695, 1],
                ],
                "towerofmirrors",
            );
            Core.huntMonster("towerofmirrors", "Silver Elemental", "Emilia's Mirror Key", 1);
            Core.ensureComplete(5324);
        }

        // Behind the Scenes
        if (!Story.questProgression(5325)) {
            Core.ensureAccept(5325);
            Core.huntMonster("towerofmirrors", "Stage Tech", "Stage Tech Defeated", 9);
            Core.huntMonster("towerofmirrors", "Stage Tech", "Rope Ladder");
            Core.ensureComplete(5325);
        }

        // In the Spotlight
        if (!Story.questProgression(5326)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(5326);
            Core.huntMonsterMapID("towerofmirrors", 49, "Atticus the Warped Defeated");
            Core.ensureComplete(5326);
        }

        // Oh, I Give Up
        if (!Story.questProgression(5327)) {
            Core.ensureAccept(5327);
            Core.getMapItems(
                [
                    [4690, 1],
                    [4696, 1],
                ],
                "towerofmirrors",
            );
            Core.huntMonster("towerofmirrors", "Silver Elemental", "Dora's Mirror Key", 1);
            Core.ensureComplete(5327);
        }

        // We Gotta Wendi-GO
        if (!Story.questProgression(5328)) {
            Core.ensureAccept(5328);
            Core.huntMonster("towerofmirrors", "Sasquatch", "Sasquatches Defeated", 10);
            Core.huntMonster("towerofmirrors", "Sasquatch", "Tracking Tag", 5);
            Core.ensureComplete(5328);
        }

        // Kick His- Wait, Did We Already Use That Pun?
        if (!Story.questProgression(5329)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(5329);
            Core.huntMonsterMapID("towerofmirrors", 52, "Leofire the Shattered Defeated");
            Core.ensureComplete(5329);
        }

        // Fiend Zoned
        Story.killQuest(5330, "towerofmirrors", "Fervent Suitor");

        // Find Scarletta
        Story.mapItemQuest(5331, "towerofmirrors", 4697);

        bot.wait.forCellChange("Cut4");
        while (!bot.shouldExit && bot.player.cell !== "Enter") {
            Core.jump();
            Core.sleep();
        }

        // Defeat ... Wait. What?
        if (!Story.questProgression(5332)) {
            Core.addDrop("Blood Sorceress");
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(5332);
            Core.huntMonsterMapID("towerofmirrors", 32, "Defeat the Groglurk");
            Core.ensureComplete(5332);
        }
    }

    antiqueShop(): void {
        if (Core.isCompletedBefore(5434)) return;

        if (this.doAll) Core.logger("??? - The Stranger: Antique Shop");
        Story.preLoad(this.antiqueShop);

        //cursed artifact shop - 5428
        Story.mapItemQuest(5428, "cursedshop", 4803);

        //lamps, painting and chairs, oh my!
        Story.killQuest(5429, "cursedshop", "Antique Chair");

        //the (un)Dresser
        Story.killQuest(5430, "cursedshop", "UnDresser");

        //ghost stories
        Story.killQuest(5431, "cursedshop", "Writing Desk");

        //you can't tell time
        Story.killQuest(5432, "cursedshop", "Grandfather Clock");

        //Dr. Darkwood's Robe
        Story.mapItemQuest(5433, "cursedshop", [4804, 4805]);

        //defeat the arcane sentinel
        if (!Story.questProgression(5434)) {
            Core.ensureAccept(5434);
            Core.getMapItem(4806, 1, "cursedshop");
            Core.huntMonster("cursedshop", "Arcane Sentinel", "Darkwood's Robe", 1);
            Core.ensureComplete(5434);
        }
    }

    mysteriousDungeon(): void {
        if (Core.isCompletedBefore(5451)) return;

        this.antiqueShop();

        if (this.doAll) Core.logger("??? - The Stranger: Mysterious Dungeon");
        Story.preLoad(this.mysteriousDungeon);

        //cursed artifact shop - 5428
        Story.mapItemQuest(5428, "cursedshop", 4803);

        //lamps, painting and chairs, oh my!
        Story.killQuest(5429, "cursedshop", "Antique Chair");

        //the (un)Dresser
        Story.killQuest(5430, "cursedshop", "UnDresser");

        //ghost stories
        Story.killQuest(5431, "cursedshop", "Writing Desk");

        //you can't tell time
        Story.killQuest(5432, "cursedshop", "Grandfather Clock");

        //Dr. Darkwood's Robe
        Story.mapItemQuest(5433, "cursedshop", [4804, 4805]);

        //defeat the arcane sentinel
        if (!Story.questProgression(5434)) {
            Core.ensureAccept(5434);
            Core.getMapItem(4806, 1, "cursedshop");
            Core.huntMonster("cursedshop", "Arcane Sentinel", "Darkwood's Robe", 1);
            Core.ensureComplete(5434);
        }

        //Get Out Of Jail Free?
        Story.mapItemQuest(5438, "MysteriousDungeon", 4818);

        //Sorry, Skudly
        Story.killQuest(5439, "MysteriousDungeon", "Skudly");

        //A Friend In Need
        Story.mapItemQuest(5440, "MysteriousDungeon", 4808);

        //A Cryptic Messaage
        Story.mapItemQuest(5441, "MysteriousDungeon", 4809);

        //seeking answers
        Story.mapItemQuest(5442, "MysteriousDungeon", [4810, 4811, 4812, 4813, 4814, 4815, 4816]);

        //Curses!
        Story.mapItemQuest(5443, "MysteriousDungeon", 4817);

        //Skudly, Staaaahp!
        Story.killQuest(5444, "MysteriousDungeon", "Skudly");

        // Not So Mysterious After All
        Story.killQuest(5445, "MysteriousDungeon", "Mysterious Stranger");

        // Shut Up And Listen, Vaden!
        Story.killQuest(5446, "MysteriousDungeon", "Vaden", { autoCompleteQuest: false });

        // Shut Up And Listen, Xeight!
        Story.killQuest(5447, "MysteriousDungeon", "Xeight", { autoCompleteQuest: false });

        // Shut Up And Listen, Ziri
        Story.killQuest(5448, "MysteriousDungeon", "Ziri", { autoCompleteQuest: false });

        // Shut Up And Listen, Pax!
        Story.killQuest(5449, "MysteriousDungeon", "Pax", { autoCompleteQuest: false });

        // Shut Up And Listen, Sekt!
        Story.killQuest(5450, "MysteriousDungeon", "Sekt", { autoCompleteQuest: false });

        // Shut Up And Listen, Groglurk!
        Story.killQuest(5451, "MysteriousDungeon", "Scarletta", { autoCompleteQuest: false });
    }

    boneTowerAll(): void {
        if (!Core.isMember || Core.isCompletedBefore(5022)) {
            return;
        }

        if (this.doAll) {
            Core.logger("Vaden - The DeathKnight: Bone Tower (Silver)");
        }
        Story.preLoad(this.boneTowerAll);
        this.castleofBones();

        // Eye Sp-eye
        Story.killQuest(4996, "towersilver", "Flying Spyball");

        // Stone Cold
        Story.killQuest(4997, "towersilver", "Fallen Emperor Statue");

        // Slay 'Em All
        Story.killQuest(4999, "towersilver", ["Undead Knight", "Undead Guard"]);

        // Slay 'Em All Again
        Story.killQuest(4998, "towersilver", ["Fallen DeathKnight", "Undead Warrior"]);

        // Farming For Loot
        Story.killQuest(5000, "towersilver", [
            "Flying Spyball",
            "Fallen DeathKnight",
            "Undead Warrior",
            "Undead Knight",
            "Undead Guard",
        ]);

        // Or... Not.
        Story.mapItemQuest(5001, "towersilver", [4368, 4369, 4370, 4371, 4372]);

        // Mirror, Mirror
        Story.mapItemQuest(5002, "towersilver", 4373, 3);

        // Bloody Scary
        Story.killQuest(5003, "towersilver", "Bloody Scary");

        // Just Nasty
        Story.killQuest(5004, "towersilver", "Bone Creeper");

        // Scavenger Hunt
        Story.killQuest(5005, "towersilver", "Ghoul");

        // Ghoul Booty
        Story.mapItemQuest(5006, "towersilver", 4374, 5);

        // Flester's Guards
        Story.killQuest(5007, "towersilver", "Undead Golden Knight");

        // Flester the Silver
        Story.killQuest(5008, "towersilver", "Flester The Silver");

        // Get my Stuff
        Story.killQuest(5009, "towersilver", [
            "Fallen DeathKnight",
            "Undead Knight",
            "Undead Warrior",
            "Ghoul",
            "Undead Guard",
        ]);

        // In the Mix
        Story.killQuest(5010, "towersilver", "Bloody Scary");

        // They Know We're Coming
        Story.killQuest(5011, "towergold", "Grim Souldier");

        // Elitist Jerks
        Story.killQuest(5012, "towergold", "Undead Golden Knight");

        // Loot, Hero!
        Story.mapItemQuest(5013, "towergold", 4375, 5);
        Story.killQuest(5013, "towergold", "Skullspider");

        // Those Aren't Big Birds, Sweetheart
        Story.killQuest(5014, "towergold", "Vampire Bat");

        // The Nope Room
        Story.killQuest(5015, "towergold", "Webbed Ghoul");

        // Arach-NO-phobia
        Story.killQuest(5016, "towergold", "Bone Widow");

        // Library Infestation
        Story.killQuest(5017, "towergold", "Book Maggot");

        // Creepy!
        Story.mapItemQuest(5018, "towergold", 4376, 6);
        Story.killQuest(5018, "towergold", "Bone Creeper");

        // It's Not Like They Need Them Anymore
        Story.mapItemQuest(5019, "towergold", 4377, 3);

        // Advanced Self Defense
        Story.killQuest(5020, "towergold", ["Undead Knight", "Undead Guard"]);

        // Take A Mallet To 'Em
        Story.killQuest(5021, "towergold", "Fallen Emperor Statue");

        // Yurrod the Gold
        Story.killQuest(5022, "towergold", "Yurrod the Gold");
    }

    deepSpace(): void {
        if (!Core.isMember || Core.isCompletedBefore(5083)) {
            return;
        }

        if (this.doAll) {
            Core.logger("Xeven - The Time Assassin: Paradox Portal");
        }
        Story.preLoad(this.deepSpace);

        this.paradoxPortal();

        // The Western Portal
        Story.mapItemQuest(5068, "tachyon", 4446);
        Story.killQuest(5068, "tachyon", ["Time Wraith", "Timestream Rider"]);

        // This Thing Needs A Bigger Battery
        Story.killQuest(5069, "tachyon", "Spacetime Anomaly");

        // Deserted
        Story.mapItemQuest(5072, "tachyon", 4447, 4);
        Story.killQuest(5072, "tachyon", ["Sandshark", "Bupers Camel"]);

        // Getting Sand In Your Boots
        Story.mapItemQuest(5073, "tachyon", 4448);

        // The Eastern Portal
        Story.mapItemQuest(5074, "tachyon", 4449);
        Story.killQuest(5074, "tachyon", ["Time Wraith", "Timestream Rider"]);

        // Time for a Tune-Up
        Story.killQuest(5075, "tachyon", "Medusoid");

        // Time Void Archaeology
        Story.mapItemQuest(5076, "tachyon", 4450, 3);
        Story.mapItemQuest(5076, "tachyon", 4451, 3);
        Story.killQuest(5076, "tachyon", ["Jungle Tog", "Jungle Fury"]);

        // Going With the Flow
        Story.mapItemQuest(5077, "tachyon", 4452);

        // The Central Portal
        Story.mapItemQuest(5078, "tachyon", 4453);
        Story.killQuest(5078, "tachyon", ["Time Wraith", "Timestream Rider"]);

        // Is There Tech Support For This Thing?
        Story.killQuest(5079, "tachyon", "Void Serpent");

        // Shovelling Snow
        Story.mapItemQuest(5080, "tachyon", 4454, 5);
        Story.killQuest(5080, "tachyon", ["Ice Wolf", "Polar Elemental"]);

        // Winter Winds
        Story.mapItemQuest(5081, "tachyon", 4455);

        // Opening the Megaportal
        Story.mapItemQuest(5082, "tachyon", 4456);

        // Svelgr the Devourer
        Story.killQuest(5083, "tachyon", "Svelgr the Devourer");
    }

    fourthDimensionalPyramid(): void {
        if (Core.isCompletedBefore(5212)) {
            return;
        }

        if (this.doAll) {
            Core.logger("Sekt - The Eternal: Fourth Dimensional Pyramid");
        }
        Story.preLoad(this.fourthDimensionalPyramid);

        // Eye for an Eye of the Old Gods
        Core.equipClass(ClassType.Solo);
        Story.killQuest(5189, "fourdpyramid", "Sekt");

        // Hounded by History
        Core.equipClass(ClassType.Farm);
        Story.killQuest(5190, "fourdpyramid", "Negastri Hound");

        // Stand and De-Lever
        Story.mapItemQuest(5191, "fourdpyramid", 4556, 1);

        // Yo Mummy
        Core.equipClass(ClassType.Solo);
        if (!Story.questProgression(5192)) {
            Core.ensureAccept(5192);
            Core.getMapItem(4557, 1, "fourdpyramid");
            Core.huntMonster("fourdpyramid", "Sekt's Mummy", "Mummy Grease", 1);
            Core.ensureComplete(5192);
        }

        // Find the Secret Brick
        Story.mapItemQuest(5193, "fourdpyramid", 4558, 1);

        // Gauze in 60 Seconds
        Core.equipClass(ClassType.Farm);
        Story.killQuest(5194, "fourdpyramid", "Nega Mummy");

        // De-Lever-ence
        Story.mapItemQuest(5195, "fourdpyramid", 4559, 1);

        // A Jarring Solution
        if (!Story.questProgression(5196)) {
            Core.ensureAccept(5196);
            Core.getMapItem(4560, 1, "fourdpyramid");
            Core.huntMonster("fourdpyramid", "Nega Mummy", "Canopic Jar", 1);
            Core.huntMonster("fourdpyramid", "Guardian of Anubyx", "Tesseract Energy", 5);
            Core.ensureComplete(5196);
        }

        // Ra of Light
        Story.mapItemQuest(5197, "fourdpyramid", 4561, 1);

        // Sphynxes are Riddled With Gems
        if (!Story.questProgression(5198)) {
            Core.ensureAccept(5198);
            Core.huntMonsterMapID("fourdpyramid", 19, "White Gem", 2);
            Core.huntMonsterMapID("fourdpyramid", 20, "Black Gem", 2);
            Core.ensureComplete(5198);
        }

        // 4th Dimensional Teleport
        Story.mapItemQuest(5199, "fourdpyramid", 4562, 4);
        Story.mapItemQuest(5199, "fourdpyramid", 4564, 1);

        // Mummies vs Daddies
        Story.killQuest(5200, "fourdpyramid", "Nega Mummy");

        // The Tesseract
        Story.killQuest(5201, "fourdpyramid", "Guardian of Anubyx");

        // Another Mystery To Solve
        Story.mapItemQuest(5202, "fourdpyramid", 4565, 1);

        // Whose Skeleton Is This?
        Story.mapItemQuest(5203, "fourdpyramid", 4566, 1);

        // Fourth Scrap of the Propechy
        Story.mapItemQuest(5204, "fourdpyramid", 4567, 1);

        // Fighting in 4D
        if (!Story.questProgression(5205)) {
            Core.ensureAccept(5205);
            Core.getMapItem(4568, 1, "fourdpyramid");
            Core.huntMonster("fourdpyramid", "Tesseract Sprite", "Tesseract Sprites", 8);
            Core.ensureComplete(5205);
        }

        // Lever-age
        Story.mapItemQuest(5206, "fourdpyramid", 4569, 1);

        // 4D Goblins?
        if (!Story.questProgression(5207)) {
            Core.ensureAccept(5207);
            Core.getMapItem(4570, 1, "fourdpyramid");
            Core.huntMonster("fourdpyramid", "Tesseract Goblin", "Goblin Tools", 4);
            Core.ensureComplete(5207);
        }

        // Stone Sphynx Gems
        if (!Story.questProgression(5208)) {
            Core.ensureAccept(5208);
            Core.huntMonsterMapID("fourdpyramid", 19, "White Gem", 1);
            Core.huntMonsterMapID("fourdpyramid", 20, "Black Gem", 3);
            Core.ensureComplete(5208);
        }

        // Beam Me Up Scotty;
        Story.mapItemQuest(5209, "fourdpyramid", 4571, 4);
        Story.mapItemQuest(5209, "fourdpyramid", 4572, 1);

        // Sekt... Again
        Story.mapItemQuest(5210, "fourdpyramid", 4573, 1);

        // The Black Plague
        Core.equipClass(ClassType.Solo);
        Story.killQuest(5211, "fourdpyramid", "Black Plague");

        // The Hero's Doom
        Story.mapItemQuest(5212, "fourdpyramid", 4574, 1);
    }

    //#region Vaden - The DeathKnight
    castleofBones(): void {
        if (Core.isCompletedBefore(4992)) {
            return;
        }

        if (this.doAll) {
            Core.logger("Vaden - The DeathKnight: Castle of Bones");
        }
        Story.preLoad(this.castleofBones);

        // Enter the Castle of Bone
        Story.killQuest(4968, "bonecastle", "Undead Guard");

        // Slay Vaden's Undead Guards
        Story.killQuest(4969, "bonecastle", "Undead Guard");

        // Destroyer in the Foyer
        Story.killQuest(4970, "bonecastle", "Undead Knight");

        // Help! I'm a Fallen Lord and I Can't Get Up!
        if (bot.player.cell !== "r4") {
            Core.jump("r4", "Left");
        }
        //cutscene issues...?
        Story.killQuest(4971, "bonecastle", "Fallen Deathknight");

        // Gem-nastics
        if (!Story.questProgression(4972)) {
            Core.ensureAccept(4972);
            Core.getMapItem(4342, 3, "bonecastle");
            Core.huntMonster("bonecastle", "Fallen Deathknight", "Necrogem", 3);
            Core.ensureComplete(4972);
        }

        // Bone Appetit
        Story.killQuest(4973, "bonecastle", "Undead Waiter");

        // The Walking Bread
        if (!Story.questProgression(4974)) {
            Core.ensureAccept(4974);
            Core.getMapItem(4343, 2, "bonecastle");
            Core.getMapItem(4344, 2, "bonecastle");
            Core.getMapItem(4345, 3, "bonecastle");
            Core.huntMonster("bonecastle", "Undead Knight", "Knight's Fork", 1);
            Core.ensureComplete(4974);
        }

        // Ghoul-ash
        Story.killQuest(4975, "bonecastle", "Ghoul");

        // The Butcher
        Story.killQuest(4976, "bonecastle", "The Butcher");

        // Lean Mean Undead Slaying Machine
        Story.killQuest(4977, "bonecastle", "Skeletal Warrior");

        // Moar Loot
        if (!Story.questProgression(4978)) {
            Core.ensureAccept(4978);
            Core.getMapItems(
                [
                    [4346, 1],
                    [4347, 1],
                    [4348, 1],
                ],
                "bonecastle",
            );
            Core.huntMonster("bonecastle", "Skeletal Warrior", "Warrior's Screwdriver", 1);
            Core.ensureComplete(4978);
        }

        // Putting Your Hands All over Everything
        if (!Story.questProgression(4979)) {
            Core.ensureAccept(4979);
            Core.getMapItems(
                [
                    [4349, 1],
                    [4350, 1],
                    [4351, 1],
                ],
                "bonecastle",
            );
            Core.huntMonster("bonecastle", "Skeletal Warrior", "Warrior's Dusting Rag", 1);
            Core.ensureComplete(4979);
        }

        // Paladin Rock
        if (!Story.questProgression(4980)) {
            Core.ensureAccept(4980);
            Core.getMapItems(
                [
                    [4354, 1],
                    [4355, 1],
                ],
                "bonecastle",
            );
            Core.huntMonster("bonecastle", "Grateful Undead", "Song Request Ticket", 5);
            Core.huntMonster("bonecastle", "That 70's Zombie", "Sweet Dancing Shoes", 2);
            Core.ensureComplete(4980);
        }

        // Do You Find This Humerus?
        if (!Story.questProgression(4981)) {
            Core.ensureAccept(4981);
            Core.killMonster("bonecastle", "r8", "Left", "Skeletal Warrior", "Undead Humerus Bones", 5);
            Core.ensureComplete(4981);
        }

        // Vaden Says
        if (!Story.questProgression(4982)) {
            Core.ensureAccept(4982);
            Core.killMonster("bonecastle", "Enter", "Spawn", "Undead Guard", "Yellow, Green");
            Core.killMonster("bonecastle", "r3", "Bottom", "Undead Knight", "Red, Red");
            Core.killMonster("bonecastle", "r8", "Left", "Skeletal Warrior", "Blue, Green, Red");
            Core.ensureComplete(4982);
        }

        // The Dead King's Bedroom
        Story.mapItemQuest(4983, "bonecastle", 4352);

        // Game of Porcelain Thrones
        Story.mapItemQuest(4984, "bonecastle", 4353, 4);

        // Teenage Mutant Sewer Turtles
        Story.killQuest(4985, "bonecastle", "Turtle");

        // Adolescent Inhuman Samurai Reptiles
        if (!Story.questProgression(4986)) {
            Core.ensureAccept(4986);
            Core.huntMonster("bonecastle", "Turtle", "Dali's Bo", 1);
            Core.huntMonster("bonecastle", "Turtle", "Basquiat's Sai", 2);
            Core.huntMonster("bonecastle", "Turtle", "Warhol's Nunchaku", 1);
            Core.huntMonster("bonecastle", "Turtle", "Picasso's Katanas", 2);
            Core.ensureComplete(4986);
        }

        // Snuggles!
        Story.killQuest(4987, "bonecastle", "Snuggles, Torturer");

        // Game of Bones
        if (!Story.questProgression(4988)) {
            Core.ensureAccept(4988);
            Core.huntMonster("bonecastle", "Jon Bones", "Jon Bones' Cape", 1);
            Core.huntMonster("bonecastle", "Oberon Marrowtell", "Oberon Marrowtell's Armor", 1);
            Core.huntMonster("bonecastle", "Baskerville", "Baskerville's Helmet", 1);
            Core.huntMonster("bonecastle", "Knight of Lichens", "Knight of Lichens' Lance", 1);
            Core.ensureComplete(4988);
        }

        // Rot Tin Tin!
        Story.killQuest(4989, "bonecastle", "Rot Tin Tin");

        // Gold Digger
        if (!Story.questProgression(4990)) {
            Core.ensureAccept(4990);
            Core.huntMonster("bonecastle", "Undead Golden Knight", "Vaden's Gold", 50);
            Core.huntMonster("bonecastle", "Undead Golden Knight", "Gold Skull", 10);
            Core.huntMonster("bonecastle", "Undead Golden Knight", "Crystal Skull", 1);
            Core.ensureComplete(4990);
        }

        // Gotta Hand It To Ya
        if (!Story.questProgression(4991)) {
            Core.ensureAccept(4991);
            Core.huntMonster("bonecastle", "Undead Knight", "Knight Defeated", 5);
            Core.huntMonster("bonecastle", "Skeletal Warrior", "Warrior Defeated", 5);
            Core.ensureComplete(4991);
        }

        // Vaden's Defeat
        Story.killQuest(4992, "bonecastle", "Vaden");
    }

    //#endregion
    //#region Xeven  - The Time Assassin
    paradoxPortal(): void {
        if (Core.isCompletedBefore(5050)) {
            return;
        }

        if (this.doAll) {
            Core.logger("Xeven - The Time Assassin: Paradox Portal");
        }
        Story.preLoad(this.paradoxPortal);

        // Through the Portal!
        Story.killQuest(5034, "portalmaze", "Time Wraith");

        // Red Alert
        Story.killQuest(5035, "portalmaze", "Heavy Lab Guard");

        // Bugs... They Give Me Hives
        Story.killQuest(5036, "portalmaze", "Hatchling");

        // Through the Delta V Portal!
        Story.killQuest(5037, "portalmaze", "Time Wraith");

        // Hwoounga? Unf!
        Story.killQuest(5038, "portalmaze", "Jurassic Monkey");

        // They're Firin' Their LAZORS
        Story.killQuest(5039, "portalmaze", "Lazor Dino");

        // Through the Jurassic Portal!
        Story.killQuest(5040, "portalmaze", "Time Wraith");

        // Where's Twilly?!?
        Story.mapItemQuest(5041, "portalmaze", [4408, 4409, 4410]);

        // Through the Yulgar Portal!
        Story.killQuest(5042, "portalmaze", "Time Wraith");

        // Ode to the Walkers
        Story.killQuest(5043, "portalmaze", "Bucket Zombie");

        // Sonnet of the Undead
        if (!Story.questProgression(5044)) {
            Core.ensureAccept(5044);
            Core.huntMonster("portalmaze", "Bucket Zombie", "Rain Bucket", 1);
            Core.huntMonster("portalmaze", "Dancing Zombie", "Coral's Sunglasses", 1);
            Core.huntMonster("portalmaze", "Tunneling Zombie", "Grick's Pickaxe", 1);
            Core.ensureComplete(5044);
        }

        // Through the Zombie Portal!
        Story.killQuest(5045, "portalmaze", "Time Wraith");

        // Your Lips Are Sealed
        Story.killQuest(5046, "portalmaze", "Pactagonal Knight");

        // Through the Swordhaven Portal!
        Story.killQuest(5047, "portalmaze", "Time Wraith");

        // Escape from the ChronoLords
        Story.killQuest(5048, "portalmaze", "ChronoLord");

        // Vorefax
        Story.killQuest(5049, "portalmaze", "Vorefax ");

        // The Death of Time
        Story.killQuest(5050, "portalmaze", "Mors Temporis");
    }
}
