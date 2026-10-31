/*
name: Member Farms Kit
description: This kit contains all Member farms that you can profit off after your membership expires
tags: member, kit, expire, legend
*/
// Port of Scripts/Other/FarmJoeKits/1MemberFarmsKit.cs.

import { bot } from "turu";
import { CoreAdvanced, mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreSDKA } from "../../evil/sdka/CoreSDKA";
import { UndeadLegionMerge } from "../../legion/mergeshops/UndeadLegionMerge";
import { CoreNation } from "../../nation/CoreNation";
import { EvolvedShadowOrb } from "../../nation/evolvedorb/EvolvedShadowOrb[Mem]";
import { ArchfiendDragonEgg } from "../../nation/various/ArchfiendDragonEgg[Mem]";
import { DragonBladeofNulgath } from "../../nation/various/DragonBlade[mem]";
import { TendurrrTheAssistantQuests } from "../../nation/various/TendurrrTheAssistantQuests";
import { LegendaryElementalWarrior } from "../classes/curio-classes/LegendaryElementalWarrior[mem]";
import { ChronoAssassin } from "../classes/members-classes/ChronoAssassin[Mem]";
import { CoinCollectorSet } from "../CoinCollectorSet[Member]";
import { BonecastleTowerMerge } from "../mergeshops/BonecastleTowerMerge";
import { TachyonMerge } from "../mergeshops/TachyonMerge";
import { YulgarsDualWieldMerge } from "../mergeshops/YulgarsDualWieldMerge";
import { SpellRaiser } from "../../seasonal/friday13th/SpellRaiser[Mem]";
import { TheLostKnightAndBackupBlade } from "../../seasonal/friday13th/TheLostKnightAndBackupBlade[Mem]";
import { TrobbolierPet } from "../../seasonal/friday13th/TrobbolierPet[mem]";
import { CruxShip } from "../../story/CruxShip";
import { DragonFableOrigins } from "../../story/DragonFableOrigins";
import { CoreQOM } from "../../story/queenofmonsters/CoreQoM";

const Adv = new CoreAdvanced();
const Farm = new CoreFarms();
const Daily = new CoreDailies();
const Nation = new CoreNation();
const SDKA = new CoreSDKA();
const Trobbolier = new TrobbolierPet();
const CoinCollector = new CoinCollectorSet();
const LostKnight = new TheLostKnightAndBackupBlade();
const spellRaiser = new SpellRaiser();
const ArchfiendDragonPet = new ArchfiendDragonEgg();
const DBoN = new DragonBladeofNulgath();
const bonecastleTowerMerge = new BonecastleTowerMerge();
const legendaryElementalWarrior = new LegendaryElementalWarrior();
const chronoAssassin = new ChronoAssassin();
const Tachyon = new TachyonMerge();
const QOM = new CoreQOM();
const DFO = new DragonFableOrigins();
const Crux = new CruxShip();
const Tendurr = new TendurrrTheAssistantQuests();
const ShadowOrb = new EvolvedShadowOrb();
const ULM = new UndeadLegionMerge();
const YDWM = new YulgarsDualWieldMerge();

export class MemberFarm {
    doAll(): void {
        if (!Core.isMember) {
            Core.logger("This script is Member-Only", undefined, { messageBox: true });
            return;
        }

        //Dailies
        Daily.monthlyTreasureChestKeys();
        Daily.wheelofDoom();
        Daily.freeDailyBoost();
        Daily.beastMasterChallenge();

        //Core Farm
        SDKA.doAll();
        Core.toBank(...SDKA.sdkaItems);

        this.dragonBlade();
        Core.toBank(
            "DragonBlade of Nulgath",
            "Legion DragonBlade of Nulgath",
            "Ebony DragonBlade of Nulgath",
            "Dual DragonBlades of Nulgath",
        );

        legendaryElementalWarrior.getLEW();
        Core.toBank("Legendary Elemental Warrior");

        // Dark / Legendary Hero
        Adv.buyItem(bot.map?.name ?? "battleon", 679, "Legendary Hero", undefined, 11597);
        Adv.buyItem(bot.map?.name ?? "battleon", 679, "Dark Legendary Hero", undefined, 11668);
        Adv.rankUpClass(17178);
        // Legendary Hero
        Adv.rankUpClass(18706);
        // Dark Legendary Hero

        //Nation Item
        // TarosItems.TemptationTest();
        Core.toBank("Taro's Prismatic Manslayer", "Taro's Dual Prismatic Manslayers", "Taro's BattleBlade");

        ArchfiendDragonPet.getAFDE();
        Core.toBank("ArchFiend Baby Dragon Pet");

        ShadowOrb.getEvolvedShadowOrb();
        Core.toBank("Evolved Shadow Orb");

        Tendurr.tendurrItems();
        Core.toBank(...Tendurr.rewards);

        Core.toBank(...Nation.bagDrops);

        //Free AC Items on Member quest/shop
        CoinCollector.getItems();
        this.babyDragonOfAwe();
        this.fireWar();
        this.cruxVIPWeapon();
        this.deepForestItems();
        this.dualWield();

        //Free AC Items on Member Area
        this.huntingMonster();
        spellRaiser.getAll();
        LostKnight.getAll();
        Trobbolier.getAll();

        //MergeShops - not working until find efficient method
        this.tachyonMerge();
        this.boneTowerMerge();

        //Class
        chronoAssassin.getChronoAss();
        Core.toBank("Chrono Assassin");
        bonecastleTowerMerge.buyAllMerge("DeathKnight Lord");
        Core.toBank("DeathKnight Lord");

        //Reputations
        Farm.beastMasterREP();
        Core.logger('only able to buy the class if portal owned or seasonal map "northpointe" is available');
        if (Core.isSeasonalMapActive("northpointe")) {
            // Beast Master
            Adv.buyItem("northpointe", 976, "BeastMaster", undefined, 16031);
            Adv.rankUpClass("BeastMaster");

            // SkyGuard Grenadier
            Farm.skyguardREP();
            Adv.buyItem("skyguard", 259, "SkyGuard Grenadier", undefined, 7517);
            Adv.rankUpClass("SkyGuard Grenadier");
        }

        //Deadfly.BuyAllMerge();
        //GonnaGetcha.BuyAllMerge();
        //Oddities.BuyAllMerge();
    }

    dragonBlade(): void {
        if (
            !Core.checkInventory("DragonBlade of Nulgath", undefined, { toInv: false }) &&
            Core.checkInventory(
                ["Ebony DragonBlade of Nulgath", "Legion DragonBlade of Nulgath", "Dual DragonBlades of Nulgath"],
                1,
                { any: true, toInv: false },
            )
        ) {
            Core.logger("You already have DBoN but it's not in your inventory/bank, please check your buyback menu");
            return;
        }

        DBoN.getDragonBlade();
    }

    cruxVIPWeapon(): void {
        if (Core.checkInventory("Darkwave Khopesh", undefined, { toInv: false })) {
            Core.toBank("Darkwave Khopesh");
            return;
        }

        Crux.storyLine();

        Core.addDrop("Darkwave Khopesh");
        Core.equipClass(ClassType.Solo);
        Core.farmingLogger("Darkwave Khopesh");

        Core.registerQuests(4618);
        Core.killMonster("cruxship", "r13", "Bottom", "Apephryx", "Khopesh Shard", undefined, { isTemp: false });
        bot.wait.forPickup("Khopesh Shard");
        Core.cancelRegisteredQuests();

        Core.toBank("Darkwave Khopesh");
    }

    fireWar(): void {
        if (Core.checkInventory("Ignited Guardian's Accoutrements", undefined, { toInv: false })) {
            Core.toBank("Ignited Guardian's Accoutrements");
            return;
        }

        DFO.greatFireWar();
        Core.buyItem("firewar", 1586, "Flame Guardian's Accoutrements");

        Core.equipClass(ClassType.Solo);
        Core.huntMonster("firewar", "Uriax", "Dragon Eye", 2, { isTemp: false });

        Core.addDrop("Dragon Flame");
        Core.farmingLogger("Dragon Flame", 1);
        Core.equipClass(ClassType.Farm);
        Core.registerQuests(6300);

        while (!bot.shouldExit && !Core.checkInventory("Dragon Flame", 25)) {
            Core.huntMonster("firewar", "Fire Dragon", "Fire Dragon Slain", 3);
            Core.killMonster("firewar", "r8", "Left", "Inferno Dragon", "Inferno Dragon Slain", 2);
            bot.wait.forPickup("Dragon Flame");
        }
        Core.buyItem("firewar", 1587, "Ignited Guardian's Accoutrements");
        Core.toBank("Ignited Guardian's Accoutrements");
    }

    deepForestItems(): void {
        QOM.theBook();

        if (!Core.checkInventory("Polished Necrotic Blade of Chaos", undefined, { toInv: false })) {
            Core.buyItem("castleundead", 45, "Necrotic Blade of Chaos");
            Adv.buyItem("deepforest", 1999, "Gold Voucher 500k", 4);
            Core.buyItem("deepforest", 1999, "Polished Necrotic Blade of Chaos");
        }
        Core.toBank("Polished Necrotic Blade of Chaos");

        if (!Core.checkInventory("Polished Dragon Sword of Chaos", undefined, { toInv: false })) {
            Core.buyItem("castleundead", 45, "Dragon Sword of Chaos");
            Adv.buyItem("deepforest", 1999, "Gold Voucher 500k", 4);
            Core.buyItem("deepforest", 1999, "Polished Dragon Sword of Chaos");
        }
        Core.toBank("Polished Dragon Sword of Chaos");
    }

    dualWield(): void {
        if (!Core.checkInventory("Golden 8th Birthday Candle")) {
            Core.buyItem(bot.map.name, 1317, "Golden 8th Birthday Candle");
        }
        Core.sleep(1500);
        if (!Core.checkInventory("Golden 8th Birthday Candle")) {
            Core.logger("Golden Candle not found - skip dual wield script.");
            return;
        }

        Core.addDrop("Weapon Reflection");
        while (!bot.shouldExit && !Core.checkInventory("Weapon Reflection", 12)) {
            Core.ensureAccept(5518);
            Core.huntMonster("nostalgiaquest", "Skeletal Viking", "Reflected Glory", 5);
            Core.huntMonster("nostalgiaquest", "Skeletal Warrior", "Divided Light", 5);
            Core.ensureComplete(5518);
            bot.wait.forPickup("Weapon Reflection");
        }

        //Boom Went The Dynamite
        if (!Core.checkInventory("Dual Boom Went The Dynamite", undefined, { toInv: false })) {
            if (!Core.checkInventory("Boom Went The Dynamite")) {
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("banished", "Desterrat Moya", "Boom Went The Dynamite", undefined, { isTemp: false });
            }
            Adv.buyItem("nostalgiaquest", 1311, "Dual Boom Went The Dynamite");
        }
        Core.toBank("Dual Boom Went The Dynamite");

        //Unarmed
        if (!Core.checkInventory("Dual Unarmed", undefined, { toInv: false })) {
            if (!Core.checkInventory("Unarmed")) {
                Adv.buyItem(bot.map.name, 1536, "Unarmed");
            }
            Adv.buyItem("nostalgiaquest", 1311, "Dual Unarmed");
        }
        Core.toBank("Dual Unarmed");

        //Leviasea Sword
        if (!Core.checkInventory("Dual Leviasea Sword", undefined, { toInv: false })) {
            if (!Core.checkInventory("Leviasea Sword")) {
                Adv.buyItem("yulgar", 69, "Leviasea Sword");
            }
            Adv.buyItem("nostalgiaquest", 1311, "Dual Leviasea Sword");
        }
        Core.toBank("Dual Leviasea Sword");

        //Ddog Sea Serpent Sword
        if (!Core.checkInventory("Dual Ddog Sea Serpent Sword", undefined, { toInv: false })) {
            if (!Core.checkInventory("Ddog Sea Serpent Sword")) {
                Core.ensureAccept(554);
                Nation.farmUni13(1);
                Core.huntMonster("underworld", "Undead Legend", "Undead Legend Rune", undefined, { log: false });
                Core.ensureCompleteChoose(554, ["Ddog Sea Serpent Sword"]);
            }
            Adv.buyItem("nostalgiaquest", 1311, "Dual Leviasea Sword");
        }
        Core.toBank("Dual Ddog Sea Serpent Sword");

        //Soulreaper of Nulgath
        if (!Core.checkInventory("Dual Soulreaper of Nulgath", undefined, { toInv: false })) {
            if (!Core.checkInventory("Soulreaper of Nulgath")) {
                Core.addDrop("Soulreaper of Nulgath");
                Core.ensureAccept(571);
                if (!Core.checkInventory("Godly Golden Dragon Axe")) {
                    Core.ensureAccept(554);
                    Nation.farmUni13(1);
                    Core.huntMonster("underworld", "Undead Legend", "Undead Legend Rune", undefined, { log: false });
                    Core.ensureCompleteChoose(554, ["Godly Golden Dragon Axe"]);
                }
                Nation.farmDiamondofNulgath(10);
                Nation.farmDarkCrystalShard(5);
                Nation.farmTaintedGem(5);
                Nation.farmUni13(1);
                Core.equipClass(ClassType.Solo);
                if (!Core.checkInventory("Abaddon's Terror")) {
                    Core.huntMonster("twilight", "Abaddon", "Abaddon's Terror", undefined, { isTemp: false });
                }
                Core.ensureComplete(571);
                bot.wait.forPickup("Soulreaper of Nulgath");
            }
            Adv.buyItem("nostalgiaquest", 1311, "Dual Soulreaper of Nulgath");
        }
        Core.toBank("Dual Soulreaper of Nulgath");

        //Godly Mace of the Ancients
        if (!Core.checkInventory("Dual Godly Mace of the Ancients", undefined, { toInv: false })) {
            if (!Core.checkInventory("Godly Mace of the Ancients")) {
                Adv.buyItem("citadel", 44, "Godly Mace of the Ancients");
            }
            Adv.buyItem("nostalgiaquest", 1311, "Dual Godly Mace of the Ancients");
        }
        Core.toBank("Dual Godly Mace of the Ancients");

        //Balor's Cruelty
        if (!Core.checkInventory("Dual Balor's Cruelty", undefined, { toInv: false })) {
            if (!Core.checkInventory("Balor's Cruelty")) {
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("twilight", "Abaddon", "Balor's Cruelty", undefined, { isTemp: false });
            }
            Adv.buyItem("nostalgiaquest", 1311, "Dual Balor's Cruelty");
        }
        Core.toBank("Dual Balor's Cruelty");

        //Abaddon's Terror
        if (!Core.checkInventory("Dual Abaddon's Terrors", undefined, { toInv: false })) {
            if (!Core.checkInventory("Abaddon's Terror")) {
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("twilight", "Abaddon", "Abaddon's Terror", undefined, { isTemp: false });
            }
            Adv.buyItem("nostalgiaquest", 1311, "Dual Abaddon's Terrors");
        }
        Core.toBank("Dual Abaddon's Terrors");

        //Mighty Sword Of The Dragons
        if (!Core.checkInventory("Dual Mighty Sword Of The Dragons", undefined, { toInv: false })) {
            if (!Core.checkInventory("Mighty Sword Of The Dragons")) {
                Core.equipClass(ClassType.Solo);
                Core.addDrop(
                    "Zellare's Death Scale",
                    "Moganth's Death Scale",
                    "Udaroth's Death Scale",
                    "Cellot's Death Scale",
                    "Mighty Sword Of The Dragons",
                );
                Core.registerQuests(3343);
                bot.quests.updateQuest(1416);
                while (!bot.shouldExit && !Core.checkInventory("Mighty Sword Of The Dragons")) {
                    Core.huntMonster("wind", "Cellot", "Cellot's Death Scale", undefined, { isTemp: false });
                    Core.huntMonster("fire", "Zellare", "Zellare's Death Scale", undefined, { isTemp: false });
                    Core.huntMonster("water", "Udaroth", "Udaroth's Death Scale", undefined, { isTemp: false });
                    Core.huntMonster("dragonplane", "Moganth", "Moganth's Death Scale", undefined, { isTemp: false });
                }
            }
            Adv.buyItem("nostalgiaquest", 1311, "Dual Mighty Sword Of The Dragons");
        }
        Core.toBank("Dual Mighty Sword Of The Dragons");

        //Frostbite & Dual variant
        ULM.buyAllMerge("Frostbite");
        YDWM.buyAllMerge("Dual Frostbite");
        Core.toBank("Frostbite", "Dual Frostbite");

        //DragonBlade of Nulgath
        if (!Core.checkInventory("Dual DragonBlades of Nulgath", undefined, { toInv: false })) {
            if (!Core.checkInventory("DragonBlade of Nulgath")) {
                Core.logger("You don't have DBoN on your inventory/bank, please check your buyback menu");
                return;
            }
            Adv.buyItem("nostalgiaquest", 1311, "Dual DragonBlades of Nulgath");
        }
        Core.toBank("Dual DragonBlades of Nulgath");

        //Phoenix Blade of Nulgath (Pseudo-Rare Item)
    }

    babyDragonOfAwe(): void {
        if (Core.checkInventory("Baby Dragon of Awe", undefined, { toInv: false })) {
            Core.toBank("Baby Dragon of Awe");
            return;
        }

        if (!Core.checkInventory("Guardian Patent")) {
            if (bot.flash.get<number>("world.myAvatar.objData.intAQ") > 0) {
                Adv.buyItem("museum", 53, "Guardian Patent");
            } else {
                Core.logger("Active Aq Guardian Acc Required for this Item.");
            }
        }
        Core.sleep(1500);
        if (!Core.checkInventory("Guardian Patent")) {
            Core.logger("Guardian Patent not found - skip Baby Dragon of Awe script");
            return;
        }

        Core.buyItem("battleon", 10, "Baby Red Dragon");
        Core.buyItem("museum", 632, "Baby Dragon of Awe");
    }

    huntingMonster(): void {
        this.getItems(
            "rotfinger",
            "rotfinger",
            "Horned Meat Horror Helm",
            "Macabre Horror Hammer",
            "Macabre Meat Horror",
            "Macabre Meat Ripper",
            "Macabre Meat Slicer",
            "Rotfinger's ArmBlades",
            "Rotfinger's Bow",
            "Rotfinger's Scythe",
            "Rotfinger's Staff",
            "Scream of Agony",
        );
        this.getItems(
            "bonebreak",
            "Killek BoneBreaker",
            "Axe of Boneshearing",
            "Dark BonePiercer Spikes",
            "Killek BoneBreaker",
        );
        this.getItems("bonebreak", "Unbroken Minion", "Berserker Minion Mace");
        this.getItems("bonebreak", "Undead Berserker", "Berserker Minion Skull Mace");
        this.getItems("bonebreak", "Bonebreaker", "Undead Berserker Guard", "Undead Berserker Guard Helm");
        this.getItems(
            "deadfly",
            "Deadfly",
            "BlackSkulls Knuckle",
            "Deadfly Morph",
            "Deadfly's Armor",
            "Dual BlackSkulls Knuckles",
        );
        this.getItems(
            "oddities",
            "Cursed Spirit",
            "Cursed Spirit Hunter",
            "Reaver of Wrath",
            "Scary Machete",
            "Scary Machetes",
            "Spirit Scythe of Wrath",
            "Spooky Spirit Hunter",
            "Spooky Spirit Hunter Hat",
            "Spooky Spirit Hunter Hat + Locks",
            "Spooky Spirit Hunter Hood",
            "Unlucky Farmer",
            "Unlucky Farmer's Hood",
            "Unlucky Portal Cape",
        );
        this.getItems(
            "wormhole",
            "Trobbolegion",
            "Blue Trobbolier Morph",
            "Gold Trobbolier Morph",
            "Mutated Pink Trobbolier Morph",
            "Silver Trobbolier Morph",
        );
        this.getItems("gonnagetcha", "Shrade Cultist", "Cultist Knife", "Dual Cultist Knife", "Missing Keys Plaque");
        this.getItems("gonnagetcha", "Murkonian", "GonnaGetcha Trident");
        this.getItems(
            "gonnagetcha",
            "Shrade",
            "DeathHunter Hair",
            "DeathHunter Hood",
            "DeathHunter Locks",
            "Fanged Cultist Mask",
            "Feral Cultist Mask",
            "Malevolent Cultist Mask",
            "Shadow Cultist Armor",
        );
        this.getItems(
            "splatterwardage",
            "Shrade",
            "Celtic Hunter Blade",
            "Underworld Shrade",
            "Underworld Shrade Axe",
            "Underworld Shrade Helm",
            "Underworld Shrade Minion",
            "Well-wet Hair",
        );
        this.getItems(
            "greymoor",
            "Shrade",
            "Necrotic Caster",
            "Necrotic Caster Cross Back",
            "Necrotic Caster Grave Spade",
            "Necrotic Caster Hair",
            "Necrotic Caster Locks",
            "Necrotic Caster Locks Morph",
            "Necrotic Caster Mask",
            "Necrotic Caster Mask Morph",
            "Necrotic Caster Masked Locks",
            "Necrotic Caster Scroll",
        );
        // Non Soloable appearntly (33k hits)vv
        // GetItems("greymoor", "Ultra Shrade", "Shrade Armor", "Shrade Helm");
        this.getItems(
            "battledoom",
            "13th Doom Lord",
            "Doom Lord Vaal and Vayle",
            "Dual Skull Half-Axes",
            "Skulled Half-Axe",
            "SkullBorne Dagger",
            "Vaal's Doom Visage",
            "Vayle's Doom Hood",
            "Weeping Axe of DOOM",
        );
        this.getItems("crownsreachfxiii", "Shub-Hathrys", "Tentacled Tophat and Beard", "Tentacled Tophat and Locks");
    }

    private getItems(map: string, monster: string, ...items: string[]): void {
        if (Core.checkInventory(items, undefined, { toInv: false })) {
            return;
        }

        Core.addDrop(...items);
        for (const item of items) {
            Core.huntMonster(map, monster, item, 1, { isTemp: false, log: false });
            Core.toBank(item);
        }
    }

    tachyonMerge(): void {
        if (Core.checkInventory(this.tachyonShop, undefined, { toInv: false })) {
            return;
        }

        Core.addDrop(...this.tachyonShop);
        Tachyon.buyAllMerge(undefined, mergeOptionsEnum.acOnly);
        Core.toBank(...this.tachyonShop);
    }

    boneTowerMerge(): void {
        if (Core.checkInventory(this.boneTowerShop, undefined, { toInv: false })) {
            return;
        }

        // Required for quest:
        bonecastleTowerMerge.buyAllMerge("Silver DeathKnight Lord");
        bonecastleTowerMerge.buyAllMerge("Golden DeathKnight Lord");

        Core.addDrop(...this.boneTowerShop);
        for (const BoneTowerItem of this.boneTowerShop) {
            bonecastleTowerMerge.buyAllMerge(BoneTowerItem);
            Core.toBank(BoneTowerItem);
        }
    }

    private tachyonShop: string[] = [
        "Orange Tachyon Blade",
        "Blue Tachyon Blade",
        "Chrono Assassin Armor",
        "Dual Tachyon Blades",
    ];

    private boneTowerShop: string[] = [
        "DeathKnight Lord",
        "DeathKnight's Blade",
        "DeathKnight Helm",
        "Silver DeathKnight Lord",
        "Silver DeathKnight's Blade",
        "Silver DeathKnight Helm",
        "Golden DeathKnight Lord",
        "Golden DeathKnight's Blade",
        "Golden DeathKnight Helm",
        "DeathKnight Lord Cape",
    ];
}

export default function main(): void {
    const script = new MemberFarm();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
