/*
name: Design Notes Daily
description: Design Notes
tags: daily, design notes
*/
// Port of Scripts/Dailies/ReadTheDesignNotes.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class DesignNotes {}

export default function main(): void {
    Core.setOptions();

    Daily.designNotes();

    Core.setOptions(false);
}
