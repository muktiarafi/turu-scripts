/*
name: Beast Master Challenge Daily
description: This script does BeastMaster Challenge daily quest.
tags: daily, beast master challenge
*/
// Port of Scripts/Dailies/BeastMasterChallenge[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class BeastMasterChallenge {}

export default function main(): void {
    Core.setOptions();

    Daily.beastMasterChallenge();

    Core.setOptions(false);
}
