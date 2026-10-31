/*
name: ObsidianLightofDestiny
description: null
tags: null
*/
// Port of Scripts/Other/Weapons/ObsidianLightofDestiny.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreBLOD, WeaponOfDestiny } from "../../good/blod/CoreBLOD";
import { CoreDoomwood } from "../../story/doomwood/CoreDoomwood";

const Farm = new CoreFarms();
const BLOD = new CoreBLOD();
const DW = new CoreDoomwood();

export class ObsidianLightofDestiny {
    axe(): void {
        if (Core.checkInventory("Obsidian Light of Destiny")) {
            return;
        }

        DW.doomwoodPart3();
        Core.addDrop("Obsidian Light of Destiny");

        //The Edge of Destiny
        if (!Core.checkInventory("Obsidian Light of Destiny")) {
            Core.ensureAccept(7648);

            if (!Core.checkInventory("Blinding Edge of Obsidian")) {
                Farm.mysteriousDungeonREP();
                Core.buyItem("darkthronehub", 1308, "Blinding Edge of Obsidian");
                bot.wait.forPickup("Blinding Edge of Obsidian");
            }

            BLOD.getBlindingWeapon(WeaponOfDestiny.Mace);
            BLOD.getBlindingWeapon(WeaponOfDestiny.Bow);
            BLOD.getBlindingWeapon(WeaponOfDestiny.Blade);

            BLOD.brilliantAura(40);
            //Brilliant Aura x40
            BLOD.brightAura(120);
            //Bright Aura x120
            BLOD.blindingAura(1);
            //Blinding Aura
            BLOD.loyalSpiritOrb(750);
            //Spirit Orb (Misc) x5,000
            BLOD.spiritOrb(5000);
            //Loyal Spirit Orb x750

            Core.ensureComplete(7648);
            bot.wait.forPickup("Obsidian Light of Destiny");
        }
    }
}

export default function main(): void {
    const script = new ObsidianLightofDestiny();
    Core.setOptions();

    script.axe();

    Core.setOptions(false);
}
