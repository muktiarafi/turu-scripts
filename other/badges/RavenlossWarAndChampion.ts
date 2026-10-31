/*
name: RavenlossWarAndChampion
description: null
tags: null
*/
// Port of Scripts/Other/Badges/RavenlossWarAndChampion.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { RavenlossSaga } from "../../story/RavenlossSaga";

const Ravenloss = new RavenlossSaga();

export class RavenlossWarAndChampion {
    badge(): void {
        if (Core.hasWebBadge("Ravenloss War") || Core.hasWebBadge("Ravenloss Champion")) {
            Core.logger("Already have the Ravenloss War and Champion badge");
            return;
        }

        Core.logger("Doing Ravenloss story for Ravenloss War and Champion badge");
        Ravenloss.doAll();

        Core.equipClass(ClassType.Farm);
        Core.ensureAccept(8668);
        Core.huntMonster("ravenloss", "ChaosWeaver Magi", "ChaosWeaver Defeated", 100, { log: false });
        Core.ensureComplete(8668);
    }
}

export default function main(): void {
    const script = new RavenlossWarAndChampion();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
