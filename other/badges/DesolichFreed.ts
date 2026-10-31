/*
name: DesolichFreed
description: null
tags: null
*/
// Port of Scripts/Other/Badges/DesolichFreed.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { EtherStormWastes } from "../../story/EtherstormWastes";

const ESW = new EtherStormWastes();

export class DesolichFreed {
    badge(): void {
        if (!Core.isMember) {
            return;
        }

        if (Core.hasWebBadge("Desoloth Freed")) {
            Core.logger(`Already have the Desoloth Freed badge`);
            return;
        }

        Core.logger("Gotta do the EtherStorm story first, will get the badge during the story don't worry :D");
        ESW.doAll();
    }
}

export default function main(): void {
    const script = new DesolichFreed();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
