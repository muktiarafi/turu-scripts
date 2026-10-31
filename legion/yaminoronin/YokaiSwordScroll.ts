/*
name: Yokai Sword Scroll
description: This bot will farm the Yokai Sword Scroll, used in Yami no Ronin.
tags: yami, no, ronin, YNR, legion, yokai sword scroll
*/
// Port of Scripts/Legion/YamiNoRonin/YokaiSwordScroll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreYnR } from "./CoreYnR";

const YNR = new CoreYnR();

export class YokaiSwordScroll {}

export default function main(): void {
    Core.setOptions();

    YNR.yokaiSwordScroll();

    Core.setOptions(false);
}
