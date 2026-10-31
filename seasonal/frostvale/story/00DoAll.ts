/*
name: Frostvale (All)
description: This script completes the full Frostvale saga.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,icecave,snowglobe,alpine,snowyvale,icerise,coldwindvalley,battlefield,darkwinter,frozensoul,howardshill,icerisepast,winterhorror,cryostorm,icewindpass,icepike,frostvalpastpresentandfuture,snowview,snowviewrace,deerhunt,bowjangles,glacetomb,fimbultomb,mountotzi,otziwar,holidayhotel,holidayhorror,frostvalgala,doall
*/
// Port of Scripts/Seasonal/Frostvale/Story/00DoAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class FrostvaleAll {}

export default function main(): void {
    Core.setOptions();

    Frost.doAll();
    Core.setOptions(false);
}
