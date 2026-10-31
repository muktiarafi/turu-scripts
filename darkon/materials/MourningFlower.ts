/*
name: Mourning Flower
description: Mouring Flower
tags: darkon, mourning flower
*/
// Port of Scripts/Darkon/Materials/MourningFlower.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Darkon = new CoreDarkon();

export class MourningFlower {}

export default function main(): void {
    Core.setOptions();

    Darkon.wheelofFortune();

    Core.setOptions(false);
}
