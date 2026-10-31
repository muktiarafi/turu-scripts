/*
name: Grim Necromancer Class (600k AC)
description: This script will get Grim Necromancer class which requires 600k ACs badge.
tags: 600k, grimnecromancer, grim necromancer, grimtea, grim tea, class
*/
// Port of Scripts/Other/Classes/GrimNecromancer[600kAC].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();
const Adv = new CoreAdvanced();

export class GrimNecromancer {
    getGN(rankUpClass = true): void {
        if (Core.checkInventory(45848)) {
            return;
        }

        if (!Core.hasAchievement(29, "ip14")) {
            Core.logger("This class requires you to have 600,000 ACs badge.");
            return;
        }

        Adv.buyItem("whitemap", 1649, "Grim Necromancer");

        // The Guest List (6924)
        if (!Story.questProgression(6924)) {
            Core.ensureAccept(6924);
            Core.huntMonster("bonecastle", "Vaden", "Vaden Invited");
            Core.huntMonster("graveyard", "Big Jack Sprat", "Big Jack Sprat Invited");
            Core.huntMonster("thespan", "Moglin Ghost", "Moglin Ghost Invited");
            Core.ensureComplete(6924);
        }

        // Sugar, Spice and everything Nice (6925)
        if (!Story.questProgression(6925)) {
            Core.ensureAccept(6925);
            Adv.buyItem("sandsea", 245, "Cuppycake", 25);
            Adv.buyItem("vendorbooths", 659, "Strawberry Frog Cookie");
            Core.huntMonster("baconcatlair", "Ice Cream Shark", "Ice Cream Shark Defeated", 5);
            Core.ensureComplete(6925);
        }

        // Big Mean Meanie Pants (6926)
        Story.killQuest(6926, "vordredboss", "Vordred");

        // One Small Step (6927)
        if (!Story.questProgression(6927)) {
            Core.ensureAccept(6927);

            Core.addDrop(45848, 48785);
            Core.equipClass(ClassType.Farm);

            Core.registerQuests(6928);
            while (!bot.shouldExit && !Core.checkInventory(48785, 50)) {
                Core.huntMonster("citadel", "Grizzly Bear", "Grizzly Bear Captured", 3);
                Core.huntMonster("battlegroundb", "Polar Bear", "Polar Bear Captured", 3);
                Core.huntMonster("huntersmoon", "Eclipsed One", "Eclipsed One Captured", 3);
                bot.wait.forPickup(48785);
            }
            Core.cancelRegisteredQuests();

            Core.ensureComplete(6927);
        }

        if (rankUpClass) {
            Adv.rankUpClass("Grim Necromancer");
        }
    }
}

export default function main(): void {
    const script = new GrimNecromancer();
    Core.setOptions();

    script.getGN();

    Core.setOptions(false);
}
