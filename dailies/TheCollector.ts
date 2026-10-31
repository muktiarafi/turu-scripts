/*
name: Collector Class Daily
description: Collector Class
tags: daily, collector class, class
*/
// Port of Scripts/Dailies/TheCollector.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class CollectorClass {}

export default function main(): void {
    Core.setOptions();

    Daily.collectorClass();

    Core.setOptions(false);
}
