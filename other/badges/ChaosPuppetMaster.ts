/*
name: ChaosPuppetMaster
description: null
tags: null
*/
// Port of Scripts/Other/Badges/ChaosPuppetMaster.cs.

import { Core } from "../../core/CoreBots";
import { CoreQOM } from "../../story/queenofmonsters/CoreQoM";

const QOM = new CoreQOM();

export class ChaosPuppetMaster {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing QOM story for ${this.badgeName} badge`);
        QOM.completeEverything();
    }

    // C# `badge`, next to the method `Badge`.
    private readonly badgeName = "Chaos PuppetMaster";
}

export default function main(): void {
    const script = new ChaosPuppetMaster();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
