/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/DragonsOfYokai/CoreDOY.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class CoreDOY {
    doAll(): void {
        this.yokaiPirate();
        this.yokaiTreasure();
        this.hakuVillage();
        this.hakuWar();
        this.yokaiPortal();
        this.yokaiRealm();
        this.novaShrine();
    }

    yokaiPirate(): void {
        if (Core.isCompletedBefore(9387)) {
            return;
        }

        Story.preLoad(this.yokaiPirate);

        Core.equipClass(ClassType.Farm);

        // Wokou 9378
        Story.mapItemQuest(9378, "yokaipirate", [12133, 12134, 12135]);

        // Shanty Sha-N-Ti 9379
        Story.killQuest(9379, "yokaipirate", "Disguised Pirate");

        // Yokai's Ark 9380
        if (!Story.questProgression(9380)) {
            Core.ensureAccept(9380);
            Core.huntMonster("yokaipirate", "Serpent Warrior", "Serpent Badge", 7);
            Story.mapItemQuest(9380, "yokaipirate", [12136, 12137]);
        }

        // Fashion Fathoms 9381
        Story.killQuest(9381, "yokaipirate", "Disguised Pirate");

        // Hoo Wants a Cracker 9382
        Story.killQuest(9382, "yokaipirate", "Noble Owl");

        // Papers Please 9383
        Story.mapItemQuest(9383, "yokaipirate", 12138, 7);

        Core.equipClass(ClassType.Farm);
        // King and Coral Snakes 9384
        if (!Story.questProgression(9384)) {
            Core.ensureAccept(9384);
            Core.huntMonster("yokaipirate", "Disguised Pirate", "Pirate Interrogated", 6);
            Core.huntMonster("yokaipirate", "Serpent Warrior", "Warrior Interrogated", 6);
            Story.mapItemQuest(9384, "yokaipirate", 12139);
        }

        // Horizon's Green Flash 9385
        Story.killQuest(9385, "yokaipirate", "Noble Owl");

        // Highly Buoyant Metal Armor 9386
        if (!Story.questProgression(9386)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(9386);
            Core.huntMonsterMapID("yokaipirate", 1, "Knight Captured", 8);
            Core.ensureComplete(9386);
        }

        // Salty Roots 9387
        if (!Story.questProgression(9387)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(9387);
            Core.huntMonsterMapID("yokaipirate", 11, "Neverglades Lord Dueled");
            Core.ensureComplete(9387);
        }
    }

    yokaiTreasure(): void {
        if (Core.isCompletedBefore(9405)) {
            return;
        }

        this.yokaiPirate();

        Story.preLoad(this.yokaiTreasure);

        Core.equipClass(ClassType.Farm);

        // All Hands Report (9396)
        Story.mapItemQuest(9396, "yokaitreasure", [12162, 12163, 12164]);

        // Starving Ghosts (9397)
        Story.killQuest(9397, "yokaitreasure", "Needle Mouth");

        // Sudden Striker (9398)
        Story.killQuest(9398, "yokaitreasure", "Quicksilver");

        // Onmyoji Maiden (9399)
        Story.mapItemQuest(9399, "yokaitreasure", [12165, 12166]);

        // Proper Parley (9400)
        Story.killQuest(9400, "yokaitreasure", "Imperial Warrior");

        // Hunger Pains (9401)
        Story.killQuest(9401, "yokaitreasure", "Needle Mouth");

        // Terror-cotta Warriors (9402)
        Story.killQuest(9402, "yokaitreasure", "Imperial Warrior");

        // Indoor Fireworks (9403)
        Story.mapItemQuest(9403, "yokaitreasure", 12167, 4);

        // Sons of Biscuit Eaters (9404)
        if (!Story.questProgression(9404)) {
            Core.ensureAccept(9404);
            Core.huntMonster("yokaitreasure", "Needle Mouth", "Criminal Marker", 6);
            Core.huntMonster("yokaitreasure", "Imperial Warrior", "Imperial Scale", 6);
            Core.ensureComplete(9404);
        }

        // Pearl of my Heart (9405)
        Core.equipClass(ClassType.Solo);
        Story.killQuest(9405, "yokaitreasure", "Admiral Zheng");
        Core.equipClass(ClassType.Farm);
    }

    hakuVillage(): void {
        if (Core.isCompletedBefore(9599)) {
            return;
        }

        this.yokaiTreasure();

        Story.preLoad(this.hakuVillage);

        Core.equipClass(ClassType.Farm);

        // 99th Birthday (9590)
        Story.killQuest(9590, "hakuvillage", "Tsukumogami");

        // Red and Blue (9591)
        if (!Story.questProgression(9591)) {
            Core.ensureAccept(9591);
            Core.getMapItem(12706, 1, "hakuvillage");
            Core.huntMonster("hakuvillage", "Mountain Oni", "Clay Gourd", 10);
            Core.ensureComplete(9591);
        }

        // Cold Sunshower (9592)
        if (!Story.questProgression(9592)) {
            Core.ensureAccept(9592);
            Core.getMapItem(12707, 1, "hakuvillage");
            Core.huntMonster("hakuvillage", "Tsukumogami", "Spirit Lights", 10);
            Core.ensureComplete(9592);
        }

        // Inari Boom (9593)
        if (!Story.questProgression(9593)) {
            Core.ensureAccept(9593);
            Core.getMapItems(
                [
                    [12708, 1],
                    [12709, 1],
                ],
                "hakuvillage",
            );
            Core.huntMonster("hakuvillage", "Kitsune Spy", "Fried Tofu Skins", 12);
            Core.ensureComplete(9593);
        }

        // Cui Niao (9594)
        if (!Story.questProgression(9594)) {
            Core.ensureAccept(9594);
            Core.getMapItem(12710, 1, "hakuvillage");
            Core.huntMonster("hakuvillage", "Nagami", "Mermeat", 12);
            Core.ensureComplete(9594);
        }

        // Huli Jing (9595)
        Story.killQuest(9595, "hakuvillage", "Kitsune Spy");

        // Aka Oni Ao Oni (9596)
        Story.killQuest(9596, "hakuvillage", "Mountain Oni");

        // Stone Shangyuan Fest (9597)
        Story.killQuest(9597, "hakuvillage", "Tsukumogami");

        // Nagami Sashimi (9598)
        Story.killQuest(9598, "hakuvillage", "Nagami");

        // Divine Derision (9599)
        Core.equipClass(ClassType.Solo);
        Story.killQuest(9599, "hakuvillage", "Dai Tengu");
    }

    hakuWar(): void {
        if (Core.isCompletedBefore(9607)) {
            return;
        }

        this.hakuVillage();

        Story.preLoad(this.hakuWar);

        Core.equipClass(ClassType.Farm);

        // Haku Medal (9601)
        Story.killQuest(9601, "hakuwar", "Dark Zmey");

        // Tall Tails (9603)
        Story.killQuest(9603, "hakuwar", "Kitsune Spy");

        // Flightless (9604)
        Story.killQuest(9604, "hakuwar", "Dark Zmey");

        // NorthEast Ushitora (9605)
        Story.killQuest(9605, "hakuwar", "Mountain Oni");

        // Zmey Gorynich (9606)
        Story.killQuest(9606, "hakuwar", "Zmey Warrior");

        // Head Kukol'nyy (9607)
        if (!Core.isCompletedBefore(9607)) {
            Core.equipClass(ClassType.Solo);
            Story.killQuest(9607, "hakuwar", "Zakhvatchik");
        }
    }

    yokaiPortal(): void {
        if (Core.isCompletedBefore(9676)) {
            return;
        }

        this.hakuWar();

        Story.preLoad(this.yokaiPortal);

        Core.equipClass(ClassType.Farm);

        // Tense Reunion (9667)
        if (!Story.questProgression(9667)) {
            Core.ensureAccept(9667);
            Core.getMapItems(
                [
                    [12982, 1],
                    [12983, 1],
                    [12984, 1],
                ],
                "yokaiportal",
            );
            Core.ensureComplete(9667);
        }

        // Kimon (9668)
        Story.killQuest(9668, "yokaiportal", "Oni Spirits");

        // Shrine of Love (9669)
        Story.mapItemQuest(9669, "yokaiportal", [12985, 12986]);

        // Hoshi no Tama (9670)
        Story.killQuest(9670, "yokaiportal", "Kitsune Spirits");

        // Childish Nostalgia (9671)
        Story.mapItemQuest(9671, "yokaiportal", [12987, 12988]);

        // Simple Wishes (9672)
        if (!Story.questProgression(9672)) {
            Core.ensureAccept(9672);
            Core.getMapItems(
                [
                    [12989, 1],
                    [12995, 1],
                    [12990, 1],
                ],
                "yokaiportal",
            );
            Core.huntMonster("yokaiportal", "Snake Shikigami", "Quicksilver Venom", 21);
            Core.ensureComplete(9672);
        }

        // Left Behind (9673)
        Story.killQuest(9673, "yokaiportal", "Puppeted Dragonling");

        // Our Love (9674)
        Story.mapItemQuest(9674, "yokaiportal", [12991, 12992, 12993]);

        // Amano Iwato (9675)
        if (!Story.questProgression(9675)) {
            Core.ensureAccept(9675);
            Core.getMapItem(12994, 1, "yokaiportal");
            Core.huntMonster("yokaiportal", "Kitsune Spirits", "Fox Soul Pearl", 15);
            Core.huntMonster("yokaiportal", "Puppeted Dragonling", "Seeded Dragon Heart", 15);
            Core.ensureComplete(9675);
        }

        // Corrupted Protector (9676)
        if (!Core.isCompletedBefore(9676)) {
            Core.equipClass(ClassType.Solo);
            Story.killQuest(9676, "yokaiportal", "Kitsune Kukol'nyy");
        }
    }

    yokaiRealm(): void {
        if (Core.isCompletedBefore(9689)) {
            return;
        }

        this.yokaiPortal();

        Story.preLoad(this.yokaiRealm);

        Core.equipClass(ClassType.Farm);

        // Tail End (9680)
        if (!Story.questProgression(9680)) {
            Core.ensureAccept(9680);
            Core.getMapItems(
                [
                    [13036, 1],
                    [13037, 1],
                ],
                "yokairealm",
            );
            Core.huntMonster("yokairealm", "Snake Shikigami", "Tame Snake Shikigami", 18);
            Core.ensureComplete(9680);
        }

        // A Thousand Hills (9681)
        if (!Story.questProgression(9681)) {
            Core.ensureAccept(9681);
            Core.getMapItems(
                [
                    [13038, 1],
                    [13039, 1],
                ],
                "yokairealm",
            );
            Core.huntMonster("yokairealm", "Snake Shikigami", "Snake Quicksilver", 18);
            Core.ensureComplete(9681);
        }

        // Mount the Land and Skies (9682)
        if (!Story.questProgression(9682)) {
            Core.ensureAccept(9682);
            Core.getMapItems(
                [
                    [13040, 1],
                    [13041, 1],
                ],
                "yokairealm",
            );
            Core.huntMonster("yokairealm", "Puppeted Dragonling", "Eggshell Shard", 80);
            Core.ensureComplete(9682);
        }

        // Distant Shores (9683)
        if (!Story.questProgression(9683)) {
            Core.ensureAccept(9683);
            Core.getMapItems(
                [
                    [13042, 1],
                    [13043, 1],
                ],
                "yokairealm",
            );
            Core.huntMonster("yokairealm", "Dark Zmey", "Tarnished Gold", 21);
            Core.ensureComplete(9683);
        }

        // Taizi (9684)
        if (!Story.questProgression(9684)) {
            Core.ensureAccept(9684);
            Core.getMapItem(13044, 1, "yokairealm");
            Core.huntMonster("yokairealm", "Puppeted Dragonling", "Dragonling Bone", 15);
            Core.huntMonster("yokairealm", "Dark Zmey", "Zmey Bone", 15);
            Core.ensureComplete(9684);
        }

        // Begrudged Oni (9685)
        if (!Story.questProgression(9685)) {
            Core.ensureAccept(9685);
            Core.getMapItems(
                [
                    [13045, 1],
                    [13046, 1],
                ],
                "yokairealm",
            );
            Core.huntMonster("yokairealm", "Oni Spirits", "Dried Oni Blood", 1);
            Core.ensureComplete(9685);
        }

        // Lingering Discord (9686)
        if (!Story.questProgression(9686)) {
            Core.ensureAccept(9686);
            Core.getMapItem(13047, 1, "yokairealm");
            Core.huntMonster("yokairealm", "Kitsune Spirits", "Chaotic Kitsunebi", 21);
            Core.ensureComplete(9686);
        }

        // Yokai's Cycle (9687)
        if (!Story.questProgression(9687)) {
            Core.ensureAccept(9687);
            Core.huntMonster("yokairealm", "Oni Spirits", "Oni Pacified", 15);
            Core.huntMonster("yokairealm", "Kitsune Spirits", "Kitsune Pacified", 15);
            Core.ensureComplete(9687);
        }

        // Kojutsu (9688)
        if (!Story.questProgression(9688)) {
            Core.equipClass(ClassType.Solo);
            Story.killQuest(9688, "yokairealm", "Inugami");
        }

        // Ame no Murakumo (9689)
        if (!Story.questProgression(9689)) {
            Core.equipClass(ClassType.Solo);
            Story.killQuest(9689, "yokairealm", "Mikoto Kukol'nyy");
        }
    }

    novaShrine(): void {
        if (Core.isCompletedBefore(9802)) {
            return;
        }

        Story.preLoad(this.novaShrine);

        Core.equipClass(ClassType.Farm);

        // Byakko 9798
        Story.killQuest(9798, "lavarun", "Firestorm Tiger");

        // Suzaku 9799
        Story.killQuest(9799, "dreampalace", "Flaming Harpy");

        // Genbu 9800
        if (!Story.questProgression(9800)) {
            Core.ensureAccept(9800);
            Core.killMonster("yokaitreasure", "r3", "Left", "Quicksilver", "Silver Scales", 15);
            Core.killMonster("hakuvillage", "r4", "Left", "Nagami", "Nagami Scales", 15);
            Core.ensureComplete(9800);
        }

        // Seiryu 9801
        if (!Story.questProgression(9801)) {
            bot.quests.updateQuest(9607);
            if (!Story.questProgression(9801)) {
                Core.ensureAccept(9801);
                Core.huntMonster("hakuwar", "Zakhvatchik", "Zakhvatchik Fang", 1);
                Core.huntMonster("hakuwar", "Zmey Warrior", "Zmey Fang", 15);
                Core.ensureComplete(9801);
            }
        }
        // Hoshiyoru 9802
        Core.equipClass(ClassType.Solo);
        Story.killQuest(9802, "novashrine", "Nova Empyrean");
    }
}
