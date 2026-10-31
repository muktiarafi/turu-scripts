/*
name: SunSetDoAll
description: Completes the quest chain in /templeofdoom.
tags: templeofdoom, story, quests, templeofdoom
*/
// Port of Scripts/Story/SunSetSaga/00DoAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSunSet } from "./CoreSunSet";

const CSS = new CoreSunSet();

export class DoAllSunSet {}

export default function main(): void {
    Core.setOptions();
    CSS.doAll();
    Core.setOptions(false);
}
