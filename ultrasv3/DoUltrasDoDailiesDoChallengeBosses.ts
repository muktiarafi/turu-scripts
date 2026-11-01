/*
name: Do Ultras and Dailies and Challenge Bosses
description: Runs all ultras, dailies, and challenge bosses.
tags: ultras,dailies,challenge bosses,all
*/
// Port of Scripts/Ultrasv3/DoUltrasDoDailiesDoChallengeBosses.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { FarmAllDailies } from "../dailies/0AllDailies";
import { DoAllChallengeBosses } from "./dependenciesdailies/DoAllChallengeBosses";
import { CoreEnginev3 } from "./dependenciesultras/CoreEnginev3";
import { UltraWaitForArmy } from "./dependenciesultras/UltraWaitForArmy";
import { DoAllUltras } from "./DoAllUltras";

const Engine = CoreEnginev3.instance;

export class DoUltrasDoDailiesDoChallengeBosses {}

export default function main(): void {
    Core.setOptions(true);
    Engine.boot();

    new DoAllUltras().runAll();
    UltraWaitForArmy.instance.newWaitForArmy(3, "doall_sync.sync", undefined, undefined, false);

    new DoAllChallengeBosses().runAll();
    UltraWaitForArmy.instance.newWaitForArmy(3, "doall_sync.sync", undefined, undefined, false);

    new FarmAllDailies().doAllDailies();
    UltraWaitForArmy.instance.newWaitForArmy(3, "doall_sync.sync", undefined, undefined, false);

    Engine.disableSkills();
    Core.setOptions(false);
}
