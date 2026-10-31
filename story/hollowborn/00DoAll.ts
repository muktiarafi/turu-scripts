/*
name: Hollowborn Saga
description: This script will complete Hollowborn Saga.
tags: hollowborn, saga, trygve, neofortress, lae, treasure hunt, lae birthday, shadowrealm, whispering helmet, neotower,dawnsanctum,neo tower,dawn sanctum,quest
*/
// Port of Scripts/Story/Hollowborn/00DoAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHollowbornStory } from "./CoreHollowbornStory";

const HB = new CoreHollowbornStory();

export class DoAllHB {}

export default function main(): void {
    Core.setOptions();

    HB.doAll();

    Core.setOptions(false);
}
