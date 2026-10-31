/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/Doomwood/CoreDoomwood.cs.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class CoreDoomwood {
    completeDoomwood(): void {
        this.doomwoodPart1();
        this.doomwoodPart2();
        this.doomwoodPart3();
        this.aqwZombies();
    }

    doomwoodPart1(): void {
        this.doomwoodForest();
        this.choppingMaul();
        this.necroTower();
        this.necroU();
        this.templeOfTheLight();
        this.madScientistsLab();
    }

    doomwoodPart2(): void {
        this.necropolisDungeon();
        this.necropolisCavern();
    }
    doomwoodPart3(): void {
        this.thornsgarde();
        this.stonewood();
        this.techDungeon();
        this.stonewoodForest();
        this.techFortress();
    }

    //#region Part 1
    doomwoodForest(): void {
        if (Core.isCompletedBefore(1089)) {
            return;
        }

        Story.preLoad(this.doomwoodForest);

        //1080    Lightguard Keep Found
        Story.chainQuest(1080);

        //1064    Bony Battalion
        if (!Story.questProgression(1064)) {
            Core.ensureAccept(1064);
            Core.huntMonster("doomwood", "Doomwood Ectomancer", "Ball of Ectoplasm", 3);
            Core.huntMonster("doomwood", "Doomwood Bonemuncher", "Bonespike Collar", 4);
            Core.killMonster("doomwood", "r8", "Right", "Doomwood Soldier", "Distal Fingerbone", 4);
            Core.ensureComplete(1064);
        }

        //1065    Warrior Rez-queue
        Story.mapItemQuest(1065, "doomwood", 423, 5);

        //1066    Bone-tired Backup
        if (!Story.questProgression(1066)) {
            Core.ensureAccept(1066);
            Core.killMonster("doomwood", "r6", "Right", "*", "Warrior Reinforced");
            Core.ensureComplete(1066);
        }

        //1067    Reconnaissance Route
        Story.mapItemQuest(1067, "doomwood", 422);

        //1068    Fight Against Shadowed Light
        Story.killQuest(1068, "doomwood", "Undead Paladin");

        //1069    Camouflage: Skelly-Style
        if (!Story.questProgression(1069)) {
            Core.ensureAccept(1069);
            Core.huntMonster("doomwood", "Doomwood Bonemuncher", "Muncher Mandibles", 3);
            Core.huntMonster("doomwood", "Doomwood Bonemuncher", "Stained Skulls", 3);
            Core.huntMonster("doomwood", "Doomwood Ectomancer", "Ecto-Coated Cloth Scraps", 3);
            Core.huntMonster("doomwood", "Doomwood Soldier", "Fractured Tibia", 3);
            Core.ensureComplete(1069);
        }

        //1070    De(ad)ception
        if (!Story.questProgression(1070)) {
            Core.ensureAccept(1070);
            Core.getMapItem(427, undefined, "doomundead");
            Core.killMonster("doomundead", "r3", "Right", "*", "Light Knight Lifeforce", 5);
            Core.ensureComplete(1070);
        }

        //1089    Artix Stopped!
        Story.chainQuest(1089);
    }

    choppingMaul(): void {
        if (Core.isCompletedBefore(1085)) {
            return;
        }

        this.doomwoodForest();

        Story.preLoad(this.choppingMaul);

        //1081    Zorbak's Hideout
        Story.mapItemQuest(1081, "maul", 435);

        //1082    Stink-tuary
        Story.mapItemQuest(1082, "maul", 434, 13);

        //1083    The Infected
        if (!Story.questProgression(1083)) {
            Core.ensureAccept(1083);
            Core.huntMonster("maul", "Personal Chopper", "Chopper Quarantined", 2);
            Core.huntMonster("maul", "Slimeskull", "Slimeskull Quarantined", 6);
            Core.ensureComplete(1083);
        }

        //1084    Chopping Spree
        if (!Story.questProgression(1084)) {
            Core.ensureAccept(1084);
            Core.killMonster("maul", "r2", "Left", "*", "Body Part Donation", 10);
            Core.getMapItem(436, 2, "maul");
            Core.ensureComplete(1084);
        }

        //1085    GraveStop the Creature
        Story.killQuest(1085, "maul", "Creature Creation");
    }

    necroTower(): void {
        if (Core.isCompletedBefore(1101)) {
            return;
        }

        this.choppingMaul();

        Story.preLoad(this.necroTower);

        //1087    ID What You Did There
        if (!Story.questProgression(1087)) {
            Core.ensureAccept(1087);
            Core.killMonster("necrotower", "r2", "Left", "Doomwood Treeant", "Pain-per", 5);
            Core.killMonster("necrotower", "r2", "Left", "Slimeskull", "Toxic Goo", 5);
            Core.ensureComplete(1087);
        }

        //1088    The Ego and the ID
        if (!Story.questProgression(1088)) {
            Core.ensureAccept(1088);
            Core.huntMonster("doomwood", "Doomwood Soldier", "Tombstone-Tuff (tm) Case", 1);
            Core.huntMonster("doomwood", "Doomwood Soldier", "Nekron CruelPix Camera", 1);
            Core.ensureComplete(1088);
        }

        //1090    An IDeal Seal
        if (!Story.questProgression(1090)) {
            Core.ensureAccept(1090);
            Core.huntMonsterMapID("necrotower", 4, "Seal Components");
            Core.ensureComplete(1090);
        }

        //1091    Need for Speed (Reading)!
        Story.mapItemQuest(1091, "necrotower", 438);

        //Necro Tower Elevator Minigame
        for (let i = 1092; i <= 1101; i++) {
            Story.chainQuest(i);
        }
    }

    necroU(): void {
        if (Core.isCompletedBefore(1154)) {
            return;
        }

        this.necroTower();

        Story.preLoad(this.necroU);

        //1112    Silence is Ghoulden
        Story.killQuest(1112, "necroU", "Ghoul");

        //1113    Ghouls with Gall
        Story.mapItemQuest(1113, "necroU", 450, 5);

        //1114    Goals for Ghouls and Other Undead
        if (!Story.questProgression(1114)) {
            Core.ensureAccept(1114);
            Core.huntMonster("necroU", "Ghoul", "Undead Wishes");
            Core.huntMonster("necroU", "Doomwood Soldier", "Undead Dreams");
            Core.huntMonster("necroU", "Doomwood Soldier", "Undead Ambitions");
            Core.ensureComplete(1114);
        }

        //1115    Knee Bone's Connected to the Thigh Bone
        Story.mapItemQuest(1115, "necroU", 449, 6);

        //1116    Hip Bone's Connected to the Back Bone
        if (!Story.questProgression(1116)) {
            Core.ensureAccept(1116);
            Core.huntMonster("necrou", "Doomwood Soldier", "Back Bone", 3);
            Core.huntMonster("necrou", "Doomwood Soldier", "Hip Bone", 3);
            Core.ensureComplete(1116);
        }

        //1117    Back Bone's Connected to the Neck Bone
        if (!Story.questProgression(1117)) {
            Core.ensureAccept(1117);
            Core.getMapItem(451, 3, "necroU");
            Core.huntMonster("necrou", "Doomwood Treeant", "Splint-wood", 7);
            Core.ensureComplete(1117);
        }

        //1118   Slip 'n Slimes
        if (!Story.questProgression(1118)) {
            Core.ensureAccept(1118);
            Core.getMapItem(452, 5, "necroU");
            Core.huntMonster("necrou", "Slimeskull", "Sheet of Slime", 5);
            Core.ensureComplete(1118);
        }

        //1119   Sl-eye-me
        Story.mapItemQuest(1119, "necroU", 453, 5);

        //1120   Bones Over Brawn
        Story.killQuest(1120, "necroU", "Doomwood Soldier");

        //1121   Skullaton Shells
        if (!Story.questProgression(1121)) {
            Core.ensureAccept(1121);
            Core.getMapItem(454, 3, "necroU");
            Core.getMapItem(455, 3, "necroU");
            Core.huntMonster("necrou", "Shelleton", "Shelleton Bale Culled", 3);
            Core.ensureComplete(1121);
        }

        //1154   Noxious Noxus
        Story.chainQuest(1154);

        //1170   Vordred Boss!
        Story.killQuest(1170, "vordredboss", "Ultra Vordred");
    }

    templeOfTheLight(): void {
        if (Core.isCompletedBefore(1148)) {
            return;
        }

        Story.preLoad(this.templeOfTheLight);

        Core.equipClass(ClassType.Farm);
        //1123    Level 1
        if (!Story.questProgression(1123)) {
            Core.ensureAccept(1123);
            Core.killMonster("temple", "r2", "Up", "SlimeSkull", "Slimeskull Trophy", 3);
            Core.killMonster("temple", "r2", "Up", "Doomwood Bonemuncher", "Munched Boneshard", 3);
            Core.killMonster("temple", "r2", "Up", "Shelleton", "Shelleton Shrapnel", 3);
            Core.ensureComplete(1123);
        }

        //1124    Level 2
        if (!Story.questProgression(1124)) {
            Core.ensureAccept(1124);
            Core.getMapItem(456, 6, "temple");
            Core.killMonster("temple", "r3", "Up", "Undead Mage", "Necrotic Rune", 3);
            Core.killMonster("temple", "r3", "Up", "Doomwood Ectomancer", "Ecto-Covered Rune", 3);
            Core.ensureComplete(1124);
        }

        //1125    Level 3
        if (!Story.questProgression(1125)) {
            Core.ensureAccept(1125);
            Core.killMonster("temple", "r4", "Up", "Ghoul", "Ghoulish Gear");
            Core.killMonster("temple", "r4", "Up", "Lich", "Haunted Habiliment");
            Core.ensureComplete(1125);
        }

        //1126    Level 4
        if (!Story.questProgression(1126)) {
            Core.ensureAccept(1126);
            Core.getMapItem(457, 8, "temple");
            Core.killMonster("temple", "r5", "Up", "Skeletal Fire Mage", "Flame Extinguished", 6);
            Core.ensureComplete(1126);
        }

        //1127    Level 5
        Story.killQuest(1127, "temple", "Doomwood Ectomancer");

        //1128    Level 6
        if (!Story.questProgression(1128)) {
            Core.ensureAccept(1128);
            Core.killMonster("temple", "r2", "Up", "Doomwood Bonemuncher", "Masticated Mandible", 2);
            Core.killMonster("temple", "r7", "Up", "Sanguine Souleater", "Freed Soul", 4);
            Core.ensureComplete(1128);
        }

        //1129    Level 7
        Story.mapItemQuest(1129, "temple", 458, 12);

        //1130    Level 8
        if (!Story.questProgression(1130)) {
            Core.ensureAccept(1130);
            Core.huntMonster("temple", "Doomwood Ectomancer", "Ectoplasmic Orb", 1);
            Core.huntMonster("temple", "Skeletal Fire Mage", "Conflagration Orb", 1);
            Core.ensureComplete(1130);
        }

        //1131    Level 9
        if (!Story.questProgression(1131)) {
            Core.ensureAccept(1131);
            Core.getMapItem(459, 8, "temple");
            Core.huntMonster("temple", "Ghoul", "Ghouls Gone", 6);
            Core.ensureComplete(1131);
        }

        //1132    Level 10
        Story.killQuest(1132, "temple", "Doomwood Ectomancer");

        //1133    Level 11
        if (!Story.questProgression(1133)) {
            Core.ensureAccept(1133);
            Core.getMapItem(460, 10, "temple");
            Core.huntMonster("temple", "Sanguine Souleater", "Souls Soothed", 6);
            Core.ensureComplete(1133);
        }

        //1134    Level 12
        if (!Story.questProgression(1134)) {
            Core.ensureAccept(1134);
            Core.huntMonster("temple", "Slimeskull", "Slime-Soaked Skull", 1);
            Core.huntMonster("temple", "Doomwood Ectomancer", "Ecto-Covered Core", 1);
            Core.ensureComplete(1134);
        }

        //1135    Level 13
        Story.mapItemQuest(1135, "temple", 461, 12);

        //1137    Level 14
        Story.killQuest(1137, "temple", "Doomwood Soldier");

        //1138    Level 15
        Story.killQuest(1138, "temple", "Ghoul");

        //1139    Level 16
        Story.mapItemQuest(1139, "temple", 462, 10);

        //1140    Level 17
        if (!Story.questProgression(1140)) {
            Core.ensureAccept(1140);
            Core.huntMonster("temple", "Doomwood Bonemuncher", "Spiky Collar", 1);
            Core.huntMonster("temple", "Skeleton", "Vertebrae Trophy", 1);
            Core.ensureComplete(1140);
        }

        //1141    Level 18
        if (!Story.questProgression(1141)) {
            Core.ensureAccept(1141);
            Core.huntMonster("temple", "Undead Mage", "Tattered Necronomicon", 4);
            Core.huntMonster("temple", "Skeletal Fire Mage", "Scorched Necronomicon", 2);
            Core.ensureComplete(1141);
        }

        //1142    Level 19
        if (!Story.questProgression(1142)) {
            Core.ensureAccept(1142);
            Core.getMapItem(463, 6, "temple");
            Core.huntMonster("temple", "Shelleton", "Screaming Shell-skull", 2);
            Core.huntMonster("temple", "Skeleton", "Grinning Jawbone", 3);
            Core.ensureComplete(1142);
        }

        //1143    Level 20
        Story.killQuest(1143, "temple", "Lich");

        //1144    Defy the Dracolich
        Story.killQuest(1144, "temple", "Dracolich");

        //1145    Restore the Tome
        Story.mapItemQuest(1145, "temple", 464, 10);

        //1146    Recover the Pages
        Story.killQuest(1146, "temple", "Doomwood Bonemuncher");

        //1147    Reconstruct the Codex
        Core.equipClass(ClassType.Solo);
        Story.killQuest(1147, "temple", "Cryptkeeper Lich");

        //1148 Galvanize the Guardian
        if (!Story.questProgression(1148)) {
            Core.ensureAccept(1148);
            //wiki says these 2 arent temps... but they are :hmst:
            Core.killMonster("temple", "r2", "Up", "Shelleton", "Basilisk's Scale");
            Core.killMonster("temple", "r2", "Up", "Shelleton", "Scroll of Magic Inversion");
            Core.jumpWait();
            Core.jump("Enter", "Spawn");
            Core.buyItem("temple", 287, "Scroll of Cure Petrification");
            Core.ensureComplete(1148);
        }
    }

    madScientistsLab(): void {
        if (Core.isCompletedBefore(1169)) {
            return;
        }

        Story.preLoad(this.madScientistsLab);

        //1155    CastleMania: Disharmony and Despair
        Story.mapItemQuest(1155, "lab", 488);

        //1156    Stringing Your Enemies Along
        Story.killQuest(1156, "lab", "Ant Giant");

        //1157    Out of Tune(ing Knobs)
        if (!Story.questProgression(1157)) {
            Core.ensureAccept(1157);
            Core.getMapItem(489, 3, "lab");
            Core.huntMonster("lab", "Ant Giant", "Tuning Knob", 3);
            Core.ensureComplete(1157);
        }

        //1158    Code of Conduct-or
        Story.killQuest(1158, "lab", "Ant Giant");

        //1159    Sending Out an SOS to the World
        Story.killQuest(1159, "lab", "Ant Giant");

        //1160    This is FINAL ZAP!
        Story.mapItemQuest(1160, "lab", 490, 6);

        //1161   You Doing This Again?
        if (!Story.questProgression(1161)) {
            Core.ensureAccept(1161);
            Core.getMapItem(491, 7, "lab");
            Core.huntMonster("lab", "Giant Scorpion", "Spool of Blue Wire", 10);
            Core.ensureComplete(1161);
        }

        //1162    Die, All of You!
        Story.killQuest(1162, "lab", "Ant Giant");

        //1163    Ample Amps Required
        Story.mapItemQuest(1163, "lab", 492, 10);

        //1164    Upward Over the Mountain
        Story.mapItemQuest(1164, "mountain", 493);

        //1169    Charging Up!
        Story.mapItemQuest(1169, "mountain", 494);
    }

    //#endregion
    //#region Part 2
    necropolisDungeon(): void {
        if (Core.isCompletedBefore(2061)) {
            return;
        }

        Story.preLoad(this.necropolisDungeon);

        //2044    Descent into Darkness
        if (!Story.questProgression(2044)) {
            Core.ensureAccept(2044);
            Core.jumpWait();
            Core.killMonster("necrodungeon", "r6", "Down", "*", "1 Floor Descended", 10);
            Core.ensureComplete(2044);
        }

        //2045    Retrieve the Past, Room 1
        if (!Story.questProgression(2045)) {
            Core.ensureAccept(2045);
            Core.getMapItem(1001, 1, "necrodungeon");
            Core.huntMonster("necrodungeon", "Necropolis Soldier", "Necropolis Soldier Slain", 7);
            Core.ensureComplete(2045);
        }

        //2046    Retrieve the Past, Room 2
        Story.mapItemQuest(2046, "necrodungeon", 1015, 5);
        Story.mapItemQuest(2046, "necrodungeon", 1002);

        //2047    Retrieve the Past, Room 3
        if (!Story.questProgression(2047)) {
            Core.ensureAccept(2047);
            Core.getMapItem(1003, 1, "necrodungeon");
            Core.huntMonster("necrodungeon", "Slimeskull", "Slime Sentry Squished", 8);
            Core.ensureComplete(2047);
        }

        //2048    Retrieve the Past, Room 4
        if (!Story.questProgression(2048)) {
            Core.ensureAccept(2048);
            Core.getMapItem(1004, 1, "necrodungeon");
            Core.huntMonster("necrodungeon", "Necropolis Soldier", "Slimed Elevator Key", 1);
            Core.huntMonster("necrodungeon", "Ghoul", "Ghoul Guardian Slain", 4);
            Core.ensureComplete(2048);
        }

        //2049    Deeper into Darkness
        if (!Story.questProgression(2049)) {
            Core.ensureAccept(2049);
            Core.killMonster("necrodungeon", "r11", "Down", "*", "1 Floor Descended", 10);
            Core.jumpWait();
            Core.ensureComplete(2049);
        }

        //2050    Retrieve the Past, Room 5
        if (!Story.questProgression(2050)) {
            Core.ensureAccept(2050);
            Core.getMapItem(1005, 1, "necrodungeon");
            Core.getMapItem(1016, 3, "necrodungeon");
            Core.huntMonster("necrodungeon", "Slimeskull", "Suspicious Slime Bribed", 3);
            Core.huntMonster("necrodungeon", "Necropolis Soldier", "Suspicious Soldier Bribed", 4);
            Core.ensureComplete(2050);
        }

        //2051    Retrieve the Past, Room 6
        Story.mapItemQuest(2051, "necrodungeon", 1017, 5);
        Story.mapItemQuest(2051, "necrodungeon", 1006);

        //2052    Retrieve the Past, Room 7
        if (!Story.questProgression(2052)) {
            Core.ensureAccept(2052);
            Core.getMapItem(1007, 1, "necrodungeon");
            Core.huntMonster("necrodungeon", "Slimeskull", "Vial of Slime Scent", 9);
            Core.ensureComplete(2052);
        }

        //2053    Monster Subway Ahead!
        if (!Story.questProgression(2053)) {
            Core.ensureAccept(2053);
            Core.getMapItem(1008, 1, "necrodungeon");
            Core.huntMonster("necrodungeon", "Doom Crawler", "Doomcrawler Destroyed", 1);
            Core.ensureComplete(2053);
        }

        //2054    Underground RailRoad... to DOOM!
        if (!Story.questProgression(2054)) {
            Core.ensureAccept(2054);
            Core.getMapItem(1009, 1, "necrodungeon");
            Core.getMapItem(1018, 8, "necrodungeon");
            Core.huntMonster("necrodungeon", "Ghoul", "Chunk of Crawler Food", 8);
            Core.ensureComplete(2054);
        }

        //2055    Retrieve the Past, Room 10
        if (!Story.questProgression(2055)) {
            Core.ensureAccept(2055);
            Core.getMapItem(1010, 1, "necrodungeon");
            Core.huntMonster("necrodungeon", "Necropolis Soldier", "Bony Elevator Key", 1);
            Core.ensureComplete(2055);
        }

        //2056    The Deepest Descent
        if (!Story.questProgression(2056)) {
            Core.ensureAccept(2056);
            Core.jumpWait();
            Core.killMonster("necrodungeon", "r18", "Down", "*", "1 Floor Descended", 10);
            Core.ensureComplete(2056);
        }

        //2057    Retrieve the Past, Room 11
        Story.mapItemQuest(2057, "necrodungeon", 1016, 5);
        Story.mapItemQuest(2057, "necrodungeon", 1011);

        //2058    Retrieve the Past, Room 12
        if (!Story.questProgression(2058)) {
            Core.ensureAccept(2058);
            Core.getMapItem(1012, 1, "necrodungeon");
            Core.huntMonster("necrodungeon", "Necropolis Soldier", "Soldier Swayed", 7);
            Core.ensureComplete(2058);
        }

        //2059    Retrieve the Past, Room 13
        Story.mapItemQuest(2059, "necrodungeon", 1019, 5);
        Story.mapItemQuest(2059, "necrodungeon", 1013);

        //2060    Fives Times the Fury
        if (!bot.quests.isUnlocked(2061)) {
            Core.ensureAccept(2060);
            Core.huntMonsterMapID("necrodungeon", 49, "Dracolich Head 1 Defeated!");
            Core.huntMonsterMapID("necrodungeon", 50, "Dracolich Head 2 Defeated!");
            Core.huntMonsterMapID("necrodungeon", 46, "Dracolich Head 3 Defeated!");
            Core.huntMonsterMapID("necrodungeon", 47, "Dracolich Head 4 Defeated!");
            Core.huntMonsterMapID("necrodungeon", 48, "Dracolich Head 5 Defeated!");
            Core.ensureComplete(2060);
        }

        //2061    The Past Will Haunt You
        Story.mapItemQuest(2061, "necrodungeon", 1020);
    }

    necropolisCavern(): void {
        if (Core.isCompletedBefore(2077)) {
            return;
        }

        this.necropolisDungeon();

        Story.preLoad(this.necropolisCavern);

        //2070    Thou Shalt Not Pass
        Story.killQuest(2070, "necrocavern", "Shadowstone Elemental");

        //2071    Blinded by the Darkness
        if (!Story.questProgression(2071)) {
            Core.ensureAccept(2071);
            Core.getMapItem(1042, 6, "necrocavern");
            Core.huntMonster("necrocavern", "Shadow Imp", "Shadow Imp Slain", 6);
            Core.ensureComplete(2071);
        }

        //2072    The Tale Never Dies
        if (!Story.questProgression(2072)) {
            Core.ensureAccept(2072);
            Core.getMapItem(1044, 1, "necrocavern");
            Core.getMapItem(1045, 3, "necrocavern");
            Core.huntMonster("necrocavern", "Shadow Imp", "Shadow Ink Obtained", 5);
            Core.huntMonster("necrocavern", "Shadowstone Elemental", "Inkstone Obtained", 1);
            Core.ensureComplete(2072);
        }

        //2073    Doom Outside the Dome
        Story.killQuest(2073, "necrocavern", "Shadowstone Elemental");

        //2074    Last Bastion of Light
        if (!Story.questProgression(2074)) {
            Core.ensureAccept(2074);
            Core.huntMonster("necrocavern", "Shadowstone Elemental", "Rock Intruder Shattered", 3);
            Core.huntMonster("necrocavern", "Shadow Imp", "Imp Invader Slain", 4);
            Core.ensureComplete(2074);
        }

        //2075    Shadowy Corruption
        Story.mapItemQuest(2075, "necrocavern", 1043, 5);

        //2076    Strength of the Darkness
        Story.killQuest(2076, "necrocavern", "Shadow Dragon");

        //2077    Bring Down the Necropolis
        Story.killQuest(2077, "necrocavern", "Shadowstone Support");
    }

    thornsgarde(): void {
        if (Core.isCompletedBefore(7653)) return;

        Story.preLoad(this.thornsgarde);

        //7589    Bullies
        if (!Story.questProgression(7589)) {
            Core.ensureAccept(7589);
            Core.huntMonster("thorngarde", "CryptHacker", "CryptHacker Slain", 4);
            Core.huntMonster("thorngarde", "NecroDrone", "NecroDrone Slain", 1);
            Core.huntMonster("thorngarde", "NecroMech", "NecroMech Slain", 1);
            Core.ensureComplete(7589);
        }

        //7590    Free the People
        if (!Story.questProgression(7590)) {
            Core.ensureAccept(7590);
            Core.getMapItem(7485, 5, "thorngarde");
            Core.huntMonster("thorngarde", "NecroMech", "Deadtech Key", 5);
            Core.ensureComplete(7590);
        }

        //7591    Sample It
        Story.killQuest(7591, "thorngarde", "NecroMech");

        //7592    Swat the Flies
        Story.killQuest(7592, "thorngarde", "CryptHacker");

        //7593    Reclaim the Supplies
        if (!Story.questProgression(7593)) {
            Core.ensureAccept(7593);
            Core.huntMonster("thorngarde", "CryptHacker", "Cured Meat", 3);
            Core.huntMonster("thorngarde", "NecroMech", "Bag of Grain", 3);
            Core.huntMonster("thorngarde", "NecroDrone", "Jug of Water", 5);
            Core.ensureComplete(7593);
        }

        //7594    Who's That?
        Story.mapItemQuest(7594, "thorngarde", 7486);

        //7595    Find my Stuff
        if (!Story.questProgression(7595)) {
            Core.ensureAccept(7595);
            Core.getMapItems(
                [
                    [7487, 1],
                    [7488, 1],
                ],
                "thorngarde",
            );
            Core.huntMonster("thorngarde", "NecroDrone", "Kyger's Bunny", 1);
            Core.ensureComplete(7595);
        }

        //7596    Save my Friends
        if (!Story.questProgression(7596)) {
            Core.ensureAccept(7596);
            Core.getMapItems(
                [
                    [7489, 1],
                    [7490, 1],
                    [7491, 1],
                ],
                "thorngarde",
            );
            Core.huntMonster("thorngarde", "NecroMech", "NecroMech Slain", 3);
            Core.ensureComplete(7596);
        }

        //7597    Pull the Wires
        Story.killQuest(7597, "thorngarde", "CryptHacker");

        //7598    Dress-up Time!
        if (!Story.questProgression(7598)) {
            Core.ensureAccept(7598);
            Core.huntMonster("thorngarde", "CryptHacker", "CryptHacker Headgear", 1);
            Core.huntMonster("thorngarde", "NecroDrone", "Deadtech Pieces", 5);
            Core.ensureComplete(7598);
        }

        //7599    I Need a Distraction
        if (!Story.questProgression(7599)) {
            Core.ensureAccept(7599);
            Core.huntMonster("thorngarde", "NecroMech", "NecroMech Slain", 5);
            Core.huntMonster("thorngarde", "CryptHacker", "CryptHacker Slain", 5);
            Core.huntMonster("thorngarde", "NecroDrone", "NecroDrone Slain", 5);
            Core.ensureComplete(7599);
        }

        //7600    Zyrus is Lost
        Story.killQuest(7600, "thorngarde", "Zyrus the BioKnight");

        //7601    Investigate the Tech
        if (!Story.questProgression(7601)) {
            Core.ensureAccept(7601);
            Core.huntMonster("thorngarde", "NecroDrone", "Deadtech Power Core", 7);
            Core.huntMonster("thorngarde", "NecroMech", "NecroMech Targeting Systems", 5);
            Core.huntMonster("thorngarde", "CryptHacker", "CryptHacker Circuitry", 15);
            Core.huntMonster("thorngarde", "Zyrus the BioKnight", "BioKnight Engine", 3);
            Core.ensureComplete(7601);
        }
    }

    stonewood(): void {
        if (Core.isCompletedBefore(7653)) return;

        this.thornsgarde();

        Story.preLoad(this.stonewood);

        //7603    Defeat the Deadtech
        Story.killQuest(7603, "stonewood", "NecroDrone");

        //7604    Gather Spell Components
        if (!Story.questProgression(7604)) {
            Core.ensureAccept(7604);
            Core.getMapItem(7510, 6, "stonewood");
            Core.huntMonster("stonewood", "Doomwood Treeant", "Treeant Pollen", 8);
            Core.ensureComplete(7604);
        }

        //7605    A Few Things More
        if (!Story.questProgression(7605)) {
            Core.ensureAccept(7605);
            Core.huntMonster("stonewood", "NecroDrone", "Fresh Marrow", 8);
            Core.huntMonster("stonewood", "NecroMech", "Pristine Wishbone", 1);
            Core.ensureComplete(7605);
        }

        //7606    Search for the Axe
        Story.mapItemQuest(7606, "stonewood", 7511, 4);
        Story.mapItemQuest(7606, "stonewood", 7512);

        //7607    Defeat the BioKnight
        Story.killQuest(7607, "stonewood", "BioKnight");

        //7608    Take the Axe!
        Story.mapItemQuest(7608, "stonewood", 7513);
    }

    techDungeon(): void {
        if (Core.isCompletedBefore(7636)) return;

        this.stonewood();

        Story.preLoad(this.techDungeon);

        //7609    Find the Keys
        Story.killQuest(7609, "techdungeon", "NecroMech");

        //7610    Ew, Rats
        if (!Story.questProgression(7610)) {
            Core.ensureAccept(7610);
            Core.getMapItem(7515, 6, "techdungeon");
            Core.huntMonster("techdungeon", "Rotting Rat", "Rat Slain", 10);
            Core.ensureComplete(7610);
        }

        //7611    Grab Their Gear
        if (!Story.questProgression(7611)) {
            Core.ensureAccept(7611);
            Core.killMonster("techdungeon", "r4", "Left", "DoomBorg Guard", "Guard Armor Piece", 5);
            Core.killMonster("techdungeon", "r4", "Left", "DoomBorg Guard", "Guard Helm");
            Core.killMonster("techdungeon", "r4", "Left", "DoomBorg Guard", "Deadtech Polearm");
            Core.ensureComplete(7611);
        }

        //7612    Talk to the Guard
        Story.mapItemQuest(7612, "techdungeon", 7514);

        //7613    Let Them Out!
        Story.mapItemQuest(7613, "techdungeon", 7516);

        //7614    Head on Out
        if (!Story.questProgression(7614)) {
            Core.ensureAccept(7614);
            Core.getMapItem(7517, 1, "techdungeon");
            Core.huntMonster("techdungeon", "DoomBorg Guard", "Deadtech Guard Slain", 12);
            Core.ensureComplete(7614);
        }

        //7615    Take Him Down
        Story.killQuest(7615, "techdungeon", "Kalron the Cryptborg");
    }

    stonewoodForest(): void {
        if (Core.isCompletedBefore(7636)) return;

        this.techDungeon();

        Story.preLoad(this.stonewoodForest);

        //7623    Cat Ears?
        if (!Story.questProgression(7623)) {
            Core.ensureAccept(7623);
            Core.getMapItem(7528, 1, "stonewooddeep");
            Core.ensureComplete(7623);
            Core.logger("Cutscene > Wait > Jump > Continue");
            bot.wait.forCellChange("Cut2");
            Core.sleep(2500);
            Core.jumpWait();
        }

        //7624    EN GARDE!
        if (!Story.questProgression(7624)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(7624);
            // Core.Join("stonewooddeep", "r2", "Left");
            Core.killMonster("stonewooddeep", "r2", "Right", "Asherion", "Defeat Asherion");
            Core.ensureComplete(7624);
        }

        //7625    The Light Of Destiny
        if (!Story.questProgression(7625)) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAccept(7625);
            Core.getMapItem(7529, 1, "stonewooddeep");
            Core.ensureComplete(7625);
            Core.logger("Cutscene > Wait > Jump > Continue");
            bot.wait.forCellChange("Cut2");
            Core.sleep(2500);
            Core.jumpWait();
        }

        //7626    Stuff for Dummies
        if (!Story.questProgression(7626)) {
            Core.ensureAccept(7626);
            Core.killMonster("stonewooddeep", "r2", "Right", "Doomwood Treeant", "Sturdy Wood", 8);
            Story.mapItemQuest(7626, "stonewooddeep", 7530, 8);
        }

        //7627    Build the Dummies
        if (!Story.questProgression(7627)) {
            Core.ensureAccept(7627);
            Core.killMonster("stonewooddeep", "r3", "Right", "Doomwood Treeant", "Area Cleared", 10);
            Core.getMapItem(7531, 6, "stonewooddeep");
            Core.ensureComplete(7627);
            Core.jump("r2");
            Core.sleep(2500);
            Core.jump("r3");
        }

        //7628    Battle the Dummies
        if (!Story.questProgression(7628)) {
            // Core.Logger("Updatin the map because dummys are dumb");
            // Core.Join("whitemap");
            Core.ensureAccept(7628);
            Core.killMonster("stonewooddeep", "r3", "Left", "Target Dummy", "Target Dummy Slain", 6);
            Core.ensureComplete(7628);
        }

        //7629    Lesson 1: Bravery
        if (!Story.questProgression(7629)) {
            Core.ensureAccept(7629);
            Core.killMonster("stonewooddeep", "r3", "Right", "Doomwood Slime", "Slime Slain", 10);
            Core.ensureComplete(7629);
        }

        //7630    Lesson 2: Armor
        if (!Story.questProgression(7630)) {
            Core.ensureAccept(7630);
            Core.killMonster("stonewooddeep", "r3", "Right", "Doomwood Slime", "Stolen Armor", 7);
            Core.ensureComplete(7630);
        }

        //7631    Lesson 3: Protection
        if (!Story.questProgression(7631)) {
            Core.ensureAccept(7631);
            Core.killMonster("stonewooddeep", "r7", "Left", "CryptHacker", "Crypthacker Slain", 10);
            Core.killMonster("stonewooddeep", "r7", "Left", "CryptHacker", "Unidentified Clue");
            Core.ensureComplete(7631);
        }

        //7632    Lesson 4: Gather Intelligence
        Story.killQuest(7632, "stonewooddeep", "CryptHacker");

        //7633    Lesson 5: Demolition
        if (!Story.questProgression(7633)) {
            Core.ensureAccept(7633);
            Core.killMonster("stonewooddeep", "r3", "Right", "Doomwood Slime", "Acid Ooze", 6);
            Core.killMonster("stonewooddeep", "r7", "Right", "NecroDrone", "Explosive Tech", 6);
            Core.ensureComplete(7633);
        }

        //7634    Lesson 6: Searching
        Story.mapItemQuest(7634, "stonewooddeep", 7532);

        //7635    Get the Axe
        if (!Story.questProgression(7635)) {
            Story.mapItemQuest(7635, "stonewooddeep", 7533);
            Core.logger("Cutscene > Wait > Jump > Continue");
            bot.wait.forCellChange("Cut2");
            Core.sleep(2500);
            Core.jumpWait();
        }

        //7636    Never Give Up
        Core.equipClass(ClassType.Solo);
        Story.killQuest(7636, "stonewooddeep", "Sir Kut");
    }

    techFortress(): void {
        if (Core.isCompletedBefore(7653)) return;

        this.stonewoodForest();

        Story.preLoad(this.techFortress);

        //7637    I CPU U!
        Story.killQuest(7637, "techfortress", "CryptHacker");

        //7638    Keep Droning On
        Story.killQuest(7638, "techfortress", "NecroDrone");

        //7639    Gathering Data
        Story.killQuest(7639, "techfortress", "CryptHacker");

        //7640    Signal Flare
        if (!Story.questProgression(7640)) {
            Core.ensureAccept(7640);
            Core.getMapItem(7561, 1, "techfortress");
            Core.huntMonster("techfortress", "NecroDrone", "Flare", 1);
            Core.ensureComplete(7640);
        }

        //7641    Medal Time
        if (!Story.questProgression(7641)) {
            Core.ensureAccept(7641);
            Core.huntMonster("techfortress", "NecroDrone", "NecroMedals", 5);
            Core.ensureComplete(7641);
        }

        //7642    Hidden Data
        Story.killQuest(7642, "techfortress", "NecroMech");

        //7643    Pass the CPU
        Story.killQuest(7643, "techfortress", "CPU");

        //7644    The Guards
        Story.killQuest(7644, "techfortress", "DoomBorg Guard");

        //7645    Circui-try This
        Story.killQuest(7645, "techfortress", "DoomBorg Guard");

        //7646    The Thing
        Story.killQuest(7646, "techfortress", "Vortrix");

        //7653    The Final Form
        Story.killQuest(7653, "techfortress", "MechaVortrix");
    }

    aqwZombies(): void {
        if (Core.isCompletedBefore(2128)) return;

        this.techFortress();

        Story.preLoad(this.aqwZombies);

        //2093    Undead Assault
        Story.killQuest(2093, "doomhaven", "Skeletal Soldier", { autoCompleteQuest: false });
        //insurance
        if (bot.quests.canComplete(2093)) Core.ensureComplete(2093);

        //2094    Skull Crusher Mountain
        Story.killQuest(2094, "doomhaven", "Skeletal Ice Mage");

        //2095    The Undead Giant
        Story.killQuest(2095, "doomhaven", "Angry Undead Giant");

        //2096    Talk to the Knights
        Story.mapItemQuest(2096, "doomhaven", 1174, 5);

        //2097    Defend the Throne Room
        Story.killQuest(2097, "doomhaven", "Skeletal Viking");

        for (const Quest of [
            2117, // Rolith Defeated
            2120, // Lair
            2121, // Mythsong
            2122, // Arcangrove
            2123, // Willowshire
            2119, // Battleon
        ]) {
            Story.chainQuest(Quest);
            bot.wait.forQuestComplete(Quest);
        }

        //2124    Keep the Area Clear
        Story.killQuest(2124, "doomwar", "Angry Zombie");

        //2125    Defeat Zombie Dragons
        Story.killQuest(2125, "doomwar", "Zombie Dragon");

        //2126    Defeat Your Fallen Friends
        if (!Story.questProgression(2126)) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAccept(2126);
            Core.killMonster("doomwar", "r5", "Left", "*", "Fallen Friend Defeated", 4);
            Core.ensureComplete(2126);
        }

        //2127    Long Unlive the King!
        Core.equipClass(ClassType.Solo);
        Story.killQuest(2127, "doomwar", "Zombie King Alteon");

        //2128    Dark Sepulchure Must be Slain!
        Story.killQuest(2128, "sepulchure", "Dark Sepulchure");
    }
}
