/*
name: RankUpEquippedClass
description: rank up current class
tags: rank, up, class, rank class, rank up class, class rank, class points
*/
// Port of Scripts/Tools/RankUpEquippedClass.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";

const Adv = new CoreAdvanced();

export class RankUpEquippedClass {
    doRankUpEquippedClass(): void {
        if (bot.player.currentClass != null) {
            if (bot.player.currentClassRank < 10) {
                Adv.rankUpClass(bot.player.currentClass);
            } else {
                Core.logger(`${bot.player.currentClass} is already at max rank.`);
            }
        } else {
            Core.logger("No class is currently equipped.");
        }
    }
}

export default function main(): void {
    const script = new RankUpEquippedClass();
    Core.setOptions(undefined, { disableClassSwap: true });

    script.doRankUpEquippedClass();

    Core.setOptions(false);
}
