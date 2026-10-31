/*
name: null
description: null
tags: null
*/
// Port of Scripts/Evil/NSoD/CoreNSOD.cs.
// Not ported (FarmerJoe's DoAll doesn't reach them): GetNSOD, GetNBOD, NSBlade, NSHilt, NSAura, EnergizedBlade, EnergizedHilt, EnergizedAura, FindBlade, FindHilt, FindAura, BariumOfDoom, Barium, TimeLordNecro, CavernCelestite, PrimarchHilt, BladeEssence, CHourglass, ScrollDarkArts, PreFarmSteps.

import { bot, option } from "turu";
import { ClassType, Core, configOr } from "../../core/CoreBots";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { CoreDailies } from "../../core/CoreDailies";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreBLOD } from "../../good/blod/CoreBLOD";
import { Necromancer } from "../../other/classes/Necromancer";
import { CoreSDKA } from "../sdka/CoreSDKA";

const Farm = new CoreFarms();
const SDKA = new CoreSDKA();
const Adv = new CoreAdvanced();
const Daily = new CoreDailies();
const BLOD = new CoreBLOD();
const Necro = new Necromancer();

export class CoreNSOD {
    maxStack = option.bool(
        "MaxStack",
        "Max Stack",
        'Max Stack Monster Essences in "Retreive Void Auras"\nRecommended setting: True',
        true,
    );

    preFarm = option.bool(
        "PreFarm",
        "Pre Farm Materials",
        "Farm all requiered items before merging everything. Not recommended if you already did a merge yourself.\nRecommended setting: False",
        false,
    );

    getSDKA = option.bool(
        "getSDKA",
        "Get SDKA first [Mem]",
        "If true, the bot will attempt to get SDKA first, so that it can use the fastest Void Aura farm available\nMember-Only\nRecommended setting: True",
        true,
    );

    essences: string[] = [
        "Astral Ephemerite Essence",
        "Belrot the Fiend Essence",
        "Black Knight Essence",
        "Tiger Leech Essence",
        "Carnax Essence",
        "Chaos Vordred Essence",
        "Dai Tengu Essence",
        "Unending Avatar Essence",
        "Void Dragon Essence",
        "Creature Creation Essence",
    ];

    voidAuras(quant = 7500): void {
        if (Core.checkInventory("Void Aura", quant)) return;

        if (configOr("getSDKA", false) && bot.player.isMember && !Core.checkInventory(14474)) SDKA.doAll();

        Core.addDrop("Void Aura");
        Core.farmingLogger("Void Aura", quant);

        if (Core.checkInventory(14474)) this.commandingShadowEssences(quant);

        if (bot.player.isMember) this.gatheringUnstableEssences(quant);
        else this.retrieveVoidAuras(quant);
    }

    commandingShadowEssences(quant = 7500): void {
        if (Core.checkInventory("Void Aura", quant) || !Core.checkInventory(14474)) return;

        bot.options.aggroAllMonsters = false;
        bot.options.aggroMonsters = false;
        while (!bot.shouldExit && !Core.checkInventory("Void Aura", quant)) {
            Core.ensureAccept(4439);
            Core.equipClass(ClassType.Solo);
            Core.huntMonsterMapID("shadowrealmpast", 11, "Malignant Essence", 3, { isTemp: false });

            Core.equipClass(ClassType.Farm);
            Core.killMonster("shadowrealmpast", "Enter", "Spawn", "*", "Empowered Essence", 50, { isTemp: false });
            Core.ensureComplete(4439);
            Core.farmingLogger("Void Aura", quant);
        }
        Core.abandonQuest(4439);
    }

    gatheringUnstableEssences(quant = 7500): void {
        if (Core.checkInventory("Void Aura", quant) || !Core.isMember) return;

        Farm.evilREP();
        Core.equipClass(ClassType.Farm);

        Core.registerQuests(4438);
        while (!Core.checkInventory("Void Aura", quant)) {
            Core.killMonster("reddeath", "r2", "Left", "*", "Mirror Essence", 175, { isTemp: false });
            Core.killMonster("neverworldb", "r2", "Left", "*", "Twisted Essence", 25, { isTemp: false });
            Core.huntMonster("doomwar", "Zombie King Alteon", "Transposed Essence", 1, { isTemp: false });

            bot.wait.forPickup("Void Aura");
            Core.farmingLogger("Void Aura", quant);
        }
        Core.abandonQuest(4438);
    }

    retrieveVoidAuras(quant = 7500): void {
        if (Core.checkInventory("Void Aura", quant)) return;

        let Essencequant = 20;
        if (bot.config != null) {
            Essencequant = configOr("MaxStack", false) ? 100 : 20;
        } else {
            Core.logger("Bot.Config is null, defaulting Essencequant to 20.");
        }
        Farm.evilREP();
        Core.addDrop(...this.essences);
        if (!Core.checkInventory("Necromancer", 1, { toInv: false })) bot.drops.add("Creature Shard");

        while (!bot.shouldExit && !Core.checkInventory("Void Aura", quant)) {
            Core.farmingLogger("Void Aura", quant);
            Core.ensureAccept(4432);

            Core.equipClass(ClassType.Farm);
            Core.huntMonster("timespace", "Astral Ephemerite", "Astral Ephemerite Essence", Essencequant, {
                isTemp: false,
            });

            this.huntMonsterBatch(
                Essencequant,
                false,
                false,
                true,
                ["necrocavern", 5, "Chaos Vordred Essence"],
                ["citadel", 21, "Belrot the Fiend Essence"],
                ["greenguardwest", 22, "Black Knight Essence"],
                ["mudluk", 18, "Tiger Leech Essence"],
                ["aqlesson", 17, "Carnax Essence"],
                ["hachiko", 10, "Dai Tengu Essence"],
                ["timevoid", 12, "Unending Avatar Essence"],
                ["dragonchallenge", 4, "Void Dragon Essence"],
                ["maul", 17, "Creature Creation Essence"],
            );

            Core.ensureCompleteMulti(4432);
            bot.wait.forPickup("Void Aura");
            Core.farmingLogger("Void Aura", quant);
        }
    }

    private huntMonsterBatch(
        quant: number,
        isTemp: boolean,
        publicRoom: boolean,
        log: boolean,
        ...monsters: [map: string, monster: number, essence: string][]
    ): void {
        Core.addDrop(...monsters.map((x) => x[2]));
        Core.equipClass(ClassType.Solo);
        for (const monster of monsters.filter((x) => x[2] != null && x[1] > 0 && !Core.checkInventory(x[2], quant)))
            Core.huntMonsterMapID(monster[0], monster[1], monster[2], quant, { isTemp, log, publicRoom });
    }

    bonesVoidRealm(quant: number): void {
        if (Core.checkInventory("Bones from the Void Realm", quant)) return;
        Core.farmingLogger("Bones from the Void Realm", quant);
        Core.addDrop("Undead Energy");
        Farm.battleUnderB("Bone Dust", quant * 50);
        this.voidAuras(quant * 50);
        Core.buyItem("shadowfall", 793, "Bones from the Void Realm", quant);
        bot.wait.forPickup("Bones from the Void Realm");
    }

    energizedAura(): void {
        if (Core.checkInventory("Energized Aura")) {
            Core.farmingLogger("Energized Aura");
            return;
        }

        Core.addDrop("Energized Aura");
        this.findAura();
        this.timeLordNecro(1);
        this.voidAuras(150);
        Core.buyItem("shadowfall", 793, "Energized Aura");
        bot.wait.forPickup("Energized Aura");
    }

    findAura(): void {
        if (Core.checkInventory("Unenhanced Aura")) {
            Core.farmingLogger("Unenhanced Aura");
            return;
        }

        Core.addDrop("Unenhanced Aura");
        Adv.gearStore(undefined, { enhAfter: true });
        Necro.getNecromancer(true);
        Adv.gearStore(true, { enhAfter: true });

        Core.addDrop("Unenhanced Aura");
        Core.ensureAccept(Core.checkInventory(8012) ? 4435 : 4436);
        this.findBlade();
        this.findHilt();
        this.timeLordNecro(1);
        this.cHourglass(2);
        this.scrollDarkArts(1);
        this.voidAuras(10);
        Core.ensureComplete(Core.checkInventory(8012) ? 4435 : 4436);
        bot.wait.forPickup("Unenhanced Aura");
    }

    timeLordNecro(quant: number): void {
        if (Core.checkInventory("Time Lord's Necronomicon", quant)) {
            return;
        }

        (bot.inventory.items.concat(...bot.bank.items).find((x) => x.name === "Chaorrupted Hourglass") ?? null)
            ?.quantity ?? 0;
        Core.farmingLogger("Time Lord's Necronomicon", quant);
        this.cHourglass(quant * 10);
        this.scrollDarkArts(quant);
        this.voidAuras(quant * 100);
        Core.buyItem("shadowfall", 793, "Time Lord's Necronomicon", quant);
        bot.wait.forPickup("Time Lord's Necronomicon");
    }

    findBlade(): void {
        if (Core.checkInventory("Unenhanced Doom Blade")) {
            Core.farmingLogger("Unenhanced Doom Blade");
            return;
        }

        Core.addDrop("Unenhanced Doom Blade");
        Core.ensureAccept(4433);
        this.bladeEssence(1);
        this.bariumOfDoom(1);
        this.voidAuras(10);
        Core.ensureComplete(4433);
        bot.wait.forPickup("Unenhanced Doom Blade");
    }

    findHilt(): void {
        if (Core.checkInventory("Unenhanced Hilt")) {
            Core.farmingLogger("Unenhanced Hilt");
            return;
        }

        Core.addDrop("Unenhanced Hilt", "Bone Dust");
        Core.ensureAccept(4434);
        this.cavernCelestite(800);
        Farm.battleUnderB("Undead Energy", 5000);
        this.primarchHilt(1);
        this.bonesVoidRealm(50);
        this.voidAuras(10);
        Core.ensureComplete(4434);
        bot.wait.forPickup("Unenhanced Hilt");
    }

    cHourglass(quant: number): void {
        if (Core.checkInventory("Chaorrupted Hourglass", quant)) {
            return;
        }

        Core.equipClass(ClassType.Solo);
        Core.huntMonster("mqlesson", "Dragonoid", "Dragonoid of Hours", undefined, { isTemp: false, publicRoom: true });
        Core.huntMonster("timespace", "Chaos Lord Iadoa", "Chaorrupted Hourglass", quant, {
            isTemp: false,
            publicRoom: true,
        });
        bot.wait.forPickup("Chaorrupted Hourglass");
    }

    scrollDarkArts(quant: number): void {
        if (Core.checkInventory("(Necro) Scroll of Dark Arts", quant)) {
            return;
        }

        Core.equipClass(ClassType.Solo);
        Core.huntMonster("epicvordred", "Ultra Vordred", "(Necro) Scroll of Dark Arts", quant, {
            isTemp: false,
            publicRoom: true,
        });
        bot.wait.forPickup("(Necro) Scroll of Dark Arts");
    }

    //#endregion
    //#region Crafting Materials
    bariumOfDoom(quant: number): void {
        if (Core.checkInventory("Barium of Doom", quant)) {
            return;
        }

        Core.checkInventory("Barium", quant);
        this.voidAuras(quant * 50);
        if (!Core.checkInventory("Barium")) {
            Daily.mineCrafting(["Barium"], 1);
        }
        Core.buyItem("shadowfall", 793, "Barium of Doom");
        bot.wait.forPickup("Barium of Doom");
    }

    cavernCelestite(quant: number): void {
        BLOD.soulSearching("Cavern Celestite", quant, false);
    }

    primarchHilt(quant: number): void {
        if (Core.checkInventory("Primarch's Hilt", quant)) {
            return;
        }

        Core.equipClass(ClassType.Dodge);
        Core.huntMonster("bosschallenge", "Colossal Primarch", "Primarch's Hilt", quant, {
            isTemp: false,
            publicRoom: true,
        });
        bot.wait.forPickup("Primarch's Hilt");
    }

    bladeEssence(quant: number): void {
        if (Core.checkInventory("Blade Essence", quant)) {
            return;
        }

        Core.equipClass(ClassType.Solo);
        Core.huntMonster("chaoscrypt", "Chaorrupted Armor", "Blade Essence", quant, { isTemp: false });
        bot.wait.forPickup("Blade Essence");
    }
}
