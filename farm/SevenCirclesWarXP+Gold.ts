/*
name: Seven Circles War XP + Gold
description: This script will farm XP and Gold using SevenCirclesWar method.
tags: seven, 7, circles, war, gold, xp, exp, experience, farm, max, 100, level, leveling
*/
// Port of Scripts/Farm/SevenCirclesWarXP+Gold.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";
import { SevenCircles } from "../story/legion/SevenCircles(War)";

const Farm = new CoreFarms();
const SC = new SevenCircles();

export class SevenCirclesWarXP {
    doSevenCirclesWarXP(): void {
        SC.circlesWar(true, true);

        //Farm.UseBoost(ChangeToBoostID, Skua.Core.Models.Items.BoostType.Experience, true);

        Farm.sevenCirclesWar(bot.player.level === 100 ? 101 : 100, 100000000);
    }
}

export default function main(): void {
    const script = new SevenCirclesWarXP();
    Core.setOptions();

    script.doSevenCirclesWarXP();

    Core.setOptions(false);
}
