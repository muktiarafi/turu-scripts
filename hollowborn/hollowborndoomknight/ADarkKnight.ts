/*
name: HBDK - A Dark Knight
description: does the 'a dark knight' part of hollowborn doomKnight
tags: hollowborn, a dark knight, hollowborn doomknight
*/
// Port of Scripts/Hollowborn/HollowbornDoomKnight/ADarkKnight.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHollowbornDoomKnight } from "./CoreHollowbornDoomKnight";

const HDK = new CoreHollowbornDoomKnight();

export class ADK {}

export default function main(): void {
    Core.setOptions();

    HDK.adk();

    Core.setOptions(false);
}
