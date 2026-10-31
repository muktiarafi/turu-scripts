/*
name: Yokai Realm
description: This script will complete "Yokai Realm" storyline.
tags: story, quest, saga, dragons, dragon, yokai, realm, yokairealm, complete, all
*/
// Port of Scripts/Story/DragonsOfYokai/06YokaiRealm.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDOY } from "./CoreDOY";

const DOY = new CoreDOY();

export class YokaiRealm {}

export default function main(): void {
    Core.setOptions();

    DOY.yokaiRealm();
    Core.setOptions(false);
}
