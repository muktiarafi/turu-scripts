/*
name: PrismaticEther
description: null
tags: null
*/
// Port of Scripts/Other/Classes/ArchMage/Materials/PrismaticEther.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../../core/CoreBots";
import { CoreArchMage } from "../CoreArchMage";

const AM = new CoreArchMage();

export class PrismaticEther {}

export default function main(): void {
    Core.setOptions();

    AM.prismaticEther(99);

    Core.setOptions(false);
}
