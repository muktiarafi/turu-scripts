/*
name: Noobshire Story
description: This will finish the Noobshire Story.
tags: story, quest, noobshire
*/
// Port of Scripts/Story/Noobshire.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Noobshire {
    doAll(): void {
        Story.preLoad(this.doAll);
        this.rolithQuests();
        this.lowellCatQuests();
    }

    rolithQuests(): void {
        if (Core.isCompletedBefore(118)) {
            return;
        }

        //Defend the Rats 32
        Story.killQuest(32, "noobshire", "Kittarian Mouse Eater");

        //Rats in the Cradle 33
        if (!Story.questProgression(33)) {
            Core.ensureAccept(33);
            Core.getMapItem(11, 6, "noobshire");
            Core.huntMonster("noobshire", "Horc Noob", "Horc Cheese", 1);
            Core.ensureComplete(33);
        }

        //Short in Spoons 35
        Story.killQuest(35, "noobshire", "Kittarian Mouse Eater");

        //Short in Forks 36
        Story.killQuest(36, "noobshire", "Kittarian Mouse Flayer");

        //Letter Interception 37
        Story.killQuest(37, "noobshire", "Horc Noob");

        //Not A Noob 38
        Story.killQuest(38, "noobshire", "Horc Trainer");

        //Missing King 39
        if (!Story.questProgression(39)) {
            Core.ensureAccept(39);
            Core.getMapItem(12, 1, "noobshire");
            Core.huntMonster("noobshire", "Horc Noob", "Rat King Clue", 1);
            Core.ensureComplete(39);
        }

        // [[[Tutor]]]

        // Fighting Exercise 117
        Story.killQuest(117, "Tutor", "Horc Noob");

        // Tougher Monsters 118
        Story.killQuest(118, "Tutor", "Horc Tutor Trainer");
    }

    lowellCatQuests(): void {
        if (!Core.isMember) {
            return;
        }

        if (Core.isCompletedBefore(2196)) {
            return;
        }

        //PORKON RIPOFF 2188
        Story.killQuest(2188, "orctown", "General Porkon");

        //GRILL THE LOCALS 2189
        Story.killQuest(2189, "noobshire", "Horc Noob");

        //DOGEAR THE CAT BURGLAR 2190
        if (!Story.questProgression(2190)) {
            Core.ensureAccept(2190);
            Core.huntMonster("newbie", "Dogear", "Front Wheel Location");
            Core.huntMonster("newbie", "Dogear", "Frame Location");
            Core.huntMonster("newbie", "Dogear", "Back Wheel Location");
            Core.ensureComplete(2190);
        }

        //BLOODTUSK CATWALK 2191
        Story.mapItemQuest(2191, "bloodtusk", 1270);

        //You scratch me back... 2192
        Story.killQuest(2192, "bloodtusk", "Horc Boar Scout");

        //...And me scratch yours 2193
        Story.killQuest(2193, "bloodtusk", "Rhison");

        //Sign here 2194
        Story.mapItemQuest(2194, "noobshire", 1271);

        //THE FRAME UP 2195
        Story.killQuest(2195, "sandport", "Horc Sell-Sword");

        //THAT DARN CAT 2196
        Story.killQuest(2196, "giant", "Giant Cat");
    }
}

export default function main(): void {
    const script = new Noobshire();
    Core.setOptions();
    script.doAll();
    Core.setOptions(false);
}
