/*
name: Dark Birthday Token Merge
description: This bot will farm the items belonging to the selected mode for the Dark Birthday Token Merge [1697] in /darkbirthday
tags: dark, birthday, token, merge, darkbirthday, legion, doomknight, doomblade, ultimate, caster, mystic, mystica, swordmaster, assassin, exalted, harbinger, envy, infinite, legions, fiend, fiends, crested, nations, paragon, skull, sigil, pet, loyalty, horns, cloak, accoutrements, marauder, scout, scouts, marauders, morph, back, , ultra, fiendhunter, vhalls, dystopia, fiendhunters, armet, rheyls, edge, violence, sage, petite, sages, disciple, curse, devourer, souls, scythe, activated, operative, operatives, shadow, mortal, painsaw, man, underworld, pain, chainsaw, dages, devastation, sworn, sovereign, empowered, banner, crown, evanescence, terror, enyo, eclipse, eclipses, hand, hands
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/DarkBirthdayTokenMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreLegion } from "../../../legion/CoreLegion";
import { AtlasFallsGearMerge } from "../../../legion/mergeshops/AtlasFallsGearMerge";
import { CoreDageBirthday } from "./CoreDageBirthday";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();
const Dage = new CoreDageBirthday();
const AFGM = new AtlasFallsGearMerge();

export class DarkBirthdayTokenMerge {
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
                case "Obsidian Rock":
                    Legion.obsidianRock(quant);
                    break;
                case "Shard of Armor":

                case "Helm Piece":

                case "Leg Pieces":

                case "Arm Pieces":
                    //3408 requires you to join the legion (1200acs) added a method for non-legions
                    if (Core.isCompletedBefore(793)) {
                        Core.farmingLogger(req.name, quant);
                        Core.equipClass(ClassType.Farm);
                        Core.registerQuests(3408);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.killMonster("underworld", "r8", "Left", "*", "Dread Head", 20, { log: false });
                            bot.wait.forPickup(req.name);
                        }
                        Core.cancelRegisteredQuests();
                    } else {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("undervoid", "Conquest", req.name, quant, { isTemp: false });
                    }
                    break;
                case "Weapon Shard":

                case "Cape Piece":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("undervoid", "Conquest", req.name, quant, { isTemp: false });
                    break;
                case "Sworn Legion Sovereign":

                case "Legion Sovereign":

                case "Legion Sovereign Helm":

                case "Legion Sovereign Horns":

                case "Legion Sovereign Locks":

                case "Empowered Legion Sovereign Locks":

                case "Legion Sovereign Banner":

                case "Legion Sovereign Cloak":

                case "Legion Sovereign Crown":

                case "Evanescence":

                case "Dual Evanescence":

                case "Terror of Enyo":

                case "Eclipse of Enyo":

                case "Eclipses of Enyo":

                case "Hand of the Legion Sovereign":

                case "Hands of the Legion Sovereign":
                    Core.farmingLogger(req.name, quant);
                    AFGM.buyAllMerge(req.name);
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("darkbirthday")) {
            return;
        }

        Dage.undervoid();

        if (!Core.checkInventory("Undead Champion")) {
            Adv.buyItem("underworld", 216, "Undead Champion");
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("darkbirthday", 1697, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("47551", "Legion's Fiend", 'Mode: [select] only\nShould the bot buy "Legion\'s Fiend" ?', false),
        option.bool(
            "41597",
            "Paragon of Loyalty",
            'Mode: [select] only\nShould the bot buy "Paragon of Loyalty" ?',
            false,
        ),
        option.bool("43048", "Envy Armor", 'Mode: [select] only\nShould the bot buy "Envy Armor" ?', false),
        option.bool(
            "28686",
            "Ultimate Dark Caster",
            'Mode: [select] only\nShould the bot buy "Ultimate Dark Caster" ?',
            false,
        ),
        option.bool(
            "28635",
            "Legion DoomKnight Armor",
            'Mode: [select] only\nShould the bot buy "Legion DoomKnight Armor" ?',
            false,
        ),
        option.bool("53550", "Legion Marauder", 'Mode: [select] only\nShould the bot buy "Legion Marauder" ?', false),
        option.bool("53551", "Legion Scout", 'Mode: [select] only\nShould the bot buy "Legion Scout" ?', false),
        option.bool(
            "53595",
            "Ultra FiendHunter",
            'Mode: [select] only\nShould the bot buy "Ultra FiendHunter" ?',
            false,
        ),
        option.bool("59723", "Legion Operative", 'Mode: [select] only\nShould the bot buy "Legion Operative" ?', false),
        option.bool(
            "77004",
            "Mortal Painsaw Man",
            'Mode: [select] only\nShould the bot buy "Mortal Painsaw Man" ?',
            false,
        ),
        option.bool(
            "92851",
            "Dark Sworn Legion Sovereign",
            'Mode: [select] only\nShould the bot buy "Dark Sworn Legion Sovereign" ?',
            false,
        ),
        option.bool(
            "92852",
            "Dark Legion Sovereign",
            'Mode: [select] only\nShould the bot buy "Dark Legion Sovereign" ?',
            false,
        ),
        option.bool(
            "77005",
            "Underworld Painsaw Man",
            'Mode: [select] only\nShould the bot buy "Underworld Painsaw Man" ?',
            false,
        ),
        option.bool(
            "99935",
            "Underworld Death Draoi",
            'Mode: [select] only\nShould the bot buy "Underworld Death Draoi" ?',
            false,
        ),
        option.bool("92636", "Legion Kydoimos", 'Mode: [select] only\nShould the bot buy "Legion Kydoimos" ?', false),
        option.bool(
            "92637",
            "Grand Legion Kydoimos",
            'Mode: [select] only\nShould the bot buy "Grand Legion Kydoimos" ?',
            false,
        ),
        option.bool(
            "99737",
            "Legion Kydoimos Pupil",
            'Mode: [select] only\nShould the bot buy "Legion Kydoimos Pupil" ?',
            false,
        ),
        option.bool(
            "92640",
            "Cydoemus Battle Strife",
            'Mode: [select] only\nShould the bot buy "Cydoemus Battle Strife" ?',
            false,
        ),
        option.bool(
            "99939",
            "Moon Shield of Dhuosnos",
            'Mode: [select] only\nShould the bot buy "Moon Shield of Dhuosnos" ?',
            false,
        ),
        option.bool(
            "99940",
            "Death Draoi's Sword + Shield",
            'Mode: [select] only\nShould the bot buy "Death Draoi\'s Sword + Shield" ?',
            false,
        ),
        option.bool(
            "92858",
            "Dark Legion Sovereign Banner",
            'Mode: [select] only\nShould the bot buy "Dark Legion Sovereign Banner" ?',
            false,
        ),
        option.bool(
            "92859",
            "Dark Legion Sovereign Cloak",
            'Mode: [select] only\nShould the bot buy "Dark Legion Sovereign Cloak" ?',
            false,
        ),
        option.bool(
            "92860",
            "Dark Legion Sovereign Crown",
            'Mode: [select] only\nShould the bot buy "Dark Legion Sovereign Crown" ?',
            false,
        ),
        option.bool(
            "59729",
            "Operative's Shadow",
            'Mode: [select] only\nShould the bot buy "Operative\'s Shadow" ?',
            false,
        ),
        option.bool(
            "77008",
            "Chainsaw Mask of Pain",
            'Mode: [select] only\nShould the bot buy "Chainsaw Mask of Pain" ?',
            false,
        ),
        option.bool("53599", "Vhall's Cape", 'Mode: [select] only\nShould the bot buy "Vhall\'s Cape" ?', false),
        option.bool(
            "53600",
            "Vhall's Cape + Sword",
            'Mode: [select] only\nShould the bot buy "Vhall\'s Cape + Sword" ?',
            false,
        ),
        option.bool(
            "53560",
            "Legion Scout's Cloak",
            'Mode: [select] only\nShould the bot buy "Legion Scout\'s Cloak" ?',
            false,
        ),
        option.bool(
            "53561",
            "Legion Marauder's Back Sword",
            'Mode: [select] only\nShould the bot buy "Legion Marauder\'s Back Sword" ?',
            false,
        ),
        option.bool(
            "53562",
            "Legion Marauder's Cloak + Sword",
            'Mode: [select] only\nShould the bot buy "Legion Marauder\'s Cloak + Sword" ?',
            false,
        ),
        option.bool(
            "41600",
            "Paragon of Loyalty Cloak",
            'Mode: [select] only\nShould the bot buy "Paragon of Loyalty Cloak" ?',
            false,
        ),
        option.bool(
            "42801",
            "Exalted Harbinger",
            'Mode: [select] only\nShould the bot buy "Exalted Harbinger" ?',
            false,
        ),
        option.bool(
            "47465",
            "Infinite Legion Dark Caster",
            'Mode: [select] only\nShould the bot buy "Infinite Legion Dark Caster" ?',
            false,
        ),
        option.bool(
            "38741",
            "Legion DoomKnight",
            'Mode: [select] only\nShould the bot buy "Legion DoomKnight" ?',
            false,
        ),
        option.bool(
            "53839",
            "Legion SwordMaster Assassin",
            'Mode: [select] only\nShould the bot buy "Legion SwordMaster Assassin" ?',
            false,
        ),
        option.bool(
            "59731",
            "Dual Legion Operative's Guns",
            'Mode: [select] only\nShould the bot buy "Dual Legion Operative\'s Guns" ?',
            false,
        ),
        option.bool(
            "41603",
            "Paragon of Loyalty Accoutrements",
            'Mode: [select] only\nShould the bot buy "Paragon of Loyalty Accoutrements" ?',
            false,
        ),
        option.bool(
            "41601",
            "Paragon of Loyalty Daggers",
            'Mode: [select] only\nShould the bot buy "Paragon of Loyalty Daggers" ?',
            false,
        ),
        option.bool(
            "99943",
            "Deathly Moon Sword + Shield",
            'Mode: [select] only\nShould the bot buy "Deathly Moon Sword + Shield" ?',
            false,
        ),
        option.bool(
            "92862",
            "Dual Dark Evanescence",
            'Mode: [select] only\nShould the bot buy "Dual Dark Evanescence" ?',
            false,
        ),
        option.bool(
            "92865",
            "Dark Eclipses of Enyo",
            'Mode: [select] only\nShould the bot buy "Dark Eclipses of Enyo" ?',
            false,
        ),
        option.bool(
            "92645",
            "Dual Theos Apóleia",
            'Mode: [select] only\nShould the bot buy "Dual Theos Apóleia" ?',
            false,
        ),
        option.bool(
            "92866",
            "Dark Hand of the Legion Sovereign",
            'Mode: [select] only\nShould the bot buy "Dark Hand of the Legion Sovereign" ?',
            false,
        ),
        option.bool(
            "92867",
            "Dark Hands of the Legion Sovereign",
            'Mode: [select] only\nShould the bot buy "Dark Hands of the Legion Sovereign" ?',
            false,
        ),
        option.bool(
            "77009",
            "Underworld Painsaw Gauntlet",
            'Mode: [select] only\nShould the bot buy "Underworld Painsaw Gauntlet" ?',
            false,
        ),
        option.bool(
            "77010",
            "Underworld Painsaw Gauntlets",
            'Mode: [select] only\nShould the bot buy "Underworld Painsaw Gauntlets" ?',
            false,
        ),
        option.bool(
            "59730",
            "Legion Operative's Gun",
            'Mode: [select] only\nShould the bot buy "Legion Operative\'s Gun" ?',
            false,
        ),
        option.bool(
            "76977",
            "Dage's Devastation Paragon Helmet",
            'Mode: [select] only\nShould the bot buy "Dage\'s Devastation Paragon Helmet" ?',
            false,
        ),
        option.bool(
            "92854",
            "Dark Legion Sovereign Helm",
            'Mode: [select] only\nShould the bot buy "Dark Legion Sovereign Helm" ?',
            false,
        ),
        option.bool(
            "92855",
            "Dark Legion Sovereign Horns",
            'Mode: [select] only\nShould the bot buy "Dark Legion Sovereign Horns" ?',
            false,
        ),
        option.bool(
            "92856",
            "Dark Legion Sovereign Locks",
            'Mode: [select] only\nShould the bot buy "Dark Legion Sovereign Locks" ?',
            false,
        ),
        option.bool(
            "92857",
            "Empowered Dark Sovereign Locks",
            'Mode: [select] only\nShould the bot buy "Empowered Dark Sovereign Locks" ?',
            false,
        ),
        option.bool(
            "53642",
            "Devourer of Souls Mask",
            'Mode: [select] only\nShould the bot buy "Devourer of Souls Mask" ?',
            false,
        ),
        option.bool(
            "59724",
            "Legion Operative Hood",
            'Mode: [select] only\nShould the bot buy "Legion Operative Hood" ?',
            false,
        ),
        option.bool(
            "59725",
            "Legion Operative Hood + Locks",
            'Mode: [select] only\nShould the bot buy "Legion Operative Hood + Locks" ?',
            false,
        ),
        option.bool(
            "59727",
            "Operative's Locks",
            'Mode: [select] only\nShould the bot buy "Operative\'s Locks" ?',
            false,
        ),
        option.bool(
            "59728",
            "Operative's Morph",
            'Mode: [select] only\nShould the bot buy "Operative\'s Morph" ?',
            false,
        ),
        option.bool(
            "53591",
            "Legion Sage Petite Morph",
            'Mode: [select] only\nShould the bot buy "Legion Sage Petite Morph" ?',
            false,
        ),
        option.bool(
            "53592",
            "Legion Sage Morph",
            'Mode: [select] only\nShould the bot buy "Legion Sage Morph" ?',
            false,
        ),
        option.bool(
            "53593",
            "Legion Sage's Disciple",
            'Mode: [select] only\nShould the bot buy "Legion Sage\'s Disciple" ?',
            false,
        ),
        option.bool(
            "53594",
            "Legion Sage's Curse",
            'Mode: [select] only\nShould the bot buy "Legion Sage\'s Curse" ?',
            false,
        ),
        option.bool(
            "41598",
            "Paragon of Loyalty Horns",
            'Mode: [select] only\nShould the bot buy "Paragon of Loyalty Horns" ?',
            false,
        ),
        option.bool(
            "41599",
            "Paragon of Loyalty Hood",
            'Mode: [select] only\nShould the bot buy "Paragon of Loyalty Hood" ?',
            false,
        ),
        option.bool(
            "47552",
            "Legion Fiend's Crested Helm",
            'Mode: [select] only\nShould the bot buy "Legion Fiend\'s Crested Helm" ?',
            false,
        ),
        option.bool(
            "47553",
            "Nation's Paragon Helm",
            'Mode: [select] only\nShould the bot buy "Nation\'s Paragon Helm" ?',
            false,
        ),
        option.bool(
            "47554",
            "Legion's Fiend Skull Helm",
            'Mode: [select] only\nShould the bot buy "Legion\'s Fiend Skull Helm" ?',
            false,
        ),
        option.bool(
            "28636",
            "Legion DoomKnight Helm",
            'Mode: [select] only\nShould the bot buy "Legion DoomKnight Helm" ?',
            false,
        ),
        option.bool(
            "28688",
            "Mystic Dark Caster Spikes",
            'Mode: [select] only\nShould the bot buy "Mystic Dark Caster Spikes" ?',
            false,
        ),
        option.bool(
            "28690",
            "Mystica Dark Caster Locks",
            'Mode: [select] only\nShould the bot buy "Mystica Dark Caster Locks" ?',
            false,
        ),
        option.bool(
            "53596",
            "Vhall's Dystopia",
            'Mode: [select] only\nShould the bot buy "Vhall\'s Dystopia" ?',
            false,
        ),
        option.bool(
            "53597",
            "Ultra FiendHunter's Skull Armet",
            'Mode: [select] only\nShould the bot buy "Ultra FiendHunter\'s Skull Armet" ?',
            false,
        ),
        option.bool("53598", "Rheyl's Helm", 'Mode: [select] only\nShould the bot buy "Rheyl\'s Helm" ?', false),
        option.bool(
            "53552",
            "Legion Scout's Hood",
            'Mode: [select] only\nShould the bot buy "Legion Scout\'s Hood" ?',
            false,
        ),
        option.bool(
            "53553",
            "Legion Marauder's Hood",
            'Mode: [select] only\nShould the bot buy "Legion Marauder\'s Hood" ?',
            false,
        ),
        option.bool(
            "53554",
            "Legion Scout's Skull Hood",
            'Mode: [select] only\nShould the bot buy "Legion Scout\'s Skull Hood" ?',
            false,
        ),
        option.bool(
            "53555",
            "Legion Marauder's Skull Hood",
            'Mode: [select] only\nShould the bot buy "Legion Marauder\'s Skull Hood" ?',
            false,
        ),
        option.bool(
            "53556",
            "Legion Scout's Skull Mask",
            'Mode: [select] only\nShould the bot buy "Legion Scout\'s Skull Mask" ?',
            false,
        ),
        option.bool(
            "53557",
            "Legion Marauder's Skull Mask",
            'Mode: [select] only\nShould the bot buy "Legion Marauder\'s Skull Mask" ?',
            false,
        ),
        option.bool(
            "53558",
            "Legion Scout's Skull Morph",
            'Mode: [select] only\nShould the bot buy "Legion Scout\'s Skull Morph" ?',
            false,
        ),
        option.bool(
            "53559",
            "Legion Marauder's Skull Morph",
            'Mode: [select] only\nShould the bot buy "Legion Marauder\'s Skull Morph" ?',
            false,
        ),
        option.bool("77006", "Mask of Pain", 'Mode: [select] only\nShould the bot buy "Mask of Pain" ?', false),
        option.bool(
            "77007",
            "Chainsaw Mask of Pain",
            'Mode: [select] only\nShould the bot buy "Chainsaw Mask of Pain" ?',
            false,
        ),
        option.bool(
            "99936",
            "Death Draoi Crown",
            'Mode: [select] only\nShould the bot buy "Death Draoi Crown" ?',
            false,
        ),
        option.bool(
            "99937",
            "Undead Draoi Crown",
            'Mode: [select] only\nShould the bot buy "Undead Draoi Crown" ?',
            false,
        ),
        option.bool(
            "99938",
            "Undead Draoi Skull",
            'Mode: [select] only\nShould the bot buy "Undead Draoi Skull" ?',
            false,
        ),
        option.bool("92638", "Cydoemus Galea", 'Mode: [select] only\nShould the bot buy "Cydoemus Galea" ?', false),
        option.bool(
            "92639",
            "Kydoimos Winged Vision",
            'Mode: [select] only\nShould the bot buy "Kydoimos Winged Vision" ?',
            false,
        ),
        option.bool(
            "53910",
            "Bronze Paragon Medal",
            'Mode: [select] only\nShould the bot buy "Bronze Paragon Medal" ?',
            false,
        ),
        option.bool(
            "53908",
            "Gold Paragon Medal",
            'Mode: [select] only\nShould the bot buy "Gold Paragon Medal" ?',
            false,
        ),
        option.bool(
            "53907",
            "Platinum Paragon Medal",
            'Mode: [select] only\nShould the bot buy "Platinum Paragon Medal" ?',
            false,
        ),
        option.bool("92644", "Theos Apóleia", 'Mode: [select] only\nShould the bot buy "Theos Apóleia" ?', false),
        option.bool(
            "92864",
            "Dark Eclipse of Enyo",
            'Mode: [select] only\nShould the bot buy "Dark Eclipse of Enyo" ?',
            false,
        ),
        option.bool("47348", "Legion Sigil Pet", 'Mode: [select] only\nShould the bot buy "Legion Sigil Pet" ?', false),
        option.bool(
            "53663",
            "Legion Devourer of Souls Blade Pet",
            'Mode: [select] only\nShould the bot buy "Legion Devourer of Souls Blade Pet" ?',
            false,
        ),
        option.bool(
            "53655",
            "Dark Devourer of Souls Scythe",
            'Mode: [select] only\nShould the bot buy "Dark Devourer of Souls Scythe" ?',
            false,
        ),
        option.bool(
            "53652",
            "Legion Devourer of Souls Scythe",
            'Mode: [select] only\nShould the bot buy "Legion Devourer of Souls Scythe" ?',
            false,
        ),
        option.bool(
            "92863",
            "Dark Terror of Enyo",
            'Mode: [select] only\nShould the bot buy "Dark Terror of Enyo" ?',
            false,
        ),
        option.bool("92641", "Theos Antara", 'Mode: [select] only\nShould the bot buy "Theos Antara" ?', false),
        option.bool(
            "92643",
            "Death's Standard",
            'Mode: [select] only\nShould the bot buy "Death\'s Standard" ?',
            false,
        ),
        option.bool(
            "90515",
            "Forbidden Runeblade",
            'Mode: [select] only\nShould the bot buy "Forbidden Runeblade" ?',
            false,
        ),
        option.bool(
            "99941",
            "Black Moon Dhuosnos",
            'Mode: [select] only\nShould the bot buy "Black Moon Dhuosnos" ?',
            false,
        ),
        option.bool(
            "53647",
            "Legion Devourer of Souls Blade",
            'Mode: [select] only\nShould the bot buy "Legion Devourer of Souls Blade" ?',
            false,
        ),
        option.bool(
            "53648",
            "Activated Legion Devourer of Souls Blade",
            'Mode: [select] only\nShould the bot buy "Activated Legion Devourer of Souls Blade" ?',
            false,
        ),
        option.bool("92861", "Dark Evanescence", 'Mode: [select] only\nShould the bot buy "Dark Evanescence" ?', false),
        option.bool(
            "41602",
            "Paragon of Loyalty Blade",
            'Mode: [select] only\nShould the bot buy "Paragon of Loyalty Blade" ?',
            false,
        ),
        option.bool("28637", "Legion DoomBlade", 'Mode: [select] only\nShould the bot buy "Legion DoomBlade" ?', false),
        option.bool("53603", "Rheyl's Edge", 'Mode: [select] only\nShould the bot buy "Rheyl\'s Edge" ?', false),
        option.bool(
            "53604",
            "Vhall's Violence",
            'Mode: [select] only\nShould the bot buy "Vhall\'s Violence" ?',
            false,
        ),
        option.bool(
            "53563",
            "Legion Marauder's Sword",
            'Mode: [select] only\nShould the bot buy "Legion Marauder\'s Sword" ?',
            false,
        ),
        option.bool(
            "53564",
            "Legion Scout's Sword",
            'Mode: [select] only\nShould the bot buy "Legion Scout\'s Sword" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DarkBirthdayTokenMerge.select,
});

export default function main(): void {
    const script = new DarkBirthdayTokenMerge();
    Core.bankingBlackList.push(
        "Legion Token",
        "Obsidian Rock",
        "Shard of Armor",
        "Helm Piece",
        "Leg Pieces",
        "Arm Pieces",
        "Cape Piece",
        "Weapon Shard",
        "Sworn Legion Sovereign",
        "Legion Sovereign",
        "Legion Sovereign Helm",
        "Legion Sovereign Horns",
        "Legion Sovereign Locks",
        "Empowered Legion Sovereign Locks",
        "Legion Sovereign Banner",
        "Legion Sovereign Cloak",
        "Legion Sovereign Crown",
        "Evanescence",
        "Dual Evanescence",
        "Terror of Enyo",
        "Eclipse of Enyo",
        "Eclipses of Enyo",
        "Hand of the Legion Sovereign",
        "Hands of the Legion Sovereign",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
