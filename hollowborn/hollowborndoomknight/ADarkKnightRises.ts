/*
name: HBDK - A Dark Knight Rises
description: does the 'a dark knight rises' part of hollowborn doomKnight
tags: hollowborn, a dark knight rises, hollowborn doomknight
*/
// Port of Scripts/Hollowborn/HollowbornDoomKnight/ADarkKnightRises.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHollowbornDoomKnight } from "./CoreHollowbornDoomKnight";

const HDK = new CoreHollowbornDoomKnight();

export class ADKRises {}

export default function main(): void {
    Core.setOptions();

    HDK.adkRises();

    Core.setOptions(false);
}
