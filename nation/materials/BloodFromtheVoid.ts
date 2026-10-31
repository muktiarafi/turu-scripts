/*
name: Blood From the Void
description: Farms Blood From the Void from "Obey Yourself, or be Commande" in /tercesinvasion
tags: tercesinvasion, Jadzia, Blood From the Void, Nulgath Saga, Nulgath Merge, Nulgath Birthday
*/
// Port of Scripts/Nation/Materials/BloodFromtheVoid.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";
import { TercesInvasion } from "../../story/nation/TercesInvasion";

const TI = new TercesInvasion();
const Nation = new CoreNation();

export class BloodFromTheVoid {}

export default function main(): void {
    Core.setOptions();

    TI.storyLine();
    Nation.bloodFromTheVoid(300);

    Core.setOptions(false);
}
