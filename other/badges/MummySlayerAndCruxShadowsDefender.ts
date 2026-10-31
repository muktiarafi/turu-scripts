/*
name: MummySlayerAndCruxShadowsDefender
description: null
tags: null
*/
// Port of Scripts/Other/Badges/MummySlayerAndCruxShadowsDefender.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CruxShip } from "../../story/CruxShip";

const CS = new CruxShip();

export class MummySlayerAndCruxShadowsDefender {
    badge(): void {
        if (Core.hasWebBadge("Mummy Slayer") || Core.hasWebBadge("CruxShadows Defender")) {
            Core.logger("Already have the Mummy Slayer and CruxShadows Defender badge");
            return;
        }

        Core.logger("Doing CruxShip story for Mummy Slayer and CruxShadows Defender badge");
        CS.storyLine(true);
    }
}

export default function main(): void {
    const script = new MummySlayerAndCruxShadowsDefender();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
