/*
name: BirgittaMogloween
description: Completes the quest chain in /birgittamogloween.
tags: birgittamogloween, story, quests, birgittamogloween
*/
// Port of Scripts/Seasonal/Mogloween/18BirgittaMogloween.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class BirgittaMogloween {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.birgittaMogloween();

    Core.setOptions(false);
}
