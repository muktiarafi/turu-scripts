/*
name: null
description: null
tags: null
*/
// Port of Scripts/Seasonal/HarvestDay/CoreHarvestDay.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class CoreHarvestDay {
    umManaHarvest!: string[];

    constructor() {
        this.umManaHarvest = [
            "Azoth Pumpkin", // UseableMonsters[0],
            "Cosmic Egg", // UseableMonsters[1],
            "Ascended Chickencow", // UseableMonsters[2],
            "Apple of Life", // UseableMonsters[3],
            "Bunch of Mananas", // UseableMonsters[4],
            "Cookie Monster", // UseableMonsters[5],
            "Burgoo", // UseableMonsters[6],
            "Mananxiety", // UseableMonsters[7]
        ];
    }

    doAll(): void {
        if (Core.isSeasonalMapActive("harvest")) {
            this.harvest();
            this.turdraken();
            this.float();
            this.banquet();
            this.grams();
            this.artixHome();
            this.foulFarm();
            this.killerKitchen();
            this.furbleFeast();
            this.furborgShip();
            this.meatLab();
            this.gothicDream();
            this.memetNightmare();
            this.nightmareWar();
            this.epilTakeOver();
            this.birdsWithHarms();
            this.ebilCorpHQ();
            this.blightHarvest();
            this.manaHarvest();
            this.moglinFeast();
        } else {
            this.ebilCorpHQ();
        }
    }

    harvest(): void {
        if (Core.isCompletedBefore(136) || !Core.isSeasonalMapActive("harvest")) {
            return;
        }

        Story.preLoad(this.harvest);

        //Scout the Cornycopia (130)
        Story.mapItemQuest(130, "harvest", 36);

        //Unboiling Water (131)
        if (!Story.questProgression(131)) {
            Core.ensureAcceptmultiple(131, 420);
            Core.getMapItem(31, 1, "harvest");
            Core.ensureComplete(420);
            Core.ensureComplete(131);
        }

        //The Corn has Ears (132)
        if (!Story.questProgression(132)) {
            Core.ensureAcceptmultiple(132, 421);
            Core.huntMonster("harvest", "Corn Stalker", "Corn Stalker Ears", 8, { log: false });
            Core.ensureComplete(421);
            Core.ensureComplete(132);
        }

        //An Apple a Day (133)
        if (!Story.questProgression(133)) {
            Core.ensureAcceptmultiple(133, 422);
            Core.huntMonster("harvest", "Bad Apple", "Worm", 5, { log: false });
            Core.ensureComplete(422);
            Core.ensureComplete(133);
        }

        //Whine n' Cheese (134)
        if (!Story.questProgression(134)) {
            Core.ensureAcceptmultiple(134, 423);
            Core.huntMonster("harvest", "Grapes of Wrath", "Whine", 8, { log: false });
            Core.ensureComplete(423);
            Core.ensureComplete(134);
        }

        //Fruit of the Loot (135)
        if (!Story.questProgression(135)) {
            Core.ensureAccept(135);
            Story.mapItemQuest(135, "harvest", 37);
            Core.killMonster("harvest", "Room1", "Left", "*", "Seeds");
            Core.ensureComplete(135);
        }

        //The Turdraken (136)
        Story.killQuest(136, "harvest", "Turdraken");
    }

    turdraken(): void {
        if (!Core.isMember) {
            return;
        }

        if (Core.isCompletedBefore(430) || !Core.isSeasonalMapActive("turdraken")) {
            return;
        }

        this.harvest();

        Story.preLoad(this.turdraken);

        //Pain-Apple! 139
        Story.killQuest(139, "turdraken", "Bad Apple");

        //Squishy Squash! 140
        Story.killQuest(140, "turdraken", "Gourd Monster");

        //Ice Cream! 141
        Story.killQuest(141, "turdraken", "Mad Strawberry");

        //Ring of Pain! 142
        Story.killQuest(142, "turdraken", "Pineapple Beast");

        //Cholesterious 143
        Story.killQuest(143, "turdraken", "Cholesterious");

        //Turkey go Boom! 429
        Story.mapItemQuest(429, "turdraken", 75);

        //Cater To His Every Dish 430
        if (!Story.questProgression(430)) {
            Core.ensureAccept(430);
            Core.huntMonster("orctown", "Horc Warrior", "Pulled Horc Sandwich", undefined, { log: false });
            Core.huntMonster("farm", "Mosquito", "French Flies", undefined, { log: false });
            Core.huntMonster("GreenguardEast", "Spider", "Corn Cob Web", undefined, { log: false });
            Core.huntMonster("sewer", "GreenRat", "Ratatouille", undefined, { log: false });
            Core.huntMonster("uppercity", "Rhino Beetle", "Chocolate Covered Beetle", undefined, { log: false });
            Core.ensureComplete(430);
        }
    }

    float(): void {
        if (!Core.isMember) {
            return;
        }
        if (Core.isCompletedBefore(897) || !Core.isSeasonalMapActive("float")) {
            return;
        }

        this.turdraken();

        Story.preLoad(this.float);

        //Turtle Shells Pop Balloons 893
        Story.killQuest(893, "pines", "Red Shell Turtle");

        //Make things Pop with a Sentry Bot 894
        Story.killQuest(894, "crashsite", "Sentry Bot");

        //Web Browsing for Balloons 895
        Story.killQuest(895, "twilight", "Gressil");

        //Complete Airheads 896
        Story.killQuest(896, "float", ["Cysero Balloon", "Beleen Balloon"]);

        //The Final Pilgrimage 897
        Story.killQuest(897, "float", "Twilly Balloon");
    }

    banquet(): void {
        if (Core.isCompletedBefore(1436) || !Core.isSeasonalMapActive("banquet")) {
            return;
        }

        Story.preLoad(this.banquet);

        //Subdue the Squadrons 1433
        Story.killQuest(1433, "banquet", "Hungry Knight");

        //Pactagonal Aid Required 1434
        Story.mapItemQuest(1434, "banquet", 712);

        //Contain the Chaos 1435
        Story.mapItemQuest(1435, "banquet", 713, 7);

        //Chaorrupted Captain Encounter 1436
        Story.killQuest(1436, "banquet", "Hungry Knight Captain");
    }

    grams(): void {
        if (Core.isCompletedBefore(1444) || !Core.isSeasonalMapActive("grams")) {
            return;
        }

        this.banquet();

        Story.preLoad(this.grams);
        //Bandits are Bad News 1441
        Story.mapItemQuest(1441, "grams", 715);

        //Creatures Serving Chaos 1442
        Story.killQuest(1442, "grams", ["Wolf", "Wereboar", "Spider"]);

        //Bandit Battles 1443
        Story.killQuest(1443, "grams", "Bandit");

        //Can You Regain Grams? 1444
        Story.killQuest(1444, "grams", "Grumpy Granny");
    }

    artixHome(): void {
        if (!Core.isMember) {
            return;
        }
        if (Core.isCompletedBefore(1440) || !Core.isSeasonalMapActive("artixhome")) {
            return;
        }

        this.grams();

        Story.preLoad(this.artixHome);

        //Chaos Critters in the Crops 1437
        Story.killQuest(1437, "artixhome", ["Mosquito", "Chaorrupted Poultrygeist"]);

        //Zombehs Aren't So Smart 1438
        Story.mapItemQuest(1438, "artixhome", 714, 10);
        Story.killQuest(1438, "artixhome", "Zombeh");

        //It's the Anti-Mall 1439
        Story.mapItemQuest(1439, "artixhome", 716, 5);
        Story.killQuest(1439, "artixhome", "Treeant");

        //28 Battles Later... 1440
        Story.killQuest(1440, "artixhome", "Zombeh");
    }

    foulFarm(): void {
        if (
            (Core.isCompletedBefore(6090) && Core.checkInventory("Muddy Soulflare")) ||
            !Core.isSeasonalMapActive("foulfarm")
        ) {
            return;
        }

        this.artixHome();

        Story.preLoad(this.foulFarm);

        //Give Me The Gold! 6086
        Story.killQuest(6086, "harvestzombie", "Golden Warrior");

        //Cyser-Os! 6088
        while (!bot.shouldExit && !Core.checkInventory("Soulflare")) {
            //Cyser-Os! 6088
            Core.addDrop("Soulflare");
            Core.ensureAccept(6088);
            Core.huntMonster("battlefowl", "ChickenCow", "Box of Cyser-Os", 3, { log: false });
            bot.wait.forDrop("Soulflare");
            Core.ensureComplete(6088);
        }

        //A Golden Blade 6087
        if (!Story.questProgression(6087)) {
            Core.chainComplete(6087);
        }

        // Cover the Shine 6089
        if (!Story.questProgression(6089) || !Core.checkInventory("Muddy Soulflare")) {
            Core.addDrop("Muddy Soulflare");
            Core.ensureAccept(6089);
            Core.huntMonster("brightoak", "Tainted Earth", "Sticky Mud", 8, { log: false });
            bot.wait.forDrop("Muddy Soulflare");
            Core.ensureComplete(6089);
        }

        //Face the Rider 6090
        Story.killQuest(6090, "Dullahan", "Wretched Rider");
    }

    killerKitchen(): void {
        if (Core.isCompletedBefore(3214) || !Core.isSeasonalMapActive("killerkitchen")) {
            return;
        }

        Story.preLoad(this.killerKitchen);

        //Oishii's Special Blend 3209
        Story.mapItemQuest(3209, "killerkitchen", 2231);

        //Cornstalkerbread Stuffing 3210
        Story.killQuest(3210, "harvest", ["Corn Stalker", "Corn Stalker"]);

        //Super Special Chutney 3211
        Story.killQuest(3211, "harvest", ["Bad Apple", "Grapes of Wrath"]);

        //Oishii's Secret Ingredient 3212
        Story.killQuest(3212, "killerkitchen", "Harvest Sneevil");

        //Taking Out the Turdrakolich 3213
        Story.killQuest(3213, "killerkitchen", "Turdrakolich");

        //Defeat Ultra Turdrakolich 3214
        Story.killQuest(3214, "killerkitchen", "Ultra Turdrakolich");
    }

    furbleFeast(): void {
        if (Core.isCompletedBefore(7224) || !Core.isSeasonalMapActive("furblefeast")) {
            return;
        }

        Story.preLoad(this.furbleFeast);

        // Scavengers 7214
        Story.killQuest(7214, "furblefeast", "Harvest Sneevil");

        // Wired 7215
        Story.killQuest(7215, "furblefeast", "Turkey");

        // Turdraken Tremor 7216
        Story.killQuest(7216, "furblefeast", "Mini Turdraken");

        // Meat and Eggs 7217
        Story.killQuest(7217, "furblefeast", ["Harvest Sneevil", "Turkey"]);

        // Zombies! 7218
        Story.killQuest(7218, "furblefeast", "Meat Zombie");

        // Fight the Furbles 7219
        Story.killQuest(7219, "furblefeast", "Angry Furble");

        // Pollinate 7220
        if (!Story.questProgression(7220)) {
            Core.ensureAccept(7220);
            Core.getMapItem(6843, 10, "furblefeast");
            Core.huntMonster("poisonforest", "Treeant", "Treeant Pollen", 10);
            Core.ensureComplete(7220);
        }

        // Mecha-Furbles 7221
        Story.killQuest(7221, "furblefeast", "Mecha Furble");

        // Sabotage 7222
        if (!Story.questProgression(7222)) {
            Core.ensureAccept(7222);
            Core.huntMonster("crashsite", "Dwakel Warrior", "Breaking Tools", 5);
            Core.huntMonster("crashsite", "Dwakel Blaster", "Smashing Tools", 5);
            Core.ensureComplete(7222);
        }

        // SMASH 7223
        Story.mapItemQuest(7223, "furblefeast", 6844, 4);

        // Take Him Out 7224
        Story.killQuest(7224, "furblefeast", "Furborg");
    }

    furborgShip(): void {
        if (Core.isCompletedBefore(7231) || !Core.isSeasonalMapActive("furborgship")) {
            return;
        }

        this.furbleFeast();

        Story.preLoad(this.furborgShip);

        // Get Outta Here 7225
        Story.mapItemQuest(7225, "furborgship", 6855);

        // Level Up! 7226
        Story.mapItemQuest(7226, "furborgship", 6856);

        // Keep Climbing 7227
        Story.mapItemQuest(7227, "furborgship", 6857);

        // Up, Up, Up! 7228
        Story.mapItemQuest(7228, "furborgship", 6858);

        // Get to the Queen 7229
        Story.mapItemQuest(7229, "furborgship", 6859);

        // Kill the Queen 7230
        Story.killQuest(7230, "furborgship", "Feegrix Queen");

        // Furbapon 7231
        Story.killQuest(7231, "furborgship", "Furborg Guard");
    }

    meatLab(): void {
        if (Core.isCompletedBefore(7213) || !Core.isSeasonalMapActive("meatlab")) {
            return;
        }

        Story.preLoad(this.meatLab);

        // Rhison Samples 7200
        Story.killQuest(7200, "bloodtusk", "Rhison");

        // Test Sample #1 7201
        Story.mapItemQuest(7201, "meatlab", [6834, 6835]);

        // Spice it Up 7202
        if (!Story.questProgression(7202)) {
            Core.ensureAccept(7202);
            bot.quests.updateQuest(1542);
            Core.huntMonster("firestorm", "Firestorm Hatchling", "Firestorm Sample", 8, { log: false });
            Core.ensureComplete(7202);
        }

        // Test Sample #2 7203
        Story.mapItemQuest(7203, "meatlab", [6836, 6837]);

        // Tenderize 7204
        Story.killQuest(7204, "pirates", "Fishwing");

        // Test Sample #3 7205
        Story.mapItemQuest(7205, "meatlab", [6838, 6839]);

        // Meat Multiplication 7206
        Story.killQuest(7206, "guru", "Trobble");

        // Test Sample #4 7207
        Story.mapItemQuest(7207, "meatlab", 6840);

        // Time to Clean 7208
        Story.killQuest(7208, "meatlab", "Meat Nubbin");

        // They're Eating the Wires 7209
        Story.killQuest(7209, "meatlab", "Electrical Fire");

        // Turn 'em off and on Again 7210
        Story.killQuest(7210, "meatlab", "Repair Drone");

        // So... Greasy 7211
        Story.mapItemQuest(7211, "meatlab", 6841, 6);
        Story.killQuest(7211, "meatlab", "Meat Nubbin");

        // Shut it Down  7212
        if (!Story.questProgression(7212)) {
            Core.ensureAccept(7212);
            Core.getMapItem(6842, 1, "meatlab");
            Core.ensureComplete(7212);
        }

        // Kill it with Fire 7213
        Story.killQuest(7213, "meatlab", "Meatmongous");
    }

    gothicDream(): void {
        if (Core.isCompletedBefore(7795) || !Core.isSeasonalMapActive("gothicdream")) {
            return;
        }

        Story.preLoad(this.gothicDream);

        // That Cake is a Lie 7784
        Story.killQuest(7784, "gothicdream", "Monster Cake");

        // Get the Cupcakes 7785
        Story.killQuest(7785, "gothicdream", "Killer Cupcake");

        // Wash it Down 7786
        Story.killQuest(7786, "gothicdream", "Angry Punch");

        // Freezer Key 7787
        Story.killQuest(7787, "gothicdream", "Angry Punch");

        // Ice it Up 7788
        Story.killQuest(7788, "gothicdream", "Ice Elemental");

        // I Scream, You Scream! 7789
        Story.killQuest(7789, "gothicdream", "Ice Scream");

        // Clear the Hallway 7790
        Story.killQuest(7790, "gothicdream", ["Spooky Lantern", "Bat Garland"]);

        // Sleepytime Gear 7791
        Story.mapItemQuest(7791, "gothicdream", [7820, 7821]);
        Story.killQuest(7791, "gothicdream", ["Spooky Lantern", "Bat Garland"]);

        // Too Bright 7792
        Story.killQuest(7792, "gothicdream", "Spooky Lantern");

        // What's That Under my Bed? 7793
        Story.killQuest(7793, "gothicdream", "Bed Monster");

        // Why Can't I Sleep? 7794
        Story.killQuest(7794, "gothicdream", "Sleep Paralysis");

        // Clean Up Clean Up Everybody Do Your Scare 7795
        Story.killQuest(7795, "gothicdream", ["Spooky Lantern", "Bat Garland", "Ice Scream"]);
    }

    memetNightmare(): void {
        if (Core.isCompletedBefore(7808) || !Core.isSeasonalMapActive("memetnightmare")) {
            return;
        }

        this.gothicDream();

        Story.preLoad(this.memetNightmare);

        // Talk to Memet 7796
        Story.mapItemQuest(7796, "memetnightmare", 7836);

        // Try Coffee 7797
        Story.killQuest(7797, "memetnightmare", "Eye Wyrm");

        // Put Out the Embers 7798
        Story.killQuest(7798, "memetnightmare", "Burning Ember");

        // Kibble for Nibbles 7799
        if (!Story.questProgression(7799)) {
            Core.ensureAccept(7799);
            while (!bot.shouldExit && !Core.checkInventory(57666, 8)) {
                Core.huntMonster("memetnightmare", "Nightmare Maw", undefined, undefined, { log: false });
            }
            Core.ensureComplete(7799);
        }

        // Board up the Windows 7800
        Story.killQuest(7800, "memetnightmare", ["Fire Cyclone", "Fire Cyclone"]);

        // Energy Needed 7801
        Story.killQuest(7801, "memetnightmare", "Eye Wyrm");

        // Audition the Wyrms 7802
        Story.killQuest(7802, "memetnightmare", "Eye Wyrm");

        // Killer Beats 7803
        Story.killQuest(7803, "memetnightmare", "Nightmare Maw");

        // Stop the Storm 7804
        Story.killQuest(7804, "memetnightmare", ["Fire Cyclone", "Burning Ember"]);

        // Cannibal Mermaids? 7805
        Story.killQuest(7805, "memetnightmare", "Scuttlefish");

        // Infiltrate the Mermaids 7806
        Story.killQuest(7806, "memetnightmare", "Cannibal Mermaid");

        // Lighten the Despair 7807
        Story.killQuest(7807, "memetnightmare", "Dark Pit of Despair");

        // Quiet Down, Will Ya? 7808
        Story.killQuest(7808, "memetnightmare", ["Fire Cyclone", "Burning Ember", "Cannibal Mermaid"]);
    }

    nightmareWar(): void {
        if (Core.isCompletedBefore(7813) || !Core.isSeasonalMapActive("nightmarewar")) {
            return;
        }

        this.memetNightmare();

        Story.preLoad(this.nightmareWar);

        // Murderbug Medal 7809
        Story.killQuest(7809, "nightmarewar", "Zombie Cicada");

        // Mega Murderbug Medal 7810
        Story.killQuest(7810, "nightmarewar", "Zombie Cicada");

        // Elemental Medal 7811
        Story.killQuest(7811, "nightmarewar", "Storm Core");

        // Mega Elemental Medal 7812
        Story.killQuest(7812, "nightmarewar", "Storm Core");

        // Fire Tornado 7813
        Story.killQuest(7813, "nightmarewar", "THIS YEAR");
    }

    epilTakeOver(): void {
        if (
            (Core.isCompletedBefore(8953) && Core.isCompletedBefore(8970)) ||
            !Core.isSeasonalMapActive("EbilTakeOver")
        ) {
            return;
        }

        Story.preLoad(this.epilTakeOver);

        // Turning Traitor 8937
        Story.killQuest(8937, "ebiltakeover", "Traitor Goon");

        // Bait and Switch 8938
        Story.mapItemQuest(8938, "ebiltakeover", 10859, 4);

        // Fishman Flop 8939
        Story.killQuest(8939, "ebiltakeover", "Ebil Fishman");

        // Chief Fish Marketing Officer 8940
        Story.killQuest(8940, "ebiltakeover", "Ebil Kuro");

        //Slime Time 8941
        Story.killQuest(8941, "ebiltakeover", "EbilCorp Slime");

        //Keycard Access 8942
        Story.killQuest(8942, "ebiltakeover", "Traitor Goon");

        //Lay Offs 8943
        Story.killQuest(8943, "ebiltakeover", "EbilCorp Slime");

        // Human Remains Officer 8945
        Story.killQuest(8945, "ebiltakeover", "Ebil Jack Sprat");

        //Traitor Traps 8946
        Story.mapItemQuest(8946, "ebiltakeover", 10860, 5);

        //Drones and Drones 8947
        Story.killQuest(8947, "ebiltakeover", ["Ebil Battle Drone", "Traitor Goon"]);

        //Tech Collection 8948
        Story.killQuest(8948, "ebiltakeover", "Ebil Battle Drone");

        // General General 8949
        Story.killQuest(8949, "ebiltakeover", "Ebil General Porkon");

        //Variety Is The Spice Of Life 8950
        Story.killQuest(8950, "ebiltakeover", ["Ebil Fishman", "EbilCorp Slime", "Ebil Battle Drone"]);

        //Draconian Destruction 8951
        Story.killQuest(8951, "ebiltakeover", "Ebil Draconian");

        //Final Notice 8952
        Story.killQuest(8952, "ebiltakeover", "Traitor Goon");

        // Chief Immolation Officer 8953
        Story.killQuest(8953, "ebiltakeover", "Ebil Red Dragon");

        // Devil’s Food 8967
        Story.killQuest(8967, "ebiltakeover", "Ebil Ghoul");

        // Sample Processing 8968
        Story.killQuest(8968, "ebiltakeover", ["Traitor Goon", "Ebil Fishman"]);

        // What's That Smell 8969
        Story.killQuest(8969, "ebiltakeover", "Mystery Meat");

        // Mystery Solved 8970
        Story.killQuest(8970, "ebiltakeover", "Smorgasbord");
    }

    birdsWithHarms(): void {
        if (Core.isCompletedBefore(8992) || !Core.isSeasonalMapActive("birdswithharms")) {
            return;
        }

        Story.preLoad(this.birdsWithHarms);

        // 8972 Angriest Birds
        Story.mapItemQuest(8972, "birdswithharms", [10913, 10924]);

        // 8973 Harms in Arms
        if (!Story.questProgression(8973)) {
            Core.ensureAccept(8973);
            Core.huntMonster("birdswithharms", "Birdbarian", "Birdbarian Weapon", 1, { log: false });
            Core.huntMonster("birdswithharms", "Fencing Finch", "Finch Weapon", 1, { log: false });
            Core.huntMonster("birdswithharms", "Unsettling Sparrow", "Sparrow Weapon", 1, { log: false });
            Core.huntMonster("birdswithharms", "Robber Ducky", "Ducky Weapon", 1, { log: false });
            Core.ensureComplete(8973);
        }

        // 8974 Literal Arms Dealer
        Story.mapItemQuest(8974, "birdswithharms", 10914);

        // 8975 What the Duck?
        Story.mapItemQuest(8975, "birdswithharms", 10915);

        // 8976 Like Feather, Like Son
        if (!Story.questProgression(8976)) {
            Core.ensureAccept(8976);
            Core.huntMonster("birdswithharms", "Birdbarian", "Birdbarian Feather", 1, { log: false });
            Core.huntMonster("birdswithharms", "Fencing Finch", "Finch Feather", 1, { log: false });
            Core.huntMonster("birdswithharms", "Unsettling Sparrow", "Sparrow Feather", 1, { log: false });
            Core.huntMonster("birdswithharms", "Robber Ducky", "Ducky Feather", 1, { log: false });
            Core.huntMonster("birdswithharms", "Swole Swan", "Swan Feather", 1, { log: false });
            Core.ensureComplete(8976);
        }

        // 8977 Literal Arms Dealer
        Story.mapItemQuest(8977, "birdswithharms", 10916);

        // 8978 Sketchy Dead Parrot
        Story.mapItemQuest(8978, "birdswithharms", 10922);

        // 8979 Hoo Are You?
        Story.mapItemQuest(8979, "birdswithharms", 10917);

        // 8980 Bully Birdies
        Story.mapItemQuest(8980, "birdswithharms", 10918, 6);
        Story.killQuest(8980, "birdswithharms", "Bully Owl");

        // 8981 Hoo Are You?
        Story.mapItemQuest(8981, "birdswithharms", 10919, 2);
        Story.killQuest(8981, "birdswithharms", "Knight Owl");

        // 8982 Hoodini's Magic Act
        Story.killQuest(8982, "birdswithharms", "Hoodini");

        // 8983 Owl Give You the Answer
        Core.buyItem("birdswithharms", 2183, "Stunned?! Parrot");
        Story.mapItemQuest(8983, "birdswithharms", 10923);

        // 8984 Down Feather Up to No Good
        Story.mapItemQuest(8984, "birdswithharms", 10920);

        // 8985 United We Stand, Divided We Fowl
        Story.killQuest(8985, "birdswithharms", "Turkonian");

        // 8986 Race against the Cluck
        Story.killQuest(8986, "birdswithharms", "Schwarzenegger");

        // 8987 Without Feather Ado
        Story.killQuest(8987, "birdswithharms", "Turking");

        // 8992 No Egrets Badge
        Core.equipClass(ClassType.Farm);
        Core.ensureAccept(8992);
        Core.huntMonster("birdswithharms", "Unsettling Sparrow", "Ruffled Feather", 1000, {
            isTemp: false,
            log: false,
        });
        Core.ensureComplete(8992);
    }

    ebilCorpHQ(): void {
        if (Core.isCompletedBefore(8407)) {
            return;
        }

        Story.preLoad(this.ebilCorpHQ);

        // Ziri's Contract 8398
        Story.killQuest(8398, "ebilcorphq", "Ziri");

        // Alina's Contract 8399
        Story.killQuest(8399, "ebilcorphq", "Alina");

        // Victoria's Contract 8400
        Story.killQuest(8400, "ebilcorphq", "Victoria");

        // Nulgath's ...Contract? 8401
        Story.killQuest(8401, "ebilcorphq", "Nulgath");

        // Dage's Contract 8402
        Story.killQuest(8402, "ebilcorphq", "Dage the Evil");

        // Swaggy's Contract 8403
        Story.killQuest(8403, "ebilcorphq", "Swaggy");

        // Cysero's Contract 8404
        Story.killQuest(8404, "ebilcorphq", "Cysero");

        // Gravelyn's Contract 8405
        Story.killQuest(8405, "ebilcorphq", "Gravelyn");

        // Server Room Access 8406
        if (!Story.questProgression(8406)) {
            Core.ensureAccept(8406);
            Core.huntMonster("ebilcorphq", "EbilCorp Goon", "Goon Defeated", 10);
            Core.huntMonster("ebilcorphq", "EbilCorp Security", "Server Room Key", 1);
            Core.ensureComplete(8406);
        }

        // The M.C.P 8407
        Story.killQuest(8407, "ebilcorphq", "Master Chairman");
    }

    blightHarvest(): void {
        if (Core.isCompletedBefore(9481) || !Core.isSeasonalMapActive("blightharvest")) {
            return;
        }

        Story.preLoad(this.blightHarvest);

        //#region Useable Monsters
        const UseableMonsters = [
            "Cursed Corn", // UseableMonsters[0],
            "Tantalocust", // UseableMonsters[1],
            "Scales of Greed", // UseableMonsters[2],
            "Fear Gorta", // UseableMonsters[3],
            "Famine", // UseableMonsters[4]
        ];
        //#endregion Useable Monsters
        // 9472 | Bug Blight
        if (!Story.questProgression(9472)) {
            Story.mapItemQuest(9472, "blightharvest", 12334);
            Story.killQuest(9472, "blightharvest", UseableMonsters[0]);
        }

        // 9473 | Struggle Soup
        if (!Story.questProgression(9473)) {
            Story.mapItemQuest(9473, "blightharvest", 12335);
            Story.killQuest(9473, "blightharvest", UseableMonsters[1]);
        }

        // 9474 | Fetid Feast
        if (!Story.questProgression(9474)) {
            Story.mapItemQuest(9474, "blightharvest", 12336, 3);
            Story.killQuest(9474, "blightharvest", [UseableMonsters[0], UseableMonsters[1]]);
        }

        // 9475 | Dire Disparity
        Story.mapItemQuest(9475, "blightharvest", [12337, 12338]);

        // 9476 | Balancing Crumbs
        if (!Story.questProgression(9476)) {
            Core.huntMonsterQuest(9476, ["blightharvest", UseableMonsters[2], ClassType.Solo]);
        }

        // 9477 | Harrowing Hike
        if (!Story.questProgression(9477)) {
            Story.mapItemQuest(9477, "blightharvest", 12339);
            Story.killQuest(9477, "blightharvest", UseableMonsters[3]);
        }

        // 9478 | Down the Grapevine
        Story.mapItemQuest(9478, "blightharvest", [12340, 12341]);

        // 9479 | Hungry Hive
        if (!Story.questProgression(9479)) {
            Core.huntMonsterQuest(9479, "blightharvest", UseableMonsters[1]);
        }

        // 9480 | Acrid Abundance
        if (!Story.questProgression(9480)) {
            Story.mapItemQuest(9480, "blightharvest", 12342);
            Story.killQuest(9480, "blightharvest", [UseableMonsters[1], UseableMonsters[3]]);
        }

        // 9481 | Keeper of the Scales
        if (!Story.questProgression(9481)) {
            Core.huntMonsterQuest(9481, ["blightharvest", UseableMonsters[4], ClassType.Solo]);
        }
    }

    manaHarvest(): void {
        if (Core.isCompletedBefore(9974) || !Core.isSeasonalMapActive("manaharvest")) {
            return;
        }

        Story.preLoad(this.manaHarvest);

        // 9966 | Philosopher's Pumpkin
        Story.mapItemQuest(9966, "manaharvest", 13837);
        Story.killQuest(9966, "manaharvest", this.umManaHarvest[0]);

        // 9967 | Cosmic Surprise
        if (!Story.questProgression(9967)) {
            Core.huntMonsterQuest(9967, ["manaharvest", this.umManaHarvest[1], ClassType.Farm]);
        }

        // 9968 | Early Birds
        Story.mapItemQuest(9968, "manaharvest", [13838, 13839]);

        // 9969 | Impossible Meat
        Story.mapItemQuest(9969, "manaharvest", 13840);
        Story.killQuest(9969, "manaharvest", this.umManaHarvest[2]);

        // 9970 | Forbidden Fruit
        Story.mapItemQuest(9970, "manaharvest", 13841);
        Story.killQuest(9970, "manaharvest", this.umManaHarvest[3]);

        // 9976 | Mananania
        if (!Story.questProgression(9976)) {
            Core.huntMonsterQuest(9976, ["manaharvest", this.umManaHarvest[4], ClassType.Farm]);
        }

        // 9971 | How the Cookie Crumbles
        if (!Story.questProgression(9971)) {
            Core.huntMonsterQuest(9971, ["manaharvest", this.umManaHarvest[5], ClassType.Farm]);
        }

        // 9972 | Everything Burger
        if (!Story.questProgression(9972)) {
            Core.huntMonsterQuest(9972, ["manaharvest", this.umManaHarvest[6], ClassType.Farm]);
        }

        // 9973 | Pretend You Don't See Anything
        Story.mapItemQuest(9973, "manaharvest", [13842, 13843]);

        // 9974 | Coiled Cornucopia
        if (!Story.questProgression(9974)) {
            Core.huntMonsterQuest(9974, ["manaharvest", this.umManaHarvest[7], ClassType.Solo]);
        }
    }

    moglinFeast(): void {
        if (Core.isCompletedBefore(10497) || !Core.isSeasonalMapActive("moglinfeast")) {
            return;
        }

        Story.preLoad(this.moglinFeast);

        //#region Useable Monsters
        const UseableMonsters = [
            "Dianthus Fae", // UseableMonsters[0],
            "Pumpkin Mimic", // UseableMonsters[1],
            "Hay Fever Sylph", // UseableMonsters[2],
            "Redcap Mush", // UseableMonsters[3],
            "Fall Fae Queen", // UseableMonsters[4]
        ];
        //#endregion Useable Monsters
        // 10489 | Magical Ladies
        if (!Story.questProgression(10489)) {
            Story.mapItemQuest(10489, "moglinfeast", 15189);
            Core.huntMonsterQuest(10489, ["moglinfeast", UseableMonsters[0], ClassType.Farm]);
        }

        // 10490 | Baby Boo Pumpkins
        if (!Story.questProgression(10490)) {
            Story.mapItemQuest(10490, "moglinfeast", 15190);
            Core.huntMonsterQuest(10490, ["moglinfeast", UseableMonsters[1], ClassType.Farm]);
        }

        // 10491 | Vegetarian Fricassee
        if (!Story.questProgression(10491)) {
            Core.ensureAccept(10491);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("moglinfeast", "Dianthus Fae", "Dianthus Pollen", 10);
            Core.huntMonster("moglinfeast", "Pumpkin Mimic", "Peeled Mimic", 5);
            Core.ensureComplete(10491);
        }

        // 10492 | No Thoughts, Head Empty
        if (!Story.questProgression(10492)) {
            Story.mapItemQuest(10492, "moglinfeast", 15191, 6);
        }

        // 10493 | Fluid Displacement
        if (!Story.questProgression(10493)) {
            Core.ensureAccept(10493);
            Story.mapItemQuest(10493, "moglinfeast", 15192);
            Core.huntMonster("moglinfeast", UseableMonsters[2], "Golden Blooms", 40);
            Core.ensureComplete(10493);
        }

        // 10494 | Sir-Tainly Prepared
        if (!Story.questProgression(10494)) {
            Story.mapItemQuest(10494, "moglinfeast", 15193);
            Core.huntMonsterQuest(10494, ["moglinfeast", UseableMonsters[3], ClassType.Farm]);
        }

        // 10495 | Main Entree
        if (!Story.questProgression(10495)) {
            Story.mapItemQuest(10495, "moglinfeast", 15194, 6);
        }

        // 10496 | Putrid Potpourri
        if (!Story.questProgression(10496)) {
            Core.ensureAccept(10496);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("moglinfeast", "Hay Fever Sylph", "Sylph Pollen", 8);
            Core.huntMonster("moglinfeast", "Redcap Mush", "Sauteed Mush", 8);
            Core.ensureComplete(10496);
        }

        // 10497 | Fairy Foray
        if (!Story.questProgression(10497)) {
            Core.huntMonsterQuest(10497, ["moglinfeast", UseableMonsters[4], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new CoreHarvestDay();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
