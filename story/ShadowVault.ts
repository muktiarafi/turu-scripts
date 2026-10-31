/*
name: Shadow Vault Story
description: This will finish the Shadow Vault Story.
tags: story, quest, shadow-vault
*/
// Port of Scripts/Story/ShadowVault.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class ShadowVault {
    storyLine(): void {
        if (Core.isCompletedBefore(6794)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Find the Ruins 6781
        Story.mapItemQuest(6781, "ShadowVault", 6310);

        //Calm the Shadows 6782
        Story.killQuest(6782, "ShadowVault", "Fallen Adventurer");

        //A Clue! A Clue! 6783
        if (!Story.questProgression(6783)) {
            Core.ensureAccept(6783);
            Core.huntMonster("shadowvault", "Shadowscythe Minion", 'Aliens "Talked" With', 8);
            Core.huntMonster("shadowvault", "Fallen Adventurer", "A Clue", 1);
            Core.ensureComplete(6783);
        }

        //Un-Cloaky! 6784
        if (!Story.questProgression(6784)) {
            Core.ensureAccept(6784);
            Core.getMapItem(6311, 1, "ShadowVault");
            Core.killMonster("shadowvault", "r3a", "Left", "Shadowscythe Guard", "Shadowscythe Guard Slain");
            Story.killQuest(6784, "ShadowVault", "Shadowscythe Guard");
            Core.ensureComplete(6784);
        }

        //Bound Seams Hide a Key 6787
        Story.mapItemQuest(6787, "ShadowVault", 6312);

        //Hole in the Wall 6788
        if (!Story.questProgression(6788)) {
            Core.ensureAccept(6788);
            Core.getMapItem(6313, 1, "ShadowVault");
            Core.huntMonster("shadowvault", "Spiderscythe", "Spider Smashed", 5);
            Core.huntMonster("shadowvault", "Shadowscythe Minion", "Minion Gored", 5);
            Core.ensureComplete(6788);
        }

        //An Actual Skeleton... key? 6789
        if (!Story.questProgression(6789)) {
            Core.ensureAccept(6789);
            Core.huntMonster("shadowvault", "Fallen Adventurer", "Random Bones", 7);
            Core.huntMonster("shadowvault", "Spiderscythe", "Webbing", 5);
            Core.huntMonster("shadowvault", "Shadowscythe Minion", "Super Hard Claw", 1);
            Core.ensureComplete(6789);
        }

        //Open Sesame 6790
        if (!Story.questProgression(6790)) {
            Core.ensureAccept(6790);
            Core.getMapItem(6314, 1, "ShadowVault");
            Core.huntMonster("shadowvault", "Shadowstryke", "Stryke Squashed", 6);
            Core.ensureComplete(6790);
        }

        //Magic the Door Open 6791
        if (!Story.questProgression(6791)) {
            Core.ensureAccept(6791);
            Core.getMapItem(6315, 5, "ShadowVault");
            Core.huntMonster("shadowvault", "Darkness", "Dark Magic", 8);
            Core.ensureComplete(6791);
        }

        //Un-Stucky! 6792
        Story.mapItemQuest(6792, "ShadowVault", 6316);

        //BOSS FIGHT! 6793
        Story.killQuest(6793, "ShadowVault", "Ancient Doomknight");

        //… Did we forget some guards? 6794
        if (!Story.questProgression(6794)) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAccept(6794);
            Core.huntMonsterMapID("ShadowVault", 22, "Guard Slain", 100);
            Core.ensureComplete(6794);
            Core.jumpWait();
        }
    }
}

export default function main(): void {
    const script = new ShadowVault();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
