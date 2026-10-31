/*
name: Bandits Correspondence
description: Bandits Correspondence
tags: darkon, bandits correspondence
*/
// Port of Scripts/Darkon/Materials/BanditsCorrespondence.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Darkon = new CoreDarkon();

export class BanditsCorrespondence {}

export default function main(): void {
    Core.bankingBlackList.push("Bandit's Correspondence");

    Core.setOptions();

    Darkon.banditsCorrespondence();

    Core.setOptions(false);
}
