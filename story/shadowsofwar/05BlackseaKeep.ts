/*
name: Blacksea Keep
description: This will finish the Blacksea Keep quest.
tags: story, quest, shadow-war, blacksea-keep
*/
// Port of Scripts/Story/ShadowsOfWar/05BlackseaKeep.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class BlackseaKeep {}

export default function main(): void {
    Core.setOptions();

    SoW.blackseaKeep();

    Core.setOptions(false);
}
