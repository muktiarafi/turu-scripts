/*
name: Dream Master
description: This will finish the Dream Master quest.
tags: story, quest, memets-realm, dream-master
*/
// Port of Scripts/Story/MemetsRealm/5DreamMaster.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { MemetsRealm } from "./CoreMemet";

const Memet = new MemetsRealm();

export class DreamMaster {}

export default function main(): void {
    Core.setOptions();

    Memet.dreamMaster();

    Core.setOptions(false);
}
