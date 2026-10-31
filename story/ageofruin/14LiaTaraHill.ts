/*
name: The Hill of Lia Tara
description: This script completes the st oryline in /liatarahill.
tags: age, of, ruin, saga, story, quest, liatarahill, lia tara, liatara, hill, queen victoria alteon
*/
// Port of Scripts/Story/AgeOfRuin/14LiaTaraHill.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class LiaTaraHill {}

export default function main(): void {
    Core.setOptions();

    AOR.liaTaraHill();

    Core.setOptions(false);
}
