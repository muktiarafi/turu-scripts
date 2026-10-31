/*
name: CornelisReborn
description: null
tags: null
*/
// Port of Scripts/Other/Badges/CornelisReborn.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Cornelis } from "../../story/Cornelis[mem]";

const Corn = new Cornelis();

export class CornelisRebornbadge {
    badge(): void {
        if (Core.hasAchievement(13)) {
            Core.logger("Already have the Cornelis Reborn badge");
            return;
        }

        Core.logger(`Doing Cornelis story for the badge`);
        Corn.storyLine();
    }
}

export default function main(): void {
    const script = new CornelisRebornbadge();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
