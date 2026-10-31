/*
name: Sole Blood Blade + Empowered Version
description: Completes Sole Blood Blade and optionally obtains the empowered version.
tags: sole blood blade, sole bloodletter of nulgath, empowered sole bloodletter, nulgath, nation
*/
// Port of Scripts/Other/Weapons/SoleBloodBladeEmpowered.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreNation } from "../../nation/CoreNation";

const Nation = new CoreNation();

export class SoleBloodBladeEmpowered {
    getSoleBloodletter(): void {
        if (Core.checkInventory("Sole Bloodletter of Nulgath")) {
            return;
        }

        if (!Core.checkInventory("Bloodletter of Nulgath")) {
            Core.logger("Bloodletter of Nulgath is required to accept Sole Blood Blade.");
            return;
        }

        Core.addDrop("The Secret 1", "Sole Bloodletter of Nulgath");
        Core.ensureAccept(10021);
        Core.huntMonster("willowcreek", "Hidden Spy", "The Secret 1", undefined, { isTemp: false });
        Core.ensureComplete(10021);
        bot.wait.forPickup("Sole Bloodletter of Nulgath");
    }

    getEmpoweredSoleBloodletter(): void {
        if (Core.checkInventory("Empowered Sole Bloodletter")) {
            return;
        }

        if (!Core.checkInventory("Sole Bloodletter of Nulgath")) {
            Core.logger("Sole Bloodletter of Nulgath is required to accept Sole Empowered Blood Blade.");
            return;
        }

        if (bot.player.level < 95) {
            Core.logger("Level 95 is required to accept Sole Empowered Blood Blade.");
            return;
        }

        if (!Core.checkInventory("Nulgath Insignia", 25)) {
            Core.logger("25 Nulgath Insignias are required to complete Sole Empowered Blood Blade.");
            return;
        }

        Core.addDrop("The Secret 1", "Empowered Sole Bloodletter");
        Core.ensureAccept(10022);
        Nation.farmTaintedGem(350);
        Nation.farmDarkCrystalShard(200);
        Nation.farmDiamondofNulgath(500);
        Nation.farmVoucher({ member: false, keepVoucher: true });
        Core.huntMonster("willowcreek", "Hidden Spy", "The Secret 1", undefined, { isTemp: false });
        Core.ensureComplete(10022);
        bot.wait.forPickup("Empowered Sole Bloodletter");
    }
}

export const scriptOptions = defineScriptOptions(
    "SoleBloodBladeEmpowered",
    [
        option.bool(
            "EmpoweredVersion",
            "Get Empowered Version?",
            "Also complete Sole Empowered Blood Blade. Requires level 95 and 25 Nulgath Insignias.",
            false,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new SoleBloodBladeEmpowered();
    Core.setOptions();

    script.getSoleBloodletter();

    if (bot.config!.get<boolean>("EmpoweredVersion")) {
        script.getEmpoweredSoleBloodletter();
    }

    Core.setOptions(false);
}
