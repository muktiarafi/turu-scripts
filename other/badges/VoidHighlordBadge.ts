/*
name: VoidHighlordBadge
description: null
tags: null
*/
// Port of Scripts/Other/Badges/VoidHighlordBadge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";

export class VoidHighlordBadge {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        if (!Core.checkInventory("Void Highlord")) {
            return;
        }

        Core.logger(`Doing the quest for ${this.badgeName} badge`);
        Core.ensureAccept(7651);
        Core.huntMonster("shadowblast", "Legion Fenrir", "Fiend Seal", 1, { isTemp: false });
        Core.ensureComplete(7651);
    }

    private readonly badgeName = "Void Highlord";
}

export default function main(): void {
    const script = new VoidHighlordBadge();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
