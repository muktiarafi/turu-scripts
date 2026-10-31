/*
name: HBP - inserthere
description: does the 'inserthere' part of hollowborn doomKnight
tags: hollowborn paladin, hollowborn, inserthere
*/
// Port of Scripts/Hollowborn/HollowbornPaladin/CoreHollowbornPaladin.cs.

import { bot } from "turu";
import { AscendedDrakathGear } from "../../chaos/AscendedDrakathGear";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreBLOD } from "../../good/blod/CoreBLOD";
import { CoreHollowborn } from "../CoreHollowborn";
import { Artixpointe } from "../../story/Artixpointe";

const Farm = new CoreFarms();
const HB = new CoreHollowborn();
const BLOD = new CoreBLOD();
const ADG = new AscendedDrakathGear();
const APointe = new Artixpointe();
const Daily = new CoreDailies();

export class CoreHollowbornPaladin {
    postSummoningItems: string[] = [
        "Classic Hollowborn Paladin Armor",
        "Hollowborn Paladin Visor",
        "Hollowborn Paladin Hood",
        "Hollowborn Templar Helm",
        "Hollowborn Paladin Cape",
        "Hollowborn Paladin Cloak",
        "Dual Hollowborn Shadows of Fate",
        "Hollowborn Daimyo Battlepet",
        "Hollowborn Daimyo",
    ];

    getAll(): void {
        if (Core.checkInventory(this.postSummoningItems)) {
            return;
        }

        HB.hardcoreContract();
        this.hbShadowOfFate();
        Farm.experience();

        Core.addDrop(...this.postSummoningItems);
        while (!bot.shouldExit && !Core.checkInventory(this.postSummoningItems)) {
            Core.ensureAccept(7560);
            Core.huntMonster("shadowblast", "Carnage", "Shadow Seal", 1, { isTemp: false });
            HB.humanSoul(50);
            Core.ensureCompleteChoose(7560, this.postSummoningItems);
            bot.wait.forPickup("*");
        }
        Core.toBank(...this.postSummoningItems);
    }

    getSpecific(item: string): void {
        if (Core.checkInventory(item)) {
            return;
        }

        HB.hardcoreContract();
        this.hbShadowOfFate();
        Farm.experience();

        const Rewards = [...Core.ensureLoad(7560).rewards];
        const Item = Rewards.find((x) => x.name === item) ?? { id: 0 };
        // Ensure item is not null
        Core.addDrop(item);
        while (!bot.shouldExit && !Core.checkInventory(Item.id)) {
            Core.ensureAccept(7560);
            Core.huntMonster("shadowblast", "Carnage", "Shadow Seal", 1, { isTemp: false });
            HB.humanSoul(50);
            Core.ensureComplete(7560, Item.id);
            bot.wait.forPickup(Item.id);
        }
        Core.toBank(...this.postSummoningItems);
    }

    hbPaladin(): void {
        if (Core.checkInventory("Hollowborn Paladin")) {
            return;
        }

        HB.hardcoreContract();
        Farm.experience(75);

        Core.addDrop("Sparrow's Blood", "Brilliant Aura", "Gem of Superiority", "Condensed Mana", "Hollowborn Paladin");
        Core.ensureAccept(7557);
        if (!Core.checkInventory("Sparrow's Blood")) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAccept(803);
            Core.huntMonster("Arcangrove", "Seed Spitter", "Snapdrake", 17);
            Core.huntMonster("Arcangrove", "Gorillaphant", "Blood Lily", 30);
            Core.huntMonster("Arcangrove", "Seed Spitter", "Doom Dirt", 12);
            Core.ensureComplete(803);
        }
        BLOD.brilliantAura(1);
        Farm.doomWoodREP(3);
        Core.buyItem("lightguard", 277, "Dark Arts Scholar");
        Core.equipClass(ClassType.Farm);
        Core.huntMonster("shadowblast", "Legion Fenrir", "Gem of Superiority", 1, { isTemp: false });
        if (!Core.checkInventory("Exalted Paladin Seal")) {
            Farm.goodREP();
            Farm.gold(500000);
            Core.buyItem("darkthronehub", 1308, "Exalted Paladin Seal");
        }
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("timevoid", "Unending Avatar", "Condensed Mana", 1, { isTemp: false, publicRoom: true });
        HB.humanSoul(200);
        Core.ensureComplete(7557);
    }

    hbPaladinHelmet(): void {
        if (Core.checkInventory("Hollowborn Paladin Helmet")) {
            return;
        }

        HB.hardcoreContract();
        this.hbPaladin();
        Farm.experience(85);

        Core.addDrop("Dark Aura Gem", "Enchantment Rune", "Shadow Dragon Soul", "Hollowborn Paladin Helmet");
        Core.ensureAccept(7558);
        Core.buyItem("necropolis", 410, "Templar's Helm of Light");
        Farm.doomWoodREP(6);
        Core.buyItem("necropolis", 408, "Destiny Cloak");
        if (!Core.checkInventory("Dark Aura Gem")) {
            if (!Core.checkInventory("Enchanted Victory Blade")) {
                Core.buyItem("river", 1213, "Silver Victory Blade");
                if (!Core.checkInventory("Enchantment Rune")) {
                    Core.ensureAccept(4811);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("graveyard", "Skeletal Viking", "Ravenwing Scroll");
                    Core.huntMonster("graveyard", "Skeletal Warrior", "Unseeing Eye", 3);
                    Core.huntMonster("graveyard", "Big Jack Sprat", "Shard of Diamond Blade", 5);
                    Core.ensureComplete(4811);
                    bot.wait.forPickup("Enchantment Rune");
                }
                Core.buyItem("river", 1213, "Enchanted Victory Blade");
            }
            Core.ensureAccept(4812);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("graveyard", "Skeletal Warrior", "Broken Dream Catcher", 10);
            Core.ensureCompleteChoose(4812, ["Dark Aura Gem"]);
        }
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("necrocavern", "Shadow Dragon", "Shadow Dragon Soul", 1, { isTemp: false });
        Core.huntMonster("temple", "Cryptkeeper Lich", "Cryptkeeper Lich's Head");
        HB.humanSoul(200);
        Core.ensureComplete(7558);
    }

    hbShadowOfFate(): void {
        if (Core.checkInventory("Hollowborn Shadow of Fate")) {
            return;
        }

        HB.hardcoreContract();
        this.hbPaladin();
        this.hbPaladinHelmet();
        ADG.ascendedGear("Ascended Light of Destiny");
        Farm.experience(95);

        Core.addDrop("Undead Skull", "Hollowborn Shadow of Fate");
        Core.ensureAccept(7559);
        if (!Core.checkInventory("Unidentified 25")) {
            Farm.gold(15000000);
            Core.buyItem("tercessuinotlim", 1951, "Unmoulded Fiend Essence");
            Core.buyItem("tercessuinotlim", 1951, "Unidentified 25");
        }
        if (!Core.checkInventory("Seal of Light") || !Core.checkInventory("Seal of Darkness")) {
            Daily.brightKnightArmor({ checkArmor: false });
        }
        Core.equipClass(ClassType.Farm);
        Core.huntMonster("artixpointe", "Skeletal Minion", "Undead Skull", 1, { isTemp: false });
        APointe.omniArtifact();
        HB.humanSoul(300);
        Core.ensureComplete(7559);
    }
}
