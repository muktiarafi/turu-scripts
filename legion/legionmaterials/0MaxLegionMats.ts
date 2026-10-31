/*
name: 0MaxLegionMats
description: Farms the max stack of all the legion materials using various methods based off the pets / quest you have avaiable.
tags: legion, dage, all, 🖕, you
*/
// Port of Scripts/Legion/LegionMaterials/0MaxLegionMats.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";
import { LetItBurn } from "./LetitBurn(SoulEssence)";
import { AnotherOneBitesTheDust } from "./SoulSand";
import { CoreYnR } from "../yaminoronin/CoreYnR";

const CL = new CoreLegion();
const letItBurn = new LetItBurn();
const anotherOneBitesTheDust = new AnotherOneBitesTheDust();
const coreYnR = new CoreYnR();

export class MaxLegionMats {
    maxLeg(): void {
        // Make sure they're part of the legion
        CL.joinLegion();

        // Materials
        CL.approvalAndFavor();
        CL.farmLegionToken();
        CL.emblemofDage();
        CL.darkToken();
        CL.boneSigil();
        CL.diamondTokenofDage();
        CL.obsidianRock();
        letItBurn.soulEssence();
        anotherOneBitesTheDust.soulSand();
        coreYnR.yokaiSwordScroll();

        // Keep pvp as the last, as it takes **FUCKING FOREVER**
        CL.dagePvP();
    }
}

export default function main(): void {
    const script = new MaxLegionMats();
    Core.setOptions();

    script.maxLeg();

    Core.setOptions(false);
}
