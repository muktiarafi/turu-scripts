/*
name: null
description: null
tags: null
*/
// Port of Scripts/Seasonal/Mogloween/CoreMogloween.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class CoreMogloween {
    doAll(): void {
        if (!Core.isSeasonalMapActive("mogloween")) {
            return;
        }
        this.mogloween();
        this.candyShop();
        this.candyCorn();
        this.pie();
        this.asylum();
        this.poeHub();
        this.mystcroftForest();
        this.chromafection();
        this.twigsArcade();
        this.masquerade();
        this.that();
        this.necroCarnival();
        this.trickTown();
        this.cursedCastle();
        this.eldritchbattletown();
        this.eldritchWorld();
        this.elodeaTemple();
        this.birgittaMogloween();
        this.shadowSlayerWar();
        this.walpurgisnacht();
    }

    mogloween(): void {
        if (!Core.isSeasonalMapActive("mogloween")) {
            return;
        }
        if (Core.isCompletedBefore(395)) {
            return;
        }

        Story.preLoad(this.mogloween);
        //Candy Craze 95
        Story.killQuest(95, "mogloween", "Pumpkinhead Fred");

        //Chocolate Goodness 96
        Story.killQuest(96, "mogloween", "Pumpkinhead Fred");

        //Chilling Costume 93
        Story.killQuest(93, "mogloween", "Ghostly Sheet");

        //Candy Basket 94
        Story.killQuest(94, "mogloween", "Pumpkinhead Fred");

        //Lollipop Potion 97
        Story.killQuest(97, "mogloween", "Jack-O-Doom");

        //Mystery Candy 98
        if (!Story.questProgression(98)) {
            Core.ensureAccept(98);
            Core.killMonster("mogloween", "Pit1", "Right", "Blister", "Mystery Candy", 3);
            Core.ensureComplete(98);
        }

        //Can't have enough 99
        if (!Story.questProgression(99)) {
            Core.ensureAccept(99);
            Core.killMonster("mogloween", "Pit1", "Right", "Blister", "Mystery Candy", 5);
            Core.ensureComplete(99);
        }

        //Squash the King 391
        Story.killQuest(391, "mogloween", "Great Pumpkin King");

        //A Bone To Pick 392
        Story.killQuest(392, "mogloweengrave", "Graveyard Soldier");

        //Were are the Wolves 393
        Story.killQuest(393, "mogloweengrave", "Graveyard Werewolf");

        //Killer, Chiller, Thriller Here Tonight 394
        Story.killQuest(394, "mogloweengrave", "Thriller");

        //Candy Shop Cutscene 395
        Story.mapItemQuest(395, "candyshop", 69);
    }

    candyShop(): void {
        if (!Core.isSeasonalMapActive("candyshop")) {
            return;
        }
        this.mogloween();
        if (Core.isCompletedBefore(401)) {
            return;
        }

        Story.preLoad(this.candyShop);

        //Clear A Path 396
        Story.killQuest(396, "candyshop", "Dark Moglinster");

        //Kanthalite-D 397
        Story.killQuest(397, "candyshop", "Sugarrush Ghoul");

        //Myx It Up 398
        Story.killQuest(398, "candyshop", "Super Moglinster");

        //Candy Conundrum 399
        Story.killQuest(399, "candyshop", "Dark Moglinster");

        //Boos Clues 400
        if (!Story.questProgression(400)) {
            Core.ensureAccept(400);
            Core.huntMonster("voltabolt", "Moglinsterbot", "Fluoride Element");
            Core.huntMonster("voltabolt", "Moglinsterbot", "Stainless Steel Veneers");
            Core.huntMonster("voltabolt", "Nightmare Dentist Chair", "Robotic Drill Bit");
            Core.huntMonster("voltabolt", "Nightmare Dentist Chair", "Fill-up's Screwdriver");
            Core.ensureComplete(400);
        }

        //What’s Up, Doc? 401
        Story.killQuest(401, "voltabolt", "Dental Driller");
    }

    candyCorn(): void {
        if (!Core.isSeasonalMapActive("candycorn")) {
            return;
        }
        this.candyShop();
        if (Core.isCompletedBefore(878)) {
            return;
        }

        Story.preLoad(this.candyCorn);

        //Investigate the Farmhouse 871
        Story.mapItemQuest(871, "candycorn", 193);

        //Children of Chaos 872
        Story.killQuest(872, "candycorn", "Candy Kid");

        //Where is that Barn Key? 873
        Story.killQuest(873, "candycorn", "Candy Kid");

        //Investigate the Barn 874
        Story.mapItemQuest(874, "candycorn", 194);

        //Malik-EYE is so Grounded 875
        Story.killQuest(875, "candycorn", "Malik-EYE");

        //Clearing the Candy Corn Field  876
        Story.killQuest(876, "candycorn", "Field Guardian");

        //So Sick of EYE-Sac 877
        Story.killQuest(877, "candycorn", "EYE-Sac");

        //She Who Walks Behind The Stalks 878
        Story.killQuest(878, "candycorn", "Stalkwalker");
    }

    pie(): void {
        if (!Core.isSeasonalMapActive("pie")) {
            return;
        }
        this.candyShop();
        if (Core.isCompletedBefore(1363)) {
            return;
        }

        Story.preLoad(this.pie);

        //Take a Bite Out of Crime 1355
        Story.killQuest(1355, "pie", "Gourdo");

        //Skullberry Picking 1356
        Story.mapItemQuest(1356, "pie", 654, 10);

        //Can I Axe You a Question 1357
        Story.killQuest(1357, "pie", "Gourdo");

        //Don't Forge-t 1358
        Story.mapItemQuest(1358, "pie", 655);

        //A Monstrous Appetite 1359
        if (!Story.questProgression(1359)) {
            Core.ensureAccept(1359);
            Core.huntMonster("pie", "Gourdo", "Pie Defended", 13);
            Core.huntMonster("pie", "Gourdo", "Friend Avenged", 2);
            Core.ensureComplete(1359);
        }

        //Undead End in Sight 1360
        Story.mapItemQuest(1360, "pie", 656);

        //Missing Servant 1361
        Story.mapItemQuest(1361, "pie", 658);

        //Remember Your Quest 1362
        Story.killQuest(1362, "pie", "Myst Imp");

        //Head to WillowCreek! 1363
        Story.mapItemQuest(1363, "willowcreek", 657);
    }

    asylum(): void {
        if (Core.isCompletedBefore(2466)) {
            return;
        }

        Story.preLoad(this.asylum);

        //Reflect Upon the Situation 2454
        Story.killQuest(2454, "mirrormaze", "Insane Ghoul");

        //Escape the Insanity! 2455
        Story.mapItemQuest(2455, "mirrormaze", 1522);

        //Smoke and Mirrors 2456
        Story.mapItemQuest(2456, "mirrormaze", 1523, 6);

        //Shot in the Dark 2457
        Story.killQuest(2457, "mirrormaze", "Insane Ghoul");

        //Cyser - Oh Where Art Thou? 2458
        Story.mapItemQuest(2458, "mirrormaze", 1524);

        // [[Catacombs]]

        //Tricks Trail Trackin 2459
        Story.mapItemQuest(2459, "catacombs", [1525, 1526, 1527, 1528, 1529, 1530]);

        //Cultivate Answers 2460
        Story.killQuest(2460, "catacombs", "Scorpion Cultist");

        //One Found Doll 2461
        Story.mapItemQuest(2461, "catacombs", 1531);

        //The Key to Saving Kimberly 2462
        Story.killQuest(2462, "catacombs", "Scorpion Cultist");

        //Right Tool for the Job 2463
        Story.mapItemQuest(2463, "catacombs", 1532, 10);

        //Pick the Lock 2464
        Story.mapItemQuest(2464, "catacombs", 1533);

        //Destroy DeSawed 2465
        if (!Story.questProgression(2465)) {
            Core.ensureAccept(2465);
            Core.killMonster("catacombs", "Frame6", "Left", "Dr. De'Sawed", "Disarmed De'Sawed");
            Core.ensureComplete(2465);
        }

        //Demolish DeSawed FOR REAL 2466
        if (!Story.questProgression(2466)) {
            Core.ensureAccept(2466);
            Core.killMonster("catacombs", "Boss2", "Left", "Dr. De'Sawed", "De'Sawed Defeated");
            Core.ensureComplete(2466);
        }
    }

    poeHub(): void {
        if (!Core.isSeasonalMapActive("poehub")) {
            return;
        }
        if (Core.isCompletedBefore(4571)) {
            return;
        }

        Story.preLoad(this.poeHub);

        //Story Time! 3833
        Story.killQuest(3833, "poehub", "Bookcase");

        //Medicine Man 3834
        if (!Story.questProgression(3834)) {
            Core.ensureAccept(3834);
            Core.huntMonster("crusher", "Gothic Chest", "Mortar");
            Core.huntMonster("crusher", "Gothic Chest", "Pestle");
            Core.huntMonster("crusher", "Gothic Chest", "Syringe");
            Core.huntMonster("crusher", "Gothic Chest", "Gourd Medicine Vial");
            Core.ensureComplete(3834);
        }

        //Her Herbalism 3835
        if (!Story.questProgression(3835)) {
            Core.ensureAccept(3835);
            Core.getMapItem(2941, 2, "crusher");
            Core.getMapItem(2942, 3, "crusher");
            Core.getMapItem(2943, 2, "crusher");
            Core.huntMonster("crusher", "Bookcase", "Herbology Book", 1);
            Core.ensureComplete(3835);
        }

        //Extra-Sensory Siblings 3836
        Story.killQuest(3836, "crusher", "Apparition");

        //Dr's House(of Crusher)Call 3837
        Story.mapItemQuest(3837, "crusher", 2944);

        //Spook and the Book 3838
        Story.killQuest(3838, "crusher", "Bookcase");

        //Sampling Sips 3839
        Story.killQuest(3839, "cask", "Moglinberry Vines");

        //Glow with the Flambeaux 3840
        Story.killQuest(3840, "cask", "Fire Performer");

        //Nitre Fighter 3841
        if (!Story.questProgression(3841)) {
            Core.ensureAccept(3841);
            Core.getMapItem(2945, 1, "cask");
            Core.huntMonster("cask", "Nitre Golem", "Nitre Crystal", 1);
            Core.ensureComplete(3841);
        }

        //Spider Trouble 3842
        Story.killQuest(3842, "cask", "Cellar Spider");

        //Coat of Harms 3843
        Story.mapItemQuest(3843, "cask", 2952);

        //Break through the Wall 3844
        Story.mapItemQuest(3844, "cask", 2946);

        //Search the Bones 3845
        Story.mapItemQuest(3845, "cask", 2953);

        //Defeat the Bone Terror 4570
        Story.killQuest(4570, "cask", "Bone Terror");

        //Defeat Macabre Sepulchure 4571
        Story.killQuest(4571, "wyvern", "Macabre Sepulchure");
    }

    mystcroftForest(): void {
        if (!Core.isSeasonalMapActive("mystcroftforest")) {
            return;
        }
        if (Core.isCompletedBefore(5427)) {
            return;
        }

        Story.preLoad(this.mystcroftForest);

        //Tome of The Otherworld 5418
        Story.killQuest(5418, "mystcroftforest", "Eerie Apparition");

        //Monster Data 5419
        Story.killQuest(5419, "mystcroftforest", "Eerie Apparition");

        //The Best Costumes Need the Best Fabric 5420
        Story.killQuest(5420, "mystcroftforest", "Eerie Apparition");

        //Accessorize! 5421
        if (!Story.questProgression(5421)) {
            Core.ensureAccept(5421);
            Core.getMapItem(4801, 8, "mystcroftforest");
            Core.huntMonster("mystcroftforest", "Grim Goblin", "Gobbled String", 1);
            Core.ensureComplete(5421);
        }

        //Make those Munchies 5422
        if (!Story.questProgression(5422)) {
            Core.ensureAccept(5422);
            Core.getMapItem(4802, 8, "mystcroftforest");
            Core.huntMonster("mystcroftforest", "Eerie Apparition", "Truffle Puree", 2);
            Core.ensureComplete(5422);
        }

        //Every Party Needs Drinks 5423
        Story.killQuest(5423, "mystcroftforest", "Grim Goblin");

        //Beautiful Creatures and their Uses 5424
        Story.killQuest(5424, "timevoid", "Void Phoenix");

        //Ooh, Shiny! 5425
        if (!Story.questProgression(5425)) {
            Core.ensureAccept(5425);
            Core.huntMonster("skytower", "Moonstone", "Moonstone Crystal", 10);
            Core.huntMonster("skytower", "Sunstone", "Sunstone Crystal", 10);
            Core.huntMonster("skytower", "Star Sapphire", "Sapphire Crystal", 10);
            Core.ensureComplete(5425);
        }

        //Time to get Dressed Up! 5426
        if (!Story.questProgression(5426)) {
            Core.ensureAccept(5426);
            Core.getMapItem(4800, 1, "mystcroftforest");
            Core.huntMonster("mystcroftforest", "Grim Goblin", "Gilded Bookmark", 1);
            Core.ensureComplete(5426);
        }

        //EEEEK 5427
        Story.killQuest(5427, "mystcroftforest", "Barghest");
    }

    chromafection(): void {
        if (!Core.isSeasonalMapActive("chromafection")) {
            return;
        }
        if (Core.isCompletedBefore(6537)) {
            return;
        }

        Story.preLoad(this.chromafection);

        //Wacky Winka’s Candy Shop 6531
        Story.mapItemQuest(6531, "chromafection", 6004);

        //Nougat-ta Save the Parents 6532
        Story.killQuest(6532, "chromafection", "Colorless Drone");

        //Chroma Kids 6533
        Story.mapItemQuest(6533, "chromafection", 6006, 10);

        //Caramel Clues 6534
        Story.killQuest(6534, "chromafection", "Free Samples");

        //Sweet, Sweet Proof 6535
        Story.mapItemQuest(6535, "chromafection", 6007, 15);

        //Whacky Snacky 6536
        Story.mapItemQuest(6536, "chromafection", 6005);

        //Chroma CRASH 6537
        Story.killQuest(6537, "chromafection", "Chromafection");

        //Color Farming 6538
        Story.killQuest(6538, "chromafection", "Chromafection");
    }

    twigsArcade(): void {
        if (!Core.isSeasonalMapActive("twigsarcade")) {
            return;
        }
        if (Core.isCompletedBefore(6579)) {
            return;
        }

        Story.preLoad(this.twigsArcade);

        //Stop the Hurting 6568
        if (!Story.questProgression(6568)) {
            Core.ensureAccept(6568);
            Core.huntMonster("twigsarcade", "SCOTTY SNEEVIL", 'Mascots "Stopped"', 8);
            Core.ensureComplete(6568);
        }

        //Gather the Goods 6569
        if (!Story.questProgression(6569)) {
            // Hinge
            if (!Story.questProgression(6569)) {
                Core.ensureAccept(6569);
                Core.getMapItem(6069, 3, "twigsarcade");

                // Fully Charged Battery
                Core.getMapItem(6070, 3, "twigsarcade");

                // Wires && Small Screw
                Core.huntMonster("twigsarcade", "SCOTTY SNEEVIL", "Wires", 5);
                Core.huntMonster("twigsarcade", "SCOTTY SNEEVIL", "Small Screw", 16);
                Core.ensureComplete(6569);
            }
        }

        //Spooky Casings 6570
        Story.killQuest(6570, "twigsarcade", "Scotty Sneevil");

        //Do a Goo-d Job 6571
        Story.killQuest(6571, "twigsarcade", "Ectoplasm");

        //Plop Plop Fizz Fizz 6572
        Story.mapItemQuest(6572, "twigsarcade", 6071);

        //Test the Ghost box 6573
        if (!Story.questProgression(6573)) {
            Core.ensureAccept(6573);
            Core.huntMonster("twigsarcade", "SCOTTY SNEEVIL", "Ghost Caught", 5);
            Core.ensureComplete(6573);
        }

        //Get Wid of CWEEPY TWIG 6574
        Story.killQuest(6574, "twigsarcade", "Cweepy Twig");

        //Cranky Spirits 6575
        Story.killQuest(6575, "twigsarcade", "Spirit Residue");

        //It's Too S-warm 6576
        Story.killQuest(6576, "twigsarcade", "Swarmer");

        //Get into the Panic Room 6577
        Story.killQuest(6577, "twigsarcade", "Cweepy Twilly");

        //Smash the Wall 6578
        Story.mapItemQuest(6578, "twigsarcade", 6072);

        //Scary Baby 6579
        Story.killQuest(6579, "twigsarcade", "Baby");
    }

    masquerade(): void {
        if (!Core.isSeasonalMapActive("masquerade")) {
            return;
        }
        if (Core.isCompletedBefore(7154)) {
            return;
        }

        Story.preLoad(this.masquerade);

        //Mmm... Cake 7139
        Story.killQuest(7139, "masquerade", "Harried Waiter");

        //Catch the Sprites 7140
        Story.killQuest(7140, "masquerade", "Garden Sprite");

        //Spicy 7141
        Story.killQuest(7141, "masquerade", "Kitchen Brownie");

        //Things are Getting Hairy 7142
        Story.mapItemQuest(7142, "masquerade", [6779, 6780, 6781, 6782, 6783]);

        //Let 'em Loose 7143
        Story.mapItemQuest(7143, "masquerade", 6784);

        //Gather Spores 7144
        Story.killQuest(7144, "masquerade", "Glowshroom");

        //Getting Dusty 7145
        Story.killQuest(7145, "masquerade", "Garden Sprite");

        //Gather Moss 7146
        Story.killQuest(7146, "masquerade", "Fae Treeant");

        //Feed Bramblebite 7147
        Story.mapItemQuest(7147, "masquerade", 6785);

        //Feed Bramblebite 7148
        if (!Story.questProgression(7148)) {
            Core.ensureAccept(7148);
            Core.getMapItem(6786, 6, "masquerade");
            Core.huntMonster("masquerade", "Glass Spitter", "Gemseeds", 10);
            Core.ensureComplete(7148);
        }

        //So Glamourous 7149
        Story.killQuest(7149, "masquerade", "Garden Sprite");

        //Likin' the Lichen 7150
        Story.killQuest(7150, "masquerade", "Fae Treeant");

        //It's Wine Time 7151
        Story.killQuest(7151, "masquerade", "Wandering Guest");

        //Nap Time for Barb 7152
        if (!Story.questProgression(7152)) {
            Core.ensureAccept(7152);
            Core.getMapItem(6789, 1, "masquerade");
            Core.huntMonster("masquerade", "Scriptkeeper", "Put Barb to Sleep", 1);
            Core.ensureComplete(7152);
        }

        //Sneak Out 7153
        Story.mapItemQuest(7153, "masquerade", 6787);

        //Break Out 7154
        Story.killQuest(7154, "masquerade", "Aermhar");
    }

    that(): void {
        if (!Core.isSeasonalMapActive("that")) {
            return;
        }
        if (Core.isCompletedBefore(7179)) {
            return;
        }

        Story.preLoad(this.that);

        //Yeti Witual 7167
        if (!Story.questProgression(7167)) {
            Core.ensureAccept(7167);
            Core.getMapItem(6790, 8, "that");
            Core.huntMonster("that", "Candy Goblin", "Witch Twuffles", 8);
            Core.ensureComplete(7167);
        }

        //Get the Fur 7168
        Story.killQuest(7168, "that", "Moglinster");

        //Vapor Needed 7169
        Story.killQuest(7169, "that", "Mystcroft Ghost");

        //Trap the Flame 7170
        Story.killQuest(7170, "that", "Will o' The Wisp");

        //Down the Well 7171
        Story.mapItemQuest(7171, "that", 6791);

        //Cweepie-cwawlie Time 7172
        if (!Story.questProgression(7172)) {
            Core.ensureAccept(7172);
            Core.huntMonster("that", "Well Spider", "Minion Slain", 10);
            Core.ensureComplete(7172);
        }

        //Gwoop Destruction 7173
        Story.killQuest(7173, "that", "Congealed Fear");

        //Seawch for Bubble 7174
        Story.mapItemQuest(7174, "that", 6792, 6);
        Story.mapItemQuest(7174, "that", 6793);

        //Free Bubble! 7175
        if (!Story.questProgression(7175)) {
            Core.ensureAccept(7175);
            Core.getMapItem(6794, 1, "that");
            Core.huntMonster("that", "Congealed Fear", "Skeleton Key", 1);
            Core.ensureComplete(7175);
        }

        //Echo... echo... echo 7176
        Story.killQuest(7176, "that", "Echo of That");

        //Gather Hope 7177
        Story.killQuest(7177, "that", "Shattered Hope");

        //Bweak the Blacklights 7178
        Story.killQuest(7178, "that", "Blacklights");

        //Get Wid of THAT 7179
        Story.killQuest(7179, "that", "That");
    }

    necroCarnival(): void {
        if (!Core.isSeasonalMapActive("necrocarnival")) {
            return;
        }
        if (Core.isCompletedBefore(8374)) {
            return;
        }

        Story.preLoad(this.necroCarnival);

        //Dolls' Hide and Seek 8363
        if (!Story.questProgression(8363)) {
            Core.ensureAccept(8363);
            Core.getMapItem(9249, 9, "necrocarnival");
            Core.huntMonster("necrocarnival", "Gummy Tapeworm", "Cartilage Gathered", 9);
            Core.ensureComplete(8363);
        }

        //Arts and Crafts 8364
        if (!Story.questProgression(8364)) {
            Core.ensureAccept(8364);
            Core.getMapItem(9250, 1, "necrocarnival");
            Core.huntMonster("necrocarnival", "Skeleclown", "Clowns Disciplined", 10);
            Core.ensureComplete(8364);
        }

        //Lemonade, Chewy Ice 8365
        if (!Story.questProgression(8365)) {
            Core.ensureAccept(8365);
            Core.getMapItem(9251, 2, "necrocarnival");
            Core.huntMonster("necrocarnival", "Mooch Treeant", "Red Sap Collected", 9);
            Core.huntMonster("necrocarnival", "Gummy Tapeworm", "Tape Worms Fried", 9);
            Core.ensureComplete(8365);
        }

        //Screams and Tag 8366
        if (!Story.questProgression(8366)) {
            Core.ensureAccept(8366);
            Core.getMapItem(9252, 1, "necrocarnival");
            Core.huntMonster("necrocarnival", "Skeleclown", "Clown Fired", 10);
            Core.ensureComplete(8366);
        }

        //Playful Teething 8367
        if (!Story.questProgression(8367)) {
            Core.ensureAccept(8367);
            Core.getMapItem(9253, 4, "necrocarnival");
            Core.huntMonster("necrocarnival", "Mooch Treeant", "Pet Food", 9);
            Core.ensureComplete(8367);
        }

        //Days Pass 8368
        if (!Story.questProgression(8368)) {
            Core.ensureAccept(8368);
            Core.getMapItem(9254, 1, "necrocarnival");
            Core.huntMonster("necrocarnival", "Cotton Tick", "Cotton Tick Fluff Collected", 10);
            Core.ensureComplete(8368);
        }

        //Pinned Bugs 8369
        if (!Story.questProgression(8369)) {
            Core.ensureAccept(8369);
            Core.getMapItem(9255, 1, "necrocarnival");
            Core.huntMonster("necrocarnival", "Gummy Tapeworm", "Gum Sludge", 10);
            Core.ensureComplete(8369);
        }

        //Sweet Glue 8370
        Story.killQuest(8370, "necrocarnival", "Mooch Treeant");

        //Witch Soup 8371
        if (!Story.questProgression(8371)) {
            Core.ensureAccept(8371);
            Story.mapItemQuest(8371, "necrocarnival", 9256);
            Core.huntMonster("necrocarnival", "Mooch Treeant", "Sticky Bark", 10);
            Core.huntMonster("necrocarnival", "Gummy Tapeworm", "Gum Eye", 10);
            Core.huntMonster("necrocarnival", "Skeleclown", "Finger Tips", 10);
            Core.ensureComplete(8371);
        }

        //Written Promise 8372
        if (!Story.questProgression(8372)) {
            Core.ensureAccept(8372);
            Core.getMapItem(9257, 7, "necrocarnival");
            Core.huntMonster("necrocarnival", "Cotton Tick", "Red Tick Juice", 10);
            Core.ensureComplete(8372);
        }

        //All Fall Down 8373
        if (!Story.questProgression(8373)) {
            Core.ensureAccept(8373);
            Core.getMapItem(9258, 1, "necrocarnival");
            Core.huntMonster("necrocarnival", "Skeleclown", "Skeleclowns Reaped", 10);
            Core.ensureComplete(8373);
        }

        //Lullaby 8374
        Story.killQuest(8374, "necrocarnival", "Deva");
    }

    trickTown(): void {
        if (!Core.isSeasonalMapActive("tricktown")) {
            return;
        }
        if (Core.isCompletedBefore(8935)) {
            return;
        }

        Story.preLoad(this.trickTown);

        // Punchergeist 8926
        if (!Story.questProgression(8926)) {
            Core.ensureAccept(8926);
            Core.getMapItem(10813, 1, "tricktown");
            Core.huntMonster("tricktown", "Playful Ghost", "Specter Sweets", 8);
            Core.ensureComplete(8926);
        }

        // Party Town 8927
        if (!Story.questProgression(8927)) {
            Core.ensureAccept(8927);
            Core.getMapItem(10804, 3, "tricktown");
            Core.huntMonster("tricktown", "Decay Spirit", "Decay Jelly", 8);
            Core.ensureComplete(8927);
        }

        // Sweet Mucus 8928
        if (!Story.questProgression(8928)) {
            Core.ensureAccept(8928);
            Core.getMapItem(10805, 5, "tricktown");
            Core.huntMonster("tricktown", "Playful Ghost", "Ghosts Told Off", 8);
            Core.ensureComplete(8928);
        }

        // Door to Door 8929
        if (!Story.questProgression(8929)) {
            Core.ensureAccept(8929);
            while (!bot.shouldExit && !Core.checkInventory(73465, 300)) {
                Core.addDrop("Treats");
                Core.join("tricktown");
                Core.killMonster("trickortreat", "Enter", "Spawn", "Trick or Treater");
                bot.wait.forPickup("Treats");
            }
            Core.ensureComplete(8929);
        }

        // Crusted Compost 8930
        if (!Story.questProgression(8930)) {
            Core.ensureAccept(8930);
            Core.getMapItem(10806, 3, "tricktown");
            Core.huntMonster("tricktown", "Rotting Pumpkin", "Pumpkin Seeds", 10);
            Core.ensureComplete(8930);
        }

        // A Spot of Sludge 8931
        if (!Story.questProgression(8931)) {
            Core.ensureAccept(8931);
            Core.getMapItem(10807, 4, "tricktown");
            Core.huntMonster("tricktown", "Decay Spirit", "Decay Spirit Caught", 10);
            Core.ensureComplete(8931);
        }

        // Messy Unrest 8932
        if (!Story.questProgression(8932)) {
            Core.ensureAccept(8932);
            Core.huntMonster("tricktown", "Decay Spirit", "Decay Spirit Calmed", 6);
            Core.huntMonster("tricktown", "Playful Ghost", "Ghosts Silenced", 6);
            Core.ensureComplete(8932);
        }

        // Plain Monster 8933
        if (!Story.questProgression(8933)) {
            Core.ensureAccept(8933);
            Core.getMapItem(10808, 1, "tricktown");
            Core.huntMonster("tricktown", "Rotting Mound", "Rotting Mound Caught", 1);
            Core.ensureComplete(8933);
        }

        // Study Group 8934
        if (!Story.questProgression(8934)) {
            Core.ensureAccept(8934);
            Core.getMapItem(10809, 5, "tricktown");
            Core.huntMonster("tricktown", "Rotting Mound", "Skin Patches", 8);
            Core.ensureComplete(8934);
        }

        // The Fruits of Labor 8935
        Story.killQuest(8935, "tricktown", "Madam Ester");
    }

    cursedCastle(): void {
        if (!Core.isSeasonalMapActive("cursedcastle")) {
            return;
        }
        if (Core.isCompletedBefore(9454)) {
            return;
        }

        Core.equipClass(ClassType.Farm);

        // Ghoul Fungi 9445
        if (!Story.questProgression(9445)) {
            Core.ensureAccept(9445);
            Core.getMapItem(12272, 1, "cursedcastle");
            Core.huntMonster("cursedcastle", "Luminous Fungus", "Harvested Fungus", 8);
            Core.ensureComplete(9445);
        }

        // Grotesque Guardian 9446
        if (!Story.questProgression(9446)) {
            Core.ensureAccept(9446);
            Core.getMapItem(12273, 1, "cursedcastle");
            Core.huntMonster("cursedcastle", "Noble Gargoyle", "Living Rubble", 8);
            Core.ensureComplete(9446);
        }

        // Dragon Instinct 9447
        Story.mapItemQuest(9447, "cursedcastle", [12274, 12275]);

        // The Uninvited 9448
        if (!Story.questProgression(9448)) {
            Core.ensureAccept(9448);
            Core.getMapItem(12276, 1, "cursedcastle");
            Core.huntMonster("cursedcastle", "Noble Ghost", "Ghostly Velvet", 4);
            Core.ensureComplete(9448);
        }

        // Room Service 9449
        Story.mapItemQuest(9449, "cursedcastle", [12277, 12278, 12279]);

        // Newborn's Teething 9450
        if (!Story.questProgression(9450)) {
            Core.ensureAccept(9450);
            Core.getMapItem(12280, 1, "cursedcastle");
            Core.huntMonster("cursedcastle", "Bone Dragonling", "Dragonling Rib", 20);
            Core.ensureComplete(9450);
        }

        Core.equipClass(ClassType.Solo);

        // Sadistic Solicitations 9451
        if (!Story.questProgression(9451)) {
            Core.ensureAccept(9451);
            Core.getMapItem(12281, 1, "cursedcastle");
            Core.huntMonster("cursedcastle", "Noble Ghost", "Shredded Invitation", 3);
            Core.ensureComplete(9451);
        }

        // Stomping on Eggshells 9452
        if (!Story.questProgression(9452)) {
            Core.ensureAccept(9452);
            Core.getMapItem(12282, 1, "cursedcastle");
            Core.huntMonster("cursedcastle", "Dragonlord Coledale", "Dragonlord Defeated", 1);
            Core.ensureComplete(9452);
        }

        // Stone Clad Clan 9453
        if (!Story.questProgression(9453)) {
            Core.ensureAccept(9453);
            Core.getMapItem(12283, 1, "cursedcastle");
            Core.huntMonster("cursedcastle", "Noble Gargoyle", "Cursed Stones", 4);
            Core.ensureComplete(9453);
        }

        // Restless Waltz 9454
        Story.killQuest(9454, "cursedcastle", "Unborn Brood");
    }

    eldritchbattletown(): void {
        if (Core.isCompletedBefore(10453) || !Core.isSeasonalMapActive("eldritchbattletown")) {
            return;
        }

        Story.preLoad(this.eldritchbattletown);
        //#region Useable Monsters
        const UseableMonsters = [
            "Living Pumpkin", // UseableMonsters[0],
            "Dzeza Sapling", // UseableMonsters[1],
            "Nudibranch", // UseableMonsters[2],
            "Kathool Kultist", // UseableMonsters[3],
            "Dzeza Cultist", // UseableMonsters[4],
            "Harvest Acromegalia", // UseableMonsters[5]
        ];
        //#endregion Useable Monsters
        Core.equipClass(ClassType.Farm);

        // 10444 | Pumpkin Guts
        if (!Story.questProgression(10444)) {
            if (!Story.questProgression(10444)) {
                Core.ensureAccept(10444);
                Core.getMapItem(15040, 1, "eldritchbattletown");
                Core.huntMonster("eldritchbattletown", "Living Pumpkin", "Pumpkin Seeds", 12);
                Core.ensureComplete(10444);
            }
        }

        // 10445 | Growth Spurt
        if (!Story.questProgression(10445)) {
            if (!Story.questProgression(10445)) {
                Core.ensureAccept(10445);
                Core.getMapItem(15041, 1, "eldritchbattletown");
                Core.huntMonster("eldritchbattletown", "Dzeza Sapling", "Toothy Branch", 12);
                Core.ensureComplete(10445);
            }
        }

        // 10446 | Mini-Thurians
        if (!Story.questProgression(10446)) {
            if (!Story.questProgression(10446)) {
                Core.ensureAccept(10446);
                Core.getMapItem(15042, 1, "eldritchbattletown");
                Core.huntMonster("eldritchbattletown", "Nudibranch", "Nudibranch Glands", 3);
                Core.ensureComplete(10446);
            }
        }

        // 10447 | Paper Love Bombs
        if (!Story.questProgression(10447)) {
            Story.mapItemQuest(10447, "eldritchbattletown", 15047, 6);
        }

        // 10448 | Abomination vs Monstrosity
        if (!Story.questProgression(10448)) {
            Story.killQuest(10448, "eldritchbattletown", [UseableMonsters[2], UseableMonsters[1]]);
        }

        // 10449 | The Mom Friend
        if (!Story.questProgression(10449)) {
            if (!Story.questProgression(10449)) {
                Core.ensureAccept(10449);
                Core.getMapItem(15043, 1, "eldritchbattletown");
                Core.huntMonster("eldritchbattletown", "Kathool Kultist", "Kultist Parasites", 6);
                Core.ensureComplete(10449);
            }
        }

        Core.equipClass(ClassType.Solo);
        // 10450 | Excited Excrescence
        if (!Story.questProgression(10450)) {
            Story.killQuest(10450, "eldritchbattletown", UseableMonsters[4]);
        }

        // 10451 | Love It or Condemn It
        if (!Story.questProgression(10451)) {
            Story.mapItemQuest(10451, "eldritchbattletown", [15044, 15045, 15046]);
        }

        // 10452 | Recruitment Initiative
        if (!Story.questProgression(10452)) {
            Story.killQuest(10452, "eldritchbattletown", [UseableMonsters[3], UseableMonsters[4]]);
        }

        Core.equipClass(ClassType.Solo);

        // 10453 | Galeux D'Eyes
        if (!Story.questProgression(10453)) {
            Story.killQuest(10453, "eldritchbattletown", UseableMonsters[5]);
        }
    }

    eldritchWorld(): void {
        if (Core.isCompletedBefore(10467) || !Core.isSeasonalMapActive("eldritchworld")) {
            return;
        }

        this.eldritchbattletown();
        Story.preLoad(this.eldritchWorld);

        //#region Useable Monsters
        const UseableMonsters = [
            "Nudibranch", // UseableMonsters[0],
            "Infested Fisherman", // UseableMonsters[1],
            "Kathool Cultist", // UseableMonsters[2],
            "Dzeza Cultist", // UseableMonsters[3],
            "Dzeza Sapling", // UseableMonsters[4],
            "Infested Mummy", // UseableMonsters[5],
            "Mass of Hair", // UseableMonsters[6],
            "Mass of Teeth", // UseableMonsters[7],
            "Dzeza the Boundless", // UseableMonsters[8]
        ];
        //#endregion Useable Monsters
        // 10465 | World of the Eldritch
        if (!Story.questProgression(10465)) {
            const EnsureItemFromQuest = (
                sourceQuestId: number,
                monsterIndex: number,
                itemName: string,
                qty = 1,
            ): void => {
                if (Core.checkInventory(itemName, qty)) {
                    return;
                }

                Core.addDrop(itemName);
                Core.huntMonsterQuest(sourceQuestId, ["eldritchworld", UseableMonsters[monsterIndex], ClassType.Farm]);
            };
            Core.ensureAccept(10465);

            EnsureItemFromQuest(10458, 0, "Nudibranch Roe");
            EnsureItemFromQuest(10459, 1, "Barnacle Rash");
            EnsureItemFromQuest(10460, 2, "Shrimp Noodle Pack");
            EnsureItemFromQuest(10461, 3, "Dzeza Welcome Pack");
            EnsureItemFromQuest(10462, 4, "Dzeza Coconuts");
            EnsureItemFromQuest(10463, 5, "Desiccated Bulbs");
            EnsureItemFromQuest(10464, 7, "Bucket of Molars");
            EnsureItemFromQuest(10468, 6, "Head of Hair");

            Core.ensureComplete(10465);
        }

        // 10466 | Limitless Lengths
        if (!Story.questProgression(10466)) {
            Core.ensureAccept(10466);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("eldritchworld", "Mass of Teeth", "Brittle Enamel", 6);
            Core.huntMonster("eldritchworld", "Mass of Hair", "Moldy Strands", 6);
            Core.ensureComplete(10466);
        }

        // 10467 | Merely Existing
        if (!Story.questProgression(10467)) {
            Core.huntMonsterQuest(10467, ["eldritchworld", UseableMonsters[8], ClassType.Solo]);
        }
    }

    elodeaTemple(): void {
        if (Core.isCompletedBefore(10478) || !Core.isSeasonalMapActive("elodeatemple")) {
            return;
        }

        Story.preLoad(this.elodeaTemple);

        //#region Useable Monsters
        const UseableMonsters = [
            "Nudibranch", // UseableMonsters[0],
            "Kathool Cultist", // UseableMonsters[1],
            "Merdrathoolian", // UseableMonsters[2],
            "Riptide Adept", // UseableMonsters[3],
            "Sarasa Maiden", // UseableMonsters[4],
            "Necroadipocere", // UseableMonsters[5],
            "Child of the Depths", // UseableMonsters[6]
        ];
        //#endregion Useable Monsters
        // 10469 | Escargot Escorts
        if (!Story.questProgression(10469)) {
            Core.huntMonsterQuest(10469, ["elodeatemple", UseableMonsters[0], ClassType.Farm]);
        }

        // 10470 | Plus 2 Minus 2
        if (!Story.questProgression(10470)) {
            Core.ensureAccept(10470);
            Core.getMapItem(15090, 1, "elodeatemple");
            Core.huntMonster("elodeatemple", "Kathool Cultist", "Kultist's Invitation", 2);
            Core.ensureComplete(10470);
        }

        // 10471 | Bottomfeeder Fruits
        if (!Story.questProgression(10471)) {
            Core.ensureAccept(10471);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("elodeatemple", "Nudibranch", "Seaslug Entrails", 6);
            Core.huntMonster("elodeatemple", "Kathool Cultist", "Kultist Entrails", 4);
            Core.ensureComplete(10471);
        }

        // 10472 | Dirge of the Depths
        if (!Story.questProgression(10472)) {
            Core.huntMonsterQuest(10472, ["elodeatemple", UseableMonsters[2], ClassType.Farm]);
        }

        // 10473 | Borrowed Voices
        if (!Story.questProgression(10473)) {
            Core.ensureAccept(10473);
            Core.getMapItem(15091, 1, "elodeatemple");
            Core.huntMonster("elodeatemple", "Riptide Adept", "Riptide Song", 12);
            Core.ensureComplete(10473);
        }

        // 10474 | Sea Symphony
        if (!Story.questProgression(10474)) {
            Core.ensureAccept(10474);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("elodeatemple", "Riptide Adept", "Adept's Aria", 8);
            Core.huntMonster("elodeatemple", "Merdrathoolian", "Merdrathoolian's Oratio", 6);
            Core.ensureComplete(10474);
        }

        // 10475 | If You Hate the Robe, You'll Hate its Priest
        Story.mapItemQuest(10475, [
            [15092, 1, "elodeatemple"],
            [15093, 8, "elodeatemple"],
        ]);

        // 10476 | Comets on the Cliff
        if (!Story.questProgression(10476)) {
            Core.huntMonsterQuest(10476, ["elodeatemple", UseableMonsters[4], ClassType.Farm]);
        }

        // 10477 | Pipe Clog
        if (!Story.questProgression(10477)) {
            Core.huntMonsterQuest(10477, ["elodeatemple", UseableMonsters[5], ClassType.Farm]);
        }

        // 10478 | The Victor! The Survivor!
        if (!Story.questProgression(10478)) {
            Core.huntMonsterQuest(10478, ["elodeatemple", UseableMonsters[6], ClassType.Solo]);
        }
    }

    birgittaMogloween(): void {
        if (Core.isCompletedBefore(10905) || !Core.isSeasonalMapActive("birgittamogloween")) {
            return;
        }

        Story.preLoad(this.birgittaMogloween);

        const UseableMonsters = [
            "Alpha Grigor",
            "Champion Ensis",
            "Lycan Guest",
            "Nazarene Artist",
            "ShadowSlayer",
            "Vampiric Guest",
        ];

        // 10896 | Silver of the Crossroads
        Story.killQuest(10896, "birgittamogloween", UseableMonsters[4]);
        // Silver Bullets x36

        // 10897 | Lilies of the Valley
        Story.mapItemQuest(10897, "birgittamogloween", [16281, 16282]);

        // 10898 | Blue Blooms
        Story.killQuest(10898, "birgittamogloween", UseableMonsters[3]);
        // Teal Resin x15

        // 10899 | Wise Beyond Years
        Story.mapItemQuest(10899, "birgittamogloween", [16283, 16284]);
        Story.mapItemQuest(10899, "birgittamogloween", 16285, 5);

        // 10900 | Dog Breath
        Story.killQuest(10900, "birgittamogloween", UseableMonsters[2]);
        // Pickled Garlic x8

        // 10901 | Love Knows No Bounds
        Story.mapItemQuest(10901, "birgittamogloween", [16286, 16287]);

        // 10902 | Poison Perfume
        Story.killQuest(10902, "birgittamogloween", UseableMonsters[5]);
        // Wolfsbane Perfume x2

        // 10903 | Naiver Vogel
        Story.mapItemQuest(10903, "birgittamogloween", 16288);
        Story.killQuest(10903, "birgittamogloween", UseableMonsters[3]);
        // Blue Cork Grease x5

        // 10904 | Fighting Like Bats and Dogs
        Core.ensureAccept(10904);
        Core.huntMonster("birgittamogloween", UseableMonsters[2], "Darkovian Fur", 9);
        Core.huntMonster("birgittamogloween", UseableMonsters[5], "Darkovian Silk", 9);
        Core.ensureComplete(10904);

        // 10905 | The Opening Act
        Core.ensureAccept(10905);
        Core.huntMonster("birgittamogloween", UseableMonsters[1], "Champion Ensis Defeated", 1);
        Core.huntMonster("birgittamogloween", UseableMonsters[0], "Alpha Grigor Defeated", 1);
        Core.ensureComplete(10905);
    }

    shadowSlayerWar(): void {
        if (Core.isCompletedBefore(10916) || !Core.isSeasonalMapActive("shadowslayerwar")) {
            return;
        }

        Story.preLoad(this.shadowSlayerWar);

        const UseableMonsters = [
            "Awakened Hunter",
            "Darkovia Hunter",
            "Forest Cultist",
            "ShadowSlayer Z",
            "Sublime Hunter",
            "Vampiric Ancestor ",
            "Werepyre Ancestor ",
        ];

        // 10908 | Wulpurga Medal
        Story.killQuest(10908, "shadowslayerwar", UseableMonsters[5]);
        // Wulpurga Medal x5

        // 10909 | Mega Wulpurga Medal
        Story.killQuest(10909, "shadowslayerwar", UseableMonsters[5]);
        // Mega Walpurga Medal x3

        // 10910 | Ghillie Suit
        Story.killQuest(10910, "shadowslayerwar", UseableMonsters[1]);
        // Darkovian Hunter's Camo x6

        // 10911 | Silver Blood
        Story.killQuest(10911, "shadowslayerwar", UseableMonsters[4]);
        // Sublime Silver x6

        // 10912 | Primal Rage
        Story.killQuest(10912, "shadowslayerwar", UseableMonsters[5]);
        // Ancestral Vision x6

        // 10913 | Chimerical Presence
        Story.killQuest(10913, "shadowslayerwar", UseableMonsters[6]);
        // Werepyre's Moonstone x1

        // 10914 | Sunlit Invocation
        Story.killQuest(10914, "shadowslayerwar", UseableMonsters[2]);
        // Cultist's Sun Wheel x6

        // 10915 | The Most Dangerous Game
        Story.killQuest(10915, "shadowslayerwar", UseableMonsters[0]);
        // Greater Hunter's Hexagram x6

        // 10916 | Daughter of the Sun
        Story.killQuest(10916, "shadowslayerwar", UseableMonsters[3]);
        // ShadowSlayer Z Defeated x1
    }

    walpurgisnacht(): void {
        if (Core.isCompletedBefore(10930) || !Core.isSeasonalMapActive("walpurgisnacht")) {
            return;
        }

        Story.preLoad(this.walpurgisnacht);

        const UseableMonsters = [
            "Awakened Hunter",
            "Beastly Hunger",
            "Bloodlust",
            "Druid Revenant",
            "Forest Cultist",
            "Moon's Firstborn",
            "ShadowSlayer G ",
            "The Gentleman",
        ];

        // 10921 | Vervain and Vaughn
        Story.mapItemQuest(10921, "walpurgisnacht", 16340);
        Story.killQuest(10921, "walpurgisnacht", UseableMonsters[3]); // Druid's Moon Sigil x4

        // 10922 | Marigold and Angelica
        Story.mapItemQuest(10922, "walpurgisnacht", 16341);
        Story.killQuest(10922, "walpurgisnacht", UseableMonsters[4]); // Cultist's Angelica x6

        // 10923 | Nialla's Mourning Cypress
        if (!Story.questProgression(10923)) {
            Core.ensureAccept(10923);
            Core.getMapItem(16342, 1, "walpurgisnacht");
            Core.huntMonster("walpurgisnacht", UseableMonsters[4], "Cultist's Eye", 6);
            Core.huntMonster("walpurgisnacht", UseableMonsters[3], "Druid's Eye", 6);
            Core.ensureComplete(10923);
        }

        // 10924 | Song's Sheep Sorrel
        Story.mapItemQuest(10924, "walpurgisnacht", 16343);
        Story.killQuest(10924, "walpurgisnacht", UseableMonsters[0]); // Hunter's Septogram x12

        // 10925 | Auld Man's Bell
        Story.killQuest(10925, "walpurgisnacht", UseableMonsters[6]); // G's Crossroads Bullet x1

        // 10926 | Muscadier for Focus
        Story.mapItemQuest(10926, "walpurgisnacht", 16344, 8);

        // 10927 | Blood of the Moon
        Story.killQuest(10927, "walpurgisnacht", UseableMonsters[2]); // Moonchild's Blood x6

        // 10928 | Bones of the Forest
        Story.killQuest(10928, "walpurgisnacht", UseableMonsters[1]); // Moonchild's Marrow x6

        // 10929 | Empty Nest
        Story.killQuest(10929, "walpurgisnacht", UseableMonsters[5]); // Moonchild's Memory x1

        // 10930 | Gentleman of the Crossroads
        Story.killQuest(10930, "walpurgisnacht", UseableMonsters[7]); // Father Forest Defeated x1
    }
}
