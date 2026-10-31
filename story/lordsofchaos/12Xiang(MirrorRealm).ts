/*
name: (Mirror Realm) Xiang
description: This will finish the Xiang quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, mirror-realm, xiang
*/
// Port of Scripts/Story/LordsofChaos/12Xiang(MirrorRealm).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class SagaMirrorRealm {}

export default function main(): void {
    Core.setOptions();

    LOC.xiang();

    Core.setOptions(false);
}
