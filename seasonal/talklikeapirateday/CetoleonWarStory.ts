/*
name: Cetoleon War Story
description: This will finish the Cetoleon War Story Line.
tags: story, quest, cetoleon, war, pirate
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/CetoleonWarStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { HeartOfTheSeaStory } from "./HeartOfTheSeaStory";

const Story = new CoreStory();
const heartOfTheSeaStory = new HeartOfTheSeaStory();

export class CetoleonWarStory {
    allLoot: string[] = [
        "Skull-n-Bones Bandana",
        "Supernatural Skull Bandana",
        "Vampire Commander's Backblades",
        "Grislyfang Pirate's Tools",
        "Forgotten Cutlass",
        "Vampire Commander's Top Hat",
        "Vampire Commander's Top Hat + Locks",
        "Shaggy Vampire Commander's Top Hat",
        "Shaggy Vampire Commander's Top Hat + Locks",
        "Dual Forgotten Cutlasses",
        "Golden Naval Commander Hook",
        "Arachnid Commander's Sword",
        "Shipwrecked Captain's Rune",
        "Vampire Commander's Black Cutlass",
        "Golden Pirate Monkey",
        "Wrapped Captain's Tricorn",
        "Wrapped Captain's Tricorn + Locks",
        "Guncraft Commander's Hair",
        "Guncraft Commander's Locks",
        "Guncraft Commander's Flintlock",
        "Golden Commander's Rapier",
        "Golden Commander's Bandana",
        "Golden Commander's Back Cutlass",
        "Golden Commander's Cutlass",
        "Golden Commander's Reavers",
        "Skull-n-Ghostbones Flag",
        "Vampire Commander's Shaggy Hair",
        "Vampire Commander's Shaggy Locks",
    ];

    grislyFangLoot: string[] = [
        "Skull-n-Bones Bandana",
        "Supernatural Skull Bandana",
        "Vampire Commander's Backblades",
        "Grislyfang Pirate's Tools",
    ];
    wreckersLoot: string[] = [
        "Forgotten Cutlass",
        "Vampire Commander's Top Hat",
        "Vampire Commander's Top Hat + Locks",
        "Shaggy Vampire Commander's Top Hat",
        "Shaggy Vampire Commander's Top Hat + Locks",
    ];
    engineersLoot: string[] = [
        "Dual Forgotten Cutlasses",
        "Golden Naval Commander Hook",
        "Arachnid Commander's Sword",
        "Shipwrecked Captain's Rune",
    ];
    gunPowderLoot: string[] = [
        "Vampire Commander's Black Cutlass",
        "Golden Pirate Monkey",
        "Wrapped Captain's Tricorn",
        "Wrapped Captain's Tricorn + Locks",
    ];
    sawLoot: string[] = [
        "Guncraft Commander's Hair",
        "Guncraft Commander's Locks",
        "Guncraft Commander's Flintlock",
        "Golden Commander's Rapier",
    ];
    tentaclesLoot: string[] = [
        "Golden Commander's Bandana",
        "Golden Commander's Back Cutlass",
        "Golden Commander's Cutlass",
        "Golden Commander's Reavers",
    ];
    roachesLoot: string[] = [
        "Skull-n-Ghostbones Flag",
        "Vampire Commander's Shaggy Hair",
        "Vampire Commander's Shaggy Locks",
    ];

    cetoleonWar(): void {
        const Grislyfang = (): void => {
            //Grislyfang Doubloons 6523
            Core.addDrop(...this.grislyFangLoot);
            Core.equipClass(ClassType.Farm);
            Core.registerQuests(6523, 6524);
            while (!bot.shouldExit && !Core.checkInventory(this.grislyFangLoot, undefined, { toInv: false })) {
                Core.huntMonster("CetoleonWar", "Grislyfang Wrecker", "Grislyfang Doubloon", 5, { log: false });
            }
            Core.cancelRegisteredQuests();
            Core.toBank(...this.grislyFangLoot);
        };
        const Wreckers = (): void => {
            //Stop the Wreckers, Fix the Ship 6524
            Core.addDrop(...this.wreckersLoot);
            Core.equipClass(ClassType.Farm);
            Core.registerQuests(6524);
            while (!bot.shouldExit && !Core.checkInventory(this.wreckersLoot, undefined, { toInv: false })) {
                Core.huntMonster("CetoleonWar", "Grislyfang Wrecker", "Hammer", undefined, { log: false });
                Core.huntMonster("CetoleonWar", "Grislyfang Wrecker", "Plank", 5, { log: false });
                Core.huntMonster("CetoleonWar", "Grislyfang Wrecker", "Nails", 25, { log: false });
            }
            Core.cancelRegisteredQuests();
            Core.toBank(...this.wreckersLoot);
        };
        const Engineers = (): void => {
            //Boil the Engineers 6525
            Core.addDrop(...this.engineersLoot);
            Core.equipClass(ClassType.Farm);
            Core.registerQuests(6525);
            while (!bot.shouldExit && !Core.checkInventory(this.engineersLoot, undefined, { toInv: false })) {
                Core.huntMonster("CetoleonWar", "Grislyfang Engineer", "Engineers Slain", 3, { log: false });
            }
            Core.cancelRegisteredQuests();
            Core.toBank(...this.engineersLoot);
        };
        const GunPowder = (): void => {
            //Grab the Gunpowder 6526
            Core.addDrop(...this.gunPowderLoot);
            Core.equipClass(ClassType.Farm);
            Core.registerQuests(6526);
            while (!bot.shouldExit && !Core.checkInventory(this.gunPowderLoot, undefined, { toInv: false })) {
                Core.huntMonster("CetoleonWar", "Grislyfang Musketeer", "Grislyfang Gunpowder", 5, { log: false });
            }
            Core.cancelRegisteredQuests();
            Core.toBank(...this.gunPowderLoot);
        };
        const Saw = (): void => {
            //Saw THIS! 6527
            Core.addDrop(...this.sawLoot);
            Core.equipClass(ClassType.Solo);
            Core.registerQuests(6527);
            while (!bot.shouldExit && !Core.checkInventory(this.sawLoot, undefined, { toInv: false })) {
                Core.huntMonster("CetoleonWar", "Captain Sawtooth", "Captain Sawtooth Defeated");
            }
            Core.cancelRegisteredQuests();
            Core.toBank(...this.sawLoot);
        };
        const Tentacles = (): void => {
            //Remove the Tentacles 6528
            Core.addDrop(...this.tentaclesLoot);
            Core.equipClass(ClassType.Farm);
            Core.registerQuests(6528);
            while (!bot.shouldExit && !Core.checkInventory(this.tentaclesLoot, undefined, { toInv: false })) {
                Core.huntMonster("CetoleonWar", "Nomura's Sting", "Tentacle Slain", 5, { log: false });
            }
            Core.cancelRegisteredQuests();
            Core.toBank(...this.tentaclesLoot);
        };
        const Roaches = (): void => {
            //Ugh, Roaches 6529
            Core.addDrop(...this.roachesLoot);
            Core.equipClass(ClassType.Farm);
            Core.registerQuests(6529);
            while (!bot.shouldExit && !Core.checkInventory(this.roachesLoot, undefined, { toInv: false })) {
                Core.huntMonster("CetoleonWar", "Sea Roach", "Sea Roach Slain", 5, { log: false });
            }
            Core.cancelRegisteredQuests();
            Core.toBank(...this.roachesLoot);
        };
        if (!Core.isSeasonalMapActive("CetoleonWar")) {
            return;
        }

        if (Core.checkInventory(this.allLoot, undefined, { toInv: false })) {
            return;
        }

        heartOfTheSeaStory.heartOfTheSea();

        if (!Core.checkInventory(this.grislyFangLoot, undefined, { toInv: false })) {
            Grislyfang();
        }

        if (!Core.checkInventory(this.wreckersLoot, undefined, { toInv: false })) {
            Wreckers();
        }

        if (!Core.checkInventory(this.engineersLoot, undefined, { toInv: false })) {
            Engineers();
        }

        if (!Core.checkInventory(this.gunPowderLoot, undefined, { toInv: false })) {
            GunPowder();
        }

        if (!Core.checkInventory(this.sawLoot, undefined, { toInv: false })) {
            Saw();
        }

        if (!Core.checkInventory(this.tentaclesLoot, undefined, { toInv: false })) {
            Tentacles();
        }

        if (!Core.checkInventory(this.roachesLoot, undefined, { toInv: false })) {
            Roaches();
        }

        //Gel the Jellyfish 6530
        Story.killQuest(6530, "CetoleonWar", "Nomura");
    }
}

export default function main(): void {
    const script = new CetoleonWarStory();
    Core.setOptions();

    script.cetoleonWar();

    Core.setOptions(false);
}
