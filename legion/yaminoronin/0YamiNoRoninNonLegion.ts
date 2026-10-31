/*
name: Yami no Ronin Full (Non-Legion Variant)
description: This bot will farm and rank up Yami no Ronin for you, fully. But can be used whilst not being in Legion (longer farm)
tags: yami, no, ronin, YNR, legion, yokai sword scroll, blademaster sword scroll, folded steel, flame-forged metal
*/
// Port of Scripts/Legion/YamiNoRonin/0YamiNoRoninNonLegion.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreYnR } from "./CoreYnR";

const YNR = new CoreYnR();

export class YamiNoRoninNonLegion {}

export default function main(): void {
    Core.setOptions();

    YNR.getYnR();

    Core.setOptions(false);
}
