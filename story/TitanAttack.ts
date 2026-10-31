/*
name: Titan Attack Story
description: This will finish the Titan Attack Story.
tags: story, quest, titan-attack
*/
// Port of Scripts/Story/TitanAttack.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();
const Adv = new CoreAdvanced();

export class TitanAttackStory {
    doAll(): void {
        if (Core.isCompletedBefore(8777)) {
            return;
        }

        Story.preLoad(this.doAll);

        // Those Who Remain 8759
        Story.mapItemQuest(8759, "titanattack", [10345, 10346, 10347, 10348, 10349]);

        // Who Helps the Healer? 8760
        if (!Story.questProgression(8760)) {
            Core.ensureAccept(8760);
            Core.huntMonster("titanattack", "Corrosive Crawler", "Crawler Chitin", 5);
            Core.huntMonster("titanattack", "Chaorrupted Bandit", "Pilfered Potion", 5);
            Core.ensureComplete(8760);
        }

        // Supply in Demand 8761
        Story.killQuest(8761, "titanattack", "Supply Caravan");

        // Creature Comforts 8762
        if (!Story.questProgression(8762)) {
            Core.ensureAccept(8762);
            Core.huntMonster("titanattack", "Chaos Wyvern", "Game Ration", 10);
            Core.huntMonster("titanattack", "Corrosive Crawler", "Insect Ration", 10);
            Core.ensureComplete(8762);
        }

        // Infernal Investigation 8763
        if (!Story.questProgression(8763)) {
            Core.ensureAccept(8763);
            Core.huntMonster("titanattack", "Chaorrupted Bandit", "Bandit Beaten", 6);
            Core.huntMonster("titanattack", "AntiTitan Corps", "Corps Questioned", 6);
            Core.ensureComplete(8763);
        }

        // Another Brick in the Wall 8764
        if (!Story.questProgression(8764)) {
            Story.mapItemQuest(8764, "titanattack", 10350, 3);
            Core.huntMonster("titanattack", "Supply Caravan", "Building Brick", 15);
            Core.huntMonster("titanattack", "Corrosive Crawler", "Chitin Coating", 8);
            Core.huntMonster("titanattack", "Chaos Dweller", "Adhesive Saliva", 7);
            Core.ensureComplete(8764);
        }

        // Rotten to the Corps 8765
        Story.killQuest(8765, "titanattack", "AntiTitan Corps");

        // A Fighting Chance 8766
        if (!Story.questProgression(8766)) {
            Core.ensureAccept(8766);
            Core.getMapItem(10351, 8, "titanattack");
            Core.huntMonster("titanattack", "Corrosive Crawler", "Sharp Stinger", 8);
            Core.huntMonster("titanattack", "Supply Caravan", "Battle Wire", 8);
            Core.ensureComplete(8766);
        }

        // Flash of the Titans 8767
        if (!Story.questProgression(8767)) {
            Core.ensureAccept(8767);
            Core.huntMonster("titanattack", "Supply Caravan", "Shine Powder", 5);
            Core.huntMonster("titanattack", "Supply Caravan", "Explosive Casing", 10);
            Core.huntMonster("titanattack", "Chaotic Beholder", "Smoke Sac", 5);
            Core.ensureComplete(8767);
        }

        // Vein Ambition 8768
        Story.killQuest(8768, "titanattack", "Corrosive Crawler");

        // Asset Acquisition 8769
        if (!Story.questProgression(8769)) {
            Core.ensureAccept(8769);
            Core.huntMonster("titanattack", "Supply Caravan", "Food Crate", 5);
            Core.huntMonster("titanattack", "Supply Caravan", "Medicine Vial", 15);
            Core.huntMonster("titanattack", "Chaorrupted Bandit", "Bandit Blade", 15);
            Core.ensureComplete(8769);
        }

        // Enemy at the Gate 8770
        Story.mapItemQuest(8770, "titanattack", 10352);

        // Titanic Terror 8771
        Story.killQuest(8771, "titanattack", "Titanic Vindicator");

        // Titanic Terror Times Two 8772
        if (!Story.questProgression(8772)) {
            Core.ensureAccept(8772);
            Core.huntMonster("titanattack", "Titanic Paladin", "Titanic Paladin Felled", 1);
            Core.huntMonster("titanattack", "Titanic DoomKnight", "Titanic DoomKnight Felled", 1);
            Core.ensureComplete(8772);
        }

        // A Little Light... 8773
        Story.killQuest(8773, "titanstrike", "Titanic Paladin");

        // A Dose of Darkness... 8774
        Story.killQuest(8774, "titanstrike", "Titanic DoomKnight");

        // And A Cup of Chaos 8775
        Story.killQuest(8775, "titanstrike", "Titanic Destroyer");

        // Topple Some Titans! 8776
        Core.addDrop("Heroic Titan's Greatsword");
        if (!Story.questProgression(8776)) {
            Core.ensureAccept(8776);
            Core.huntMonster("titanstrike", "Titanic Paladin", "Paladin Punished", 1);
            Core.huntMonster("titanstrike", "Titanic DoomKnight", "Doomknight Decimated", 1);
            Core.huntMonster("titanstrike", "Titanic Destroyer", "Destroyer Destroyed", 1);
            Core.ensureComplete(8776);
        }

        // The BIG Finish 8777
        Adv.enhanceItem("Heroic Titan's Greatsword", EnhancementType.Lucky, {
            cSpecial: CapeSpecial.None,
            hSpecial: HelmSpecial.None,
            wSpecial: WeaponSpecial.Spiral_Carve,
        });

        Story.killQuest(8777, "titandrakath", "Titan Drakath");
    }
}

export default function main(): void {
    const script = new TitanAttackStory();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
