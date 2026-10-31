/*
name: Blood Moon
description: This will complete the Blood Moon story.
tags: story, quest, blood, moon, maxius
*/
// Port of Scripts/Story/BloodMoon.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, type EventMap } from "turu";
import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class BloodMoon {
    bloodMoonSaga(): void {
        if (Core.isCompletedBefore(6067)) {
            return;
        }

        this.bloodMoonMap();
        this.maxius();
    }

    bloodMoonMap(): void {
        if (Core.isCompletedBefore(6058)) {
            return;
        }

        Story.preLoad(this.bloodMoonMap);

        //Get Out! 6048
        Story.mapItemQuest(6048, "bloodmoon", 5451);
        Story.killQuest(6048, "bloodmoon", "Darkness");

        //The Court of The King 6049
        Story.killQuest(6049, "bloodmoon", "Constantin");

        //Hungry like the ... Lycan? 6050
        Story.mapItemQuest(6050, "bloodmoon", 5452);

        //The Sounds of Music? 6051
        Story.mapItemQuest(6051, "bloodmoon", [5453, 5454, 5455]);

        //Roll the Stones? 6052
        Story.mapItemQuest(6052, "bloodmoon", 5456, 2);

        //Creepy Spooky Monsters 6053
        Story.killQuest(6053, "bloodmoon", "Spooky Fur");

        //Down the Hole 6054
        Story.mapItemQuest(6054, "bloodmoon", 5457);

        //Beat This 6055
        Story.killQuest(6055, "bloodmoon", ["Frankentacles", "Spidderbeast"]);

        //Insane in the Brain? 6056
        Story.mapItemQuest(6056, "bloodmoon", 5458);

        //No Surprise 6057
        Story.killQuest(6057, "bloodmoon", "Black Unicorn");

        //Killer Kitty 6058
        Story.killQuest(6058, "bloodmoon", "Bubble");
    }

    maxius(): void {
        if (Core.isCompletedBefore(6067)) {
            return;
        }

        Story.preLoad(this.maxius);

        // //Ghoul, Ghoul, Ghoul 6063
        Story.killQuest(6063, "maxius", "Ghoul Minion");

        //Get Him! 6064
        if (!Story.questProgression(6064)) {
            // Bot.Events.CellChanged += CutSceneFixer;
            Core.ensureAccept(6064);
            Core.huntMonsterMapID("maxius", 6, "Count Maxius Defeated");
            Core.ensureComplete(6064);
        }

        // //Minions Everywhere 6065
        Story.killQuest(6065, "maxius", "Vampire Minion");

        //Get Barnabus! 6066
        if (!Story.questProgression(6066)) {
            // Bot.Events.CellChanged += CutSceneFixer;
            Core.ensureAccept(6066);
            Core.huntMonster("maxius", "Barnabus", "Barnabus Defeated");
            Core.ensureComplete(6066);
        }

        //An End To This Threat 6067
        if (!Story.questProgression(6067)) {
            bot.wait.forCellChange("Cut5");
            // Bot.Events.CellChanged += CutSceneFixer;
            Core.ensureAccept(6067);
            Core.jump("r6");
            Core.huntMonsterMapID("maxius", 13, "Count Maxius Slain");
            Core.ensureComplete(6067);
        }
    }

    private cutSceneFixer = ({ map, cell, pad }: EventMap["cellChanged"]): void => {
        // /if more maps get stuck, just fillin the bit below.
        if (map === "maxius") {
            while (!bot.shouldExit && bot.player.cell === "Cut2") {
                Core.sleep(2500);
                Core.jump("r3");
                Core.sleep(2500);
            }

            while (!bot.shouldExit && bot.player.cell === "Cut3") {
                Core.sleep(2500);
                Core.jump("r5");
                Core.sleep(2500);
            }

            while (!bot.shouldExit && bot.player.cell === "Cut5") {
                Core.sleep(2500);
                Core.jump("r6");
                Core.sleep(2500);
            }
        }
        bot.events.off("cellChanged", this.cutSceneFixer);
    };
}

export default function main(): void {
    const script = new BloodMoon();
    Core.setOptions();

    script.bloodMoonSaga();

    Core.setOptions(false);
}
