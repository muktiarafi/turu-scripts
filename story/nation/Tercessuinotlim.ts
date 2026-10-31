/*
name: Tercessuinotlim
description: This will finish the Tercessuinotlim quest.
tags: story, quest, tercessuinotlim, nation
*/
// Port of Scripts/Story/Nation/Tercessuinotlim.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Tercessuinotlim {
    jadziaQuests(): void {
        if (Core.isCompletedBefore(8474)) {
            return;
        }

        Story.preLoad(this.jadziaQuests);

        //Starting off Small 8469
        if (!Story.questProgression(8469)) {
            Core.ensureAccept(8469);
            Core.huntMonster("Tercessuinotlim", "Dark Makai", "Makai Captured", 15);
            Core.huntMonster("ChaosLab", "Chaorrupted Moglin", "Chaorrupted Mutation", 5);
            Core.huntMonster("RedDeath", "RedDeath Moglin", "RedDeath Mutation", 5);
            Core.huntMonster("RedDeath", "Swamp Wraith", "Wraith Mutation", 5);
            Core.ensureComplete(8469);
        }

        //Those Who Don’t Learn… 8470
        if (!Story.questProgression(8470)) {
            Core.ensureAccept(8470);
            Core.huntMonster("Underworld", "Revontheus", "Revontheus Reviewed");
            Core.huntMonster("Underworld", "Bloodfiend", "Bloodfiend Browbeaten", 20);
            Core.huntMonster("Underworld", "Dreadfiend of Nulgath", "Dreadfiend Disciplined", 20);
            Core.huntMonster("Underworld", "Dilligas", "Dilligas Demoted");
            Core.huntMonster("Underworld", "Klunk", "Klunk Kriticized");
            Core.ensureComplete(8470);
        }

        //Chibification Nation 8471
        if (!Story.questProgression(8471)) {
            Core.ensureAccept(8471);
            Core.huntMonster("Pastelia", "Chaos Queen Beleen", "Insanely Pink Energy");
            Core.huntMonster("Pastelia", "Happy Cloud", "Fluffy Pink Energy", 7);
            Core.huntMonster("Pastelia", "Cutie Makai", "Cutsey Pink Energy", 8);
            Core.huntMonster("SewerPink", "Cutie Grumbley", "Slimy Pink Energy", 5);
            Core.ensureComplete(8471);
        }

        //A Little Fiendly Sparring 8472
        if (!Story.questProgression(8472)) {
            Core.ensureAccept(8472);
            Core.huntMonster("Fiendshard", "Dirtlicker", "Dirtlicker's Dignity Decimated");
            Core.huntMonster("citadel", "Death's Head", "Death's Head Demolished");
            Core.huntMonster("ShadowBlast", "CaesarisTheDark", "Shadowblaster Shamed", 10);
            Core.huntMonster("QuibbleHunt", "Skew", "Skew Straightened Out");
            Core.huntMonster("ShadowBlast", "Crag and Bamboozle", "Crag and Bamboozle Cowering");
            Core.huntMonster("ShadowBlast", "Grimlord Boss", "Grimlord Left Groveling");
            Core.huntMonster("tercessuinotlim", "Void Monk", "Void Warrior Vanquished", 10);
            Core.ensureComplete(8472);
        }

        //Working Shard or Shardly Working? 8473
        if (!Story.questProgression(8473)) {
            Core.ensureAccept(8473);
            Core.killMonster("fiendshard", "r8", "Left", "Fiend Shard", "Dirtlicker's Shard Shaving", 3);
            Core.killMonster("fiendshard", "r9", "Left", 15, "Nulgath's Shard Shaving", 3);
            Core.huntMonster("QuibbleHunt", "RogueFiend", "Roguefiend Crystal Shaving", 5);
            Core.ensureComplete(8473);
        }

        //The Wanderer’s Words 8474
        if (!Story.questProgression(8474)) {
            Core.ensureAccept(8474);
            Core.huntMonster("hachiko", "Dai Tengu", "101 Proof Blade Oil");
            Core.killKitsune("Private Reserve Sake", 1, { isTemp: true });
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("Tercessuinotlim", "Taro Blademaster", "The Tale of Taro");
            Core.ensureComplete(8474);
        }
    }
}

export default function main(): void {
    const script = new Tercessuinotlim();
    Core.setOptions();

    script.jadziaQuests();

    Core.setOptions(false);
}
