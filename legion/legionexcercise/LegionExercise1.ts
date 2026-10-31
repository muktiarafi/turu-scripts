/*
name: Legion Exercise Number 1
description: This script will complete "Legion Exercise Number 1" quest.
tags: legion exercise, 1, undead champion blade, legendary golden death blade
*/
// Port of Scripts/Legion/LegionExcercise/LegionExercise1.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core, randomInt } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Legion = new CoreLegion();

export class LegionExercise1 {
    rewards: string[] = ["Undead Champion Blade", "Legendary Golden Death Blade"];

    exercise(item: string[]): void {
        if (Core.checkInventory(item)) {
            return;
        }
        Core.addDrop(...item);

        Legion.joinLegion();
        Core.buyItem("underworld", 216, "Undead Champion");

        Core.logger(
            "Disclaimer: Percentages are randomized, just made purely for fun. i cba making it an actualy %age",
        );

        const Dice = randomInt(1, 101);
        // creates a number from 1 to 100
        //-------------------------------------------------------------------------------------------------------

        let i = 1;
        const displayPercentage = `${`${((Dice / 100) * 100).toFixed(2)} %`}`;

        Core.logger(`Potato Prediction Inc. Decided: ${displayPercentage} is The Chance for Desired Rewards.`);

        Core.equipClass(ClassType.Farm);
        while (!bot.shouldExit && !Core.checkInventory(["Undead Champion Blade", "Legendary Golden Death Blade"])) {
            Core.ensureAccept(821);
            Core.huntMonster("lair", "Water Draconian", "Flawless DracoHorn", 40, { isTemp: false, publicRoom: false });
            Core.huntMonster("lair", "Golden Draconian", "Golden DracoHeart", undefined, {
                isTemp: true,
                publicRoom: false,
            });
            Core.huntMonster("lair", "Dark Draconian", "Dark DracoHeart", undefined, {
                isTemp: true,
                publicRoom: false,
            });
            Core.huntMonster("lair", "Bronze Draconian", "Mammoth DracoHeart", undefined, {
                isTemp: true,
                publicRoom: false,
            });
            Core.huntMonster("lair", "Water Draconian", "Water DracoHeart", undefined, {
                isTemp: true,
                publicRoom: false,
            });
            Core.huntMonster("lair", "Venom Draconian", "Venom DracoHeart", undefined, {
                isTemp: true,
                publicRoom: false,
            });
            Core.huntMonster("lair", "Purple Draconian", "Iron DracoHeart", undefined, {
                isTemp: true,
                publicRoom: false,
            });
            Core.ensureComplete(821);
            Core.logger(`Finished Quest ${i++} Times`);
        }

        Core.logger(`Farming ${item} Took ${i++} Times`);

        if (i++ > Dice) {
            Core.logger(`Perdiction: ${displayPercentage} May have been a bit Low`);
        }
        if (i++ < Dice) {
            Core.logger(`Perdiction: ${displayPercentage} Was waaaay to high... Congratulations!`);
        }

        Core.toBank(...this.rewards);
    }
}

export default function main(): void {
    const script = new LegionExercise1();
    Core.setOptions();

    script.exercise(script.rewards);

    Core.setOptions(false);
}
