/*
name: null
description: null
tags: null
*/
// Port of Scripts/Seasonal/Friday13th/Story/CoreFriday13th.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";

const Story = new CoreStory();

export class CoreFriday13th {
    friday13thCheck(caller = ""): boolean {
        const isMemberOrFriday13th =
            (new Date(
                new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth() + 1 - 1, 13).getTime(),
            ).getDay() === 5 /* Friday */ &&
                new Date(Date.now()).getDate() >= 5) ||
            Core.isMember;

        if (isMemberOrFriday13th) {
            return true;
        } else if (!isMemberOrFriday13th) {
            Core.logger(`You must be a Member or wait until a week before Friday the 13th to complete ${caller}`);
        }
        return false;
    }

    completeFriday13th(): void {
        if (!this.friday13thCheck()) {
            Core.logger("Friday the 13th not active yet");
            return;
        }

        this.skullpunch();
        this.lowe();
        this.saloonfront();
        this.firehouse();
        this.sleezter();
        this.neverhub();
        this.battledoom();
        this.wormhole();
        this.crownsreachfxiii();
        this.gonnagetcha();
        this.greymoor();
        this.puzzlebox();
        this.splatterwar();
        this.deadfly();
        this.oddities();
        this.blackMaze();
    }

    skullpunch(): void {
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        if (Core.isCompletedBefore(3119)) {
            Core.logger("[Skullpunch] Complete.");
            return;
        }

        Story.preLoad(this.skullpunch);

        // Fishbones, Fishbones 3097
        Story.killQuest(3097, "Skullpunch", "Fishbones");

        // Outlook Good 3098
        Story.mapItemQuest(3098, "Skullpunch", 1990);

        // Roly Poly Fishbones 3099
        Story.killQuest(3099, "Skullpunch", "Fishbones");

        // We Can't Stop Here! 3100
        Story.killQuest(3100, "Vampirates", "Creepy Bat");

        // It's Bat Country! 3101
        Story.killQuest(3101, "Vampirates", "Creepy Bat");

        // Vampirates! 3102
        Story.killQuest(3102, "Vampirates", "Vampirate");

        // Oh Right, They're Vampires 3103
        if (!Story.questProgression(3103)) {
            Core.ensureAccept(3103);
            Core.huntMonster("vampirates", "Creepy Bat", "Vampire Bat Staked", 4);
            Core.huntMonster("vampirates", "Vampirate", "Vampirate Staked", 4);
            Core.ensureComplete(3103);
        }

        // The Vampirate Captain 3104
        Story.mapItemQuest(3104, "Vampirates", 1959);

        // How Are We Breathing Under Here!? 3105
        Story.killQuest(3105, "Vampirates", "Stranglerfish");

        // Unsink This Ship! 3106
        if (!Story.questProgression(3106)) {
            Core.ensureAccept(3106);
            Core.huntMonster("Vampirates", "Murderaconian", "Murderaconian Slain", 5);
            Core.huntMonster("Vampirates", "Vampirate", "Vampirate Slain", 5);
            Core.huntMonster("Vampirates", "Vampirate", "Multi-Purpose Ship Widget");
            Core.ensureComplete(3106);
            bot.sleep(200);
        }

        // Release the Kraken! Wait, no - Don't. 3107
        Story.killQuest(3107, "Vampirates", "Bracken Kraken");

        // I Didn't Know They Could Swarm! 3108
        Story.killQuest(3108, "Vampirates", "Vampirate");

        // Now Where Are Those Landmarks? 3109
        Story.mapItemQuest(3109, "TreasureIsland", [1986, 1987, 1988, 1989]);

        // X Marks The Spot 3110
        Story.mapItemQuest(3110, "TreasureIsland", 1958);

        // Captain Von Poach 3111
        Story.killQuest(3111, "TreasureIsland", "Captain Von Poach");

        if (Core.isMember) {
            //Me Knickers Got a Big Hole Across th' Bum 3114
            if (!Story.questProgression(3114)) {
                Core.ensureAccept(3114);
                Core.huntMonster("skullpunch", "Fishbones", "Thin Fishbone Bone");
                Core.huntMonster("skullpunch", "Vampirate", "Scrap o' Fabric", 8);
                Core.ensureComplete(3114);
            }

            // Where'd Me Ship's Cargo? 3115
            if (!Story.questProgression(3115)) {
                Core.ensureAccept(3115);
                Core.huntMonster("skullpunch", "Fishbones", "Dented Footlocker");
                Core.huntMonster("skullpunch", "Fishbones", "Wooden Crate");
                Core.huntMonster("skullpunch", "Fishbones", "Small Chest");
                Core.huntMonster("skullpunch", "Fishbones", "Half-Empty Barrel");
                Core.ensureComplete(3115);
            }

            // A Most Important Package 3116
            Story.killQuest(3116, "Skullpunch", "Fishbones");

            // Comfort Food 3117
            if (!Story.questProgression(3117)) {
                Core.ensureAccept(3117);
                Core.huntMonster("Skullpunch", "Shelleton", "Turtle Meat", 10);
                Core.huntMonster("Skullpunch", "Fishwing", "Fish Oil", 5);
                Core.ensureComplete(3117);
            }

            // Full o' Holes 3118
            Story.killQuest(3118, "Skullpunch", "Shelleton");

            // Keelhaulin' a Kraken! 3119
            Story.killQuest(3119, "ChaosKraken", "Chaos Kraken");
        }
    }

    lowe(): void {
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        if (Core.isCompletedBefore(763)) {
            Core.logger("[Lowe] Complete.");
            return;
        }

        Story.preLoad(this.lowe);

        // Listen to George Lowe's story 750
        Story.chainQuest(750);

        // Ladies First 751
        Story.killQuest(751, "Brain", "Slimed Girl");

        // Slimy Boys 752
        Story.killQuest(752, "Brain", "Slimed Boy");

        // The Slime Masquerade 753
        Story.killQuest(753, "Brain", "Brain Slurper");

        // ONE OF THEM 754
        Story.mapItemQuest(754, "Brain", 132);

        // Spilt Salt 755
        Story.killQuest(755, "Brain", "Slimed Girl");

        // Defeat the Giant Brain Slime Prime 756
        Story.chainQuest(756);

        // The First 6 Chapters 757
        if (!Story.questProgression(757)) {
            Core.ensureAccept(757);
            Core.huntMonster("ebildread", "Pink Ghostly Sheet", "Lowe-anomicon Chapter 2");
            Core.huntMonster("ebildread", "Pink Ghostly Sheet", "Lowe-anomicon Chapter 3");
            Core.huntMonster("ebildread", "Pink Ghostly Sheet", "Lowe-anomicon Chapter 4");
            Core.huntMonster("ebildread", "Pink Ghostly Sheet", "Lowe-anomicon Chapter 5");
            Core.huntMonster("ebildread", "Pink Ghostly Sheet", "Lowe-anomicon Chapter 6");
            Core.huntMonster("ebildread", "Pink Ghostly Sheet", "Lowe-anomicon Chapter 1");
            Core.ensureComplete(757);
        }

        // The Last 6 Chapters 758
        if (!Story.questProgression(758)) {
            Core.ensureAccept(758);
            Core.huntMonster("ebildread", "Pink Skeletal Soldier", "Lowe-anomicon Chapter 7");
            Core.huntMonster("ebildread", "Pink Skeletal Soldier", "Lowe-anomicon Chapter 8");
            Core.huntMonster("ebildread", "Pink Skeletal Soldier", "Lowe-anomicon Chapter 9");
            Core.huntMonster("ebildread", "Pink Skeletal Soldier", "Lowe-anomicon Chapter 10");
            Core.huntMonster("ebildread", "Pink Skeletal Soldier", "Lowe-anomicon Chapter 11");
            Core.huntMonster("ebildread", "Pink Skeletal Soldier", "Lowe-anomicon Chapter 12");
            Core.ensureComplete(758);
        }

        // The Glossary 759
        Story.killQuest(759, "Ebildread", "Jay Sun");

        // Cover Me 760
        Story.killQuest(760, "Ebildread", "Pink Hand");

        // Dweam-Maze 761
        Story.chainQuest(761);

        // Big Bad Kwueger Man 762
        Story.chainQuest(762);

        // George Lowe-viathan 763
        Story.chainQuest(763);

        // Super George Lowe-viathan 764
        Story.killQuest(764, "SuperLowe", "Super Lowe-Viathan");
    }

    saloonfront(): void {
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        if (Core.isCompletedBefore(1057)) {
            Core.logger("[Saloonfront] Complete.");
            return;
        }

        Story.preLoad(this.saloonfront);

        // Deady's Return 1042
        Story.chainQuest(1042);

        // Exit, Stage Right 1043
        Story.mapItemQuest(1043, "Fivesaloon", 406);

        // The Wedge 1044
        Story.killQuest(1044, "Fivesaloon", "Bulletless Bandit");

        // Freedom? 1045
        Story.mapItemQuest(1045, "Fivesaloon", 407);

        // Other Ideas?! 1046
        Story.killQuest(1046, "Fivesaloon", "Storagebox");

        // Got a Light 1047
        Story.killQuest(1047, "Fivesaloon", "Bulletless Bandit");

        // BADABOOM! 1048
        Story.mapItemQuest(1048, "Fivesaloon", 408);

        // Lack of Subtlety 1049
        Story.killQuest(1049, "Fivesaloon", "One-Armed Bandit");

        // Look Around 1050
        Story.mapItemQuest(1050, "Train", 409);

        // Caboose Key 1051
        Story.killQuest(1051, "Train", "Ghostly Conductor");

        // Slow your Role 1052
        Story.mapItemQuest(1052, "Train", 410);

        // Slow the Coal 1053
        Story.killQuest(1053, "Train", "Coal Ghoul");

        // Laying Traps 1054
        Story.mapItemQuest(1054, "Blackstone", 411, 12);

        // Gathering Mats 1055
        Story.mapItemQuest(1055, "Blackstone", 412, 12);

        // Pirate Hats 1056
        Story.killQuest(1056, "Blackstone", "Necrosian Soldier");

        // That's a Wrap 1057
        Story.killQuest(1057, "Blackstone", "Yahorneth");
    }

    firehouse(): void {
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        if (Core.isCompletedBefore(1564)) {
            Core.logger("[Firehouse] Complete.");
            return;
        }

        Story.preLoad(this.firehouse);

        // Gaining Trust 1552
        if (!Story.questProgression(1552)) {
            Core.ensureAccept(1552);
            Core.huntMonster("firetown", "Fire Elemental", "Charyi's Garnet Bead");
            Core.huntMonster("firetown", "Fire Elemental", "Yans' Charred Spade Handle");
            Core.huntMonster("firetown", "Fire Elemental", "Kierk's Missing Gear");
            Core.ensureComplete(1552);
        }

        // If You Can't Stand the Heat... 1553
        Story.killQuest(1553, "FireTown", "Fire Elemental");

        // Retrieving Recollections 1554
        Story.mapItemQuest(1554, "FireTown", 790, 10);

        // Under Orders 1555
        Story.killQuest(1555, "FireRiver", "Swamp Thing");

        // Locket Holds the Key 1556
        Story.killQuest(1556, "FireRiver", "Lava Bat");

        // Plans Fit for a King 1557
        Story.mapItemQuest(1557, "FireRiver", 792, 10);

        // Bound by Fire 1558
        Story.killQuest(1558, "FireTunnel", "Volcanic Ash Imp");

        // Heart of Fire 1559
        Story.mapItemQuest(1559, "FireTunnel", 791, 10);

        // Spirit of a Dragon 1560
        Story.killQuest(1560, "FireTunnel", "Elder Magma Wyrm");

        // Initiate Shutdown Sequence 1561
        Story.chainQuest(1561);

        // Aura of Dragon's Flame 1562
        Story.killQuest(1562, "FireTunnel", "Elder Magma Wyrm");

        // Spirit of the Black Unicorn 1563
        if (!Story.questProgression(1563)) {
            Core.ensureAccept(1563);
            Core.huntMonster("firetown", "Obsidian Golem", "Heart of Stone", 5);
            Core.huntMonster("firetown", "Fire Spirit", "Fiery Will", 5);
            Core.huntMonster("fireriver", "Loup-Garou", "Primal Spirit", 5);
            Core.ensureComplete(1563);
        }

        // Tie a Black Ribbon 'Round an Old Burnt Tree 1564
        Story.killQuest(1564, "FireTown", "Burnt Tree");
    }

    sleezter(): void {
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        if (Core.isCompletedBefore(1972)) {
            Core.logger("[Sleezter] Complete.");
            return;
        }

        Story.preLoad(this.sleezter);

        // Make Way 1961
        Story.killQuest(1961, "Sleezter", "BunnyMinion");

        // Black Pelt Test 1962
        Story.killQuest(1962, "Sleezter", "BunnyMinion");

        // Network Fiber Spool 1963
        Story.mapItemQuest(1963, "Sleezter", 973, 6);

        // Guess What in a Guess Where 1964
        Story.mapItemQuest(1964, "Sleezter", 974);

        // Splitting Hares 1965
        Story.killQuest(1965, "Sleezter", "BunnyMinion");

        // Sleezter Bunny's Quarters 1966
        Story.mapItemQuest(1966, "Sleezter", 975);

        // The Sleezter Bunivinci Code 1967
        Story.killQuest(1967, "Sleezter", "BunnyMinion");

        // Take Sleezter Bunny Out! 1968
        Story.killQuest(1968, "Sleezter", "Sleezter Bunny");

        // Mantis Ray Repair 1969
        Story.mapItemQuest(1969, "Sleezter", 976, 6);

        // A Map Wouldn't Hurt 1970
        Story.killQuest(1970, "Sleezter", "BunnyMinion");

        // Endin' Minions 1971
        Story.mapItemQuest(1971, "Sleezter", 977);

        // Breaking Bad Eggs 1972
        Story.mapItemQuest(1972, "Sleezter", 978);

        // Mantis Ray
        Story.chainQuest(2021);
    }

    neverhub(): void {
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        if (Core.isCompletedBefore(2234)) {
            Core.logger("[Neverhub] Complete.");
            return;
        }

        Story.preLoad(this.neverhub);

        // Find the Shadow's Door 2222
        Story.mapItemQuest(2222, "neverlore", 1315);

        // One-way Trip to Neverworld 2223
        Story.killQuest(2223, "neverlore", "Whablobble");

        // Slash the Shadows 2224
        Story.killQuest(2224, "Neverworld", "Spid-Squider");

        // Deprogramming for Dummies 2225
        Story.mapItemQuest(2225, "Neverworld", 1316, 10);
        Story.killQuest(2225, "Neverworld", "Snackistopheles");

        // Guardian of the Lab-rary 2226
        if (!Story.questProgression(2226)) {
            Core.ensureAccept(2226);
            Core.huntMonster("Neverworld", "Fishizzle", "Answer 5");
            Core.huntMonster("Neverworld", "Spid-Squider", "Answer 4");
            Core.huntMonster("Neverworld", "Spid-Squider", "Answer 2");
            Core.huntMonster("Neverworld", "Snackistopheles", "Answer 1");
            Core.huntMonster("Neverworld", "Snackistopheles", "Answer 3");
            Story.mapItemQuest(2226, "Neverworld", 1317);
        }

        // Quick switch! 2227
        Story.mapItemQuest(2227, "Neverworld", 1318, 5);
        Story.mapItemQuest(2227, "Neverworld", 1326);

        // We're BOOM-ed! 2228
        Story.mapItemQuest(2228, "Neverworld", 1321);

        // De-Generation Situation 2229
        Story.killQuest(2229, "Neverworld", "Generator");

        // Shielded Against the Shadows 2230
        Story.mapItemQuest(2230, "Neverworld", 1319);
        Story.killQuest(2230, "Neverworld", "Fishizzle");

        // Making a Many-armed Army 2231
        Story.killQuest(2231, "Neverworld", "Kennel Door");

        // Kreature Kibble  Khaos 2232
        Story.mapItemQuest(2232, "Neverworld", 1320, 10);

        // The Gang's Not All Here 2233
        Story.killQuest(2233, "Neverworld", "Fishizzle");

        // Beast Maker Beat-down 2234
        Story.chainQuest(2234);
    }

    battledoom(): void {
        const QuestLogic = (): void => {
            switch (Story.legacyQuestId) {
                case 4648:
                    // Shadowy Reconnaissance 4648
                    Core.huntMonster("Battledoom", "Shadow Slime", "Shadow Slime Defeated", 5);
                    Core.huntMonster("Battledoom", "Shadow Flying Eye", "Shadow Eyeball Defeated", 3);
                    break;
                case 4649:
                    // Slippery Shadows 4649
                    Core.huntMonster("Battledoom", "Shadow Skelly", "Necronomicon Page", 6);
                    break;
                case 4650:
                    // Through the Looking-Glass 4650
                    Core.huntMonster("Battledoom", "Shadow Skelly", "Mirror Fragment Retrieved");
                    break;
                case 4651:
                    // Necro-Polished 4651
                    Core.getMapItem(3976, 1, "necropolis");
                    Core.huntMonster("Battledoom", "Shadow Skelly", "Shadow Skeletons Defeated", 13);
                    break;
                case 4652:
                    // Cavernous Chaos 4652
                    Core.huntMonster("NecroCavern", "Shadow Imp", "Mirror Fragment Found");
                    Core.huntMonster("NecroCavern", "ShadowStone Elemental", "Mirror Fragment Located");
                    break;
                case 4653:
                    // Mirror, Mirror, Off the Wall 4653
                    Core.getMapItem(3975, 1, "battleoff");
                    Core.huntMonster("Battleoff", "Evil Moglin", "Evil Moglin Defeated", 3);
                    break;
                case 4654:
                    // To the Underworld! 4654
                    Core.huntMonster("Underworld", "Undead Legend", "Mirror Fragment Obtained");
                    Core.huntMonster("Underworld", "Klunk", "Mirror Fragment Acquired");
                    break;
                case 4655:
                    // Shadow of Corruption 4655
                    Core.huntMonster("CelestialRealm", "Shadow Beast", "Final Mirror Fragment Found");
                    break;
                case 4656:
                    // Hunt for Shadowglass Shards 4656
                    Core.huntMonster("Battledoom", "Shadow Skelly", "Shadow Skeleton Defeated", 5);
                    Core.huntMonster("Battledoom", "Shadow Slime", "Shadow Slime Defeated", 5);
                    Core.huntMonster("Battledoom", "Shadow Flying Eye", "Shadow Eyeball Defeated", 5);
                    Core.huntMonster("Battledoom", "Shadow Beast", "Shadow Beast Defeated", 5);
                    break;
            }
        };
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        //Banking Black List doesn't do anything after SetOptions has been called. ~Lord Exelot
        //                                       "Unlucky Gem IV", "Unlucky Gem V", "Unlucky Gem VI",
        //                                       "Unlucky Gem VII", "Cursed Mirror of Enutrof", "Shadowglass Shard" });

        // Check if item is in inventory
        if (Core.checkInventory("Cursed Mirror of Enutrof")) {
            Core.logger("[Battledoom] Complete.");
            return;
        }

        Story.legacyQuestManager(QuestLogic, 4648, 4649, 4650, 4651, 4652, 4653, 4654, 4655, 4656);
    }

    wormhole(): void {
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        if (Core.isCompletedBefore(5066)) {
            Core.logger("[Wormhole] Complete.");
            return;
        }

        Story.preLoad(this.wormhole);

        // Something In The Air 5051
        if (!Story.questProgression(5051)) {
            Core.ensureAccept(5051);
            Core.huntMonster("wormhole", "Goth Girl", "Goth Girl Gas Masked", 4);
            Core.huntMonster("wormhole", "Vamp Boy", "Vampire Boy Gas Masked", 4);
            Core.ensureComplete(5051);
        }

        // They're Not Red Shirts - They're Deadshirts! 5052
        Story.mapItemQuest(5052, "Wormhole", [4420, 4421, 4422]);
        Story.killQuest(5052, "Wormhole", "Deadshirt");

        // Curses! 5053
        Story.killQuest(5053, "Wormhole", "Cursed Alien");

        // Computers Don't Lie 5054
        Story.mapItemQuest(5054, "Wormhole", [4423, 4424, 4425, 4426]);

        // Beam Me Up! 5055
        if (!Story.questProgression(5055)) {
            Core.ensureAccept(5055);
            Core.huntMonster("wormhole", "Undead Astronaut", "Teleporter Passcode");
            Core.huntMonster("wormhole", "Undead Astronaut", "Undead Astronaut Defeated", 6);
            Core.ensureComplete(5055);
        }

        // Exotic Pets 5056
        Story.killQuest(5056, "Wormhole", "Xenodog");

        // Not Trobbles 5057
        Story.killQuest(5057, "Wormhole", "Green Trobbolier");

        // System Failure! 5058
        Story.mapItemQuest(5058, "Wormhole", 4428);

        // I Think I Saw This Movie Once 5059
        Story.killQuest(5059, "Wormhole", "Space Horror");

        // I Have A Short Fuse 5060
        Story.mapItemQuest(5060, "Wormhole", 4427, 6);
        Story.killQuest(5060, "Wormhole", "Volatile Current");

        // More Trobboliers 5061
        if (!Story.questProgression(5061)) {
            Core.ensureAccept(5061);
            Core.killMonster("Wormhole", "r5", "left", "Red Trobbolier", "Trobbolier Punted", 4);
            Core.ensureComplete(5061);
        }

        // Maybe These Guys Know Something 5062
        if (!Story.questProgression(5062)) {
            Core.ensureAccept(5062);
            Core.huntMonster("wormhole", "Stormslasher", "Slasher Transmission", 3);
            Core.huntMonster("wormhole", "Undead Space Marine", "Marine Transmission", 3);
            Core.ensureComplete(5062);
        }

        // Look At That Awesome Armor! 5063
        Story.killQuest(5063, "Wormhole", "Stormslasher");

        // Guardians of the Warehouse 5064
        Story.killQuest(5064, "Wormhole", "Guardian");

        // Undead Space 5065
        if (!Story.questProgression(5065)) {
            Core.ensureAccept(5065);
            Core.huntMonster("wormhole", "Space Ghost", "Space Ghost Exorcised", 5);
            Core.huntMonster("wormhole", "Singularity", "Singularity Destroyed", 5);
            Core.ensureComplete(5065);
        }

        // Trobbolegion! 5066
        Story.killQuest(5066, "Wormhole", "Trobbolegion");
    }

    crownsreachfxiii(): void {
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        if (Core.isCompletedBefore(5646)) {
            Core.logger("[Crownsreachfxiii] Complete.");
            return;
        }

        Story.preLoad(this.crownsreachfxiii);

        // Those Bloody Maggots 5637
        Story.mapItemQuest(5637, "CrownsReachFXIII", 5115, 8);
        Story.killQuest(5637, "CrownsReachFXIII", "Blood Maggot");

        // Purple is the Best Color 5639
        if (!Story.questProgression(5639)) {
            Core.ensureAccept(5639);
            Core.getMapItem(5114, 1, "Safiria");
            Core.huntMonster("safiria", "Albino Bat ", "Scraps of Velvet", 8);
            Core.ensureComplete(5639);
        }

        // Get Some Candles 5640
        Story.killQuest(5640, "BattleUnderA", "Skeletal Fire Mage");

        // Time For a Break 5641
        Story.mapItemQuest(5641, "CrownsReachFXIII", 5116);
        Story.killQuest(5641, "CrownsReachFXIII", "Vampire Bat");

        // Call the Exterminator 5642
        Story.killQuest(5642, "CrownsReachFXIII", "Eldritch Parasite");

        // Calm the Villagers 5643
        Story.killQuest(5643, "CrownsReachFXIII", "Panicking Villager");

        // Clean up the Ooze 5644
        Story.killQuest(5644, "CrownsReachFXIII", "Crawling Ooze");

        // They Stole My Stuff! 5645
        Story.killQuest(5645, "CrownsReachFXIII", "Crawling Ooze");

        // Ia! Ia! Shub'hathrys Fhtagn! 5646
        Story.killQuest(5646, "CrownsReachFXIII", "Shub-Hathrys");
    }

    gonnagetcha(): void {
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        if (Core.isCompletedBefore(6269)) {
            Core.logger("[Gonnagetcha] Complete.");
            return;
        }

        Story.preLoad(this.gonnagetcha);

        // Who Screamed? 6259
        Story.mapItemQuest(6259, "Gonnagetcha", 5735);
        Story.killQuest(6259, "Gonnagetcha", "Vengeful Ghost");

        // Check the Other Cabin 6260
        Story.mapItemQuest(6260, "Gonnagetcha", 5736, 3);
        Story.killQuest(6260, "Gonnagetcha", "Restless Spirit");

        // Check the Staff Building 6261
        Story.mapItemQuest(6261, "Gonnagetcha", 5737);
        Story.killQuest(6261, "Gonnagetcha", "Restless Spirit");

        // What are They Looking For? 6262
        Story.mapItemQuest(6262, "Gonnagetcha", [5738, 5739]);

        // Cysero was Right! 6263
        if (!Story.questProgression(6263)) {
            Core.ensureAccept(6263);
            Core.huntMonster("gonnagetcha", "Murkonian", "Murkonian Slain", 10);
            Core.huntMonster("gonnagetcha", "Murkonian", "Black Knights Cabin Key");
            Core.ensureComplete(6263);
        }

        // Explore the Black Knight's Cabin 6264
        Story.mapItemQuest(6264, "Gonnagetcha", [5740, 5741]);
        Story.killQuest(6264, "Gonnagetcha", "Black Knight Spirit");

        // Get Through the Mirror 6265
        Story.mapItemQuest(6265, "Gonnagetcha", [5742, 5743]);

        // Rescue the Campers 6266
        Story.mapItemQuest(6266, "Gonnagetcha", 5744, 6);
        Story.killQuest(6266, "Gonnagetcha", "Shrade Cultist");

        // Stop the Ringleader 6267
        Story.killQuest(6267, "Gonnagetcha", "Bride of Shrade");

        // Defeat Shrade! 6268
        Story.killQuest(6268, "Gonnagetcha", "Shrade");

        // Revitalize the Camp 6269
        if (!Story.questProgression(6269)) {
            Core.ensureAccept(6269);
            Core.huntMonster("gonnagetcha", "Shrade Cultist", "Cultist Cleared", 6);
            Core.huntMonster("gonnagetcha", "Vengeful Ghost", "Ghost Gone", 2);
            Core.ensureComplete(6269);
        }
    }

    greymoor(): void {
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        if (Core.isCompletedBefore(6420)) {
            Core.logger("[Greymoor] Complete.");
            return;
        }

        Story.preLoad(this.greymoor);

        // Tired of Gremlins 6409
        if (!Story.questProgression(6409)) {
            Core.ensureAccept(6409);
            Core.huntMonster("greymoor", "Auto Gremlin", "Jack");
            Core.huntMonster("greymoor", "Auto Gremlin", "Air Pump");
            Core.huntMonster("greymoor", "Auto Gremlin", "Tire Patch");
            Core.ensureComplete(6409);
        }

        // I Don't Mean To Be CRUDE 6410
        Story.killQuest(6410, "Greymoor", "Oil Elemental");

        // When I Say Jump... 6411
        Story.killQuest(6411, "Greymoor", "Huge Auto Gremlin");

        // Energizing! 6412
        Story.killQuest(6412, "Greymoor", "Energy Elemental");

        // Cabin in the Woods 6413
        Story.mapItemQuest(6413, "Greymoor", 5912, 5);

        // A Base-ic Solution 6414
        Story.killQuest(6414, "Greymoor", "Spooky Treeant");

        // Surprise! 6415
        Story.mapItemQuest(6415, "Greymoor", [5913, 5914]);

        // First Aid Supplies 6416
        Story.killQuest(6416, "Greymoor", "Spooky Treeant");

        // Wood for Trap? 6421
        Story.killQuest(6421, "Greymoor", "Spooky Treeant");

        // Tool Time 6417
        Story.mapItemQuest(6417, "Greymoor", 5915);

        // Obstacle Course 6418
        Story.mapItemQuest(6418, "Greymoor", 5916, 5);

        // Barricades! 6419
        Story.mapItemQuest(6419, "Greymoor", 5917, 4);

        // Take Him Out! 6420
        Story.killQuest(6420, "Greymoor", "Shrade");
    }

    puzzlebox(): void {
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        if (Core.isCompletedBefore(7399)) {
            Core.logger("[Puzzlebox] Complete.");
            return;
        }

        Story.preLoad(this.puzzlebox);

        // Find the Souls 7394
        Story.killQuest(7394, "PuzzleBox", "Bones of the Doomed");

        // The Blackened Heart 7395
        if (!Story.questProgression(7395)) {
            Core.ensureAccept(7395);
            Core.huntMonsterMapID("PuzzleBox", 13, "Blackened Heart");
            Core.ensureComplete(7395);
        }

        // The Ancient Athame 7396
        if (!Story.questProgression(7396)) {
            Core.ensureAccept(7396);
            Core.huntMonsterMapID("PuzzleBox", 14, "Ancient Athame");
            Core.ensureComplete(7396);
        }

        // The Withered Hand 7397
        if (!Story.questProgression(7397)) {
            Core.ensureAccept(7397);
            Core.huntMonsterMapID("PuzzleBox", 15, "Withered Hand");
            Core.ensureComplete(7397);
        }

        // The Bones 7398
        Story.killQuest(7398, "PuzzleBox", "Bones of the Doomed");

        // The Puzzle 7399
        Story.mapItemQuest(7399, "PuzzleBox", 7165);
    }

    splatterwar(): void {
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        if (Core.isCompletedBefore(7407)) {
            Core.logger("[Splatterwar] Complete.");
            return;
        }
        this.puzzlebox();
        Story.preLoad(this.splatterwar);

        // Slasher Medals 7400
        Story.killQuest(7400, "SplatterWarDage", "Bladehands");

        // Mega Slasher Medals 7402
        Story.killQuest(7402, "SplatterWarDage", "Bladehands");

        // Bladehands 7404
        Story.killQuest(7404, "SplatterWarDage", "Bladehands");

        // Defeat Shrade 7406
        Story.killQuest(7406, "SplatterWarDage", "Shrade");

        // Legion Medals 7401
        Story.killQuest(7401, "SplatterWarShrade", "Legion Maw");

        // Mega Legion Medals 7403
        Story.killQuest(7403, "SplatterWarShrade", "Legion Maw");

        // Jagged Canines 7405
        Story.killQuest(7405, "SplatterWarShrade", "Legion Maw");

        // Defeat Dage 7407
        Story.killQuest(7407, "SplatterWarShrade", "Dage The Evil");
    }

    deadfly(): void {
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        if (Core.isCompletedBefore(8232)) {
            Core.logger("[Deadfly] Complete.");
            return;
        }

        Story.preLoad(this.deadfly);

        // The Flies 8217
        Story.killQuest(8217, "Deadfly", "Grave Flies");

        // Dem Bones 8218
        Story.mapItemQuest(8218, "Deadfly", 8766, 8);

        // Gather the Reagents 8219
        Story.mapItemQuest(8219, "Deadfly", 8767, 7);
        Story.killQuest(8219, "Deadfly", "Skeletal Minion");

        // Rip it Out 8220
        Story.killQuest(8220, "Deadfly", "Gutripper");

        // Steal the Wands 8221
        Story.killQuest(8221, "Deadfly", "Skeletal Mage");

        //Get to Emily 8222
        Story.mapItemQuest(8222, "Deadfly", 8768);

        // More of the Flies 8223
        Story.killQuest(8223, "Deadfly", "Grave Flies");

        // Follow the Swarm 8224
        Story.mapItemQuest(8224, "Deadfly", [8769, 8770]);

        // Find Emily 8225
        Story.mapItemQuest(8225, "Deadfly", 8771);
        Story.killQuest(8225, "Deadfly", "Skeletal Mage");

        // The Deadfly 8226
        Story.killQuest(8226, "Deadfly", "Deadfly");

        // Gossip Time 8227
        Story.killQuest(8227, "Deadfly", "Skeletal Minion");

        // Souls for Offering 8228
        if (!Story.questProgression(8228)) {
            Core.ensureAccept(8228);
            Core.huntMonster("deadfly", "Skeletal Mage", "Fresh Soul", 8, { log: false });
            Core.getMapItem(8772, 1, "deadfly");
            Core.ensureComplete(8228);
        }

        // Clue by 8 8229
        Story.killQuest(8229, "RotFinger", "Lost Soul");

        // Cloth n' Coal 8230
        Story.mapItemQuest(8230, "RotFinger", 8773, 5);
        Story.killQuest(8230, "RotFinger", "Blade Master");

        // Bait the Hook 8231
        Story.mapItemQuest(8231, "RotFinger", 8774, 10);

        // Rotfinger's Reckoning 8232
        Story.killQuest(8232, "RotFinger", "Rotfinger");
    }

    oddities(): void {
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        if (Core.isCompletedBefore(8667)) {
            Core.logger("[Oddities] Complete.");
            return;
        }

        Story.preLoad(this.oddities);

        // Shop of Vandalized Horrors 8654
        if (!Story.questProgression(8654)) {
            Core.ensureAccept(8654);
            Core.killMonster("Oddities", "Enter", "Spawn", "*", "Cursed Artifact Slain", 13);
            Core.ensureComplete(8654);
        }

        // Browsing for a Way Out 8655
        Story.mapItemQuest(8655, "Oddities", 10149);

        // Key for Free 8656
        Story.mapItemQuest(8656, "Oddities", 10150, 4);
        Story.mapItemQuest(8656, "Oddities", 10151);
        Story.killQuest(8656, "Oddities", "Cursed Doll-Head");

        // Rampaging Desk Jockey 8657
        Story.killQuest(8657, "Oddities", "Writing Desk");

        // Steeped in Porcelain 8658
        Story.mapItemQuest(8658, "Oddities", 10152);
        Story.mapItemQuest(8658, "Oddities", 10153, 2);
        Story.mapItemQuest(8658, "Oddities", 10154);
        Story.killQuest(8658, "Oddities", ["Cursed Curio", "Gothic Chest", "Oddity Swarm"]);

        // Stuffy Guests  8659
        Story.killQuest(8659, "Oddities", "Creepy Baby");

        // Snotty Crumbs 8660
        if (!Story.questProgression(8660)) {
            Core.ensureAccept(8660);
            Core.huntMonster("oddities", "Oddity Swarm", "Black Slime Glob", 5);
            Core.huntMonster("oddities", "Cursed Doll-Head", "Dried Ectoplasm", 5);
            Core.ensureComplete(8660);
        }

        // Wobbly Rune Writing 8661
        Story.mapItemQuest(8661, "Oddities", 10155, 6);

        // Broken Sights 8662
        Story.killQuest(8662, "Oddities", "Opera Glasses");

        // Teddy Tailor 8663
        if (!Story.questProgression(8663)) {
            Core.ensureAccept(8663);
            Core.huntMonster("Oddities", "Cursed Curio", "Bow Tie");
            Core.huntMonster("Oddities", "Creepy Baby", "Button Eye", 2);
            Core.huntMonster("Oddities", "Dready Bear", "Party Hat");
            Core.huntMonster("Oddities", "Dready Bear", "Fur Scrap", 6);
            Core.ensureComplete(8663);
        }
        // Immaterial Dowsing 8664
        Story.killQuest(8664, "Oddities", "Dready Bear");

        // Be Our Bait Guest 8665
        Story.mapItemQuest(8665, "Oddities", 10156);

        // Pint-Sized Poltergeist 8666
        Story.killQuest(8666, "Oddities", "Cursed Spirit");

        // Deep Cleanse 8667
        if (!Story.questProgression(8667, { getReward: false })) {
            Core.ensureAccept(8667);
            Core.huntMonster("oddities", "Cursed Spirit", "Doll Eyes", 7);
            Core.huntMonster("oddities", "Cursed Curio ", "Chipped Wood", 7);
            Core.huntMonster("oddities", "Creepy Baby", "Fuzz Tuff", 7);
            Core.ensureComplete(8667);
        }
    }

    blackMaze(): void {
        if (!this.friday13thCheck()) {
            Core.logger(
                !Core.isSeasonalMapActive("blackmaze")
                    ? "seasonal maps not available"
                    : "Friday the 13th not active yet",
            );
            return;
        }

        if (Core.isCompletedBefore(9055)) {
            Core.logger("[BlackMaze] Complete.");
            return;
        }
        //9045 | Gobbling Globlins
        Story.mapItemQuest(9045, "blackmaze", 11085);
        Story.killQuest(9045, "blackmaze", "Globlin");

        //9046 | Flowers for Forever
        Story.mapItemQuest(9046, "blackmaze", 11086, 2);
        Story.mapItemQuest(9046, "blackmaze", 11087);

        //9047 | A Memory’s Shadow
        Story.killQuest(9047, "blackmaze", "Shadow Demon");

        //9048 | Behind the Bones
        Story.mapItemQuest(9048, "blackmaze", 11088);
        Story.mapItemQuest(9048, "blackmaze", 11089, 3);
        Story.killQuest(9048, "blackmaze", "Screamon");

        //9049 | Peek-a-Bones
        Story.mapItemQuest(9049, "blackmaze", 11090, 2);
        Story.killQuest(9049, "blackmaze", "Screamon");

        //9050 | Extreme Exfoliation
        Story.mapItemQuest(9050, "blackmaze", 11091, 4);
        Story.killQuest(9050, "blackmaze", "Possessed Bones");

        //9051 | Easy Pickings
        Story.mapItemQuest(9051, "blackmaze", 11092, 2);
        Story.killQuest(9051, "blackmaze", "Shadow Demon");

        //9052 | On Deaf Ears
        Story.killQuest(9052, "blackmaze", "Vi'eel Dreaddacovra");

        //9053 | Neurocranium in a Haystack
        if (!Story.questProgression(9053)) {
            Core.ensureAccept(9053);
            Core.huntMonster("blackmaze", "Screamon", "Screamon Defeated", 5);
            Core.huntMonster("blackmaze", "Globlin", "Globlin Defeated", 5);
            Core.huntMonster("blackmaze", "Shadow Demon", "Shadows Defeated", 5);
            Core.ensureComplete(9053);
        }

        //9054 | Burning Skeleman
        Story.mapItemQuest(9054, "blackmaze", 11093);
        Story.killQuest(9054, "blackmaze", "Possessed Bones");

        //9055 | With the Power
        Story.killQuest(9055, "blackmaze", "Shadow Fernando");
    }
}
