/*
name: Walpurgisnacht
description: Completes the quest chain in /walpurgisnacht.
tags: walpurgisnacht, story, quests, walpurgisnacht
*/
// Port of Scripts/Seasonal/Mogloween/20Walpurgisnacht.cs.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class Walpurgisnacht {}

export default function main(): void {
    Core.setOptions();
    if (!Core.isCompletedBefore(10905)) {
        coreMogloween.birgittaMogloween();
    }

    if (!Core.isCompletedBefore(10916)) {
        coreMogloween.shadowSlayerWar();
    }

    coreMogloween.walpurgisnacht();

    Core.setOptions(false);
}
