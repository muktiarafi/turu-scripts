/*
name: Shadowrealm
description: This script will complete the Whispering Helmet's storyline in /shadowrealm.
tags: hollowborn, saga, lae, whispering, helmet, whispering helmet, treasure, hunt, treasure hunt
*/
// Port of Scripts/Story/Hollowborn/03Shadowrealm.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHollowbornStory } from "./CoreHollowbornStory";

const HB = new CoreHollowbornStory();

export class Shadowrealm {}

export default function main(): void {
    Core.setOptions();

    HB.shadowrealm();

    Core.setOptions(false);
}
