/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/Hollowborn/CoreHollowbornStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class CoreHollowbornStory {
    doAll(): void {
        this.trygve();
        this.neoFortress();
        this.shadowslayerD();
        this.shadowrealm();
        this.neoTower();
        this.dawnSanctum();
    }

    trygve(): void {
        if (Core.isCompletedBefore(8298)) {
            return;
        }

        Story.preLoad(this.trygve);

        //Wunjo, Reversed (8289)
        Story.killQuest(8289, "trygve", "Vindicator Recruit");

        //Berkana (8290)
        if (!Story.questProgression(8290)) {
            Core.ensureAccept(8290);
            Core.getMapItem(9036, 1, "trygve");
            Core.huntMonster("trygve", "Blood Eagle", "Blood Eagle Feather", 9);
            Core.ensureComplete(8290);
        }

        //Algiz, Reversed (8291)
        if (!Story.questProgression(8291)) {
            Core.ensureAccept(8291);
            Core.getMapItem(9037, 1, "trygve");
            Core.huntMonster("trygve", "Vindicator Recruit", "Armor Chunk", 9);
            Core.ensureComplete(8291);
        }

        //Gebo (8292)
        if (!Story.questProgression(8292)) {
            Core.ensureAccept(8292);
            Core.getMapItem(9038, 1, "trygve");
            Core.huntMonster("trygve", "Rune Boar", "Patch of Boar Hide", 8);
            Core.ensureComplete(8292);
        }

        //Eihwaz (8293)
        if (!Story.questProgression(8293)) {
            Core.ensureAccept(8293);
            Core.getMapItem(9039, 3, "trygve");
            Core.huntMonster("trygve", "Vindicator Recruit", "Soldiers Pacified", 9);
            Core.ensureComplete(8293);
        }

        //Hagalaz (8294)
        Story.mapItemQuest(8294, "trygve", 9040, 8);

        //Mannaz (8295)
        if (!Story.questProgression(8295)) {
            Core.ensureAccept(8295);
            Core.huntMonster("trygve", "Blood Eagle", "Eagle Talon", 9);
            Core.huntMonster("trygve", "Rune Boar", "Boar Bone", 9);
            Core.ensureComplete(8295);
        }

        //Thurisaz (8296)
        Story.killQuest(8296, "trygve", "Vindicator Recruit");

        //Othala (8297)
        if (!Story.questProgression(8297)) {
            Core.ensureAccept(8297);
            Core.huntMonster("trygve", "Blood Eagle", "Creature Bones", 7);
            Core.huntMonster("trygve", "Vindicator Recruit", "Vindicator Defeated", 7);
            Core.ensureComplete(8297);
        }

        //Isa, Reversed (8298)
        Story.killQuest(8298, "trygve", "Gramiel");
    }

    neoFortress(): void {
        if (Core.isCompletedBefore(9290)) {
            return;
        }

        this.trygve();

        Story.preLoad(this.neoFortress);

        //Watch the Light 9281
        Story.mapItemQuest(9281, "neofortress", 11806, 9);

        //Uprootment Recruitment 9282
        Story.killQuest(9282, "neofortress", "Vindicator Recruit");

        //Endless Hounding 9283
        Story.killQuest(9283, "neofortress", "Vindicator Hound");

        //Mystery Creature 9284
        Story.killQuest(9284, "neofortress", "Vindicator Beast");

        //Retrieve the Keys 9285
        Story.killQuest(9285, "neofortress", "Vindicator Soldier");

        //Free the Prisoners 9286
        Story.mapItemQuest(9286, "neofortress", 11807, 5);

        //Vindicator General 9287
        Story.killQuest(9287, "neofortress", "Vindicator General");

        //De-dicated 9288
        Story.killQuest(9288, "neofortress", "Vindicator Recruit");

        //Get into the Chambers 9289
        Story.killQuest(9289, "neofortress", "Vindicator General");

        //Tales from the Past 9290
        Story.mapItemQuest(9290, "neofortress", 11808);
    }

    shadowslayerD(): void {
        if (Core.isCompletedBefore(9489)) {
            return;
        }

        Story.preLoad(this.shadowslayerD);

        // Remnant of Will 9487
        Story.killQuest(9487, "hbchallenge", "Sentient Hollow");
        // Stake Your Life 9488
        Story.killQuest(9488, "hbchallenge", "Hollowborn Vampire");
        // Hollow Howl 9489
        Story.killQuest(9489, "hbchallenge", "Hollowborn Lycan");
    }

    shadowrealm(): void {
        if (Core.isCompletedBefore(9793)) {
            return;
        }

        Story.preLoad(this.shadowrealm);

        // The First Crumb (9783)
        Story.killQuest(9783, "bonecastle", "Undead Guard");

        // Return to Lifeblood (9784)
        Story.killQuest(9784, "lycan", "Sanguine");

        // Nohairatu (9785)
        Story.killQuest(9785, "umbral", "Rapaxi");

        // Bony Hodgepodge (9786)
        Story.killQuest(9786, "battleundera", "Bone Terror");

        // Red Risk (9787)
        if (!Story.questProgression(9787)) {
            Core.ensureAccept(9787);
            Core.killMonster("shadowrise", "r15", "Left", "Infernal Warrior", "Marred Armor Piece");
            Core.ensureComplete(9787);
        }

        // Knuckle Levity (9788)
        if (!Story.questProgression(9788)) {
            bot.quests.updateQuest(8564);
            Core.equipClass(ClassType.Solo);
            Story.killQuest(9788, "dagerecruit", "Nuckelavee");
        }

        // Grudge Ghost (9790)
        if (!Story.questProgression(9790)) {
            Core.equipClass(ClassType.Solo);
            Story.killQuest(9790, "darkally", "Underfiend");
        }

        // Inverted Expectation (9791)
        if (!Story.questProgression(9791)) {
            Core.equipClass(ClassType.Solo);
            Story.killQuest(9791, "yasaris", "Avatar of Anubyx");
        }

        // Die Angry (9792)
        if (!Story.questProgression(9792)) {
            Core.equipClass(ClassType.Solo);
            Story.killQuest(9792, "wrath", "Gorgorath");
        }

        // Treasure Death (9793)
        Story.mapItemQuest(9793, "greed", 13314);
    }

    neoTower(): void {
        if (Core.isCompletedBefore(9864)) {
            return;
        }

        this.neoFortress();

        Story.preLoad(this.neoTower);

        //#region Useable Monsters
        const UseableMonsters = [
            "Dawn Vindicator Soldier ", // UseableMonsters[0],
            "Vindicator Beast", // UseableMonsters[1],
            "Vindicator Draconian", // UseableMonsters[2],
            "Vindicator Assassin", // UseableMonsters[3],
            "Assassin Shade", // UseableMonsters[4],
            "Vindicator BeastTamer", // UseableMonsters[5],
            "Vindicator Hound", // UseableMonsters[6],
            "Vindicator Crystal", // UseableMonsters[7],
            "Vindicator Priest", // UseableMonsters[8]
        ];
        //#endregion Useable Monsters
        // 9855 | 24 Hour Graveyard Shift
        if (!Story.questProgression(9855)) {
            Core.huntMonsterQuest(9855, ["neotower", UseableMonsters[0], ClassType.Solo]);
        }

        // 9856 | On Unwanted Wings
        if (!Story.questProgression(9856)) {
            Core.huntMonsterQuest(9856, ["neotower", UseableMonsters[1], ClassType.Solo]);
        }

        // 9857 | Noble Dragonkin
        if (!Story.questProgression(9857)) {
            Core.huntMonsterQuest(9857, ["neotower", UseableMonsters[2], ClassType.Solo]);
        }

        // 9858 | A Dire Horcdeal
        if (!Story.questProgression(9858)) {
            Core.ensureAccept(9858);
            Core.getMapItem(13581, 1, "neotower");
            Core.huntMonster("neotower", "Vindicator Draconian", "Tower Key", 1);
            Core.ensureComplete(9858);
        }

        // 9859 | Outclassin' the Assassin
        if (!Story.questProgression(9859)) {
            Core.huntMonsterQuest(9859, ["neotower", UseableMonsters[3], ClassType.Solo]);
        }

        // 9860 | Mean Dog Walker
        if (!Story.questProgression(9860)) {
            Core.huntMonsterQuest(9860, ["neotower", UseableMonsters[5], ClassType.Solo]);
        }

        // 9861 | Safe Keeping
        if (!Story.questProgression(9861)) {
            Core.huntMonsterQuest(9861, ["neotower", UseableMonsters[1], ClassType.Solo]);
        }

        // 9862 | Seeds to be Reaped
        if (!Story.questProgression(9862)) {
            Core.huntMonsterQuest(9862, ["neotower", UseableMonsters[0], ClassType.Solo]);
        }

        // 9863 | Ceremonies and Rituals
        if (!Story.questProgression(9863)) {
            Core.ensureAccept(9863);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("neotower", "Dawn Vindicator Soldier ", "Soldier's Grace", 8);
            Core.huntMonster("neotower", "Vindicator Beast", "Beast's Grace", 8);
            Core.ensureComplete(9863);
        }

        // 9864 | Selective Acknowledgement
        if (!Story.questProgression(9864)) {
            Core.huntMonsterQuest(9864, ["neotower", UseableMonsters[8], ClassType.Solo]);
        }
    }

    dawnSanctum(): void {
        if (Core.isCompletedBefore(9986)) {
            return;
        }

        this.neoTower();

        Story.preLoad(this.dawnSanctum);

        //#region Useable Monsters
        const UseableMonsters = [
            "Vindicator Soldier", // UseableMonsters[0],
            "Hollowborn Soldier", // UseableMonsters[1],
            "Vindicator Recruit", // UseableMonsters[2],
            "Vindicator Hound", // UseableMonsters[3],
            "Hollowborn Hound", // UseableMonsters[4],
            "Vindicator Draconian", // UseableMonsters[5],
            "Hollowborn Draconian", // UseableMonsters[6],
            "Grandmaster Gramiel", // UseableMonsters[7],
            "Celestial Gramiel", // UseableMonsters[8]
        ];
        //#endregion Useable Monsters
        // 9977 | Wunjo, Reversed - Realized
        if (!Story.questProgression(9977)) {
            Core.huntMonsterQuest(9977, ["dawnsanctum", UseableMonsters[0], ClassType.Farm]);
        }

        // 9978 | Berkana - Realized
        if (!Story.questProgression(9978)) {
            Core.huntMonsterQuest(9978, ["dawnsanctum", UseableMonsters[1], ClassType.Farm]);
        }

        // 9979 | Algiz, Reversed - Realized
        if (!Story.questProgression(9979)) {
            Core.ensureAccept(9979);
            Core.getMapItem(13853, 1, "dawnsanctum");
            Core.huntMonster("dawnsanctum", "Vindicator Recruit", "Recruit's Brand", 5);
            Core.ensureComplete(9979);
        }

        // 9980 | Gebo - Realized
        if (!Story.questProgression(9980)) {
            Core.huntMonsterQuest(9980, ["dawnsanctum", UseableMonsters[3], ClassType.Farm]);
        }

        // 9981 | Eihwaz - Realized
        if (!Story.questProgression(9981)) {
            Core.ensureAccept(9981);
            Core.getMapItem(13854, 1, "dawnsanctum");
            Core.huntMonster("dawnsanctum", "Hollowborn Hound", "Hollowborn Collar", 6);
            Core.ensureComplete(9981);
        }

        // 9982 | Hagalaz - Realized
        if (!Story.questProgression(9982)) {
            Core.huntMonsterQuest(9982, ["dawnsanctum", UseableMonsters[5], ClassType.Farm]);
        }

        // 9983 | Mannaz - Realized
        if (!Story.questProgression(9983)) {
            Core.huntMonsterQuest(9983, ["dawnsanctum", UseableMonsters[6], ClassType.Farm]);
        }

        // 9984 | Thurisaz - Realized
        if (!Story.questProgression(9984)) {
            Core.ensureAccept(9984);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("dawnsanctum", "Vindicator Draconian", "Vindicator Talon", 6);
            Core.huntMonster("dawnsanctum", "Hollowborn Draconian", "Hollowborn Talon", 6);
            Core.ensureComplete(9984);
        }

        // 9985 | Othala - Realized
        if (!Story.questProgression(9985)) {
            Core.huntMonsterQuest(9985, ["dawnsanctum", UseableMonsters[7], ClassType.Solo]);
        }

        // 9986 | Isa, Reversed - Realized
        if (!Story.questProgression(9986)) {
            Core.huntMonsterQuest(9986, ["dawnsanctum", UseableMonsters[8], ClassType.Solo]);
        }
    }

    // I'll put it here in case it turns out its needed
    // public void ShadowrRealm()
    // {
    //     if (Core.isCompletedBefore(3182))
    //         return;

    //     Story.PreLoad(this);

    //     [[[Shadowrealm]]] un related quest but releted to hollowborn

    //     Key to the ShadowLord 3182
    //     if (!Story.QuestProgression(3182))
    //     {
    //         Core.EnsureAccept(3182);
    //         Core.HuntMonster("shadowrealmpast", "Pure Shadowscythe", "Source of Luminance", 50, false);
    //         Core.EnsureComplete(3182);
    //     }
    // }
}
