/*
name: JusticeSquad
description: null
tags: null
*/
// Port of Scripts/Other/Badges/JusticeSquad.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";

export class JusticeSquadBadge {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing a quest for the ${this.badgeName}`);
        Core.addDrop("Enchanted Justice Blade");
        Core.ensureAccept(5722);
        Core.huntMonster("battleontown", "Frogzard", "Quill Pen", undefined, { log: false });
        Core.ensureComplete(5722);
        Core.trashCan("Enchanted Justice Blade");
    }

    private readonly badgeName = "Justice Squad";
}

export default function main(): void {
    const script = new JusticeSquadBadge();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
