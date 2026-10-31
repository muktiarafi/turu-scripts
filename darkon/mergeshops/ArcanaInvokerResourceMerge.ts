/*
name: Arcana Invoker Resource Merge
description: This bot will farm the items belonging to the selected mode for the Arcana Invoker Resource Merge [2434] in /arcana
tags: arcana, invoker, resource, merge, arcana, magicians, desire, high, priestess, intuition, empress, initiative, emperors, authority, hierophants, servitude, lovers, embrace, chariots, triumph, justices, righteousness, hermits, solitude, wheel, fortunes, destiny, strengths, fortitude, hanged, mans, discernment, deaths, mortality, temperances, frugality, devilish, temptation, towers, upheaval, stars, hope, moons, illusion, suns, optimism, judgements, absolution, worlds, voyage
*/
// Port of Scripts/Darkon/MergeShops/ArcanaInvokerResourceMerge.cs.

import { bot, defineScriptOptions, type Monster, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreDarkon } from "../CoreDarkon";
import { ThreeLittleWolvesHousesMerge } from "../../other/mergeshops/3LittleWolvesHousesMerge";
import { BonecastleMerge } from "../../other/mergeshops/BonecastleMerge";
import { BrightForestMerge } from "../../other/mergeshops/BrightForestMerge";
import { CelestialChallengerMerge } from "../../other/mergeshops/CelestialChallengerMerge";
import { CelestialRealmMerge } from "../../other/mergeshops/CelestialRealmMerge";
import { CrocriverMerge } from "../../other/mergeshops/CrocriverMerge";
import { DoomLegacyMerge } from "../../other/mergeshops/DoomLegacyMerge";
import { DreampalaceMerge } from "../../other/mergeshops/DreampalaceMerge";
import { GooseMerge } from "../../other/mergeshops/GooseMerge";
import { SpoilsofLightMerge } from "../../other/mergeshops/SpoilsofLightMerge";
import { SuperSlayinMerge } from "../../other/mergeshops/SuperSlayinMerge";
import { TerminaTempleMerge } from "../../other/mergeshops/TerminaTempleMerge";
import { ThirdspellMerge } from "../../other/mergeshops/ThirdspellMerge";
import { needYourStrongestPotions } from "../../other/various/Potions";
import { CoreShadowofDoom } from "../../seasonal/blackfriday/shadowofdoom/CoreShadowofDoom";
import { ShadowMerge } from "../../seasonal/friday13th/mergeshops/ShadowMerge";
import { MoonlightKhopeshMerge } from "../../seasonal/mogloween/MoonlightKhopeshMerge";
import { ArchiveofTimeMerge } from "../../seasonal/newyear/ArchiveofTimeMerge";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";
import { FableForest } from "../../story/FableForest";
import { Core13LoC } from "../../story/lordsofchaos/Core13LoC";
import { VoidRefuge } from "../../story/nation/VoidRefuge";
import { InfernalArena } from "../../story/queenofmonsters/extra/InfernalArena";
import { CoreSepulchure } from "../../story/sepulchuresaga/CoreSepulchure";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const LOC = new Core13LoC();
const gooseMerge = new GooseMerge();
const brightForestMerge = new BrightForestMerge();
const terminaTempleMerge = new TerminaTempleMerge();
const infernalArena = new InfernalArena();
const DLM = new DoomLegacyMerge();
const CCM = new CelestialChallengerMerge();
const SOLM = new SpoilsofLightMerge();
const AOTM = new ArchiveofTimeMerge();
const CM = new CrocriverMerge();
const SSM = new SuperSlayinMerge();
const DPM = new DreampalaceMerge();
const BCM = new BonecastleMerge();
const CRM = new CelestialRealmMerge();
const TLWHM = new ThreeLittleWolvesHousesMerge();
const moonlightKhopeshMerge = new MoonlightKhopeshMerge();
const shadowMerge = new ShadowMerge();
const thirdspellMerge = new ThirdspellMerge();
const Darkon = new CoreDarkon();
const coreShadowofDoom = new CoreShadowofDoom();
const fableForest = new FableForest();
const VR = new VoidRefuge();
const AOR = new CoreAOR();
const CoreSS = new CoreSepulchure();

export class ArcanaInvokerResourceMerge {
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
                case "Staff of Inversion":
                    Core.killEscherion(req.name, undefined, { isTemp: req.temp });
                    break;
                case "BattleMage Armor":
                    Adv.buyItem("castleroof", 749, req.name, 1, 12773);
                    break;
                case "Nightlocke War Staff":
                    Core.equipClass(ClassType.Solo);
                    Core.killMonster("aqw3d", "r13", "Left", "Nightlocke Staff", req.name, quant, { isTemp: req.temp });
                    break;
                case "Calamitous Warlic's Tome":
                    Core.killMonster("ruinedcrown", "r10", "Left", "Calamitous Warlic", req.name, quant, {
                        isTemp: req.temp,
                    });
                    break;
                case "Dishpan Cleric Costume":
                    Core.killMonster("cleric", "Frame3", "Left", "Chaos Dragon", req.name, quant, { isTemp: req.temp });
                    break;
                case "Chaotic Healer":
                    Core.farmingLogger(req.name, quant);
                    LOC.hero();
                    Adv.buyItem("newfinale", 891, req.name);
                    break;
                case "Battle Cleric of the Dragon":
                    terminaTempleMerge.buyAllMerge(req.name);
                    break;
                case "Amia's Cult Secret":
                    Core.killMonster("fotia", "r6", "Left", "Amia the Cult Leader", req.name, quant, {
                        isTemp: req.temp,
                    });
                    break;
                case "Queen's Sage Scythe":
                    gooseMerge.buyAllMerge(req.name);
                    break;
                case "ShadowFlame Empress":
                    brightForestMerge.buyAllMerge(req.name);
                    break;
                case "Fragment of the Queen":
                    Core.equipClass(ClassType.Solo);
                    bot.quests.updateQuest(8094);
                    Core.huntMonster("transformation", "Queen of Monsters", req.name, quant, { isTemp: req.temp });
                    break;
                case "Empress' Finger's Ring":
                    Core.huntMonsterMapID("firstobservatory", 13, req.name, quant, { isTemp: req.temp });
                    break;
                case "King Klunk's Crown":
                    Core.huntMonster("evilwarnul", "Laken", req.name, quant, { isTemp: req.temp });
                    break;
                case "Crowned Skull of Na'al":
                    Core.farmingLogger(req.name, quant);
                    Core.useDodgeClass();
                    Core.logger(`Doing story first: ${!Core.isCompletedBefore(9373)}`);
                    if (!Core.isCompletedBefore(9377)) {
                        Core.logger(
                            "Boss: [Na'al]\n this may take an hr or 2... or u may first try it so good luck (a kill has been gotten with VHL) so its confirmd able to be done...)",
                        );
                        infernalArena.doStory();
                    }
                    Adv.buyItem(bot.map.name, 2336, req.name, quant);
                    break;
                case "Zealous Crown":
                    DLM.buyAllMerge(req.name);
                    break;
                case "Judgment Tonic":
                    needYourStrongestPotions({ potions: ["Judgment Tonic"], quant, buyReagents: true, separate: true });
                    break;
                case "Lich Emperor's Catalyst":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("warundead", "Lich Emperor", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Blessed Abezeth":
                    CCM.buyAllMerge(req.name);
                    break;
                case "Inquisitor of the Light":
                    SOLM.buyAllMerge(req.name);
                    break;
                case "Divine Guardian Of Aegis":
                    AOTM.buyAllMerge(req.name);
                    break;
                case "Chaos Weaver Cleric's Doctrine":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("chaosweb", "ChaosWeaver Cleric", req.name, quant, { isTemp: req.temp });
                    break;
                case "Love Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("battlewedding", "Platinum Mech Dragon", req.name, req.quantity, {
                        isTemp: req.temp,
                    });
                    bot.wait.forPickup(req.name);
                    break;
                case "Time Heart":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("portalmazec", "Vorefax ", req.name, quant, { isTemp: req.temp });
                    break;
                case "Storm Heart":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("pride", "Valsarian", req.name, quant, { isTemp: req.temp });
                    break;
                case "Mercutio's Heart":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("mercutio", "Mercutio", req.name, quant, { isTemp: req.temp });
                    break;
                case "Racing Trophy":
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop("Racing Trophy");
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.chainComplete(746);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Sphinx Sentinel":
                    CM.buyAllMerge(req.name);
                    break;
                case "Dread Deadmoor BattleAxe":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("deadmoor", "Lucid Nightmare", req.name, quant, { isTemp: req.temp });
                    break;
                case "SMU Brutalcorn's Horn":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ultrabrutalcorn", "SMU BrutalCorn", req.name, quant, { isTemp: req.temp });
                    break;
                case "Ouroboros Scale": {
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    let bellona: Monster | null;
                    let sleih: Monster | null;
                    Core.registerQuests(9443);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, req.quantity)) {
                        if (bot.map.name !== "camlan") {
                            Core.join("camlan");
                        }

                        if (bot.player.cell !== "r9") {
                            Core.jump("r9", "Let");
                        }

                        bellona =
                            bot.monsters.currentAvailableMonsters?.find(
                                (m) => (m?.hp > 0 && m?.state > 0) === true && m.mapId === 22,
                            ) ?? null;
                        sleih =
                            bot.monsters.currentAvailableMonsters?.find(
                                (m) => (m?.hp > 0 && m?.state > 0) === true && m.mapId === 23,
                            ) ?? null;

                        // Priority: missing drop
                        if (bot.tempInv.contains("Bellona's Edict of War") && bellona != null) {
                            bot.combat.attack(22);
                        } else if (bot.tempInv.contains("Sleih's Changeling Records") && sleih != null) {
                            bot.combat.attack(23);
                        } else if (bellona != null) {
                            bot.combat.attack(22);
                        } else if (sleih != null) {
                            bot.combat.attack(23);
                        }

                        bot.sleep(200);

                        // Hunt maw if the other 2 items are collected already.
                        if (
                            bot.tempInv.contains("Bellona's Edict of War") &&
                            bot.tempInv.contains("Sleih's Changeling Records")
                        ) {
                            Core.huntMonster("camlan", "Metamorphosis Maw", "Alchemic Snake Scale", undefined, {
                                log: false,
                            });
                        }
                        bot.wait.forQuestComplete(9443);
                        bot.wait.forPickup(req.id);
                    }
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                }
                case "Libran Scales":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("lightoviacave", "Imbalanced Mage", req.name, quant, { isTemp: req.temp });
                    break;
                case "Akriloth's Scale":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("shadowstrike", "Sepulchuroth", req.name, quant, { isTemp: req.temp });
                    break;
                case "ArchFiend DragonKnight's Scale":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("underlair", "ArchFiend DragonKnight", req.name, quant, { isTemp: req.temp });
                    break;
                case "Fa's Gamer Fuel":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("garden", "Fa", req.name, quant, { isTemp: req.temp });
                    break;
                case "ARTX 3090 Controller":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("mverse", "Major Mushroom", req.name, quant, { isTemp: req.temp });
                    break;
                case "Soulseeker's Grim Hood":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("marsh2", "Soulseeker", req.name, quant, { isTemp: req.temp });
                    break;
                case "Nothing's Solus":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("pocketdimension", "Nothing", req.name, quant, { isTemp: req.temp });
                    break;
                case "Lucky Pet":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("pilgrimage", "Lucky", req.name, quant, { isTemp: req.temp });
                    break;
                case "Second Chance Coin":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7781);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Adv.buyItem("onsen", 1926, "Gachapon Coin", undefined, undefined, undefined, false);
                        Core.huntMonster("yokaigrave", "Skello Kitty", "Skello Kitty Bone", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Treasure Chest":
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("finalbattle", "r2", "Left", "*", req.name, quant, { isTemp: req.temp });
                    break;
                case "Divine Elixir":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("poisonforest", "Xavier Lionfang", req.name, quant, { isTemp: req.temp });
                    break;
                case "Ultra Lobthulu's Fortune":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ultralob", "Ultra Lobthulhu", req.name, quant, { isTemp: req.temp });
                    break;
                case "Enchanted Martial Artist's Gi":
                    SSM.buyAllMerge(req.name);
                    break;
                case "Strong Axe of Golmoth":
                    DPM.buyAllMerge(req.name);
                    break;
                case "Fortitude Tonic":
                    needYourStrongestPotions({
                        potions: ["Fortitude Tonic"],
                        quant,
                        buyReagents: true,
                        separate: true,
                    });
                    break;
                case "Strong Drag's Intact Wing":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("dracocon", "Strong Drag", req.name, quant, { isTemp: req.temp });
                    break;
                case "Chained Rune Bonebreaker":

                case "Chained Rune Bonebreakers":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("archportal", "High Legion Inquisitor", req.name, quant, { isTemp: req.temp });
                    break;
                case "Noble Sacrifice":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonsterMapID("necrodungeon", 48, req.name, quant, { isTemp: req.temp });
                    break;
                case "The Answer":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("battlefowl", "Zeuster Projection", req.name, quant, { isTemp: req.temp });
                    break;
                case "Astero's Insight":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("fortressdelve", "Astero", req.name, quant, { isTemp: req.temp });
                    break;
                case "Death's Oversight":
                    Core.equipClass(ClassType.Solo);
                    Core.killMonster("shadowattack", "Boss", "Left", "Death", req.name, quant, { isTemp: req.temp });
                    break;
                case "Death Pit Arena Medal":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("deathpit", "Training Dummy", req.name, quant, { isTemp: req.temp });
                    break;
                case "Enchanted DeathKnight":
                    BCM.buyAllMerge(req.name);
                    break;
                case "Super Death's Scythe Fragment":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("superdeath", "Super Death", req.name, quant, { isTemp: req.temp });
                    break;
                case "Celestial Wings of Guiding":
                    CRM.buyAllMerge(req.name);
                    break;
                case "Blessed Coffee Cup":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5405);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("sandsea", "Oasis Monkey", "Pally Luwak Beans", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Northern Crown":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("snowmore", "Jon S'NOOOOOOO", req.name, quant, { isTemp: req.temp });
                    break;
                case "Azkorath's Wing":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("infernalspire", "Azkorath", req.name, quant, { isTemp: req.temp });
                    break;
                case "Fiendish Outlaw":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("fiendpast", "Dage the Lich", req.name, quant, { isTemp: req.temp });
                    break;
                case "Fiendish Remains":
                    VR.storyline();
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9532);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("voidrefuge", "Paladin Ascendant", "Sussurating Helm", 3, { log: false });
                        Core.huntMonster("voidrefuge", "Nation Outrider", "Scarred Coin", 8, { log: false });
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("voidrefuge", "Carnage", "Carnage's Ichor", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Glass Horns":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ashfallcamp", "Blackrawk", req.name, quant, { isTemp: req.temp });
                    break;
                case "Fiend Champion's Spike":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("originul", "Fiend Champion", req.name, quant, { isTemp: req.temp });
                    break;
                case "Earth Stone":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(3317);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("fableforest", "Earth Elemental", "Earth Aura", 5, { log: false });
                        Core.huntMonster("fableforest", "Undead Satyr", "Satyr Hoof", 5, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Dragon Runestone":
                    // Core.FarmingLogger(req.Name, quant);
                    // Adv.BuyItem("alchemyacademy", 395, 62749, quant, 1, 8777);
                    // Core.BuyItem("alchemyacademy", 395, "Dragon Runestone", quant, 8844);
                    Farm.dragonRunestone(quant);
                    break;
                case "Arcangrove Tower House":
                    TLWHM.buyAllMerge(req.name);
                    break;
                case "Nevanna's Revelation":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("gaiazor", "Nevanna", req.name, quant, { isTemp: req.temp });
                    break;
                case "Star Scrap":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("starsinc", "Star Sprites", req.name, quant, { isTemp: req.temp });
                    break;
                case "Rising Star Token":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("herolobby", "Training Partner", req.name, quant, { isTemp: req.temp });
                    break;
                case "Dark Stars":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("deadlines", "Eternal Dragon", req.name, quant, { isTemp: req.temp });
                    break;
                case "Star Sapphire Fragment":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("skytower", "Star Sapphire", req.name, quant, { isTemp: req.temp });
                    break;
                case "Moon Rock Fragments":
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("lunacove", "r2", "Right", "*", req.name, quant, { isTemp: req.temp });
                    break;
                case "Blood Moon Warrior":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("marchosiasfight", "Marchosias", req.name, quant, { isTemp: req.temp });
                    break;
                case "Celestial Khopesh":
                    moonlightKhopeshMerge.buyAllMerge(req.name);
                    break;
                case "The Moon's Reflection":
                    bot.quests.updateQuest(8000);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("Astravia", "The Moon", req.name, quant, { isTemp: req.temp });
                    break;
                case "Golden Sun Seal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("titanattack", "Titanic Paladin", req.name, quant, { isTemp: req.temp });
                    break;
                case "Sun Zone Chit": {
                    let remainingQuant = quant - bot.inventory.getQuantity(req.name);
                    // Calculate the maximum items per quest turn-in (5 * max reward = 35)
                    const maxRewardPerTurnIn = 35;
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.farmingLogger(req.name, quant);
                        Core.ensureAccept(9252);

                        // Adjust quantities based on remaining required items
                        const infernalQty = remainingQuant < maxRewardPerTurnIn ? 10 : 50;
                        const seraphicQty = remainingQuant < maxRewardPerTurnIn ? 10 : 50;
                        const marineQty = remainingQuant < maxRewardPerTurnIn ? 1 : 5;

                        // Equip solo class for Marine Snow
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("sunlightzone", "Marine Snow", "Marine Sample", marineQty);

                        // Equip farming class for the rest
                        Core.equipClass(ClassType.Farm);
                        Core.killMonster("sunlightzone", "r9", "left", "*", "seraphic sample", seraphicQty);
                        Core.killMonster("sunlightzone", "r8", "left", "*", "infernal sample", infernalQty);
                        Core.ensureCompleteMulti(9252);
                        bot.wait.forPickup(req.name);

                        // Recalculate remaining quantity after each turn-in
                        remainingQuant = quant - bot.inventory.getQuantity(req.name);
                    }
                    break;
                }
                case "Armor of the Sun":
                    thirdspellMerge.buyAllMerge(req.name);
                    break;
                case "The Sun's Enlightenment":
                    bot.quests.updateQuest(8256);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("astraviacastle", "The Sun", req.name, quant, { isTemp: req.temp });
                    break;
                case "Trumpet":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("astraviajudge", "Trumpeter", req.name, quant, { isTemp: req.temp });
                    break;
                case "Enchanted Lance of Doom Reborn":
                    shadowMerge.buyAllMerge(req.name);
                    break;
                case "Minos' Sentence":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("judgement", "Minos", req.name, quant, { isTemp: req.temp });
                    break;
                case "Darkon's Receipt":
                    Darkon.farmReceipt(quant);
                    break;
                case "Teeth":
                    Darkon.teeth(quant);
                    break;
                case "La's Gratitude":
                    Darkon.lasGratitude(quant);
                    break;
                case "Astravian Medal":
                    Darkon.astravianMedal(quant);
                    break;
                case "A Melody":
                    Darkon.aMelody(quant);
                    break;
                case "Bandit's Correspondence":
                    Darkon.banditsCorrespondence(quant);
                    break;
                case "Suki's Prestige":
                    Darkon.sukisPrestiege(quant);
                    break;
                case "Ancient Remnant":
                    Darkon.ancientRemnant(quant);
                    break;
                case "Mourning Flower":
                    Darkon.wheelofFortune(quant, 0);
                    break;
                case "Unfinished Musical Score":
                    Darkon.unfinishedMusicalScore(quant);
                    break;
            }
        };
        //prolly more storylines missing, add as found
        coreShadowofDoom.doAll();
        fableForest.storyLine();
        AOR.sunlightZone();
        CoreSS.completeSS();
        //prolly more storylines missing, add as found

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("arcana", 2434, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "85452",
            "1 - The Magician's Desire",
            'Mode: [select] only\nShould the bot buy "1 - The Magician\'s Desire" ?',
            false,
        ),
        option.bool(
            "85453",
            "2 - The High Priestess' Intuition",
            'Mode: [select] only\nShould the bot buy "2 - The High Priestess\' Intuition" ?',
            false,
        ),
        option.bool(
            "85455",
            "3 - The Empress' Initiative",
            'Mode: [select] only\nShould the bot buy "3 - The Empress\' Initiative" ?',
            false,
        ),
        option.bool(
            "85457",
            "4 - The Emperor's Authority",
            'Mode: [select] only\nShould the bot buy "4 - The Emperor\'s Authority" ?',
            false,
        ),
        option.bool(
            "85459",
            "5 - The Hierophant's Servitude",
            'Mode: [select] only\nShould the bot buy "5 - The Hierophant\'s Servitude" ?',
            false,
        ),
        option.bool(
            "85461",
            "6 - The Lovers' Embrace",
            'Mode: [select] only\nShould the bot buy "6 - The Lovers\' Embrace" ?',
            false,
        ),
        option.bool(
            "85463",
            "7 - The Chariot's Triumph",
            'Mode: [select] only\nShould the bot buy "7 - The Chariot\'s Triumph" ?',
            false,
        ),
        option.bool(
            "85465",
            "8 - Justice's Righteousness",
            'Mode: [select] only\nShould the bot buy "8 - Justice\'s Righteousness" ?',
            false,
        ),
        option.bool(
            "85467",
            "9 - The Hermit's Solitude",
            'Mode: [select] only\nShould the bot buy "9 - The Hermit\'s Solitude" ?',
            false,
        ),
        option.bool(
            "85469",
            "10 - Wheel of Fortune's Destiny",
            'Mode: [select] only\nShould the bot buy "10 - Wheel of Fortune\'s Destiny" ?',
            false,
        ),
        option.bool(
            "85471",
            "11 - Strength's Fortitude",
            'Mode: [select] only\nShould the bot buy "11 - Strength\'s Fortitude" ?',
            false,
        ),
        option.bool(
            "85473",
            "12 - The Hanged Man's Discernment",
            'Mode: [select] only\nShould the bot buy "12 - The Hanged Man\'s Discernment" ?',
            false,
        ),
        option.bool(
            "85475",
            "13 - Death's Mortality",
            'Mode: [select] only\nShould the bot buy "13 - Death\'s Mortality" ?',
            false,
        ),
        option.bool(
            "85477",
            "14 - Temperance's Frugality",
            'Mode: [select] only\nShould the bot buy "14 - Temperance\'s Frugality" ?',
            false,
        ),
        option.bool(
            "85479",
            "15 - Devilish Temptation",
            'Mode: [select] only\nShould the bot buy "15 - Devilish Temptation" ?',
            false,
        ),
        option.bool(
            "85481",
            "16 - The Tower's Upheaval",
            'Mode: [select] only\nShould the bot buy "16 - The Tower\'s Upheaval" ?',
            false,
        ),
        option.bool(
            "85483",
            "17 - The Star's Hope",
            'Mode: [select] only\nShould the bot buy "17 - The Star\'s Hope" ?',
            false,
        ),
        option.bool(
            "85485",
            "18 - The Moon's Illusion",
            'Mode: [select] only\nShould the bot buy "18 - The Moon\'s Illusion" ?',
            false,
        ),
        option.bool(
            "85487",
            "19 - The Sun's Optimism",
            'Mode: [select] only\nShould the bot buy "19 - The Sun\'s Optimism" ?',
            false,
        ),
        option.bool(
            "85489",
            "20 - Judgement's Absolution",
            'Mode: [select] only\nShould the bot buy "20 - Judgement\'s Absolution" ?',
            false,
        ),
        option.bool(
            "85491",
            "21 - The World's Voyage",
            'Mode: [select] only\nShould the bot buy "21 - The World\'s Voyage" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ArcanaInvokerResourceMerge.select,
});

export default function main(): void {
    const script = new ArcanaInvokerResourceMerge();
    Core.bankingBlackList.push(
        "Staff of Inversion",
        "BattleMage Armor",
        "Nightlocke War Staff",
        "Calamitous Warlic's Tome",
        "Dishpan Cleric Costume",
        "Chaotic Healer",
        "Battle Cleric of the Dragon",
        "Amia's Cult Secret",
        "Queen's Sage Scythe",
        "ShadowFlame Empress",
        "Fragment of the Queen",
        "Empress' Finger's Ring",
        "King Klunk's Crown",
        "Crowned Skull of Na'al",
        "Zealous Crown",
        "Lich Emperor's Catalyst",
        "Blessed Abezeth",
        "Inquisitor of the Light",
        "Divine Guardian Of Aegis",
        "Chaos Weaver Cleric's Doctrine",
        "Love Token",
        "Time Heart",
        "Storm Heart",
        "Mercutio's Heart",
        "Racing Trophy",
        "Sphinx Sentinel",
        "Dread Deadmoor BattleAxe",
        "SMU Brutalcorn's Horn",
        "Ouroboros Scale",
        "Libran Scales",
        "Akriloth's Scale",
        "ArchFiend DragonKnight's Scale",
        "Fa's Gamer Fuel",
        "ARTX 3090 Controller",
        "Soulseeker's Grim Hood",
        "Nothing's Solus",
        "Lucky Pet",
        "Second Chance Coin",
        "Treasure Chest",
        "Ultra Lobthulu's Fortune",
        "Enchanted Martial Artist's Gi",
        "Strong Axe of Golmoth",
        "Fortitude Tonic",
        "Strong Drag's Intact Wing",
        "Chained Rune Bonebreaker",
        "Noble Sacrifice",
        "The Answer",
        "Astero's Insight",
        "Death's Oversight",
        "Death Pit Arena Medal",
        "Enchanted DeathKnight",
        "Super Death's Scythe Fragment",
        "Celestial Wings of Guiding",
        "Blessed Coffee Cup",
        "Northern Crown",
        "Azkorath's Wing",
        "Fiendish Outlaw",
        "Fiendish Remains",
        "Glass Horns",
        "Fiend Champion's Spike",
        "Earth Stone",
        "Dragon Runestone",
        "Arcangrove Tower House",
        "Nevanna's Revelation",
        "Star Scrap",
        "Rising Star Token",
        "Dark Stars",
        "Star Sapphire Fragment",
        "Moon Rock Fragments",
        "Blood Moon Warrior",
        "Celestial Khopesh",
        "The Moon's Reflection",
        "Golden Sun Seal",
        "Sun Zone Chit",
        "Armor of the Sun",
        "The Sun's Enlightenment",
        "Trumpet",
        "Judgment Tonic",
        "Enchanted Lance of Doom Reborn",
        "Minos' Sentence",
        "Darkon's Receipt",
        "Teeth",
        "La's Gratitude",
        "Astravian Medal",
        "A Melody",
        "Bandit's Correspondence",
        "Suki's Prestige",
        "Ancient Remnant",
        "Mourning Flower",
        "Unfinished Musical Score",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
