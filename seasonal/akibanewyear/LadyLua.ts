/*
name: Lady Lua's Quests
description: Completes Lady Lua's quests in akibacny
tags: yokai, seasonal, akiba new year, akibacny, story
*/
// Port of Scripts/Seasonal/AkibaNewYear/LadyLua.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class LadyLua {
    storyline(): void {
        if (Core.isCompletedBefore(8505) || !Core.isSeasonalMapActive("akibacny")) {
            return;
        }

        Story.preLoad(this.storyline);

        //Earning Your Stripes (8498)
        if (!Story.questProgression(8498)) {
            Core.ensureAccept(8498);
            Core.huntMonster("ravenloss", "Evolved Dreadspider", "High-Quality Silk", 10);
            Core.huntMonster("ravenloss", "ChaosWeaver Magi", "Orange and Black Dye", 6);
            Core.huntMonster("ravenloss", "Underbeast", "Blue and White Dye", 6);
            Core.ensureComplete(8498);
        }

        //A New Year in Bloom (8499)
        Story.killQuest(8499, "akibacny", ["Bamboo Treeant", "Lingzhi", "Xingzhi"]);

        //The Eye(s) of the Tiger (8500)
        if (!Story.questProgression(8500)) {
            Core.ensureAccept(8500);
            Core.huntMonster("mobius", "Chaos Sp-Eye", "Chaos Eyeball", 5, { log: false });
            Core.huntMonster("ebonslate", "Sp-Eye", "Evil Eyeball", 5, { log: false });
            Core.huntMonster("deathgazer", "Deathgazer", "Deadly Eyeball", 2, { log: false });
            Core.huntMonster("battlewedding", "Jimmy the Eye Heart", "Heartbreaking Eyeball", undefined, {
                log: false,
            });
            Core.ensureComplete(8500);
        }

        //A Royal Feast (8501)
        Core.equipClass(ClassType.Solo);
        Story.killQuest(8501, "akibacny", ["Lu Niu", "Honorable Boar", "Hinezumi"]);

        //Winning Streak (8502)
        Core.equipClass(ClassType.Farm);
        if (!Story.questProgression(8502)) {
            Core.ensureAccept(8502);
            Core.huntMonster("creatures", "White Tiger", "Bright as a White Tiger", 4, { log: false });
            Core.huntMonster("phoenixrise", "Cinderclaw", "Superior to Cinderclaw", 2, { log: false });
            Core.huntMonster("fireplanewar", "ShadowClaw", "Overshadowed Shadowclaw", undefined, { log: false });
            Core.huntMonster("phoenixrise", "Firestorm Tiger", "Blazed Through Underlings", 12, { log: false });
            Core.ensureComplete(8502);
        }

        //Yin and Yang (8503)
        if (!Story.questProgression(8503)) {
            Core.ensureAccept(8503);
            Core.huntMonster("shadowfortress", "6th Head of Orochi", "Sixth Head Slaughtered", 1);
            Core.huntMonster("shadowfortress", "1st Head of Orochi", "First Head Finished", 1);
            Core.huntMonster("shadowfortress", "2nd Head of Orochi", "Second Head Smashed", 1);
            Core.huntMonster("shadowfortress", "3rd Head of Orochi", "Third Head Thrashed", 1);
            Core.huntMonster("shadowfortress", "4th Head of Orochi", "Fourth Head Flattened", 1);
            Core.huntMonster("shadowfortress", "5th Head of Orochi", "Fifth Head Floored", 1);
            Core.ensureComplete(8503);
        }

        //Tyger, Tyger, Burning Bright (8504)
        Story.killQuest(8504, "akibacny", ["Fiery Lantern", "Lin Kuei"]);

        //Tame That Tiger! (8505)
        Core.equipClass(ClassType.Solo);
        Story.killQuest(8505, "akibacny", "Umitora");
    }
}

export default function main(): void {
    const script = new LadyLua();
    Core.setOptions();

    script.storyline();
    Core.setOptions(false);
}
