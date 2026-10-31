/*
name: Vasalkar Lair War Story
description: This will finish the Vasalkar Lair War Story.
tags: story, quest, vasalkar, lair, war
*/
// Port of Scripts/Story/VasalkarLairWar.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class LairWar {
    doAll(): void {
        if (Core.isCompletedBefore(6689) && Core.isCompletedBefore(6694)) {
            return;
        }

        this.defend();
        this.attack();
    }

    defend(): void {
        if (Core.isCompletedBefore(6689)) {
            return;
        }

        Story.preLoad(this.defend);

        //6685 | Flamefang Medals
        Core.registerQuests(6685, 6686);
        if (!Story.questProgression(6685, { getReward: false })) {
            Core.killMonster("lairdefend", "Bridge", "LeftUp", "*", "Flamefang Medal", 3);
            bot.wait.forQuestComplete(6685);
        }
        Core.cancelRegisteredQuests();

        //6686 | Mega Flamefang Medals
        //Can be skipped, has the same quest value

        //6687 | SoulSucking Enemy
        Story.killQuest(6687, "lairdefend", "Soul Wyvern", { getReward: false });

        // 6688 | The Dragon Summoner
        if (!Story.questProgression(6688, { getReward: false })) {
            Core.ensureAccept(6688);
            Core.huntMonster("lairdefend", "Dragon Summoner", "Dragon Claw", 3, { isTemp: true });
            Core.ensureComplete(6688);
        }

        //6689 | The Flame Dragon
        Story.killQuest(6689, "lairdefend", "Flame Dragon General", { getReward: false });

        Core.cancelRegisteredQuests();
    }

    attack(): void {
        if (Core.isCompletedBefore(6694)) {
            return;
        }

        Story.preLoad(this.attack);

        //6690 | Defender Medals
        Core.registerQuests(6690, 6691);
        if (!Story.questProgression(6690, { getReward: false })) {
            Core.killMonster("lairattack", "Bridge", "LeftUp", "*", "Defender Medal", 3);
            bot.wait.forQuestComplete(6690);
        }
        Core.cancelRegisteredQuests();

        //6691 | Mega Defender Medals
        //Can be skipped, has the same quest value

        //6692 | Magic and Mayhem
        Story.killQuest(6692, "lairattack", "Dracomancer", { getReward: false });

        //6693 | The Dragon Defender
        Story.killQuest(6693, "lairattack", "Dragon Defender", { getReward: false });

        //6694 | The Flame Dragon
        Story.killQuest(6694, "lairattack", "Flame Dragon General", { getReward: false });

        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new LairWar();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
