/*
name: Max Hollowborn Materials
description: Farms the maximum quantity of all Hollowborn materials.
tags: hollowborn, vindicator, farm, max, materials, hbv, hollow soul, deaths power, death's power, grace orb, gramiels emblem,gramiel's emblem, vindicator crest, vindicator badge
*/
// Port of Scripts/Hollowborn/Materials/0MaxMats.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { DeathsPower } from "./DeathsPower";
import { GraceOrb } from "./GraceOrb";
import { GramielsEmblem } from "./GramielsEmblem";
import { HollowSoul } from "./HollowSoul";
import { VindicatorBadge } from "./VindicatorBadge";
import { VindicatorCrest } from "./VindicatorCrest";

const VB = new VindicatorBadge();
const DP = new DeathsPower();
const GO = new GraceOrb();
const GE = new GramielsEmblem();
const VC = new VindicatorCrest();
const HS = new HollowSoul();

export class MaxHollowbornVindicatorMats {
    getMax(): void {
        HS.getYaSoulsHeeeere();
        DP.getDP();
        GO.getGraceOrb();
        GE.getGramielsEmblem();
        VC.getVindicatorCrest();
        VB.getVindicatorBadge();
    }
}

export default function main(): void {
    const script = new MaxHollowbornVindicatorMats();
    Core.setOptions();

    script.getMax();

    Core.setOptions(false);
}
