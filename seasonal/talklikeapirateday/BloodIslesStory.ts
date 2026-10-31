/*
name: Blood Isles Story
description: This will finish the Blood Isles story.
tags: BLood, isles, Blood Isles, story, tlapd
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/BloodIslesStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class BloodIsles {
    doStory(): void {
        //#region Useable Monsters
        const UseableMonsters = [
            "Blood Moon Pirate", // UseableMonsters[0],
            "Drowned Werewolf", // UseableMonsters[1],
            "Vampiric Lamprey", // UseableMonsters[2],
            "Drowned Vampire", // UseableMonsters[3],
            "Blood Veil Pirate", // UseableMonsters[4],
            "Drowned Horde", // UseableMonsters[5],
            "Bloodthirsty Bonnie", // UseableMonsters[6],
            "Sea King Kurok", // UseableMonsters[7],
            "Merpyre", // UseableMonsters[8]
            "Feral Flintfang", // UseableMonsters[9]
        ];
        //#endregion Useable Monsters
        if (Core.isCompletedBefore(9885) || !Core.isSeasonalMapActive("piratebloodhub")) {
            return;
        }

        Story.preLoad(this.doStory);

        //#region piratevampire
        Core.equipClass(ClassType.Farm);
        if (!bot.quests.isUnlocked(9870)) {
            Core.ensureAccept(9868);
            Core.killMonster("piratevampire", "r2", "left", "*", "Vampire Pirate Medal", 5);
            Core.ensureComplete(9868);
        }

        // 9870 | Siren's Pack
        Story.killQuest(9870, "piratevampire", UseableMonsters[1]);

        // 9871 | Bitterfang
        Core.equipClass(ClassType.Solo);
        Story.killQuest(9871, "piratevampire", UseableMonsters[9], { autoCompleteQuest: false });
        //#endregion
        //#region BloodIsles
        Core.equipClass(ClassType.Farm);
        // 9876 | Faceless Moon
        Story.killQuest(9876, "bloodisles", UseableMonsters[0]);

        // 9877 | Apex Prey
        Story.killQuest(9877, "bloodisles", UseableMonsters[1]);

        // 9878 | False Triton
        if (!Story.questProgression(9878)) {
            Core.ensureAccept(9878);
            Core.getMapItem(13655, 1, "bloodisles");
            Core.huntMonster("bloodisles", "Vampiric Lamprey", "Lamprey Fang", 12);
            Core.ensureComplete(9878);
        }

        // 9879 | Blood Moonglade
        Story.killQuest(9879, "bloodisles", UseableMonsters[3]);

        // 9880 | Aye Eye
        if (!Story.questProgression(9880)) {
            Core.ensureAccept(9880);
            Core.getMapItem(13656, 1, "bloodisles");
            Core.huntMonster("bloodisles", "Blood Veil Pirate", "Bloodshot Eye", 6);
            Core.ensureComplete(9880);
        }

        // 9881 | Fang Profile
        if (!Story.questProgression(9881)) {
            Core.ensureAccept(9881);
            Core.getMapItem(13657, 1, "bloodisles");
            Core.huntMonster("bloodisles", "Drowned Horde", "Horde's Gold Ring", 6);
            Core.ensureComplete(9881);
        }

        // 9882 | Necro-Putrefaction
        Story.killQuest(9882, "bloodisles", [UseableMonsters[2], UseableMonsters[5]]);

        Core.equipClass(ClassType.Solo);
        // 9883 | Counterpirate
        Story.killQuest(9883, "bloodisles", UseableMonsters[6], { autoCompleteQuest: false });

        // 9884 | Abyssal Alpha
        Story.killQuest(9884, "bloodisles", UseableMonsters[7], { autoCompleteQuest: false });

        // 9885 | Nyx Oceana
        Story.killQuest(9885, "bloodisles", UseableMonsters[8], { autoCompleteQuest: false });

        //#endregion
    }
}

export default function main(): void {
    const script = new BloodIsles();
    Core.setOptions();

    script.doStory();

    Core.setOptions(false);
}
