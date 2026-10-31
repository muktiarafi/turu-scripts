/*
name: ConZombieSlayer
description: null
tags: null
*/
// Port of Scripts/Other/Badges/ConZombieSlayer.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class ConZombieSlayer {
    badge(): void {
        if (Core.hasAchievement(74)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing Artix quest for ${this.badgeName} badge`);

        Core.equipClass(ClassType.Farm);

        //I Guess We DO Need Steenkin' Badges 3135
        Story.killQuest(3135, "vendorbooths", "Ravin' Skelly");

        //Con Kit 3136
        if (!Story.questProgression(3136)) {
            Core.ensureAccept(3136);
            Core.huntMonster("battlecon", "Cosplay Zombie", "Con Survival Guide", undefined, { log: false });
            Core.huntMonster("battlecon", "Cosplay Zombie", "Water Bottle", undefined, { log: false });
            Core.huntMonster("battlecon", "Cosplay Zombie", "Hoopy Frood brand Towel", undefined, { log: false });
            Core.huntMonster("battlecon", "Cosplay Zombie", "Event Schedule", undefined, { log: false });
            Core.huntMonster("battlecon", "Cosplay Zombie", "Xtra-Strength Energy Potion", undefined, { log: false });
            Core.huntMonster("battlecon", "Cosplay Zombie", "Anti-Con Rot Sanitation Device", undefined, {
                log: false,
            });
            Core.ensureComplete(3136);
        }

        Core.equipClass(ClassType.Solo);
        //BrutalCorn Barrier 3137
        Story.killQuest(3137, "battlecon", "BrutalCorn");

        // Badge Signing 3138
        Story.mapItemQuest(3138, "battlecon", Core.fromTo(2129, 2138));

        // 3139 does *not* exist

        Core.equipClass(ClassType.Farm);
        // Con Rot 3140 - not required?
        // Story.KillQuest(3140, "vendorbooths", "Con Rot");

        // // Buzz-Killer: Caffeine Overload
        // Story.KillQuest(3141, "vendorbooths", "Caffeine Imp");

        // Core.Logger("3140 - 3141 appaerntly.. dont need done?");

        // Lights Out for Ravers 3142
        Story.killQuest(3141, "artistalley", "Ravin' Skelly");

        if (Core.isMember) {
            Story.killQuest(3143, "artistalley", "Battle Odor");
        }

        //Badge Quest - Cosplay Zombies On Parade 3144
        Core.ensureAccept(3144);
        while (!bot.shouldExit && !Core.hasAchievement(74)) {
            if (bot.map.name !== "battlecon") {
                Core.join("battlecon");
            }
            if (bot.player.cell !== "a2") {
                Core.jump("a2", "left");
            }

            bot.combat.attack("*");
            Core.sleep();
        }
        Core.abandonQuest(3144);
    }

    private readonly badgeName = "ConZombie Slayer";
}

export default function main(): void {
    const script = new ConZombieSlayer();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
