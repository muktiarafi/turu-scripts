/*
name: Abyssal Zone
description: This script completes the storyline in /abyssalzone.
tags: age, of, ruin, saga, story, quest, zone, abyssal
*/
// Port of Scripts/Story/AgeOfRuin/07AbyssalZone.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class AbyssalZone {}

export default function main(): void {
    Core.setOptions();

    AOR.abyssalZone();
    Core.setOptions(false);
}
