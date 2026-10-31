/*
name: Toxic Oblivion Blade of Alchemy
description: This script will complete the quest for Toxic Oblivion Blade of Alchemy.
tags: nation, bido, birthday, seasonal, little science experiment
*/
// Port of Scripts/Seasonal/StaffBirthdays/Bido/ToxicOblivionBladeofAlchemy.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreNation } from "../../../nation/CoreNation";

const Nation = new CoreNation();

export class ToxicOblivionBladeofAlchemy {
    getBlade(): void {
        if (Core.checkInventory(49066)) {
            return;
        }

        Core.ensureAccept(6981);

        Nation.farmUni13(2);
        Nation.farmTaintedGem(100);
        Nation.farmDarkCrystalShard(150);
        Nation.farmTotemofNulgath(3);
        Nation.farmBloodGem(40);

        Core.addDrop("Concentrated Mana", "Bido's Appreciation");
        Core.addDrop(49085, 49066);

        //Concentrated Mana x30
        Core.registerQuests(6979);
        Core.equipClass(ClassType.Solo);
        while ((!bot.shouldExit && !Core.checkInventory("Concentrated Mana", 30)) || !Core.checkInventory(49085, 30)) {
            Core.huntMonster("prison", "Piggy Drake", "Broken Piggy Bank", undefined, { log: false });
        }

        //Bido's Appreciation x50
        Core.equipClass(ClassType.Solo);
        while (!bot.shouldExit && !Core.checkInventory("Bido's Appreciation", 50)) {
            Core.ensureAccept(6980);
            Core.huntMonster("well", "Gell Oh No", "Piece of Gell Oh No Perfectly Slushied", undefined, { log: false });
            Core.huntMonster("ashfallcamp", "Smoldur", "Smoldur's Shedded Scales", 4, { log: false });
            Core.ensureComplete(6980);
            bot.wait.forPickup("Bido's Appreciation");
        }

        Core.ensureComplete(6981);
        bot.wait.forPickup(49066);
        Core.toBank(49085);
        Core.toBank("Concentrated Mana", "Bido's Appreciation");
    }
}

export default function main(): void {
    const script = new ToxicOblivionBladeofAlchemy();
    Core.setOptions();

    script.getBlade();

    Core.setOptions(false);
}
