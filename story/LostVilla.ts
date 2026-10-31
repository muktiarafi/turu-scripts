/*
name: Lost Villa
description: This script will complete the questline in /lostvilla.
tags: lostvilla, diabolical, story, hikari, ira
*/
// Port of Scripts/Story/LostVilla.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";
import { Banished } from "./Banished";
import { CoreQOM } from "./queenofmonsters/CoreQoM";

const Story = new CoreStory();
const Ban = new Banished();
const coreQOM = new CoreQOM();

export class LostVilla {
    storyline(): void {
        if (Core.isCompletedBefore(9570)) {
            return;
        }

        coreQOM.theBook();
        Ban.himisQuests();

        Story.preLoad(this.storyline);

        // Scout Ahead (9561)
        if (!Story.questProgression(9561)) {
            Core.ensureAccept(9561);
            Core.getMapItems(
                [
                    [12649, 1],
                    [12650, 1],
                ],
                "lostvilla",
            );
            Core.huntMonster("lostvilla", "Eldritch Parasite", "Parasite Exterminated", 8);
            Core.ensureComplete(9561);
        }

        // Gluttonous Slithering (9562)
        Story.killQuest(9562, "lostvilla", "Gorewyrm");

        // Relics of Bygone Days (9563)
        if (!Story.questProgression(9563)) {
            Core.ensureAccept(9563);
            Core.getMapItem(12651, 1, "lostvilla");
            Core.huntMonster("lostvilla", "Eldritch Parasite", "Armory Guards Eradicated", 8);
            Core.ensureComplete(9563);
        }

        // Rapacious Desires (9564)
        if (!Story.questProgression(9564)) {
            Core.ensureAccept(9564);
            Core.getMapItem(12652, 3, "lostvilla");
            Core.huntMonster("lostvilla", "Diabolical Hoard", "Hoard's Treasures", 10);
            Core.ensureComplete(9564);
        }

        // Uninvited Guests (9565)
        if (!Story.questProgression(9565)) {
            Core.ensureAccept(9565);
            Core.huntMonster("lostvilla", "Gorewyrm", "Gorewyrm Gored", 4);
            Core.huntMonster("lostvilla", "Eldritch Parasite", "Parasite Exoskeleton", 6);
            Core.ensureComplete(9565);
        }

        // Key of Life (9566)
        if (!Story.questProgression(9566)) {
            Core.ensureAccept(9566);
            Core.getMapItem(12653, 1, "lostvilla");
            Core.huntMonster("lostvilla", "Diabolical Hoard", "Mimic's Coin", 8);
            Core.ensureComplete(9566);
        }

        // Proper Procedures (9567)
        if (!Story.questProgression(9567)) {
            Core.ensureAccept(9567);
            Core.getMapItem(12654, 1, "lostvilla");
            Core.huntMonster("noxustower", "Lightguard Caster", "Necrotic Tome", 1);
            Core.ensureComplete(9567);
        }

        // A Peculiar Feast (9568)
        Story.killQuest(9568, "lostvilla", "Mutilated Atrocity");

        // Clingy Creatures (9569)
        Story.killQuest(9569, "lostvilla", "Eldritch Parasite");

        // Disfigured Aristrocrat (9570)
        Story.killQuest(9570, "lostvilla", "Covetous Disgrace");
    }
}

export default function main(): void {
    const script = new LostVilla();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
