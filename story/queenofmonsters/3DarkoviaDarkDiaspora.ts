/*
name: Darkovia Dark Diaspora
description: This will finish the Darkovia Dark Diaspora quest.
tags: story, quest, queen-monsters, darkovia-dark-diaspora
*/
// Port of Scripts/Story/QueenofMonsters/3DarkoviaDarkDiaspora.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreQOM } from "./CoreQoM";

const QOM = new CoreQOM();

export class CompleteDarkDiaspora {}

export default function main(): void {
    Core.setOptions();

    QOM.darkoviaDarkDiaspora();

    Core.setOptions(false);
}
