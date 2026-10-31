/*
name: Legion Castle Quest
description: Farms the "Legion Castle Quest" untill all drops are obtained. Requires "Legion Castle". Will also farm Legion Tokens
tags: legion, castle, quest, token, loyal
*/
// Port of Scripts/Legion/Various/LegionCastleQuest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class LegionCastleQuest {
    example(): void {
        const rewards = Core.questRewards(6822);

        if (Core.checkInventory(rewards, undefined, { toInv: false })) {
            return;
        }
        if (!Core.checkInventory("Legion Castle")) {
            Core.logger('You do not own "Legion Castle". Stopping the bot');
            return;
        }

        Core.addDrop(...rewards);

        Core.registerQuests(6822, 6742, 6743);
        while (!bot.shouldExit && !Core.checkInventory(rewards)) {
            Core.killMonster("legionarena", "r2", "Left", "*", "Challenger Slain", 12, { publicRoom: true });
            Core.killMonster("legionarena", "Boss", "Left", "Legion Fiend Rider", "Legion Fiend Rider Slain", 1, {
                publicRoom: true,
            });
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new LegionCastleQuest();
    Core.setOptions();

    script.example();
    Core.setOptions(false);
}
