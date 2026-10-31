/*
name: Get All Ranks
description: This script will get all reputations to rank 10.
tags: all reps, reputation, rank, all ranks, farm, rep, reps
*/
// Port of Scripts/Farm/REP/1GetAllRanks.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { GlaceraStory } from "../../story/Glacera";
import { Core13LoC } from "../../story/lordsofchaos/Core13LoC";
import { BrightOak } from "../../story/queenofmonsters/extra/BrightOak";
import { CoreToD } from "../../story/throneofdarkness/CoreToD";

const Farm = new CoreFarms();
const TOD = new CoreToD();
const LOC = new Core13LoC();
const Glac = new GlaceraStory();
const brightOak = new BrightOak();

export class GetAllRanks {
    doGetAllRanks(): void {
        //Required Stories add when needed.
        Core.logger("Doing Required Stories for the reps, let tato know if another is required.");
        const doDeathPit = bot.config!.get<boolean>("doDeathPit");
        //if !doDeathPit > skip story for the DP rep
        TOD.completeToD(!doDeathPit);
        LOC.complete13LOC();
        brightOak.doall(true);
        Core.logger(
            "when doing the `Glacera` storyline, you may have to restart it in the middle of the quests due to ae's bullshit how it keeps another quest locked even though the preivosu is completed till you relog",
        );
        Glac.doAll();
        Core.logger(`Doing all Reputations to Rank 10, Death Pit: ${doDeathPit}`);
        if (doDeathPit) {
            TOD.deathPitPVP();
        }

        Farm.getAllRanks(doDeathPit);
    }
}

export const scriptOptions = defineScriptOptions(
    "GetAllRanks",
    [
        option.bool(
            "doDeathPit",
            "Do Death Pit",
            "Should the bot farm Death Pit Brawl and Death Pit Arena reputations?",
            true,
        ),
        Core.skipOptions, // Skip options when set
    ],
    true,
);

export default function main(): void {
    const script = new GetAllRanks();
    Core.setOptions();

    script.doGetAllRanks();

    Core.setOptions(false);
}
