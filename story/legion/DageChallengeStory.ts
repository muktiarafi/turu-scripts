/*
name: Dage Challenge Story
description: This will finish the Dage Challenge Story quest.
tags: story, quest, legion, dage-challenge-story
*/
// Port of Scripts/Story/Legion/DageChallengeStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { CoreLegion } from "../../legion/CoreLegion";
import { HeadoftheLegionBeast } from "../../legion/HeadOfTheLegionBeast";

const Story = new CoreStory();
const Legion = new CoreLegion();
const HOTLB = new HeadoftheLegionBeast();

export class DageChallengeStory {
    dageChallengeQuests(): void {
        if (Core.isCompletedBefore(8546)) {
            return;
        }

        Story.preLoad(this.dageChallengeQuests);

        Core.addDrop("Underworld Medal", "Underworld Laurel", "Underworld Accolade");

        if (!Story.questProgression(8544)) {
            Core.equipClass(ClassType.Solo);
            //Training with Dage
            Core.ensureAccept(8544);
            Core.huntMonster("Dage", "Dage the Evil", "Dage Dueled", undefined, { publicRoom: true });
            Core.ensureComplete(8544);
            bot.wait.forPickup("Underworld Laurel");
        }

        if (!Story.questProgression(8545)) {
            Core.addDrop("Underworld Medal", "Souls of Heresy", "Dage's Favor");
            Core.equipClass(ClassType.Farm);

            //Darkness for Darkness'Sake
            Core.ensureAccept(8545);
            if (!Core.checkInventory("Dage's Favor", 200)) {
                Core.huntMonster("underworld", "Dark Makai", "Dage's Favor", 200, { isTemp: false });
            }
            Legion.obsidianRock(10);

            HOTLB.soulsHeresy(30);
            Core.ensureComplete(8545);
            bot.wait.forPickup("Underworld Medal");
        }

        if (!Story.questProgression(8546)) {
            //Power of the Undead Legion
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(8546);
            Core.huntMonster("legionarena", "Legion Fiend Rider", "Fiend Rider's Approval");
            Core.huntMonster("frozenlair", "Lich Lord", "Lich Lord's Approval");
            Core.huntMonster("dagefortress", "Grrrberus", "Grrrberus's Grr Grrr");
            Core.ensureComplete(8546);
            bot.wait.forPickup("Underworld Accolade");
        }
    }
}

export default function main(): void {
    const script = new DageChallengeStory();
    Core.setOptions();

    script.dageChallengeQuests();

    Core.setOptions(false);
}
