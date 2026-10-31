/*
name: Ascended Drakath Gear
description: Farms the ascended Drakath Set
tags: ascended drakath, set, drakath, ascended blade of awe, ascended light of destiny, ascended face of chaos
*/
// Port of Scripts/Chaos/AscendedDrakathGear.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { DrakathArmorBot } from "./DrakathsArmor";
import { Core } from "../core/CoreBots";

const DA = new DrakathArmorBot();

export class AscendedDrakathGear {
    getAll(): void {
        if (Core.checkInventory(["Ascended Blade of Awe", "Ascended Light of Destiny", "Ascended Face of Chaos"])) {
            return;
        }

        Core.addDrop("Ascended Blade of Awe", "Ascended Light of Destiny", "Ascended Face of Chaos");

        this.ascendedGear("Ascended Blade of Awe");
        this.ascendedGear("Ascended Light of Destiny");
        this.ascendedGear("Ascended Face of Chaos");
    }

    ascendedGear(Target: string): void {
        if (Core.checkInventory(Target)) {
            return;
        }

        DA.drakathOriginalArmor();
        if (!Core.checkInventory("Original Drakath Armor")) {
            Core.logger(
                'Missing "Original Drakath Armor", which is required to accept and turnin this quest. returning to previous script/stopping script.\n' +
                    `Probably Missing "Dage's Scroll fragments" [${Core.dynamicQuant("Dage's Scroll Fragment", false) / 13}], try again tomarrow when the dailys available.`,
            );
            return;
        }

        Core.addDrop(Target);
        Core.registerQuests(3767);
        Core.huntMonster("towerofdoom4", "Dread Stranglerfish", Target, undefined, { isTemp: false, log: false });
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new AscendedDrakathGear();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
