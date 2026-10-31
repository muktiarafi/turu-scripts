/*
name: Yokai Portal
description: This script will complete "Yokai Portal" storyline.
tags: story, quest, saga, dragons, dragon, yokai, portal, yokaiportal, complete, all
*/
// Port of Scripts/Story/DragonsOfYokai/05YokaiPortal.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDOY } from "./CoreDOY";

const DOY = new CoreDOY();

export class YokaiPortal {}

export default function main(): void {
    Core.setOptions();

    DOY.yokaiPortal();
    Core.setOptions(false);
}
