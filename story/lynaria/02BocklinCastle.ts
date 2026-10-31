/*
name: Bocklin Castle
description: This will complete the Victoria Alteon's storyline in /bocklincastle.
tags: story, quest, saga, lynaria, queen lynaria, bocklincastle, bocklin castle,victoria,victoria alteon
*/
// Port of Scripts/Story/Lynaria/02BocklinCastle.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLynaria } from "./CoreLynaria";

const Lyn = new CoreLynaria();

export class BocklinCastle {}

export default function main(): void {
    Core.setOptions();

    Lyn.bocklinCastle();

    Core.setOptions(false);
}
