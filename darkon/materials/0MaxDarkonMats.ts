/*
name: 0MaxDarkonMats
description: Max all of the Darkon materials
tags: darkon, max, all, new class
*/
// Port of Scripts/Darkon/Materials/0MaxDarkonMats.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Darkon = new CoreDarkon();
const Adv = new CoreAdvanced();

export class MaxAllDarkon {
    getAllMats(): void {
        Darkon.aMelody(undefined, true);
        Darkon.ancientRemnant(undefined, true);
        Darkon.banditsCorrespondence(undefined, true);
        Darkon.farmReceipt(undefined, true);
        Darkon.lasGratitude(undefined, true);
        Darkon.wheelofFortune(undefined, undefined, true);
        Darkon.sukisPrestiege(undefined, true);
        Darkon.teeth(undefined, true);
        Darkon.astravianMedal(undefined, true);
        Darkon.unfinishedMusicalScore(300);
        Core.logger(`This will require ${(22 - Core.dynamicQuant("Darkon's Instant Noodle", false)) * 2222222} gold`);
        Adv.buyItem("garden", 1831, "Darkon's Instant Noodle", 22);
    }
}

export default function main(): void {
    const script = new MaxAllDarkon();
    Core.setOptions();
    Core.bankingBlackList.push(
        "A Melody",
        "Ancient Remnant",
        "Bandit's Correspondence",
        "Darkon's Receipt",
        "La's Gratitude",
        "Mourning Flower",
        "Jus Divinum Scale",
        "Unfinished Musical Score",
        "Teeth",
    );
    script.getAllMats();

    Core.setOptions(false);
}
