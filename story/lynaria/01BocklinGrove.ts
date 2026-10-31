/*
name: Bocklin Grove
description: This will complete the Victoria Alteon's storyline in /bocklingrove.
tags: story, quest, saga, lynaria, queen lynaria, bocklingrove, bocklin grove,victoria,victoria alteon
*/
// Port of Scripts/Story/Lynaria/01BocklinGrove.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLynaria } from "./CoreLynaria";

const Lyn = new CoreLynaria();

export class BocklinGrove {}

export default function main(): void {
    Core.setOptions();

    Lyn.bocklinGrove();

    Core.setOptions(false);
}
