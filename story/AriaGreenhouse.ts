/*
name: Aria's Greenhouse Story
description: This will finish the Aria's and Kylokos' Greenhouse quests.
tags: story, quest, aria, greenhouse, nature,water,fire,energy,ariagreenhouse,starfest,star festival,kylokos
*/
// Port of Scripts/Story/AriaGreenhouse.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();
const Farm = new CoreFarms();

export class AriaGreenhouse {
    doAll(): void {
        this.nature();
        this.water();
        this.fire();
        this.energy();
        this.kylokos();
        this.darkness();
    }

    nature(): void {
        if (Core.isCompletedBefore(10188)) {
            return;
        }

        Story.preLoad(this.nature);

        // 10179 | Drosanthemum
        Story.mapItemQuest(10179, "faerie", [14392, 14393]);

        // 10180 | String of Turtles
        if (!Story.questProgression(10180)) {
            Core.huntMonsterQuest(10180, ["pines", "Red Shell Turtle", ClassType.Farm]);
        }

        // 10181 | Aconite
        Core.addDrop(...Core.questRewards(10181));
        if (!Story.questProgression(10181)) {
            Core.ensureAccept(10181);
            Core.getMapItem(14394, 1, "cloister");
            Core.huntMonster("cloister", "Karasu", "Karasu Plucked", 5);
            Core.ensureComplete(10181);
        }

        // 10182 | Blood Red Carnations
        Story.mapItemQuest(10182, "darkoviaforest", 14395);

        // 10183 | Cottongrass
        if (!Story.questProgression(10183)) {
            Core.huntMonsterQuest(10183, ["northlands", "Snow Golem", ClassType.Farm]);
        }

        // 10184 | Hebeloma Aminophilum
        Farm.experience(60);
        if (!Story.questProgression(10184)) {
            Core.ensureAccept(10184);
            Core.getMapItems(
                [
                    [14396, 1],
                    [14397, 1],
                ],
                "deleuzetundra",
            );
            Core.huntMonster("deleuzetundra", "Empty Creature", "Empty Critter", 8);
            Core.ensureComplete(10184);
        }

        // 10185 | Annual Mercury
        if (!Story.questProgression(10185)) {
            Core.huntMonsterQuest(10185, ["yokaitreasure", "Quicksilver", ClassType.Farm]);
        }

        // 10186 | Gorshka Maika
        if (!Story.questProgression(10186)) {
            bot.quests.updateQuest(9607);
            Core.huntMonsterQuest(10186, ["hakuwar", "Zakhvatchik", ClassType.Solo]);
        }

        // 10187 | Alchemilla
        if (!Story.questProgression(10187)) {
            bot.quests.updateQuest(9689);
            Core.huntMonsterQuest(10187, ["yokairealm", "Mikoto Kukol'nyy", ClassType.Solo]);
        }

        // 10188 | Arianne Vivaldi
        Story.mapItemQuest(10188, "vivaldicavern", 14398);
    }

    water(): void {
        if (Core.isCompletedBefore(10203)) {
            return;
        }

        Story.preLoad(this.water);

        Core.addDrop(...Core.questRewards(10193, 10194, 10195, 10196, 10197));

        // 10189 | People and Scarecrows
        if (!Story.questProgression(10189)) {
            Core.huntMonsterQuest(10189, ["farm", "Scarecrow", ClassType.Farm]);
        }

        // 10190 | Dolphins and Sharks
        if (!Story.questProgression(10190)) {
            Core.huntMonsterQuest(10190, ["pirates", "Fishman Soldier", ClassType.Farm]);
        }

        // 10191 | Dragons and Lizards
        if (!Story.questProgression(10191)) {
            Core.huntMonsterQuest(10191, ["natatorium", "Merdraconian", ClassType.Farm]);
        }

        // 10192 | Water and Oil
        Farm.experience(60);
        if (!Story.questProgression(10192)) {
            Core.ensureAccept(10192);
            Core.getMapItem(14399, 1, "feverfew");
            Core.huntMonster("feverfew", "Coral Creeper", "Creeps Eliminated", 14);
            Core.ensureComplete(10192);
        }

        // 10193 | Black Silk and White Fleece
        if (!Story.questProgression(10193) || !Core.checkInventory("Hyonix's Treasure Chest")) {
            Core.huntMonsterQuest(10193, ["blackseakeep", "Blacksea Pirate Mage", ClassType.Farm]);
        }

        // 10194 | Sunlight and Moonbeams
        if (!Story.questProgression(10194) || !Core.checkInventory("Sunlit Sea")) {
            Core.huntMonsterQuest(10194, ["sunlightzone", "Blighted Water", ClassType.Farm]);
        }

        // 10195 | Midnight and Noon
        if (!Story.questProgression(10195) || !Core.checkInventory("Midnight Sea")) {
            Core.huntMonsterQuest(10195, ["midnightzone", "Venerated Wraith", ClassType.Farm]);
        }

        // 10196 | Lie and Truth
        if (!Story.questProgression(10196) || !Core.checkInventory("Abyssal Sea")) {
            Core.huntMonsterQuest(10196, ["abyssalzone", "Blighted Water", ClassType.Farm]);
        }

        // 10197 | Odette and Odile
        if (!Story.questProgression(10197)) {
            Core.logger("Boss can't be soloed, so we skip it. Use army to kill it.");
            return;
        }

        // 10198 | Hyonix's Treasure Chest
        Story.chainQuest(10198);

        // 10203 | Sinclair and Demien
        Story.mapItemQuest(10203, "sinclaircove", 14400);
    }

    fire(): void {
        if (Core.isCompletedBefore(10213)) {
            return;
        }

        Story.preLoad(this.fire);

        // 10204 | Grassroots Opinion
        if (!Story.questProgression(10204)) {
            Core.huntMonsterQuest(10204, ["greendragon", "Greenguard Dragon", ClassType.Solo]);
        }

        // 10205 | Flame War
        if (!Story.questProgression(10205)) {
            Core.huntMonsterQuest(10205, ["bludrut2", "Fire Elemental", ClassType.Farm]);
        }

        // 10206 | Ashes Reignited
        if (!Story.questProgression(10206)) {
            Core.huntMonsterQuest(10206, ["lair", "Water Draconian", ClassType.Farm]);
        }

        // 10207 | Feldspar Silica
        if (!Story.questProgression(10207)) {
            Core.ensureAccept(10207);
            Core.getMapItem(14402, 1, "mafic");
            Core.huntMonster("mafic", "Living Fire", "Living Fire", 6);
            Core.ensureComplete(10207);
        }

        // 10208 | Convective Conversation
        if (!Story.questProgression(10208)) {
            Core.huntMonsterQuest(10208, ["embersea", "Living Lava", ClassType.Farm]);
        }

        // 10209 | Spicy Chicken
        if (!Story.questProgression(10209)) {
            Core.huntMonsterQuest(10209, ["lavarun", "Phedra", ClassType.Solo]);
        }

        // 10210 | Akriloth's Inferno
        if (!Story.questProgression(10210)) {
            Core.huntMonsterQuest(10210, ["firewar", "Uriax", ClassType.Solo]);
        }

        // 10211 | Scattered Embers
        if (!Story.questProgression(10211)) {
            Core.ensureAccept(10211);
            Core.getMapItem(14403, 11, "fireplanewar");
            Core.huntMonster("fireplanewar", "Shadefire Onslaught", "Shadefire", 8);
            Core.ensureComplete(10211);
        }

        // 10212 | Tempered Restraint
        if (!Story.questProgression(10212)) {
            Core.huntMonsterQuest(10212, ["wartraining", "Fire Champion", ClassType.Solo]);
        }

        // 10213 | Extinct Volcano
        Story.mapItemQuest(10213, "kingeldfell", 14404);
    }

    energy(): void {
        if (Core.isCompletedBefore(10223)) {
            return;
        }

        Story.preLoad(this.energy);

        // 10214 | Dragonlord Dreams
        if (!Story.questProgression(10214)) {
            Core.huntMonsterQuest(10214, ["dwarfhold", "Chaos Drow", ClassType.Farm]);
        }

        // 10215 | Background Noise
        if (!Story.questProgression(10215)) {
            Core.huntMonsterQuest(10215, ["uppercity", "Drow Assassin", ClassType.Farm]);
        }

        // 10216 | Manticore Prince
        if (!Story.questProgression(10216)) {
            Core.huntMonsterQuest(10216, ["venomvaults", "Chaonslaught Warrior", ClassType.Farm]);
        }

        // 10217 | Solid Clouds
        if (!Story.questProgression(10217)) {
            Core.ensureAccept(10217);
            Core.getMapItem(14405, 8, "stormtemple");
            Core.huntMonster("stormtemple", "Chaonslaught Warrior", "Warrior's Pocket", 6);
            Core.ensureComplete(10217);
        }

        // 10218 | Electric Rivalry
        if (!Story.questProgression(10218)) {
            Core.huntMonsterQuest(10218, ["thunderfang", "Tonitru", ClassType.Solo]);
        }

        // 10219 | A Dragon's Dignity
        if (!Story.questProgression(10219)) {
            Core.huntMonsterQuest(10219, ["pride", "Valsarian", ClassType.Solo]);
        }

        // 10220 | A Show Horse
        if (!Story.questProgression(10220)) {
            Core.huntMonsterQuest(10220, ["balemorale", "Skye Warrior", ClassType.Farm]);
        }

        // 10221 | Elemental Executioners
        if (!Story.questProgression(10221)) {
            Core.huntMonsterQuest(10221, ["loughshine", "Energy Elemental", ClassType.Farm]);
        }

        // 10222 | Pride's Grave
        if (!Story.questProgression(10222)) {
            Core.huntMonsterQuest(10222, ["naoisegrave", "Volgritian", ClassType.Solo]);
        }

        // 10223 | King of the Tempest
        Story.mapItemQuest(10223, "terminagrove", 14406);
    }

    kylokos(): void {
        if (Core.isCompletedBefore(10318)) {
            return;
        }

        Story.preLoad(this.kylokos);

        // 10309 | Epsilon Tau
        if (!Story.questProgression(10309)) {
            Core.huntMonsterQuest(10309, ["starfield", "Nova Seed", ClassType.Farm]);
        }

        // 10310 | Fixed Earth
        if (!Story.questProgression(10310)) {
            Core.huntMonsterQuest(10310, ["hedgemaze", "Minotaur", ClassType.Farm]);
        }

        // 10311 | Fable Fall
        if (!Story.questProgression(10311)) {
            Core.huntMonsterQuest(10311, ["fableforest", "Fire Elemental", ClassType.Farm]);
        }

        // 10312 | Delta Andromedae
        if (!Story.questProgression(10312)) {
            Core.huntMonsterQuest(10312, ["ashray", "Kitefin Shark Bait", ClassType.Farm]);
        }

        // 10313 | Beta Arietis
        if (!Story.questProgression(10313)) {
            Core.huntMonsterQuest(10313, ["kolyaban", "Tentacled Darkblood", ClassType.Farm]);
        }

        // 10314 | 35 Arietis
        if (!Story.questProgression(10314)) {
            Core.huntMonsterQuest(10314, ["comet", "Vaderix", ClassType.Farm]);
        }

        // 10315 | Fractured Pleiades
        if (!Story.questProgression(10315)) {
            Core.huntMonsterQuest(10315, ["atlaspromenade", "Atlas Light Magus", ClassType.Solo]);
        }

        // 10316 | Lambda Ori
        if (!Story.questProgression(10316)) {
            Core.huntMonsterQuest(10316, ["victormatsuri", "Kitsune Himawari", ClassType.Solo]);
        }

        // 10317 | Delta Ori
        if (!Story.questProgression(10317)) {
            Core.huntMonsterQuest(10317, ["hakuwar", "Long Kukol'nyy", ClassType.Solo]);
        }

        // 10318 | Western Moon Mansions
        if (!Story.questProgression(10318)) {
            Core.huntMonsterQuest(10318, ["yokaiportal", "Kitsune Spirits", ClassType.Farm]);
        }
    }

    darkness(): void {
        if (Core.isCompletedBefore(10834)) {
            return;
        }

        Story.preLoad(this.darkness);

        // 10825 | I Don't Know Your Name
        if (!Story.questProgression(10825)) {
            Core.huntMonsterQuest(10825, ["well", "Gell Oh No", ClassType.Solo]);
        }

        // 10826 | I Still Don't Know You
        if (!Story.questProgression(10826)) {
            Story.mapItemQuest(10826, "mudluk", 16093, 8);
        }

        // 10827 | I Heard You're Looking For Me
        if (!Story.questProgression(10827)) {
            Story.mapItemQuest(10827, "abaddoncave", 16094, 7);
        }

        // 10828 | I'm Looking for You
        if (!Story.questProgression(10828)) {
            Core.huntMonsterQuest(10828, ["doomwood", "Weakened Ectomancer", ClassType.Solo]);
        }

        // 10829 | I'm Getting Closer
        if (!Story.questProgression(10829)) {
            Story.mapItemQuest(10829, "maul", 16096, 3);
        }

        // 10830 | I'm Getting Even Closer
        if (!Story.questProgression(10830)) {
            Core.huntMonsterQuest(10830, ["yokaitreasure", "Quicksilver", ClassType.Solo]);
        }

        // 10831 | I'm Right Behind You
        if (!Story.questProgression(10831)) {
            Story.mapItemQuest(10831, "ashray", 16098, 2);
        }

        // 10832 | I'm Breathing Down Your Neck
        if (!Story.questProgression(10832)) {
            Story.mapItemQuest(10832, "lavarun", 16099);
        }

        // 10833 | Now I Know Where You Live
        if (!Story.questProgression(10833)) {
            Story.mapItemQuest(10833, "terminagrove", 16100);
        }

        // 10834 | See You Later, Stalker
        if (!Story.questProgression(10834)) {
            Story.mapItemQuest(10834, "greifplayhouse", 16095);
        }
    }
}

export default function main(): void {
    const script = new AriaGreenhouse();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
