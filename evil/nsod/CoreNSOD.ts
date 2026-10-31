/*
name: null
description: null
tags: null
*/
// Port of Scripts/Evil/NSoD/CoreNSOD.cs.

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
    optionsStorage = "NecroticSwordOfDoomOptions";
    dontPreconfigure = true;

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

    getNSOD(): void {
        if (Core.checkInventory("Necrotic Sword of Doom") && Core.hasWebBadge("Necrotic Sword of Doom")) {
            return;
        }

        if (!Core.checkInventory("Necrotic Sword of Doom")) {
            if (!Core.checkInventory("Necrotic Sword's Blade")) {
                Core.logger("NSoD: Step #1/16: Barium (MineCrafting Daily)");
                this.barium();
            }

            const preFarmEnabled = configOr("PreFarm", false);

            if (
                preFarmEnabled &&
                !Core.checkInventory(
                    ["Necrotic Sword's Blade", "Necrotic Sword's Hilt", "Necrotic Sword's Aura"],
                    undefined,
                    { any: true },
                )
            ) {
                Core.logger("NSoD: PreFarm Steps:");
                this.preFarmSteps();
            } else {
                Core.logger("NSoD: PreFarm Steps skipped, continuing with the farm.");
            }

            Core.logger("NSoD: Step #10/16: NSBlade.");
            this.nsBlade();
            Core.logger("NSoD: Step #11/16: NSHilt.");
            this.nsHilt();
            Core.logger(
                "NSoD: Step #12/16: NSAura\n (To the retards; yes this requires an extra `Unenhanced Blade` & `Unenhanced Hilt`).",
            );
            this.nsAura();
            Core.logger('NSoD: Step #13/16: ULTRA Sepulchure for "Doom Heart"');
            Core.huntMonster("sepulchurebattle", "ULTRA Sepulchure", "Doom Heart", undefined, {
                isTemp: false,
                publicRoom: true,
            });
            Core.logger("NSoD: Step #14/16: Void Auras x800 to complete the merge");
            this.voidAuras(800);

            Core.logger("NSoD: Step #15/16: NSoD purchase");
            Core.buyItem("shadowfall", 793, "Necrotic Sword of Doom");
            bot.wait.forPickup("Necrotic Sword of Doom");
            Core.logger("NSoD: Step #16/16: NSoD Enhancement");
        }

        if (!Core.isCompletedBefore(7652)) {
            Core.logger("Getting the NSOD character page badge");
            Core.ensureAccept(7652);
            Core.huntMonster("graveyard", "Skeletal Warrior", "Arcane Parchment");
            Core.ensureComplete(7652);
        }

        if (!Core.checkInventory(14474) && !Core.isMember) {
            Core.logger("Congratulations on completing the longest farm in the game!!!", undefined, {
                messageBox: true,
            });
        }
    }

    getNBOD(): void {
        if (Core.checkInventory("Necrotic Blade of Doom")) {
            return;
        }

        Core.logger("NBOD: Step #1: Get NSoD");
        this.getNSOD();

        Core.logger("NBOD: Step #2: Void Auras x750");
        this.voidAuras(750);

        if (!Core.checkInventory("Void Essentia")) {
            Core.logger('NBOD: Step #3: Kill Flibbitiestgibbet for "Void Essentia"');
            Core.logger("Flibbitiestgibbet is a very tough monster, I hope you brought your army/butler/friends!");
            Core.killMonster("voidflibbi", "Enter", "Spawn", "Flibbitiestgibbet", "Void Essentia", undefined, {
                isTemp: false,
            });
        }

        Core.logger("NBOD: Step #4: Buy NBoD");
        Core.buyItem("shadowfall", 793, "Necrotic Blade of Doom");

        Core.logger("NBOD: Step #5: Reminder - Use AE's Buy-Back system to retrieve your NSoD", undefined, {
            messageBox: true,
        });
    }

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

    nsBlade(): void {
        if (Core.checkInventory("Necrotic Sword's Blade")) {
            Core.farmingLogger("Necrotic Sword's Blade");
            return;
        }

        this.energizedBlade();
        this.bariumOfDoom(1);
        this.voidAuras(200);
        Core.buyItem("shadowfall", 793, "Necrotic Sword's Blade");
        bot.wait.forPickup("Necrotic Sword's Blade");
    }

    nsHilt(): void {
        if (Core.checkInventory("Necrotic Sword's Hilt")) {
            Core.farmingLogger("Necrotic Sword's Hilt");
            return;
        }

        this.energizedHilt();
        this.bonesVoidRealm(1);
        this.voidAuras(200);
        Core.buyItem("shadowfall", 793, "Necrotic Sword's Hilt");
        bot.wait.forPickup("Necrotic Sword's Hilt");
    }

    nsAura(): void {
        if (Core.checkInventory("Necrotic Sword's Aura")) {
            Core.farmingLogger("Necrotic Sword's Aura");
            return;
        }

        Core.addDrop("Necrotic Sword's Aura");
        this.energizedAura();
        this.timeLordNecro(1);
        this.voidAuras(300);
        Core.buyItem("shadowfall", 793, "Necrotic Sword's Aura");
        bot.wait.forPickup("Necrotic Sword's Aura");
    }

    energizedBlade(): void {
        if (Core.checkInventory("Energized Blade")) {
            Core.farmingLogger("Energized Blade");
            return;
        }

        this.findBlade();
        this.bariumOfDoom(1);
        this.voidAuras(100);
        Core.buyItem("shadowfall", 793, "Energized Blade");
        bot.wait.forPickup("Energized Blade");
    }

    energizedHilt(): void {
        if (Core.checkInventory("Energized Hilt")) {
            Core.farmingLogger("Energized Hilt");
            return;
        }

        Core.addDrop("Energized Hilt");
        this.findHilt();
        this.bonesVoidRealm(1);
        this.voidAuras(100);
        Core.buyItem("shadowfall", 793, "Energized Hilt");
        bot.wait.forPickup("Energized Hilt");
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

    private barium(): void {
        Core.unbank("Barium", "Barium of Doom");
        let i = 0;

        const Blades = ["Unenhanced Doom Blade", "Energized Blade", "Necrotic Sword's Blade"];
        if (
            Core.checkInventory(["Unenhanced Aura", "Energized Aura", "Necrotic Sword's Aura"], undefined, {
                any: true,
            })
        ) {
            i++;
        }

        for (const Item of Blades) {
            if (Core.checkInventory(Item)) {
                i = i + Blades.indexOf(Item) + 1;
            }
        }

        i = i + bot.inventory.getQuantity("Barium") + bot.inventory.getQuantity("Barium of Doom");
        if (i >= 4) {
            return;
        }

        BLOD.unlockMineCrafting();
        Daily.mineCrafting(["Barium"], 4 - i);
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

    private preFarmSteps(): void {
        if (Core.checkInventory("Necrotic Sword of Doom")) {
            return;
        }

        let TotalVAs = 0;
        // Requirements will add VAs to this amount for a final calculation.

        const MergeRequirement = 800;
        // Always needed to merge NSoD

        let HiltVA = 2910;
        // 250 (200 + 50 (bone from the void realm x1)) for >> (NS)
        // + 150 (100 + 50 (bone from the void realm x1))for >> (E)
        // + 2510 (bone from the void realm x50 + 10 for quest) (UE)

        let BladeVA = 460;
        // 250 (NS) + 150 (E) + 10(quest) + 50(Barium of doom) for >> (UE)
        let AuraVA = 760 + 2500 + 60 + 10;
        // Misc quest

        Core.logger("NSoD: PreFarm Step #1/9: Hilt, Blade, and Aura VA Calculation");

        // HILT
        Core.logger("NSoD: PreFarm Step #1.1/9: NSOD Hilt VoidAura Calculation");
        if (Core.checkInventory("Unenhanced Hilt")) {
            HiltVA -= 2510;
        } else if (Core.checkInventory("Energized Hilt")) {
            HiltVA -= 2760;
        } else if (Core.checkInventory("Necrotic Sword's Hilt")) {
            HiltVA = 0;
        }

        TotalVAs += HiltVA;
        Core.logger(`Total added to count for Hilt: ${HiltVA}`);

        // AURA
        Core.logger("NSoD: PreFarm Step #1.2/9: NSOD Aura VoidAura Calculation");
        if (Core.checkInventory("Unenhanced Aura")) {
            AuraVA -= 2670 + 250 + 400;
        } else if (Core.checkInventory("Energized Aura")) {
            AuraVA -= 400;
        } else if (Core.checkInventory("Necrotic Sword's Aura")) {
            AuraVA = 0;
        }

        TotalVAs += AuraVA;
        Core.logger(`Total added to count for Aura: ${AuraVA}`);

        // BLADE
        Core.logger("NSoD: PreFarm Step #1.3/9: NSOD Blade VoidAura Calculation");
        if (Core.checkInventory("Unenhanced Blade")) {
            BladeVA -= 460;
        } else if (Core.checkInventory("Energized Blade")) {
            BladeVA -= 250;
        } else if (Core.checkInventory("Necrotic Sword's Blade")) {
            BladeVA = 0;
        }

        TotalVAs += BladeVA;
        Core.logger(`Total added to count for Blade: ${BladeVA}`);

        TotalVAs += MergeRequirement;

        Core.logger(
            `NSoD: PreFarm Step #1.4/9: Total VoidAuras to farm for Hilt, Blade, Aura, and Merge (subtracting for what is already owned): ${TotalVAs}`,
        );
        this.voidAuras(TotalVAs);

        Core.logger("NSoD: PreFarm Step #2/9: CavernCelestite (Quantity: 1600)");
        this.cavernCelestite(1600);

        Core.logger("NSoD: PreFarm Step #3/9: BattleUnderB - Bone Dust (Quantity: 5100)");
        Farm.battleUnderB("Bone Dust", 5100);

        Core.logger("NSoD: PreFarm Step #4/9: BattleUnderB - Undead Energy (Quantity: 10000)");
        Farm.battleUnderB("Undead Energy", 10000);

        Core.logger("NSoD: PreFarm Step #5/9: PrimarchHilt (Quantity: 2)");
        this.primarchHilt(2);

        Core.logger("NSoD: PreFarm Step #6/9: BladeEssence (Quantity: 2)");
        this.bladeEssence(2);

        Core.logger("NSoD: PreFarm Step #7/9: CHourglass (Quantity: 31)");
        this.cHourglass(31);

        Core.logger("NSoD: PreFarm Step #8/9: ScrollDarkArts (Quantity: 4)");
        this.scrollDarkArts(4);

        Core.logger("NSoD: PreFarm Step #9/9: ULTRA Sepulchure");
        Core.huntMonster("sepulchurebattle", "ULTRA Sepulchure", "Doom Heart", undefined, {
            isTemp: false,
            publicRoom: true,
        });
    }
}
