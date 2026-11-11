/*
name: WarMonger
description: Does the Quests from the Trainers in /Trainers
tags: trainers, quests, story, warmonger, warrior, mage, healer, rogue, warlord
*/
// Port of Scripts/Story/TrainersStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class WarMonger {
    trainers(): void {
        if (Core.isCompletedBefore(10177)) {
            return;
        }

        Story.preLoad(this.trainers);

        //#region Useable Monsters
        const UseableMonsters = [
            "Zardman Grunt", // UseableMonsters[0]
            "Zardman Hunter", // UseableMonsters[1]
            "Trobble", // UseableMonsters[2]
            "LeatherWing", // UseableMonsters[3]
            "Dwakel Blaster", // UseableMonsters[4]
            "Inquisitor Guard", // UseableMonsters[5]
            "Inquisitor Captain", // UseableMonsters[6]
            "Frogzard", // UseableMonsters[7]
            "Slime", // UseableMonsters[8]
            "Spider", // UseableMonsters[9]
            "Wolf", // UseableMonsters[10]
            "Chaorrupted Bear", // UseableMonsters[11]
            "Chaorrupted Wolf", // UseableMonsters[12]
            "Rock Elemental", // UseableMonsters[13]
            "River Fishman", // UseableMonsters[14]
            "Undead Berserker", // UseableMonsters[15]
            "Thrax Ironhide", // UseableMonsters[16]
            "Ogug Stoneaxe", // UseableMonsters[17]
            "Horc Warrior", // UseableMonsters[18]
            "Skeletal Warrior", // UseableMonsters[19]
            "Castle Wraith", // UseableMonsters[20]
            "Bone Terror", // UseableMonsters[21]
            "Eldritch Stalker", // UseableMonsters[22]
            "Terrarsite", // UseableMonsters[23]
            "Shadefire Onslaught", // UseableMonsters[24]
            "Ashray Fisherman", // UseableMonsters[25]
            "Kitefin Shark Bait", // UseableMonsters[26]
            "Lightguard Paladin", // UseableMonsters[27]
            "Noble's Knight", // UseableMonsters[28]
            "Garde Wraith", // UseableMonsters[29]
            "Undead Garde ", // UseableMonsters[30]
            "Warlord Harley", // UseableMonsters[31]
        ];
        //#endregion Useable Monsters
        //#region Mage
        // 10156 | Perfect Practice
        if (!Story.questProgression(10156)) {
            Core.ensureAccept(10156);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("forest", "Zardman Grunt", "Grunt's Tooth", 5);
            Core.huntMonster("forest", "Zardman Hunter", "Hunter's Tooth");
            Core.ensureComplete(10156);
        }

        // 10157 | Grateful Guru
        if (!Story.questProgression(10157)) {
            Core.ensureAccept(10157);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("guru", "Trobble", "Trobble Fluff", 4);
            Core.huntMonster("guru", "LeatherWing", "Leatherwing Feathers", 4);
            Core.ensureComplete(10157);
        }

        // 10158 | Magitech
        if (!Story.questProgression(10158)) {
            Core.huntMonsterQuest(10158, ["crashsite", UseableMonsters[4], ClassType.Solo]);
        }

        // 10159 | Trial by Fire
        if (!Story.questProgression(10159)) {
            Core.ensureAccept(10159);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("citadel", "Inquisitor Guard", "Guard's Helm", 5);
            Core.huntMonster("citadel", "Inquisitor Captain", "Captain's Hood");
            Core.ensureComplete(10159);
        }
        //#endregion Mage
        //#region Healer
        // 10160 | Pinch Your Nose
        if (!Story.questProgression(10160)) {
            Core.ensureAccept(10160);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("greenguardwest", "Frogzard", "Frogzard Glands", 5);
            Core.huntMonster("greenguardwest", "Slime", "Slime Goo", 5);
            Core.ensureComplete(10160);
        }

        // 10161 | Small Doses
        if (!Story.questProgression(10161)) {
            Core.ensureAccept(10161);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("greenguardeast", "Spider", "Spider Venom", 4);
            Core.huntMonster("greenguardeast", "Wolf", "Wolf's Blood", 4);
            Core.ensureComplete(10161);
        }

        // 10162 | Chaotic Seedbed
        if (!Story.questProgression(10162)) {
            Core.ensureAccept(10162);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("forestchaos", "Chaorrupted Bear", "Chaorrupted Bear Innards");
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("forestchaos", "Chaorrupted Wolf", "Chaorrupted Wolf Innards", 5);
            Core.ensureComplete(10162);
        }

        // 10163 | Dark's Embrace, Sacred Space
        if (!Story.questProgression(10163)) {
            Core.huntMonsterQuest(10163, ["bludrut", UseableMonsters[13], ClassType.Solo]);
        }

        //#endregion Healer
        //#region Warrior
        // 10164 | Beginner's Hurdle
        if (!Story.questProgression(10164)) {
            Core.huntMonsterQuest(10164, ["river", UseableMonsters[14], ClassType.Farm]);
        }

        // 10165 | Berserker Break
        if (!Story.questProgression(10165)) {
            Core.huntMonsterQuest(10165, ["marsh2", UseableMonsters[15], ClassType.Farm]);
        }

        // 10166 | Path of the Warrior
        if (!Story.questProgression(10166)) {
            Core.huntMonsterQuest(10166, ["marsh2", UseableMonsters[16], ClassType.Solo]);
        }

        // 10167 | Stone Will
        if (!Story.questProgression(10167)) {
            Core.huntMonsterQuest(10167, ["greenguardwest", UseableMonsters[17], ClassType.Solo]);
        }
        //#endregion Warrior
        //#region Rogue
        // 10168 | Serious Stealth
        // Use iscomplete before due to 10168 being skipped for w/e reason with questprog.
        if (!Story.questProgression(10168)) {
            Core.huntMonsterQuest(10168, ["orctown", UseableMonsters[18], ClassType.Farm]);
        }

        // 10169 | Shady Snooping
        if (!Story.questProgression(10169)) {
            Core.huntMonsterQuest(10169, ["battleundera", UseableMonsters[19], ClassType.Farm]);
        }

        // 10170 | Stomping Grounds
        if (!Story.questProgression(10170)) {
            Core.huntMonsterQuest(10170, ["Castle", UseableMonsters[20], ClassType.Farm]);
        }

        // 10171 | Swift Shadow
        if (!Story.questProgression(10171)) {
            Core.huntMonsterQuest(10171, ["battleundera", UseableMonsters[21], ClassType.Solo]);
        }

        //#endregion Rogue
        //#region WarLord
        // 10172 | Chaos Reigned
        if (!Story.questProgression(10172)) {
            Core.ensureAccept(10172);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("deepforest", "Eldritch Stalker", "Stalker's Eye", 8);
            Core.huntMonster("deepforest", "Terrarsite", "Terrasite's Maw", 8);
            Core.ensureComplete(10172);
        }

        // 10173 | Fireproofing
        if (!Story.questProgression(10173)) {
            Core.huntMonsterQuest(10173, ["FirePlaneWar", UseableMonsters[24], ClassType.Farm]);
        }

        // 10174 | Fishy-men Business
        if (!Story.questProgression(10174)) {
            Core.ensureAccept(10174);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("ashray", "Ashray Fisherman", "Fisherman's Hook", 8);
            Core.huntMonster("ashray", "Kitefin Shark Bait", "Sharkbait Chunk", 8);
            Core.ensureComplete(10174);
        }

        // 10175 | Baleful Morals
        if (!Story.questProgression(10175)) {
            Core.ensureAccept(10175);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("balemorale", "Lightguard Paladin", "Paladin's Apology", 8);
            Core.huntMonster("balemorale", "Noble's Knight", "Knight's Apology", 8);
            Core.ensureComplete(10175);
        }

        // 10176 | Nainhdeil
        if (!Story.questProgression(10176)) {
            Core.ensureAccept(10176);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("liatarahill", "Garde Wraith", "Wraith Exorcised", 8);
            Core.huntMonster("liatarahill", "Undead Garde ", "Undead Exorcised", 8);
            Core.ensureComplete(10176);
        }

        // Farming Quest - very hard to solo without army.
        // // 10177 | Oxford Degree in Beatdowns
        // if (!Story.QuestProgression(10177))
        // {
        //     Core.HuntMonsterQuest(10177,
        //         ("trainers", UseableMonsters[31], ClassType.Solo));
        // }
        //#endregion WarLord
    }
}

export default function main(): void {
    const script = new WarMonger();
    Core.setOptions();

    script.trainers();

    Core.setOptions(false);
}
