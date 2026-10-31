/*
name: Fiend Past
description: This will finish the Fiend Past quest.
tags: story, quest, fiend-past, nation
*/
// Port of Scripts/Story/Nation/FiendPast.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class FiendPast {
    doAll(): void {
        if (Core.isCompletedBefore(8495)) {
            return;
        }

        Story.preLoad(this.doAll);

        //Test the Newborn Fiends 8478
        Story.killQuest(8478, "fiendpast", "Newborn Fiend");

        //Best the Hex 8479
        Story.killQuest(8479, "fiendpast", "Hex Fiend");

        //Grunt Work 8480
        Story.killQuest(8480, "fiendpast", "Hex Fiend");

        //Defeat the Fiend Champion 8481
        Story.killQuest(8481, "fiendpast", "Fiend Champion");

        //Bring Their Doom 8482
        Story.killQuest(8482, "fiendpast", "DoomBringer");

        //Form A Perimeter 8483
        Story.mapItemQuest(8483, "fiendpast", 9556, 3);

        //Wrathful Wraiths 8484
        Story.killQuest(8484, "fiendpast", "Doom Wraith");

        //Defeat Scarvitas 8485
        Story.killQuest(8485, "fiendpast", "Scarvitas");

        //Seal Maintenance 8486
        if (!Story.questProgression(8486)) {
            Core.ensureAccept(8486);
            Core.getMapItem(9557, 4, "fiendpast");
            Core.huntMonster("fiendpast", "Avarice Guard", "Guard Energy Collected", 8);
            Core.ensureComplete(8486);
        }

        //Traitors Are Null And Void 8487
        Story.killQuest(8487, "fiendpast", "Void Fiend");

        //Greedy Imprisonment 8488
        Story.killQuest(8488, "fiendpast", "Avarice");

        //Defeat Baelgar 8489
        if (!Story.questProgression(8489)) {
            bot.map.reload();
            Core.ensureAccept(8489);
            Core.killMonster("fiendpast", "r11", "Left", "Baelgar", "Baelgar Defeated");
            Core.ensureComplete(8489);
        }

        //The Legion? 8490
        Story.killQuest(8490, "fiendpast", "Proto-Legion Knight");

        //Dealing With Defectors 8491
        Story.killQuest(8491, "fiendpast", "Nation Defector");

        //Ward Destruction 8492
        Story.mapItemQuest(8492, "fiendpast", 9558, 6);

        //The Traitor’s Path 8493
        if (!Story.questProgression(8493)) {
            Core.ensureAccept(8493);
            Story.mapItemQuest(8493, "fiendpast", 9559);
            Core.huntMonster("fiendpast", "Nation Defector", "Forces Defeated", 12);
            Core.huntMonster("fiendpast", "Proto-Legion Knight", "Dage's Key");
            Core.ensureComplete(8493);
        }

        //Defeat Dage the Lich 8494
        Story.killQuest(8494, "fiendpast", "Dage the Lich");
    }
}

export default function main(): void {
    const script = new FiendPast();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
