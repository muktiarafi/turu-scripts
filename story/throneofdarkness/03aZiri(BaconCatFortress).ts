/*
name: (Ziri) Bacon Cat Fortress Story
description: This will finish the Bacon Cat Fortress story.
tags: bacon, cat, fortress, farm, story, ziri, throne, darkness
*/
// Port of Scripts/Story/ThroneofDarkness/03aZiri(BaconCatFortress).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class BaconCatFortress {}

export default function main(): void {
    Core.setOptions();

    TOD.baconCatFortress();

    Core.setOptions(false);
}
