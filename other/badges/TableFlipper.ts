/*
name: TableFlipper
description: null
tags: null
*/
// Port of Scripts/Other/Badges/TableFlipper.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Borgars } from "../../story/Borgars";

const borgars = new Borgars();

export class TableFlipper {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing Borgars story for ${this.badgeName} badge`);
        borgars.storyLine();
    }

    private readonly badgeName = "Table Flipper";
}

export default function main(): void {
    const script = new TableFlipper();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
