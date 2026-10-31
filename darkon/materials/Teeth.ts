/*
name: Teeth (Darkon)
description: This script will farm Teeth using "Sweet Dreams Are Made of Teeth" quest.
tags: darkon, teeth, sweet dreams are made of teeth, tooth, wisdom tooth, eridani, re
*/
// Port of Scripts/Darkon/Materials/Teeth.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Darkon = new CoreDarkon();

export class Teeth {}

export default function main(): void {
    Core.setOptions();

    Darkon.teeth();

    Core.setOptions(false);
}
