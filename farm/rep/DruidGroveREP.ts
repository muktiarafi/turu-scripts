/*
name: Druid Grove REP
description: This script will farm Druid Grove reputation to rank 10.
tags: druid, grove, druidgrove, reputation, rep, rank
*/
// Port of Scripts/Farm/REP/DruidGroveREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class DruidGroveREP {}

export default function main(): void {
    Core.setOptions();

    Farm.druidGroveREP();

    Core.setOptions(false);
}
