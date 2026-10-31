/*
name: TimeforSomeSpringCleaning[AnyPet]
description: Uses the appropriate pet to farm Legion Tokens
tags: legion, legion token
*/
// Port of Scripts/Legion/LegionTokens/TimeforSomeSpringCleaning[AnyPet].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Legion = new CoreLegion();

export class TimeforSomeSpringCleaning_AnyPet_ {
    dOthething(): void {
        Legion.ltShogunParagon(
            undefined,
            bot.config!.get<boolean>("DoClearaPath"),
            bot.config!.get<boolean>("Enable Logger?"),
        );
    }
}

export const scriptOptions = defineScriptOptions(
    "FarmerJoePet",
    [
        option.bool(
            "DoClearaPath",
            'Do the "Clear a Path" Quest',
            'toggles doing the "Clear a Path" Quest. during the LT farm',
            false,
        ),
        option.bool("Enable Logger?", "Toggle Farm Logging", 'toggles the "Farming item (x/x)"', false),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new TimeforSomeSpringCleaning_AnyPet_();
    Core.setOptions();

    script.dOthething();

    Core.setOptions(false);
}
