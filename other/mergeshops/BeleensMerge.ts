/*
name: BeleensMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/BeleensMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../../legion/CoreLegion";
import { LegionExercise3 } from "../../legion/legionexcercise/LegionExercise3";
import { LegionExercise4 } from "../../legion/legionexcercise/LegionExercise4";
import { CoreNation } from "../../nation/CoreNation";
import { TarosManslayer } from "../../nation/various/TarosManslayer";
import { ArtixWedding } from "../../story/ArtixWedding";

const Adv = new CoreAdvanced();
const coreLegion = new CoreLegion();
const legionExercise3 = new LegionExercise3();
const legionExercise4 = new LegionExercise4();
const Nation = new CoreNation();
const tarosManslayer = new TarosManslayer();
const artixWedding = new ArtixWedding();

export class BeleensMerge {
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
                case "Platinum Wings":
                    Adv.buyItem("Castle", 88, req.name);
                    break;
                case "Fuchsia Dye":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop("Magenta Dye");
                    if (Core.isMember) {
                        Core.registerQuests(1491);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            //Dyeing for Gemstones [Membership] 1491
                            Core.huntMonster("DarkoviaForest", "Lich Of The Stone", "Garnet Gem", 2);
                            Core.huntMonster("Cornelis", "Gargoyle", "Spinel Gem", 6);
                        }
                        Core.cancelRegisteredQuests();
                    } else {
                        Core.registerQuests(1489);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            //Flowers for the Pink Gal 1489
                            Core.huntMonster("Sandsea", "Cactus Creeper", "Fandango Flower", 5);
                            Core.killMonster("wanders", "r5", "Left", "Lotus Spider", "Lotus Flower", 4);
                        }
                        Core.cancelRegisteredQuests();
                    }
                    break;
                case "Plague Strike Scythe":
                    Adv.buyItem("ShadowFall", 89, req.name);
                    break;
                case "Baby Red Dragon":
                    Adv.buyItem("AriaPet", 12, req.name);
                    break;
                case "Zealith Reavers":
                    Core.farmingLogger(req.name, quant);
                    legionExercise3.exercise(["Judgement Hammer", "Legion Token"]);
                    legionExercise4.exercise(["Judgement Scythe", "Legion Token"]);
                    coreLegion.farmLegionToken(50);
                    Adv.buyItem("Underworld", 238, req.name);
                    break;
                case "Great Astral Wings":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("Elemental", "Mana Falcon", req.name, undefined, { isTemp: false });
                    break;
                case "Wave Cutter":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("Pirates", "Shark Bait", req.name, undefined, { isTemp: false });
                    break;
                case "Star Caster Staff":
                    Adv.buyItem("Castle", 48, req.name);
                    break;
                case "Scarlet's Costume":
                    Adv.buyItem("Sleuthhound", 65, req.name);
                    break;
                case "Infernal Dark Blade of Cruelty":
                    Adv.buyItem("Battleon", 10, req.name);
                    break;
                case "Chaos Dragonlord Helm":
                    Core.equipClass(ClassType.Solo);
                    Core.killVath(req.name, undefined, { isTemp: false });
                    break;
                case "Rose Aura of the Ascended":
                    Core.logger(`${req.name} is seasonal AC item and only available Beleen's Birthday event.`);
                    Adv.buyItem(bot.map.name, 1966, req.name);
                    break;
                case "Prismatic Dye":
                    Adv.buyItem("Tower", 1966, req.name);
                    break;
                case "Iron Dreadsaw":
                    Core.farmingLogger(req.name, quant);
                    if (!Core.checkInventory("Raw Dreadsaw")) {
                        Nation.approvalAndFavor(10, 0);
                        Nation.farmDiamondofNulgath(5);
                        Nation.farmTaintedGem(10);
                        Adv.buyItem("ArchPortal", 1211, "Raw Dreadsaw");
                    }
                    Nation.approvalAndFavor(40, 20);
                    Nation.farmGemofNulgath(10);
                    Adv.buyItem("ArchPortal", 1211, req.name);
                    break;
                case "Taro's Manslayer":
                    tarosManslayer.guardianTaro(true);
                    break;
                case "Dual Manslayer of Taro":
                    if (Core.isMember) {
                        Core.farmingLogger(req.name, quant);
                        Core.equipClass(ClassType.Farm);
                        Core.registerQuests(625);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            tarosManslayer.guardianTaro(true);
                            Nation.farmDiamondofNulgath(7);
                            Nation.farmDarkCrystalShard(13);
                            Nation.farmTaintedGem(13);
                            Nation.farmUni13(1);
                            Nation.farmVoucher({ member: true });
                            Core.huntMonster("Underworld", "Undead Bruiser", "Undead Bruiser Rune");
                            bot.wait.forPickup(req.name);
                        }
                        Core.cancelRegisteredQuests();
                    } else {
                        Core.logger(`"${req.name}" requires Membership to obtain`);
                    }
                    break;
                case "Demonhuntress Horns":
                    if (
                        !Core.checkInventory("Blindfolded Pink Demonhuntress Horns") ||
                        !Core.checkInventory("Pink Demonhuntress Horns")
                    ) {
                        Core.logger(`${req.name} is pseudo-Rare, you don't have the Rare item to merge this material`);
                        return;
                    }
                    Adv.buyItem("Curio", 1070, req.name);
                    break;
                case "Demonhunter Horns":
                    if (
                        !Core.checkInventory("Blindfolded Pink Demonhunter Horns") ||
                        !Core.checkInventory("Pink Demonhunter Horns")
                    ) {
                        Core.logger(`${req.name} is pseudo-Rare, you don't have the Rare item to merge this material`);
                        return;
                    }
                    if (Core.checkInventory("Blindfolded Pink Demonhunter Horns")) {
                        Adv.buyItem("Curio", 1214, req.name);
                    } else {
                        Adv.buyItem("Curio", 52, req.name);
                    }
                    break;
                case "DOOMFire Warrior":
                    if (!Core.hasAchievement(19, "ip6")) {
                        Core.logger(`"${req.name}" is Special Offer item, You need to have 200k Acs achievment badge`);
                    } else {
                        Adv.buyItem("Battleon", 1306, req.name);
                    }
                    break;
                case "Fire Imp Tail":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("Mobius", "Fire Imp", req.name, undefined, { isTemp: false });
                    break;
                case "Unarmed":
                    Adv.buyItem(bot.map.name, 1536, req.name);
                    break;
                case "Scarbucks Latte":
                    Core.logger(`"${req.name}" is Member & Seasonal item`);
                    Adv.buyItem("FearFeast", 1190, req.name);
                    break;
                case "Valor High Halo":
                    if (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.logger(`${req.name} is acquired from 'Open Treasure Chests! quest from Twilly`);
                        return;
                    }
                    break;
                case "Doge the Evil":
                    if (Core.isMember) {
                        Core.farmingLogger(req.name, quant);
                        Core.equipClass(ClassType.Farm);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.ensureAccept(2951);
                            //Legion Armored Daimyo [Member] 2951
                            Core.huntMonster("Ruins", "Dark Elemental", "Souls of the Destroyed", 15);
                            Core.huntMonster("bludrut4", "Shadow Serpent", "Shadow Essence", 4);
                            Core.huntMonster("GreenguardWest", "Black Knight", "Black Metal Armor");
                            Core.ensureComplete(2951, req.id);
                        }
                    } else {
                        Core.logger(`"${req.name}" requires Membership to obtain`);
                    }
                    break;
                case "Shimmering Flakes":
                    Adv.buyItem("BlindingSnow", 236, req.name);
                    break;
                case "Red Rose":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("BattleWedding", "EbilCorp Ninja", "Love Token", 10, { isTemp: false });
                    }
                    Adv.buyItem("ArtixWedding", 788, req.name);
                    break;
                case "Scarbucks Espresso Cup":
                    Core.logger(`"${req.name}" is Member & Seasonal item`);
                    Adv.buyItem("FearFeast", 1190, req.name);
                    break;
                case "Shadowslayer Armor":
                    Adv.buyItem("DarkoviaForest ", 138, req.name);
                    break;
                case "ShadowSlayer Hat":

                case "Shadow Z Hat":
                    Adv.buyItem("DarkoviaForest ", 138, req.name);
                    break;
                case "Reavers Of Good":
                    Core.farmingLogger(req.name, quant);
                    Core.killMonster("BrightFortress", "Fortress2", "Bottom", "*", "Mirror Token", 35, {
                        isTemp: false,
                    });
                    Adv.buyItem("BrightFortress", 795, req.name);
                    break;
                case "Slayer's Neophyte Broadsword":

                case "Slithering ShadowSlayer":

                case "Slithering Hunter's Hat":

                case "Slithering Hunter's Hat + Locks":

                case "Slayer's Wooden Pistol":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("DarkoviaForest", "Lich of the Stone", req.name, undefined, { isTemp: false });
                    break;
                case "Slithering Hunter's Knife":

                case "Slayer's Wooden Rifle":
                    if (Core.isMember) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("DarkoviaForest", "Lich of the Stone", req.name, undefined, { isTemp: false });
                    } else {
                        Core.logger(`"${req.name}" requires Membership to obtain`);
                    }
                    break;
            }
        };
        artixWedding.artixWeddingComplete();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("tower", 347, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "10177",
            "Pinkest Platinum Wings",
            'Mode: [select] only\nShould the bot buy "Pinkest Platinum Wings" ?',
            false,
        ),
        option.bool(
            "10178",
            "Pink Strike Scythe",
            'Mode: [select] only\nShould the bot buy "Pink Strike Scythe" ?',
            false,
        ),
        option.bool("10179", "Baby Pink Dragon", 'Mode: [select] only\nShould the bot buy "Baby Pink Dragon" ?', false),
        option.bool("10319", "Amaranth Reavers", 'Mode: [select] only\nShould the bot buy "Amaranth Reavers" ?', false),
        option.bool(
            "10320",
            "Astralnomically Pink Wings",
            'Mode: [select] only\nShould the bot buy "Astralnomically Pink Wings" ?',
            false,
        ),
        option.bool("10321", "Carmine Cutter", 'Mode: [select] only\nShould the bot buy "Carmine Cutter" ?', false),
        option.bool(
            "10322",
            "Shocking Pink Caster Staff",
            'Mode: [select] only\nShould the bot buy "Shocking Pink Caster Staff" ?',
            false,
        ),
        option.bool(
            "10323",
            "Magenta's Costume",
            'Mode: [select] only\nShould the bot buy "Magenta\'s Costume" ?',
            false,
        ),
        option.bool(
            "10324",
            "Adorable Pink Blade of Cuteness",
            'Mode: [select] only\nShould the bot buy "Adorable Pink Blade of Cuteness" ?',
            false,
        ),
        option.bool(
            "10353",
            "Chaotically Cute DragonLord Helm",
            'Mode: [select] only\nShould the bot buy "Chaotically Cute DragonLord Helm" ?',
            false,
        ),
        option.bool(
            "46826",
            "Prismatic Aura of the Ascended",
            'Mode: [select] only\nShould the bot buy "Prismatic Aura of the Ascended" ?',
            false,
        ),
        option.bool(
            "59032",
            "Pretty Pink DreadSaw",
            'Mode: [select] only\nShould the bot buy "Pretty Pink DreadSaw" ?',
            false,
        ),
        option.bool(
            "59266",
            "Taro's Pretty Manslayer",
            'Mode: [select] only\nShould the bot buy "Taro\'s Pretty Manslayer" ?',
            false,
        ),
        option.bool(
            "59352",
            "Taro's Dual Pretty Manslayers",
            'Mode: [select] only\nShould the bot buy "Taro\'s Dual Pretty Manslayers" ?',
            false,
        ),
        option.bool(
            "59267",
            "Pink Demonhuntress Horns",
            'Mode: [select] only\nShould the bot buy "Pink Demonhuntress Horns" ?',
            false,
        ),
        option.bool(
            "59268",
            "Blindfolded Pink Demonhuntress Horns",
            'Mode: [select] only\nShould the bot buy "Blindfolded Pink Demonhuntress Horns" ?',
            false,
        ),
        option.bool(
            "59269",
            "Pink Demonhunter Horns",
            'Mode: [select] only\nShould the bot buy "Pink Demonhunter Horns" ?',
            false,
        ),
        option.bool(
            "59270",
            "Blindfolded Pink Demonhunter Horns",
            'Mode: [select] only\nShould the bot buy "Blindfolded Pink Demonhunter Horns" ?',
            false,
        ),
        option.bool(
            "59271",
            "Pretty DOOMFire Warrior",
            'Mode: [select] only\nShould the bot buy "Pretty DOOMFire Warrior" ?',
            false,
        ),
        option.bool("59272", "Pink Imp Tail", 'Mode: [select] only\nShould the bot buy "Pink Imp Tail" ?', false),
        option.bool(
            "59347",
            "Viole(n)t Unarmed",
            'Mode: [select] only\nShould the bot buy "Viole(n)t Unarmed" ?',
            false,
        ),
        option.bool(
            "59359",
            "Pretty Pink Scarbucks Drink",
            'Mode: [select] only\nShould the bot buy "Pretty Pink Scarbucks Drink" ?',
            false,
        ),
        option.bool(
            "59360",
            "Vibrant Valor High Halo",
            'Mode: [select] only\nShould the bot buy "Vibrant Valor High Halo" ?',
            false,
        ),
        option.bool("38658", "Doge the Pink", 'Mode: [select] only\nShould the bot buy "Doge the Pink" ?', false),
        option.bool(
            "59354",
            "Pretty Shimmering Flakes",
            'Mode: [select] only\nShould the bot buy "Pretty Shimmering Flakes" ?',
            false,
        ),
        option.bool("59355", "Pink Rose", 'Mode: [select] only\nShould the bot buy "Pink Rose" ?', false),
        // C# lists option "59359" twice.
        option.bool(
            "59531",
            "Bright Pink ShadowSlayer",
            'Mode: [select] only\nShould the bot buy "Bright Pink ShadowSlayer" ?',
            false,
        ),
        option.bool(
            "59534",
            "Pink ShadowSlayer's Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Pink ShadowSlayer\'s Hat + Locks" ?',
            false,
        ),
        option.bool(
            "59535",
            "Pink ShadowSlayer's Hat",
            'Mode: [select] only\nShould the bot buy "Pink ShadowSlayer\'s Hat" ?',
            false,
        ),
        option.bool(
            "59541",
            "Pink ShadowSlayer's Broadsword",
            'Mode: [select] only\nShould the bot buy "Pink ShadowSlayer\'s Broadsword" ?',
            false,
        ),
        option.bool(
            "59532",
            "Reavers of Sakura",
            'Mode: [select] only\nShould the bot buy "Reavers of Sakura" ?',
            false,
        ),
        option.bool("59595", "Cool PinkSlayer", 'Mode: [select] only\nShould the bot buy "Cool PinkSlayer" ?', false),
        option.bool("59596", "PinkSlayer", 'Mode: [select] only\nShould the bot buy "PinkSlayer" ?', false),
        option.bool(
            "59597",
            "PinkSlayer's Hat",
            'Mode: [select] only\nShould the bot buy "PinkSlayer\'s Hat" ?',
            false,
        ),
        option.bool(
            "59598",
            "PinkSlayer's Hat + Locks",
            'Mode: [select] only\nShould the bot buy "PinkSlayer\'s Hat + Locks" ?',
            false,
        ),
        option.bool(
            "59601",
            "PinkSlayer's Knives",
            'Mode: [select] only\nShould the bot buy "PinkSlayer\'s Knives" ?',
            false,
        ),
        option.bool(
            "59602",
            "PinkSlayer's Knife",
            'Mode: [select] only\nShould the bot buy "PinkSlayer\'s Knife" ?',
            false,
        ),
        option.bool(
            "59600",
            "PinkSlayer's Pistol",
            'Mode: [select] only\nShould the bot buy "PinkSlayer\'s Pistol" ?',
            false,
        ),
        option.bool(
            "59599",
            "PinkSlayer's Rifle",
            'Mode: [select] only\nShould the bot buy "PinkSlayer\'s Rifle" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BeleensMerge.select,
});

export default function main(): void {
    const script = new BeleensMerge();
    Core.bankingBlackList.push(
        "Platinum Wings",
        "Fuchsia Dye",
        "Plague Strike Scythe",
        "Baby Red Dragon",
        "Zealith Reavers",
        "Great Astral Wings",
        "Wave Cutter",
        "Star Caster Staff",
        "Scarlet's Costume",
        "Infernal Dark Blade of Cruelty",
        "Chaos Dragonlord Helm",
        "Rose Aura of the Ascended",
        "Prismatic Dye",
        "Iron Dreadsaw",
        "Taro's Manslayer",
        "Dual Manslayer of Taro",
        "Demonhuntress Horns",
        "Demonhunter Horns",
        "DOOMFire Warrior",
        "Fire Imp Tail",
        "Unarmed",
        "Scarbucks Latte",
        "Valor High Halo",
        "Doge the Evil",
        "Shimmering Flakes",
        "Red Rose",
        "Scarbucks Espresso Cup",
        "Shadowslayer Armor",
        "ShadowSlayer Hat",
        "Shadow Z Hat",
        "Slayer's Neophyte Broadsword",
        "Reavers Of Good",
        "Slithering ShadowSlayer",
        "Slithering Hunter's Hat",
        "Slithering Hunter's Hat + Locks",
        "Slithering Hunter's Knife",
        "Slayer's Wooden Pistol",
        "Slayer's Wooden Rifle ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
