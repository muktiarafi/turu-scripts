/*
name: MaxDageApprovalAndFavor
description: farms DageApprovalAndFavor till max quantity
tags: legion, dage, DageApprovalAndFavor, 🖕, you
*/
// Port of Scripts/Legion/LegionMaterials/ApprovalAndFavor.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const CL = new CoreLegion();

export class DageApprovalAndFavor {
    getDageApprovalAndFavor(): void {
        CL.approvalAndFavor();
    }
}

export default function main(): void {
    const script = new DageApprovalAndFavor();
    Core.setOptions();

    script.getDageApprovalAndFavor();

    Core.setOptions(false);
}
