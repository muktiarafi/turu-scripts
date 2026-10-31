/*
name: (Stranger) Antique Shop Story
description: This will finish the Antique Shop story.
tags: antique, shop, farm, story, throne, darkness, stranger
*/
// Port of Scripts/Story/ThroneofDarkness/07aStranger(AntiqueShop).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class AntiqueShop {}

export default function main(): void {
    Core.setOptions();

    TOD.antiqueShop();

    Core.setOptions(false);
}
