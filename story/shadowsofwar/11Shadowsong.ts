/*
name: Shadow Song
description: This will finish the Shadow Song quest.
tags: story, quest, shadow-war, shadow-song
*/
// Port of Scripts/Story/ShadowsOfWar/11Shadowsong.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class Shadowsong {}

export default function main(): void {
    Core.setOptions();

    SoW.shadowsong();

    Core.setOptions(false);
}
