/*
name: CharityFeast
description: Completes the quest chain in /charityfeast.
tags: charityfeast, story, quests, charityfeast
*/
// Port of Scripts/Seasonal/HarvestDay/21CharityFeast.cs.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class CharityFeast {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.charityFeast();

    Core.setOptions(false);
}
