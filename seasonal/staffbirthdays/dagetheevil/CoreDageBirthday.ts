/*
name: null
description: null
tags: null
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/CoreDageBirthday.cs.

import { bot } from "turu";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";

const Story = new CoreStory();

export class CoreDageBirthday {
    doAll(): void {
        if (!Core.isSeasonalMapActive("darkbirthday")) {
            return;
        }

        this.darkPath();
        this.futureLegion();
        this.undervoid();
        this.legionBarracks();
        this.cocytusBarracks();
        this.legionTournament();
        this.phlegethonarena();
        this.reapfinals();

        Core.logger("All Dage Birthday quests have been completed.");
    }

    darkPath(): void {
        if (Core.isCompletedBefore(6234)) {
            return;
        }

        if (!Core.isSeasonalMapActive("darkpath")) {
            return;
        }

        Story.preLoad(this.darkPath);

        //Soul Energy (6220)
        Story.killQuest(6220, "darkpath", "Dark Makai");

        //Open the Portal (6221)
        Story.mapItemQuest(6221, "darkpath", 5663, 5);
        Story.killQuest(6221, "darkpath", "Void Elemental");

        //Go Through the Portal (6222)
        Story.mapItemQuest(6222, "darkpath", 5664);

        //We Need a Guide (6223)
        if (!Story.questProgression(6223)) {
            Core.ensureAccept(6223);
            // there are 2 "Void Energy" - `40070` [Wrong] & `43068` [Correct]
            while (!bot.shouldExit && !Core.checkInventory(43068, 10)) {
                Core.killMonster("darkpath", "r7", "Left", "Void Makai", undefined, undefined, { log: false });
            }
            Core.ensureComplete(6223);
        }

        //Darkness is Energy (6224)
        Story.killQuest(6224, "darkpath", "Void Elemental");

        //Reach the Vault (6225)
        Story.mapItemQuest(6225, "darkpath", 5665);

        //Open the Vault (6226)
        if (!Story.questProgression(6226)) {
            Core.ensureAccept(6226);
            Core.killMonster("darkpath", "r7", "Left", "Void Makai", "Void Makai Slain", 10);
            Core.killMonster("darkpath", "r8a", "Left", "Void Wyrm", "Key to the Vault");
            Story.mapItemQuest(6226, "darkpath", 5666);
            bot.wait.forQuestComplete(6226);
            bot.wait.forTrue(() => bot.player.cell.toLowerCase().includes("cut"), 20);
            Core.jumpWait();
        }

        //Examine the Souls (6227)
        Story.killQuest(6227, "darkpath", "Wandering Soul");

        //Find Another Path (6228)
        Story.mapItemQuest(6228, "darkpath", 5667);

        //More Energy for Zep (6229)
        Story.killQuest(6229, "darkpath", "Void Makai");

        //Pass Through the Shadows (6230)
        Story.mapItemQuest(6230, "darkpath", 5668, 5);
        Story.killQuest(6230, "darkpath", ["Void Makai", "Void Elemental"]);

        //Find Contract (6231)
        Story.mapItemQuest(6231, "darkpath", 5669);

        //Battle the Void Army (6233)
        Story.mapItemQuest(6233, "voidvault", 5673);
        Story.killQuest(6233, "voidvault", "Void Knight");

        //Defeat Zeph'gorog (6234)
        Story.killQuest(6234, "voidvault", "Zeph'gorog");
    }

    futureLegion(): void {
        if (Core.isCompletedBefore(5736)) {
            return;
        }

        if (!Core.isSeasonalMapActive("futurelegion")) {
            return;
        }

        Story.preLoad(this.futureLegion);

        //Examine the Area 5724
        Story.mapItemQuest(5724, "futurelegion", [5162, 5163, 5164]);
        Story.killQuest(5724, "futurelegion", "UW3017 Gunner");

        //Get the Key 5725
        Story.killQuest(5725, "futurelegion", "UW3017 Gunner");

        //Obtain Agravh's Soul 5726
        Story.mapItemQuest(5726, "futurelegion", 5165);
        Story.killQuest(5726, "futurelegion", "Commander Agravh");

        //Obtain Uslaw's Soul 5727
        Story.mapItemQuest(5727, "futurelegion", 5166);
        Story.killQuest(5727, "futurelegion", "Commander Uslaw");

        //Access the Control Room 5728
        Story.mapItemQuest(5728, "futurelegion", 5167);

        //Destory the Force Field 5729
        Story.mapItemQuest(5729, "futurelegion", 5168);
        Story.killQuest(5729, "futurelegion", "UW3017 Blaster");

        //Obtain Ozar's Soul 5730
        Story.killQuest(5730, "futurelegion", "Commander Ozar");

        //Obtain Pavon's Soul 5731
        Story.killQuest(5731, "futurelegion", "Commander Pavon");

        //Activate the Teleporter 5732
        Story.mapItemQuest(5732, "futurelegion", 5169);

        //Keep It Grounded 5733
        Story.mapItemQuest(5733, "futurelegion", 5170, 7);
        Story.killQuest(5733, "futurelegion", "SF3017 Gunner");

        //Get the Code 5734
        Story.killQuest(5734, "futurelegion", ["SF3017 Gunner", "SF3017 Blade"]);

        //Open the Door 5735
        Story.mapItemQuest(5735, "futurelegion", 5171);

        //Take out the Legionator 5736
        Story.killQuest(5736, "futurelegion", "Legionator");
    }

    undervoid(): void {
        if (Core.isCompletedBefore(3406)) {
            return;
        }

        if (!Core.isSeasonalMapActive("undervoid")) {
            return;
        }

        Story.preLoad(this.undervoid);

        Core.addDrop("Hollowborn Soul Stealer");

        //Dark, Deadly Warmup
        Story.killQuest(3399, "underworld", "Dark Makai");

        //Destroy the Good
        Story.killQuest(3400, "alliance", "Good Soldier");

        //Destroy Chaorrupted Evil
        Story.killQuest(3401, "alliance", "Chaorrupted Evil Soldier");

        //Legion Fenrir Gauntlet
        Story.killQuest(3402, "underworld", "Legion Fenrir");

        //Conquer Conquest
        Story.killQuest(3403, "undervoid", "Conquest");

        //Conquer War
        Story.killQuest(3404, "undervoid", "War");

        //Conquer Famine
        Story.killQuest(3405, "undervoid", "Famine");

        //Conquer Death
        Story.killQuest(3406, "undervoid", "Death");
    }

    legionBarracks(): void {
        if (Core.isCompletedBefore(9619)) {
            return;
        }

        if (!Core.isSeasonalMapActive("legionbarracks")) {
            return;
        }

        Story.preLoad(this.legionBarracks);

        // Backroom Whispers (9611)
        Story.killQuest(9611, "legionbarracks", "Legion Evocator");

        // Cur Dolorem Sentis (9612)
        Story.mapItemQuest(9612, "legionbarracks", 12774, 3);

        // Genuine Character (9608)
        Story.killQuest(9608, "legionbarracks", "Legion Knight");

        // Seen the Light (9613)
        Story.killQuest(9613, "legionbarracks", "Sullied Master");

        // Bad Beef (9614)
        Story.killQuest(9614, "legionbarracks", "Off-Duty Minos");

        // Tomb of Memories (9615)
        Story.killQuest(9615, "legionbarracks", "Enlightened Master");

        // Reap What's Sown (9616)
        Story.mapItemQuest(9616, "legionbarracks", 12775);
        Story.killQuest(9616, "legionbarracks", "Overdriven paladin");

        // Wails of Unrest (9617)
        Story.killQuest(9617, "legionbarracks", ["Legion Evocator", "Legion Knight"]);

        // Lamenting Aestiua (9618)
        Story.mapItemQuest(9618, "legionbarracks", [12776, 12777]);

        // Unblemished Snow (9619)
        if (!Core.isCompletedBefore(9619)) {
            Core.equipClass(ClassType.Solo);
            Story.killQuest(9619, "legionbarracks", "Paladin Arondight");
        }
    }

    cocytusBarracks(): void {
        if (Core.isCompletedBefore(9632)) {
            return;
        }

        if (!Core.isSeasonalMapActive("cocytusbarracks")) {
            return;
        }

        this.legionBarracks();

        Story.preLoad(this.cocytusBarracks);

        Core.equipClass(ClassType.Farm);

        // Cocytus Wails (9623)
        Story.killQuest(9623, "cocytusbarracks", ["Legion Evocator", "Legion Knight"]);

        // Light Up Ice Cube (9624)
        Story.mapItemQuest(9624, "cocytusbarracks", 12798, 6);

        // Blessed Blind (9625)
        Story.killQuest(9625, "cocytusbarracks", "Overdriven Evocator");

        // Falsified Hope (9626)
        Story.killQuest(9626, "cocytusbarracks", "Overdriven Knight");

        // Saint of the Battlefield (9627)
        Story.mapItemQuest(9627, "cocytusbarracks", 12799);
        Story.killQuest(9627, "cocytusbarracks", "Overdriven Paladin");

        // River Bends (9628)
        Story.mapItemQuest(9628, "cocytusbarracks", 12800);
        Story.killQuest(9628, "cocytusbarracks", ["Legion Evocator", "Legion Knight"]);

        // Styx and Stones (9629)
        Story.killQuest(9629, "cocytusbarracks", ["Overdriven Knight", "Overdriven Evocator"]);

        // Cry Me a River (9630)
        Story.killQuest(9630, "cocytusbarracks", "Mourner");

        // Boiling Blood (9631)
        Story.killQuest(9631, "cocytusbarracks", "Cerberus Pup");

        // The Knight of Summer Set (9632)
        if (!Core.isCompletedBefore(9632)) {
            Core.equipClass(ClassType.Solo);
            Story.killQuest(9632, "cocytusbarracks", "Maleagant");
        }
    }

    legionTournament(): void {
        if (Core.isCompletedBefore(10634) || !Core.isSeasonalMapActive("legiontournament")) {
            return;
        }

        Story.preLoad(this.legionTournament);

        //#region Useable Monsters
        const UseableMonsters = [
            "Underworld Wolf", // UseableMonsters[0],
            "Legion Gladiator", // UseableMonsters[1],
            "Legion Willbreaker", // UseableMonsters[2],
            "Legion Ritualist", // UseableMonsters[3],
            "Deathwing", // UseableMonsters[4],
            "The WarForge", // UseableMonsters[5]
        ];
        //#endregion Useable Monsters
        // 10625 | Dog Nights of Summer
        if (!Story.questProgression(10625)) {
            Core.huntMonsterQuest(10625, ["legiontournament", UseableMonsters[0], ClassType.Farm]);
        }

        // 10626 | Achilles Tendon
        if (!Story.questProgression(10626)) {
            Core.huntMonsterQuest(10626, ["legiontournament", UseableMonsters[1], ClassType.Farm]);
        }

        // 10627 | Disciplinary Action
        if (!Story.questProgression(10627)) {
            Core.huntMonsterQuest(
                10627,
                ["legiontournament", UseableMonsters[0], ClassType.Farm],
                ["legiontournament", UseableMonsters[1], ClassType.Farm],
            );
        }

        // 10628 | The Fun Police
        if (!Story.questProgression(10628)) {
            if (!Story.questProgression(10628)) {
                Core.ensureAccept(10628);
                Core.getMapItem(15584, 1, "legiontournament");
                Core.huntMonster("legiontournament", "Legion Willbreaker", "Willbreaker's Gyve", 12);
                Core.ensureComplete(10628);
            }
        }

        // 10629 | Despair-ity
        if (!Story.questProgression(10629)) {
            if (!Story.questProgression(10629)) {
                Core.ensureAccept(10629);
                Core.getMapItem(15585, 1, "legiontournament");
                Core.huntMonster("legiontournament", "Legion Ritualist", "Ritualist's Barley Seed", 250);
                Core.ensureComplete(10629);
            }
        }

        // 10630 | Bad Charms
        if (!Story.questProgression(10630)) {
            Story.mapItemQuest(10630, "legiontournament", 15586, 6);
        }

        // 10631 | Self-Appointed Heel
        if (!Story.questProgression(10631)) {
            Core.equipClass(ClassType.Solo);
            if (!Story.questProgression(10631)) {
                Core.ensureAccept(10631);
                Core.getMapItem(15587, 1, "legiontournament");
                Core.huntMonster("legiontournament", "Deathwing", "Deathwing Feather", 120);
                Core.ensureComplete(10631);
            }
        }

        // 10632 | Simple Delights
        if (!Story.questProgression(10632)) {
            Story.mapItemQuest(10632, "legiontournament", 15588);
            Story.mapItemQuest(10632, "legiontournament", 15589);
        }

        // 10633 | Vultures of a Feather
        if (!Story.questProgression(10633)) {
            Core.huntMonsterQuest(
                10633,
                ["legiontournament", UseableMonsters[3], ClassType.Solo],
                ["legiontournament", UseableMonsters[4], ClassType.Solo],
            );
        }

        // 10634 | All's Fair
        if (!Story.questProgression(10634)) {
            Core.huntMonsterQuest(10634, ["legiontournament", UseableMonsters[5], ClassType.Solo]);
        }
    }

    phlegethonarena(): void {
        if (Core.isCompletedBefore(10646) || !Core.isSeasonalMapActive("PhlegethonArena")) {
            return;
        }

        this.legionTournament();

        Story.preLoad(this.phlegethonarena);

        //#region Useable Monsters
        const UseableMonsters = [
            "Cerberus pup", // UseableMonsters[0],
            "Legion Willbreaker", // UseableMonsters[1],
            "Underworld Wolf", // UseableMonsters[2],
            "Abyssal Underbeast", // UseableMonsters[3],
            "Legion Guard", // UseableMonsters[4],
            "Deathwings", // UseableMonsters[5],
            "Underworld Wolf Warrior", // UseableMonsters[6],
            "Devourer of Souls", // UseableMonsters[7],
            "Rayce ", // UseableMonsters[8],
            "Warped Revenant", // UseableMonsters[9],
            "Horseman of Death", // UseableMonsters[10]
        ];
        //#endregion Useable Monsters
        // 10637 | Sprint to the Starting Line
        if (!Story.questProgression(10637)) {
            Core.huntMonsterQuest(10637, ["Phlegethonarena", UseableMonsters[0], ClassType.Farm]);
        }

        // 10638 | Broken Androktasia
        if (!Story.questProgression(10638)) {
            Core.huntMonsterQuest(10638, ["Phlegethonarena", UseableMonsters[1], ClassType.Farm]);
        }

        // 10639 | Phlegethon Watchman
        if (!Story.questProgression(10639)) {
            Story.mapItemQuest(10639, "Phlegethonarena", 15610);
            Core.huntMonsterQuest(
                10639,
                ["Phlegethonarena", UseableMonsters[1], ClassType.Farm],
                ["Phlegethonarena", UseableMonsters[0], ClassType.Farm],
            );
        }

        // 10640 | Loophole Abuse
        if (!Story.questProgression(10640)) {
            Core.huntMonsterQuest(10640, ["Phlegethonarena", UseableMonsters[2], ClassType.Farm]);
        }

        // 10641 | Man of the Pack
        if (!Story.questProgression(10641)) {
            Core.huntMonsterQuest(10641, ["Phlegethonarena", UseableMonsters[6], ClassType.Solo]);
        }

        // 10642 | The Ferryman's Offer
        if (!Story.questProgression(10642)) {
            Story.mapItemQuest(10642, "Phlegethonarena", 15611);
            Core.huntMonsterQuest(10642, ["Phlegethonarena", UseableMonsters[3], ClassType.Farm]);
        }

        // 10643 | Sloth or Pride
        if (!Story.questProgression(10643)) {
            Core.logger(
                "hey so appearntly this dude hits like a truck without the pot.. so use something like YNR for your dodge class in CBO",
            );
            Core.huntMonsterQuest(10643, ["Phlegethonarena", UseableMonsters[7], ClassType.Dodge]);
        }

        // 10644 | Remember Rayce?
        if (!Story.questProgression(10644)) {
            Core.huntMonsterQuest(10644, ["Phlegethonarena", UseableMonsters[8], ClassType.Solo]);
        }

        // 10645 | Suspicious Distraction
        if (!Story.questProgression(10645)) {
            Core.huntMonsterQuest(
                10645,
                ["Phlegethonarena", UseableMonsters[5], ClassType.Farm],
                ["Phlegethonarena", UseableMonsters[4], ClassType.Farm],
            );
        }

        // 10646 | Death's Revelation
        if (!Story.questProgression(10646)) {
            Core.huntMonsterQuest(10646, ["Phlegethonarena", UseableMonsters[10], ClassType.Solo]);
        }
    }

    reapfinals(): void {
        this.phlegethonarena();

        if (Core.isCompletedBefore(10663) || !Core.isSeasonalMapActive("ReapFinals")) {
            return;
        }

        Story.preLoad(this.reapfinals);

        //#region Useable Monsters
        const UseableMonsters = [
            "Legion Gladiator", // UseableMonsters[0],
            "Legion Knight", // UseableMonsters[1],
            "Legion Willbreaker", // UseableMonsters[2],
            "Deathwings", // UseableMonsters[3],
            "Vulcar", // UseableMonsters[4],
            "Seneschal", // UseableMonsters[5],
            "Legion Ritualist", // UseableMonsters[6],
            "Ritualist Leader", // UseableMonsters[7],
            "The Crimson Rider", // UseableMonsters[8],
            "Rhadamanthys", // UseableMonsters[9],
            "Aeacus", // UseableMonsters[10],
            "Minos", // UseableMonsters[11],
            "Deimos", // UseableMonsters[12],
            "Laken Clone 1.7", // UseableMonsters[13],
            "Laken Clone 2.3", // UseableMonsters[14],
            "The Black Rider", // UseableMonsters[15],
            "General Vaughn", // UseableMonsters[16]
        ];
        //#endregion Useable Monsters
        // 10654 | Straightforward Wrath
        if (!Story.questProgression(10654)) {
            Core.huntMonsterQuest(10654, ["reapfinals", UseableMonsters[4], ClassType.Solo]);
        }

        // 10655 | Sinister Assist
        if (!Story.questProgression(10655)) {
            Core.huntMonsterQuest(10655, ["reapfinals", UseableMonsters[5], ClassType.Solo]);
        }

        // 10656 | Disposer of Lots
        if (!Story.questProgression(10656)) {
            Core.ensureAccept(10656);
            Story.mapItemQuest(10656, "reapfinals", 15638);

            if (bot.map.name !== "reapfinals") {
                Core.join("reapfinals");
            }
            if (bot.player?.cell !== "Arena3") {
                Core.jump("Arena3");
            }
            // C# `Retry:` ... `goto Retry;`: a labeled loop that re-reads the leader.
            retry: for (;;) {
                let CultLeader = bot.monsters.currentAvailableMonsters.find((x) => x != null && x.mapId === 30);

                while (!bot.shouldExit && CultLeader != null && CultLeader.state === 2 /* invulnerable */) {
                    Core.killMonster("reapfinals", "arena3", "Bottom", "Legion Ritualist");
                    // Re-snapshop leader for state
                    CultLeader = bot.monsters.currentAvailableMonsters.find((x) => x != null && x.mapId === 30);
                    if (CultLeader != null && CultLeader.state !== 2) {
                        Core.killMonster("reapfinals", "arena3", "Bottom", "Ritualist Leader");
                        if (bot.tempInv.contains("Ritualist's Candle")) {
                            Core.jumpWait();
                            break;
                        } else continue retry;
                    }
                }
                break;
            }
            Core.ensureComplete(10656);
        }

        // 10657 | War's Revelation
        if (!Story.questProgression(10657)) {
            Core.huntMonsterQuest(10657, ["reapfinals", UseableMonsters[8], ClassType.Solo]);
        }

        // 10658 | Judges' Grudges
        if (!Story.questProgression(10658)) {
            Core.ensureAccept(10658);
            Core.equipClass(ClassType.Solo);

            if (bot.map.name !== "reapfinals") {
                Core.join("reapfinals");
            }
            if (bot.player?.cell !== "Arena5") {
                Core.jump("Arena5");
            }

            let Rhadamanthys = bot.monsters.currentAvailableMonsters.find((x) => x != null && x.mapId === 35);
            let Minos = bot.monsters.currentAvailableMonsters.find((x) => x != null && x.mapId === 37);

            while (!bot.shouldExit) {
                if (bot.map.name !== "reapfinals") {
                    Core.join("reapfinals");
                }
                if (bot.player?.cell !== "Arena5") {
                    Core.jump("Arena5");
                }

                Rhadamanthys = bot.monsters.currentAvailableMonsters.find((x) => x != null && x.mapId === 35);
                Minos = bot.monsters.currentAvailableMonsters.find((x) => x != null && x.mapId === 37);

                if (Rhadamanthys != null && Rhadamanthys.hp > 0 && Rhadamanthys.state > 0) {
                    bot.combat.attack("Rhadamanthys");
                } else if (Minos != null && Minos.hp > 0 && Minos.state > 0) {
                    bot.combat.attack("Minos");
                } else {
                    bot.combat.attack("Aeacus");
                }
                bot.sleep(500);

                if (
                    bot.tempInv.contains("Minos Defeated") &&
                    bot.tempInv.contains("Rhadamanthys Defeated") &&
                    bot.tempInv.contains("Aeacus Defeated")
                ) {
                    Core.jumpWait();
                    break;
                }
            }
            Core.ensureComplete(10658);
        }

        // 10659 | Devastated Deimos
        if (!Story.questProgression(10659)) {
            Core.huntMonsterQuest(10659, ["reapfinals", UseableMonsters[12], ClassType.Solo]);
        }

        // 10660 | Laken, the Sequel
        if (!Story.questProgression(10660)) {
            Core.huntMonsterQuest(
                10660,
                ["reapfinals", UseableMonsters[14], ClassType.Solo],
                ["reapfinals", UseableMonsters[13], ClassType.Solo],
            );
        }

        // 10661 | Take Ill
        if (!Story.questProgression(10661)) {
            Story.mapItemQuest(10661, "reapfinals", 15639, 2);
            Story.mapItemQuest(10661, "reapfinals", 15640);
        }

        // 10662 | Pallidus Curse
        if (!Story.questProgression(10662)) {
            Story.mapItemQuest(10662, "reapfinals", 15641, 8);
            Core.huntMonsterQuest(10662, ["reapfinals", UseableMonsters[0], ClassType.Farm]);
        }

        // 10663 | Famine's Revelation
        if (!Story.questProgression(10663)) {
            Core.huntMonsterQuest(10663, [
                "reapfinals",
                UseableMonsters[16],
                !Core.bossClass ? ClassType.Solo : ClassType.Boss,
            ]);

            Core.ensureAccept(10658);
            Core.equipClass(ClassType.Solo);

            if (bot.map.name !== "reapfinals") {
                Core.join("reapfinals");
            }
            if (bot.player?.cell !== "Arena8") {
                Core.jump("Arena8", "Bottom");
            }

            let GeneralVaughn = bot.monsters.currentAvailableMonsters.find((x) => x != null && x.mapId === 42);

            while (!bot.shouldExit) {
                if (bot.map.name !== "reapfinals") {
                    Core.join("reapfinals");
                }
                if (bot.player?.cell !== "Arena5") {
                    Core.jump("Arena5");
                }

                GeneralVaughn = bot.monsters.currentAvailableMonsters.find((x) => x != null && x.mapId === 42);

                if (GeneralVaughn != null && GeneralVaughn.hp > 0 && GeneralVaughn.state > 0) {
                    bot.combat.attack(42);
                } else {
                    bot.combat.attack(41);
                }
                bot.sleep(500);

                if (bot.tempInv.contains(100145)) {
                    Core.jumpWait();
                    break;
                }
            }
            Core.ensureComplete(10658);
        }
    }
}
