/*
name: Yes Ma'am
description: Runs the Back-to-School 'Yes Ma'am!' test quest chain [10815 - 10823].
tags: back-to-school, yes maam, seasonal, quest chain, extra credit
*/
// Port of Scripts/Seasonal/BackToSchool/YesMaam.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class YesMaam {
    doChain(): void {
        if (!Core.isSeasonalMapActive("extracredit")) {
            return;
        }

        Core.addDrop("1st Grade School Supplies");
        Core.equipClass(ClassType.Farm);

        // Test #1: Physical Education
        this.test(10815, () => {
            Core.getMapItem(15995, 1, "swordhaven");
            Core.getMapItem(15996, 1, "mythsong");
            Core.getMapItem(15997, 1, "sandsea");
            Core.getMapItem(15998, 1, "embersea");
        });

        // Test #2: History
        this.test(10816, () => {
            Core.killMonster("bloodtusk", "r3", "Center", "Crystal-Rock", "Crystal-Rock Collected", 2);
            Core.killMonster("bloodtusk", "r3", "Center", "Rock", "Rock Collected", 2);
        });

        // Test #3: Math — hunt (not fixed-cell) since these monsters aren't in the listed cell
        this.test(10817, () => {
            Core.huntMonster("blackhorn", "Tomb Spider", "Tomb Spider Legs", 25);
            Core.huntMonster("boxes", "Grizzlespit", "Grizzlespit Beard Hair", 500);
            Core.huntMonster("arcangrove", "Gorillaphant", "Gorillaphant Hair", 1000);
        });

        // Test #4: Reading and Writing
        this.test(10818, () => {
            Core.getMapItem(15999, 3, "extracredit");
            Core.killMonster("extracredit", "r5", "Left", "Cute But Evil: A+", "Denied Cat From Eating Homework", 1);
        });

        // Test #5: Science
        this.test(10819, () => Core.getMapItem(16000, 1, "swordhaven"));

        // Outsourcing for Resources
        this.test(10820, () => {
            Core.killMonster("deltavlab", "r2", "Left", "Lab Guard", "Steel Pieces", 6);
            Core.killMonster("redfurvalley", "r2", "Right", "*", "Drone Wires", 12);
        });

        // Test #Subject — kill until the quest is completable (item name/temp status varies)
        this.test(10821, () => {
            while (!bot.shouldExit && !bot.quests.canComplete(10821)) {
                Core.killMonster("orctown", "Tower", "Right", "General Porkon");
            }
        });

        // Return to Yes Ma'am
        this.test(10822, () => Core.getMapItem(16001, 1, "extracredit"));

        // Test #5.5: Battle
        this.test(10823, () =>
            Core.killMonster(
                "extracredit",
                "r6",
                "Left",
                "Mind-Controlled Porkon",
                "Mind-Controlled Porkon Defeated",
                1,
            ),
        );
    }

    private test(questID: number, steps: () => void): void {
        if (Core.isCompletedBefore(questID)) {
            return;
        }

        Core.ensureAccept(questID);
        steps();
        Core.ensureComplete(questID);
    }
}

export default function main(): void {
    const script = new YesMaam();
    Core.setOptions();

    script.doChain();

    Core.setOptions(false);
}
