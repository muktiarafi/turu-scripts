/*
name: Doom Vault (A) Story
description: This will finish the Doom Vault (A) Story.
tags: story, quest, doom-vault-a, binky
*/
// Port of Scripts/Story/DoomVault.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class DoomVaultA {
    storyLine(): void {
        if (Core.isCompletedBefore(3008)) {
            return;
        }

        Story.preLoad(this.storyLine);

        Core.acceptandCompleteTries = 1;
        Core.equipClass(ClassType.Farm);

        // The Challenge Begins 2952
        if (!Story.questProgression(2952)) {
            Core.ensureAccept(2952);
            Core.huntMonsterMapID("doomvault", 1, "Soldier Slain", 5);
            Core.ensureComplete(2952);
        }

        // Fight to Survive 2953
        if (!Story.questProgression(2953)) {
            Core.ensureAccept(2953);
            Core.huntMonsterMapID("doomvault", 4, "Fighter Slain", 6);
            Core.ensureComplete(2953);
        }

        // The Battle's Heating Up 2954
        if (!Story.questProgression(2954)) {
            Core.ensureAccept(2954);
            Core.huntMonsterMapID("doomvault", 6, "Mage Slain", 10);
            Core.ensureComplete(2954);
        }

        // A Close Shave 2955
        if (!Story.questProgression(2955)) {
            Core.cutSceneFixer("doomvault", "r8", "initRoom");
            Core.ensureAccept(2955);
            Core.huntMonsterMapID("doomvault", 13, "Shelleton Slain", 8);
            Core.ensureComplete(2955);
        }

        // Eye Spy a Victim 2965
        if (!Story.questProgression(2965)) {
            Core.cutSceneFixer("doomvault", "r10", "initRoom");
            Core.ensureAccept(2965);
            Core.huntMonsterMapID("doomvault", 18, "Spyball Slain", 6);
            Core.ensureComplete(2965);
        }

        // Help Me! 2966
        if (!Story.questProgression(2966)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(2966);
            Core.killMonster("doomvault", "r14", "Left", "*", "Hand of the Princess");
            Core.ensureComplete(2966);
            Core.equipClass(ClassType.Farm);
        }

        // Get Your Hands Dirty 2967
        if (!Story.questProgression(2967)) {
            Core.ensureAccept(2967);
            Core.huntMonsterMapID("doomvault", 22, "Ectomancer Slain", 10);
            Core.ensureComplete(2967);
        }

        // A Rocky Battle 2968
        if (!Story.questProgression(2968)) {
            Core.ensureAccept(2968);
            Core.huntMonsterMapID("doomvault", 25, "Stone Key");
            Core.ensureComplete(2968);
        }

        // Soul-d on Defeat 2969
        if (!Story.questProgression(2969)) {
            Core.ensureAccept(2969);
            Core.huntMonsterMapID("doomvault", 30, "Grim Soul", 50);
            Core.ensureComplete(2969);
        }

        // The Key to Help Me 2970
        if (!Story.questProgression(2970)) {
            Core.ensureAccept(2970);
            Core.huntMonsterMapID("doomvault", 34, "Princess Key");
            Core.ensureComplete(2970);
        }

        // Help Me Again! 2971
        if (!Story.questProgression(2971)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(2971);
            Core.cutSceneFixer("doomvault", "r24", "initRoom");
            Core.huntMonsterMapID("doomvault", 37, "Angler Slain");
            Core.ensureComplete(2971);
            Core.equipClass(ClassType.Farm);
        }

        // Overheated Hero 2974
        if (!Story.questProgression(2974)) {
            Core.ensureAccept(2974);
            Core.huntMonsterMapID("doomvault", 38, "Mage Slain", 5);
            Core.ensureComplete(2974);
        }

        // The Blade-breaker 2981
        if (!Story.questProgression(2981)) {
            Core.ensureAccept(2981);
            Core.huntMonsterMapID("doomvault", 45, "Lich Slain", 3);
            Core.ensureComplete(2981);
        }

        // Anti-Magic Warrior 2982
        if (!Story.questProgression(2982)) {
            Core.ensureAccept(2982);
            Core.huntMonsterMapID("doomvault", 48, "Fighter Slain", 7);
            Core.ensureComplete(2982);
        }

        // Elemental Destroyer 2983
        if (!Story.questProgression(2983)) {
            Core.ensureAccept(2983);
            Core.huntMonsterMapID("doomvault", 51, "Ectomancer Slain", 3);
            Core.ensureComplete(2983);
        }

        // The Unkillable 3006
        if (!Story.questProgression(3006)) {
            Core.ensureAccept(3006);
            Core.huntMonsterMapID("doomvault", 54, "Shelleton Slain", 3);
            Core.ensureComplete(3006);
        }

        // Key to Victory 3007
        if (!Story.questProgression(3007)) {
            Core.ensureAccept(3007);
            Core.huntMonsterMapID("doomvault", 58, "Raxgore's Key");
            Core.ensureComplete(3007);
        }

        // I Command You, Help Me! 3008
        if (!Story.questProgression(3008)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(3008);
            Core.cutSceneFixer("doomvault", "r36", "initRoom");
            Core.huntMonsterMapID("doomvault", 60, "King Slayer");
            Core.ensureComplete(3008);
        }
    }
}

export default function main(): void {
    const script = new DoomVaultA();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
