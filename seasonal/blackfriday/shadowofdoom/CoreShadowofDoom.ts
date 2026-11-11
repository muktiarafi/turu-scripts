/*
name: null
description: null
tags: null
*/
// Port of Scripts/Seasonal/BlackFriday/ShadowofDoom/CoreShadowofDoom.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";

const Story = new CoreStory();

export class CoreShadowofDoom {
    umLotusTomb!: string[];

    constructor() {
        this.umLotusTomb = [
            "Doomed Elf", // UMLotusTomb[0],
            "Umbral Armor", // UMLotusTomb[1],
            "Umbral Serpent", // UMLotusTomb[2],
            "Umbral Tomb Hound", // UMLotusTomb[3],
            "Apophis Chantress", // UMLotusTomb[4]
        ];
    }

    doAll(ReturnEarly = false): void {
        this.shadowBattleon();
        this.camlan(ReturnEarly);
        this.lotusTomb();
        this.shadowDuat();
        this.hiddenDuat();
    }

    shadowBattleon(): void {
        if (Core.isCompletedBefore(9427)) {
            return;
        }

        Story.preLoad(this.shadowBattleon);

        Core.equipClass(ClassType.Solo);

        // Mega Shadow Hunt Medal 9422
        Story.killQuest(9422, "shadowbattleon", "Doomed Beast");

        // Early Autopsy 9423
        Story.killQuest(9423, "shadowbattleon", "Doomed Beast");

        // Given Life and Purpose 9424
        Story.killQuest(9424, "shadowbattleon", "Possessed Armor");

        // Adult Hatchling 9425
        Story.killQuest(9425, "shadowbattleon", "Ouro Spawn");

        // Solidified Light 9426
        Story.killQuest(9426, "shadowbattleon", "Tainted Wraith");

        //Enigmatic Entity 9427
        Story.killQuest(9427, "shadowbattleon", "Mysterious Stranger");
    }

    camlan(ReturnEarly = false): void {
        this.shadowBattleon();

        if (Core.isCompletedBefore(9443)) {
            return;
        }

        Story.preLoad(this.camlan);

        Core.equipClass(ClassType.Solo);

        Core.logger("Cutscene will play, hunt will resume is a second.");
        // Cold Shells 9433
        Story.killQuest(9433, "camlan", "Possessed Armor");

        // Equivalent Exchange 9434
        if (!Story.questProgression(9434)) {
            Core.ensureAccept(9434);
            Core.getMapItems(
                [
                    [12249, 1],
                    [12250, 1],
                ],
                "camlan",
            );
            Core.huntMonster("camlan", "Ouro Spawn", "Serpent Tongue", 5);
            Core.ensureComplete(9434);
        }

        // Mouth of the Snake Den 9435
        if (!Story.questProgression(9435)) {
            Core.ensureAccept(9435);
            Core.getMapItem(12251, 1, "camlan");
            Core.huntMonster("camlan", "Ouro Spawn", "Veiny Scale", 3);
            Core.huntMonster("camlan", "Possessed Armor", "Black Steel", 3);
            Core.ensureComplete(9435);
        }

        // Buried Human Pillars 9436
        Story.killQuest(9436, "camlan", "Tainted Wraith");

        // Guileless Sneers 9437
        Story.mapItemQuest(9437, "camlan", [12252, 12253, 12254]);

        // Shadows of Aminion 9438
        Story.killQuest(9438, "camlan", "Doomed Elf");

        // Come to Light 9439
        if (!Story.questProgression(9439)) {
            Core.ensureAccept(9439);
            Core.getMapItems(
                [
                    [12255, 1],
                    [12256, 1],
                ],
                "camlan",
            );
            Core.huntMonster("camlan", "Ouro Spawn", "Spawn Eye", 2);
            Core.ensureComplete(9439);
        }

        // It's in the Blood 9440
        Story.killQuest(9440, "camlan", "Doomed Elf");

        // Parental Pressure 9441
        if (!Story.questProgression(9441)) {
            Core.ensureAccept(9441);
            Core.huntMonster("camlan", "Bellona", "Crushed Light Pendant");
            Core.huntMonster("camlan", "Sleih", "Cracked Light Crystal");
            Core.ensureComplete(9441);
        }

        // Get Lost in Me 9442
        Core.logger('Good luck with this "ultra"!');
        Story.killQuest(9442, "camlan", "Metamorphosis Maw");

        if (ReturnEarly) {
            return;
        }

        // Cocooned Gold 9443
        if (!Story.questProgression(9443)) {
            Core.ensureAccept(9443);

            let needBellona = !Core.checkInventory("Bellona's Edict of War");
            let needSleih = !Core.checkInventory("Sleih's Changeling Records");
            while (!bot.shouldExit && needBellona && needSleih) {
                if (bot.map.name !== "camlan") {
                    Core.join("camlan");
                }

                if (bot.player.cell !== "r9") {
                    Core.jump("r9", "Let");
                }

                const bellona =
                    bot.monsters.currentAvailableMonsters?.find(
                        (m) => (m?.hp > 0 && m?.state > 0) === true && m.mapId === 22,
                    ) ?? null;
                const sleih =
                    bot.monsters.currentAvailableMonsters?.find(
                        (m) => (m?.hp > 0 && m?.state > 0) === true && m.mapId === 23,
                    ) ?? null;

                needBellona = !bot.tempInv.contains("Bellona's Edict of War");
                needSleih = !bot.tempInv.contains("Sleih's Changeling Records");

                // Priority: missing drop
                if (needBellona && bellona != null) {
                    bot.combat.attack(22);
                } else if (needSleih && sleih != null) {
                    bot.combat.attack(23);
                } else if (bellona != null) {
                    bot.combat.attack(22);
                } else if (sleih != null) {
                    bot.combat.attack(23);
                }

                bot.sleep(200);
            }
            Core.huntMonster("camlan", "Metamorphosis Maw", "Alchemic Snake Scale");
            Core.ensureComplete(9443);
        }
    }

    lotusTomb(): void {
        if (Core.isCompletedBefore(9920)) {
            return;
        }

        this.camlan(true);

        Story.preLoad(this.lotusTomb);

        // 9912 | A Herd of Black Sheep
        if (!Story.questProgression(9912)) {
            Core.huntMonsterQuest(9912, ["lotustomb", this.umLotusTomb[0], ClassType.Solo]);
        }

        // 9913 | Apep's Minders
        if (!Story.questProgression(9913)) {
            Core.ensureAccept(9913);
            Core.getMapItem(13731, 1, "lotustomb");
            Core.huntMonster("lotustomb", "Umbral Armor", "Umbral Helmet", 6);
            Core.ensureComplete(9913);
        }

        // 9914 | Primeval Discord
        if (!Story.questProgression(9914)) {
            Core.huntMonsterQuest(
                9914,
                ["lotustomb", this.umLotusTomb[1], ClassType.Solo],
                ["lotustomb", this.umLotusTomb[0], ClassType.Solo],
            );
        }

        // 9915 | Hissing Hatchlings
        if (!Story.questProgression(9915)) {
            Core.huntMonsterQuest(9915, ["lotustomb", this.umLotusTomb[2], ClassType.Farm]);
        }

        // 9916 | How the Mighty Have Fallen
        Story.mapItemQuest(9916, "lotustomb", [13732, 13733]);

        // 9917 | Dog Water
        if (!Story.questProgression(9917)) {
            Core.huntMonsterQuest(9917, ["lotustomb", this.umLotusTomb[3], ClassType.Farm]);
        }

        // 9918 | Poor Costume Choice
        Story.mapItemQuest(9918, [
            [13734, 1, "lotustomb"],
            [13735, 6, "lotustomb"],
        ]);

        // 9919 | Chaotic Little Joys
        if (!Story.questProgression(9919)) {
            Core.huntMonsterQuest(
                9919,
                ["lotustomb", this.umLotusTomb[2], ClassType.Farm],
                ["lotustomb", this.umLotusTomb[3], ClassType.Farm],
            );
        }

        // 9920 | Rite of Apophis
        if (!Story.questProgression(9920)) {
            Core.huntMonsterQuest(9920, ["lotustomb", this.umLotusTomb[4], ClassType.Solo]);
        }
    }

    shadowDuat(): void {
        if (Core.isCompletedBefore(9943)) {
            return;
        }

        this.lotusTomb();

        Story.preLoad(this.shadowDuat);

        //#region Useable Monsters
        const UseableMonsters = [
            "Umbral Serpent", // UseableMonsters[0],
            "Umbral Tomb Hound", // UseableMonsters[1],
            "Umbral Sphinx", // UseableMonsters[2],
            "Royal Umbral Guard", // UseableMonsters[3],
            "Apophis Chantress", // UseableMonsters[4],
            "DoomKnight Dryden", // UseableMonsters[5]
        ];
        //#endregion Useable Monsters
        // 9938 | Shadow Duat Medal
        if (!Story.questProgression(9938)) {
            Core.huntMonsterQuest(9938, ["shadowduat", UseableMonsters[0], ClassType.Solo]);
        }

        // 9940 | Funerary Shesepankh
        if (!Story.questProgression(9940)) {
            Core.huntMonsterQuest(9940, ["shadowduat", UseableMonsters[2], ClassType.Solo]);
        }

        // 9941 | Old Guarde
        if (!Story.questProgression(9941)) {
            Core.huntMonsterQuest(9941, ["shadowduat", UseableMonsters[3], ClassType.Solo]);
        }

        // 9942 | Enemy of the Sun
        if (!Story.questProgression(9942)) {
            Core.huntMonsterQuest(9942, ["shadowduat", UseableMonsters[4], ClassType.Solo]);
        }

        // 9943 | Doomed Heir
        if (!Story.questProgression(9943)) {
            Core.huntMonsterQuest(9943, ["shadowduat", UseableMonsters[5], ClassType.Solo]);
        }
    }

    hiddenDuat(): void {
        if (Core.isCompletedBefore(9964)) {
            return;
        }

        this.shadowDuat();

        Story.preLoad(this.hiddenDuat);

        //#region Useable Monsters
        const UseableMonsters = [
            "Umbral Sphinx", // UseableMonsters[0],
            "Depths of Isfet", // UseableMonsters[1],
            "Umbral Royal Guard", // UseableMonsters[2],
            "Royal Mummy", // UseableMonsters[3],
            "Anubian Overseer", // UseableMonsters[4],
            "Pharaoh Neith", // UseableMonsters[5],
            "Umbral Chaos", // UseableMonsters[6]
        ];
        //#endregion Useable Monsters
        // 9955 | Eclipsed Memory
        if (!Story.questProgression(9955)) {
            if (!Story.questProgression(9955)) {
                Core.ensureAccept(9955);
                Core.getMapItem(13812, 1, "hiddenduat");
                Core.huntMonster("hiddenduat", "Umbral Sphinx", "Sphinx's Tail", 9);
                Core.ensureComplete(9955);
            }
        }

        // 9956 | Sons in Spirit
        if (!Story.questProgression(9956)) {
            Core.huntMonsterQuest(9956, ["hiddenduat", UseableMonsters[2], ClassType.Solo]);
        }

        // 9957 | Cleopatra's Asp
        if (!Story.questProgression(9957)) {
            Story.mapItemQuest(9957, "hiddenduat", [13813, 13814]);
        }

        // 9958 | Canopic Guardians
        if (!Story.questProgression(9958)) {
            Core.ensureAccept(9958);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("hiddenduat", "Umbral Sphinx", "Umbral Sphinx Resin", 3);
            Core.huntMonster("hiddenduat", "Umbral Royal Guard", "Guard's Stomach", 3);
            Core.ensureComplete(9958);
        }

        // 9959 | Lum'ah
        if (!Story.questProgression(9959)) {
            if (!Story.questProgression(9959)) {
                Core.ensureAccept(9959);
                Core.getMapItem(13815, 1, "hiddenduat");
                Core.huntMonster("hiddenduat", "Royal Mummy", "Royal Bandages", 18);
                Core.ensureComplete(9959);
            }
        }

        // 9960 | Asyut's Hounds
        if (!Story.questProgression(9960)) {
            Core.huntMonsterQuest(9960, ["hiddenduat", UseableMonsters[4], ClassType.Solo]);
        }

        // 9961 | Chaotic Magnetism
        if (!Story.questProgression(9961)) {
            Story.mapItemQuest(9961, "hiddenduat", [13816, 13817]);
        }

        // 9962 | Warrior's Death
        if (!Story.questProgression(9962)) {
            if (!Story.questProgression(9962)) {
                Core.ensureAccept(9962);
                Core.getMapItem(13818, 1, "hiddenduat");
                Core.huntMonster("hiddenduat", "Anubian Overseer", "Anubian Crest", 3);
                Core.huntMonster("hiddenduat", "Royal Mummy", "Mummy's Canopic Jar", 12);
                Core.ensureComplete(9962);
            }
        }

        // 9963 | Uraeus
        if (!Story.questProgression(9963)) {
            Core.huntMonsterQuest(9963, ["hiddenduat", UseableMonsters[5], ClassType.Solo]);
        }

        // 9964 | Dragon of Duat
        if (!Story.questProgression(9964)) {
            Core.huntMonsterQuest(9964, ["hiddenduat", UseableMonsters[6], ClassType.Solo]);
        }
    }
}
