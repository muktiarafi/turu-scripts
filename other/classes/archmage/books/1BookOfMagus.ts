/*
name: 1BookOfMagus
description: null
tags: null
*/
// Port of Scripts/Other/Classes/ArchMage/Books/1BookOfMagus.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { Core } from "../../../../core/CoreBots";
import { CoreArchMage } from "../CoreArchMage";

const AM = new CoreArchMage();

export class BookOfMagus {}

export const scriptOptions = defineScriptOptions(
    "ArchMage",
    [
        option.bool(
            "cosmetics",
            "Get Cosmetics",
            "Gets the cosmetic rewards (redoes quests if you don't have them, disable to just get ArchMage and the weapon) [On by default]",
            true,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    Core.setOptions();

    AM.bookOfMagus();

    Core.setOptions(false);
}
