/*
name: Moglin Pets Daily
description: Moglin Pets
tags: daily, moglin pets, pet
*/
// Port of Scripts/Dailies/MoglinPets.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class MoglinPets {}

export default function main(): void {
    Core.setOptions();

    Daily.moglinPets();

    Core.setOptions(false);
}
