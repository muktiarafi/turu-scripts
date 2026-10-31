/*
name: Complete Celestial Realm
description: This will complete the Celestial Realm story arc.
tags: story, quest, queen-of-monsters, celestial-realm-at-theft-of-light
*/
// Port of Scripts/Story/QueenofMonsters/1CelestialRealmATheftofLight.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreQOM } from "./CoreQoM";

const QOM = new CoreQOM();

export class CompleteCelestialRealm {}

export default function main(): void {
    Core.setOptions();

    QOM.aTheftofLight();

    Core.setOptions(false);
}
