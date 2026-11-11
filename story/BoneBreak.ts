/*
name: Bone Break Story
description: This will complete the Bone Break Story.
tags: story, quest, bone-break
*/
// Port of Scripts/Story/BoneBreak.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class BoneBreak {
    storyLine(): void {
        if (Core.isCompletedBefore(5981)) {
            return;
        }

        if (!Core.hasAchievement(30, "ip6") && !Core.isMember) {
            Core.logger(
                '"BoneBreak" map requires you to have membership or purchased BoneBreaker Adventure Pack to be able to access it.',
            );
            return;
        }
        if (Core.hasAchievement(30, "ip6")) {
            Core.buyItem("battleon", 1046, "BoneBreaker Fortress Map");
        }

        Story.preLoad(this.storyLine);

        //Bracken, Bone, and Branch 3892
        if (!Story.questProgression(3892)) {
            Core.ensureAccept(3892);
            Core.huntMonster("bonebreak", "Bone Leech", "Venomous Leech Fang", 3);
            Core.huntMonster("bonebreak", "Marsh Treeant", "Dread Tree Branch", 6);
            Core.huntMonster("bonebreak", "Marsh Thing", "Marsh Weed", 12);
            Core.ensureComplete(3892);
        }

        //Break Braddok’s Backbone 3893
        Story.killQuest(3893, "bonebreak", "Undead Berserker");

        //Stone of Binding 3894
        Story.mapItemQuest(3894, "bonebreak", 2990, 13);
        Story.killQuest(3894, "bonebreak", "Kidnapped Prisoner");

        //Break the Bone Fortress 3895
        if (!Story.questProgression(3895)) {
            Core.ensureAccept(3895);
            Core.huntMonster("bonebreak", "Unbroken Minion", "Unbroken Minion Defeated", 10);
            Core.huntMonster("bonebreak", "Undead Berserker", "Berserker Warrior Defeated", 10);
            Core.huntMonster("bonebreak", "Bone Leech", "Bone Leech Defeated", 5);
            Core.ensureComplete(3895);
        }

        //It’s a TRAP! (No, really.) 3896
        Story.killQuest(3896, "bonebreak", "Undead Berserker");

        //Defeat Braddock Bonebreaker  3897
        Story.killQuest(3897, "bonebreak", "Bonebreaker");

        //Hunt for Killek 5977
        Story.mapItemQuest(5977, "bonebreak", 5418);

        //Chew the Dead 5978
        if (!Story.questProgression(5978)) {
            Core.ensureAccept(5978);
            Core.huntMonster("bonebreak", "Undead Berserker", "Rotten Flesh", 7);
            Core.huntMonster("bonebreak", "Bone Leech", "Old Bone", 7);
            Core.ensureComplete(5978);
        }

        //Marsh Mash Pit 5979
        Story.killQuest(5979, "bonebreak", "Marsh Thing");

        //Ash Me No Questions 5980
        Story.killQuest(5980, "bonebreak", "Kidnapped Prisoner");

        //Defeat Killek Bonebreaker 5981
        Story.killQuest(5981, "bonebreak", "Killek BoneBreaker");
    }
}

export default function main(): void {
    const script = new BoneBreak();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
