/*
name: Eden Story
description: This will finish the Eden Story.
tags: story, quest, eden
*/
// Port of Scripts/Story/Eden.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";
import { Shinkansen } from "./Shinkansen";

const Story = new CoreStory();
const Shin = new Shinkansen();

export class Eden {
    storyLine(): void {
        if (Core.isCompletedBefore(8801)) {
            return;
        }

        Shin.storyline();
        Story.preLoad(this.storyLine);

        // Welcome to Eden! 8795
        Story.killQuest(8795, "eden", "Harmless Choir");

        // The Fashion and Arcade District 8796
        if (!Story.questProgression(8796)) {
            Core.ensureAccept(8796);
            Core.huntMonster("eden", "Cosplayer", "Pictures Taken", 6);
            Core.huntMonster("eden", "Klawaii Machine", "Prize Won");
            Core.ensureComplete(8796);
        }

        // Eden City KotaMart 8797
        if (!Story.questProgression(8797)) {
            Core.ensureAccept(8797);
            Core.huntMonster("eden", "SalaryMan", "KotaMart Samples", 3);
            Core.huntMonster("eden", "SalaryMan", "Salarymen Politely Mugged", 6);
            Core.ensureComplete(8797);
        }

        // Save the Citizens! 8798
        if (!Story.questProgression(8798)) {
            Core.ensureAccept(8798);
            Story.mapItemQuest(8798, "eden", 10448, 5);
            Core.huntMonster("eden", "SalaryMan Anomaly", "Salarymen Anomalies Slain", 7);
            Core.huntMonster("eden", "Cosplayer Anomaly", "Cosplayer Anomalies Slain", 7);
            Core.huntMonster("eden", "Police Anomaly", "Police Anomalies Slain", 7);
            Core.ensureComplete(8798);
        }

        // Armorchy 8799
        Story.killQuest(8799, "eden", "CRC Power Armor");

        // Clear the Way! 8800
        if (!Story.questProgression(8800)) {
            Core.ensureAccept(8800);
            Core.getMapItem(10449, 3, "eden");
            Core.huntMonster("eden", "Yokaified Experiment 1", "Anomaly Slain", 6);
            Core.ensureComplete(8800);
        }

        // Protect the Reactor! 8801
        Story.killQuest(8801, "eden", "Major Anomaly");
    }
}

export default function main(): void {
    const script = new Eden();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
