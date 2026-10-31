/*
name: New Worlds, New Opportunities
description: Farms the resources of nation so instantly. Note that you must have Bounty Hunter's Drone Pet.
tags: bounty hunters pet, pet, nation farm, farm resources
*/
// Port of Scripts/Nation/NewWorldsNewOpportunities.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreNation } from "./CoreNation";

const Nation = new CoreNation();

export class NewWorldsNewOpportunities {}

export default function main(): void {
    Core.bankingBlackList.push(...Core.questRewards(Core.checkInventory("Bounty Hunter's Drone Pet") ? 6183 : 6697));
    Core.setOptions();

    Nation.newWorldsNewOpportunities();

    Core.setOptions(false);
}
