/*
name: No Egrets Badge
description: This will get the No Egrets Badge.
tags: no-egrets-badge, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/NoEgretsBadge.cs.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class NoEgrets {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        if (!Core.isSeasonalMapActive("birdswithharms")) {
            Core.logger(
                `Can't get ${this.badgeName} badge at this moment, because this is a seasonal badge (Harvest Day Event)`,
            );
            return;
        }

        Core.logger(`Doing Birds With Harm story for ${this.badgeName} badge`);
        HarvestDay.birdsWithHarms();
    }

    readonly badgeName = "No Egrets";
}

export default function main(): void {
    const script = new NoEgrets();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
