/*
name: FreakiTiki
description: This will finish the FreakiTiki quest.
tags: story, quest, memets-realm, freakitiki
*/
// Port of Scripts/Story/MemetsRealm/2FreakiTiki.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { MemetsRealm } from "./CoreMemet";

const Memet = new MemetsRealm();

export class FreakiTiki {}

export default function main(): void {
    Core.setOptions();

    Memet.freakiTiki();

    Core.setOptions(false);
}
