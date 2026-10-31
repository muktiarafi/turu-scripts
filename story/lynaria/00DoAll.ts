/*
name: Lynaria's Saga (Do All)
description: This will finish the Lynaria's Saga storyline in /bocklingrove.
tags: story, quest, saga, doall, lynaria, complete, all, queen lynaria, bocklingrove, bocklin grove, bocklincastle, bocklin castle, bocklin sanctum,bocklinsanctum,victoria,victoria alteon
*/
// Port of Scripts/Story/Lynaria/00DoAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLynaria } from "./CoreLynaria";

const Lyn = new CoreLynaria();

export class DoAllLynaria {}

export default function main(): void {
    Core.setOptions();

    Lyn.doAll();

    Core.setOptions(false);
}
