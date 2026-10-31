/*
name: Frostvale All Stories
description: This will finish the entire frostvale storylines.
tags: frostvale-story, seasonal, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/Story/CoreFrostvale.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Alignment, ClassType, Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";
import { GlaceraStory } from "../../../story/Glacera";

const Story = new CoreStory();
const glaceraStory = new GlaceraStory();

export class CoreFrostvale {
    doAll(SwordofHope = false, IcyHolly = false): void {
        if (!Core.isSeasonalMapActive("frostvale")) {
            Core.logger(
                `it is Currently ${new Date(Date.now()).toLocaleString("en-US", { month: "long" })}, The Maps Will Be out In December, as per the Design Notes.`,
            );
            return;
        }

        this.iceCave();
        this.snowGlobe();
        this.alpine();
        this.snowyVale();
        this.iceRise();
        this.coldWindValley();
        this.battlefield();
        //Frsotval Barb ends here
        this.darkwinter();
        this.frozensoul();
        this.howardshill();
        this.icerisepast();
        this.winterhorror();
        //Gifthulu();
        this.cryostorm();
        this.icewindpass();
        this.icepike();
        this.frostvalPastPresentandFuture();
        this.snowview();
        this.snowviewRace();
        this.deerHunt();
        this.bowJangles();
        this.glaceTomb();
        this.fimbultomb();
        this.mountOtzi();
        this.otziwar();
        this.holidayHotel();
        this.holidayHorror();
        this.frostvalGala();
        this.unsungNecropolis();
    }

    iceCave(): void {
        if (Core.isCompletedBefore(906) || !Core.isSeasonalMapActive("icecave")) {
            return;
        }

        Story.preLoad(this.iceCave);

        // Rescue Blizzy
        Story.killQuest(155, "icecave", "Frosty");

        // Scary Snow Men
        Story.killQuest(156, "icecave", "Snow Golem");

        // Moglin Popsicles
        Story.killQuest(157, "icecave", "Frozen Moglin");

        // Crystal Spider
        Story.killQuest(158, "icecave", "Ice Spider");

        // Fluffy Bears
        Story.killQuest(159, "icecave", "Polar Bear");

        // Blue Eyed Beast
        Story.killQuest(160, "icecave", "Frost Dragon");

        // Trouble Makers
        Story.killQuest(161, "factory", "Sneevil Toy Maker");

        // Bad Ice Cream
        Story.killQuest(162, "factory", "Snow Golem");

        // Greedy Sneevil
        Story.killQuest(163, "factory", "Ebilsneezer");

        // Shadow Figure
        Story.killQuest(164, "frost", "FrostScythe");

        // 'Twas the night before Frostval
        Story.killQuest(456, "icecave", "Frosty");

        // Find Page 2
        Story.mapItemQuest(457, "yulgar", 85);
        Story.killQuest(457, "icecave", "Frozen Moglin");

        // Find Page 3
        Story.mapItemQuest(458, "battleontown", 86);
        Story.killQuest(458, "icecave", "Frozen Moglin");

        // Find Page 4
        Story.killQuest(459, "factory", "Sneevil Toy Maker");

        // Find Page 5
        Story.killQuest(460, "northlandlight", "Santy Claws");

        // Find Page 6
        Story.mapItemQuest(461, "battleontown", 87);
        Story.killQuest(461, "icecave", "Frozen Moglin");

        // Spirit Abducted
        Story.chainQuest(905);
    }

    snowGlobe(): void {
        if (Core.isCompletedBefore(1508) || !Core.isSeasonalMapActive("snowglobe")) {
            return;
        }
        if (!Core.isCompletedBefore(905)) {
            this.iceCave();
        }

        Story.preLoad(this.snowGlobe);

        // Shaking the Globes
        Story.mapItemQuest(906, "snowglobe", 243, 10);
        Story.killQuest(906, "snowglobe", "Snow Golem");

        //A Demonstration
        Story.killQuest(907, "snowglobe", "Snow Golem");

        // Hearts of Ice
        Story.killQuest(908, "snowglobe", "snowman Soldier");

        // Defeat Garaja
        Story.killQuest(909, "snowglobe", "Garaja");

        // Springing Traps
        Story.mapItemQuest(910, "goldenruins", 244, 10);
        Story.killQuest(910, "goldenruins", "Golden Warrior");

        // Frost Lions
        Story.killQuest(911, "goldenruins", "Frost Lion");

        // Onslaught Keyrings
        Story.killQuest(912, "goldenruins", "Golden Warrior");

        // Defeat Lionfang
        Story.killQuest(913, "goldenruins", "Maximillian Lionfang");
    }

    alpine(): void {
        if (Core.isCompletedBefore(1521) || !Core.isSeasonalMapActive("alpine")) {
            return;
        }

        if (!Core.isCompletedBefore(913)) {
            this.snowGlobe();
        }

        Story.preLoad(this.alpine);

        // Snow Way to Know Where to Go
        Story.mapItemQuest(1508, "alpine", 758);

        // Arming the Undead Army
        Story.killQuest(1509, "alpine", "Glacier Mole");

        // Cold As A Corpse
        Story.mapItemQuest(1510, "alpine", 759, 10);

        // Pretty Pretty Undead Princess Decor
        Story.mapItemQuest(1511, "alpine", 760, 13);

        // Deadfying Frost Lions
        Story.killQuest(1512, "alpine", "Frost Lion");

        // Defiant Undead Deserters
        Story.killQuest(1516, "alpine", "Frozen Deserter");

        // Forest Guadian Gauntlet
        Story.killQuest(1513, "alpine", "Wendigo");

        // Snow Turning Back!
        Story.mapItemQuest(1519, "icevolcano", 761, 10);
        Story.killQuest(1519, "icevolcano", ["Snow Golem", "Dead-ly Ice Elemental"]);

        // Venom in Your Veins
        Story.killQuest(1520, "icevolcano", "Ice Symbiote");

        // Song of the Frozen Heart
        Story.killQuest(1521, "icevolcano", "Dead Morice");
    }

    snowyVale(SwordofHope = false): void {
        if (Core.isCompletedBefore(2576) || !Core.isSeasonalMapActive("snowyvale")) {
            return;
        }
        if (!Core.isCompletedBefore(1521)) {
            this.alpine();
        }

        Story.preLoad(this.snowyVale);

        Core.addDrop("Ray of Hope", "Sands of Time");

        // Locate Kezeroth
        Story.mapItemQuest(2522, "snowyvale", 1584);

        // Chronoton Detection
        Story.killQuest(2523, "snowyvale", "Polar Golem");

        // Core Knowledge
        Story.mapItemQuest(2524, "snowyvale", 1585, 6);

        // Temporal Revelation
        Story.mapItemQuest(2525, "snowyvale", 1586);

        // Before the Darkest Hour - Will continue after the QuestComplete tries end (idk how many it is but y[e])
        // if (!Story.QuestProgression(2526))
        // {
        //     Core.EnsureAccept(2526);
        //     Core.Join("frostdeep");
        //     Bot.Wait.ForMapLoad("frostdeep");
        //     Core.GetMapItem(1587, 1, "frostdeep");
        //     Core.EnsureComplete(2526);
        // }
        Story.mapItemQuest(2526, "frostdeep", 1587, undefined, { autoCompleteQuest: false });

        // Heart of Ice
        Story.killQuest(2527, "frostdeep", ["Polar Elemental", "Polar Golem"]);

        // Absolute Zero Success
        Story.killQuest(2528, "frostdeep", ["Polar Golem", "Temple Prowler", "Polar Elemental"]);

        // Dirty Secret
        Story.killQuest(2529, "frostdeep", ["Temple Prowler", "Polar Mole"]);

        // Frozen Venom
        Story.killQuest(2530, "frostdeep", ["Polar Spider", "Polarwyrm Rider"]);

        // Rune-ing His Plan
        Story.killQuest(2531, "frostdeep", "Ancient Golem");

        // Deadly Beauty
        Story.killQuest(2532, "frostdeep", ["Polar Golem", "Polar Elemental", "Polar Golem"]);

        // Cold-Hearted Trophies
        Story.killQuest(2533, "frostdeep", ["Polar Mole", "Temple Prowler", "Temple Prowler"]);

        // Warmth in the Cold
        Story.killQuest(2534, "frostdeep", ["Temple Spider", "Temple Maggot"]);

        // Icy Prizes
        Story.killQuest(2535, "frostdeep", ["Temple Prowler", "Temple Maggot"]);

        // Fading Magic - may bug out as its 2 items from 1 mob if the delay doesnt work idfk, doesnt work as a string[] as it gets the sand drop
        if (!Story.questProgression(2536)) {
            Core.ensureAccept(2536);
            Core.huntMonster("frostdeep", "Ancient Golem", "Sands of Time", 6);
            Core.huntMonster("frostdeep", "Ancient Golem", "Obsidian Key", 2);
            Core.ensureComplete(2536);
        }

        // FrostDeep Dwellers
        Story.killQuest(2537, "frostdeep", ["Polarwyrm Rider", "Polar Mole", "Polar Mole"]);

        // A Breather
        Story.killQuest(2538, "frostdeep", ["Polar Mole", "Temple Spider", "Polar Spider"]);

        // Raiders From FrostDeep
        Story.killQuest(2539, "frostdeep", ["Polar Draconian", "Temple Maggot"]);

        // 8 Legged Frost Freaks
        Story.killQuest(2540, "frostdeep", ["Temple Spider", "Polar Spider"]);

        // Freezing the Stone
        Story.killQuest(2541, "frostdeep", ["Ancient Golem", "Ancient Golem"]);

        // Can You Feel the Chill Tonight?
        Story.killQuest(2542, "frostdeep", ["Temple Prowler", "Polar Elemental", "Polar Elemental"]);

        // Shrouded in Ice
        Story.killQuest(2543, "frostdeep", ["Ancient Maggot", "Ancient Maggot"]);

        // Hard Fight for a Cold Truth
        Story.killQuest(2544, "frostdeep", ["Ancient Prowler", "Ancient Prowler"]);

        // Sand and Shardin' Bones
        Story.killQuest(2545, "frostdeep", ["Ancient Mole", "Ancient Mole"]);

        // Older and Colder
        Story.killQuest(2546, "frostdeep", ["Ancient Prowler", "Ancient Maggot", "Ancient Mole"]);

        // The Sword Of Hope
        Story.killQuest(2547, "frostdeep", ["Ancient Terror", "Ancient Terror"]);
    }

    iceRise(): void {
        if (Core.isCompletedBefore(2582) || !Core.isSeasonalMapActive("icerise")) {
            return;
        }
        if (!Core.isCompletedBefore(2547)) {
            this.snowyVale();
        }

        Story.preLoad(this.iceRise);

        // A Little Warmth and Light
        Story.mapItemQuest(2576, "icerise", 1592, 5);

        // Behind Locked Doors
        Story.mapItemQuest(2577, "icerise", 1593);

        // The Lost Key
        Story.killQuest(2578, "icerise", "Polar Golem");

        // Uncovering Pages Of The Past
        Story.killQuest(2579, "icerise", ["Polar Golem", "Arctic DireWolf", "Polar Elemental"]);

        // We Know Where To Look
        Story.killQuest(2580, "icerise", ["Arctic DireWolf", "Polar Elemental", "Polar Golem"]);

        // A Terrible Hiding Place
        Story.killQuest(2581, "icerise", "Arctic DireWolf");

        // Face Kezeroth!
        Story.killQuest(2582, "icerise", "Kezeroth");
    }

    coldWindValley(): void {
        if (Core.isCompletedBefore(6132) || !Core.isSeasonalMapActive("coldwindvalley")) {
            return;
        }
        if (!Core.isCompletedBefore(2582)) {
            this.iceRise();
        }

        Story.preLoad(this.coldWindValley);

        // Help Blizzy
        Story.mapItemQuest(6122, "coldwindvalley", 5547);
        Story.mapItemQuest(6122, "coldwindvalley", 5548);
        Story.mapItemQuest(6122, "coldwindvalley", 5549);
        Story.mapItemQuest(6122, "coldwindvalley", 5550);

        // Gather Ammunition
        Story.killQuest(6123, "coldwindvalley", "Hail Elemental");

        // Arm the Mob
        if (!Story.questProgression(6124)) {
            Core.ensureAccept(6124);
            Core.getMapItem(5551, 5, "coldwindvalley");
            Core.huntMonster("farm", "Scarecrow", "Pitchforks", 5);
            Core.ensureComplete(6124);
        }

        // Gather Bait
        Story.killQuest(6125, "coldwindvalley", "Arctic Wolf");

        // Bait the Trap
        Story.mapItemQuest(6126, "coldwindvalley", 5552);
        Story.killQuest(6126, "coldwindvalley", "Ice Master Yeti");

        // Gather Snowman Pieces
        Story.mapItemQuest(6127, "coldwindvalley", 5553, 2);
        Story.killQuest(6127, "coldwindvalley", "Snow Golem");

        // Gather Snowman Decorations
        Story.mapItemQuest(6128, "coldwindvalley", 5554);
        Story.killQuest(6128, "coldwindvalley", "Coal Imp");

        // Grab some Garb
        Story.killQuest(6129, "coldwindvalley", "Frost Goblin");

        // Bait and Gifts
        Story.mapItemQuest(6130, "coldwindvalley", 5555);

        // Check out the Cave
        Story.mapItemQuest(6131, "coldwindvalley", 5556);
        Story.killQuest(6131, "coldwindvalley", "Arctusk");

        // Holly and Ice
        if (!Story.questProgression(6132)) {
            Core.ensureAccept(6132);
            Core.getMapItem(5557, 8, "coldwindvalley");
            Core.huntMonster("coldwindvalley", "Snow Golem", "Elemental Ice", 5);
            Core.ensureComplete(6132);
        }
    }

    battlefield(ReturnEarly = false): void {
        if (Core.isCompletedBefore(2575) || !Core.isSeasonalMapActive("battlefield")) {
            return;
        }
        if (!Core.isCompletedBefore(6132)) {
            this.coldWindValley();
        }

        Story.preLoad(this.battlefield);

        // Mana for the Magi 2570
        Story.killQuest(2570, "newbie", "Slime", { getReward: false });
        if (ReturnEarly) {
            return;
        }

        // Gathering Spell Components 2571
        Story.killQuest(2571, "hydra", "Fire Imp", { getReward: false });

        // Looking for Loggers 2572
        Story.killQuest(2572, "farm", "Treeant", { getReward: false });

        // Ballista Cables 2573
        Story.killQuest(2573, "orctown", "Horc Warrior", { getReward: false });

        // Arrowheads for Archers 2574
        Story.killQuest(2574, "yokairiver", "Kappa Ninja", { getReward: false });

        // Fetching Fletching Feathers 2575
        Story.killQuest(2575, "creatures", "Red Bird", { getReward: false });
    }

    darkwinter(): void {
        if (Core.isCompletedBefore(3260) || !Core.isSeasonalMapActive("darkwinter")) {
            return;
        }
        if (!Core.isCompletedBefore(2575)) {
            this.battlefield();
        }

        //Good way | Yorumi & Einyuki Questline
        Core.changeAlignment(Alignment.Good);

        Story.preLoad(this.darkwinter);

        // Feed the Greed 3217
        Story.killQuest(3217, "darkwinter", ["Blighted Moglin", "White Stalker", "Blighted Moglin"]);
        // if (!Story.QuestProgression(3217))
        // {
        //     Core.EnsureAccept(3217);
        //     Core.HuntMonster("darkwinter", "Blighted Moglin", "Frostval Gift", 5);
        //     Core.HuntMonster("darkwinter", "White Stalker", "Frostval Decoration", 5);
        //     Core.HuntMonster("darkwinter", "Blighted Moglin", "Frostval Dessert", 5);
        //     Core.EnsureComplete(3217);
        // }

        // Sleet Samples 3218
        Story.killQuest(3218, "darkwinter", "White Stalker");

        // Blighted Deer 3219
        Story.killQuest(3219, "darkwinter", "Blighted Deer");

        // Frosty Hearts 3220
        Story.killQuest(3220, "darkwinter", "Ice Golem");

        // On the Offensive 3221
        Story.killQuest(3221, "darkwinter", "Legion Minion");

        // Inoculation 3222
        Story.mapItemQuest(3222, "darkwinter", [2280, 2281], 6);

        // A Different Way 3223
        Story.killQuest(3223, "darkwinter", "Blighted Deer");

        // Breaking In 3257
        Story.mapItemQuest(3257, "darkwinter", 2315);

        // Break the Barrier 3258
        Story.killQuest(3258, "darkwinter", "Ice Golem");

        // The Final Ward 3259
        Story.killQuest(3259, "darkwinter", "Frost Golem");

        // Defeat Frostfang (Good) 3260 /Evil is the same
        Story.killQuest(3260, "darkwinter", "Frost Fang");
    }

    frozensoul(): void {
        if (Core.isCompletedBefore(7264) || !Core.isSeasonalMapActive("frozensoul")) {
            return;
        }
        if (!Core.isCompletedBefore(3260)) {
            this.darkwinter();
        }

        Story.preLoad(this.frozensoul);

        // Looks like quest is not unlocked behind anything
        // Ice Cold Killer 7262
        Story.killQuest(7262, "frozensoul", "Frozen Minion", { getReward: false });

        // Get Jacked 7263
        Story.killQuest(7263, "frozensoul", "Jack Frost", { getReward: false });

        // Shatter the FrozenSoul Queen 7264
        Story.killQuest(7264, "frozensoul", "FrozenSoul Queen", { getReward: false });
    }

    howardshill(): void {
        if (Core.isCompletedBefore(7854) || !Core.isSeasonalMapActive("howardshill")) {
            return;
        }
        if (!Core.isCompletedBefore(7264)) {
            this.frozensoul();
        }

        Story.preLoad(this.howardshill);

        // Blizzy's
        // Find the Source 7843
        Story.mapItemQuest(7843, "howardshill", 7921);
        Story.killQuest(7843, "howardshill", "Frozen Wisp");

        // Try the Door 7844
        Story.mapItemQuest(7844, "howardshill", 7922);

        // Find the Key 7845
        Story.killQuest(7845, "howardshill", "Frozen Treeant");

        //Howard's
        // Till the Ground 7846
        Story.killQuest(7846, "howardshill", "FrostBite");

        // Beautiful Blossoms 7847
        Story.killQuest(7847, "howardshill", "Chillybones");

        // Moldy Trees 7848
        Story.killQuest(7848, "howardshill", "Frozen Treeant");

        // Ichor for Elixir 7849
        Story.killQuest(7849, "howardshill", "Chillybones");

        // Frozen Tears 7850
        Story.killQuest(7850, "howardshill", "Chillybones");

        // Keep them Away 7851
        Story.killQuest(7851, "howardshill", "FrostBite");

        // Light up the Darkness 7852
        Story.killQuest(7852, "howardshill", "Frozen Wisp");

        // Return to Blizzy 7853
        Story.mapItemQuest(7853, "howardshill", 7924);
        Story.killQuest(7853, "howardshill", "Chillybones");

        // Howard's Grief 7854
        Story.killQuest(7854, "howardshill", "Howard's Grief");
    }

    icerisepast(): void {
        if (!Core.isMember || Core.isCompletedBefore(3904) || !Core.isSeasonalMapActive("Icerisepast")) {
            return;
        }
        if (!Core.isCompletedBefore(7854)) {
            this.howardshill();
        }

        Story.preLoad(this.icerisepast);

        // Through the pass 3899
        Story.killQuest(3899, "icerisepast", "Ice Wolf");

        // Higher Passes 3900
        Story.killQuest(3900, "icerisepast", ["Ice Bear", "Ice Bear", "Ice Bear"]);

        // Bears? 3901
        Story.mapItemQuest(3901, "icerisepast", 2987);

        // In the Den 3902
        Story.killQuest(3902, "icerisepast", "Guard Drumlin");

        // The Camp 3903
        if (!Story.questProgression(3903)) {
            Core.ensureAccept(3903);
            Core.killMonster("icerisepast", "r7", "Left", "Drumlin", "Inhabitant found", 7);
            Core.ensureComplete(3903);
        }

        // Fire from the Hole 3904
        if (!Story.questProgression(3904)) {
            Core.ensureAccept(3904);
            Core.huntMonster("icerisepast", "Ice Drumlinster", "Ice Drumlinster Defeated");
            Core.ensureComplete(3904);
        }
    }

    winterhorror(): void {
        if (Core.isCompletedBefore(7859) || !Core.isSeasonalMapActive("winterhorror")) {
            return;
        }
        if (!Core.isCompletedBefore(3904)) {
            this.icerisepast();
        }

        Story.preLoad(this.winterhorror);

        // Monster Gems  7856 && Mega Monster Gems 7857
        if (!bot.quests.isUnlocked(7858)) {
            Core.ensureAcceptmultiple(7856, 7857);
            Core.killMonster("winterhorror", "Enter", "Spawn", "*", "Monster Gem", 5);
            Core.ensureComplete(7856);
            Core.killMonster("winterhorror", "Enter", "Spawn", "*", "Mega Monster Gem", 3);
            Core.ensureComplete(7857);
        }

        // Oh Heck! 7858
        Story.killQuest(7858, "winterhorror", "Arthur and Elise");

        // He's Ragin' 7859
        Story.killQuest(7859, "winterhorror", "Howard's Rage");
    }

    gifthulu(): void {
        if (!Core.isSeasonalMapActive("gifthulu")) {
            return;
        }
        //Not avaiable
        //There is no quests over here
    }

    cryostorm(): void {
        if (!bot.quests.isUnlocked(4705)) {
            Core.logger("Quests are locked. Running Glacera Script.");
            glaceraStory.doAll();
        }

        if (Core.isCompletedBefore(4716) || !Core.isSeasonalMapActive("cryostorm")) {
            return;
        }

        Story.preLoad(this.cryostorm);

        // Plans for Frostval
        if (!Story.questProgression(4705)) {
            Core.ensureAccept(4705);
            Core.getMapItem(4069, 1, "cryostorm");
            Core.getMapItem(4070, 1, "cryostorm");
            Core.huntMonster("cryostorm", "Glacial Elemental", "Snowglobe Shard", 10);
            Core.ensureComplete(4705);
        }

        // Find the Missing Presents
        Story.mapItemQuest(4706, "cryostorm", 4067, 8);

        // More Gifts
        if (!Story.questProgression(4707)) {
            Core.ensureAccept(4707);
            Core.huntMonster("cryostorm", "Glacial Wolf", "Cloth Found", 7);
            Core.huntMonster("cryostorm", "Cryo Mammoth", "Fur Found", 3);
            Core.huntMonster("cryostorm", "Glacial Elemental", "Glacial Frostvale Bells", 5);
            Core.ensureComplete(4707);
        }

        // Warmth for the Small
        Story.killQuest(4708, "cryostorm", "Glacial Wolf");

        // Cut Down the Tree
        if (!Story.questProgression(4709)) {
            Core.ensureAccept(4709);
            Core.getMapItem(4068, 1, "cryostorm");
            Core.huntMonster("cryostorm", "Glacial Wolf", "Glacial Wolf Defeated", 6);
            Core.ensureComplete(4709);
        }

        // Decorate the Tree
        if (!Story.questProgression(4710)) {
            Core.ensureAccept(4710);
            Core.huntMonster("cryostorm", "Cryo Mammoth", "Gilded Moglin Ornament", 2);
            Core.huntMonster("cryostorm", "Glacial Elemental", "Frosty Wreath", 3);
            Core.huntMonster("cryostorm", "Glacial Wolf", "Frostval Cane", 5);
            Core.huntMonster("cryostorm", "Cryo Mammoth", "Frostval Bells", 7);
            Core.huntMonster("cryostorm", "Glacial Elemental", "Frostval Lights", 10);
            Core.ensureComplete(4710);
        }

        // Find the Ice StarStone
        Story.killQuest(4711, "cryostorm", "Behemoth");

        // War Medal Quest
        if (!Core.isCompletedBefore(4716)) {
            Core.ensureAccept(4712);
            Core.huntMonster("cryowar", "Frost Reaper", "Cryo War Medal", 10);
            Core.ensureComplete(4712);
        }

        // Defeat Ultra Karok
        Story.killQuest(4716, "cryowar", "Super-Charged Karok");
    }

    icewindpass(): void {
        if (Core.isCompletedBefore(5596) || !Core.isSeasonalMapActive("icewindpass")) {
            return;
        }
        if (!Core.isCompletedBefore(4716)) {
            this.cryostorm();
        }

        Story.preLoad(this.icewindpass);

        // Where is Karok?
        Story.mapItemQuest(5587, "icewindpass", 5074, 5);

        // Cloaking Spell
        Story.killQuest(5588, "icewindpass", "Glacial Elemental");

        // Splattered Mana
        if (!Story.questProgression(5589)) {
            Core.ensureAccept(5589);
            Core.getMapItem(5075, 5, "icewindpass");
            Core.huntMonster("icewindpass", "Glacial Elemental", "Iced Mana", 9);
            Core.ensureComplete(5589);
        }

        // Dispell the Spell
        Story.killQuest(5590, "icewindpass", "Living Snow");

        // Catch Up to Karok
        Story.killQuest(5591, "icewindpass", "Frost Invader");

        // Blast the Frostspawn Symbiote
        Story.killQuest(5592, "icewindpass", "Frostspawn Symbiote");

        // Keep Going!
        Story.killQuest(5593, "icewindpass", "Frost Invader");

        // Take it Down!
        Story.killQuest(5594, "icewindpass", "Frostspawn Horror");

        // Keep the Frostspawn Away!
        if (!Story.questProgression(5595)) {
            Core.ensureAccept(5595);
            Core.huntMonster("icewindpass", "Frost Invader", "Frost Invader Slain", 5);
            Core.huntMonster("icewindpass", "Frostspawn Troll", "Frostspawn Troll Slain", 5);
            Core.ensureComplete(5595);
        }

        // Take a Break from Fighting
        if (!Story.questProgression(5596)) {
            Core.ensureAccept(5596);
            Core.huntMonster("icewindpass", "Polar Golem", "Living Snow", 3);
            Core.huntMonster("icewindpass", "Glacial Elemental", "Elemental Icicles", 3);
            Core.ensureComplete(5596);
        }
    }

    icepike(): void {
        if (Core.isCompletedBefore(5617) || !Core.isSeasonalMapActive("icepike")) {
            return;
        }
        if (!Core.isCompletedBefore(5596)) {
            this.icewindpass();
        }

        Story.preLoad(this.icepike);

        // Fight For Kezeroth!
        if (!bot.quests.isUnlocked(5606)) {
            Core.ensureAccept(5597);
            Core.huntMonster("icewindwar", "Kezeroth's Blade", "Frostspawn Medal", 10);
            Core.ensureComplete(5597);
        }

        // WHAT is THAT?
        Story.killQuest(5601, "icewindwar", "Soricomorpha");

        // Take a Look Around
        if (!Story.questProgression(5606)) {
            Core.ensureAccept(5606);
            Core.getMapItem(5085, 2, "icepike");
            Core.huntMonster("icepike", "Living Ice", "Ice Monsters Slain", 8);
            Core.ensureComplete(5606);
        }

        // The Stars Have Foretold
        Story.mapItemQuest(5607, "icepike", [5086, 5087]);

        // Continue this Path
        if (!Story.questProgression(5608)) {
            Core.ensureAccept(5608);
            Core.getMapItem(5088, 5, "icepike");
            Core.huntMonster("icepike", "Ice Lord", "Frozen Crystals", 5);
            Core.ensureComplete(5608);
        }

        // Cross the Ice Bridge
        Story.mapItemQuest(5609, "icepike", 5089);

        // Free The Moglins
        Story.killQuest(5610, "icepike", "Frozen Moglin");

        // Get the Moglinsters
        Story.killQuest(5612, "icepike", "Frozen Moglinster");

        // Take the Crystal
        Story.mapItemQuest(5613, "icepike", 5090);

        // You have to Fight
        Story.killQuest(5614, "icepike", "Crystal of Glacera");

        // Fight your way Clear
        Story.mapItemQuest(5615, "icepike", 5091);

        // Take down Kezeroth!
        Story.killQuest(5616, "icepike", "Chained Kezeroth");

        // Karok still Stands
        Story.killQuest(5617, "icepike", "Karok The Fallen");
    }

    frostvalPastPresentandFuture(): void {
        if (Core.isCompletedBefore(6651) || !Core.isSeasonalMapActive("frostvalperil")) {
            return;
        }
        if (!Core.isCompletedBefore(5617)) {
            this.icepike();
        }

        Story.preLoad(this.frostvalPastPresentandFuture);

        // Memory #1 - Yeti or Not - 6636
        Story.killQuest(6636, "frostvalpast", "Ice Master Yeti");

        // Activate the Spacetimebobulator - 6637
        Story.mapItemQuest(6637, "frostvalpast", 6165);

        // Memory #2 - Who Started the Fire - 6638
        Story.killQuest(6638, "frostvalnext", "Arcane Fire");

        // Memory #2 - Moglins on Ice - 6639
        Story.killQuest(6639, "frostvalnext", "Frozen Moglin");

        // Memory #2 - Ice Ice Golems - 6640
        Story.killQuest(6640, "frostvalnext", "Ice Golem");

        // Memory #2 - Xanta Claus Can't Come - 6641
        Story.killQuest(6641, "frostvalnext", "Xanta Claus");

        // Activate the Spacetimebobulator - 6642
        Story.mapItemQuest(6642, "frostvalnext", 6165);

        // Memory #3 - Wraithing Away - 6643
        Story.killQuest(6643, "frostvalpresent", "Time Wraith");

        // Memory #3 - Echoes - 6644
        Story.killQuest(6644, "frostvalpresent", ["Echo of Cysero", "Echo of Lim", "Echo of Sora", "Echo of Warlic"]);

        // Activate the Spacetimebobulator - 6645
        Story.mapItemQuest(6645, "frostvalpresent", 6165);

        // Memory #4 - Clear the Snow - 6646
        Story.mapItemQuest(6646, "frostvalfuture", 6166);

        // Memory #4 - Fend off the Fiends - 6647
        Story.killQuest(6647, "frostvalfuture", "Frost Fiend");

        // Memory #4 - The Frozen Warlock - 6648
        Story.killQuest(6648, "frostvalfuture", "Wargoth the Frozen");

        // Bring the Cheer! - 6651
        Story.killQuest(6651, "frostvalfuture", "Wargoth the Frozen");
        Story.killQuest(6651, "frostvalpresent", "Time Wraith");
        Story.killQuest(6651, "frostvalnext", "Xanta Claus");
        Story.killQuest(6651, "frostvalpast", "Ice Master Yeti", { getReward: false });
    }

    snowview(): void {
        if (Core.isCompletedBefore(9015) || !Core.isSeasonalMapActive("snowview")) {
            return;
        }
        if (!Core.isCompletedBefore(6651)) {
            this.frostvalPastPresentandFuture();
        }

        Story.preLoad(this.snowview);

        //Glorified Pest Control (9006)
        Story.killQuest(9006, "snowview", ["Mountain Owl", "Arctic Fox"]);

        //Mingling Sights (9007)
        Story.mapItemQuest(9007, "snowview", [10989, 10990]);

        //Sore Long Faces (9008)
        Story.killQuest(9008, "snowview", "Tundra Steed");

        //Eggcellent Trade (9009)
        Story.mapItemQuest(9009, "snowview", 10991);
        Story.killQuest(9009, "snowview", "Arctic Fox");

        //Homemade Stars (9010)
        Story.mapItemQuest(9010, "snowview", 10992, 4);
        Story.killQuest(9010, "snowview", "Mountain Owl");

        //Rooted Remedy (9011)
        Story.mapItemQuest(9011, "snowview", 10993, 5);
        Story.mapItemQuest(9011, "snowview", 10994);

        //No Lasso Rodeo (9012)
        Story.killQuest(9012, "snowview", "Tundra Steed");

        //A Gift of Faith (9013)
        Story.killQuest(9013, "snowview", ["Mountain Owl", "Arctic Fox"]);

        //Together from Afar (9014)
        Story.mapItemQuest(9014, "snowview", 10995);
        Story.killQuest(9014, "snowview", "Tundra Steed");

        //Intruder From the Stars (9015)
        Story.killQuest(9015, "snowview", "Vaderix");
    }

    snowviewRace(): void {
        if (Core.isCompletedBefore(9026) || !Core.isSeasonalMapActive("snowviewrace")) {
            return;
        }
        if (!Core.isCompletedBefore(9015)) {
            this.snowview();
        }

        Story.preLoad(this.snowviewRace);

        //Encroaching Frost (9017)
        Story.mapItemQuest(9017, "snowviewrace", 11010);
        Story.killQuest(9017, "snowviewrace", "Mountain Owl");

        //Horse Vision (9018)
        Story.killQuest(9018, "snowviewrace", "Tundra Steed");

        //Frigid Mirage (9019)
        Story.mapItemQuest(9019, "snowviewrace", [11011, 11012, 11013]);

        //Hiding Cavities (9020)
        Story.mapItemQuest(9020, "snowviewrace", 11014);
        Story.killQuest(9020, "snowviewrace", ["Mountain Owl", "Tundra Steed"]);

        //Cosmic Interference (9021)
        Story.mapItemQuest(9021, "snowviewrace", 11015);
        Story.killQuest(9021, "snowviewrace", "Juvenile Vaderix");

        //Cold Resistance (9022)
        Story.killQuest(9022, "snowviewrace", "Juvenile Vaderix");

        //Bandits of Summer (9023)
        Story.mapItemQuest(9023, "snowviewrace", 11016);
        Story.killQuest(9023, "snowviewrace", "Bandit");

        //Avalanche of Wings and Feelers (9024)
        Story.killQuest(9024, "snowviewrace", ["Bandit", "Juvenile Vaderix"]);

        //Bargain Bin Bounty (9025)
        Story.killQuest(9025, "snowviewrace", "Bandit Fletcher");

        //Vaderix Requiem (9026)
        Story.killQuest(9026, "snowviewrace", "Aurora Vaderix");
    }

    deerHunt(): void {
        if (bot.quests.isUnlocked(8433) || !Core.isSeasonalMapActive("deerhunt")) {
            return;
        }
        if (!Core.isCompletedBefore(9026)) {
            this.snowviewRace();
        }

        Story.preLoad(this.deerHunt);

        // 8423 Scout the Area,
        if (!Story.questProgression(8423)) {
            Core.ensureAccept(8423);
            Core.getMapItem(9372, 1, "deerhunt");
            Core.huntMonster("deerhunt", "Deer?", "Animals Defeated", 8);
            Core.ensureComplete(8423);
        }

        // 8424 Deer?
        Story.killQuest(8424, "deerhunt", "Deer?");

        // 8425 Comparing Claws
        if (!Story.questProgression(8425)) {
            Core.ensureAccept(8425);
            Core.getMapItem(9373, 4, "deerhunt");
            Core.huntMonster("deerhunt", "Frightened Owl", "Owl Talon Sample", 8);
            Core.huntMonster("deerhunt", "Scared Wolf", "Wolf Claw Sample", 8);
            Core.ensureComplete(8425);
        }

        // 8426 Lair Investigated
        Story.mapItemQuest(8426, "deerhunt", [9374, 9375]);

        // 8427 Fight or Flight or Freeze
        Story.killQuest(8427, "deerhunt", "Frightened Owl");

        // 8428 Not Deer Hunting
        Story.killQuest(8428, "deerhunt", "Deer?");

        // 8429 Monstrous Tracks
        Story.mapItemQuest(8429, "deerhunt", 9376, 6);

        // 8430  Final Blessing
        if (!Story.questProgression(8430)) {
            Core.ensureAccept(8430);
            Core.huntMonster("deerhunt", "Scared Wolf", "Wolf Pelt Offering", 5);
            Core.huntMonster("deerhunt", "Frightened Owl", "Owl Feather Offering", 5);
            Core.huntMonster("deerhunt", "Deer?", "Deer Hide Offering", 5);
            Core.ensureComplete(8430);
        }

        // 8431 The Zweinichthirsch
        Story.killQuest(8431, "deerhunt", "Zweinichthirsch");

        // 8432 Cries Investigated
        Story.mapItemQuest(8432, "deerhunt", 9377);
    }

    bowJangles(): void {
        if (Core.isCompletedBefore(7828) || !Core.isSeasonalMapActive("frostvale")) {
            return;
        }
        if (!Core.isCompletedBefore(8432)) {
            this.deerHunt();
        }

        Story.preLoad(this.bowJangles);
        Core.equipClass(ClassType.Solo);

        //Beauty Comes At a Price (7819)
        Story.killQuest(7819, "towerofmirrors", "Scarletta");

        //Bloody Skulls (7820)
        Story.killQuest(7820, "epicvordred", "Ultra Vordred");

        //Making The World a Cleaner Place (7821)
        Story.killQuest(7821, "palace", "Misery Eel");

        //Big and Deadly (7822)
        bot.quests.updateQuest(4361);
        Story.killQuest(7822, "treetitanbattle", "Dakka the Dire Dragon");

        //A Hunting We Will Go (7823)
        Story.killQuest(7823, "darkoviaforest", "Lich Of The Stone");

        //Returning to Oblivion (7824)
        if (!Story.questProgression(7824)) {
            Core.ensureAccept(7824);
            Core.huntMonster("underworld", "Dreadfiend of Nulgath", "Dreadfiend Gone", 5);
            Core.huntMonster("underworld", "Infernalfiend", "Infernalfiend Mauled", 5);
            Core.huntMonster("underworld", "Bloodfiend", "Bloodfiend Destroyed", 5);
            Core.ensureComplete(7824);
        }

        //Both Sides are Guilty (7825)
        if (!Story.questProgression(7825)) {
            Core.ensureAccept(7825);
            Core.huntMonster("judgement", "Minos", "Minos Defeated", 1);
            Core.huntMonster("judgement", "Rhadamanthys", "Rhadamanthys Beaten", 1);
            Core.huntMonster("judgement", "Aeacus", "Aeacus Slain", 1);
            Core.ensureComplete(7825);
        }

        //Bait and Switch (7826)
        Story.killQuest(7826, "doomvault", "Princess Angler");

        //What Chaos Touches, We Destroy (7827)
        Story.killQuest(7827, "orecavern", "Naga Baas");

        //A Finale to Remember (7828)
        bot.quests.updateQuest(2814);
        Story.killQuest(7828, "stormtemple", "Chaos Lord Lionfang");
    }

    glaceTomb(): void {
        if (Core.isCompletedBefore(9506) || !Core.isSeasonalMapActive("frostvale")) {
            return;
        }
        if (!Core.isCompletedBefore(7828)) {
            this.bowJangles();
        }

        Story.preLoad(this.glaceTomb);
        Core.equipClass(ClassType.Farm);

        // PTA Meeting 9497
        Story.mapItemQuest(9497, "glacetomb", [12421, 12422]);

        // Bear Essentials 9498
        Story.killQuest(9498, "glacetomb", "Auberon");

        // Powder Sugar Faeries 9499
        Story.killQuest(9499, "glacetomb", "Snow Fairy");

        // Water Intoxication 9500
        Story.killQuest(9500, "glacetomb", "Auberon");

        // Wet Pages 9501
        Story.mapItemQuest(9501, "glacetomb", 12423, 7);
        Story.mapItemQuest(9501, "glacetomb", [12424, 12425]);

        // IceBox Break In 9502
        Story.mapItemQuest(9502, "glacetomb", 12426);
        Story.killQuest(9502, "glacetomb", "Snow Fairy");

        // Necrocollege Rejects 9503
        Story.mapItemQuest(9503, "glacetomb", [12427, 12428]);
        Story.killQuest(9503, "glacetomb", "Draugr");

        // Finger Paintings 9504
        Story.mapItemQuest(9504, "glacetomb", 12429, 5);

        // Exhibit on Ice 9505
        Story.mapItemQuest(9505, "glacetomb", 12430, 3);
        Story.killQuest(9505, "glacetomb", "Draugr");

        Core.equipClass(ClassType.Solo);
        // Academic Probation 9506
        Story.killQuest(9506, "glacetomb", "Kriomein");
    }

    fimbultomb(): void {
        if (Core.isCompletedBefore(9518) || !Core.isSeasonalMapActive("fimbultomb")) {
            return;
        }
        if (!Core.isCompletedBefore(9506)) {
            this.glaceTomb();
        }

        // Hold the Door 9509
        Story.mapItemQuest(9509, "fimbultomb", [12490, 12491]);
        Story.killQuest(9509, "fimbultomb", "Draugr");

        // Floral Remedy 9510
        Story.mapItemQuest(9510, "fimbultomb", 12492, 7);
        Story.killQuest(9510, "fimbultomb", "Sullied Auberon");

        // Caving Hazards 9511
        Story.killQuest(9511, "fimbultomb", ["Draugr", "Sullied Auberon"]);

        // Poetic Ettin 9512
        Story.mapItemQuest(9512, "fimbultomb", 12493);
        Story.killQuest(9512, "fimbultomb", "Ettin Golem");

        // In the Field 9513
        Story.mapItemQuest(9513, "fimbultomb", [12494, 12495, 12496]);

        // Nectar Tea 9514
        Story.mapItemQuest(9514, "fimbultomb", 12497, 7);
        Story.killQuest(9514, "fimbultomb", "Ettin Golem");

        // Copied Homework 9515
        Story.killQuest(9515, "fimbultomb", "Daselm");

        // Nepomancer 9516
        Story.killQuest(9516, "fimbultomb", "Peter");

        // Invert the Cycle 9517
        Story.mapItemQuest(9517, "fimbultomb", 12498, 2);
        Story.killQuest(9517, "fimbultomb", "Ettin Golem");

        // Death Squall 9518
        Story.killQuest(9518, "fimbultomb", "Fimbulventr Witch");
    }

    mountOtzi(): void {
        if (Core.isCompletedBefore(8444) || !Core.isSeasonalMapActive("MountOtzi")) {
            return;
        }
        if (!Core.isCompletedBefore(9518)) {
            this.fimbultomb();
        }

        Story.preLoad(this.mountOtzi);

        // Light Midnight
        Story.mapItemQuest(8434, "MountOtzi", 9437, 7);

        // Actaeon Stew
        Story.killQuest(8435, "MountOtzi", "Stitched Stag");

        // Vain Howl
        Story.killQuest(8436, "MountOtzi", "Gauden Hound");

        // Holle's Meal
        if (!Story.questProgression(8437)) {
            Story.mapItemQuest(8437, "MountOtzi", 9388);
            Story.mapItemQuest(8437, "MountOtzi", 9387, 6);
            Story.killQuest(8437, "MountOtzi", "Stitched Stag");
        }

        // The Hidden One
        if (!Story.questProgression(8438)) {
            Story.mapItemQuest(8438, "MountOtzi", 9389);
            Story.killQuest(8438, "MountOtzi", "Gauden Hound");
        }

        //MountOtzi's Stones
        if (!Story.questProgression(8439)) {
            Story.mapItemQuest(8439, "MountOtzi", 9390, 7);
            Story.killQuest(8439, "MountOtzi", ["Gauden Hound", "Mangled Stag"]);
        }

        //Faceless Hunters
        if (!Story.questProgression(8440)) {
            Story.mapItemQuest(8440, "MountOtzi", 9391);
            Story.killQuest(8440, "MountOtzi", "Sluagh Warrior");
        }

        //Stitch Work
        if (!Story.questProgression(8441)) {
            Story.mapItemQuest(8441, "MountOtzi", 9392);
            Story.killQuest(8441, "MountOtzi", "Mangled Stag");
        }

        //Killer Promotion
        if (!Story.questProgression(8442)) {
            Story.mapItemQuest(8442, "MountOtzi", 9393, 7);
            Story.killQuest(8442, "MountOtzi", "Sluagh Warrior");
        }

        //Cold Pleasures
        if (!Story.questProgression(8443)) {
            Story.mapItemQuest(8443, "MountOtzi", 9394);
            Story.killQuest(8443, "MountOtzi", "Sluagh Warrior");
        }

        //Corvus Mellori
        Story.killQuest(8444, "MountOtzi", "Sluagh Mellori", { autoCompleteQuest: false });
    }

    otziwar(): void {
        if (Core.isCompletedBefore(8451)) {
            return;
        }

        if (!Core.isCompletedBefore(8444)) {
            this.mountOtzi();
        }

        Story.preLoad(this.otziwar);

        // 8446 and 8447 => Sluagh Medals && Mega Sluagh Medals
        if (!Core.isCompletedBefore(8448)) {
            Core.ensureAcceptmultiple(8446, 8447);
            Core.huntMonster("otziwar", "Sluagh Warrior", "Sluagh Medals", 5);
            Core.ensureComplete(8446);
            Core.huntMonster("otziwar", "Sluagh Warrior", "Mega Sluagh Medals", 3);
            Core.ensureComplete(8447);
        }

        // Glacial Archaeology 8448
        Story.killQuest(8448, "otziwar", "Sluagh Warrior");

        // Calcium Dating 8449
        Story.killQuest(8449, "otziwar", "Gauden Hound");

        // Circling Crows 8450
        Story.killQuest(8450, "otziwar", "Sluagh Mellori");

        // Powder Snow 8451
        Story.killQuest(8451, "otziwar", "Huntress Valais");
    }

    holidayHotel(): void {
        if (Core.isCompletedBefore(10003) || !Core.isSeasonalMapActive("holidayhotel")) {
            return;
        }
        if (!Core.isCompletedBefore(8451)) {
            this.otziwar();
        }

        Story.preLoad(this.holidayHotel);

        //#region Useable Monsters
        const UseableMonsters = [
            "Hydrochloric Acid", // UseableMonsters[0],
            "Lost Giftbox", // UseableMonsters[1],
            "Cold Apparition", // UseableMonsters[2],
            "Hotel Guest", // UseableMonsters[3],
            "Memory Leech", // UseableMonsters[4]
        ];
        //#endregion Useable Monsters
        // 9993 | Mouth of a Home
        if (!Story.questProgression(9993)) {
            Core.huntMonsterQuest(9993, ["holidayhotel", UseableMonsters[0], ClassType.Farm]);
        }

        // 9994 | Windpipe Hallway
        Story.mapItemQuest(9994, [
            [13977, 5, "holidayhotel"],
            [13967, 1, "holidayhotel"],
            [13968, 1, "holidayhotel"],
        ]);

        // 9995 | Foreign Body Aspiration
        if (!Story.questProgression(9995)) {
            Core.huntMonsterQuest(9995, ["holidayhotel", UseableMonsters[1], ClassType.Farm]);
        }

        // 9996 | Left Arm Vein
        Story.mapItemQuest(9996, "holidayhotel", [13969, 13970]);
        Story.killQuest(9996, "holidayhotel", UseableMonsters[2]);

        // 9997 | Left Arm Artery
        Story.mapItemQuest(9997, "holidayhotel", [13971, 13972]);
        Story.killQuest(9997, "holidayhotel", UseableMonsters[2]);

        // 9998 | Right Arm Vein
        Story.mapItemQuest(9998, "holidayhotel", [13973, 13974, 13975]);

        // 10001 | Right Arm Artery
        if (!Story.questProgression(10001)) {
            Core.huntMonsterQuest(10001, ["holidayhotel", UseableMonsters[3], ClassType.Farm]);
        }

        // 10002 | Cryophobia
        Story.mapItemQuest(10002, "holidayhotel", 13976);

        // 10003 | Maceration
        if (!Story.questProgression(10003)) {
            Core.huntMonsterQuest(10003, ["holidayhotel", UseableMonsters[4], ClassType.Solo]);
        }
    }

    holidayHorror(): void {
        if (Core.isCompletedBefore(10014) || !Core.isSeasonalMapActive("holidayhorror")) {
            return;
        }
        if (!Core.isCompletedBefore(10003)) {
            this.holidayHotel();
        }

        Story.preLoad(this.holidayHorror);

        //#region Useable Monsters
        const UseableMonsters = [
            "Trey Simulacrum", // UseableMonsters[0],
            "Hydrochloric Acid", // UseableMonsters[1],
            "Alteon Simulacrum", // UseableMonsters[2],
            "Lynaria Simulacrum", // UseableMonsters[3],
            "Brittany Simulacrum", // UseableMonsters[4],
            "Brentan Simulacrum", // UseableMonsters[5],
            "La Simulacrum", // UseableMonsters[6],
            "Re Simulacrum", // UseableMonsters[7],
            "Cold Apparition", // UseableMonsters[8],
            "Hotel Guest", // UseableMonsters[9],
            "Yaga", // UseableMonsters[10],
            "Mockingbird", // UseableMonsters[11],
            "Cold Grudge", // UseableMonsters[12]
        ];
        //#endregion Useable Monsters
        // 10005 | Chilblain
        if (!Story.questProgression(10005)) {
            Core.huntMonsterQuest(10005, ["holidayhorror", UseableMonsters[8], ClassType.Farm]);
        }

        // 10006 | Fool's Gold
        Story.mapItemQuest(10006, "holidayhorror", 13994);
        Story.killQuest(10006, "holidayhorror", UseableMonsters[0]);

        // 10007 | Acid Reflux
        Story.mapItemQuest(10007, "holidayhorror", 13995, 4);
        Story.killQuest(10007, "holidayhorror", UseableMonsters[1]);

        // 10008 | Sour Notes
        if (!Story.questProgression(10008)) {
            Core.huntMonsterQuest(
                10008,
                ["holidayhorror", UseableMonsters[2], ClassType.Solo],
                ["holidayhorror", UseableMonsters[3], ClassType.Solo],
            );
        }

        // 10009 | Phantom Pain
        if (!Story.questProgression(10009)) {
            Core.huntMonsterQuest(
                10009,
                ["holidayhorror", UseableMonsters[4], ClassType.Solo],
                ["holidayhorror", UseableMonsters[5], ClassType.Solo],
            );
        }

        // 10010 | Kleptothermy
        if (!Story.questProgression(10010)) {
            Core.ensureAccept(10010);
            Core.killMonster("holidayhorror", "r7", "Left", UseableMonsters[6], "La's Shard");
            Core.killMonster("holidayhorror", "r7", "Left", UseableMonsters[7], "Re's Shard");
            Story.mapItemQuest(10010, "holidayhorror", 13996);
        }

        // 10011 | Fie Fie
        Story.mapItemQuest(10011, [
            [13997, 1, "holidayhorror"],
            [13998, 5, "holidayhorror"],
        ]);

        // 10012 | Here of Free Will?
        Story.mapItemQuest(10012, "holidayhorror", 14000);
        Story.killQuest(10012, "holidayhorror", UseableMonsters[9]);

        // 10013 | Arrived by Compulsion?
        Story.mapItemQuest(10013, "holidayhorror", 13999);
        Story.killQuest(10013, "holidayhorror", UseableMonsters[10]);

        // 10014 | Empty Nest
        if (!Story.questProgression(10014)) {
            Core.cutSceneFixer("holidayhorror", "r12", "Cut3");
            Core.huntMonsterQuest(10014, ["holidayhorror", UseableMonsters[11], ClassType.Solo]);
        }
    }

    frostvalGala(): void {
        if (Core.isCompletedBefore(10523) || !Core.isSeasonalMapActive("frostvalgala")) {
            return;
        }

        Story.preLoad(this.frostvalGala);

        //#region Useable Monsters
        const UseableMonsters = [
            "Vaughn Knight", // UseableMonsters[0],
            "Granville Knight", // UseableMonsters[1],
            "Noelle Knight", // UseableMonsters[2],
            "Unsung Knight", // UseableMonsters[3],
            "Unsung Beast", // UseableMonsters[4],
            "Unsung Queen", // UseableMonsters[5]
        ];
        //#endregion Useable Monsters
        // 10514 | Miraculous Reunion
        if (!Story.questProgression(10514)) {
            Story.mapItemQuest(10514, "frostvalgala", [15286, 15287]);
            Core.huntMonsterQuest(10514, ["frostvalgala", UseableMonsters[0], ClassType.Farm]);
        }

        // 10515 | Emergency Management
        if (!Story.questProgression(10515)) {
            Core.ensureAccept(10515);
            Story.mapItemQuest(10515, "frostvalgala", 15288, undefined, { autoCompleteQuest: false });
            Core.huntMonster("frostvalgala", UseableMonsters[1], "Granville Crest", 6);
            Core.ensureComplete(10515);
        }

        // 10516 | Noble Character
        if (!Story.questProgression(10516)) {
            Story.mapItemQuest(10516, "frostvalgala", 15289);
            Core.huntMonsterQuest(10516, ["frostvalgala", UseableMonsters[2], ClassType.Farm]);
        }

        // 10517 | Breaking Bread
        if (!Story.questProgression(10517)) {
            Story.mapItemQuest(10517, [
                [15290, 5, "frostvalgala"],
                [15291, 1, "frostvalgala"],
                [15292, 1, "frostvalgala"],
            ]);
        }

        // 10518 | The Poacher and the Stag
        if (!Story.questProgression(10518)) {
            Core.huntMonsterQuest(
                10518,
                ["frostvalgala", UseableMonsters[0], ClassType.Farm],
                ["frostvalgala", UseableMonsters[1], ClassType.Farm],
            );
        }

        // 10519 | Knights Unsung
        if (!Story.questProgression(10519)) {
            Core.huntMonsterQuest(10519, ["frostvalgala", UseableMonsters[3], ClassType.Farm]);
        }

        // 10520 | Silver Spoon Fed
        if (!Story.questProgression(10520)) {
            Story.mapItemQuest(10520, "frostvalgala", 15293, 5);
        }

        // 10521 | Like-Minded Enemies
        if (!Story.questProgression(10521)) {
            Story.mapItemQuest(10521, "frostvalgala", 15294);
            Core.huntMonsterQuest(10521, ["frostvalgala", UseableMonsters[4], ClassType.Farm]);
        }

        // 10522 | Heroic Entrance
        if (!Story.questProgression(10522)) {
            Core.huntMonsterQuest(
                10522,
                ["frostvalgala", UseableMonsters[4], ClassType.Farm],
                ["frostvalgala", UseableMonsters[3], ClassType.Farm],
            );
        }

        // 10523 | I'm With You in the Dark
        if (!Story.questProgression(10523)) {
            Core.huntMonsterQuest(10523, ["frostvalgala", UseableMonsters[5], ClassType.Solo]);
        }
    }

    unsungNecropolis(): void {
        if (Core.isCompletedBefore(10535) || !Core.isSeasonalMapActive("unsungnecropolis")) {
            return;
        }

        this.frostvalGala();

        Story.preLoad(this.unsungNecropolis);

        //#region Useable Monsters
        const UseableMonsters = [
            "Unsung Beast", // UseableMonsters[0],
            "Unsung Knight", // UseableMonsters[1],
            "Bone Dragonling", // UseableMonsters[2],
            "Doom Figment", // UseableMonsters[3],
            "Dracolich Blain", // UseableMonsters[4],
            "Unsung Mage", // UseableMonsters[5],
            "Dracolich Sole", // UseableMonsters[6],
            "Unsung Warrior", // UseableMonsters[7],
            "The Unsung", // UseableMonsters[8]
        ];
        //#endregion Useable Monsters
        // 10526 | Fade in from Black
        if (!Story.questProgression(10526)) {
            Core.huntMonsterQuest(10526, ["unsungnecropolis", UseableMonsters[0], ClassType.Farm]);
        }

        // 10527 | Hyping Up
        if (!Story.questProgression(10527)) {
            Core.huntMonsterQuest(10527, ["unsungnecropolis", UseableMonsters[1], ClassType.Farm]);
        }

        // 10528 | Little Buddies
        if (!Story.questProgression(10528)) {
            Core.ensureAccept(10528);
            Core.huntMonster("unsungnecropolis", UseableMonsters[2], "Dragonling ID Tag", 3);
            Core.getMapItem(15311, 1, "unsungnecropolis");
            Core.ensureComplete(10528);
        }

        // 10529 | Selective Memory
        if (!Story.questProgression(10529)) {
            Story.mapItemQuest(10529, "unsungnecropolis", 15312);
            Core.huntMonsterQuest(10529, ["unsungnecropolis", UseableMonsters[3], ClassType.Farm]);
        }

        // 10530 | Old Painless
        if (!Story.questProgression(10530)) {
            Core.huntMonsterQuest(10530, ["unsungnecropolis", UseableMonsters[4], ClassType.Solo]);
        }

        // 10531 | Peeved and Peckish
        if (!Story.questProgression(10531)) {
            Story.mapItemQuest(10531, "unsungnecropolis", 15313);
            Core.huntMonsterQuest(10531, ["unsungnecropolis", UseableMonsters[5], ClassType.Farm]);
        }

        // 10532 | Machetes at Dawn
        if (!Story.questProgression(10532)) {
            Core.huntMonsterQuest(10532, ["unsungnecropolis", UseableMonsters[6], ClassType.Solo]);
        }

        // 10533 | Lowlife Poachers
        if (!Story.questProgression(10533)) {
            Story.mapItemQuest(10533, [
                [15314, 6, "unsungnecropolis"],
                [15315, 1, "unsungnecropolis"],
            ]);
        }

        // 10534 | Serene Meditation
        if (!Story.questProgression(10534)) {
            Story.mapItemQuest(10534, "unsungnecropolis", 15316);
            Core.huntMonsterQuest(10534, ["unsungnecropolis", UseableMonsters[7], ClassType.Farm]);
        }

        // 10535 | The Right to Choose
        if (!Story.questProgression(10535)) {
            Core.huntMonsterQuest(10535, ["unsungnecropolis", UseableMonsters[8], ClassType.Solo]);
        }
    }
}
