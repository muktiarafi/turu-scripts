/*
name: Dragon Road Story (Upholder)
description: This will finish the Dragon Road Story.
tags: story, quest, dragon-road
*/
// Port of Scripts/Story/DragonRoad[Upholder].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class DragonRoad {
    storyLine(): void {
        if (!Core.isUpholder() || Core.isCompletedBefore(4547)) {
            Core.logger(!Core.isUpholder() ? "Not an upholder." : "Quest Already complete");
            return;
        }

        Story.preLoad(this.storyLine);

        //Obtain the DragonStar Radar 4534
        if (
            !Story.questProgression(4534) ||
            !Core.checkInventory("Dragon Star Radar") ||
            !Core.checkInventory("DragonStar Map")
        ) {
            Core.addDrop("Dragon Star Radar", "DragonStar Map");
            Core.ensureAccept(4534);
            Core.getMapItem(3750, 1, "BattleonTown");
            Core.getMapItem(3751, 1, "Arcangrove");
            Core.getMapItem(3752, 1, "Dragonrune");
            Core.ensureComplete(4534);
        }

        //Find the First DragonStar Crystal 4535
        if (!Story.questProgression(4535)) {
            Core.ensureAccept(4535);
            Core.getMapItem(3761, 1, "DragonRoad");
            Core.huntMonster("Natatorium", "Anglerfish", "First DragonStar Found");
            Core.ensureComplete(4535);
        }

        //Find the Second DragonStar Crystal  4536
        if (!Story.questProgression(4536)) {
            Core.ensureAccept(4536);
            Core.getMapItem(3754, 1, "OnslaughtTower");
            Core.getMapItem(3762, 1, "DragonRoad");
            Core.ensureComplete(4536);
        }

        //Find the Third DragonStar Crystal  4537
        if (!Story.questProgression(4537)) {
            Core.ensureAccept(4537);

            // Force join and jump, as xantown is force aggroed
            Core.join("XanTown");
            Core.jump("r12");
            Core.getMapItem(3756, 1, "XanTown");
            if (bot.map.name === "xantown") {
                Core.jump("r12", "Left");
            }
            // map is aggro af this is a safe cell. aggro af this is a safe cell.
            Core.getMapItem(3763, 1, "DragonRoad");
            Core.ensureComplete(4537);
        }

        //Find the Fourth DragonStar Crystal 4538
        if (!Story.questProgression(4538)) {
            Core.ensureAccept(4538);
            Core.huntMonster("lair", "Onyx Lava Dragon", "Fourth DragonStar Found", 1);
            Core.huntMonster("lair", "Onyx Lava Dragon", "Radar Recharged", 1);
            Core.ensureComplete(4538);
        }

        //Find the Fifth DragonStar Crystal 4539
        if (!Story.questProgression(4539)) {
            Core.ensureAccept(4539);
            Core.getMapItem(3765, 1, "DragonRoad");
            Core.huntMonster("EarthStorm", "Diamond Golem", "Fifth DragonStar Found");
            Core.ensureComplete(4539);
        }

        //Find the Sixth DragonStar Crystal  4540
        if (!Story.questProgression(4540)) {
            Core.ensureAccept(4540);
            Core.getMapItem(3758, 1, "Bamboo");
            Core.getMapItem(3766, 1, "DragonRoad");
            Core.ensureComplete(4540);
        }

        //Raid the Bandits 4541
        Story.killQuest(4541, "DragonRoad", "Desert Wolf Bandit");

        //HAMmer the Fabled Oinklong 4542
        Story.killQuest(4542, "DragonRoad", "Oinklong");

        //Defeat the Great Horccolo 4543
        Story.killQuest(4543, "DragonRoad", "Horccolo");

        //Eliminate the Legion Cyborgs 4544
        if (!Story.questProgression(4544)) {
            Core.ensureAccept(4544);
            Core.huntMonster("dragonroad", "Cyborg 81", "Cyborg 81 Defeated");
            Core.huntMonster("dragonroad", "Cyborg 71", "Cyborg 71 Defeated");
            Core.ensureComplete(4544);
        }

        //Pulverize Majic Guu  4545
        Story.killQuest(4545, "DragonRoad", "Majic Guu");

        //Cleaning up the Guu  4546
        Story.mapItemQuest(4546, "DragonRoad", 3759, 10);

        //Defeat Super Dragon Twig! 4547
        Story.killQuest(4547, "DragonRoad", "Super Dragon Twig");
    }
}

export default function main(): void {
    const script = new DragonRoad();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
