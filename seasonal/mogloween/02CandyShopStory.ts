/*
name: Candy Shop Story
description: This will complete the Candy Shop story quest.
tags: story, quest, mogloween, seasonal, candy, shop
*/
// Port of Scripts/Seasonal/Mogloween/02CandyShopStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class CandyShop {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.candyShop();

    Core.setOptions(false);
}
