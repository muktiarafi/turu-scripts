/*
name: Mount Maleno
description: This script completes the storyline in /MountMaleno.
tags: age, of, ruin, saga, story, quest, mountmaleno,aleister,dahlia
*/
// Port of Scripts/Story/AgeOfRuin/18MountMaleno.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class MountMaleno {}

export default function main(): void {
    Core.setOptions();

    AOR.mountMaleno();

    Core.setOptions(false);
}
