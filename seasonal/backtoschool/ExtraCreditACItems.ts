/*
name: Extra Credit AC Items
description: This will farm the Extra Credit AC Items.
tags: farm, merge, shop, credit, extra, back-to-school
*/
// Port of Scripts/Seasonal/BackToSchool/ExtraCreditACItems.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class ExtraCreditAC {
    dogear: string[] = ["Book of Lore", "Casual Black Backpack", "Casual Light Backpack", "Dogged Professor"];

    bully: string[] = ["Meanest Bully", "Burning Book"];

    locker: string[] = [
        "Bagged Lunch",
        "Car Pencil Case Blue",
        "Car Pencil Case Orange",
        "Chair Mace",
        "Green Backpack",
        "Number 2 Pencil",
        "Sleek Chic Locks",
        "Slick Spikes Hair",
        "Weekend Fun Pigtails Locks",
        "Winter Uniform",
    ];

    extraFunAC(): void {
        if (!Core.isSeasonalMapActive("extracredit")) {
            return;
        }

        if (Core.checkInventory(this.dogear) && Core.checkInventory(this.bully) && Core.checkInventory(this.locker)) {
            return;
        }

        Core.addDrop(...this.dogear);
        Core.addDrop(...this.bully);
        Core.addDrop(...this.locker);
        Core.equipClass(ClassType.Solo);
        while (!bot.shouldExit && !Core.checkInventory(this.dogear)) {
            Core.huntMonster("extracredit", "Dogear");
        }
        while (!bot.shouldExit && !Core.checkInventory(this.bully)) {
            Core.huntMonster("extracredit", "Meanest Girl");
        }
        while (!bot.shouldExit && !Core.checkInventory(this.locker)) {
            Core.huntMonster("extracredit", "Supply Locker");
        }
    }
}

export default function main(): void {
    const script = new ExtraCreditAC();
    Core.setOptions();

    script.extraFunAC();

    Core.setOptions(false);
}
