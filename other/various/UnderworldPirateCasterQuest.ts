/*
name: UnderworldPirateCasterQuest
description: null
tags: null
*/
// Port of Scripts/Other/Various/UnderworldPirateCasterQuest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class UnderWorldPirateCasterQuset {
    questFarming(): void {
        if (Core.checkInventory("Underworld Pirate Caster's Pet")) {
            Core.logger("You Don't Have \"Underworld Pirate Caster's Pet\". Pet is required for doing the quests.");
            return;
        }

        const Rewards = Core.ensureLoad(7086).rewards.map((i) => i.name);
        Core.addDrop(...Rewards);

        while (!bot.shouldExit && !Core.checkInventory(Rewards, undefined, { toInv: false })) {
            //Underworld Pirate Caster's Pet Chest 7086
            Core.ensureAccept(7086);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("styx", "Cerberus", "Cerberus Conquered");
            Core.ensureComplete(7086);
        }
        Core.toBank(...Rewards);
    }
}

export default function main(): void {
    const script = new UnderWorldPirateCasterQuset();
    Core.setOptions();

    script.questFarming();

    Core.setOptions(false);
}
