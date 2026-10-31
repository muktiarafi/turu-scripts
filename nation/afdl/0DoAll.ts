/*
name: ADFL Do ALl
description: Does the entirety of AFDL
tags: afdl, archfiend doom lord, doall, 0doall
*/
// Port of Scripts/Nation/AFDL/0DoAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { EnoughDOOMforanArchfiend } from "./EnoughDOOMforanArchfiend";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();
const DOOM = new EnoughDOOMforanArchfiend();

export class ADFL {}

export default function main(): void {
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.bankingBlackList.push(
        "ArchFiend DoomLord",
        "Undead Essence",
        "Chaorruption Essence",
        "Essence Potion",
        "Essence of Klunk",
        "Living Star Essence",
        "Bone Dust",
        "Undead Energy",
    );
    Core.setOptions();

    DOOM.afdl();

    Core.setOptions(false);
}
