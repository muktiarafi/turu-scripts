/*
name: Jirabin Challenge Quests
description: Does the Jirabin Challenge Quests
tags: jirabin challenge, runedwoods, dethertombs, xiex, voidbattle, jir'abin
*/
// Port of Scripts/Other/Jir'abinChallenge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class JirabinChallenge {
    readonly drops: string[] = [
        "Blood of the Void Blade",
        "Blood of the Void Daggers",
        "Phantasmagoric Vengeance",
        "Purified Void Blade",
        "Purified Void Daggers",
    ];

    doAll(): void {
        this.runedWoods();
        this.detherTombs();
        this.voidBattle();
    }

    runedWoods(): void {
        if (Core.isCompletedBefore(3987)) {
            return;
        }

        Story.preLoad(this.runedWoods);

        //Void Dragon Invasion
        Story.chainQuest(3976);

        //Meet the Za'narians 3977
        Story.mapItemQuest(3977, "runedwoods", [3104, 3105, 3106, 3107, 3108, 3109]);

        //Ruining the Dragonwood 3978
        if (!Story.questProgression(3978)) {
            Core.ensureAccept(3978);
            Core.huntMonster("runedwoods", "Void Warrior", "Slay Void Warriors", 3);
            Core.huntMonster("runedwoods", "Frask", "Slay Frasks", 5);
            Core.huntMonster("runedwoods", "Jies", "Slay Jies", 4);
            Core.ensureComplete(3978);
        }

        //Catch the Ki'lks! 3979
        if (!Story.questProgression(3979)) {
            Core.ensureAccept(3979);
            Core.huntMonster("northlandlight", "Ice Ki'lk", "Ice Ki'lk Slain", 5);
            Core.huntMonster("northlands", "Fire Ki'lk", "Fire Ki'lk Slain", 5);
            Core.huntMonster("northlands", "Energy Ki'lk", "Energy Ki'lk Slain", 5);
            Core.ensureComplete(3979);
        }

        //Discover the Darkness 3980
        if (!Story.questProgression(3980)) {
            Core.ensureAccept(3980);
            Core.huntMonster("runedwoods", "Frask", "Frask Scale", 3);
            Core.huntMonster("doomwood", "Doomwood Bonemuncher", "Bonemuncher Fang", 8);
            Core.huntMonster("doomwood", "Doomwood Ectomancer", "Ectomancer Orb");
            Core.ensureComplete(3980);
        }

        //Shoot for Victory 3981
        if (!Story.questProgression(3981)) {
            Core.ensureAccept(3981);
            Core.huntMonster("uppercity", "Drow Assassin", "Assassin Bowstring", 6);
            Core.huntMonster("runedwoods", "Frask", "Frask Legbone", 6);
            Core.ensureComplete(3981);
        }

        //Find the Frasks! 3982
        if (!Story.questProgression(3982)) {
            Core.ensureAccept(3982);
            Core.huntMonster("sandsea", "Sandsea Frask", "Sandsea Frask Cleared", 4);
            Core.huntMonster("pines", "Dwarfhold Frask", "Dwarfhold Frask Cleared", 4);
            Core.huntMonster("hachiko", "Yokai Frask ", "Yokai Frask Cleared", 4);
            Core.ensureComplete(3982);
        }

        //Analogues for Rath 3983
        if (!Story.questProgression(3983)) {
            Core.ensureAccept(3983);
            Core.huntMonster("runedwoods", "Jies", "Jiess Rubble", 5);
            Core.huntMonster("cloister", "Karasu", "Karasu Wing", 4);
            Core.huntMonster("cloister", "Wendigo", "Wendigo Fur");
            Core.ensureComplete(3983);
        }

        //The Shades Grow Darker 3984
        if (!Story.questProgression(3984)) {
            Core.ensureAccept(3984);
            Core.huntMonster("northlands", "Northlands Shade", "Northlands Shades Cleared", 3);
            Core.huntMonster("mythsong", "Mythsong Shade", "Mythsong Shades Cleared", 3);
            Core.huntMonster("pines", "Dwarfhold Shade", "Dwarfhold Shades Cleared", 3);
            Core.huntMonster("darkoviagrave", "Darkovia Shade", "Darkovia Shades Cleared", 3);
            Core.ensureComplete(3984);
        }

        //Discover the Void 3985
        if (!Story.questProgression(3985)) {
            Core.ensureAccept(3985);
            Core.huntMonster("void", "Void Elemental", "Void Elemental Heart", 8);
            Core.huntMonster("void", "Void Bear", "Void Bear Tusk", 2);
            Core.ensureComplete(3985);
        }

        //Confront Jir'abin 3986
        Core.equipClass(ClassType.Solo);
        Story.killQuest(3986, "runedwoods", "Jir'abin");

        // The Void Expands 3987
        Story.chainQuest(3987);
    }

    detherTombs(): void {
        if (Core.isCompletedBefore(4005)) {
            return;
        }

        this.runedWoods();

        Story.preLoad(this.detherTombs);

        // Za'nar Week 2 - 1 3995
        Story.chainQuest(3995);

        //Enter the Tomb 3996
        Story.killQuest(3996, "dethertombs", "Sand Frask");

        //The Relic of Light Tome 3997
        Story.killQuest(3997, "dethertombs", "De'ther Shade");

        //Disarm the Traps 3998
        Story.mapItemQuest(3998, "dethertombs", 3132, 12);

        //Find the Missing Pages 3999
        if (!Story.questProgression(3999)) {
            Core.ensureAccept(3999);
            Core.huntMonster("dethertombs", "De'ther Shade", "Tome Page", 10);
            Core.huntMonster("dethertombs", "De'ther Shade", "Device Diagram", 1);
            Core.ensureComplete(3999);
        }

        //Find the Resonator Components 4000
        if (!Story.questProgression(4000)) {
            Core.ensureAccept(4000);
            Core.huntMonster("dethertombs", "Tomb Drifter", "Tomb Drifter Scale", 10);
            Core.huntMonster("dethertombs", "Sand Frask", "Frask Feather", 12);
            Core.ensureComplete(4000);
        }

        //More Components needed 4001
        if (!Story.questProgression(4001)) {
            Core.ensureAccept(4001);
            Core.huntMonster("dethertombs", "Darkfang", "Darkfang Claw", 15);
            Core.huntMonster("dethertombs", "Tomb Shark", "Tomb Shark Hide", 1);
            Core.ensureComplete(4001);
        }

        //Final Components 4002
        if (!Story.questProgression(4002)) {
            Core.ensureAccept(4002);
            Core.huntMonster("dethertombs", "Jies", "Diamond Tooth", 6);
            Core.huntMonster("dethertombs", "De'ther Vase", "Bottle of Oil", 1);
            Core.ensureComplete(4002);
        }
        // if (!Story.QuestProgression(4002))
        // {
        //     Core.EnsureAccept(4002);
        //     Core.HuntMonster("dethertombs", "De'ther Vase", "Bottle Of Oil");
        //     Core.HuntMonster("dethertombs", "Jies", "Diamond Tooth", 6);
        //     Core.EnsureComplete(4002);
        // } //Keep //-ed incase something is wrong here

        //Gain Entrance to the Vault 4003
        Story.mapItemQuest(4003, "dethertombs", 3134);

        //Defeat the Spirit 4004
        Story.killQuest(4004, "dethertombs", "Spirit of De'ther");

        //Battle Jir'abin 4005
        Story.killQuest(4005, "xiex", "Jir'abin");
    }

    voidBattle(): void {
        if (Core.checkInventory(this.drops, undefined, { toInv: false })) {
            return;
        }
        this.detherTombs();
        Core.addDrop(...this.drops);

        Core.logger(`Hunting Jir'abin Challenge for drop items.`);
        while (!bot.shouldExit && !Core.checkInventory(this.drops, undefined, { toInv: false })) {
            Core.huntMonster("voidbattle", "Jir'abin Challenge", undefined, undefined, { log: false });
            Core.toBank(...this.drops);
        }
        Core.logger(`All Drops Acquired.`);
    }
}

export default function main(): void {
    const script = new JirabinChallenge();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
