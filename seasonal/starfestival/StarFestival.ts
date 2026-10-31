/*
name: Star Festival Story
description: This script will complete the Star Festival story quests.
tags: story, quest, star-festival
*/
// Port of Scripts/Seasonal/StarFestival/StarFestival.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class StarFestival {
    storyLine(): void {
        if (Core.isCompletedBefore(8756) || !Core.isSeasonalMapActive("starfest")) {
            return;
        }

        if (!Story.questProgression(8748)) {
            Core.ensureAccept(8748);
            // A Healer’s Wish 8748
            if (!Core.checkInventory("Twilly Twig")) {
                Core.addDrop("Twilly Twig");
                Core.ensureAccept(11);
                Core.huntMonster("farm", "Treeant", "Treeant Branch");
                Core.ensureComplete(11);
                bot.wait.forPickup("Twilly Twig");
            }
            Core.huntMonster("brightoak", "Bright Treeant", "Brightest Branch", 6);
            Core.huntMonster("farm", "Treeant", "Treant Leaf");
            Core.huntMonster("guardiantree", "Blossoming Treeant", "Beautiful Blossom", 6);
            Core.huntMonster("NibbleOn", "Mean Old Treeant", "Bitter Bark", 8);
            Core.ensureComplete(8748);
        }

        // A Fishy Wish 8749
        if (!Story.questProgression(8749)) {
            Core.ensureAccept(8749);
            Core.huntMonster("pirates", "Fishman Soldier", "Fish", undefined, { isTemp: false });
            Core.huntMonster("pirates", "Shark Bait", "Shark Bait Slice");
            Core.huntMonster("pirates", "Fishwing", "Fish Wings", 8);
            Core.huntMonster("Natatorium", "Anglerfish", "Anglerfish Filets", 7);
            Core.huntMonster("river", "Kuro", "Kuro Kut");
            Core.ensureComplete(8749);
        }

        // A Villain’s Wish 8750
        if (!Story.questProgression(8750)) {
            Core.ensureAccept(8750);
            Core.huntMonster("dragonplane", "Earth Elemental", "Raw Elemental Earth", 4);
            Core.huntMonster("dragonplane", "Fire Elemental", "Raw Elemental Fire", 2);
            Core.huntMonster("dragonplane", "Water Elemental", "Raw Elemental Water", 8);
            Core.huntMonster("gilead", "Mana Elemental", "Raw Elemental Mana", 3);
            Core.huntMonster("poisonforest", "Bandit", "Carving Supplies", 10);
            Core.ensureComplete(8750);
        }

        // A Child’s Wish 8751
        if (!Story.questProgression(8751)) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAccept(8751);
            Core.killMonster(`battleunderb`, "Enter", "Spawn", "*", "Bundle O' Bones", 30);
            Core.equipClass(ClassType.Solo);
            Core.huntMonsterMapID(`Odokuro`, 1, "Odokuro's Occipital");
            Core.huntMonster(`bonecastle`, "Vaden", "Vaden's Other Arm");
            Core.huntMonster(`vordredboss`, "Vordred", "Vordred's Skull(s)", 3);
            Core.ensureComplete(8751);
        }

        // A Leader’s Wish 8752
        if (!Story.questProgression(8752)) {
            Core.ensureAccept(8752);
            Core.huntMonster("feverfew", "Major Thermas", "Major Thermas Pledged");
            Core.huntMonster("fireforge", "Firestorm Scout", "Firestorm Pledges", 30);
            Core.huntMonster("fireforge", "Firestorm General", "Firestorm General Pledged", 3);
            Core.huntMonster("fireforge", "Firestorm Corporal", "Firestorm Corporal Pledged", 4);
            Core.huntMonster("fireforge", "Firestorm Major", "Firestorm Major Pledged", 4);
            Core.ensureComplete(8752);
        }

        // A Conqueror’s Wish 8753
        if (!Story.questProgression(8753)) {
            Core.ensureAccept(8753);
            Core.huntMonster("Tercessuinotlim", "Tainted Elemental", "Tainted Essence Collected", 10);
            Core.killMonster("tercessuinotlim", "m2", "Left", "*", "Makai Essence Collected", 20);
            Core.huntMonster("necrodungeon", "5 Headed Dracolich", "Dracolich Soul Collected", 15);
            Core.huntMonster("necrodungeon", "SlimeSkull", "Necropolis Soul Collected", 15);
            Core.huntMonster("necrodungeon", "Doom Overlord", "Doom Power Catalyst", 2);
            Core.ensureComplete(8753);
        }

        // A Survivor’s Wish 8754
        if (!Story.questProgression(8754)) {
            Core.ensureAccept(8754);
            Core.huntMonster("astraviajudge", "Hand", "Echo of Astravia", 22);
            Core.huntMonster("astraviajudge", "La", "Righteous Requiem");
            Core.huntMonster("theworld", "Ti", "Gentle Glissando");
            Core.huntMonster("theworld", "Re", "Reckless Rhapsody");
            Core.huntMonster(`theworld`, "Encore Darkon", "Conductor's Canata");
            Core.ensureComplete(8754);
        }

        // A Chaotic Wish 8755
        if (!Story.questProgression(8755)) {
            Core.ensureAccept(8755);
            bot.quests.updateQuest(8094);
            Core.huntMonster(`transformation`, "Queen of Monsters", "Queen's Remnant");
            Core.huntMonsterMapID("transformation", 16, "Terrestrial Chaos", 30);
            Core.huntMonster(`lagunabeach`, "Heart of Chaos", "Heart's Remnant");
            Core.huntMonster(`lagunabeach`, "Chaos Kelp", "Aquatic Chaos", 25);
            Core.ensureComplete(8755);
        }

        // A Hero’s Wish 8756
        if (!Story.questProgression(8756)) {
            Core.join("starfest");
            Core.ensureAccept(8756);
            Core.getMapItem(1803, 1, "starfest");
            Core.ensureComplete(8756);
        }
    }
}

export default function main(): void {
    const script = new StarFestival();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
