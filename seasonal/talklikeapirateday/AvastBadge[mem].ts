/*
name: Avast Badge (Member)
description: This will finish the quest line of Avast and get Avast Badge.
tags: story, quest, avast, badge, pirate, member
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/AvastBadge[mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();
const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class AvastBadge {
    storyLine(): void {
        const GetBaitandDynamite = (FishingBaitQuant: number, FishingDynamiteQuant: number): void => {
            if (
                Core.checkInventory("Fishing Bait", FishingBaitQuant) &&
                Core.checkInventory("Fishing Dynamite", FishingDynamiteQuant)
            ) {
                return;
            }

            Core.logger("Pre-Fishing XP(This is Required)");
            Core.ensureAccept(1682);
            Core.killMonster("greenguardwest", "West4", "Right", "Slime", "Faith's Fi'shtick", 1, { log: false });
            Core.ensureComplete(1682);

            Core.registerQuests(1682);
            Core.farmingLogger("Fishing Bait", FishingBaitQuant);
            while (
                !bot.shouldExit &&
                FishingBaitQuant !== 0 &&
                !Core.checkInventory("Fishing Bait", FishingBaitQuant)
            ) {
                Core.killMonster("greenguardwest", "West3", "Right", "Frogzard", "Fishing Bait", FishingBaitQuant, {
                    isTemp: false,
                    log: false,
                });
            }

            Core.farmingLogger("Fishing Dynamite", FishingDynamiteQuant);
            while (
                !bot.shouldExit &&
                FishingDynamiteQuant !== 0 &&
                !Core.checkInventory("Fishing Dynamite", FishingDynamiteQuant)
            ) {
                Core.killMonster("greenguardwest", "West4", "Right", "Slime", "Faith's Fi'shtick", 1, { log: false });
            }

            Core.cancelRegisteredQuests();
            Core.logger("Returing to Fishing Map");
            Core.join("fishing");
        };
        if (!Core.isMember) {
            return;
        }
        if (Core.isCompletedBefore(2394)) {
            Core.logger("Story Complete & Badge Owned: AvastBadge");
            return;
        }

        Story.preLoad(this.storyLine);

        // 2389|Aye for an Aye
        if (!Story.questProgression(2389)) {
            Core.ensureAccept(2389);
            if (!Core.checkInventory(27)) {
                Core.buyItem("digitalyulgar", 16, "Barbed Horror");
            }
            Core.killMonster("watchtower", "Frame6", "Left", "Chaos Sp-Eye", "Chaos Sp-eye Eyeball", 5);
            Core.killMonster("willowcreek", "Storage", "Left", "Speyeder", "Speyeder Eyeball", 5);
            Core.ensureComplete(2389);
        }
        // 2390|Skull and Crossed Bones
        if (!Story.questProgression(2390)) {
            Core.ensureAccept(2390);
            Farm.battleUnderB(undefined, 10);
            Adv.buyItem("Necropolis", 408, "Skullface Mace");
            Core.ensureComplete(2390);
        }

        // 2391|Off the Hook!
        if (!Story.questProgression(2391)) {
            Core.ensureAccept(2391);
            if (!Core.checkInventory("Fishin' Hooks")) {
                Core.addDrop("Fishin' Chips", "Fishing Dynamite");
                if (!Core.isCompletedBefore(1682)) {
                    Story.killQuest(1682, "Greenguardwest", "Slime");
                }

                Farm.fishingREP(6);
                while (!bot.shouldExit && !Core.checkInventory(6646, 60)) {
                    Core.registerQuests(1614);
                    if (!Core.checkInventory(10850, 30)) {
                        Core.farmingLogger("Fishin' Chips", 60);
                        Core.farmingLogger("Fish Caught", 30);
                        GetBaitandDynamite(0, 30);
                        while (
                            !bot.shouldExit &&
                            Core.checkInventory("Fishing Dynamite") &&
                            !Core.checkInventory(10850, 30)
                        ) {
                            if (bot.inventory.isMaxStack("Fishing Bait")) {
                                bot.drops.remove("Fishing Bait");
                            }
                            bot.send.packet(`%xt%zm%FishCast%1%Dynamite%30%`);
                            Core.sleep(3500);
                            Core.sendPackets("%xt%zm%getFish%1%false%");
                        }
                        Core.huntMonster("Greenguardwest", "Slime", "Slime Sauce");
                    }
                    Core.cancelRegisteredQuests();
                }
                Core.buyItem("Greenguardwest", 363, "Fishin' Hooks");
            }
            Core.huntMonster("akiba", "Kage Nopperabo", "Hook Sword", undefined, { isTemp: false });
            // Story.KillQuest(2391, "akiba", "Kage Nopperabo", "Hook Sword", isTemp: false);
            Core.ensureComplete(2391);
        }

        // 2392|Booty and the Beast
        if (!Story.questProgression(2392)) {
            Core.ensureAccept(2392);
            Core.huntMonster("neverbeast", "Beast Maker", "Beast Maker Booty");
            Core.huntMonster("voltaire", "Beast of Pirate's Bay", "Beast of Pirate's Bay Booty");
            Core.huntMonster("bludrut4", "Shadow Serpent", "Shadow Serpent Booty");
            Core.huntMonster("voltaire", "Braken Head", "Braken Booty");
            Core.ensureComplete(2392);
        }

        // 2393|A Pirate's Lunch For Me
        if (!Story.questProgression(2393)) {
            Core.ensureAccept(2393);
            Core.huntMonster("natatorium", "Anglerfish", "Natatorium Kelp Bread", 2);
            Core.huntMonster("cloister", "Acornent", "Acornet Butter", 6);
            Core.huntMonster("battleunderc", "Purple Crystalized Jellyfish", "Crystalized Jelly-fish", 6);
            Core.ensureComplete(2393);
        }

        // 2394|Thee Seven C's!
        // Update quest to acess the `Wind` map.
        if (!Core.isCompletedBefore(1403)) {
            bot.quests.updateQuest(1403);
        }

        if (!Story.questProgression(2394)) {
            Core.ensureAccept(2394);
            Core.huntMonster("highcommand", "Chaorrupted Invader", "Chaorrupted Invader Loot");
            Core.huntMonster("darkness", "Cloaked Fiend", "Cloaked Fiend Loot");
            Core.huntMonster("anders", "Copper Sky Pirate", "Copper Sky Pirate Loot");
            Core.huntMonster("tunnel", "Cadaverous Creeper", "Cadaverous Creeper Loot");
            Core.huntMonster("pirates", "Capt. Beard", "Capt. 000000Beard Loot");
            Core.huntMonster("wind", "Cellot", "Cellot Loot");
            Core.huntMonster("academy", "Chaobold", "Chaobold Loot");
            Core.ensureComplete(2394);
        }
    }
}

export default function main(): void {
    const script = new AvastBadge();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
