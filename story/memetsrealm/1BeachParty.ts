/*
name: Beach Party
description: This will finish the Beach Party quest.
tags: story, quest, memets-realm, beach-party
*/
// Port of Scripts/Story/MemetsRealm/1BeachParty.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { MemetsRealm } from "./CoreMemet";

const Memet = new MemetsRealm();

export class BeachParty {}

export default function main(): void {
    Core.setOptions();

    Memet.beachParty();

    Core.setOptions(false);
}
