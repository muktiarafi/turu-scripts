/*
name: Ultimate Light of Destiny
description: This bot will do the entire farm for the Sanctified Light of Destiny. *Note* it uses dailies due to BLOD
tags: BLOD, ULOD, blinding, ultimate, light, destiny, undead, 75, damage, good
*/
// Port of Scripts/Good/BLoD/2UltimateBlindingLightofDestiny.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { BLODMethod, CoreBLOD } from "./CoreBLOD";

const BLOD = new CoreBLOD();

export class UltimateBLoD {
    ultimateBlindingLightofDestiny(): void {
        if (Core.checkInventory("Ultimate Blinding Light of Destiny")) {
            return;
        }

        BLOD.blindingLightOfDestiny(BLODMethod.Fewest_Hours);

        this.overwhelmedAxe();
        this.shardOfAnOrb();
        this.purifiedUndeadDragonEssence();

        Core.buyItem("techfortress", 1902, "Ultimate Blinding Light of Destiny", undefined, 6296);
    }

    overwhelmedAxe(): void {
        if (Core.checkInventory("Overwhelmed Axe")) {
            return;
        }

        Core.addDrop("Overwhelmed Axe");
        Core.farmingLogger("Overwhelmed Axe", 1);

        BLOD.spiritOrb(250);
        BLOD.loyalSpiritOrb(100);
        BLOD.brilliantAura(10);
        BLOD.blindingAura(1);

        Core.buyItem("techfortress", 1902, "Overwhelmed Axe", undefined, 7588);
    }

    shardOfAnOrb(quant = 5): void {
        if (Core.checkInventory("Shard of An Orb", quant)) {
            return;
        }

        Core.addDrop("Shard of An Orb");
        Core.farmingLogger("Shard of An Orb", quant);
        Core.equipClass(ClassType.Solo);

        Core.registerQuests(7654);
        while (!bot.shouldExit && !Core.checkInventory("Shard of An Orb", quant)) {
            //More then one item of the same name as drop btoh temp and non-temp.
            while (!bot.shouldExit && !Core.checkInventory(55903, 10)) {
                Core.killMonster("dflesson", "r12", "Right", "Fluffy the Dracolich", undefined, undefined, {
                    log: false,
                });
            }
            Core.killMonster("dflesson", "r3", "Right", "Fire Elemental", "Fire Elemental's Bracer", 5, {
                isTemp: false,
            });
            Core.killMonster("dflesson", "r6", "Right", "Tog", "Tog Claw", 5, { isTemp: false });

            bot.wait.forPickup("Shard of An Orb");
        }
        Core.cancelRegisteredQuests();
    }

    purifiedUndeadDragonEssence(quant = 1): void {
        if (Core.checkInventory("Purified Undead Dragon Essence", quant)) {
            return;
        }

        BLOD.blindingLightOfDestiny(BLODMethod.Fewest_Hours);

        this.overwhelmedAxe();

        Core.addDrop("Purified Undead Dragon Essence");
        Core.farmingLogger("Purified Undead Dragon Essence", quant);

        while (!Core.checkInventory("Purified Undead Dragon Essence", quant)) {
            Core.ensureAccept(7655);
            Core.equipClass(ClassType.Solo);

            Core.killMonster("doomwood", "r10", "Right", "Undead Paladin", "Purification Orb", 10, { isTemp: false });

            Core.addDrop("Rainbow Moonstone");
            Core.registerQuests(7291);
            while (!bot.shouldExit && !Core.checkInventory("Rainbow Moonstone", 5)) {
                Core.huntMonster("earthstorm", "Diamond Golem", "Chip of Diamond");
                Core.huntMonster("earthstorm", "Emerald Golem", "Chip of Emerald");
                Core.huntMonster("earthstorm", "Ruby Golem", "Chip of Ruby");
                Core.huntMonster("earthstorm", "Sapphire Golem", "Chip of Sapphire");

                bot.wait.forPickup("Rainbow Moonstone");
            }
            Core.cancelRegisteredQuests();

            Core.killMonster("desolich", "r3", "Left", "Desolich", "Desolich's Dark Horn", 3, { isTemp: false });

            Core.ensureComplete(7655);
            bot.wait.forPickup("Purified Undead Dragon Essence");
        }
    }
}

export default function main(): void {
    const script = new UltimateBLoD();
    Core.setOptions();

    script.ultimateBlindingLightofDestiny();

    Core.setOptions(false);
}
