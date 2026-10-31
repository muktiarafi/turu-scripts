/*
name: The Queen's Secrets
description: This will finish the The Queen's Secrets quest.
tags: story, quest, queen-of-monsters, the-queens-secrets
*/
// Port of Scripts/Story/QueenofMonsters/9TheQueensSecrets.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreQOM } from "./CoreQoM";

const QOM = new CoreQOM();

export class TheQueensSecrets {}

export default function main(): void {
    Core.setOptions();

    QOM.theQueensSecrets();

    Core.setOptions(false);
}
