/*
name: Complete Memets Realm Story
description: This will finish the Memets Realm story.
tags: story, quest, memets-realm, complete, all
*/
// Port of Scripts/Story/MemetsRealm/0DoAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { MemetsRealm } from "./CoreMemet";

const Memet = new MemetsRealm();

export class DoAllMemet {}

export default function main(): void {
    Core.setOptions();

    Memet.doAll();

    Core.setOptions(false);
}
