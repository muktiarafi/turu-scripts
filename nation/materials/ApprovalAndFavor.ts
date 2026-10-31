/*
name: Approval And Favor
description: This script will farm Nulgath's Approval and Archfiend's Favor.
tags: nulgath, approval, favor, archfiend, farm, mats
*/
// Port of Scripts/Nation/Materials/ApprovalAndFavor.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export class ApprovalAndFavor {}

export default function main(): void {
    Core.setOptions();

    Nation.approvalAndFavor();

    Core.setOptions(false);
}
