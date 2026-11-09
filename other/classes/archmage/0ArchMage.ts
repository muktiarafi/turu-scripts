/*
name: 0ArchMage
description: null
tags: null
*/
// Port of Scripts/Other/Classes/ArchMage/0ArchMage.cs.

import { Core } from "../../../core/CoreBots";
import { archMageChoices, CoreArchMage, scriptOptions as archMageOptions } from "./CoreArchMage";

const AM = new CoreArchMage();

export class ArchMage {}

// C# passes CoreArchMage's OptionsStorage and Options: the same options as its own script.
export const scriptOptions = archMageOptions;

export default function main(): void {
    Core.setOptions();

    AM.getAM(true, archMageChoices());

    Core.setOptions(false);
}
