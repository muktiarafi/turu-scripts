/*
name: null
description: null
tags: null
*/
// Port of Scripts/Nation/OblivionBlade(RareandNot)/CoreOblivionBladeofNulgath.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Adv = new CoreAdvanced();
const Nation = new CoreNation();

export class CoreOblivionBladeofNulgath {
    oblivionBladeofFighting(): void {
        if (Core.checkInventory("Oblivion Wrath Blade Of Nulgath")) {
            return;
        }

        this.petCheck(1122, 1109);

        Core.registerQuests(Core.checkInventory("Oblivion Blade of Nulgath Pet") ? 1122 : 1109);
        if (!Core.checkInventory("Oblivion Wrath Blade Of Nulgath")) {
            Nation.farmGemofNulgath(10);
        }
        Core.resetQuest(870);
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("tercessuinotlim", "Taro Blademaster", "Blade Master Rune");
        Core.cancelRegisteredQuests();
    }

    oblivionNulgath(item: string, quant: number): void {
        if (Core.checkInventory(item, quant)) {
            return;
        }

        const rewards =
            Core.ensureLoad(Core.checkInventory("Oblivion Blade of Nulgath Pet") ? 2557 : 868)
                .rewards?.filter((x) => x != null)
                .map((x) => x.name) ?? [];

        Core.addDrop(...[...[...rewards, ...[item]], ...["Mana Energy for Nulgath"]]);

        this.petCheck(2557, 868);

        while (!bot.shouldExit && !Core.checkInventory(item, quant)) {
            Core.equipClass(ClassType.Solo);
            Core.huntMonsterMapID("elemental", 7, "Mana Energy for Nulgath", undefined, { isTemp: false, log: false });
            Core.equipClass(ClassType.Farm);
            Core.killMonster("elemental", "r3", "Down", "*", "Charged Mana Energy for Nulgath", 5, { log: false });
            bot.wait.forPickup(item);
            if (bot.inventory.isMaxStack(item)) {
                Core.logger("Max Stack Hit.");
            } else {
                Core.logger(`${item}: ${bot.inventory.getQuantity(item)}/${quant}`);
            }
        }
        Core.cancelRegisteredQuests();
    }

    phoenixBladeofNulgath(): void {
        if (Core.checkInventory("Phoenix Blade of Nulgath")) {
            return;
        }

        this.petCheck(2558, 588);

        Nation.farmDiamondofNulgath(10);
        Nation.farmDarkCrystalShard(5);
        Nation.farmTaintedGem(5);
        Nation.farmUni13(1);
        Core.huntMonster("lair", "Onyx Lava Dragon", "Phoenix Blade", undefined, { isTemp: false });
        Core.huntMonster("underworld", "Undead Bruiser", "Undead Bruiser Sigil");

        Core.cancelRegisteredQuests();
    }

    theWeaponParasite(): void {
        if (Core.checkInventory("Sinister Leech Blade of Nulgath")) {
            return;
        }

        this.petCheck(2559, 589);

        Nation.supplies("Unidentified 6");
        Nation.farmDarkCrystalShard(10);
        Nation.farmTaintedGem(10);
        Core.huntMonster("underworld", "Skull Warrior", "Skull Warrior Rune");

        Core.cancelRegisteredQuests();
    }

    doomWormCreepers(): void {
        if (Core.checkInventory("Dread Heads of Nulgath")) {
            return;
        }

        this.petCheck(2560, 591);

        Nation.farmTaintedGem(10);
        Adv.buyItem("Necropolis", 407, "Doom Worm Creepers");
        Core.huntMonster("underworld", "Legion Fenrir", "Legion Fenrir Rune");

        Core.cancelRegisteredQuests();
    }

    theDarkDeal(quant: number): void {
        if (Core.checkInventory("Relic of Chaos", quant)) {
            return;
        }
        bot.drops.add("Relic of Chaos");
        this.petCheck(2561, 599);
        while (!bot.shouldExit && !Core.checkInventory("Relic of Chaos", quant)) {
            Core.huntMonster("evilmarsh", "Tainted Elemental", "Tainted Soul");
        }

        Core.cancelRegisteredQuests();
    }

    voucheritemChampionofNulgath(): void {
        if (!Core.checkInventory("Warlord")) {
            return;
        }

        if (Core.checkInventory("Champion Blade of Nulgath")) {
            return;
        }

        this.petCheck(601, 2562);

        Adv.rankUpClass("Warlord");
        Core.addDrop("Champion Blade of Nulgath");

        Nation.supplies("Voucher of Nulgath");
        Nation.supplies("Voucher of Nulgath (non-mem)");
        Nation.farmUni13(1);
        Core.huntMonster("Evilmarsh", "Tainte Elemental", "Tainted Rune of Evil");
        bot.wait.forPickup("Champion Blade of Nulgath");

        Core.cancelRegisteredQuests();
    }

    /**
     * Turns in Voucher of Nulgath(mem) for Diamonds of Nulgath
     *
     * @param quant Quanity of Gems of Nulgath to Get
     */
    diamondsofNulgathSale(quant: number): void {
        if (Core.checkInventory("item")) {
            return;
        }

        this.petCheck(2563, 603);

        while (!bot.shouldExit && !Core.checkInventory("Diamonds of Nulgath", quant)) {
            Nation.farmVoucher({ member: true });
        }

        Core.cancelRegisteredQuests();
    }

    archfiendCloak(): void {
        if (Core.checkInventory("Archfiend Cloak of Nulgath")) {
            return;
        }

        this.petCheck(2564, 607);

        Adv.buyItem("tercessuinotlim", 68, "Fiend Cloak of Nulgath");
        Nation.farmVoucher({ member: true });
        Nation.farmTaintedGem(7);
        Nation.farmDarkCrystalShard(7);
        Nation.farmDiamondofNulgath(3);
        Core.huntMonster("underworld", "Undead Bruiser", "Undead Bruiser Rune");

        Core.cancelRegisteredQuests();
    }

    theMarks(): void {
        if (Core.checkInventory("Unholy Reaper of Nulgath")) {
            return;
        }

        this.petCheck(2565, 610);

        Core.addDrop("The Secret 1", "The Secret 2", "Unholy Reaper of Nulgath");
        Core.ensureAccept(623);
        Core.huntMonster("willowcreek", "Hidden Spy", "The Secret 1", undefined, { isTemp: false });
        Core.huntMonster("Tercessuinotlim", "Ninja Spy", "The Secret 2", undefined, { isTemp: false });
        this.empoweringStuff();
        Nation.farmDiamondofNulgath(13);
        Nation.farmUni13(1);

        Core.cancelRegisteredQuests();
    }

    private empoweringStuff(): void {
        if (Core.checkInventory("Death Scythe of Nulgath")) {
            return;
        }

        Core.addDrop("Death Scythe of Nulgath", "Unidentified Item of Nulgath");

        if (!Core.checkInventory("Unidentified Item of Nulgath")) {
            Core.ensureAccept(623);
            Nation.farmUni13(1);
            Core.huntMonster("willowcreek", "Hidden Spy", "The Secret 1", undefined, { isTemp: false });
        }

        Core.ensureAccept(558);
        Nation.farmUni13(1);
        Nation.farmDiamondofNulgath(10);
        Core.huntMonster("underworld", "Undead Bruiser", "Undead Bruiser Sigil");
        Core.ensureComplete(558);
        bot.wait.forPickup("Death Scythe of Nulgath");
    }

    petCheck(OblivionID: number, OblivionRareID: number): void {
        if (Core.isMember && Core.checkInventory("Oblivion Blade of Nulgath Pet")) {
            Core.registerQuests(OblivionID);
        } else if (Core.checkInventory("Oblivion Blade of Nulgath Pet (Rare)")) {
            Core.registerQuests(OblivionRareID);
        } else {
            Core.logger("You Dont Own Either of The Required Pets.", undefined, { stopBot: true });
        }
        return;
    }
}
