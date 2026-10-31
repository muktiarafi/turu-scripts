/*
name: FiendToken
description: null
tags: null
*/
// Port of Scripts/Nation/Materials/FiendToken.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";
import { HanzoOrbQuest } from "../various/HanzoOrbQuest";

const Nation = new CoreNation();
const hanzoOrbQuest = new HanzoOrbQuest();

export class FiendToken {
    farmFiendToken(): void {
        if (!Core.isMember) {
            hanzoOrbQuest.hanzoOrb("FiendToken, 30");
        }
        Nation.farmFiendToken();
    }
}

export default function main(): void {
    const script = new FiendToken();
    Core.setOptions();

    script.farmFiendToken();

    Core.setOptions(false);
}
