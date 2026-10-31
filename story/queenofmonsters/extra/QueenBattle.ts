/*
name: Queen Battle (Extra)
description: This will finish the Queen Battle quest.
tags: story, quest, queen-of-monsters, queen-battle, extra
*/
// Port of Scripts/Story/QueenofMonsters/Extra/QueenBattle.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";
import { OrbHunt } from "./OrbHunt";

const Story = new CoreStory();
const orbHunt = new OrbHunt();

export class QueenBattle {
    storyLine(): void {
        orbHunt.orbHuntSaga();

        if (Core.isCompletedBefore(8361)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Forces of Chaorruption 8350
        Story.killQuest(8350, "queenbattle", "Chaorruption");

        //Phantom Chaos 8351
        Story.killQuest(8351, "queenbattle", "Chaos Ghost");

        //Spies of the Queen 8352
        Story.killQuest(8352, "queenbattle", "Chaos Sp-eye");

        //Portal of Chaos 8353
        if (!Story.questProgression(8353)) {
            Core.ensureAccept(8353);
            Core.getMapItem(9204, 1, "queenbattle");
            Core.huntMonster("queenbattle", "Chaos Ghost", "Weak Chaotic Energy", 12);
            Core.ensureComplete(8353);
        }

        //Slain Children 8354
        if (!Story.questProgression(8354)) {
            Core.ensureAccept(8354);
            Core.huntMonster("queenbattle", "Extriki Shade", "Extriki Shade Banished", undefined, { log: false });
            Core.huntMonster("queenbattle", "Kolyaban Shade", "Kolyaban Shade Banished", undefined, { log: false });
            Core.huntMonster("queenbattle", "Horothotep Shade", "Horothotep Shade Banished", undefined, { log: false });
            Core.huntMonster("queenbattle", "Sa-Laatan Shade", "Sa-Laatan Shade Banished", undefined, { log: false });
            Core.huntMonster(`queenbattle`, "Grou'luu Shade", "Grou'luu Shade Banished", undefined, { log: false });
            Core.ensureComplete(8354);
        }

        //Dragons Felled By Chaos 8355
        Story.killQuest(8355, "queenbattle", "Chaos Dracolich");

        //The Queen's Generals 8356
        Story.killQuest(8356, "queenbattle", "Chaos General");

        //Portal of Chaos II 8357
        if (!Story.questProgression(8357)) {
            Core.ensureAccept(8357);
            Core.huntMonster("queenbattle", "Chaos General", "Potent Chaotic Energy", 12, { log: false });
            Story.mapItemQuest(8357, "queenbattle", 9205);
        }

        //Guilt of the Past 8358
        Story.killQuest(8358, "queenbattle", "Chaotic Guilt");

        //A Giant of Chaos 8359
        Story.killQuest(8359, "queenbattle", "Chaos Giant");

        //The First Champion of Chaos 8360
        if (!Story.questProgression(8360)) {
            Core.ensureAccept(8360);
            Core.huntMonster("queenbattle", "Proto Chaos Champion", "Proto Chaos Champion Defeated", undefined, {
                log: false,
            });
            Core.ensureComplete(8360);
        }

        //The Queen of Monsters 8361
        if (!Story.questProgression(8361)) {
            Core.ensureAccept(8361);
            Core.huntMonster("queenbattle", "Queen of Monsters", "Queen of Monsters Sealed", undefined, { log: false });
            Core.ensureComplete(8361);
        }
    }
}

export default function main(): void {
    const script = new QueenBattle();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
