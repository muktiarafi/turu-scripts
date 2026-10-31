/*
name: Crux Ship Story
description: This will finish the Crux Ship story.
tags: story, quest, crux-ship
*/
// Port of Scripts/Story/CruxShip.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class CruxShip {
    storyLine(badge = false): void {
        if (Core.isCompletedBefore(4614)) {
            return;
        }

        Story.preLoad(this.storyLine);

        Core.equipClass(ClassType.Farm);

        //By the Power of the Moon 4598
        if (!Story.questProgression(4598)) {
            Core.ensureAccept(4598);
            Core.killMonster("CruxShip", "r2", "Left", "Shadow Locust", "Locusts Defeated", 10);
            Core.ensureComplete(4598);
        }

        //Clear the Swarm 4599
        if (!Story.questProgression(4599)) {
            Core.ensureAccept(4599);
            Core.getMapItem(3901, 2, "CruxShip");
            Core.killMonster("CruxShip", "r2", "Left", "Shadow Locust", "Locusts Defeated", 5);
            Core.ensureComplete(4599);
        }

        //Act 1 Complete 4600
        if (!Story.questProgression(4600)) {
            Core.join("cruxship", "Enter", "Spawn");
            //jumping here just autocompletes the quest..
            Core.jump("Cut1", "Left");
            bot.wait.forQuestComplete(4600);
            Core.jump("Enter", "Spawn");
        }

        //Defend the Ship! 4601 && Act 2 Complete 4602
        if (!bot.quests.isUnlocked(4603)) {
            Core.ensureAcceptmultiple(4601, 4602);
            Core.join("cruxship", "Enter", "Spawn");
            Core.jump("r5", "Left");
            Core.sleep(1500);
            Core.sendPackets(`%xt%zm%tryQuestComplete%${bot.map.roomId}%4601%-1%false%1%wvz%`);
            Core.sleep(1500);
            bot.wait.forQuestComplete(4601);
            Core.sendPackets(`%xt%zm%moveToCell%${bot.map.roomId}%Cut2%Left%`);
            Core.sleep(1500);
            Core.sendPackets(`%xt%zm%tryQuestComplete%${bot.map.roomId}%4602%1%false%1%wvz%`);
            bot.wait.forQuestComplete(4602);
            Core.sleep(1500);
            Core.jump("r6", "Left");
        }

        //Treasure Hunters Attack! 4603
        Story.killQuest(4603, "CruxShip", "Treasure Hunter");

        //Airship Sabotage 4604
        Story.mapItemQuest(4604, "CruxShip", 3902, 3);

        //Act 3 Complete 4605
        if (!Story.questProgression(4605)) {
            Core.join("cruxship", "Enter", "Spawn");
            //jumping here just autocompletes the quest..
            Core.jump("Cut3", "Left");
            bot.wait.forQuestComplete(4605);
            Core.jump("Enter", "Spawn");
        }

        //Plague in the Pyramid 4606
        if (!Story.questProgression(4606)) {
            Core.ensureAccept(4606);
            Core.huntMonster("CruxShip", "Shadow Locust", "Locusts Beaten", 12);
            Core.ensureComplete(4606);
        }

        //The Plaguebringer Appears 4607
        if (!Story.questProgression(4607)) {
            Core.ensureAccept(4607);
            Core.huntMonster("CruxShip", "Nokris Plaguebringer", "Nokris Plaguebringer Defeated");
            Core.killMonster("CruxShip", "r2", "Left", "Shadow Locust", "Locusts Defeated", 3);
            Core.ensureComplete(4607);
        }

        // Battle to the Temple
        if (!Story.questProgression(4610)) {
            Core.ensureAccept(4610);
            Core.huntMonster("CruxShip", "Ancient Mummy", "Mummy Defeated", 12);
            Core.huntMonster("CruxShip", "Treasure Hunter", "Treasure Hunter Defeated", 8);
            Core.ensureComplete(4610);
        }

        //Treasure Hunter's Last Stand 4611
        if (!Story.questProgression(4611)) {
            Core.ensureAccept(4611);
            Core.huntMonster("CruxShip", "Treasure Hunter Captain", "Captain Defeated");
            Core.huntMonster("CruxShip", "Treasure Hunter", "Treasure Hunter Defeated", 8);
            Core.ensureComplete(4611);
        }

        //Act 4 Complete 4612
        if (!Story.questProgression(4612)) {
            Core.join("cruxship", "Enter", "Spawn");
            //jumping here just autocompletes the quest..
            Core.jump("Cut4", "Left");
            bot.wait.forQuestComplete(4612);
        }

        //Apephyrx Rises 4613
        if (!Story.questProgression(4613)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(4613);
            Core.huntMonster("CruxShip", "Apephryx", "Apephryx Defeated");
            Core.ensureComplete(4613);
        }

        //Act 5 Complete 4614
        if (!Story.questProgression(4614)) {
            //jumping here just autocompletes the quest..
            Core.jump("Cut5", "Left");
            bot.wait.forQuestComplete(4612);
        }

        if (!badge) {
            return;
        }

        //100 Mummy Massacre 4616
        if (!Story.questProgression(4616)) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAccept(4616);
            Core.huntMonster("Mummies", "Mummy", "Mummy Defeated", 100);
            bot.wait.forQuestComplete(4616);
            Core.sleep(2500);
            if (Core.hasWebBadge("Mummy Slayer")) {
                return;
            } else {
                Core.ensureComplete(4616);
            }
        }
    }
}

export default function main(): void {
    const script = new CruxShip();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
