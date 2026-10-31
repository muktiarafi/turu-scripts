/*
name: ShadowVaultChampion
description: null
tags: null
*/
// Port of Scripts/Other/Badges/ShadowVaultChampion.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { ShadowVault } from "../../story/ShadowVault";

const SV = new ShadowVault();

export class ShadowVaultChampion {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing ShadowVault story for ${this.badgeName} badge`);
        SV.storyLine();
    }

    private readonly badgeName = "ShadowScythe Champion";
}

export default function main(): void {
    const script = new ShadowVaultChampion();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
