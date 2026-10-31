/*
name: Doom Vault (B) Story
description: This will finish the Doom Vault (B) Story.
tags: story, quest, doom-vault-b, undead, raxgore, undead raxgore
*/
// Port of Scripts/Story/DoomVaultB.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";
import { DoomVaultA } from "./DoomVault";

const Story = new CoreStory();
const doomVaultA = new DoomVaultA();

export class DoomVaultB {
    storyLine(): void {
        doomVaultA.storyLine();

        if (Core.isCompletedBefore(3004)) {
            return;
        }

        Story.preLoad(this.storyLine);

        Core.acceptandCompleteTries = 1;

        // Grim Underdungeon I 2972
        Story.killQuest(2972, "doomvaultb", "Grimmer Soldier");

        // Grim Underdungeon II 2973
        Story.killQuest(2973, "doomvaultb", "Grimmer Fighter");

        // Grim Underdungeon III 2975
        Story.killQuest(2975, "doomvaultb", "Grimmer Lich");

        // Grim Underdungeon IV 2976
        Story.killQuest(2976, "doomvaultb", "Weeping Spyball");

        // Grim Underdungeon V 2977
        Story.killQuest(2977, "doomvaultb", "Grimmer Ectomancer");

        // Grim Underdungeon VI 2978
        Story.killQuest(2978, "doomvaultb", "Grimmer Shelleton");

        // Grim Underdungeon VII 2979
        Story.killQuest(2979, "doomvaultb", "Grimmer Fighter");

        // Grim Underdungeon VIII 2980
        Story.killQuest(2980, "doomvaultb", "Grimmer Fire Mage");

        // Grim Underdungeon IX 2984
        Story.killQuest(2984, "doomvaultb", "Grimmer Lich");

        // Grim Underdungeon X 2985
        Story.killQuest(2985, "doomvaultb", "Weeping Spyball");

        // Grim Underdungeon XI 2986
        Story.killQuest(2986, "doomvaultb", "Grimmer Fighter");

        // Grim Underdungeon XII 2987
        Story.killQuest(2987, "doomvaultb", "Grimmer Lich");

        // Grim Underdungeon XIII 2988
        Story.killQuest(2988, "doomvaultb", "Grimmer Fighter");

        // Grim Underdungeon XIV 2989
        Story.killQuest(2989, "doomvaultb", "Weeping Spyball");

        // Grim Underdungeon XV 2990
        Story.chainQuest(2990);

        // Grim Underdungeon XVI 2991
        Story.killQuest(2991, "doomvaultb", "Grimmer Shelleton");

        // Grim Underdungeon XVII 2992
        Story.killQuest(2992, "doomvaultb", "Grimmer Soldier");

        // Grim Underdungeon XVIII 2993
        Story.killQuest(2993, "doomvaultb", "Grimmer Lich");

        // Grim Underdungeon XIX 2994
        Story.killQuest(2994, "doomvaultb", "Grimmer Lich");

        // Grim Underdungeon XX 2995
        Story.chainQuest(2995);

        // Grim Underdungeon XXI 2996
        Story.killQuest(2996, "doomvaultb", "Grimmer Fire Mage");

        // Grim Underdungeon XXII 2997
        Story.killQuest(2997, "doomvaultb", "Grimmer Fighter");

        // Grim Underdungeon XXIII 2998
        Story.killQuest(2998, "doomvaultb", "Grimmer Ectomancer");

        // Grim Underdungeon XXIV 2999
        Story.killQuest(2999, "doomvaultb", "Grimmer Soldier");

        // Grim Underdungeon XXV 3000
        Story.chainQuest(3000);

        // Grim Underdungeon XXIX 3004
        if (!Story.questProgression(3004)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(3004);
            Core.killMonster("doomvaultb", "r26", "Left", "Undead Raxgore", "Raxgore Slain", undefined, {
                publicRoom: false,
            });
            Core.ensureComplete(3004);
        }
    }

    /*
    //will probably be needing this in the future...
    void InitFix(string cell, string pad = "Left")
    {
        Core.Sleep(2500);
        if (Bot.Player.Cell != "init")
            return;

        Core.Logger("looks like the cutscene broke again, initiating cell fix");
        if (Bot.Map.Name != "doomvault")
            Core.Join("doomvaultb", cell, pad);
        while (!Bot.ShouldExit && Bot.Player.Cell != cell)
        {
            Core.Jump(cell);
            Core.Sleep();
        }
        Core.Logger($"{Bot.Player.Cell} Fixed.");
    }
    */
}

export default function main(): void {
    const script = new DoomVaultB();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
