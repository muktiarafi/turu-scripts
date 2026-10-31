/*
name: Banished
description: This will finish the Banished quest.
tags: story, quest, banished
*/
// Port of Scripts/Story/Banished.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../core/CoreAdvanced";
import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";
import { CoreQOM } from "./queenofmonsters/CoreQoM";

const Adv = new CoreAdvanced();
const Story = new CoreStory();
const coreQOM = new CoreQOM();

export class Banished {
    questDrops: string[] = ["Diabolical Tome Pet", "Diabolical Tome Cape"];

    doall(): void {
        Story.preLoad(this.doall);
        this.hikarisQuests();
        this.knave1sQuests();
        this.himisQuests();
    }

    hikarisQuests(): void {
        if (Core.isCompletedBefore(8464)) {
            return;
        }

        Core.equipClass(ClassType.Solo);

        // The First Task
        Story.killQuest(7875, "timevoid", "Unending Avatar");

        // The Second Task
        Story.killQuest(7876, "twilightedge", "ChaosWeaver Warrior");

        // The Third Task
        Story.killQuest(7877, "mudluk", "Tiger Leech");

        // The Fourth Task
        Story.killQuest(7878, "deathsrealm", "Death Alive");

        // The Fifth Task
        Story.killQuest(7879, "thevoid", "Void Dragon");

        // The Sixth Task
        if (!Story.questProgression(7880)) {
            Core.ensureAccept(7880);
            Core.killMonster("banished", "r14", "Left", "Desterrat Moya", "Infected Tentacle");
            Core.ensureComplete(7880);
        }

        // Short of Reach
        Story.killQuest(8458, "transformation", "Eldritch Abomination");

        // Stringing Along
        Story.killQuest(8459, "blackhorn", "Bonefeeder Spider");

        // Review the Reanimated
        Story.killQuest(8460, "noxustower", "Lightguard Caster");

        // Resting Place
        Story.killQuest(8461, "aozorahills", "Ghostly Hasu");

        // Health is Wealth
        // Vial of Antitoxins x1
        if (!Story.questProgression(8462)) {
            Core.ensureAccept(8462);
            Adv.buyItem("alchemyacademy", 2114, "Vial of Antitoxins");
            Core.ensureComplete(8462);
        }

        // A Guilty Conscience
        Story.killQuest(8463, "ghostnexus", "Manifestation of Grief");

        // Insomniacs
        Story.killQuest(8464, "somnia", "Dream Larva");
    }

    knave1sQuests(): void {
        if (Core.isCompletedBefore(2027)) {
            return;
        }

        // Knave1's Route to the Void
        Story.mapItemQuest(2022, "northlands", 979);

        // Void Spell
        if (!Story.questProgression(2023)) {
            Core.ensureAccept(2023);
            Core.huntMonster("northlands", "Chaos Gemrald", "Chaos Gemrald Cluster");
            Core.huntMonster("northlands", "Chaos Gemrald", "Chaos Gemrald Shard", 5);
            Core.ensureComplete(2023);
        }

        // Know Thy Enemy
        Story.mapItemQuest(2024, "banished", 980);

        // An Enemy Unblooded
        if (!Story.questProgression(2025)) {
            Core.ensureAccept(2025);
            Core.huntMonster("banished", "Desterrat Cruor", "Drop of Life", 10);
            Core.huntMonster("banished", "Desterrat Crux", "Breath of Life", 4);
            Core.ensureComplete(2025);
        }

        // Re - Open the Seal
        Story.mapItemQuest(2026, "banished", 981, 7);

        // Weaken the Moya
        Story.killQuest(2027, "doomwood", "Doomwood Ectomancer");

        // Banish the Banished One
        Story.killQuest(2028, "banished", "Desterrat Moya");
    }

    himisQuests(): void {
        if (Core.isCompletedBefore(9044)) {
            return;
        }

        this.hikarisQuests();
        coreQOM.theBook();

        Story.preLoad(this.himisQuests);

        //Recover and Recycle (9040)
        Story.killQuest(9040, "brokenwoods", "Extrikiti");

        //Tormented Fang Uncleansed Grove (9041)
        Core.equipClass(ClassType.Solo);
        Story.killQuest(9041, "deepforest", "Aberrant Horror");

        //Slice of Life (9042)
        if (!Story.questProgression(9042)) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAcceptmultiple(9042, 739);
            Core.addDrop("Racing Trophy");
            while (!bot.shouldExit && !Core.checkInventory("Racing Trophy", 20)) {
                Core.chainComplete(746);
            }
            Core.huntMonster("table", "Roach", "Gold Roach Antenna", 10);
            Core.ensureComplete(739, 5420);
            Core.ensureComplete(9042);
        }

        //Null and Void (9043)
        Story.killQuest(9043, "thevoid", "Dark Djinn");

        //Summoning and Sealing (9044)
        Core.equipClass(ClassType.Solo);
        Story.killQuest(9044, "brokenwoods", "Eldritch Amalgamation");
    }
}

export default function main(): void {
    const script = new Banished();
    Core.setOptions();

    script.doall();

    Core.setOptions(false);
}
