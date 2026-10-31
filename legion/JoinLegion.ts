/*
name: Join the Legion
description: This script will join Dage's undead. It will also buy (with permission) the Undead Warrior. Option available to have the Undead Warrior be sold after joining the leigon.
tags: dage, legion, tokens, undead, warrior, bludrut, brawl, fail, king
*/
// Port of Scripts/Legion/JoinLegion.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreLegion } from "./CoreLegion";

const Legion = new CoreLegion();

export class JointheLegion {}

export default function main(): void {
    Core.bankingBlackList.push("Combat Trophy");

    Core.setOptions(undefined, { disableClassSwap: true });

    Legion.joinLegion();

    Core.setOptions(false);
}
