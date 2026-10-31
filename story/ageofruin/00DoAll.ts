/*
name: Age Of Ruin (All)
description: This script completes the full Age Of Ruin saga.
tags: age, ruin, saga, story, quest, termina, temple, ashray, village, sunlight, twilight, zone, yulgar, aria, midnight, abyssal, deep_water, trench_observation, balemorale, castle_eblana, loughshine, naoise grave, naoisegrave, lia tara, liatara, hill, hill of lia tara, castle gaheris, castlegaheris, castle, gaheris,thelima,thelimacity,mount maleno,mountmaleno, sanctuary,aiwass,sanctuaryaiwass,forgealbedo,forge albedo
*/
// Port of Scripts/Story/AgeOfRuin/00DoAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class AgeOfRuinAll {}

export default function main(): void {
    Core.setOptions();

    AOR.doAll();
    Core.setOptions(false);
}
