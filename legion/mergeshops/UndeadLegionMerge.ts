/*
name: Undead Legion Merge
description: This bot will farm the items belonging to the selected mode for the Undead Legion Merge [238] in /underworld
tags: undead, legion, merge, underworld, frostbite, overlord, zealith, reavers, blademaster, guiltius, legend, crown, face, judge, assassin, darkside, promotion, titan, cloak, exalted, champion, horns, archer, otherworldly, deathstare, deathdealer, shield, gutripper, skull, goggles, deathmask, apocalypse, dark, flaming, ultimate, lich, king, original, paragon, castle, soul, cleaver, smiling, dage, infinite, caster, loyal, warrior, swordmaster, draconic, plate, horned, spiked, guard, rhongomyniad, platinum, medal, gold, silver, bronze, yami, no, ronin, sheathed, katana, shuriken, shurikens, healer, mage, hatmask, rogue, , dragonblade, nulgath, monsterhunter, monsterhunters, revenant, seven, circles, beast, ancient, wraiths, winged, bone, crusher, crushers, warlord, great, twisted, yulgars, inn, house, parabellum, armaments, hammer, back, armet, void, vigilante, maw, battlegear, awakened, deaths, requiem, ops, armed, breach, morph, briefcase, tactical, gear, ghost, drone, cold, steel, kukri, kukris, rifle, rifles, corpsewax, candle, incendo, regius, nástrandir, warbringer, naval, scarf, eyepatch, bandana, focus, tide, despair, tides, arcane, shadow, minion, battle, pet
*/
// Port of Scripts/Legion/MergeShops/UndeadLegionMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { CoreLegion } from "../CoreLegion";
import { LegionExercise3 } from "../legionexcercise/LegionExercise3";
import { LegionExercise4 } from "../legionexcercise/LegionExercise4";
import { CoreLR } from "../revenant/CoreLR";
import { DragonBladeofNulgath } from "../../nation/various/DragonBlade[mem]";

const Adv = new CoreAdvanced();
const Daily = new CoreDailies();
const Legion = new CoreLegion();
const LR = new CoreLR();
const legionExercise3 = new LegionExercise3();
const legionExercise4 = new LegionExercise4();
const DBoN = new DragonBladeofNulgath();

export class UndeadLegionMerge {
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
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
                case "Frosted Falchion":
                    Adv.buyItem("BlindingSnow", 236, req.name);
                    break;
                case "Judgement Scythe":
                    legionExercise4.exercise(["Judgement Scythe", "Legion Token"]);
                    break;
                case "Judgement Hammer":
                    legionExercise3.exercise(["Judgement Hammer", "Legion Token"]);
                    break;
                case "Cursed Scimitar":
                    Adv.buyItem("SandSea", 242, req.name);
                    break;
                case "Essence of the Undead Legend":
                    if (!Core.isSeasonalMapActive("DarkBirthday")) {
                        Core.logger(
                            `${req.name} Is seasonal item from Dage's Dark Birthday Shop, failing over to next item`,
                        );
                        return;
                    }
                    Core.logger('"DarkBirthday" is a seasonal map available during dage\'s birthday');
                    Adv.buyItem("DarkBirthday", 376, req.name);
                    break;
                case "Shadow Shroud":
                    Daily.shadowShroud();
                    if (!Core.checkInventory(req.name, quant)) {
                        Core.logger(
                            `Not enough "Shadow Shroud", please do the daily ${15 - bot.inventory.getQuantity("Shadow Shroud")} more times (not today)`,
                            undefined,
                            { messageBox: true },
                        );
                    }
                    break;
                case "DragonBlade of Nulgath":
                    DBoN.getDragonBlade();
                    break;
                case "Fallen MonsterHunter":

                case "Fallen MonsterHunter Helm":

                case "Fallen MonsterHunter Cape":

                case "Fallen MonsterHunter Sword":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("DeepForest", "Aberrant Horror", req.name, undefined, { isTemp: false });
                    break;
                case "Exalted Crown":
                    LR.exaltedCrown();
                    break;
                case "Death's Requiem Staff":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("cocytusbarracks", "Maleagant", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("underworld", 238, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("6522", "Frostbite", 'Mode: [select] only\nShould the bot buy "Frostbite" ?', false),
        option.bool(
            "6519",
            "Undead Legion OverLord",
            'Mode: [select] only\nShould the bot buy "Undead Legion OverLord" ?',
            false,
        ),
        option.bool("2188", "Zealith Reavers", 'Mode: [select] only\nShould the bot buy "Zealith Reavers" ?', false),
        option.bool("6921", "BladeMaster", 'Mode: [select] only\nShould the bot buy "BladeMaster" ?', false),
        option.bool("6948", "The Guiltius", 'Mode: [select] only\nShould the bot buy "The Guiltius" ?', false),
        option.bool(
            "8586",
            "Undead Legend Crown",
            'Mode: [select] only\nShould the bot buy "Undead Legend Crown" ?',
            false,
        ),
        option.bool(
            "8585",
            "Undead Legend Face",
            'Mode: [select] only\nShould the bot buy "Undead Legend Face" ?',
            false,
        ),
        option.bool(
            "8575",
            "Undead Legend Cape",
            'Mode: [select] only\nShould the bot buy "Undead Legend Cape" ?',
            false,
        ),
        option.bool("8574", "Undead Legend", 'Mode: [select] only\nShould the bot buy "Undead Legend" ?', false),
        option.bool("9922", "Legion Judge", 'Mode: [select] only\nShould the bot buy "Legion Judge" ?', false),
        option.bool("9921", "Undead Assassin", 'Mode: [select] only\nShould the bot buy "Undead Assassin" ?', false),
        option.bool(
            "9969",
            "Undead Assassin Swords",
            'Mode: [select] only\nShould the bot buy "Undead Assassin Swords" ?',
            false,
        ),
        option.bool("10597", "Darkside Helm", 'Mode: [select] only\nShould the bot buy "Darkside Helm" ?', false),
        option.bool("10740", "Darkside Staff", 'Mode: [select] only\nShould the bot buy "Darkside Staff" ?', false),
        option.bool("11025", "Legion Promotion", 'Mode: [select] only\nShould the bot buy "Legion Promotion" ?', false),
        option.bool("11359", "Legion Titan", 'Mode: [select] only\nShould the bot buy "Legion Titan" ?', false),
        option.bool(
            "11360",
            "Legion Titan Crown",
            'Mode: [select] only\nShould the bot buy "Legion Titan Crown" ?',
            false,
        ),
        option.bool(
            "11361",
            "Legion Titan Cloak",
            'Mode: [select] only\nShould the bot buy "Legion Titan Cloak" ?',
            false,
        ),
        option.bool(
            "18295",
            "Exalted Legion Champion",
            'Mode: [select] only\nShould the bot buy "Exalted Legion Champion" ?',
            false,
        ),
        option.bool(
            "18333",
            "Legion Champion Horns",
            'Mode: [select] only\nShould the bot buy "Legion Champion Horns" ?',
            false,
        ),
        option.bool(
            "18334",
            "Legion Champion Helm",
            'Mode: [select] only\nShould the bot buy "Legion Champion Helm" ?',
            false,
        ),
        option.bool(
            "18795",
            "Legion Archer Armor",
            'Mode: [select] only\nShould the bot buy "Legion Archer Armor" ?',
            false,
        ),
        option.bool(
            "18791",
            "Otherworldly Legion Deathstare Helm",
            'Mode: [select] only\nShould the bot buy "Otherworldly Legion Deathstare Helm" ?',
            false,
        ),
        option.bool(
            "18792",
            "Legion Deathstare Helm",
            'Mode: [select] only\nShould the bot buy "Legion Deathstare Helm" ?',
            false,
        ),
        option.bool(
            "18803",
            "Legion Deathdealer Blade and Shield",
            'Mode: [select] only\nShould the bot buy "Legion Deathdealer Blade and Shield" ?',
            false,
        ),
        option.bool(
            "18802",
            "Gutripper Daggers",
            'Mode: [select] only\nShould the bot buy "Gutripper Daggers" ?',
            false,
        ),
        option.bool(
            "26297",
            "Legion Skull and Goggles",
            'Mode: [select] only\nShould the bot buy "Legion Skull and Goggles" ?',
            false,
        ),
        option.bool("26279", "Legion DeathMask", 'Mode: [select] only\nShould the bot buy "Legion DeathMask" ?', false),
        option.bool(
            "26278",
            "Legion Apocalypse Skull",
            'Mode: [select] only\nShould the bot buy "Legion Apocalypse Skull" ?',
            false,
        ),
        option.bool(
            "26277",
            "Dark Flaming Legion Skull",
            'Mode: [select] only\nShould the bot buy "Dark Flaming Legion Skull" ?',
            false,
        ),
        option.bool(
            "28835",
            "Ultimate Lich King",
            'Mode: [select] only\nShould the bot buy "Ultimate Lich King" ?',
            false,
        ),
        option.bool(
            "28836",
            "Ultimate Lich King Helm",
            'Mode: [select] only\nShould the bot buy "Ultimate Lich King Helm" ?',
            false,
        ),
        option.bool(
            "28837",
            "Original Paragon Helm",
            'Mode: [select] only\nShould the bot buy "Original Paragon Helm" ?',
            false,
        ),
        option.bool("34143", "Legion Castle", 'Mode: [select] only\nShould the bot buy "Legion Castle" ?', false),
        option.bool(
            "43102",
            "Exalted Soul Cleaver",
            'Mode: [select] only\nShould the bot buy "Exalted Soul Cleaver" ?',
            false,
        ),
        option.bool(
            "43237",
            "Smiling Dage Helm",
            'Mode: [select] only\nShould the bot buy "Smiling Dage Helm" ?',
            false,
        ),
        option.bool(
            "47465",
            "Infinite Legion Dark Caster",
            'Mode: [select] only\nShould the bot buy "Infinite Legion Dark Caster" ?',
            false,
        ),
        option.bool(
            "48128",
            "Blade of the Loyal Legion Warrior",
            'Mode: [select] only\nShould the bot buy "Blade of the Loyal Legion Warrior" ?',
            false,
        ),
        option.bool("53837", "SwordMaster", 'Mode: [select] only\nShould the bot buy "SwordMaster" ?', false),
        option.bool(
            "53871",
            "Draconic Paragon Plate",
            'Mode: [select] only\nShould the bot buy "Draconic Paragon Plate" ?',
            false,
        ),
        option.bool(
            "53872",
            "Draconic Paragon Hood",
            'Mode: [select] only\nShould the bot buy "Draconic Paragon Hood" ?',
            false,
        ),
        option.bool(
            "53873",
            "Draconic Paragon Horned Hood",
            'Mode: [select] only\nShould the bot buy "Draconic Paragon Horned Hood" ?',
            false,
        ),
        option.bool(
            "53874",
            "Draconic Paragon Spiked Hood",
            'Mode: [select] only\nShould the bot buy "Draconic Paragon Spiked Hood" ?',
            false,
        ),
        option.bool(
            "53875",
            "Draconic Paragon Helmet",
            'Mode: [select] only\nShould the bot buy "Draconic Paragon Helmet" ?',
            false,
        ),
        option.bool(
            "53876",
            "Draconic Paragon Guard",
            'Mode: [select] only\nShould the bot buy "Draconic Paragon Guard" ?',
            false,
        ),
        option.bool(
            "53877",
            "Draconic Paragon Cape",
            'Mode: [select] only\nShould the bot buy "Draconic Paragon Cape" ?',
            false,
        ),
        option.bool("53879", "Draconic Reavers", 'Mode: [select] only\nShould the bot buy "Draconic Reavers" ?', false),
        option.bool(
            "53880",
            "Draconic Rhongomyniad",
            'Mode: [select] only\nShould the bot buy "Draconic Rhongomyniad" ?',
            false,
        ),
        option.bool(
            "53907",
            "Platinum Paragon Medal",
            'Mode: [select] only\nShould the bot buy "Platinum Paragon Medal" ?',
            false,
        ),
        option.bool(
            "53908",
            "Gold Paragon Medal",
            'Mode: [select] only\nShould the bot buy "Gold Paragon Medal" ?',
            false,
        ),
        option.bool(
            "53909",
            "Silver Paragon Medal",
            'Mode: [select] only\nShould the bot buy "Silver Paragon Medal" ?',
            false,
        ),
        option.bool(
            "53910",
            "Bronze Paragon Medal",
            'Mode: [select] only\nShould the bot buy "Bronze Paragon Medal" ?',
            false,
        ),
        option.bool("53863", "Yami no Ronin", 'Mode: [select] only\nShould the bot buy "Yami no Ronin" ?', false),
        option.bool(
            "53864",
            "Yami no Ronin Helm",
            'Mode: [select] only\nShould the bot buy "Yami no Ronin Helm" ?',
            false,
        ),
        option.bool(
            "53865",
            "Yami no Ronin Sheathed Katana",
            'Mode: [select] only\nShould the bot buy "Yami no Ronin Sheathed Katana" ?',
            false,
        ),
        option.bool(
            "53866",
            "Yami no Ronin Shuriken",
            'Mode: [select] only\nShould the bot buy "Yami no Ronin Shuriken" ?',
            false,
        ),
        option.bool(
            "53868",
            "Yami no Ronin Blade",
            'Mode: [select] only\nShould the bot buy "Yami no Ronin Blade" ?',
            false,
        ),
        option.bool(
            "53869",
            "Yami no Ronin Dual Blades",
            'Mode: [select] only\nShould the bot buy "Yami no Ronin Dual Blades" ?',
            false,
        ),
        option.bool(
            "53870",
            "Yami no Ronin Shurikens",
            'Mode: [select] only\nShould the bot buy "Yami no Ronin Shurikens" ?',
            false,
        ),
        option.bool(
            "59972",
            "Undead Legion Healer",
            'Mode: [select] only\nShould the bot buy "Undead Legion Healer" ?',
            false,
        ),
        option.bool(
            "59973",
            "Undead Legion Healer Helm",
            'Mode: [select] only\nShould the bot buy "Undead Legion Healer Helm" ?',
            false,
        ),
        option.bool(
            "59974",
            "Undead Legion Warrior",
            'Mode: [select] only\nShould the bot buy "Undead Legion Warrior" ?',
            false,
        ),
        option.bool(
            "59975",
            "Undead Legion Warrior Helm",
            'Mode: [select] only\nShould the bot buy "Undead Legion Warrior Helm" ?',
            false,
        ),
        option.bool(
            "59976",
            "Undead Legion Mage",
            'Mode: [select] only\nShould the bot buy "Undead Legion Mage" ?',
            false,
        ),
        option.bool(
            "59977",
            "Undead Legion Mage Hat",
            'Mode: [select] only\nShould the bot buy "Undead Legion Mage Hat" ?',
            false,
        ),
        option.bool(
            "59978",
            "Undead Legion Mage Hat+Mask",
            'Mode: [select] only\nShould the bot buy "Undead Legion Mage Hat+Mask" ?',
            false,
        ),
        option.bool(
            "59979",
            "Undead Legion Rogue",
            'Mode: [select] only\nShould the bot buy "Undead Legion Rogue" ?',
            false,
        ),
        option.bool(
            "59980",
            "Undead Legion Rogue Mask + Locks",
            'Mode: [select] only\nShould the bot buy "Undead Legion Rogue Mask + Locks" ?',
            false,
        ),
        option.bool(
            "59981",
            "Undead Legion Rogue Skull",
            'Mode: [select] only\nShould the bot buy "Undead Legion Rogue Skull" ?',
            false,
        ),
        option.bool(
            "60102",
            "Legion DragonBlade of Nulgath",
            'Mode: [select] only\nShould the bot buy "Legion DragonBlade of Nulgath" ?',
            false,
        ),
        option.bool(
            "60878",
            "Legion MonsterHunter",
            'Mode: [select] only\nShould the bot buy "Legion MonsterHunter" ?',
            false,
        ),
        option.bool(
            "60879",
            "Legion MonsterHunter's Helm",
            'Mode: [select] only\nShould the bot buy "Legion MonsterHunter\'s Helm" ?',
            false,
        ),
        option.bool(
            "60880",
            "Legion MonsterHunter's Cape",
            'Mode: [select] only\nShould the bot buy "Legion MonsterHunter\'s Cape" ?',
            false,
        ),
        option.bool(
            "60881",
            "Legion MonsterHunter's Sword",
            'Mode: [select] only\nShould the bot buy "Legion MonsterHunter\'s Sword" ?',
            false,
        ),
        option.bool(
            "51507",
            "Legion Revenant Armor",
            'Mode: [select] only\nShould the bot buy "Legion Revenant Armor" ?',
            false,
        ),
        option.bool(
            "68439",
            "Seven Circles Beast Warrior",
            'Mode: [select] only\nShould the bot buy "Seven Circles Beast Warrior" ?',
            false,
        ),
        option.bool(
            "76442",
            "Ancient Underworld Wraith's Hood",
            'Mode: [select] only\nShould the bot buy "Ancient Underworld Wraith\'s Hood" ?',
            false,
        ),
        option.bool(
            "76446",
            "Ancient Underworld Winged Cape",
            'Mode: [select] only\nShould the bot buy "Ancient Underworld Winged Cape" ?',
            false,
        ),
        option.bool(
            "76449",
            "Legion Bone Crusher",
            'Mode: [select] only\nShould the bot buy "Legion Bone Crusher" ?',
            false,
        ),
        option.bool(
            "76450",
            "Legion Bone Crushers",
            'Mode: [select] only\nShould the bot buy "Legion Bone Crushers" ?',
            false,
        ),
        option.bool(
            "76452",
            "Legion Bone Crusher and Shield",
            'Mode: [select] only\nShould the bot buy "Legion Bone Crusher and Shield" ?',
            false,
        ),
        option.bool(
            "76584",
            "Underworld Warlord",
            'Mode: [select] only\nShould the bot buy "Underworld Warlord" ?',
            false,
        ),
        option.bool(
            "76585",
            "Underworld Warlord Great Helm",
            'Mode: [select] only\nShould the bot buy "Underworld Warlord Great Helm" ?',
            false,
        ),
        option.bool(
            "76586",
            "Underworld Warlord Twisted Helm",
            'Mode: [select] only\nShould the bot buy "Underworld Warlord Twisted Helm" ?',
            false,
        ),
        option.bool(
            "76587",
            "Underworld Warlord Helm",
            'Mode: [select] only\nShould the bot buy "Underworld Warlord Helm" ?',
            false,
        ),
        option.bool(
            "76588",
            "Underworld Warlord Cape",
            'Mode: [select] only\nShould the bot buy "Underworld Warlord Cape" ?',
            false,
        ),
        option.bool(
            "76952",
            "Legion Yulgar's Inn House",
            'Mode: [select] only\nShould the bot buy "Legion Yulgar\'s Inn House" ?',
            false,
        ),
        option.bool(
            "76769",
            "Underworld Parabellum Gauntlets",
            'Mode: [select] only\nShould the bot buy "Underworld Parabellum Gauntlets" ?',
            false,
        ),
        option.bool(
            "76768",
            "Underworld Parabellum Gauntlet",
            'Mode: [select] only\nShould the bot buy "Underworld Parabellum Gauntlet" ?',
            false,
        ),
        option.bool(
            "76767",
            "Underworld Parabellum Armaments",
            'Mode: [select] only\nShould the bot buy "Underworld Parabellum Armaments" ?',
            false,
        ),
        option.bool(
            "76766",
            "Underworld Parabellum Hammer",
            'Mode: [select] only\nShould the bot buy "Underworld Parabellum Hammer" ?',
            false,
        ),
        option.bool(
            "76765",
            "Underworld Parabellum Blades",
            'Mode: [select] only\nShould the bot buy "Underworld Parabellum Blades" ?',
            false,
        ),
        option.bool(
            "76764",
            "Underworld Parabellum Blade",
            'Mode: [select] only\nShould the bot buy "Underworld Parabellum Blade" ?',
            false,
        ),
        option.bool(
            "76763",
            "Underworld Parabellum Sword and Shield",
            'Mode: [select] only\nShould the bot buy "Underworld Parabellum Sword and Shield" ?',
            false,
        ),
        option.bool(
            "76762",
            "Underworld Parabellum Back Sword",
            'Mode: [select] only\nShould the bot buy "Underworld Parabellum Back Sword" ?',
            false,
        ),
        option.bool(
            "76761",
            "Underworld Parabellum Back Shield",
            'Mode: [select] only\nShould the bot buy "Underworld Parabellum Back Shield" ?',
            false,
        ),
        option.bool(
            "76760",
            "Underworld Parabellum Back Hammer",
            'Mode: [select] only\nShould the bot buy "Underworld Parabellum Back Hammer" ?',
            false,
        ),
        option.bool(
            "76759",
            "Underworld Parabellum Guard",
            'Mode: [select] only\nShould the bot buy "Underworld Parabellum Guard" ?',
            false,
        ),
        option.bool(
            "76758",
            "Underworld Parabellum Helm",
            'Mode: [select] only\nShould the bot buy "Underworld Parabellum Helm" ?',
            false,
        ),
        option.bool(
            "76757",
            "Underworld Parabellum Armet",
            'Mode: [select] only\nShould the bot buy "Underworld Parabellum Armet" ?',
            false,
        ),
        option.bool(
            "76756",
            "Underworld Parabellum",
            'Mode: [select] only\nShould the bot buy "Underworld Parabellum" ?',
            false,
        ),
        option.bool(
            "76953",
            "Dage the Lich King Guard",
            'Mode: [select] only\nShould the bot buy "Dage the Lich King Guard" ?',
            false,
        ),
        option.bool(
            "84399",
            "Void Vigilante of the Legion",
            'Mode: [select] only\nShould the bot buy "Void Vigilante of the Legion" ?',
            false,
        ),
        option.bool(
            "84400",
            "Underworld Void Vigilante",
            'Mode: [select] only\nShould the bot buy "Underworld Void Vigilante" ?',
            false,
        ),
        option.bool(
            "84401",
            "Void Legion Horned Maw",
            'Mode: [select] only\nShould the bot buy "Void Legion Horned Maw" ?',
            false,
        ),
        option.bool(
            "84402",
            "Void Vigilante Blade",
            'Mode: [select] only\nShould the bot buy "Void Vigilante Blade" ?',
            false,
        ),
        option.bool(
            "84403",
            "Void Vigilante Blades",
            'Mode: [select] only\nShould the bot buy "Void Vigilante Blades" ?',
            false,
        ),
        option.bool(
            "84404",
            "Underworld Void Vigilante BattleGear",
            'Mode: [select] only\nShould the bot buy "Underworld Void Vigilante BattleGear" ?',
            false,
        ),
        option.bool(
            "84479",
            "Awakened Death's Requiem Staff",
            'Mode: [select] only\nShould the bot buy "Awakened Death\'s Requiem Staff" ?',
            false,
        ),
        option.bool(
            "84920",
            "Flaming Lich King Skull",
            'Mode: [select] only\nShould the bot buy "Flaming Lich King Skull" ?',
            false,
        ),
        option.bool(
            "84921",
            "Undead Lich King Cloak",
            'Mode: [select] only\nShould the bot buy "Undead Lich King Cloak" ?',
            false,
        ),
        option.bool(
            "84740",
            "Underworld Dark Ops",
            'Mode: [select] only\nShould the bot buy "Underworld Dark Ops" ?',
            false,
        ),
        option.bool(
            "84741",
            "Armed Underworld Dark Ops",
            'Mode: [select] only\nShould the bot buy "Armed Underworld Dark Ops" ?',
            false,
        ),
        option.bool(
            "84742",
            "Underworld Dark Breach Ops",
            'Mode: [select] only\nShould the bot buy "Underworld Dark Breach Ops" ?',
            false,
        ),
        option.bool(
            "84743",
            "Underworld Dark Ops Helm",
            'Mode: [select] only\nShould the bot buy "Underworld Dark Ops Helm" ?',
            false,
        ),
        option.bool(
            "84744",
            "Underworld Dark Ops Morph",
            'Mode: [select] only\nShould the bot buy "Underworld Dark Ops Morph" ?',
            false,
        ),
        option.bool(
            "84745",
            "Underworld Dark Ops Mask",
            'Mode: [select] only\nShould the bot buy "Underworld Dark Ops Mask" ?',
            false,
        ),
        option.bool(
            "84746",
            "Dark Ops Briefcase",
            'Mode: [select] only\nShould the bot buy "Dark Ops Briefcase" ?',
            false,
        ),
        option.bool(
            "84747",
            "Dark Ops Tactical Gear",
            'Mode: [select] only\nShould the bot buy "Dark Ops Tactical Gear" ?',
            false,
        ),
        option.bool(
            "84748",
            "Dark Ops Ghost Drone",
            'Mode: [select] only\nShould the bot buy "Dark Ops Ghost Drone" ?',
            false,
        ),
        option.bool(
            "84751",
            "Dark Ops Cold Steel Kukri",
            'Mode: [select] only\nShould the bot buy "Dark Ops Cold Steel Kukri" ?',
            false,
        ),
        option.bool(
            "84752",
            "Dark Ops Cold Steel Kukris",
            'Mode: [select] only\nShould the bot buy "Dark Ops Cold Steel Kukris" ?',
            false,
        ),
        option.bool(
            "84753",
            "Underworld Dark Ops Rifle",
            'Mode: [select] only\nShould the bot buy "Underworld Dark Ops Rifle" ?',
            false,
        ),
        option.bool(
            "84754",
            "Underworld Dark Ops Rifles",
            'Mode: [select] only\nShould the bot buy "Underworld Dark Ops Rifles" ?',
            false,
        ),
        option.bool("85285", "Corpsewax Candle", 'Mode: [select] only\nShould the bot buy "Corpsewax Candle" ?', false),
        option.bool("85286", "Revenant Incendo", 'Mode: [select] only\nShould the bot buy "Revenant Incendo" ?', false),
        option.bool(
            "85287",
            "Underworld Candle",
            'Mode: [select] only\nShould the bot buy "Underworld Candle" ?',
            false,
        ),
        option.bool("85288", "Revenant Candle", 'Mode: [select] only\nShould the bot buy "Revenant Candle" ?', false),
        option.bool("85289", "Regius Revenant", 'Mode: [select] only\nShould the bot buy "Regius Revenant" ?', false),
        option.bool(
            "85290",
            "Regius Underworld Candle",
            'Mode: [select] only\nShould the bot buy "Regius Underworld Candle" ?',
            false,
        ),
        option.bool(
            "84483",
            "Awakened Death's Requiem Axes",
            'Mode: [select] only\nShould the bot buy "Awakened Death\'s Requiem Axes" ?',
            false,
        ),
        option.bool(
            "84482",
            "Awakened Death's Requiem Axe",
            'Mode: [select] only\nShould the bot buy "Awakened Death\'s Requiem Axe" ?',
            false,
        ),
        option.bool("92236", "Nástrandir", 'Mode: [select] only\nShould the bot buy "Nástrandir" ?', false),
        option.bool(
            "92221",
            "Underworld Warbringer Hood",
            'Mode: [select] only\nShould the bot buy "Underworld Warbringer Hood" ?',
            false,
        ),
        option.bool(
            "95803",
            "Naval Dark Caster Hair",
            'Mode: [select] only\nShould the bot buy "Naval Dark Caster Hair" ?',
            false,
        ),
        option.bool(
            "95807",
            "Naval Dark Caster Scarf Hair",
            'Mode: [select] only\nShould the bot buy "Naval Dark Caster Scarf Hair" ?',
            false,
        ),
        option.bool(
            "95808",
            "Naval Dark Caster Eyepatch",
            'Mode: [select] only\nShould the bot buy "Naval Dark Caster Eyepatch" ?',
            false,
        ),
        option.bool(
            "95813",
            "Naval Dark Caster Locks",
            'Mode: [select] only\nShould the bot buy "Naval Dark Caster Locks" ?',
            false,
        ),
        option.bool(
            "95816",
            "Naval Dark Caster Eyepatch Locks",
            'Mode: [select] only\nShould the bot buy "Naval Dark Caster Eyepatch Locks" ?',
            false,
        ),
        option.bool(
            "95819",
            "Naval Dark Caster Bandana Locks",
            'Mode: [select] only\nShould the bot buy "Naval Dark Caster Bandana Locks" ?',
            false,
        ),
        option.bool(
            "95823",
            "Naval Dark Caster Focus Rune",
            'Mode: [select] only\nShould the bot buy "Naval Dark Caster Focus Rune" ?',
            false,
        ),
        option.bool("95843", "Tide of Despair", 'Mode: [select] only\nShould the bot buy "Tide of Despair" ?', false),
        option.bool("95844", "Tides of Despair", 'Mode: [select] only\nShould the bot buy "Tides of Despair" ?', false),
        option.bool(
            "98581",
            "Arcane Shadow Minion House Guard",
            'Mode: [select] only\nShould the bot buy "Arcane Shadow Minion House Guard" ?',
            false,
        ),
        option.bool(
            "98582",
            "Arcane Shadow Minion Battle Pet",
            'Mode: [select] only\nShould the bot buy "Arcane Shadow Minion Battle Pet" ?',
            false,
        ),
        option.bool(
            "5747",
            "BladeMaster Visage + Mask",
            'Mode: [select] only\nShould the bot buy "BladeMaster Visage + Mask" ?',
            false,
        ),
        option.bool(
            "5739",
            "BladeMaster Morph + Mask",
            'Mode: [select] only\nShould the bot buy "BladeMaster Morph + Mask" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: UndeadLegionMerge.select,
});

export default function main(): void {
    const script = new UndeadLegionMerge();
    Core.bankingBlackList.push(
        "Legion Token",
        "Frosted Falchion",
        "Judgement Scythe",
        "Judgement Hammer",
        "Cursed Scimitar",
        "Essence of the Undead Legend",
        "Shadow Shroud",
        "DragonBlade of Nulgath",
        "Fallen MonsterHunter",
        "Fallen MonsterHunter Helm",
        "Fallen MonsterHunter Cape",
        "Fallen MonsterHunter Sword",
        "Exalted Crown",
        "Death's Requiem Staff",
    );

    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
