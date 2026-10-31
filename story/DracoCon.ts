/*
name: Draco Con Story
description: This will finish the Draco Con story.
tags: story, quest, dracocon, draco, con
*/
// Port of Scripts/Story/DracoCon.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class DracoCon {
    storyLine(): void {
        if (Core.isCompletedBefore(5372)) {
            return;
        }

        Story.preLoad(this.storyLine);

        Core.equipClass(ClassType.Farm);

        // Zorbak's Legion: Chapter 1 (5357)
        if (!Story.questProgression(5357)) {
            Core.ensureAccept(5357);
            Core.huntMonster("dracocon", "Zombie Tog", "Zombie Tog Slain", 7);
            Core.huntMonster("dracocon", "Zombie Dravir", "Zombie Dravir Slain", 6);
            Core.ensureComplete(5357);
        }

        // Zorbak's Legion: Eggstreme Plan (5358)
        Story.killQuest(5358, "dracocon", "Zombie Dravir");

        // Zorbak's Legion: Drac Attack (5359)
        if (!Story.questProgression(5359)) {
            Core.ensureAccept(5359);
            Core.huntMonster("dracocon", "Red Spirit", "Angry Spirit", 5);
            Core.huntMonster("dracocon", "Angry Wisp", "Kill O' Whisp", 5);
            Core.ensureComplete(5359);
        }

        // Zorbak's Legion: Undead vs Undead (5360)
        if (!Story.questProgression(5360)) {
            Core.ensureAccept(5360);
            Core.huntMonster("dracocon", "Undead Soldier", "Undead Soldier Slain", 5);
            Core.huntMonster("dracocon", "Zombie Warrior", "Zombie Warrior Slain", 5);
            Core.ensureComplete(5360);
        }

        // Zorbak's Legion: Tiny Terrors (5361)
        if (!Story.questProgression(5361)) {
            Core.ensureAccept(5361);
            Core.getMapItem(4723, 5, "dracocon");
            Core.huntMonster("dracocon", "Villager", "Villager Convinced", 10);
            Core.ensureComplete(5361);
        }

        // Eggcelent Hunt (5362)
        Story.mapItemQuest(5362, "dracocon", 4724, 13);

        // "Fresh" Dragon Chow (5363)
        Story.killQuest(5363, "dracocon", "Zombie Warrior");

        // Bling, Baby, Bling (5364)
        if (!Story.questProgression(5364)) {
            Core.ensureAccept(5364);
            Core.getMapItem(4725, 5, "dracocon");
            Core.huntMonster("dracocon", "Battle Gem", "Battle Gems", 10);
            Core.ensureComplete(5364);
        }

        // Class 101: Slaying for Dummies (5365)
        Story.killQuest(5365, "dracocon", "Dragon Training Dummy");

        // Class 102: Breath of Fresh Fire (5366)
        Story.killQuest(5366, "dracocon", "Angry Wisp");

        // Class 103: Tog Eat Tog World (5367)
        Story.killQuest(5367, "dracocon", "Zombie Tog");

        // Final Exam Demonstration (5368)
        if (!Story.questProgression(5368)) {
            Core.equipClass(ClassType.Solo);
            Story.killQuest(5368, "dracocon", "Strong Drag");
            Core.equipClass(ClassType.Farm);
        }

        // Smack The Sheep! (5369)
        Story.mapItemQuest(5369, "dracocon", 4726);

        // Hear No Evil (5370)
        Story.mapItemQuest(5370, "dracocon", 4727, 4);

        // Safe and (No) Sound (5371)
        Story.mapItemQuest(5371, "dracocon", 4728, 6);

        // Through the Fire and Bones (5372)
        if (!Story.questProgression(5372)) {
            Core.equipClass(ClassType.Solo);
            if (!Story.questProgression(5372)) {
                Core.ensureAccept(5372);
                Core.huntMonster("dracocon", "Drummer", "Drummer Defeated", 1);
                Core.huntMonster("dracocon", "Guitarist", "Guitarist Defeated", 1);
                Core.huntMonster("dracocon", "Keyboardist", "Keyboard Player Defeated", 1);
                Core.huntMonster("dracocon", "Singer", "Singer Defeated", 1);
                Core.ensureComplete(5372);
            }
            Core.equipClass(ClassType.Farm);
        }
    }
}

export default function main(): void {
    const script = new DracoCon();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
