/*
name: Legion Exercise Number 4
description: This script will complete "Legion Exercise Number 4" quest.
tags: legion, exercise, legion exercise, 4, corrupted, corrupted dragon, corrupted dragon slayer, judgement, judgement scythe, painsaw, painsaw of eidolon, soul eater, soul eater advanced
*/
// Port of Scripts/Legion/LegionExcercise/LegionExercise4.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core, randomInt } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Legion = new CoreLegion();

export class LegionExercise4 {
    rewards: string[] = [
        "Corrupted Dragon Slayer",
        "Judgement Scythe",
        "PainSaw of Eidolon",
        "Soul Eater Advanced",
        "Legion Token",
    ];

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

        while (
            !bot.shouldExit &&
            !Core.checkInventory([
                "Corrupted Dragon Slayer",
                "Judgement Scythe",
                "PainSaw of Eidolon",
                "Soul Eater Advanced",
            ])
        ) {
            Core.ensureAccept(824);
            Core.equipClass(ClassType.Farm);
            Core.killMonster("doomhaven", "r4", "Down", "Skeletal Ice Mage", "Frostbit Skull", 15);
            Core.huntMonster("Marsh2", "Lesser Shadow Serpent", "Potent Viper's Blood");
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("Marsh2", "Soulseeker", "Soul Scythe", undefined, { isTemp: false });
            Core.ensureComplete(824);
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
    const script = new LegionExercise4();
    Core.setOptions();

    script.exercise(script.rewards);

    Core.setOptions(false);
}
