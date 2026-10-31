/*
name: GrimskullTrollingRep
description: Goes through the grimgaol dungeon multiple times for reputation
tags: Grimskull trolling, Grimskull, Rep, Reputation, Grimgaol, Lich, Verata's Necronomicon
*/
// Port of Scripts/Farm/REP/GrimskullTrollingRep.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { Grimgaol } from "../../prototypes/Grimgaol";

const Farm = new CoreFarms();
const GrimGaolRun = new Grimgaol();

export class GrimskullTrollingRep {
    doGrimskullTrollingRep(rank = 10): void {
        if (Farm.factionRank("Grimskull Trolling") >= rank) {
            Core.logger(`You already have rank ${rank} Grimskull Trolling reputation.`);
            return;
        }

        GrimGaolRun.doGrimGaol(rank);
    }
}

export const scriptOptions = defineScriptOptions(GrimGaolRun.optionsStorage, GrimGaolRun.options, true);

export default function main(): void {
    const script = new GrimskullTrollingRep();
    Core.setOptions(undefined, { disableClassSwap: true });
    script.doGrimskullTrollingRep();
    Core.setOptions(false);
}
