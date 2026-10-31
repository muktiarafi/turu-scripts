/*
name: SoulSand
description: null
tags: Soul Sand, soulsand
*/
// Port of Scripts/Legion/LegionMaterials/SoulSand.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreLegion } from "../CoreLegion";
import { SeraphicWar_Story } from "../../story/legion/SeraphicWar";

const Farm = new CoreFarms();
const Legion = new CoreLegion();
const SeraphicWar = new SeraphicWar_Story();

export class AnotherOneBitesTheDust {
    soulSand(quant = 50): void {
        if (Core.checkInventory("Soul Sand", quant)) {
            return;
        }

        Farm.experience(65);
        SeraphicWar.seraphicWar_Questline();

        Core.addDrop("Soul Sand");
        Core.farmingLogger("Soul Sand", quant);
        while (!bot.shouldExit && !Core.checkInventory("Soul Sand", quant)) {
            Core.ensureAccept(7991);
            Farm.battleUnderB("Bone Dust", 333);
            Legion.approvalAndFavor(0, 400);
            Legion.darkToken(80);
            Core.ensureComplete(7991);
            bot.wait.forPickup("Soul Sand");
        }
    }
}

export default function main(): void {
    const script = new AnotherOneBitesTheDust();
    Core.setOptions();

    script.soulSand();

    Core.setOptions(false);
}
