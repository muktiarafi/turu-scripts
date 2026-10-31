/*
name: EvovledHexOrbItems[Mem]
description: null
tags: null
*/
// Port of Scripts/Nation/EvolvedOrb/EvovledHexOrbItems[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNation } from "../CoreNation";
import { EvolvedHexOrb } from "./EvolvedHexOrb";

const Adv = new CoreAdvanced();
const Farm = new CoreFarms();
const Nation = new CoreNation();
const EHO = new EvolvedHexOrb();

export class EvovledHexOrbItems {
    getItems(): void {
        if (!Core.isMember || Core.checkInventory(this.rewards, undefined, { toInv: false })) {
            return;
        }

        EHO.getEvolvedHexOrb();
        Core.unbank(33197);
        //make sure ya have it

        this.unlockedevovledHexArmor();
        this.cutOffOneHead();
        this.empoweringtheEmpowered();
        //yet to be added:
        // Unlock the Evolved Hex (Rare)
        // Unlock the Evolved Hex (Arcane)
    }

    unlockedevovledHexArmor(): void {
        //#region Required Items
        if (
            !Core.checkInventory("Platinum Coin of Nulgath: 2500") ||
            !Core.checkInventory(33197) ||
            Core.checkInventory("Evolved Hex of Nulgath")
        ) {
            return;
        }

        Adv.buyItem(bot.map.name, 299, "Oracle");
        Adv.rankUpClass("Oracle");

        //#endregion
        // Unlock the Evolved Hex Armor - 4764
        Core.addDrop("Evolved Hex of Nulgath", "Unidentified 22");
        Core.ensureAccept(4764);

        Nation.farmUni13(3);
        Core.logger(
            "Aquiring uni 22 via `The Assistant` (with War-Torn Memorabilia)," +
                'as otherwise it costs 15m gold ( you can also aquire the "4th Betrayal Blade of Nulgath Pet" along the way)',
        );
        Nation.theAssistant("Unidentified 22", 1);
        if (!Core.checkInventory(8069)) {
            Nation.kisstheVoid(1, "4th Betrayal Blade of Nulgath Pet");
        }
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("tercessuinotlim", "Taro Blademaster", "Polish's Book of Avalon", undefined, {
            isTemp: false,
        });
        Farm.bludrutBrawlBoss(undefined, 500);
        Adv.buyItem(bot.map.name, 222, "Warden of Light");

        Core.ensureComplete(4764);
        bot.wait.forPickup("Evolved Hex of Nulgath");
    }

    cutOffOneHead(): void {
        if (
            !Core.checkInventory("Platinum Coin of Nulgath: 300") ||
            !Core.checkInventory(33197) ||
            Core.checkInventory("Evolved Hex Helm")
        ) {
            return;
        }

        // Cut Off One Head... 4769
        Core.ensureAccept(4769);

        Core.huntMonster("marsh2", "Soulseeker", "Deathdoll enchant", undefined, { isTemp: false });
        Nation.farmDiamondofNulgath(10);
        Nation.farmVoucher({ member: false });
        Nation.farmTotemofNulgath(1);
        Nation.farmBloodGem(5);
        Core.huntMonster("void", "Void Dragon", "Heart of the Void", undefined, { isTemp: false });

        Core.ensureComplete(4769);
        bot.wait.forPickup("Evolved Hex Helm");
    }

    empoweringtheEmpowered(): void {
        if (
            !Core.checkInventory("Platinum Coin of Nulgath: 2500") ||
            !Core.checkInventory(33197) ||
            Core.checkInventory("Evolved Hex Staff")
        ) {
            return;
        }

        //Empowering the Empowered - 4770
        Core.ensureAccept(4770);
        Nation.farmUni10(30);
        Nation.farmTaintedGem(30);
        Nation.farmDarkCrystalShard(30);
        Nation.farmVoucher({ member: false });
        Nation.farmTotemofNulgath(10);
        Nation.supplies("Unidentified 29");
        Adv.buyItem("alchemyacademy", 2114, 11626, 10, 9724);

        Core.ensureComplete(4770);

        bot.wait.forPickup("Evolved Hex Staff");
    }

    private readonly rewards: string[] = ["Evolved Hex of Nulgath", "Evolved Hex Helm", "Evolved Hex Staf"];
}

export default function main(): void {
    const script = new EvovledHexOrbItems();
    Core.setOptions();

    script.getItems();

    Core.setOptions(false);
}
