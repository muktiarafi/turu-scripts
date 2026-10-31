/*
name: Ravenloss Saga Story
description: This will finish the Ravenloss Saga Story.
tags: story, quest, ravenloss-saga
*/
// Port of Scripts/Story/RavenlossSaga.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class RavenlossSaga {
    doAll(): void {
        if (Core.isCompletedBefore(3460)) {
            return;
        }

        this.twilightEdge();
        this.weaverWar();
        this.ravenloss();
    }

    twilightEdge(): void {
        if (Core.isCompletedBefore(3428)) {
            return;
        }

        //Clear Twilight’s Edge 3428
        Story.mapItemQuest(3428, "TwilightEdge", 2577);
    }

    weaverWar(): void {
        if (Core.isCompletedBefore(3439)) {
            return;
        }

        this.twilightEdge();

        Story.preLoad(this.weaverWar);

        //Cleanse Swordhaven 3429
        if (!Story.questProgression(3429)) {
            Core.ensureAccept(3429);
            Core.getMapItem(2578, 1, "WeaverWar");
            Core.killMonster("WeaverWar", "s1", "Spawn", "Weaver Queen's Hound", "Weaver Hounds Slain", 6);
            Core.ensureComplete(3429);
        }

        //Cleanse Faerie Forest 3430
        if (!Story.questProgression(3430)) {
            Core.ensureAccept(3430);
            Core.getMapItem(2579, 1, "WeaverWar");
            Core.killMonster("WeaverWar", "f1", "Spawn", "ChaosWeaver Mage", "Spider Slain", 6);
            Core.ensureComplete(3430);
        }

        //Cleanse DarkoviaGrave 3431
        if (!Story.questProgression(3431)) {
            Core.ensureAccept(3431);
            Core.getMapItem(2580, 1, "WeaverWar");
            Core.killMonster("WeaverWar", "d1", "Spawn", "Dread Arysa", "Arysa Slain", 6);
            Core.ensureComplete(3431);
        }

        //Cleanse Doomwood Forest 3432
        if (!Story.questProgression(3432)) {
            Core.ensureAccept(3432);
            Core.getMapItem(2581, 1, "WeaverWar");
            Core.killMonster("WeaverWar", "do1", "Spawn", "Weaver Queen's Hound", "Weaver Hound Slain", 6);
            Core.ensureComplete(3432);
        }

        //Cleanse Firestorm 3433
        if (!Story.questProgression(3433)) {
            Core.ensureAccept(3433);
            Core.getMapItem(2582, 1, "WeaverWar");
            Core.killMonster("WeaverWar", "fr1", "Spawn", "ChaosWeaver Mage", "Weaver Slain", 6);
            Core.ensureComplete(3433);
        }

        //Cleanse Northlandlights 3434
        if (!Story.questProgression(3434)) {
            Core.ensureAccept(3434);
            Core.getMapItem(2583, 1, "WeaverWar");
            Core.killMonster("WeaverWar", "n1", "Spawn", "Evolved Dreadspider", "Spider Slain", 6);
            Core.ensureComplete(3434);
        }

        //Cleanse Battleunder 3435
        if (!Story.questProgression(3435)) {
            Core.ensureAccept(3435);
            Core.getMapItem(2584, 1, "WeaverWar");
            Core.killMonster("WeaverWar", "b1", "Spawn", "Dread Arysa", "Arysa Slain", 6);
            Core.ensureComplete(3435);
        }

        //Cleanse Guru Forest 3436
        if (!Story.questProgression(3436)) {
            Core.ensureAccept(3436);
            Core.getMapItem(2585, 1, "WeaverWar");
            Core.killMonster("WeaverWar", "g1", "Spawn", "ChaosWeaver Mage", "Weaver Slain", 6);
            Core.ensureComplete(3436);
        }

        //Cleanse Sleuthhound Inn 3437
        if (!Story.questProgression(3437)) {
            Core.ensureAccept(3437);
            Core.getMapItem(2586, 1, "WeaverWar");
            Core.killMonster("WeaverWar", "sl1", "Spawn", "ChaosWeaver Mage", "Weaver Slain", 6);
            Core.ensureComplete(3437);
        }

        //Cleanse Battleon 3438
        if (!Story.questProgression(3438)) {
            Core.ensureAccept(3438);
            Core.getMapItem(2587, 1, "WeaverWar");
            Core.killMonster("WeaverWar", "ba1", "Spawn", "Evolved Dreadspider", "Spider Slain", 6);
            Core.ensureComplete(3438);
        }

        //Save the SoulWeaver 3439
        Story.killQuest(3439, "TwilightEdge", "ChaosWeaver Warrior");
    }

    ravenloss(): void {
        if (Core.isCompletedBefore(3460)) {
            return;
        }

        this.weaverWar();

        Story.preLoad(this.ravenloss);

        //Chaos Weavers' Magic  3450
        Story.killQuest(3450, "RavenLoss", "ChaosWeaver Magi");

        //Legendary Heroes of the Chaos Weavers 3451
        Story.killQuest(3451, "RavenLoss", "ChaosWeaver Knight");

        //Weaver Tales and Legends 3452
        Story.mapItemQuest(3452, "RavenLoss", 2594);

        //Weaving Rebellion 3453
        Story.killQuest(3453, "RavenLoss", "Weaver Queen's Hound");

        //Weaver Tactics and Strategy 3454
        Story.killQuest(3454, "RavenLoss", "ChaosWeaver Knight");

        //Rulers of the Chaos Weavers 3455
        Story.killQuest(3455, "RavenLoss", "ChaosWeaver Knight");

        //Fate and Saviors 3456
        Story.killQuest(3456, "RavenLoss", "ChaosWeaver Magi");

        //The Nature of Chaos 3457
        Story.killQuest(3457, "RavenLoss", "ChaosWeaver Magi");

        //Chaos Weaver Tribes 3458
        Story.mapItemQuest(3458, "RavenLoss", 2595);

        //Chaos Weaver Castes 3459
        Story.killQuest(3459, "RavenLoss", "Evolved Dreadspider");

        //Defeat the ChaosWeaver Cleric 3460
        Story.killQuest(3460, "ChaosWeb", "ChaosWeaver Cleric");
    }
}

export default function main(): void {
    const script = new RavenlossSaga();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
