/*
name: Neo Fortress
description: This script will complete the storyline in /neofortress.
tags: hollowborn, saga, trygve, neofortress, lae
*/
// Port of Scripts/Story/Hollowborn/02NeoFortress.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHollowbornStory } from "./CoreHollowbornStory";

const HB = new CoreHollowbornStory();

export class NeoFortress {}

export default function main(): void {
    Core.setOptions();

    HB.neoFortress();

    Core.setOptions(false);
}
