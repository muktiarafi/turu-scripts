/*
name: Bright Oak (Extra)
description: This will finish the Bright Oak quest.
tags: story, quest, queen-of-monsters, bright-oak, extra, brightoak
*/
// Port of Scripts/Story/QueenofMonsters/Extra/BrightOak.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreDailies } from "../../../core/CoreDailies";
import { CoreStory } from "../../../core/CoreStory";

const Story = new CoreStory();
const Daily = new CoreDailies();

export class BrightOak {
    doall(repFarm = false): void {
        if (Core.isCompletedBefore(4810)) {
            return;
        }

        Story.preLoad(this.doall);

        this.ælfred();
        this.avenGreywhorl(repFarm);
        // Early exit if we're doing the rep farm
        if (repFarm) {
            return;
        }

        this.flixSpiderwhisp();
        this.lapisPart1();
        this.ravinosBrightgladePart1();
        this.ravinosBrightgladePart2();
        this.lapisPart2();
        this.ravinosBrightgladePart3();
        this.extraREP(true);
    }

    ælfred(): void {
        if (Core.isCompletedBefore(4644)) {
            return;
        }

        // Map: Rivensylth
        // Equip spirit animal packets
        Core.sendPackets(`%xt%zm%getMapItem%${bot.map.roomId}%3935%`);
        Core.sleep();
        Core.sendPackets(`%xt%zm%equipItem%${bot.map.roomId}%32057%`);

        // Take to the Skies
        Story.mapItemQuest(4637, "Rivensylth", 3944);

        // Ready to Pounce
        Story.killQuest(4638, "Rivensylth", "Cave Creeper");

        // What a Hoot
        Story.mapItemQuest(4639, "Rivensylth", 3945, 4);

        // Shroom Spreading
        Story.killQuest(4640, "Rivensylth", "Mushroom");

        // Protect the Nest
        if (!Story.questProgression(4641)) {
            Core.ensureAccept(4641);
            Core.getMapItem(3948, 4, "Rivensylth");
            Core.huntMonster("pines", "Pine Grizzly", "Straw", 3);
            Core.ensureComplete(4641);
        }

        // Night in Shining Armor
        Story.killQuest(4642, "Rivensylth", "Cave Creeper");

        // Finding Rivensylth
        Story.mapItemQuest(4643, "Rivensylth", 3946);

        // Zero Tolerance for Nature
        Story.killQuest(4644, "Rivensylth", "Avada");
    }

    avenGreywhorl(repFarm = false): void {
        if (Core.isCompletedBefore(4668)) {
            return;
        }

        Core.addDrop("Restoration of Nature Potion", "Paddylump's Elixir");

        // Rose By Any Other Name
        Story.killQuest(4466, "brightoak", "Bright Treeant");

        // Map: Elfhame
        // Corruption of Elfhame
        if (!Story.questProgression(4659)) {
            Core.ensureAccept(4659);
            Core.getMapItem(3983, 1, "elfhame");
            Core.huntMonster("elfhame", "Ruin Stalker", "Ruin Stalker Defeated", 6);
            Core.ensureComplete(4659);
        }

        // Restoring Nature
        if (!Story.questProgression(4660)) {
            Core.addDrop("Restoration of Nature Potion");
            Core.ensureAccept(4660);
            Core.buyItem("sandsea", 245, "Water of Life");
            Core.killMonster("brightoak", "r2", "Left", "Bright Treeant", "Bright Ore", 3);
            Core.killMonster("brightoak", "r2", "Left", "Wolfwood", "Herbal Remedy", 4);
            Core.ensureComplete(4660);
            bot.wait.forPickup("Restoration of Nature Potion");
        }

        // Unlock the Guardian's First Rune
        if (!Story.questProgression(4661)) {
            this.naturePotion(1);
            Story.killQuest(4661, "elfhame", "Blighted Deer ");
        }

        // Gnome Sweet Gnome
        if (!Story.questProgression(4662)) {
            Core.ensureAccept(4662);
            if (!Core.checkInventory("Paddylump's Elixir")) {
                //Prereq. Quest: Omnomnoms:
                //Prereq. Item: Paddylump's Elixir:
                //--- Mapname: mudluk
                Core.addDrop("Paddylump's Elixir");
                Core.ensureAccept(820);
                Core.huntMonster("cloister", "Acornent", "Wiggly Worm", 15);
                Core.huntMonster("cloister", "Karasu", "MegaMite", 10);
                Core.ensureComplete(820);
                bot.wait.forPickup("Paddylump's Elixir");
            }
            Core.huntMonster("elfhame", "Ruin Dweller", "Ruin Dweller Defeated", 12);
            Core.ensureComplete(4662);
        }

        // Unlock the Guardian's Second Rune
        if (!Story.questProgression(4663)) {
            this.naturePotion(2);
            Core.ensureAccept(4663);
            Core.huntMonster("elfhame", "Wolfrider", "Wolfrider Maimed", 4);
            Core.ensureComplete(4663);
        }

        // I Know kaRATe
        Story.killQuest(4664, "elfhame", "Ratawampus");

        // Unlock the Guardian's Third Rune
        if (!Story.questProgression(4665)) {
            this.naturePotion(3);
            Core.ensureAccept(4665);
            Core.huntMonster("elfhame", "Ratawampus", "Ratawampus Cleared", 2);
            Core.huntMonster("elfhame", "Ruin Dweller", "Ruin Dweller Cleared", 3);
            Core.ensureComplete(4665);
        }

        // Unlock the Guardian's Fourth Rune
        if (!Story.questProgression(4666)) {
            this.naturePotion(4);
            Core.ensureAccept(4666);
            Core.killMonster("elfhame", "r2", "Left", "Ruin Stalker", "Ruin Stalker Contained", 6);
            Core.ensureComplete(4666);
        }
        if (repFarm) {
            return;
        }

        // Unlocking the Guardian's Mouth
        Story.mapItemQuest(4667, "elfhame", 3984);

        if (repFarm) {
            return;
        }

        // Defeat the Guardian Spirit
        Story.killQuest(4668, "elfhame", "Guardian Spirit");
    }

    flixSpiderwhisp(): void {
        if (Core.isCompletedBefore(4470)) {
            return;
        }

        // World Tree Wrangling
        Story.killQuest(4469, "Brightoak", "Hootbear");

        // Guardians Gone Bad
        if (!Story.questProgression(4470)) {
            Core.ensureAccept(4470);
            Core.getMapItem(3667, 5, "Brightoak");
            Core.huntMonster("brightoak", "Brightpool Guardian", "Brightpool Subdued", 9);
            Core.ensureComplete(4470);
        }
    }

    lapisPart1(): void {
        if (Core.isCompletedBefore(4468)) {
            return;
        }

        // That's So Lapis
        if (!Story.questProgression(4467)) {
            Core.ensureAccept(4467);
            Core.getMapItem(3666, 10, "Brightoak");
            Core.huntMonster("brightoak", "Grove Spore", "Herbal Spore", 10);
            Core.ensureComplete(4467);
        }

        // Guts for a Greater Mind
        Story.killQuest(4468, "Brightoak", "Twisted Goblin");
    }

    ravinosBrightgladePart1(): void {
        if (Core.isCompletedBefore(4700)) {
            return;
        }

        // Cleanse the Grove
        if (!Story.questProgression(4463)) {
            Core.ensureAccept(4463);
            Core.killMonster("brightoak", "r2", "Left", "Wolfwood", "Corrupted Fang", 2);
            Core.killMonster("brightoak", "r3", "Left", "Hootbear", "Shriveled Claw", 4);
            Core.killMonster("brightoak", "r6", "Left", "Tainted Earth", "Muddy Vial", 2);
            Core.ensureComplete(4463);
        }

        // Survey the Landscape
        Story.mapItemQuest(4692, "Darkheart", 4052);

        // Corruption in the Grove
        Story.killQuest(4693, "Darkheart", "Mutated Leech");

        // Perilous Supply Run
        Story.killQuest(4694, "Darkheart", "Mutated Leech");

        // Purify Wisterrora
        if (!Story.questProgression(4695)) {
            Core.ensureAccept(4695);
            Core.getMapItem(4053, 6, "Darkheart");
            Core.huntMonster("darkheart", "Wisterrora", "Wisterrora Defeated", 5);
            Core.ensureComplete(4695);
        }

        // Arachnophobia
        if (!Story.questProgression(4696)) {
            Core.ensureAccept(4696);
            Core.getMapItem(4054, 6, "Darkheart");
            Core.huntMonster("darkheart", "Toxic Grove Spider", "Toxic Grove Spider Defeated", 7);
            Core.ensureComplete(4696);
        }

        // Brighten up your Day
        if (!Story.questProgression(4697)) {
            Core.ensureAccept(4697);
            Core.getMapItem(4055, 7, "Darkheart");
            Core.huntMonster("brightoak", "Brightpool Guardian", "Brightpool Core Retrieved", 7);
            Core.ensureComplete(4697);
        }

        // Cleanse the Grove
        if (!Story.questProgression(4698)) {
            Core.ensureAccept(4698);
            Core.killMonster("Darkheart", "Enter", "Spawn", "Tainted Earth", "Tainted Earth Removed", 8);
            Core.killMonster("Darkheart", "r2", "Left", "Toxic Grove Spider", "Toxic Grove Spider Dispatched", 5);
            Core.killMonster("Darkheart", "Enter", "Spawn", "Mutated Leech", "Mutated Leech Slain", 6);
            Core.ensureComplete(4698);
        }

        // X Marks the Spot
        Story.mapItemQuest(4699, "Darkheart", 4056);

        // Defeat the Gaiazor
        Core.equipClass(ClassType.Solo);
        Story.killQuest(4700, "Darkheart", "Gaiazor");
    }

    ravinosBrightgladePart2(): void {
        const QuestLogic = (): void => {
            switch (Story.legacyQuestId) {
                case 4799:
                    // We Have Some Stragglers [Ravinos Token I]
                    Core.join("Gaiazor");
                    Core.getMapItem(4204, 6);
                    bot.wait.forPickup("Ravinos Token I");
                    break;
                case 4800:
                    // Too Many Nasties [Ravinos Token II]
                    Core.huntMonster("Gaiazor", "Wolfwood", "Wolfwood Slain", 4);
                    Core.huntMonster("Gaiazor", "Wisterrora", "Wisterrora Slain", 4);
                    Core.huntMonster("Gaiazor", "Tree Golem", "Tree Golem Slain", 4);
                    bot.wait.forPickup("Ravinos Token II");
                    break;
                case 4801:
                    // But...Our Stuff! [Ravinos Token III]
                    Core.huntMonster("Gaiazor", "Tree Golem", "Lapis' Runestones");
                    Core.huntMonster("Gaiazor", "Wolfwood", "Flix's Fertilizer");
                    Core.huntMonster("Gaiazor", "Wisterrora", "Zephyr's Toolkit");
                    bot.wait.forPickup("Ravinos Token III");
                    break;
                case 4802:
                    // Like One Of Those Toddler Gates [Ravinos Token IV]
                    Core.huntMonster("Gaiazor", "Tree Golem", "Tree Golem Roots", 5);
                    Core.huntMonster("Gaiazor", "Wisterrora", "Wisterrora Thorns", 5);
                    Core.getMapItem(4205, 5);
                    bot.wait.forPickup("Ravinos Token IV");
                    break;
                case 4803:
                    // Ravinos Token VI [Ravinos Token V]
                    Core.huntMonster("Darkheart", "Toxic Grove Spider", "Grove Spider Silk", 6);
                    Core.huntMonster("Bloodtusk", "Trollola Plant", "Trollola Nectar", 5);
                    Core.huntMonster("Firestorm", "Sulfur Imp", "Searbush", 2);
                    bot.wait.forPickup("Ravinos Token V");
                    break;
            }
        };
        if (Core.isCompletedBefore(4804)) {
            return;
        }

        Core.addDrop("Ravinos Token I", "Ravinos Token II", "Ravinos Token III", "Ravinos Token IV", "Ravinos Token V");
        Core.equipClass(ClassType.Farm);

        // It's Too Bad I'm Poisonous Now
        // Ravinos Token V
        Story.legacyQuestManager(QuestLogic, ...Core.fromTo(4799, 4803));

        // Talk to Lapis
        Story.mapItemQuest(4804, "Gaiazor", 4206);
    }

    lapisPart2(): void {
        const QuestLogic = (): void => {
            switch (Story.legacyQuestId) {
                case 4805:
                    // Better Than A Magic 8-Ball [Lapis Token I]
                    Core.huntMonster("Gaiazor", "Wolfwood", "Wolfwood Twigs", 7);
                    Core.huntMonster("Gaiazor", "Wisterrora", "Drop of Wisterrora Ichor");
                    bot.wait.forPickup("Lapis Token I");
                    break;
                case 4806:
                    // Outside Assistance [Lapis Token II]
                    Daily.sparrowsBlood(1);
                    bot.wait.forPickup("Lapis Token II");
                    break;
                case 4807:
                    // Lapis Token II [Lapis Token III]
                    Core.getMapItem(4207, 1, "Gaiazor");
                    Core.getMapItem(4208, 1, "Gaiazor");
                    Core.getMapItem(4209, 1, "Gaiazor");
                    bot.wait.forPickup("Lapis Token III");
                    break;
            }
        };
        if (Core.isCompletedBefore(4808)) {
            return;
        }

        Core.addDrop("Lapis Token I", "Lapis Token II", "Lapis Token III");
        Core.equipClass(ClassType.Farm);

        // Return to Ravinos - Requires Lapis Token III
        Core.ensureAccept(4808);

        // Even a Noob Can Do It
        // Lapis Token III
        Story.legacyQuestManager(QuestLogic, ...Core.fromTo(4805, 4807));

        Story.mapItemQuest(4808, "Gaiazor", 4210);
    }

    ravinosBrightgladePart3(): void {
        if (Core.isCompletedBefore(4810)) {
            return;
        }

        this.lapisPart2();

        // Defeat the Traitor
        Story.killQuest(4809, "Gaiazor", "Nevanna");

        // Defeat the Beast
        Story.killQuest(4810, "Gaiazor", "Gaiazor");
    }

    extraREP(Extra = true): void {
        if (!Extra) {
            return;
        }

        if (Core.isCompletedBefore(4472)) {
            return;
        }

        // Catering to Craftsmanship
        if (Daily.checkDailyv2(4471)) {
            Core.ensureAccept(4471);
            Core.huntMonster("Brightoak", "Bright Treeant", "Treeant Trunk", 5);
            Core.killMonster("Brightoak", "r8", "Spawn", "Wolfwood", "Wolfwood Fur", 7);
            Core.ensureComplete(4471);
        }

        // Some Disassembly Required
        if (Daily.checkDailyv2(4472)) {
            Core.ensureAccept(4472);
            Core.huntMonster("Brightoak", "Brightpool Guardian", "Disciplined Guardian", 7);
            Core.ensureComplete(4472);
        }
    }

    naturePotion(quant: number): void {
        if (Core.checkInventory("Restoration of Nature Potion", quant)) {
            return;
        }

        Core.addDrop("Restoration of Nature Potion");

        Core.logger("Resetting so that `Nature potion` drops work ...properly?");
        Core.join("Whitemap");

        while (!bot.shouldExit && !Core.checkInventory("Restoration of Nature Potion", quant)) {
            Core.ensureAccept(4660);
            Core.buyItem("sandsea", 245, "Water of Life");
            Core.killMonster("brightoak", "r2", "Left", "Bright Treeant", "Bright Ore", 3);
            Core.killMonster("brightoak", "r2", "Left", "Wolfwood", "Herbal Remedy", 4);
            Core.ensureComplete(4660);
            bot.wait.forPickup("Restoration of Nature Potion");
        }
    }
}

export default function main(): void {
    const script = new BrightOak();
    Core.setOptions();

    script.doall();

    Core.setOptions(false);
}
