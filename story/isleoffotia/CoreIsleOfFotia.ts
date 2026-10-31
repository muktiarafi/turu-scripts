/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/IsleOfFotia/CoreIsleOfFotia.cs.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class CoreIsleOfFotia {
    completeALL(): void {
        this.fotia();
        this.underRealm();
        this.styx();
        this.judgement();
        this.dageFortress();
    }

    fotia(): void {
        if (Core.isCompletedBefore(2949)) {
            return;
        }

        Story.preLoad(this.fotia);

        //Feeding the Frozen Flame 2942
        Story.killQuest(2942, "fotia", "Fotia Elemental");

        //Fire for the Frozen Flame  2943
        Story.killQuest(2943, "Fotia", "Fotia Spirit");

        //Lore Cores 2944
        Story.killQuest(2944, "Fotia", "Fotia Spirit");

        //Volcanic Exploration 2945
        Story.killQuest(2945, "Fotia", "Femme Cult Worshiper");

        //Retrieve the Ancient Artifact: Fire Staff 2946
        Story.killQuest(2946, "BattleUnderA", "Skeletal Fire Mage");

        //Retrieve the Ancient Artifact: Ice Orb 2947
        Story.killQuest(2947, "BattleUnderA", "Skeletal Ice Mage");

        //This Guy’s on Her Side 2948
        if (!Story.questProgression(2948)) {
            Core.ensureAccept(2948);
            Core.killMonster("evilwarnul", "r2", "Down", "*", "Archfiend's Favor", 50, { isTemp: false });
            Core.ensureComplete(2948);
        }

        //Fotia's Only Hope 2949
        if (!Story.questProgression(2949)) {
            Core.ensureAccept(2949);
            Story.mapItemQuest(2949, "Fotia", 1838);
            Core.huntMonster("Fotia", "Amia the Cult Leader", "Amia Defeated");
            bot.wait.forCellChange("Cut2");

            if (bot.player.cell === "r2") {
                Core.jumpWait();
            }

            const quest = bot.quests.get(2949);
            if (quest != null && quest.status != null) {
                Core.ensureComplete(quest.id);
                bot.wait.forActionCooldown("tryQuestComplete");
            } else {
                if (quest != null) {
                    bot.wait.forActionCooldown("tryQuestComplete");
                    bot.wait.forQuestComplete(quest.id);
                } else {
                    Core.logger("Quest not found, stopping bot.", undefined, { stopBot: true });
                    return;
                }
            }
        }
    }

    underRealm(): void {
        if (Core.isCompletedBefore(3019)) {
            return;
        }

        this.fotia();

        Story.preLoad(this.underRealm);

        //Soul Searching 3010
        Story.killQuest(3010, "UnderRealm", "Underworld Soul");

        //Chamber of Grief 3011
        Story.killQuest(3011, "UnderRealm", "Grief");

        //Chamber of Anxiety 3012
        Story.killQuest(3012, "UnderRealm", "Anxiety");

        //Chamber of Disease 3013
        Story.killQuest(3013, "UnderRealm", "Disease");

        //Chamber of Old Age 3014
        Story.killQuest(3014, "UnderRealm", "Old Age");

        //Chamber of Fear 3015
        Story.killQuest(3015, "UnderRealm", "Fear");

        //Chamber of Hunger 3016
        Story.killQuest(3016, "UnderRealm", "Hunger");

        //Chamber of Death 3017
        Story.killQuest(3017, "UnderRealm", "Death");

        //Chamber of Agony 3018
        Story.killQuest(3018, "UnderRealm", "Agony");

        //Chamber of Sleep 3019
        Story.killQuest(3019, "UnderRealm", "Sleep");
    }

    styx(): void {
        if (Core.isCompletedBefore(3025)) {
            return;
        }

        this.underRealm();

        Story.preLoad(this.styx);

        //Sullen Souls Survival  3022
        Story.killQuest(3022, "Styx", "Sullen Soul");

        //Wrathful Souls Rage 3023
        Story.killQuest(3023, "Styx", "Wrathful Soul");

        //Hydra Hospitality 3024
        Story.killQuest(3024, "Styx", "Styx Hydra");

        //Dage’s Guard Dog 3025
        Story.killQuest(3025, "Styx", "Cerberus");
    }

    judgement(): void {
        if (Core.isCompletedBefore(3042)) {
            return;
        }

        this.styx();

        Story.preLoad(this.judgement);

        //IMPressive  3034
        Story.killQuest(3034, "Judgement", "Underworld Imp");

        //The Raven’s Loss 3035
        Story.killQuest(3035, "Judgement", "Raven");

        // The Power of Flowers 3036
        if (!Story.questProgression(3036)) {
            this.flowerPower("Delivered Asphodel Flower", 8, true);
        }

        //The Time for Judgment 3038
        Story.mapItemQuest(3038, "Judgement", 1914);

        //Judged on Performance 3039
        bot.lite.disableMonsterAnimation = true;
        Story.killQuest(3039, "Judgement", "Rhadamanthys");

        //Judged on Undead Legion Standards 3040
        Story.killQuest(3040, "Judgement", "Minos");

        //Judged on Allegiance to Dage 3041
        Story.killQuest(3041, "Judgement", "Aeacus");

        //Challenged Allegiance to Dage 3042
        Story.killQuest(3042, "Judgement", "Ultra Aeacus");
        bot.lite.disableMonsterAnimation = false;
    }

    dageFortress(map = false): void {
        if (map && Core.checkInventory("Palace Map")) {
            return;
        }

        if (Core.isCompletedBefore(4258) && !map) {
            return;
        }

        this.judgement();

        Story.preLoad(this.dageFortress);

        //Defend Against the Scorned 4249
        Story.killQuest(4249, "DageFortress", "Sullied Master");

        //The Key to Discovery 4250
        if (!Story.questProgression(4250)) {
            Core.ensureAccept(4250);
            Core.getMapItem(3406, 1, "DageFortress");
            Core.huntMonster("dagefortress", "Tainted Seneschal", "Skeleton Key", 1);
            Core.ensureComplete(4250);
        }

        //Locate the Compass Stone 4251
        if (!Story.questProgression(4251) || (map && !Core.checkInventory("Compass Stone"))) {
            this.compassStone();
        }

        //Create the Dark Fortress Map 4255
        if ((map && !Core.checkInventory("Palace Map")) || !Story.questProgression(4255)) {
            if (!map) {
                Core.ensureAccept(4255);
            }
            this.compassStone();
            this.palaceMap();
            if (map) {
                return;
            }
            Core.ensureComplete(4255);
        }

        //Quest for the Room of Rune-ation 4256
        Story.mapItemQuest(4256, "DageFortress", 3404);

        //Defeat the Underworld Guardian 4258
        Story.killQuest(4258, "DageFortress", "Grrrberus");
    }

    flowerPower(item: string | null = null, quant = 1, isTemp = false): void {
        Core.ensureAccept(3036);

        while (
            !bot.shouldExit &&
            (isTemp
                ? !bot.tempInv.contains("Delivered Asphodel Flower", quant)
                : !bot.inventory.contains("Delivered Asphodel Flower", quant))
        ) {
            if (bot.map.name !== "judgement") {
                Core.join("judgement");
                bot.wait.forActionCooldown("transfer");
            }

            if (bot.player.cell !== "r5") {
                Core.jump("r5", "Left");
                bot.wait.forCellChange("r5");
                bot.player.setSpawnPoint();
            }

            for (const mob of bot.monsters.currentAvailableMonsters.filter(
                (x) => x != null && x.name.endsWith("Mourner"),
            )) {
                bot.kill.monster(mob.mapId);
                bot.wait.forMonsterDeath();
                if (
                    isTemp
                        ? bot.tempInv.contains("Delivered Asphodel Flower", quant)
                        : bot.inventory.contains("Delivered Asphodel Flower", quant)
                ) {
                    break;
                }
            }
        }

        Core.ensureComplete(3036);
    }

    compassStone(): void {
        if (Core.checkInventory("Compass Stone")) {
            return;
        }

        Core.addDrop("Compass Stone");
        Core.ensureAccept(4251);
        Core.killMonster("DageFortress", "r2", "Bottom", "Scorned Knight", "Compass Stone Piece Found");
        Core.getMapItem(3405, 4, "DageFortress");
        Core.ensureComplete(4251);
    }

    palaceMap(): void {
        if (Core.checkInventory("Palace Map")) {
            return;
        }

        const MapPieces = ["Left Map Piece", "Right Map Piece", "Center Map Piece"];
        Core.addDrop(...MapPieces);

        if (!Core.checkInventory("Left Map Piece")) {
            //The First Map Piece 4252
            Core.ensureAccept(4252);
            Core.huntMonster("DageFortress", "Scorned Knight", "Map Fragment");
            Core.ensureComplete(4252);
            bot.wait.forPickup("Left Map Piece");
        }
        if (!Core.checkInventory("Right Map Piece")) {
            //The Second Map Piece 4253
            Core.ensureAccept(4253);
            Core.huntMonster("DageFortress", "Twisted Warrior", "Map Fragment", 3);
            Core.ensureComplete(4253);
            bot.wait.forPickup("Right Map Piece");
        }
        if (!Core.checkInventory("Center Map Piece")) {
            //The Final Map Piece 4254
            Core.ensureAccept(4254);
            Core.huntMonster("DageFortress", "Leeched Legend", "Map Fragment", 5);
            Core.ensureComplete(4254);
            bot.wait.forPickup("Center Map Piece");
        }
        Core.buyItem("DageFortress", 1144, "Palace Map");
    }
}
