/*
name: Dark War Legion Gold
description: Gold farm using Dark War Legion Method
tags: gold, farm, dark, war, legion
*/
// Port of Scripts/Farm/DarkWarLegionGold.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";
import { DarkWarLegionandNation } from "../story/legion/DarkWarLegionandNation";

const Farm = new CoreFarms();
const DWLaN = new DarkWarLegionandNation();

export class DarkWarLegionGold {
    doDarkWarLegionGold(): void {
        Core.equipClass(ClassType.Farm);

        Core.logger("Doing quest requirements.");
        DWLaN.darkWarLegion();

        Farm.darkWarLegion();
    }
}

export default function main(): void {
    const script = new DarkWarLegionGold();
    Core.setOptions(undefined, { disableClassSwap: true });

    script.doDarkWarLegionGold();

    Core.setOptions(false);
}
