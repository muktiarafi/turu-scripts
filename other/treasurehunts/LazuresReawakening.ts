/*
name: Lazure's Reawakening
description: This script will complete the Lazure's Reawakening quest.
tags: hollowborn, lae, lazure, reawakening, lazure's awakened skull, quest
*/
// Port of Scripts/Other/TreasureHunts/LazuresReawakening.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { HollowSoul } from "../../hollowborn/materials/HollowSoul";
import { CoreHollowbornStory } from "../../story/hollowborn/CoreHollowbornStory";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const HBStory = new CoreHollowbornStory();
const HS = new HollowSoul();

export class LazuresReawakening {
    getSkull(): void {
        if (Core.isCompletedBefore(9797)) {
            return;
        }

        // Story
        if (!Core.checkInventory("Lazure's Skull")) {
            Core.addDrop("Lazure's Skull");
            HBStory.shadowrealm();
        }

        // Level
        Farm.experience(70);

        Core.ensureAccept(9797);

        // Hollow Soul
        HS.getYaSoulsHeeeere(1500);

        // Gold Voucher 500k
        if (!Core.checkInventory("Gold Voucher 500k", 40)) {
            Adv.buyItem("alchemyacademy", 395, "Gold Voucher 500k", 40);
        }

        // Shadow's Eye
        if (!Core.checkInventory("Shadow's Eye", 2000)) {
            Core.equipClass(ClassType.Farm);
            Core.killMonster("shadowrealm", "r2", "Left", "*", "Shadow's Eye", 2000, { isTemp: false });
        }

        // Chaoroot Vitamer
        if (!Core.checkInventory("Chaoroot Vitamer", 1500)) {
            Core.equipClass(ClassType.Farm);
            Core.killMonster("hbchallenge", "r5", "Left", "*", "Chaoroot Vitamer", 1500, { isTemp: false });
        }

        // Jury's Statement
        if (!Core.checkInventory("Jury's Statement", 1000)) {
            Core.equipClass(ClassType.Farm);
            Core.killMonster("hbchallenge", "r3", "Left", "*", "Jury's Statement", 1000, { isTemp: false });
        }

        Core.ensureComplete(9797);
    }
}

export default function main(): void {
    const script = new LazuresReawakening();
    Core.setOptions();

    script.getSkull();

    Core.setOptions(false);
}
