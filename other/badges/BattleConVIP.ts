/*
name: (Badge) BattleCon VIP
description: This will get the BattleCon VIP badge.
tags: badge, underground, lab, battle, con, vip
*/
// Port of Scripts/Other/Badges/BattleConVIP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { UnderGroundLab } from "../../story/UnderGroundLab";

const UGL = new UnderGroundLab();

export class BattleConVIP {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing UnderGroundLab story for ${this.badgeName} badge`);
        UGL.partofundergroundlabb();
    }

    private readonly badgeName = "BattleCon VIP";
}

export default function main(): void {
    const script = new BattleConVIP();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
