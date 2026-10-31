/*
name: Yami no Ronin Full
description: This bot will farm and rank up Yami no Ronin for you, fully.
tags: yami, no, ronin, YNR, legion, yokai sword scroll, blademaster sword scroll, folded steel, flame-forged metal
*/
// Port of Scripts/Legion/YamiNoRonin/0YamiNoRonin.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreYnR } from "./CoreYnR";

const YNR = new CoreYnR();

export class YamiNoRonin {}

export default function main(): void {
    Core.setOptions();

    YNR.getYnR();

    Core.setOptions(false);
}
