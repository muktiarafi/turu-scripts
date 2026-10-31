/*
name: Granite Cove
description: This will finish the Granite Cove quest.
tags: story, quest, shadow-war, granite-cove
*/
// Port of Scripts/Story/ShadowsOfWar/04GraniteCove.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class GraniteCove {}

export default function main(): void {
    Core.setOptions();

    SoW.graniteCove();

    Core.setOptions(false);
}
