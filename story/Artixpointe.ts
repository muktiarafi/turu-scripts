/*
name: Artixpointe Story
description: This will finish the Artixpointe quest.
tags: null
*/
// Port of Scripts/Story/Artixpointe.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Artixpointe {
    omniArtifact(): void {
        if (Core.checkInventory("Omni Artifact")) {
            return;
        }

        Story.preLoad(this.omniArtifact);

        if (!Core.checkInventory("Unholy Wasabi")) {
            //Find the Unholy Wasabi 3800
            Core.addDrop("Unholy Wasabi");
            Core.ensureAccept(3800);
            Core.huntMonster("artixpointe", "Corrupted Sushi Chef", "Find Unholy Wasabi");
            Core.ensureComplete(3800);
            bot.wait.forPickup("Unholy Wasabi");
        }

        if (!Core.checkInventory("Cysero's Doom Sock")) {
            //Find Cysero's Doom Sock 3801
            Core.addDrop("Cysero's Doom Sock");
            Core.ensureAccept(3801);
            Core.getMapItem(2911, 1, "artixpointe");
            Core.ensureComplete(3801);
            bot.wait.forPickup("Cysero's Doom Sock");
        }

        if (!Core.checkInventory("Chickencow Claw")) {
            //Recover Cursed ChickenCow Claw 3802
            Core.addDrop("Chickencow Claw");
            Core.ensureAccept(3802);
            Core.huntMonster("battlefowl", "Chickencow", "Cursed Claw Found");
            Core.ensureComplete(3802);
            bot.wait.forPickup("Chickencow Claw");
        }

        if (!Core.checkInventory("Zorbak's Staff Skull")) {
            //Find Zorbak’s Haunted Staff 3803
            Core.addDrop("Zorbak's Staff Skull");
            Core.ensureAccept(3803);
            Core.huntMonster("graveyard", "Big Jack Sprat", "Zorbak's Skull");
            Core.ensureComplete(3803);
            bot.wait.forPickup("Zorbak's Staff Skull");
        }

        if (!Core.checkInventory("Dragon Khan's Corrupt Scepter")) {
            //The Dragon Khan’s Corrupt Scepter 3804
            Core.addDrop("Dragon Khan's Corrupt Scepter");
            Core.ensureAccept(3804);
            Core.huntMonster("vendorbooths", "Dragon Khan", "Corrupt Scepter Found");
            Core.ensureComplete(3804);
            bot.wait.forPickup("Dragon Khan's Corrupt Scepter");
        }

        if (!Core.checkInventory("Sir Ver's Broken Power Button")) {
            //Locate Sir Ver’s Power Button 3805
            Core.addDrop("Sir Ver's Broken Power Button");
            Core.ensureAccept(3805);
            Core.huntMonster("undergroundlabb", "Rabid Server Hamster", "Cursed Power Button");
            Core.ensureComplete(3805);
            bot.wait.forPickup("Sir Ver's Broken Power Button");
        }

        if (!Core.checkInventory("Death's Cursed Hourglass")) {
            if (!Core.isCompletedBefore(3807)) {
                //Battle Gravefang 3806
                Core.ensureAccept(3806);
                Core.huntMonster("gravefang", "Gravefang", "Gravefang Defeated");
                Core.ensureComplete(3806);
            }
            //Recover Death's Hourglass 3807
            Core.addDrop("Death's Cursed Hourglass");
            Core.ensureAccept(3807);
            Core.getMapItem(2912, 1, "artixpointe");
            Core.ensureComplete(3807);
            bot.wait.forPickup("Death's Cursed Hourglass");
        }
        Core.buyItem("artixpointe", 1002, "Omni Artifact");
    }
}

export default function main(): void {
    const script = new Artixpointe();
    Core.setOptions();

    script.omniArtifact();

    Core.setOptions(false);
}
