/*
name: Spookeasy
description: This will finish the Spookeasy quest.
tags: story, quest, memets-realm, spookeasy
*/
// Port of Scripts/Story/MemetsRealm/4Spookeasy.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { MemetsRealm } from "./CoreMemet";

const Memet = new MemetsRealm();

export class Spookeasy {}

export default function main(): void {
    Core.setOptions();

    Memet.spookeasy();

    Core.setOptions(false);
}
