/*
name: Dark Scroll Treasure Hunt
description: such a treasure hunt condensed to (by lucK) 2 minutes of your time...
tags: dark scroll, amethyst gem, lilbro dell'inferno, amethyst inferno tome, inferno tome, burning seal, deciphered scroll, the point, the point sword
*/
// Port of Scripts/Other/TreasureHunts/DarkScroll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class DarkScroll {
    example(): void {
        if (Core.checkInventory(["The Point", "The Point Sword"])) {
            return;
        }

        if (!Core.checkInventory("Deciphered Scroll")) {
            Core.logger(`Step 1 Dark Scroll`);
            Core.equipClass(ClassType.Farm);
            Core.killMonster("tercessuinotlim", "m2", "Left", "*", "Dark Scroll", undefined, { isTemp: false });

            if (!Core.checkInventory("Amethyst Inferno Tome")) {
                Core.logger(`Step 2 Libro dell'Inferno`);
                if (!Core.checkInventory("Libro dell'Inferno")) {
                    Core.buyItem("zazul", 336, "Libro dell'Inferno");
                }

                Core.equipClass(ClassType.Solo);
                Adv.gearStore(undefined, { enhAfter: true });
                Core.logger(`Step 3 Amethyst Gem`);
                Core.huntMonster("onslaughttower", "Maximillian Lionfang", "Amethyst Gem", undefined, {
                    isTemp: false,
                    log: false,
                });
                Adv.gearStore(true, { enhAfter: true });

                //Amethyst Inferno Tome
                Core.logger(`Step 4 Amethyst Inferno Tome`);
                Core.buyItem("yokaiwar", 1370, "Amethyst Inferno Tome");
            }

            //Burning Seal
            Core.logger(`Step 5 Burning Seal`);
            Core.huntMonster("phoenixrise", "Cinderclaw", "Burning Seal", undefined, { isTemp: false, log: false });

            //Blazing Catalyst
            Core.logger(`Step 6 Blazing Catalyst`);
            if (!Core.checkInventory(77148)) {
                bot.drops.add(77148);
                Core.getMapItem(11464, 1, "feverfew");
                bot.wait.forDrop(77148, 20);
                bot.wait.forPickup(77148);
            }

            //Deciphered Scroll
            Core.logger(`Step 7 Deciphered Scroll`);
            Core.chainComplete(5027);
            Core.buyItem("Icarus", 590, "Deciphered Scroll");
        }

        //Rewards
        Core.logger(`Step 8 Rewards`);
        Core.addDrop(38805, 41969);
        if (!Core.checkInventory(38805)) {
            Core.ensureAccept(3003);
            Core.getMapItem(11475, 1, "junkheap");
            Core.ensureComplete(3003, 38805);
        }
        if (!Core.checkInventory(41969)) {
            Core.ensureAccept(3003);
            Core.getMapItem(11475, 1, "junkheap");
            Core.ensureComplete(3003, 41969);
        }
        Core.logger("All rewards gotten, congrats.");
    }
}

export default function main(): void {
    const script = new DarkScroll();
    Core.setOptions();

    script.example();

    Core.setOptions(false);
}
