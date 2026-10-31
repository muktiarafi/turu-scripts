/*
name: Dark Token
description: This script will farm Dark Tokens.
tags: darktoken, lf3, legion fealty 3, lr, seraphic medals, seraphic, dark token
*/
// Port of Scripts/Legion/LegionMaterials/DarkToken.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";
import { WorldSoul } from "../../story/legion/WorldSoul";

const Legion = new CoreLegion();
const WS = new WorldSoul();

export class DarkToken {
    farmDarkToken(): void {
        WS.worldSoulQuests();
        Legion.darkToken();
    }
}

export default function main(): void {
    const script = new DarkToken();
    Core.setOptions();

    script.farmDarkToken();

    Core.setOptions(false);
}
