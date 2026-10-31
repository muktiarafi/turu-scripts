/*
name: Templeofdoom
description: Completes the quest chain in /templeofdoom.
tags: templeofdoom, story, quests, templeofdoom
*/
// Port of Scripts/Story/SunSetSaga/01Templeofdoom.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSunSet } from "./CoreSunSet";

const CSS = new CoreSunSet();

export class Templeofdoom {}

export default function main(): void {
    Core.setOptions();
    CSS.templeofDoom();
    Core.setOptions(false);
}
