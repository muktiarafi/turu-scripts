/*
name: Etherstorm Wastes Story
description: This will finish the Etherstorm Wastes Story.
tags: story, quest, etherstorm-wastes
*/
// Port of Scripts/Story/EtherstormWastes.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class EtherStormWastes {
    doAll(): void {
        this.dragonPlane();
        this.fireStorm();
        this.water();
        this.wind();
        this.fire();
        this.desoloth();
        this.fireStorm();
        this.airStorm();
        this.waterStorm();
        this.earthStorm();
        this.dragonhame();
        this.dragonHeart();
    }

    dragonPlane(): void {
        if (Core.isCompletedBefore(1395)) {
            return;
        }

        Story.preLoad(this.dragonPlane);

        //Explore The DragonPlane 1384
        Story.mapItemQuest(1384, "dragonplane", [682, 683, 684, 685, 686]);

        //Lots Of Fiber 1385
        if (!Story.questProgression(1385)) {
            Core.ensureAccept(1385);
            Core.huntMonster("dragonplane", "Fire Elemental", "Fire Fiber", 3);
            Core.huntMonster("dragonplane", "Earth Elemental", "Earth Fiber", 3);
            Core.huntMonster("dragonplane", "Water Elemental", "Water Fiber", 3);
            Core.huntMonster("dragonplane", "Wind Elemental", "Air Fiber", 3);
            Core.ensureComplete(1385);
        }

        //Carrying The Torches 1386
        Story.mapItemQuest(1386, "dragonplane", 687, 6);

        //Meet me in the Earth Realm 1387
        Story.mapItemQuest(1387, "dragonplane", 688);

        //Breaking Chains 1388
        if (!Story.questProgression(1388)) {
            Core.ensureAccept(1388);
            Core.huntMonster("dragonplane", "Earth Elemental", "Earth Elemental Destroyed", 5);
            Core.huntMonster("dragonplane", "Living Earth", "Living Earth Destroyed", 5);
            Core.ensureComplete(1388);
        }

        //Soil Sprites 1389
        Story.mapItemQuest(1389, "dragonplane", 689, 5);

        //Cripple The Earth Prime 1390
        Story.killQuest(1390, "dragonplane", "Living Earth");

        //Ward Of The Stone 1391
        Story.mapItemQuest(1391, "dragonplane", 696, 5);

        //Moganth's Dracoscintilla 1392
        Story.killQuest(1392, "dragonplane", "Moganth");

        //Meet me in the DragonPlane 1393
        Story.mapItemQuest(1393, "dragonplane", 688);

        if (Core.isMember) {
            //Getting Your Feet Wet 1394
            Story.mapItemQuest(1394, "dragonplane", 687, 6);

            //Meet me in the Water Realm 1395
            Story.mapItemQuest(1395, "water", 688);
        }
    }

    water(): void {
        if (!Core.isMember) {
            return;
        }

        this.dragonPlane();
        if (Core.isCompletedBefore(1403)) {
            return;
        }

        Story.preLoad(this.water);
        //Weaken The Bonds 1396
        Story.killQuest(1396, "water", ["Water Elemental", "Living Water"]);

        //Udaroth Is Ready 1397
        Story.mapItemQuest(1397, "water", 690, 6);

        //A Loophole 1398
        Story.killQuest(1398, "water", "Living Water");

        //Flipping The Script 1399
        Story.mapItemQuest(1399, "water", 691, 6);

        //Udaroth, The Water Prime 1400
        Story.killQuest(1400, "water", "Udaroth");

        //Meet me in the DragonPlane 1401
        Story.mapItemQuest(1401, "dragonplane", 688);

        //Up In The Air 1402
        Story.mapItemQuest(1402, "dragonplane", 687, 6);

        //Meet me in the Air Realm 1403
        Story.mapItemQuest(1403, "wind", 688);
    }

    wind(): void {
        if (!Core.isMember) {
            return;
        }

        this.water();
        if (Core.isCompletedBefore(1411)) {
            return;
        }

        Story.preLoad(this.wind);

        //A Weak Wind 1404
        Story.killQuest(1404, "wind", ["Wind Elemental", "Living Air"]);

        //An Ounce Of Prevention 1405
        Story.mapItemQuest(1405, "wind", 695, 5);

        //This Is A Breeze 1406
        Story.killQuest(1406, "wind", "Living Air");

        //Chime Time 1407
        Story.mapItemQuest(1407, "wind", 692, 6);

        //Cellot, The Air Prime 1408
        Story.killQuest(1408, "wind", "Cellot");

        //Meet me in the DragonPlane 1409
        Story.mapItemQuest(1409, "dragonplane", 688);

        //Hot Hot Heat 1410
        Story.mapItemQuest(1410, "dragonplane", 687, 6);

        //Meet me in the Fire Plane 1411
        Story.mapItemQuest(1411, "fire", 688);
    }

    fire(): void {
        if (!Core.isMember) {
            return;
        }

        this.wind();
        if (Core.isCompletedBefore(1417)) {
            return;
        }

        Story.preLoad(this.fire);

        //Putting Out Fires 1412
        Story.killQuest(1412, "fire", ["Fire Elemental", "Living Fire"]);

        //At A Loss 1413
        Story.mapItemQuest(1413, "fire", 693, 6);

        //Backburner 1414
        Story.killQuest(1414, "fire", "Living Fire");

        //Open Fire 1415
        Story.mapItemQuest(1415, "fire", 694, 8);

        //Zellare, The Fire Prime 1416
        Story.killQuest(1416, "fire", "Zellare");

        //Meet me in the DragonPlane 1417
        Story.mapItemQuest(1417, "dragonplane", 688);
    }

    desoloth(): void {
        if (!Core.isMember) {
            return;
        }

        this.fire();
        if (Core.isCompletedBefore(1418)) {
            return;
        }

        //    [[Desoloth Freed Character Page Badge]]
        //Open the DragonGate 1418
        if (!Story.questProgression(1418)) {
            Core.ensureAccept(1418);
            Core.huntMonster("desoloth", "Desoloth", "Desoloth Freed!");
            Core.ensureComplete(1418);
        }
    }

    fireStorm(): void {
        if (Core.isCompletedBefore(1547)) {
            return;
        }

        Story.preLoad(this.fireStorm);

        //Something Smells Rotten in EtherStorm 1532
        if (!Story.questProgression(1532)) {
            Core.ensureAccept(1532);
            Core.huntMonster("firestorm", "Sulfur Imp", "Sulfuric Core", 10);
            Core.huntMonster("firestorm", "Sulfur Imp", "Enchanted Lava Bucket", 1);
            Core.ensureComplete(1532);
        }

        //Play With Fire 1533
        Story.killQuest(1533, "firestorm", "Living Fire");

        //Set Me On Fire 1542
        Story.mapItemQuest(1542, "firestorm", 784, 13);

        //Walk Through Fire 1543
        Story.mapItemQuest(1543, "firestorm", 785);

        //Everything's On Fire 1545
        Story.mapItemQuest(1545, "firestorm", 786, 20);

        //Baby's On Fire 1546
        Story.killQuest(1546, "firestorm", "FireStorm Hatchling");

        //Fire In My Heart 1547
        Story.killQuest(1547, "firestorm", "Ssikari");
    }

    airStorm(): void {
        this.fireStorm();
        if (Core.isCompletedBefore(1577)) {
            return;
        }

        Story.preLoad(this.airStorm);

        //A Fresh Breath of Life 1571
        Story.killQuest(1571, "airstorm", "Living Air");

        //Where Air You? 1572
        Story.mapItemQuest(1572, "airstorm", 827);

        //Invading Your (Sacred) Space 1573
        Story.mapItemQuest(1573, "airstorm", 823, 10);

        //There's Magic Every-Air 1574
        if (!Story.questProgression(1574)) {
            Core.ensureAccept(1574);
            Core.huntMonster("airstorm", "KingCrystal", "Trapped Air Spirit", 1);
            Core.huntMonster("airstorm", "Air Crystal", "Airy Aether Released", 12);
            Core.ensureComplete(1574);
        }

        //Dragon's Fire Blossom to be Found 1575
        if (!Story.questProgression(1575)) {
            Core.ensureAccept(1575);
            Core.getMapItem(824, 12, "firestorm");
            Core.huntMonster("firestorm", "Sulfur Imp", "Caustic Pollen", 8);
            Core.ensureComplete(1575);
        }

        //The Space Between 1576
        Story.killQuest(1576, "airstorm", "Energy Tornado");

        //The Burning Question 1577
        Story.mapItemQuest(1577, "firestorm", 825);
    }

    waterStorm(): void {
        this.airStorm();
        if (Core.isCompletedBefore(1622)) {
            return;
        }

        Story.preLoad(this.waterStorm);

        //So, something washed up on the beach... 1616
        Story.mapItemQuest(1616, "waterstorm", 840);
        Story.mapItemQuest(1616, "waterstorm", 841);

        //Dilution Solution 1617
        Story.killQuest(1617, "waterstorm", "Marsh Lurker");

        //A Frogdrake's Love Story 1618
        Story.mapItemQuest(1618, "waterstorm", 842, 13);

        //A Little Bit of Bubbly Never Hurt 1619
        if (!Story.questProgression(1619)) {
            Core.ensureAccept(1619);
            Core.getMapItem(843, 10, "waterstorm");
            Core.huntMonster("waterstorm", "Living Water", "Aqua Vitae", 15);
            Core.huntMonster("waterstorm", "Living Water", "Water Bubble Burst", 10);
            Core.ensureComplete(1619);
        }

        //Flight of the Fishwings 1620
        if (!Story.questProgression(1620)) {
            Core.ensureAccept(1620);
            Core.huntMonster("waterstorm", "Fishwing", "Vial of Fishwing Venom", 1);
            Core.huntMonster("waterstorm", "Fishwing", "Fish Wings", 12);
            Core.ensureComplete(1620);
        }

        //Hunt for the Greater Good 1621
        if (!Story.questProgression(1621)) {
            Core.ensureAccept(1621);
            Core.getMapItem(844, 3, "waterstorm");
            Core.huntMonster("waterstorm", "Fishman Soldier", "Shining Fishman Trident", 1);
            Core.huntMonster("waterstorm", "Marsh Lurker", "Marsh Tribal Totem", 1);
            Core.huntMonster("waterstorm", "Frogdrake", "Powdered Drake's Horn", 1);
            Core.ensureComplete(1621);
        }

        //Kill the Deep Dweller 1622
        Story.killQuest(1622, "waterstorm", "Deep Dweller");
    }

    earthStorm(): void {
        this.waterStorm();
        if (Core.isCompletedBefore(1639)) {
            return;
        }

        Story.preLoad(this.earthStorm);

        //Call from Deep Within 1633
        if (!Story.questProgression(1633)) {
            Core.ensureAccept(1633);
            Core.huntMonster("earthstorm", "Wind Elemental", "Still Wind", 5);
            Core.huntMonster("earthstorm", "Water Elemental", "Toxic Water", 5);
            Core.huntMonster("earthstorm", "Earth Elemental", "Shaken Stones", 5);
            Core.huntMonster("earthstorm", "Fire Elemental", "Snuffed Flame", 5);
            Core.ensureComplete(1633);
        }

        //Chrysalis of Flames 1634
        if (!Story.questProgression(1634)) {
            Core.ensureAccept(1634);
            Core.getMapItem(860, 3, "earthstorm");
            Core.huntMonster("earthstorm", "Crystallized Living Fire", "Shattered Heat", 5);
            Core.huntMonster("earthstorm", "Sapphire Golem", "Aqua Libertas", 5);
            Core.ensureComplete(1634);
        }

        //Glittering Secrets of Old 1635
        if (!Story.questProgression(1635)) {
            Core.ensureAccept(1635);
            Core.getMapItem(862, 8, "earthstorm");
            Core.huntMonster("earthstorm", "Crystalized Jellyfish", "Water Shell Matrix Decoder", 6);
            Core.huntMonster("earthstorm", "Diamond Golem", "Diamond CrystalCutter", 6);
            Core.ensureComplete(1635);
        }

        //Aria of Great Significance
        if (!Story.questProgression(1636)) {
            Core.ensureAccept(1636);
            Core.getMapItem(861, 8, "earthstorm");
            Core.getMapItem(863, 1, "earthstorm");
            Core.huntMonster("earthstorm", "Shard Spinner", "G Tone", 2);
            Core.huntMonster("earthstorm", "Shard Spinner", "B Tone", 2);
            Core.huntMonster("earthstorm", "Shard Spinner", "D Tone", 2);
            Core.huntMonster("earthstorm", "Shard Spinner", "E Tone", 2);
            Core.huntMonster("earthstorm", "Emerald Golem", "Greenglass Bells", 8);
            Core.ensureComplete(1636);
        }

        //Rekindling a Pomegranate 1637
        Story.killQuest(1637, "earthstorm", "Ruby Golem");

        //Legendary Crystal Skulls 1638
        Story.killQuest(1638, "earthstorm", "Amethite");

        //Return of the Crystal Beauty 1639
        Story.killQuest(1639, "earthstorm", "Arradia");
    }

    dragonhame(): void {
        if (Core.isCompletedBefore(3522)) {
            return;
        }

        Story.preLoad(this.dragonhame);

        //Talk to Hs'Sakar in Firestorm 3497
        Story.mapItemQuest(3497, "firestorm", 2646);

        //Bring Amulet to Drakor 3498
        Story.killQuest(3498, "firestorm", "Sulfur Imp");

        //Kill Us Some Zombies 3499
        Story.killQuest(3499, "shadowfall", "Skeletal Knight");

        //Put 'Em Through the Wringer 3501
        Story.killQuest(3501, "fotia", "Femme Cult Worshiper");

        //The Core of the Problem 3502
        if (!Story.questProgression(3502)) {
            Core.ensureAccept(3502);
            Core.huntMonster("dragonplane", "Earth Elemental", "Core of Earth", 3);
            Core.huntMonster("dragonplane", "Fire Elemental", "Core of Fire", 3);
            Core.huntMonster("dragonplane", "Water Elemental", "Core of Water", 3);
            Core.huntMonster("dragonplane", "Wind Elemental", "Core of Wind", 3);
            Core.ensureComplete(3502);
        }

        //The Scroll of Salubris 3503
        Story.killQuest(3503, "Natatorium", "Merdraconian");

        //Must Be All Those Limbs 3504
        if (!Story.questProgression(3504)) {
            Core.ensureAccept(3504);
            Core.killMonster("wanders", "r5", "Left", "Lotus Spider", "Lotus Petal", 5);
            Core.killMonster("wanders", "r2", "Down", "Kalestri Worshiper", "Talisman of Renewal", 5);
            Core.ensureComplete(3504);
        }

        //What We Need Is More Mages 3505
        Story.mapItemQuest(3505, "dragonrune", [2649, 2650, 2651, 2652, 2653]);

        //Protect the Eggs 3506
        Story.mapItemQuest(3506, "dragonhame", 2647, 8);
        Story.mapItemQuest(3506, "dragonhame", 2648);

        //Very, Very Sad 3507
        Story.killQuest(3507, "dragonhame", "Infected Dragon");

        //Ward the Hospital 3509
        Story.killQuest(3509, "dragonhame", "Infected Dragon");

        //Recover samples in Lair 3511
        if (!Story.questProgression(3511)) {
            Core.ensureAccept(3511);
            Core.huntMonster("lair", "Dark Draconian", "Superior Dragon Blood", 3);
            Core.huntMonster("lair", "Venom Draconian", "Draconian Venom", 3);
            Core.huntMonster("lair", "Water Draconian", "Draconian Tears", 3);
            Core.huntMonster("lair", "Wyvern", "Wyvern Scales", 3);
            Core.ensureComplete(3511);
        }

        //Darkness to Calm Dragons 3512
        Story.killQuest(3512, "lair", "Dark Draconian");

        //Quest for the Red Dragon’s Scroll 3513
        Story.killQuest(3513, "lair", "Red Dragon");

        //Help Artix in Swordhavenundead 3514
        if (!Story.questProgression(3514)) {
            Core.ensureAccept(3514);
            Core.killMonster("swordhavenundead", "Enter", "Spawn", "*", "Undead Slain", 13);
            Core.ensureComplete(3514);
        }

        //Kill Dracolich in Temple 3515
        Story.killQuest(3515, "temple", "Dracolich");

        //Research in Gilead 3516
        if (!Story.questProgression(3516)) {
            Core.ensureAccept(3516);
            Core.huntMonster("dragonplane", "Wind Elemental", "Pure Air Essence", 3);
            Core.huntMonster("dragonplane", "Earth Elemental", "Pure Earth Essence", 3);
            Core.huntMonster("dragonplane", "Fire Elemental", "Pure Fire Essence", 3);
            Core.huntMonster("dragonplane", "Water Elemental", "Pure Water Essence", 3);
            Core.ensureComplete(3516);
        }

        //Fire and Ice in Battleundera 3517
        if (!Story.questProgression(3517)) {
            Core.ensureAccept(3517);
            Core.huntMonster("battleundera", "Skeletal Fire Mage", "Undead Fire Marrow", 6);
            Core.huntMonster("battleundera", "Skeletal Ice Mage", "Undead Ice Marrow", 6);
            Core.ensureComplete(3517);
        }

        //Unlife's a Lich 3518
        Story.killQuest(3518, "battleundera", "Lich");

        //Dragonhame Infirmary Invasion 3519
        Story.killQuest(3519, "dragonheart", "Zombie Dragon");

        //Elemental Dracolich Destruction 3520
        Story.killQuest(3520, "infirmary", "Proto-Earth Dracolich");

        //Dragonplane in Peril 3522
        Story.chainQuest(3522);
    }

    dragonHeart(): void {
        if (Core.isCompletedBefore(3535)) {
            return;
        }

        Story.preLoad(this.dragonHeart);

        //Ward the Heart 3523
        Story.mapItemQuest(3523, "dragonheart", 2660, 5);

        //Infection Rejection 3524
        Story.killQuest(3524, "dragonheart", "Infected Dragonling");

        //Purify the Plane 3525
        Story.mapItemQuest(3525, "dragonheart", 2661);

        //Zombie Dragon Destruction 3526
        Story.killQuest(3526, "dragonheart", "Zombie Dragon");

        //Water Realm Purification 3527
        if (!Story.questProgression(3527)) {
            Core.ensureAccept(3527);
            Core.getMapItem(2662, 1, "dragonheart");
            Core.huntMonster("dragonheart", "Proto-Water Dracolich", "Water Link Weakened", 5);
            Core.ensureComplete(3527);
        }

        //Water Cleanses Fire 3528
        Story.mapItemQuest(3528, "dragonheart", 2663, 7);

        //Fire Realm Purification 3529
        if (!Story.questProgression(3529)) {
            Core.ensureAccept(3529);
            Core.getMapItem(2664, 1, "dragonheart");
            Core.huntMonster("dragonheart", "Proto-Fire Dracolich", "Fire Link Weakened", 6);
            Core.ensureComplete(3529);
        }

        //Fire Cleanses Earth 3530
        Story.mapItemQuest(3530, "dragonheart", 2665, 7);

        //Earth Realm Purification 3531
        if (!Story.questProgression(3531)) {
            Core.ensureAccept(3531);
            Core.getMapItem(2666, 1, "dragonheart");
            Core.huntMonster("dragonheart", "Proto-Earth Dracolich", "Earth Link Weakened", 7);
            Core.ensureComplete(3531);
        }

        //Earth Cleanses Air 3532
        Story.mapItemQuest(3532, "dragonheart", 2667, 7);

        //Air Realm Purification 3533
        if (!Story.questProgression(3533)) {
            Core.ensureAccept(3533);
            Core.getMapItem(2668, 1, "dragonheart");
            Core.huntMonster("dragonheart", "Proto-Air Dracolich", "Air Link Weakened", 8);
            Core.ensureComplete(3533);
        }

        //Dracolich Disconnection 3534
        if (!Story.questProgression(3534)) {
            Core.ensureAccept(3534);
            Core.huntMonster("dragonheart", "Deluge Dracolich", "Water Link Severed", 1);
            Core.huntMonster("dragonheart", "Inferno Dracolich", "Fire Link Severed", 1);
            Core.huntMonster("dragonheart", "Granite Dracolich", "Earth Link Severed", 1);
            Core.huntMonster("dragonheart", "Tempest Dracolich", "Air Link Severed", 1);
            Core.ensureComplete(3534);
        }

        //Heart-searing Pain 3535
        Story.killQuest(3535, "dragonheart", "Avatar of Desolich");
    }
}

export default function main(): void {
    const script = new EtherStormWastes();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
