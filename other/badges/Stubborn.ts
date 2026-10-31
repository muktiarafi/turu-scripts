/*
name: Stubborn
description: null
tags: badge, Stubborn
*/
// Port of Scripts/Other/Badges/Stubborn.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class Stubborn {
    badge(): void {
        if (Core.hasAchievement(56) || !Core.isMember) {
            Core.logger(!Core.isMember ? "Player isnt member" : 'Already have the "Stubborn" badge');
            return;
        }

        //ensure private...because yes
        Core.join("twig-100000", "r2", "left");
        for (let i = 0; i < 100; i++) {
            //leave autocorrect enabled as it double jumps and gets it done quicker.
            bot.map.jump("r2", "left", false);
            Core.sleep();
            Core.logger(`Jumping ${i} times`);
        }
    }
}

export default function main(): void {
    const script = new Stubborn();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
