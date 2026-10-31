/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/ThroneofDarkness/CoreToD.cs.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();
const Farm = new CoreFarms();

export class CoreToD {
    doAll = false;

    completeToD(SkipDPRepStorys = false): void {
        let questIDs = [4992, 5050, 5108, 5120, 5154, 5165, 5187, 5212, 5313, 5332, 5434, 5451];
        if (Core.isMember) {
            questIDs = [...questIDs, ...[5010, 5022, 5083]];
        }
        Core.ensureLoadMany(...questIDs);
        if (questIDs.every((x) => Core.isCompletedBefore(x))) {
            return;
        }

        Story.preLoad(this.completeToD);
        this.doAll = true;

        //Vaden - The DeathKnight
        this.castleofBones();
        this.boneTowerAll();

        //Xeven - The Time Assassin
        this.paradoxPortal();
        this.deepSpace();

        //Ziri - The Daimon
        this.baconCatFortress();
        this.laserSharkInvasion();

        //Pax - The Warlord
        if (!SkipDPRepStorys) {
            this.deathPit();
            this.deathPitPVP();
        }

        //Sekt - The Eternal
        this.shiftingPyramid();
        this.fourthDimensionalPyramid();
        this.yasaris();

        //Scarletta - The Sorceress
        this.shatterGlassMaze();
        this.towerofMirrors();

        //??? - The Stranger
        this.antiqueShop();
        this.mysteriousDungeon();
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

    //#endregion
    //#region Ziri - The Daimon
    baconCatFortress(): void {
        if (Core.isCompletedBefore(5108)) {
            return;
        }

        if (this.doAll) {
            Core.logger("Ziri - The Daimon: BaconCat Fortress");
        }
        Story.preLoad(this.baconCatFortress);

        // How Rude!
        Story.mapItemQuest(5087, "baconcat", 4466, 7);

        // Bar Fight!
        Story.killQuest(5088, "baconcat", "Yulgar Regular");

        // Number Two
        Story.mapItemQuest(5089, "baconcat", 4467, 1);
        Story.killQuest(5089, "baconcat", "Yulgar Regular");

        // Forget the Mess
        Story.killQuest(5090, "baconcat", "Slime");

        // The Chosen One!
        Story.mapItemQuest(5091, "baconcat", 4473, 1);

        // BACON PIZZA!
        Story.killQuest(5092, "baconcat", ["Baconcatzard", "Pizzacatzard"]);

        // No More Clowns!
        if (!Story.questProgression(5093)) {
            Core.ensureAccept(5093);
            Core.huntMonsterMapID("baconcat", 26, "Scary Face Paint!", 10);
            Core.huntMonsterMapID("baconcat", 26, "Honking Clown Nose", 3);
            Core.huntMonsterMapID("baconcat", 26, "Rainbow Wig", 3);
            Core.ensureComplete(5093);
        }

        // Life's a Beach
        Story.mapItemQuest(5094, "baconcat", 4468, 9);

        // Not all Sand is Cat Litter
        Story.killQuest(5095, "baconcat", ["Fart Elemental", "Litter Elemental"]);

        // King Strong
        Story.killQuest(5096, "baconcat", ["King Strong", "Box", "King Strong"]);

        // Snack Man!
        Story.mapItemQuest(5097, "baconcat", 4469, 4);

        // Ghost Busting
        if (!Story.questProgression(5098)) {
            Core.ensureAccept(5098);
            Core.join("baconcat", "r11a", "Left");
            Core.logger("Cutscene may have appeared... `Hunt` wil resume soon, please be patient.");
            bot.wait.forCellChange("Cut1");
            Core.sleep(2500);
            Core.huntMonsterMapID("baconcat", 41, "Oopy Defeated");
            Core.huntMonsterMapID("baconcat", 40, "Bloopy Defeated");
            Core.huntMonsterMapID("baconcat", 42, "Hoopy Defeated");
            Core.huntMonsterMapID("baconcat", 43, "Frood Defeated");
            Core.ensureComplete(5098);
        }

        // Super Ziri Brothers
        if (!Story.questProgression(5099)) {
            Core.ensureAccept(5099);
            Core.killMonster("baconcat", "r12", "Left", "Red Shell Turtle", "Turtle Shells", 5);
            Core.killMonster("baconcat", "r12", "Left", "Snapper Shrub", "Power Flower", 3);
            Core.ensureComplete(5099);
        }

        // It's-A-Me
        Story.killQuest(5100, "baconcat", "Horcio");

        // Me So Corny!
        Story.killQuest(5109, "baconcat", "Corn Minion");

        // Me Nom You Long Time
        Story.killQuest(5110, "baconcat", "Non-GMO Brutalcorn");

        // Make a Wish
        Story.mapItemQuest(5101, "baconcat", 4470, 1);

        // Smell This!
        Story.killQuest(5102, "baconcat", "Scent Trail");

        // Trial of being SMALL
        Story.killQuest(5103, "baconcat", ["Buttermancer", "Potato Knight"]);

        // King of the Unbread
        Story.killQuest(5104, "baconcat", "King of the Unbread");

        // Evil Undead!
        Story.killQuest(5105, "baconcat", "Chainsaw Actor");

        // Pala-dinner
        Story.killQuest(5106, "baconcat", "Paladin Actor");

        // Kitty Boo Boo, Overlord of the Catverse
        Story.killQuest(5107, "baconcat", "Kitty Boo Boo");

        // Stop Hitting Yourself!
        if (!Story.questProgression(5108)) {
            Core.ensureAccept(5108);
            Core.killMonster("baconcatyou", "Enter", "Spawn", "*", "Defeated YOURSELF!");
            Core.ensureComplete(5108);
        }
    }

    laserSharkInvasion(): void {
        if (Core.isCompletedBefore(5120)) {
            return;
        }

        if (this.doAll) {
            Core.logger("Ziri - The Daimon: Laser Shark Invasion");
        }
        Story.preLoad(this.laserSharkInvasion);

        // Cloud Sharks!
        Story.killQuest(5111, "baconcatlair", "Cloud Shark");

        // Get Those Waffle Cones Ready
        Story.killQuest(5112, "baconcatlair", "Ice Cream Shark");

        //Grody
        if (!Story.questProgression(5113)) {
            Core.ensureAccept(5113);
            Core.getMapItem(4474, 6, "baconcatlair");
            Core.huntMonster("baconcatlair", "Ice Cream Shark", "Big Cherry", 4);
            Core.ensureComplete(5113);
        }

        // We're Gonna Need A Bigger Eraser
        if (!Story.questProgression(5114)) {
            Core.ensureAccept(5114);
            Core.buyItem("librarium", 651, "Really Big Pencil");
            Core.ensureComplete(5114);
        }

        // Second Draft
        if (!Story.questProgression(5115)) {
            Core.ensureAccept(5115);
            Core.getMapItem(4475, 4, "baconcatlair");
            Core.huntMonster("baconcatlair", "Sketchy Shark", "Shark Erased", 6);
            Core.ensureComplete(5115);
        }

        // Game on!
        if (!Story.questProgression(5116)) {
            Core.ensureAccept(5116);
            Core.killMonster("baconcat", "r12", "Left", "*", "Cheat Codes", 4);
            Core.ensureComplete(5116);
        }

        // Game Sharks
        if (!Story.questProgression(5117)) {
            Core.ensureAccept(5117);
            Core.getMapItem(4476, 4, "baconcatlair");
            Core.huntMonster("baconcatlair", "8-Bit Shark", "Snot Kicked", 6);
            Core.ensureComplete(5117);
        }

        // Save the Kittarians
        if (!Story.questProgression(5118)) {
            Core.ensureAccept(5118);
            Core.huntMonster("baconcatlair", "Cat Clothed Shark", "Kittarian Clothes", 6);
            Core.huntMonsterMapID("baconcatlair", 14, "Kittarian Spoon", 4);
            Core.huntMonsterMapID("baconcatlair", 13, "Kittarian Fork", 4);
            Core.ensureComplete(5118);
        }

        // Bacon Cat Force Needs YOU!
        if (!Story.questProgression(5119)) {
            Core.ensureAccept(5119);
            Core.huntMonster("baconcatlair", "Cloud Shark", "Cloud Shark Farts", 3);
            Core.huntMonster("baconcatlair", "Ice Cream Shark", "Shark Sprinkles", 3);
            Core.huntMonster("baconcatlair", "Sketchy Shark", "College-Ruled Paper", 3);
            Core.huntMonster("baconcatlair", "8-Bit Shark", "Great White DLC", 3);
            Core.huntMonster("baconcatlair", "Cat Clothed Shark", "Kittarian Costumes", 3);
            Core.ensureComplete(5119);
        }

        // Ziri Is Also Tough
        Story.killQuest(5120, "baconcatlair", "Cloud Shark");

        if (Core.isMember) {
            //Robo Sharks! 5121
            Story.killQuest(5121, "baconcatlair", "Robo Shark");

            //Beat the Bushes 5122
            Story.mapItemQuest(5122, "baconcatlair", 4477, 4);

            //Sharks Should Not Walk 5123
            Story.killQuest(5123, "baconcatlair", ["Robo Shark", "Robo Shark"]);

            //Grab those Quarters 5124
            Story.killQuest(5124, "baconcatlair", "Robo Shark");

            //Shark Invaders! 5125
            Story.killQuest(5125, "baconcatlair", ["Shark Invader", "Shark Invader"]);

            //Sharks like Honey? 5126
            Story.mapItemQuest(5126, "baconcatlair", 4480, 6);
            Story.killQuest(5126, "baconcatlair", "Robo Shark");

            //At Least They Like to Party 5127
            Story.mapItemQuest(5127, "baconcatlair", 4479, 3);
            Story.killQuest(5127, "baconcatlair", ["Party Shark", "Party Shark"]);

            //Remora Brigade 5128
            Story.killQuest(5128, "baconcatlair", "Laser Remora");

            //Into the Whirlpool 5129
            Story.mapItemQuest(5129, "baconcatlair", 4478);

            //Giant, Huge Cyborg Shark! 5130
            Story.killQuest(5130, "baconcatlair", "Cyborg Laser Shark");

            //Wheel of Bacon 5131
            if (!Story.questProgression(5131)) {
                Core.ensureAccept(5131);
                Core.huntMonster("baconcatlair", "Robo Shark", "Wheel of Bacon Token", 5, { isTemp: false });
                Core.ensureComplete(5131);
            }
        }
    }

    //#endregion
    //#region Pax - The Warlord
    deathPit(): void {
        if (Core.isCompletedBefore(5154)) {
            return;
        }

        if (this.doAll) {
            Core.logger("Pax - The Warlord: Death Pit");
        }
        Story.preLoad(this.deathPit);

        // Mingle
        Story.mapItemQuest(5133, "DeathPit", [4484, 4485, 4486, 4487, 4488, 4489, 4490, 4491]);

        // Those Dummies
        Story.killQuest(5134, "DeathPit", "Training Dummy");

        // Round 1: You vs Omar the Meek!
        Story.killQuest(5135, "DeathPit", "Omar the Meek");

        // Round 2: You vs a Bunch of Sneevils!
        Story.killQuest(5136, "DeathPit", "Sneevil");

        // Battle: You vs Hattori!
        Story.killQuest(5137, "DeathPit", "Hattori");

        // Battle: You vs the Slime Horde!
        if (!Story.questProgression(5138)) {
            Core.ensureAccept(5138);
            Core.huntMonster("deathpit", "Giant Green Slime", "Giant Slime Defeated", 1);
            Core.huntMonster("deathpit", "Slime", "Slime Defeated", 4);
            Core.ensureComplete(5138);
        }

        // Battle: You vs the Sludge Lord!
        Story.killQuest(5139, "DeathPit", "Sludgelord");

        // Battle: You vs Some Salamanders!
        Story.killQuest(5140, "DeathPit", "Salamander");

        // Battle: You vs a Trobble!
        Story.killQuest(5141, "DeathPit", "Trobble");

        // Trouble Battle
        Story.killQuest(5142, "DeathPit", "Trobble");

        // Horc Battle
        Story.killQuest(5143, "DeathPit", "Horc Gladiator");

        // Battle: You vs the Brawlers!
        Story.killQuest(5144, "DeathPit", "Drakel Brawler");

        // Battle: You vs the Gladiators!
        Story.killQuest(5145, "DeathPit", "Drakel Gladiator");

        // Battle: You vs the Battlemasters!
        Story.killQuest(5146, "DeathPit", "Drakel Battlemaster");

        // Battle: You vs General Gall!
        Story.killQuest(5147, "DeathPit", "General Gall");

        // Velm's Minions
        Story.killQuest(5148, "DeathPit", "Drakel Brawler");

        // eneral Velm
        Story.killQuest(5149, "DeathPit", "General Velm");

        // Chud's Minions
        Story.killQuest(5150, "DeathPit", "Drakel Battlemaster");

        // General Chud
        Story.killQuest(5151, "DeathPit", "General Chud");

        // Hun'Gar's Minions
        Story.killQuest(5152, "DeathPit", "Drakel Battlemaster");

        // Hun'Gar Defeated
        Story.killQuest(5153, "DeathPit", "General Hun'Gar");

        // Pax Defeated
        Story.killQuest(5154, "DeathPit", "Warlord Pax");
    }

    deathPitPVP(): void {
        if (Core.isCompletedBefore(5165)) {
            return;
        }

        if (this.doAll) {
            Core.logger("Pax - The Warlord: Death Pit");
        }
        Story.preLoad(this.deathPitPVP);

        this.deathPit();

        // Do You Even Brawl
        if (!Story.questProgression(5155)) {
            Core.ensureAccept(5155);
            Farm.deathPitToken(undefined, 1, undefined, true);
            Core.ensureComplete(5155);
        }
        // Flex For Hun'Gar
        if (!Story.questProgression(5156)) {
            Core.ensureAccept(5156);
            Farm.deathPitToken(undefined, 15, undefined, true);
            Core.ensureComplete(5156);
        }

        // Pummel For Hun'Gar
        if (!Story.questProgression(5157)) {
            Core.ensureAccept(5157);
            Farm.deathPitToken("Brawler Token", 3, true, true);
            Farm.deathPitToken("Restorer Token", 4, true, true);
            Core.ensureComplete(5157);
        }

        // Destroy For Hun'Gar
        if (!Story.questProgression(5165)) {
            Core.ensureAccept(5165);
            Farm.deathPitToken("Death Pit Victory (Captain Defeat)", 1, true, true);
            Core.ensureComplete(5165);
        }
    }

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

    yasaris(): void {
        if (Core.isCompletedBefore(5239)) {
            return;
        }

        Story.preLoad(this.yasaris);

        //Serepthys, Please 5213
        Story.mapItemQuest(5213, "yasaris", 4590);

        //The Hall of the Falcon 5214
        Story.mapItemQuest(5214, "yasaris", 4576);

        //Secrets and Whispers 5215
        Story.killQuest(5215, "yasaris", "Vortex Hawk");

        //The Venom is the Key 5216
        Story.killQuest(5216, "yasaris", "Sacred Serpent");

        //The Venom Is Your Wine 5217
        Story.mapItemQuest(5217, "yasaris", 4577);

        //Another Interpretation 5218
        Story.mapItemQuest(5218, "yasaris", 4578);

        //Well, Go Get the Sac, Then! 5219
        if (!bot.quests.isUnlocked(5220) || !Core.checkInventory("Preserved Venom Sac of Mehensi")) {
            Core.addDrop("Preserved Venom", "Preserved Venom Sac of Mehensi");
            Core.ensureAccept(5219);
            Core.getMapItem(4579, 1, "yasaris");
            bot.wait.forPickup("Preserved Venom");
            Core.ensureComplete(5219);
            bot.wait.forPickup("Preserved Venom Sac of Mehensi");
        }

        //An Offering to the Falcon Guardian 5240
        Story.chainQuest(5240);

        //The Hall of the Jackal 5220
        Story.mapItemQuest(5220, "yasaris", 4591);

        //Cross the Chasm 5221
        if (!Story.questProgression(5221)) {
            Core.ensureAccept(5221);
            Core.huntMonster("yasaris", "Avatar of Anubyx", "Baboon, Jackal", 1);
            Core.huntMonster("yasaris", "Inverted Avatar", "Falcon, Human", 1);
            Core.ensureComplete(5221);
        }

        //Enter the Code 5222
        Story.mapItemQuest(5222, "yasaris", 4580);

        //Look for the Offering 5223
        Story.mapItemQuest(5223, "yasaris", 4581);

        //Needs More Energy 5224
        if (!Story.questProgression(5224)) {
            Core.ensureAccept(5224);
            Core.huntMonster("yasaris", "Avatar of Anubyx", "Energy Vessel", 1);
            Core.huntMonster("yasaris", "Negastri Hound", "Tesseract Energy", 5);
            Core.ensureComplete(5224);
        }

        //Charge the Spear 5225
        Story.mapItemQuest(5225, "yasaris", 4582);

        //Take the Offering 5226
        if (!Core.checkInventory("Charged Spear of Anubyx")) {
            Core.addDrop("Get Charged Spear of Anubyx", "Charged Spear of Anubyx");
            Core.ensureAccept(5226);
            Core.getMapItem(4583, 1, "yasaris");
            Core.ensureComplete(5226);
            bot.wait.forPickup("Get Charged Spear of Anubyx");
            bot.wait.forPickup("Charged Spear of Anubyx");
        }

        //An Offering to the Jackal Guardian 5241
        Story.chainQuest(5241);

        //The Hall of the Baboon 5227
        Story.mapItemQuest(5227, "yasaris", 4592);

        //Phase In 5228
        Story.killQuest(5228, "yasaris", "Dimensional Crystal");

        //What Will the Crystals do? 5229
        Story.mapItemQuest(5229, "yasaris", 4584);

        //Charge those Platforms 5230
        if (!Story.questProgression(5230)) {
            Core.ensureAccept(5230);
            Core.getMapItem(4585, 1, "yasaris");
            Core.huntMonster("yasaris", "Tesseract Sprite", "Tesseract Energy", 8);
            Core.ensureComplete(5230);
        }

        //Explore the Secret Room 5231
        Story.mapItemQuest(5231, "yasaris", 4593);

        //Get More Crystals 5232
        Story.killQuest(5232, "yasaris", "Dimensional Crystal");

        //Charge the Pedestal 5233
        if (!bot.quests.isUnlocked(5234) || !Core.checkInventory("Crystal of Hatoth")) {
            Core.addDrop("Crystal of Hatoth");
            Core.ensureAccept(5233);
            Core.getMapItem(4595, 1, "yasaris");
            Core.getMapItem(4586, 1, "yasaris");
            Core.ensureComplete(5233);
            bot.wait.forPickup("Crystal of Hatoth");
        }

        //An Offering to the Baboon Guardian 5242
        Story.chainQuest(5242);

        //The Hall of Humanity 5234
        Story.mapItemQuest(5234, "yasaris", 4594);

        //Activate the Levers 5235
        if (!Story.questProgression(5235)) {
            Core.ensureAccept(5235);
            Core.getMapItem(4587, 4, "yasaris");
            Core.huntMonster("yasaris", "Avatar of Serepthys", "Gem of Serepthys", 4);
            Core.ensureComplete(5235);
        }

        //Pull the Levers 5236
        Story.mapItemQuest(5236, "yasaris", 4588, 4);

        //Reveal the Paths 5237
        Story.killQuest(5237, "yasaris", "Spirit of Ptahmun");

        //Find the Spirit Knife 5238
        Story.mapItemQuest(5238, "yasaris", 4589);

        if (!bot.quests.isUnlocked(5239) || !Core.checkInventory("Heart of Ptahmun")) {
            Core.addDrop("Heart of Ptahmun");
            Core.ensureAccept(5238);
            Core.getMapItem(4589, 1, "yasaris");
            Core.ensureComplete(5238);
            bot.wait.forPickup("Heart of Ptahmun");
        }

        //An Offering to the Human Guardian 5243
        Story.chainQuest(5243);

        //Battle Serepthys 5239
        Story.killQuest(5239, "yasaris", "Serepthys");
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
}
