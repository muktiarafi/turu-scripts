/*
name: Retrieve Void Auras
description: farms void auras via the "retrieve void auras" quest.
tags: retrieve, void aura
*/
// Port of Scripts/Evil/NSoD/VoidAuras/RetreiveVoidAuras.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { Core } from "../../../core/CoreBots";
import { CoreNSOD } from "../CoreNSOD";

const NSoD = new CoreNSOD();

export class RetrieveVoidAuras {}

export const scriptOptions = defineScriptOptions(NSoD.optionsStorage, [NSoD.maxStack, Core.skipOptions], true);

export default function main(): void {
    Core.bankingBlackList.push(...NSoD.essences);

    Core.setOptions();

    NSoD.retrieveVoidAuras();

    Core.setOptions(false);
}
