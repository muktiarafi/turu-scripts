/*
name: Yulgar's Dual Wield Merge
description: This bot will farm the items belonging to the selected mode for the Yulgar’s Dual Wield Merge [1311] in /nostalgiaquest
tags: yulgar, dual, wield, merge, nostalgiaquest, boom, went, dynamite, thewicked, oblivion, nulgath, maces, overlords, doomblade, blessed, coffee, cup, party, slasher, birthday, rapier, skulls, unarmed, frostbite, rocks, phoenix, shadow, spear, guardian, virtue, leviasea, iron, dreadsaw, blood, destruction, painsaw, eidolon, hanzamune, dragon, koi, ugly, stick, balrog, legendary, magma, saw, overfiend, bone, honor, guards, ceremonial, legion, alteons, pride, ddog, sea, serpent, eternity, blinding, light, destiny, crystal, claymore, dark, soulreaper, grumpy, warhammer, maximillians, whip, pencil, endless, scribbles, warpforce, war, shovel, k, godly, mace, ancients, grand, inquisitor, kneecappers, morning, stars, black, knight, cruel, midnight, platinum, star, big, blisters, chainsaw, , golden, hydra, crusader, bloodrivers, breaker, reignbringers, balors, cruelty, default, spears, undead, plague, mighty, dragons, necrotic, doom, burning, abezeth, awe, abaddons, terrors, kroms, brutalities, burn, it, down, terror, dragonblades, shadowreapers, cyseros, potatoes, kuros, wrath, lilith, katana, mammoth, crusher, prismatic, corpse, maker, excavated, glaive, fate, affliction, hex, shadowworn, bane, hollowborn, loyalty, nation, revontheus, risoluto, soul, fiendish, spirithunter, katanas
*/
// Port of Scripts/Other/MergeShops/YulgarsDualWieldMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { CoreFarms } from "../../core/CoreFarms";
import { HollowbornOblivionBlade } from "../../hollowborn/HollowbornOblivionBlade";
import { CoreLegion } from "../../legion/CoreLegion";
import { CoreNation } from "../../nation/CoreNation";
import { NulgathDiamondMerge } from "../../nation/mergeshops/NulgathDiamondMerge";
import { DragonBladeofNulgath } from "../../nation/various/DragonBlade[mem]";
import { JuggernautItemsofNulgath, RewardsSelection } from "../../nation/various/JuggernautItems";
import {
    RewardsSelection as TheLeeryContractMemberRewardsSelection,
    TheLeeryContract,
} from "../../nation/various/TheLeeryContract[Member]";
import { SpiritHunterMerge } from "./SpiritHunterMerge[Mem]";
import { GoldenBladeOfFate } from "../weapons/GoldenBladeOfFate";
import { SRoD } from "../weapons/ShadowReaperOfDoom";

const Farm = new CoreFarms();
const Daily = new CoreDailies();
const Adv = new CoreAdvanced();
const Nation = new CoreNation();
const DBoN = new DragonBladeofNulgath();
const sRoD = new SRoD();
const juggernaut = new JuggernautItemsofNulgath();
const Legion = new CoreLegion();
const TLC = new TheLeeryContract();
const GBOF = new GoldenBladeOfFate();
const HOB = new HollowbornOblivionBlade();
const NDM = new NulgathDiamondMerge();
const SHM = new SpiritHunterMerge();

export class YulgarsDualWieldMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                Core.logger("req is NULL");
                return;
            }

            switch (req.name) {
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(
                        `The bot hasn't been taught how to get ${req.name}.` +
                            (shouldStop ? " Please report the issue." : " Skipping"),
                        undefined,
                        { messageBox: shouldStop, stopBot: shouldStop },
                    );
                    break;
                }
                //#endregion
                case "Weapon Reflection":
                    Core.addDrop(req.name);
                    if (!Core.checkInventory(req.name)) {
                        Core.ensureAccept(5518);
                        Core.huntMonster("nostalgiaquest", "Skeletal Viking", "Reflected Glory", 5);
                        Core.huntMonster("nostalgiaquest", "Skeletal Warrior", "Divided Light", 5);
                        Core.ensureComplete(5518);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Boom Went The Dynamite":
                    if (!Core.isMember) {
                        return;
                    }
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("banished", "Desterrat Moya", req.name, quant, { isTemp: false });
                    break;
                case "TheWicked":
                    Core.logger(`You don't own ${req.name} (Rare)`);
                    break;
                case "Oblivion of Nulgath":
                    juggernaut.juggItems(RewardsSelection.Oblivion_of_Nulgath);
                    break;
                case "Overlord's DoomBlade":
                    if (Core.hasAchievement(27, "ip0")) {
                        Core.buyItem(bot.map.name, 340, req.name);
                    } else {
                        Core.logger(`You don't have access to this shop for ${req.name}`);
                    }
                    break;
                case "Blessed Coffee Cup":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5405);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("sandsea", "Oasis Monkey", "Pally Luwak Beans", undefined, { log: false });
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Party Slasher Birthday Sword":

                case "Rapier of Skulls":
                    Core.logger(`You don't own ${req.name} (Rare)`);
                    break;
                case "Unarmed":
                    if (!Core.isMember) {
                        Core.logger(`${req.name} requires Membership to Obtain`);
                        return;
                    }
                    Adv.buyItem(bot.map.name, 1536, req.name);
                    break;
                case "Frostbite":
                    if (!Core.isMember || !Core.isCompletedBefore(793)) {
                        Core.logger(`You require Membership for ${req.name}, or you're not part of the Legion`);
                        return;
                    }
                    if (!Core.checkInventory("Frosted Falchion")) {
                        Adv.buyItem("blindingsnow", 236, "Frosted Falchion");
                    }
                    Legion.farmLegionToken(70);
                    Adv.buyItem("underworld", 238, req.name);
                    break;
                case "A Rock":
                    if (!bot.inventory.contains(req.name)) {
                        Core.logger(`You don't own ${req.name} (Rare)`);
                        return;
                    }
                    break;
                case "Phoenix Blade of Nulgath":
                    //  5373 = Oblivion Blade of Nulgath (Pet) ---- 4809 = Oblivion Blade of Nulgath Pet (Rare)
                    if (!Core.isMember || (!Core.checkInventory(5373) && !Core.checkInventory(4809))) {
                        Core.logger(`You don't own any of the pets/Membership to get ${req.name}`);
                        return;
                    }
                    if (Core.checkInventory(5373)) {
                        Core.ensureAccept(2558);
                    } else if (Core.checkInventory(4809)) {
                        Core.ensureAccept(558);
                    }
                    Core.addDrop(...Nation.bagDrops);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("lair", "Red Dragon", "Phoenix Blade", undefined, { isTemp: false });
                    Nation.farmDarkCrystalShard(5);
                    Nation.farmDiamondofNulgath(10);
                    Nation.farmTaintedGem(5);
                    Nation.farmUni13(1);
                    Core.huntMonster("underworld", "Undead Bruiser", "Undead Bruiser Sigil");
                    Core.addDrop(req.name);
                    if (Core.checkInventory(5373)) {
                        Core.ensureComplete(2558);
                    } else if (Core.checkInventory(4809)) {
                        Core.ensureComplete(558);
                    }
                    Core.removeDrop(...Nation.bagDrops);
                    Core.toBank(...Nation.bagDrops);
                    break;
                case "Shadow Spear of Nulgath":

                case "Guardian of Virtue":
                    if (!Core.checkInventory(req.name)) {
                        Core.logger(`You don't own ${req.name} (Rare)`);
                        return;
                    }
                    break;
                case "Leviasea Sword":
                    if (!Core.checkInventory(req.name) && !Core.isMember) {
                        Core.logger(`You require Membership for ${req.name}`);
                        return;
                    }
                    if (!Core.checkInventory(req.name) && Core.isMember) {
                        Adv.buyItem("yulgar", 69, req.name);
                    }
                    break;
                case "Iron Dreadsaw":
                    if (!Core.checkInventory(req.name)) {
                        if (!Core.checkInventory("Raw Dreadsaw")) {
                            Core.logger(`You dont own Raw Dreadsaw, getting it first`);
                            Nation.approvalAndFavor(10, 0);
                            Nation.farmDiamondofNulgath(5);
                            Nation.farmTaintedGem(10);
                            Adv.buyItem("archportal", 1211, "Raw Dreadsaw");
                        }
                        Nation.approvalAndFavor(40, 20);
                        Nation.farmGemofNulgath(10);
                        Adv.buyItem("archportal", 1211, req.name);
                    }
                    break;
                case "Blood Axe Of Destruction":
                    Core.equipClass(ClassType.Farm);
                    if (!Core.checkInventory(req.name)) {
                        Core.killMonster("infernalspire", "r2", "Left", "*", req.name, undefined, { isTemp: false });
                    }
                    break;
                case "PainSaw of Eidolon":
                    if (!Core.checkInventory("Undead Champion")) {
                        Core.logger(
                            `You don't own Undead Champion - go and complete the Legion intro (requires 1200 AC)`,
                        );
                        return;
                    }
                    Core.addDrop("PainSaw of Eidolon", "Judgement Scythe", "Soul Eater Advanced", "Legion Token");
                    Core.registerQuests(824);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name)) {
                        Core.killMonster("marsh2", "End", "Left", 72, "Soul Scythe", 1, { isTemp: false });
                        Core.killMonster("marsh2", "End", "Left", "Lesser Shadow Serpent", "Potent Viper's Blood");
                        Core.huntMonster("battleundera", "Skeletal Ice Mage", "Frostbit Skull", 15);
                    }
                    if (Core.checkInventory("Judgement Scythe")) {
                        Core.toBank("Judgement Scythe");
                    }
                    if (Core.checkInventory("Soul Eater Advanced")) {
                        Core.toBank("Soul Eater Advanced");
                    }
                    Core.toBank("Legion Token");
                    break;
                case "Hanzamune Dragon Koi Blade":
                    Core.equipClass(ClassType.Solo);
                    Core.killKitsune(req.name, quant, { isTemp: req.temp });
                    break;
                case "Ugly Stick":
                    if (!Core.checkInventory(req.name)) {
                        Adv.buyItem("newbie", 39, req.name);
                    }
                    break;
                case "Balrog Blade":
                    if (Core.hasAchievement(5)) {
                        Adv.buyItem(bot.map.name, 5, req.name);
                    } else {
                        Core.logger(`You don't have access to this shop for ${req.name}`);
                    }
                    break;
                case "Legendary Magma Sword":
                    if (!Core.checkInventory(req.name)) {
                        Core.logger(`You don't own ${req.name} (Rare)`);
                        return;
                    }
                    break;
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
                case "Dragon Saw":
                    if (!Core.checkInventory(req.name)) {
                        Adv.buyItem("yulgar", 16, req.name);
                    }
                    break;
                case "Overfiend Blade of Nulgath":
                    if (!Core.checkInventory(req.name)) {
                        juggernaut.juggItems(RewardsSelection.Overfiend_Blade_of_Nulgath);
                    }
                    break;
                case "Bone Sword":
                    if (!Core.checkInventory(req.name)) {
                        Core.ensureAccept(7);
                        Core.registerQuests(5);
                        Core.addDrop(req.name);
                        while (!bot.shouldExit && !bot.tempInv.contains("Small Skull", 8)) {
                            Core.huntMonster("graveyard", "Big Jack Sprat");
                        }
                        Core.ensureComplete(7);
                    }
                    break;
                case "Honor Guard's Blade":

                case "Ceremonial Legion Blade":
                    if (!Core.checkInventory(req.name)) {
                        Core.logger(`You don't own ${req.name} (Rare)`);
                        return;
                    }
                    break;
                case "Alteon's Pride":
                    if (!Core.checkInventory(req.name)) {
                        if (Farm.factionRank("Good") < 7) {
                            Farm.goodREP(7);
                        }
                        Adv.buyItem("castle", 88, req.name);
                    }
                    break;
                case "Ddog Sea Serpent Sword":
                    if (!Core.isMember) {
                        Core.logger(`${req.name} requires Membership to obtain`);
                        return;
                    }
                    Core.ensureAccept(554);
                    Nation.farmUni13(1);
                    Core.huntMonster("underworld", "Undead Legend", "Undead Legend Rune", undefined, { log: false });
                    Core.ensureCompleteChoose(554, ["Ddog Sea Serpent Sword"]);
                    break;
                case "Eternity Blade":
                    Core.equipClass(ClassType.Solo);
                    Core.ensureAccept(3485);
                    Core.huntMonster("towerofdoom10", "Slugbutter", "Eternity Blade");
                    Core.ensureComplete(3485);
                    break;
                case "Blinding Light of Destiny":
                    if (!Core.checkInventory(req.name)) {
                        Core.logger(`Go and get ${req.name} yourself.`);
                        return;
                    }
                    break;
                case "Crystal Claymore":
                    Adv.buyItem("castle", 48, req.name);
                    break;
                case "Dark Crystal Claymore":
                    Adv.buyItem("shadowfall", 47, req.name);
                    break;
                case "Soulreaper of Nulgath":
                    if (!Core.isMember) {
                        Core.logger(`${req.name} requires Membership to obtain`);
                        return;
                    }
                    Core.addDrop(req.name);
                    Core.ensureAccept(571);
                    if (!Core.checkInventory("Godly Golden Dragon Axe")) {
                        Core.ensureAccept(554);
                        Nation.farmUni13(1);
                        Core.huntMonster("underworld", "Undead Legend", "Undead Legend Rune", undefined, {
                            log: false,
                        });
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
                    bot.wait.forPickup(req.name);
                    break;
                case "Grumpy Warhammer":
                    Core.equipClass(ClassType.Solo);
                    if (!Core.checkInventory(req.name)) {
                        Core.huntMonster("boxes", "Sneeviltron", req.name, undefined, { isTemp: false });
                    }
                    break;
                case "Crystal Phoenix Blade of Nulgath":
                    if (!Core.checkInventory(req.name)) {
                        juggernaut.juggItems(RewardsSelection.Crystal_Phoenix_Blade_of_Nulgath);
                    }
                    break;
                case "Maximillian's Whip":

                case "Mystic Pencil of Endless Scribbles":

                case "WarpForce War Shovel 20K":
                    if (!Core.checkInventory(req.name)) {
                        Core.logger(`You don't own ${req.name} (Rare)`);
                        return;
                    }
                    break;
                case "Godly Mace of the Ancients":
                    if (!Core.isMember) {
                        Core.logger(`${req.name} requires Membership to obtain`);
                        return;
                    }
                    if (!Core.checkInventory(req.name)) {
                        Adv.buyItem("citadel", 44, req.name);
                    }
                    break;
                case "Mace of the Grand Inquisitor":
                    Core.equipClass(ClassType.Solo);
                    if (!Core.checkInventory(req.name)) {
                        Core.huntMonster("citadel", "Grand Inquisitor", req.name, undefined, { isTemp: false });
                    }
                    break;
                case "KneeCapper":
                    if (!Core.checkInventory(req.name)) {
                        Core.logger(`You don't own ${req.name} (Rare)`);
                        return;
                    }
                    break;
                case "Morning Star":
                    Core.equipClass(ClassType.Solo);
                    if (!Core.checkInventory(req.name)) {
                        Core.huntMonster("forest", "Boss Zardman", req.name, undefined, { isTemp: false });
                    }
                    break;
                case "Axe of the Black Knight":

                case "Cruel Axe of Midnight":
                    Core.equipClass(ClassType.Solo);
                    if (!Core.checkInventory(req.name)) {
                        Core.killMonster("greenguardwest", "BKWest15", "Down", "Black Knight", req.name, undefined, {
                            isTemp: false,
                        });
                    }
                    break;
                case "Platinum Axe of Destiny":

                case "Star Sword":
                    if (!Core.checkInventory(req.name)) {
                        Core.logger(`You don't own ${req.name} (Rare)`);
                        return;
                    }
                    break;
                case "Big 100K":
                    if (!Core.checkInventory(req.name)) {
                        Adv.buyItem("swordhaven", 3, req.name);
                    }
                    break;
                case "Blister's Chainsaw 08":

                case "Golden Phoenix Sword":
                    if (!Core.checkInventory(req.name)) {
                        Core.logger(`You don't own ${req.name} (Rare)`);
                        return;
                    }
                    break;
                case "Hydra Blade":
                    if (!Core.checkInventory(req.name)) {
                        Adv.buyItem("swordhaven", 4, req.name);
                    }
                    break;
                case "Crusader Sword":
                    Core.equipClass(ClassType.Solo);
                    if (!Core.checkInventory(req.name)) {
                        Core.huntMonster("citadel", "Crusader", req.name, undefined, { isTemp: false });
                    }
                    break;
                case "Bloodriver":

                case "Star Sword Breaker":
                    if (!Core.checkInventory(req.name)) {
                        Core.logger(`You don't own ${req.name} (Rare)`);
                        return;
                    }
                    break;
                case "ReignBringer":
                    if (!Core.checkInventory(req.name)) {
                        Adv.buyItem("swordhaven", 4, req.name);
                    }
                    break;
                case "Balor's Cruelty":
                    if (!Core.isMember) {
                        Core.logger(`${req.name} requires Membership to obtain`);
                        return;
                    }
                    Core.equipClass(ClassType.Solo);
                    if (!Core.checkInventory(req.name)) {
                        Core.huntMonster("twilight", "Abaddon", req.name, undefined, { isTemp: false });
                    }
                    break;
                case "Default Sword":

                case "Iron Spear":
                    Adv.buyItem("yulgar", 16, req.name);
                    break;
                case "Undead Plague Spear":
                    if (Core.hasAchievement(5)) {
                        Adv.buyItem(bot.map.name, 5, req.name);
                    } else {
                        Core.huntMonster("graveyard", "Big Jack Sprat", req.name, undefined, { isTemp: false });
                    }
                    break;
                case "Mighty Sword Of The Dragons":
                    if (!Core.isMember) {
                        Core.logger(`${req.name} requires Membership to obtain`);
                        return;
                    }
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
                    while (!bot.shouldExit && !Core.checkInventory(req.name)) {
                        Core.huntMonster("wind", "Cellot", "Cellot's Death Scale", undefined, { isTemp: false });
                        Core.huntMonster("fire", "Zellare", "Zellare's Death Scale", undefined, { isTemp: false });
                        Core.huntMonster("water", "Udaroth", "Udaroth's Death Scale", undefined, { isTemp: false });
                        Core.huntMonster("dragonplane", "Moganth", "Moganth's Death Scale", undefined, {
                            isTemp: false,
                        });
                    }
                    break;
                case "Necrotic Sword of Doom":
                    Core.logger(`Go and get ${req.name} yourself.`);
                    break;
                case "Burning Blade Of Abezeth":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("celestialarenad", "Aranx", "Champion Sash", 20, { isTemp: false });
                    Adv.buyItem("celestialarena", 1474, "Burning Blade Of Abezeth");
                    break;
                case "Blade of Awe":
                    Farm.bladeofAweREP(6, true);
                    break;
                case "Abaddon's Terror":
                    if (!Core.isMember) {
                        Core.logger(`${req.name} requires Membership to obtain`);
                        return;
                    }
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("twilight", "Abaddon", req.name, undefined, { isTemp: false });
                    break;
                case "Krom's Brutality":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("forest", "Boss Zardman", req.name, undefined, { isTemp: false });
                    break;
                case "Phoenix Blade":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("lair", "Red Dragon", "Phoenix Blade", undefined, { isTemp: false });
                    break;
                case "Burn it Down":
                    if (!Daily.checkDailyv2(187, [req.name], { any: true, shouldUnBank: true })) {
                        Core.logger(`${req.name} owned, or daily unavailable`);
                        return;
                    }
                    Core.addDrop(req.name);
                    Core.ensureAccept(187);
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("portalundead", "Enter", "Spawn", "*", "Fire Gem");
                    Core.ensureComplete(187);
                    bot.wait.forPickup(req.name);
                    break;
                case "Shadow Terror Axe":

                case "Soul Terror Sword":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("battleundera", "Bone Terror", req.name, undefined, { isTemp: false });
                    break;
                case "DragonBlade of Nulgath":
                    if (!Core.isMember) {
                        Core.logger(`${req.name} requires Membership to obtain`);
                        return;
                    }
                    DBoN.getDragonBlade(true);
                    break;
                case "ShadowReaper Of Doom":
                    sRoD.shadowReaperOfDoom();
                    break;
                case "Cysero's Potato":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5528);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("nostalgiaquest", "Zardman Grunt", "Enchanted Rubber Ducky", undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Kuro's Wrath":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("river", "Kuro", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Lilith Katana":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("elemental", "Mana Golem", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Mammoth Crusher Blade":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("lair", "Bronze Draconian", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Light Prismatic Katana":
                    Core.farmingLogger(req.name, quant);
                    Adv.buyItem("akiba", 131, req.name, quant);
                    break;
                case "Corpse Maker of Nulgath":
                    Core.farmingLogger(req.name, quant);
                    TLC.questItems(TheLeeryContractMemberRewardsSelection.Corpse_Maker_of_Nulgath);
                    break;
                case "Excavated Glaive: Sword":
                    Core.farmingLogger(req.name, quant);
                    Adv.buyItem("artistalley", 753, req.name, quant);
                    break;
                case "Golden Blade of Fate":
                    Core.farmingLogger(req.name, quant);
                    GBOF.getGBoF();
                    break;
                case "Blade of Affliction":
                    Core.farmingLogger(req.name, quant);
                    Core.buyItem("Tercessuinotlim", 68, req.name, quant);
                    break;
                case "Hex Blade of Nulgath":

                case "Bane of Nulgath":
                    Nation.nulgathLarvae(req.name, quant);
                    break;
                case "Shadowworn":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("shadowrealmpast", "Shadow Lord", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Hollowborn Oblivion Blade":
                    Core.farmingLogger(req.name, quant);
                    HOB.getBlade();
                    break;
                case "Loyalty Blade of the Nation":
                    NDM.buyAllMerge(req.name);
                    break;
                case "Katana of Revontheus":
                    Core.logger(`${req.name} is rare, it can't be farmed.`);
                    break;
                case "Risoluto":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("necrocavern", "Chaos Vordred", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Fiendish Blood Blade":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("bludrut4", "Groglurk", req.name, quant, { isTemp: false, log: false });
                    break;
                case "SpiritHunter Katana":
                    SHM.buyAllMerge(req.name);
                    break;
            }
        };
        if (!Core.checkInventory("Golden 8th Birthday Candle")) {
            Core.buyItem(bot.map.name, 1317, "Golden 8th Birthday Candle");
        }
        Core.sleep(1500);
        if (!Core.checkInventory("Golden 8th Birthday Candle")) {
            Core.logger("Golden Candle not found - stopping bot.", undefined, { messageBox: true });
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("nostalgiaquest", 1311, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "37250",
            "Dual Boom Went The Dynamite",
            'Mode: [select] only\nShould the bot buy "Dual Boom Went The Dynamite" ?',
            false,
        ),
        option.bool("37249", "Dual TheWicked", 'Mode: [select] only\nShould the bot buy "Dual TheWicked" ?', false),
        option.bool(
            "37248",
            "Dual Oblivion of Nulgath Maces",
            'Mode: [select] only\nShould the bot buy "Dual Oblivion of Nulgath Maces" ?',
            false,
        ),
        option.bool(
            "37244",
            "Dual Overlord's DoomBlade",
            'Mode: [select] only\nShould the bot buy "Dual Overlord\'s DoomBlade" ?',
            false,
        ),
        option.bool(
            "37241",
            "Dual Blessed Coffee Cup",
            'Mode: [select] only\nShould the bot buy "Dual Blessed Coffee Cup" ?',
            false,
        ),
        option.bool(
            "37240",
            "Dual Party Slasher Birthday Sword",
            'Mode: [select] only\nShould the bot buy "Dual Party Slasher Birthday Sword" ?',
            false,
        ),
        option.bool(
            "37239",
            "Dual Rapier of Skulls",
            'Mode: [select] only\nShould the bot buy "Dual Rapier of Skulls" ?',
            false,
        ),
        option.bool("37238", "Dual Unarmed", 'Mode: [select] only\nShould the bot buy "Dual Unarmed" ?', false),
        option.bool("37236", "Dual Frostbite", 'Mode: [select] only\nShould the bot buy "Dual Frostbite" ?', false),
        option.bool("37235", "Dual Rocks", 'Mode: [select] only\nShould the bot buy "Dual Rocks" ?', false),
        option.bool(
            "37234",
            "Dual Phoenix Blade of Nulgath",
            'Mode: [select] only\nShould the bot buy "Dual Phoenix Blade of Nulgath" ?',
            false,
        ),
        option.bool(
            "37233",
            "Dual Shadow Spear of Nulgath",
            'Mode: [select] only\nShould the bot buy "Dual Shadow Spear of Nulgath" ?',
            false,
        ),
        option.bool(
            "37230",
            "Dual Guardian of Virtue",
            'Mode: [select] only\nShould the bot buy "Dual Guardian of Virtue" ?',
            false,
        ),
        option.bool(
            "37228",
            "Dual Leviasea Sword",
            'Mode: [select] only\nShould the bot buy "Dual Leviasea Sword" ?',
            false,
        ),
        option.bool(
            "37227",
            "Dual Iron Dreadsaw",
            'Mode: [select] only\nShould the bot buy "Dual Iron Dreadsaw" ?',
            false,
        ),
        option.bool(
            "37226",
            "Dual Blood Axe Of Destruction",
            'Mode: [select] only\nShould the bot buy "Dual Blood Axe Of Destruction" ?',
            false,
        ),
        option.bool(
            "37224",
            "Dual PainSaw of Eidolon",
            'Mode: [select] only\nShould the bot buy "Dual PainSaw of Eidolon" ?',
            false,
        ),
        option.bool(
            "37223",
            "Dual Hanzamune Dragon Koi Blade",
            'Mode: [select] only\nShould the bot buy "Dual Hanzamune Dragon Koi Blade" ?',
            false,
        ),
        option.bool("37222", "Dual Ugly Stick", 'Mode: [select] only\nShould the bot buy "Dual Ugly Stick" ?', false),
        option.bool(
            "37221",
            "Dual Balrog Blade",
            'Mode: [select] only\nShould the bot buy "Dual Balrog Blade" ?',
            false,
        ),
        option.bool(
            "37219",
            "Dual Legendary Magma Sword",
            'Mode: [select] only\nShould the bot buy "Dual Legendary Magma Sword" ?',
            false,
        ),
        option.bool("37218", "Dual Dragon Saw", 'Mode: [select] only\nShould the bot buy "Dual Dragon Saw" ?', false),
        option.bool(
            "37217",
            "Dual Overfiend Blade of Nulgath",
            'Mode: [select] only\nShould the bot buy "Dual Overfiend Blade of Nulgath" ?',
            false,
        ),
        option.bool("37216", "Dual Bone Sword", 'Mode: [select] only\nShould the bot buy "Dual Bone Sword" ?', false),
        option.bool(
            "37215",
            "Dual Honor Guard's Blade",
            'Mode: [select] only\nShould the bot buy "Dual Honor Guard\'s Blade" ?',
            false,
        ),
        option.bool(
            "37214",
            "Dual Ceremonial Legion Blade",
            'Mode: [select] only\nShould the bot buy "Dual Ceremonial Legion Blade" ?',
            false,
        ),
        option.bool(
            "37213",
            "Dual Alteon's Pride",
            'Mode: [select] only\nShould the bot buy "Dual Alteon\'s Pride" ?',
            false,
        ),
        option.bool(
            "37211",
            "Dual Ddog Sea Serpent Sword",
            'Mode: [select] only\nShould the bot buy "Dual Ddog Sea Serpent Sword" ?',
            false,
        ),
        option.bool(
            "37208",
            "Dual Eternity Blade",
            'Mode: [select] only\nShould the bot buy "Dual Eternity Blade" ?',
            false,
        ),
        option.bool(
            "37207",
            "Dual Blinding Light of Destiny",
            'Mode: [select] only\nShould the bot buy "Dual Blinding Light of Destiny" ?',
            false,
        ),
        option.bool(
            "37205",
            "Dual Crystal Claymore",
            'Mode: [select] only\nShould the bot buy "Dual Crystal Claymore" ?',
            false,
        ),
        option.bool(
            "37204",
            "Dual Dark Crystal Claymore",
            'Mode: [select] only\nShould the bot buy "Dual Dark Crystal Claymore" ?',
            false,
        ),
        option.bool(
            "37203",
            "Dual Soulreaper of Nulgath",
            'Mode: [select] only\nShould the bot buy "Dual Soulreaper of Nulgath" ?',
            false,
        ),
        option.bool(
            "37201",
            "Dual Grumpy Warhammer",
            'Mode: [select] only\nShould the bot buy "Dual Grumpy Warhammer" ?',
            false,
        ),
        option.bool(
            "37200",
            "Dual Crystal Phoenix Blade of Nulgath",
            'Mode: [select] only\nShould the bot buy "Dual Crystal Phoenix Blade of Nulgath" ?',
            false,
        ),
        option.bool(
            "37197",
            "Dual Maximillian's Whip",
            'Mode: [select] only\nShould the bot buy "Dual Maximillian\'s Whip" ?',
            false,
        ),
        option.bool(
            "37196",
            "Dual Pencil of Endless Scribbles",
            'Mode: [select] only\nShould the bot buy "Dual Pencil of Endless Scribbles" ?',
            false,
        ),
        option.bool(
            "37195",
            "Dual WarpForce War Shovel 20K",
            'Mode: [select] only\nShould the bot buy "Dual WarpForce War Shovel 20K" ?',
            false,
        ),
        option.bool(
            "37194",
            "Dual Godly Mace of the Ancients",
            'Mode: [select] only\nShould the bot buy "Dual Godly Mace of the Ancients" ?',
            false,
        ),
        option.bool(
            "37193",
            "Dual Mace of the Grand Inquisitor",
            'Mode: [select] only\nShould the bot buy "Dual Mace of the Grand Inquisitor" ?',
            false,
        ),
        option.bool("37192", "Dual KneeCappers", 'Mode: [select] only\nShould the bot buy "Dual KneeCappers" ?', false),
        option.bool(
            "37191",
            "Dual Morning Stars",
            'Mode: [select] only\nShould the bot buy "Dual Morning Stars" ?',
            false,
        ),
        option.bool(
            "37190",
            "Dual Axe of the Black Knight",
            'Mode: [select] only\nShould the bot buy "Dual Axe of the Black Knight" ?',
            false,
        ),
        option.bool(
            "37189",
            "Dual Cruel Axe of Midnight",
            'Mode: [select] only\nShould the bot buy "Dual Cruel Axe of Midnight" ?',
            false,
        ),
        option.bool(
            "37188",
            "Dual Platinum Axe of Destiny",
            'Mode: [select] only\nShould the bot buy "Dual Platinum Axe of Destiny" ?',
            false,
        ),
        option.bool("37186", "Dual Star Sword", 'Mode: [select] only\nShould the bot buy "Dual Star Sword" ?', false),
        option.bool("37185", "Dual Big 100K", 'Mode: [select] only\nShould the bot buy "Dual Big 100K" ?', false),
        option.bool(
            "37184",
            "Dual Blister's Chainsaw 08",
            'Mode: [select] only\nShould the bot buy "Dual Blister\'s Chainsaw 08" ?',
            false,
        ),
        option.bool(
            "37183",
            "Dual Golden Phoenix Sword",
            'Mode: [select] only\nShould the bot buy "Dual Golden Phoenix Sword" ?',
            false,
        ),
        option.bool(
            "37182",
            "Dual Hydra Blades",
            'Mode: [select] only\nShould the bot buy "Dual Hydra Blades" ?',
            false,
        ),
        option.bool(
            "37181",
            "Dual Crusader Sword",
            'Mode: [select] only\nShould the bot buy "Dual Crusader Sword" ?',
            false,
        ),
        option.bool("37180", "Dual Bloodrivers", 'Mode: [select] only\nShould the bot buy "Dual Bloodrivers" ?', false),
        option.bool(
            "37178",
            "Dual Star Sword Breaker",
            'Mode: [select] only\nShould the bot buy "Dual Star Sword Breaker" ?',
            false,
        ),
        option.bool(
            "37177",
            "Dual ReignBringers",
            'Mode: [select] only\nShould the bot buy "Dual ReignBringers" ?',
            false,
        ),
        option.bool(
            "37176",
            "Dual Balor's Cruelty",
            'Mode: [select] only\nShould the bot buy "Dual Balor\'s Cruelty" ?',
            false,
        ),
        option.bool(
            "37175",
            "Dual Default Sword",
            'Mode: [select] only\nShould the bot buy "Dual Default Sword" ?',
            false,
        ),
        option.bool("41805", "Dual Iron Spears", 'Mode: [select] only\nShould the bot buy "Dual Iron Spears" ?', false),
        option.bool(
            "41806",
            "Dual Undead Plague Spear",
            'Mode: [select] only\nShould the bot buy "Dual Undead Plague Spear" ?',
            false,
        ),
        option.bool(
            "41803",
            "Dual Mighty Sword Of The Dragons",
            'Mode: [select] only\nShould the bot buy "Dual Mighty Sword Of The Dragons" ?',
            false,
        ),
        option.bool(
            "45359",
            "Dual Necrotic Swords of Doom",
            'Mode: [select] only\nShould the bot buy "Dual Necrotic Swords of Doom" ?',
            false,
        ),
        option.bool(
            "45360",
            "Dual Burning Blades Of Abezeth",
            'Mode: [select] only\nShould the bot buy "Dual Burning Blades Of Abezeth" ?',
            false,
        ),
        option.bool(
            "45361",
            "Dual Blades of Awe",
            'Mode: [select] only\nShould the bot buy "Dual Blades of Awe" ?',
            false,
        ),
        option.bool(
            "45552",
            "Dual Abaddon's Terrors",
            'Mode: [select] only\nShould the bot buy "Dual Abaddon\'s Terrors" ?',
            false,
        ),
        option.bool(
            "45553",
            "Dual Krom's Brutalities",
            'Mode: [select] only\nShould the bot buy "Dual Krom\'s Brutalities" ?',
            false,
        ),
        option.bool("37000", "Phoenix Blades", 'Mode: [select] only\nShould the bot buy "Phoenix Blades" ?', false),
        option.bool(
            "50926",
            "Dual Burn it Down Staves",
            'Mode: [select] only\nShould the bot buy "Dual Burn it Down Staves" ?',
            false,
        ),
        option.bool(
            "50927",
            "Dual Shadow Terror Axes",
            'Mode: [select] only\nShould the bot buy "Dual Shadow Terror Axes" ?',
            false,
        ),
        option.bool(
            "50928",
            "Dual DragonBlades of Nulgath",
            'Mode: [select] only\nShould the bot buy "Dual DragonBlades of Nulgath" ?',
            false,
        ),
        option.bool(
            "50929",
            "Dual ShadowReapers Of Doom",
            'Mode: [select] only\nShould the bot buy "Dual ShadowReapers Of Doom" ?',
            false,
        ),
        option.bool(
            "85140",
            "Cysero's Potatoes",
            'Mode: [select] only\nShould the bot buy "Cysero\'s Potatoes" ?',
            false,
        ),
        option.bool(
            "85109",
            "Dual Kuro's Wrath",
            'Mode: [select] only\nShould the bot buy "Dual Kuro\'s Wrath" ?',
            false,
        ),
        option.bool(
            "85110",
            "Dual Lilith Katana",
            'Mode: [select] only\nShould the bot buy "Dual Lilith Katana" ?',
            false,
        ),
        option.bool(
            "85111",
            "Dual Mammoth Crusher Blade",
            'Mode: [select] only\nShould the bot buy "Dual Mammoth Crusher Blade" ?',
            false,
        ),
        option.bool(
            "85112",
            "Dual Light Prismatic Katana",
            'Mode: [select] only\nShould the bot buy "Dual Light Prismatic Katana" ?',
            false,
        ),
        option.bool(
            "85113",
            "Dual Corpse Maker of Nulgath",
            'Mode: [select] only\nShould the bot buy "Dual Corpse Maker of Nulgath" ?',
            false,
        ),
        option.bool(
            "85114",
            "Dual Excavated Glaive: Sword",
            'Mode: [select] only\nShould the bot buy "Dual Excavated Glaive: Sword" ?',
            false,
        ),
        option.bool(
            "85115",
            "Dual Golden Blade of Fate",
            'Mode: [select] only\nShould the bot buy "Dual Golden Blade of Fate" ?',
            false,
        ),
        option.bool(
            "85116",
            "Dual Blade of Affliction",
            'Mode: [select] only\nShould the bot buy "Dual Blade of Affliction" ?',
            false,
        ),
        option.bool(
            "37202",
            "Dual Hex Blade of Nulgath",
            'Mode: [select] only\nShould the bot buy "Dual Hex Blade of Nulgath" ?',
            false,
        ),
        option.bool("37206", "Dual Shadowworn", 'Mode: [select] only\nShould the bot buy "Dual Shadowworn" ?', false),
        option.bool(
            "85246",
            "Dual Bane of Nulgath",
            'Mode: [select] only\nShould the bot buy "Dual Bane of Nulgath" ?',
            false,
        ),
        option.bool(
            "85247",
            "Dual Hollowborn Oblivion Blade",
            'Mode: [select] only\nShould the bot buy "Dual Hollowborn Oblivion Blade" ?',
            false,
        ),
        option.bool(
            "85248",
            "Dual Loyalty Blade of the Nation",
            'Mode: [select] only\nShould the bot buy "Dual Loyalty Blade of the Nation" ?',
            false,
        ),
        option.bool(
            "85300",
            "Dual Katana of Revontheus",
            'Mode: [select] only\nShould the bot buy "Dual Katana of Revontheus" ?',
            false,
        ),
        option.bool("85301", "Dual Risoluto", 'Mode: [select] only\nShould the bot buy "Dual Risoluto" ?', false),
        option.bool(
            "85302",
            "Dual Soul Terror Sword",
            'Mode: [select] only\nShould the bot buy "Dual Soul Terror Sword" ?',
            false,
        ),
        option.bool(
            "85303",
            "Dual Fiendish Blood Blade",
            'Mode: [select] only\nShould the bot buy "Dual Fiendish Blood Blade" ?',
            false,
        ),
        option.bool(
            "85304",
            "SpiritHunter Katanas",
            'Mode: [select] only\nShould the bot buy "SpiritHunter Katanas" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: YulgarsDualWieldMerge.select,
});

export default function main(): void {
    const script = new YulgarsDualWieldMerge();
    Core.bankingBlackList.push(
        "Weapon Reflection",
        "Boom Went The Dynamite",
        "TheWicked",
        "Oblivion of Nulgath",
        "Overlord's DoomBlade",
        "Blessed Coffee Cup",
        "Party Slasher Birthday Sword",
        "Rapier of Skulls",
        "Unarmed",
        "Frostbite",
        "A Rock",
        "Phoenix Blade of Nulgath",
        "Shadow Spear of Nulgath",
        "Guardian of Virtue",
        "Leviasea Sword",
        "Iron Dreadsaw",
        "Blood Axe Of Destruction",
        "PainSaw of Eidolon",
        "Hanzamune Dragon Koi Blade",
        "Ugly Stick",
        "Balrog Blade",
        "Legendary Magma Sword",
        "Dragon Saw",
        "Overfiend Blade of Nulgath",
        "Bone Sword",
        "Honor Guard's Blade",
        "Ceremonial Legion Blade",
        "Alteon's Pride",
        "Ddog Sea Serpent Sword",
        "Eternity Blade",
        "Blinding Light of Destiny",
        "Crystal Claymore",
        "Dark Crystal Claymore",
        "Soulreaper of Nulgath",
        "Grumpy Warhammer",
        "Crystal Phoenix Blade of Nulgath",
        "Maximillian's Whip",
        "Mystic Pencil of Endless Scribbles",
        "WarpForce War Shovel 20K",
        "Godly Mace of the Ancients",
        "Mace of the Grand Inquisitor",
        "KneeCapper",
        "Morning Star",
        "Axe of the Black Knight",
        "Cruel Axe of Midnight",
        "Platinum Axe of Destiny",
        "Star Sword",
        "Big 100K",
        "Blister's Chainsaw 08",
        "Golden Phoenix Sword",
        "Hydra Blade",
        "Crusader Sword",
        "Bloodriver",
        "Star Sword Breaker",
        "ReignBringer",
        "Balor's Cruelty",
        "Default Sword",
        "Iron Spear",
        "Undead Plague Spear",
        "Mighty Sword Of The Dragons",
        "Necrotic Sword of Doom",
        "Burning Blade Of Abezeth",
        "Blade of Awe",
        "Abaddon's Terror",
        "Krom's Brutality",
        "Burn it Down",
        "Shadow Terror Axe",
        "DragonBlade of Nulgath",
        "ShadowReaper Of Doom",
        "Cysero's Potato",
        "Kuro's Wrath",
        "Lilith Katana",
        "Mammoth Crusher Blade",
        "Light Prismatic Katana",
        "Corpse Maker of Nulgath",
        "Excavated Glaive: Sword",
        "Golden Blade of Fate",
        "Blade of Affliction",
        "Hex Blade of Nulgath",
        "Shadowworn",
        "Bane of Nulgath",
        "Hollowborn Oblivion Blade",
        "Loyalty Blade of the Nation",
        "Katana of Revontheus",
        "Risoluto",
        "Soul Terror Sword",
        "Fiendish Blood Blade",
        "SpiritHunter Katana",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
