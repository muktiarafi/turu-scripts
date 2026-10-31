/*
name: 2026 birthday free acs
description: money
tags: acs, free, roblox
*/
// Port of Scripts/Other/FreeAcGifts[Yearly]/202xFreeAcs.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class FreeAcs {
    getYourAcsHere(): void {
        if (Core.isCompletedBefore(10894)) {
            Core.logger("Quest Already Complete");
            return;
        }
        Core.oneTimeMessage("WARNING", "This Quest is a ONE-TIME quest (per account).", true, true);

        if (!bot.flash.callGameFunction<boolean>("world.myAvatar.isEmailVerified") || bot.player.level < 20) {
            Core.logger("You need to be level 20 and have a verified email!");
            return;
        }

        Core.ensureAccept(10894);
        Core.huntMonster("eventhub", "Agitated Orb", "Free ACs...");
        Core.ensureComplete(10894);
    }
}

export default function main(): void {
    const script = new FreeAcs();
    Core.setOptions(undefined, { disableClassSwap: true });

    script.getYourAcsHere();
    // Core.Logger("Quest Isnt aviable yet! if this is untrue, ping @tato2 or @bogalj on disc.", "Quest Isnt aviable yet!", true, true);

    Core.setOptions(false);
}
