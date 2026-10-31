/*
name: Hollowborn Oblivion Blade
description: This script will get Hollowborn Oblivion Blade.
tags: hollowborn, oblivion, blade, summoning, summoning and stuff, lae, archfiend enchanted orbs
*/
// Port of Scripts/Hollowborn/HollowbornOblivionBlade.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";
import { CoreHollowborn } from "./CoreHollowborn";
import { CoreNation } from "../nation/CoreNation";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const HB = new CoreHollowborn();
const Nation = new CoreNation();

export class HollowbornOblivionBlade {
    getBlade(): void {
        if (Core.checkInventory("Hollowborn Oblivion Blade")) {
            return;
        }

        Core.addDrop("Hollowborn Oblivion Blade", "4th Dimension Gem");

        Core.ensureAccept(7294);
        Farm.experience(80);
        Nation.farmVoucher({ member: false, keepVoucher: true });
        this.archFiendEnchantedOrbs();
        Nation.farmUni13(1);
        Nation.farmDiamondofNulgath(500);
        if (!Core.checkInventory("Unidentified 25")) {
            Adv.buyItem("tercessuinotlim", 1951, "Unmoulded Fiend Essence");
            bot.wait.forPickup("Unmoulded Fiend Essence");
            Adv.buyItem("tercessuinotlim", 1951, "Unidentified 25");
        }
        Nation.approvalAndFavor(0, 1000);
        Nation.farmBloodGem(50);
        Core.huntMonster("lostruinswar", "Diabolical Warlord", "Diabolical Minion's Seed", undefined, {
            isTemp: false,
        });
        if (!Core.checkInventory("4th Dimension Gem")) {
            Core.ensureAccept(5163);
            Core.huntMonster("blackholesun", "Black Light Elemental", "Black Light", 5);
            Core.ensureComplete(5163);
            bot.wait.forPickup("4th Dimension Gem");
        }
        Core.huntMonster("goldenarena", "Blessed Dragon", "Celestial Seal", undefined, { isTemp: false });
        Core.huntMonster("shadowattack", "Death", "Death's Power", undefined, { isTemp: false });
        HB.freshSouls(1, 350);
        Core.ensureComplete(7294);
        bot.wait.forPickup("Hollowborn Oblivion Blade");
        Adv.enhanceItem("Hollowborn Oblivion Blade", EnhancementType.Lucky, {
            cSpecial: CapeSpecial.None,
            hSpecial: HelmSpecial.None,
            wSpecial: WeaponSpecial.Spiral_Carve,
        });
    }

    archFiendEnchantedOrbs(): void {
        if (Core.checkInventory("ArchFiend Enchanted Orbs")) {
            return;
        }

        HB.freshSouls(1, 100);
        if (!Core.checkInventory("Unidentified 25")) {
            Farm.gold(15000000);
            Core.buyItem("tercessuinotlim", 1951, "Unmoulded Fiend Essence");
            Core.buyItem("tercessuinotlim", 1951, "Unidentified 25");
        }
        Nation.farmUni13(1);
        Nation.farmDiamondofNulgath(150);
        Nation.farmBloodGem(10);
        Nation.farmVoucher({ member: false });
        Core.buyItem("tercessuinotlim", 1820, "ArchFiend Enchanted Orbs");
        bot.wait.forPickup("ArchFiend Enchanted Orbs");
    }
}

export default function main(): void {
    const script = new HollowbornOblivionBlade();
    Core.setOptions();

    script.getBlade();

    Core.setOptions(false);
}
