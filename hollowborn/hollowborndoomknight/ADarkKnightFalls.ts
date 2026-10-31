/*
name: HBDK - A Dark Knight Falls
description: does the 'a dark knight falls' part of hollowborn doomKnight
tags: hollowborn, a dark knight falls, hollowborn doomknight
*/
// Port of Scripts/Hollowborn/HollowbornDoomKnight/ADarkKnightFalls.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHollowbornDoomKnight } from "./CoreHollowbornDoomKnight";

const HDK = new CoreHollowbornDoomKnight();

export class ADKFalls {}

export default function main(): void {
    Core.setOptions();

    HDK.adkFalls();

    Core.setOptions(false);
}
