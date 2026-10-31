/*
name: Legion Exercise Number 2
description: This script will complete "Legion Exercise Number 2" quest.
tags: legion exercise, 2, executioner, executioner's judgement, legion, undead champion
*/
// Port of Scripts/Legion/LegionExcercise/LegionExercise2.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core, randomInt } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Legion = new CoreLegion();

export class LegionExercise2 {
    rewards: string[] = ["Executioner's Judgement", "legion Token"];

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

        while (!bot.shouldExit && !Core.checkInventory(["Executioner's Judgement"])) {
            Core.ensureAccept(822);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("darkoviagrave", "Skeletal Fire Mage", "Charred Skull", 20, {
                isTemp: false,
                publicRoom: false,
            });
            Core.huntMonster("mudluk", "Tiger Leech", "Intact Tiger Leech Hide", undefined, { publicRoom: false });
            Core.sleep(2500);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("sewer", "Grumble", "Grumble's Curse", undefined, { isTemp: false, publicRoom: false });
            Core.ensureComplete(822);
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
    const script = new LegionExercise2();
    Core.setOptions();

    script.exercise(script.rewards);

    Core.setOptions(false);
}
