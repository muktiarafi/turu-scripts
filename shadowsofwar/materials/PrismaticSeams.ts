/*
name: Farms Prismatic Seams
description: Farms the Prismatic Seams from Shadows of War
tags: prismatic seams, shadows of war
*/
// Port of Scripts/ShadowsOfWar/Materials/PrismaticSeams.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoWMats } from "../CoreSoWMats";

const SOWM = new CoreSoWMats();

export class PrismaticSeams {}

export default function main(): void {
    Core.bankingBlackList.push("Prismatic Seams");

    Core.setOptions();

    SOWM.prismaticSeams();

    Core.setOptions(false);
}
