/*
name: Astravian Medal
description: Astravian Medals
tags: astravian medals, darkon
*/
// Port of Scripts/Darkon/Materials/AstravianMedal.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Darkon = new CoreDarkon();

export class AstravianMedal {}

export default function main(): void {
    Core.bankingBlackList.push("Astravian Medal");

    Core.setOptions();

    Darkon.astravianMedal();

    Core.setOptions(false);
}
