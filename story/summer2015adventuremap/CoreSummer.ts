/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/Summer2015AdventureMap/CoreSummer.cs.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();
const Adv = new CoreAdvanced();

export class CoreSummer {
    doAll(): void {
        this.dreadSpace();
        this.deadmoor();
        this.beleen();
        this.collector();
        this.livingDungeon();
        this.lunaCove();
        this.cyserosSecret();
    }

    dreadSpace(ReplicatorMerge = false): void {
        if (Core.isCompletedBefore(4286)) {
            return;
        }

        Story.preLoad(this.dreadSpace);

        // Ebil Dread Space (4263)
        Core.join("dreadspace");
        Story.chainQuest(4263);

        //1st Contact (4264)
        if (!Story.questProgression(4264)) {
            Core.ensureAccept(4264);
            Core.killMonster("dreadspace", "r4", "Left", "*", "Proof of Undead");
            Core.ensureComplete(4264);
        }

        //SO SLAY WE ALL! (4265)
        if (!Story.questProgression(4265)) {
            Core.ensureAccept(4265);
            Core.killMonster("dreadspace", "r4", "Left", "*", "Space Zombie Gun", 10);
            Core.ensureComplete(4265);
        }

        //Starship Troopers (4266)
        if (!Story.questProgression(4266)) {
            Core.ensureAccept(4266);
            Core.killMonster("dreadspace", "r4", "Left", "*", "Troopers Interrogated", 5);
            Core.ensureComplete(4266);
        }

        //Takai Me On (4267)
        if (!Story.questProgression(4267)) {
            Core.ensureAccept(4267);
            Core.huntMonster("dreadspace", "Defense Turret", "Defense Turret deactivated", 6);
            Core.huntMonster("dreadspace", "Vaderix", "Alien defeated", 6);
            Core.ensureComplete(4267);
        }

        //We are the HORG! (4268)
        Story.killQuest(4268, "dreadspace", "Cyber Horg");

        //Fix the Holodeck (4269)
        if (!Story.questProgression(4269)) {
            Core.ensureAccept(4269);
            Core.huntMonster("dreadspace", "Undead Space Warrior", "Holodeck Force Field", 7);
            Core.huntMonster("dreadspace", "Undead Star Ranger", "Holodeck EbilCorp AI");
            Core.huntMonster("dreadspace", "Undead Space Marine", "Holodeck Projector", 7);
            Core.huntMonster("dreadspace", "Cyber Horg", "Holodeck Power Source");
            Core.ensureComplete(4269);
        }

        //Gorn in 60 Seconds (4270)
        if (!Story.questProgression(4270)) {
            Core.ensureAccept(4270);
            Core.huntMonster("dreadspace", "Dra'gorn", "Bamboo Tube", 1);
            Core.huntMonster("dreadspace", "Dra'gorn", "Pointed Diamonds", 10);
            Core.huntMonster("dreadspace", "Dra'gorn", "Black Powder", 10);
            Core.ensureComplete(4270);
        }

        //Captain Kirkland (4271)
        if (!Story.questProgression(4271)) {
            Core.ensureAccept(4271);
            Core.huntMonster("dreadspace", "Red Trobble", "Red Space Fabric", 6, { isTemp: false, log: false });
            Adv.buyItem("dreadspace", 1010, "Red Space Crew Shirt");
            Core.ensureComplete(4271);
        }

        //Cowboyz vs Alienz (4273)
        if (!Story.questProgression(4273)) {
            Core.ensureAccept(4273);
            Core.huntMonster("dreadspace", "Holo Gunslinger", "Cowboy defeated", 5, { log: false });
            Core.huntMonster("dreadspace", "Vaderix", "Alien defeated", 5, { log: false });
            Core.ensureComplete(4273);
        }
        //Recover J6's Head! (4272)
        if (!Story.questProgression(4272)) {
            Core.ensureAccept(4272);
            Core.huntMonster("dreadspace", "Holo Gunslinger", "J6's Helmet");
            Core.ensureComplete(4272);
            if (ReplicatorMerge) {
                return;
            }
        }

        //Titanic II (4274)
        Story.killQuest(4274, "dreadspace", "Jack");

        //Holo-Yulgar's (4275)
        Story.killQuest(4275, "dreadspace", "Old Twilly");

        //Holodeck Survival Rate (4276)
        Story.killQuest(4276, "dreadspace", "Hologram Turret");

        //Space Paladin Survivors!? (4277)
        Story.mapItemQuest(4277, "dreadspace", 3423, 6);

        //Trouble with Trobbles (4278)
        Story.killQuest(4278, "dreadspace", "Trobble");

        //THEY LIVE! (4279)
        Story.killQuest(4279, "dreadspace", "Defense Turret");

        //AlienZ (4280)
        Story.killQuest(4280, "dreadspace", "Vaderix");

        //DO NOT OPEN - Space Door Codes (4281)
        Story.killQuest(4281, "dreadspace", "Undead Space Marine");

        //The Search for Spork (4282)
        Story.killQuest(4282, "dreadspace", "Undead Space Marine");

        //Crew Cut (4283)
        if (!Story.questProgression(4283)) {
            Core.ensureAccept(4283);
            Core.huntMonster("dreadspace", "Undead Space Marine", "Undead Space Marine defeated", 3);
            Core.huntMonster("dreadspace", "Undead Space Warrior", "Undead Space Warrior defeated", 3);
            Core.huntMonster("dreadspace", "Cyber Horg", "Cyber Horg defeated", 3);
            Core.huntMonster("dreadspace", "Vaderix", "Vaderix defeated", 7);
            Core.ensureComplete(4283);
        }

        //Restore Life Support (4284)
        Story.killQuest(4284, "dreadspace", "Cyber Horg");

        //DREAD SPACE BOSS (4285)
        Story.killQuest(4285, "dreadspace", "Dread Space");

        //DREADER SPACE!!! (4286)
        Story.killQuest(4286, "dreadspace", "Cyborg Beast Core");
    }

    deadmoor(): void {
        if (Core.isCompletedBefore(4307)) {
            return;
        }

        Story.preLoad(this.deadmoor);

        // 4296 A Walking Nightmare
        Story.mapItemQuest(4296, "deadmoor", 3457);

        // 4297 A Ritual is Required
        Story.killQuest(4297, "deadmoor", "Deadmoor Wraith");

        // 4298 A Spider's Finger
        Story.killQuest(4298, "deadmoor", "Toxic Souleater");

        // 4299 Well Done
        Story.mapItemQuest(4299, "deadmoor", 3448);

        // 4300 Fighting A Horse
        Story.killQuest(4300, "deadmoor", "Nightmare");

        // 4301 Wake the Dead
        Story.mapItemQuest(4301, "deadmoor", 3459);

        // 4302 Bone Breaking Bonds
        Story.mapItemQuest(4302, "deadmoor", [3449, 3450, 3451, 3452, 3453, 3454]);

        // 4303 Last Shreds of Humanity
        Story.killQuest(4303, "deadmoor", "Toxic Souleater");

        // 4304 Consecrated Ground
        Story.mapItemQuest(4304, "deadmoor", 3455, 7);

        // 4305 Geist
        Story.killQuest(4305, "deadmoor", "Geist");

        // 4306 The Last Caretaker
        Story.mapItemQuest(4306, "deadmoor", [3458, 3460, 3461, 3462, 3463, 3464, 3465]);

        // 4307 The Confrontation
        Story.killQuest(4307, "deadmoor", "Banshee Mallora");
    }

    beleen(ChaosFuzzyUnlockOnly = false): void {
        //Quest Progress Check
        if (Core.isCompletedBefore(4330)) {
            return;
        }

        //Needed AddDrop
        Core.addDrop("Chaos Fuzzies");

        //Drearia on Demand - 4312
        if (!Story.questProgression(4312)) {
            Story.mapItemQuest(4312, "Drearia", 3485);
            Core.killMonster("drearia", "r6", "Left", "Dark Makai", "Dark Makai Notes");
            Core.killMonster("drearia", "r6", "Left", "Evil Elemental", "Evil Elemental Notes");
            Core.killMonster("drearia", "r6", "Left", "Green Rat", "Green Rat Notes");
            Core.ensureComplete(4312);
        }
        //Plant a Little Seed and Nature Grows - 4313
        Story.killQuest(4313, "Drearia", "Dark Makai");

        //A Key Discovery - 4314
        if (!Story.questProgression(4314)) {
            Core.ensureAccept(4314);
            Core.getMapItem(3466, 1, "Drearia");
            Core.huntMonster("drearia", "Dark Makai", "Front Door Key", 1);
            Core.ensureComplete(4314);
        }

        //Creepy House... Yay! - 4315
        if (!Story.questProgression(4315)) {
            Core.ensureAccept(4315);
            Core.getMapItem(3467, 1, "Drearia");
            Core.huntMonster("drearia", "Green Rat", "Defeated Varmint", 3);
            Core.ensureComplete(4315);
        }

        //Sparkling Books - 4316
        Story.mapItemQuest(4316, "Drearia", 3468);

        //A Paladin in Peril - 4317
        Story.mapItemQuest(4317, "SwordHavenPink", 3469);

        //Pink Stinks! - 4318
        if (!Story.questProgression(4318)) {
            Core.ensureAccept(4318);
            Core.getMapItem(3486, 5, "SwordHavenPink");
            Core.huntMonster("swordhavenpink", "Pink Slime", "Squished Pink Slime", 8);
            Core.ensureComplete(4318);
        }

        //Rats, RATS! - 4319
        Story.killQuest(4319, "SewerPink", "Pink Rat");

        //AdventureQuest Worm - 4320
        Story.killQuest(4320, "SewerPink", "Cutie Grumbley");

        //UnBEARable Sight - 4321
        if (!Story.questProgression(4321)) {
            Core.ensureAccept(4321);
            Core.getMapItem(3470, 1, "PineWoodPink");
            Core.huntMonster("pinewoodpink", "Pink Grizzly", "Pink Teddy Bear", 5);
            Core.ensureComplete(4321);
        }

        //Too Much Pink in Pinewood! - 4322
        if (!Story.questProgression(4322)) {
            Core.ensureAccept(4322);
            Core.getMapItem(3471, 5, "PineWoodPink");
            Core.huntMonster("pinewoodpink", "Pink Shell Turtle", "Bows", 5);
            Core.ensureComplete(4322);
        }

        //Kill Sparkletooth - 4323
        Story.killQuest(4323, "PineWoodPink", "Sparkletooth");

        //The Citadorable Plot - 4324
        Story.mapItemQuest(4324, "Citadel", 3472);
        if (ChaosFuzzyUnlockOnly) {
            return;
        }

        //Fuzzy Run Minigame - 4325
        if (!Core.isCompletedBefore(4325)) {
            Core.ensureAccept(4325);
            while (!bot.shouldExit && !Core.checkInventory("Chaos Fuzzies", 30)) {
                Core.getMapItem(3481, undefined, "Citadel");
            }
            Core.ensureComplete(4325);
        }

        //Fluffy Clouds - 4326
        Story.killQuest(4326, "Pastelia", "Happy Cloud");

        //Super Model Makai Hair - 4327
        Story.killQuest(4327, "Pastelia", "Cutie Makai");

        //Squeaky Business - 4328
        Story.killQuest(4328, "Pastelia", "Pink Rat");

        //The Queen's Offering - 4329
        Story.mapItemQuest(4329, "Pastelia", 3473);

        //Boss Fight Beleen! - 4330
        Story.killQuest(4330, "Pastelia", "Chaos Queen Beleen");
    }
    collector(): void {
        if (Core.isCompletedBefore(1348)) return;

        Story.preLoad(this.collector);

        // This Town in a Desktop Globe
        Story.mapItemQuest(1293, "Terrarium", 586);

        // Dust Bunnies Can't Hide
        Story.killQuest(1294, "Terrarium", "Dustbunny of Doom");

        // Au Contr-air holes
        Story.mapItemQuest(1295, "Terrarium", 587, 10);

        // Hero Eats Everything. Even Pellets
        Story.mapItemQuest(1296, "Terrarium", 588, 12);

        // The Moth Defeats the Man?
        Story.killQuest(1297, "Terrarium", "Death on Wings");

        // Can you find them?
        Story.mapItemQuest(1298, "Terrarium", [589, 590, 591, 592, 593]);

        // You've Been Looking Everywhere!
        Story.mapItemQuest(1299, "Terrarium", [593, 594, 595, 596, 604]);

        // Go for Grease!
        Story.killQuest(1300, "Terrarium", "Death on Wings");

        // Doppelganger Wants to Hit You
        if (!Story.questProgression(1308)) {
            Core.ensureAccept(1308);
            Core.huntMonster("terrarium", "Doppleganger Of Fred", "Doppelganger Demolished!", 1);
            Core.huntMonster("terrarium", "Doppleganger of Will", "Doppelganger Destroyed!", 1);
            Core.ensureComplete(1308);
        }

        // Catapult Climb
        Story.mapItemQuest(1309, "Terrarium", 604);

        // The Treasure that You Seek - 976
        Story.killQuest(1339, "prehistoric", "Gigantosaurus");

        // These Trees - 1340
        Story.mapItemQuest(1340, "prehistoric", 630, 11);

        // Ewwww... Totally Gross - 1341
        Story.killQuest(1341, "prehistoric", "Gigantosaurus");

        // The Eggs, Exciting and New - 1342
        Story.mapItemQuest(1342, "prehistoric", 631, 4);

        // Someday (Today) Their Mother Will Die - 1343
        Story.killQuest(1343, "prehistoric", "Mother TerrorDOOMKill");

        // More Aliens Than You Can Handle?
        Story.killQuest(1344, "Future", "Alien Dino");

        // Spy Eyes
        Story.mapItemQuest(1345, "Future", 632, 2);

        // Smashed to Pieces
        Story.mapItemQuest(1346, "Future", 633, 7);

        // Tired of My Vigilette Dreams
        if (!Story.questProgression(1347)) {
            Core.ensureAccept(1347);
            Core.huntMonster("Future", "Red-Eyed Alien", "Small Fragment Acquired", 5);
            Core.huntMonster("Future", "Red-Eyed Alien", "Medium Piece Acquired", 5);
            Core.ensureComplete(1347);
        }

        // You're Not the Boss of Me Now
        if (!Story.questProgression(1348)) {
            Core.ensureAccept(1348);
            Core.huntMonster("Future", "The Collector", "Collector Vanquished");
            Core.ensureComplete(1348);
        }
    }

    livingDungeon(): void {
        if (Core.isCompletedBefore(4384)) {
            return;
        }

        Story.preLoad(this.livingDungeon);

        // Titan Hollow
        Story.chainQuest(4348);

        // Roots of all Evil
        Story.killQuest(4349, "livingdungeon", "Root of Evil");

        // Venus Hero Trap
        Story.killQuest(4350, "livingdungeon", "Seed Spitter");

        // Bark is worse than its bite
        if (!Story.questProgression(4351)) {
            Core.ensureAccept(4351);
            Core.huntMonster("livingdungeon", "Evil Plant Horror", "It's a CLUE!", 10);
            Core.ensureComplete(4351);
        }

        // Knot what you expected
        Story.killQuest(4352, "livingdungeon", "Weeping Widowmaker");

        // Cha Cha Cha Chia!
        Story.killQuest(4353, "livingdungeon", "Chia Warrior");

        // Leaf me alone!
        if (!Story.questProgression(4354)) {
            Core.ensureAccept(4354);
            Core.huntMonster("livingdungeon", "Titan Decay", "Titan Decay defeated", 5);
            Core.huntMonster("livingdungeon", "Seed Spitter", "Seed Spitter de-seeded", 5);
            Core.huntMonster("livingdungeon", "Evil Plant Horror", "Evil Plant Horror defeated", 5);
            Core.ensureComplete(4354);
        }

        // Evil Faerie Ambush!
        Story.killQuest(4355, "livingdungeon", "Evil Tree Faerie");

        // Check the Trunk
        Story.killQuest(4356, "livingdungeon", "Vulchurion");

        // Committing Tree-son
        if (!Story.questProgression(4357)) {
            Core.ensureAccept(4357);
            Core.huntMonster("livingdungeon", "Evil Plant Horror", "Magic Tree Bark", 10);
            Core.ensureComplete(4357);
        }

        // Heartwood
        if (!Story.questProgression(4358)) {
            Core.ensureAccept(4358);
            Core.huntMonster("livingdungeon", "Evil Plant Horror", "Titan's Heart", 1);
            Core.ensureComplete(4358);
        }

        // Drayko BOSS FIGHT!
        Story.killQuest(4359, "livingdungeon", "Drayko");

        // Foilaged again!
        if (!Story.questProgression(4360)) {
            Core.ensureAccept(4360);
            Core.huntMonster("livingdungeon", "Evil Plant Horror", "Monsters defeated", 15);
            Core.ensureComplete(4360);
        }

        // Mind Games
        if (!Story.questProgression(4361)) {
            Core.ensureAccept(4361);
            Core.huntMonster("livingdungeon", "Evil Plant Horror", "Tree Titan Brain Chunk", 10);
            Core.ensureComplete(4361);
        }

        // DRAGON vs TITAN
        Story.killQuest(4362, "treetitanbattle", "Dakka the Dire Dragon");

        // Smells like trouble!
        Story.killQuest(4363, "livingdungeon", "Lil' Poot");

        // EPIC DROP!
        Story.killQuest(4364, "livingdungeon", "Epic Drop");

        Core.addDrop(
            "Wooden Ring",
            "Salad!",
            "Weeping Widowmaker Bone",
            "Chia in a pot!",
            "Fairy Phone",
            "Vulchurion Quill",
            "Drayko's Medallion",
            "Giant Dakka Fang",
        );
        // ------------------------------------------
        // Drayko Battle!
        if (!Core.checkInventory("Drayko's Medallion")) {
            Core.logger("Drayko's Medallion not found, finding it for you");
            Core.ensureAccept(4383);

            // Vulchurions
            if (!Core.checkInventory("Vulchurion Quill")) {
                Core.logger("Vulchurion Quill not found, finding it for you");
                Core.ensureAccept(4382);

                // Evil Tree Faeries
                if (!Core.checkInventory("Fairy Phone")) {
                    Core.logger("Fairy Phone not found, finding it for you");
                    Core.ensureAccept(4381);

                    // Chia Warriors
                    if (!Core.checkInventory("Chia in a pot!")) {
                        Core.logger("Chia in a pot! not found, finding it for you");
                        Core.ensureAccept(4380);

                        if (!Core.checkInventory("Weeping Widowmaker Bone")) {
                            Core.logger("Weeping Widowmaker Bone not found, finding it for you");
                            Core.ensureAccept(4379);

                            if (!Core.checkInventory("Salad!")) {
                                Core.logger("Salad! not found, finding it for you");
                                Core.ensureAccept(4378);

                                if (!Core.checkInventory("Wooden Ring")) {
                                    Core.logger("Wooden Ring not found, finding it for you");
                                    Core.ensureAccept(4377);
                                    Core.huntMonster("livingdungeon", "Root of Evil", "Wooden Ring Piece", 5);
                                    Core.ensureComplete(4377);
                                    bot.wait.forPickup("Wooden Ring");
                                    Core.sleep(1000);
                                }
                                Core.huntMonster("livingdungeon", "Evil Plant Horror", "Evil Plant Horror Leaf", 6);
                                Core.ensureComplete(4378);
                                bot.wait.forPickup("Salad!");
                                Core.sleep(1000);
                            }
                            Core.huntMonster("livingdungeon", "Weeping Widowmaker", "Widowmaker deboned", 5);
                            Core.ensureComplete(4379);
                            bot.wait.forPickup("Weeping Widowmaker Bone");
                            Core.sleep(1000);
                        }
                        Core.huntMonster("livingdungeon", "Chia Warrior", "Chia Warrior defeated", 3);
                        Core.ensureComplete(4380);
                        bot.wait.forPickup("Chia in a pot!");
                        Core.sleep(1000);
                    }
                    Core.huntMonster("livingdungeon", "Evil Tree Faerie", "Fairy Purse", 5);
                    Core.ensureComplete(4381);
                    bot.wait.forPickup("Fairy Phone");
                    Core.sleep(1000);
                }
                Core.huntMonster("livingdungeon", "Vulchurion", "Vulchurion Feather", 3);
                Core.ensureComplete(4382);
                bot.wait.forPickup("Vulchurion Quill");
                Core.sleep(1000);
            }
            Core.huntMonster("livingdungeon", "Drayko", "Drayko Defeated... again");
            Core.ensureComplete(4383);
            bot.wait.forPickup("Drarko's Medalion");
            Core.sleep(1000);
        }
        // DRAGON vs TITAN Rematch! - 4384
        if (!Story.questProgression(4384)) {
            Core.logger("Giant Dakka Fang not found, finding it for you");
            Core.ensureAccept(4384);
            Core.huntMonster("treetitanbattle", "Dakka the Dire Dragon", "Dakka Defeated... again");
            Core.ensureComplete(4384);
            // Bot.Wait.ForPickup("Giant Dakka Fang");
        }
    }

    lunaCove(): void {
        if (Core.checkInventory("Your Moonstone")) {
            return;
        }

        Core.addDrop(
            "Ritual Items",
            "Stale Chips",
            "Air Pump",
            "Shiny Stone",
            "Were Hair",
            "For the Horde!",
            "Werewolf Discovery",
            "Stolen Lycanstone",
            "Gravefang's Elixir",
            "Dis-Lycan this",
            "Your Moonstone",
        );

        //4399|Time to Rock this Finale!
        if (!Core.checkInventory("Your Moonstone")) {
            //4398|Dis-lycan What Happened
            if (!Core.checkInventory("Dis-Lycan this")) {
                //4397|Fur the Right Thing
                if (!Core.checkInventory("Gravefang's Elixir")) {
                    //4396|Find the Lycanstone
                    if (!Core.checkInventory("Stolen Lycanstone")) {
                        //4394|"Were" Did We Go Wrong?
                        if (!Core.checkInventory("Werewolf Discovery")) {
                            //4395|Lycan this Next Task
                            if (!Core.checkInventory("For the Horde!")) {
                                //4393|Total Eclipse of the Heart
                                if (!Core.checkInventory("Were Hair")) {
                                    //4392|Hex on the Beach(balls)
                                    if (!Core.checkInventory("Shiny Stone")) {
                                        //4391|Fish’n’Chips on my Shoulder
                                        if (!Core.checkInventory("Air Pump")) {
                                            //4390|A Ritual by any Other Name
                                            if (!Core.checkInventory("Stale Chips")) {
                                                //4389|Let's Get Started
                                                if (!Core.checkInventory("Ritual Items")) {
                                                    Core.ensureAccept(4389);
                                                    Core.huntMonster(
                                                        "lunacove",
                                                        "Cove Warrior",
                                                        "Ritual Materials",
                                                        15,
                                                    );
                                                    Core.huntMonster("lunacove", "Plessie", "Plessie Fang Tooth");
                                                    Core.huntMonster("lunacove", "Island Girl", "Candle", 5);
                                                    Core.ensureComplete(4389);
                                                    bot.wait.forPickup("Ritual Items");
                                                }
                                                Core.ensureAccept(4390);
                                                Core.getMapItem(3533, 10, "lunacove");
                                                Core.huntMonster("lunacove", "Cove Fisher", "Bag of Chips");
                                                Core.ensureComplete(4390);
                                                bot.wait.forPickup("Stale Chips");
                                            }
                                            Core.ensureAccept(4391);
                                            Core.huntMonster("lunacove", "Lunar Villager", "Chips", 3);
                                            Core.ensureComplete(4391);
                                            bot.wait.forPickup("Air Pump");
                                        }
                                        Core.ensureAccept(4392);
                                        Core.huntMonster("lunacove", "Lunar Villager", "Villager Chastised", 10);
                                        Core.huntMonster("lunacove", "Beach Ball", "Deflated Beach Balls", 5);
                                        Core.ensureComplete(4392);
                                        bot.wait.forPickup("Shiny Stone");
                                    }
                                    Core.ensureAccept(4393);
                                    Core.huntMonster("lunacove", "Coral Merdraconian", "Coral Branch", 3);
                                    Core.huntMonster("lunacove", "Plessie", "Plessie Scale", 2);
                                    Core.ensureComplete(4393);
                                    bot.wait.forPickup("Were Hair");
                                }
                                Core.ensureAccept(4395);
                                Core.getMapItem(3534, 7, "lunacove");
                                Core.ensureComplete(4395);
                                bot.wait.forPickup("For the Horde!");
                            }
                            Core.ensureAccept(4394);
                            Core.huntMonster("lunacove", "Horde Knight", "Horde Knight Defeated", 7);
                            Core.huntMonster("lunacove", "Horde Lycan", "Horde Lycan Defeated", 8);
                            Core.ensureComplete(4394);
                            bot.wait.forPickup("Werewolf Discovery");
                        }
                        Core.ensureAccept(4396);
                        Core.huntMonster("lunacove", "Horde Knight", "Lycanstone");
                        Core.ensureComplete(4396);
                        bot.wait.forPickup("Stolen Lycanstone");
                    }
                    Core.ensureAccept(4397);
                    Core.huntMonster("lunacove", "Gravefang", "Gravefang Defeated");
                    Core.ensureComplete(4397);
                    bot.wait.forPickup("Gravefang's Elixir");
                }
                Core.ensureAccept(4398);
                Core.huntMonster("lunacove", "Beach Werewolf", "Beach Werewolf Defeated", 6);
                Core.huntMonster("lunacove", "Lunar Lycan", "Lunar Lycan Subdued", 6);
                Core.ensureComplete(4398);
                bot.wait.forPickup("Dis-Lycan this");
            }
            Core.ensureAccept(4399);
            Core.huntMonster("lunacove", "Moonrock", "Moon Rock Smashed");
            Core.ensureComplete(4399);
            bot.wait.forPickup("Your Moonstone");
        }
    }

    cyserosSecret(): void {
        if (Core.isCompletedBefore(4375)) {
            return;
        }

        Story.preLoad(this.cyserosSecret);

        //Find The Leak (4365)
        Story.killQuest(4365, "goose", "Queen's Sage");

        //Locking The Door (4366)
        Story.killQuest(4366, "goose", "Chris P. Bacon");

        //Thin Their Ranks (4367)
        Story.killQuest(4367, "goose", "Queen's Sage");

        //1st Goose Bone (4368)
        Story.killQuest(4368, "goose", "Sock Gorilla");

        //2nd Goose Bone (4369)
        Story.killQuest(4369, "goose", "Can of Paint");

        //Last Goose Bone (4370)
        Story.killQuest(4370, "goose", "Queen's ArchSage");

        //Ancient Goose? (4371)
        Story.mapItemQuest(4371, "goose", 3562);

        //Raccoon Schematics (4372)
        Story.mapItemQuest(4372, "goose", 3561, 8);

        //No Fur For You (4373)
        Story.killQuest(4373, "goose", "Queen's Sage");

        //Raccoon Heart (4374)
        Story.killQuest(4374, "goose", "Can of Paint");

        //Shut It Down (4375)
        Story.killQuest(4375, "goose", "Ancient Goose");
    }
}
