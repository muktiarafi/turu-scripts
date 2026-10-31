/*
name: Legion Exercise Number 3
description: This script will complete "Legion Exercise Number 3" quest.
tags: legion, exercise, legion exercise, 3, judgement hammer
*/
// Port of Scripts/Legion/LegionExcercise/LegionExercise3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core, randomInt } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Legion = new CoreLegion();

export class LegionExercise3 {
    rewards: string[] = ["Judgement Hammer", "Legion Token"];

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
        //-------------------------------------------------------------------------------------------------------

        let i = 1;
        const displayPercentage = `${`${((Dice / 100) * 100).toFixed(2)} %`}`;

        Core.logger(`Potato Prediction Inc. Decided: ${displayPercentage} is The Chance for Desired Rewards.`);

        while (!bot.shouldExit) {
            Core.ensureAccept(823);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("Uppercity", "Chaos Egg", "Chaos Egg", 24, { isTemp: false });
            Core.killMonster("chaosmarsh", "Forest3", "Left", "Chaos Spider", "Chaorrupted Essence", 50, {
                isTemp: false,
                publicRoom: false,
            });

            Core.equipClass(ClassType.Solo);
            Core.huntMonster("Underworld", "Dreadfiend Of Nulgath", "Darkness Core", undefined, { publicRoom: false });

            Core.ensureComplete(823);
            if (bot.drops.exists("Judgement Hammer")) {
                bot.wait.forPickup("Judgement Hammer");
            }

            if (Core.checkInventory("Judgement Hammer")) {
                Core.logger(`${this.rewards} Aquired`);
                Core.logger(`Farming Took ${i++} Times`);
            }
        }

        if (Dice > i++) {
            Core.logger(`Perdiction: [${Dice}] was Higher... Congratulations!`);
        }

        Core.logger(`Perdiction: [${Dice}] was lower... sorry it took so long D:!`);

        Core.toBank(...this.rewards);
    }
}

export default function main(): void {
    const script = new LegionExercise3();
    Core.setOptions();

    script.exercise(script.rewards);

    Core.setOptions(false);
}
