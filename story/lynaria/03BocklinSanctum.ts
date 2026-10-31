/*
name: Bocklin Sanctum
description: This will complete the Victoria Alteon's storyline in /bocklinsanctum.
tags: story, quest, saga, lynaria, queen lynaria, bocklinsanctum, bocklin sanctum,victoria,victoria alteon
*/
// Port of Scripts/Story/Lynaria/03BocklinSanctum.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLynaria } from "./CoreLynaria";

const Lyn = new CoreLynaria();

export class BocklinSanctum {}

export default function main(): void {
    Core.setOptions();

    Lyn.bocklinSanctum();

    Core.setOptions(false);
}
