/*
name: Chilly's Participation
description: This will finish the quest that is required to get free acs throughout the event.
tags: chillys-participation, seasonal, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/ChillysParticipation.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class ChillysQuest {
    //Edit for future years quests vv <- No need to edit now, just edit the quest ID in ChillysParticipation.cs
    chillysParticipation(questID = 10510): void {
        if (Core.isCompletedBefore(questID, false)) {
            return;
        }

        if (!bot.flash.callGameFunction<boolean>("world.myAvatar.isEmailVerified")) {
            Core.logger("Your email adres is not verified!", undefined, { messageBox: true, stopBot: true });
        }
        Farm.experience(30);

        Core.ensureAccept(questID);
        Core.huntMonsterMapID("battleontown", 1, "Reminder Delivered");
        Core.ensureComplete(questID);
        bot.wait.forQuestComplete(questID);
        // Longer delay as soemtimes ae would throttle ppl with alot of
        //  accs to just get stuck on loading in.
        bot.sleep(5000);
    }
}

export default function main(): void {
    const script = new ChillysQuest();
    Core.setOptions();

    script.chillysParticipation();

    Core.setOptions(false);
}
