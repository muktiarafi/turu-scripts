/*
name: 17th Birthday Castle Party Merge
description: This bot will farm the items belonging to the selected mode for the 17th Birthday Castle Party Merge [2627] in /castleparty
tags: 17th, birthday, castle, party, merge, castleparty, arcane, guardian, morph, founder, spectacles, evolution, asclepius, ether, creation, spear, royal, fortune, greatsword, greatswords, bejeweled, bounty, bow, warden, hours, scarf, cowl, shadowbound, magus, cloak, dominating, shadowbinder, sigil, gold, jamboree, top, jubilee, triumph, radiant, euphoria
*/
// Port of Scripts/Seasonal/AqwBirthday/17thBirthdayCastlePartyMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CastleParty } from "./CastleParty";

const Adv = new CoreAdvanced();
const CaPa = new CastleParty();

export class CastlePartyGifts {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Castle Courtyard Pool":

                case "Gleaming Ore":

                case "Golden Castle Pool":

                case "Noble Ether Staff":

                case "Royal Fortune Sword":

                case "Royal Fortune Swords":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("castleparty", "Treasure Chest", req.name, quant, { isTemp: req.temp });
                    break;
                case "Dark Descent Rune":

                case "Dark Descent Sigil":

                case "Darkness Rune":

                case "Dominating Shadowbinder":

                case "Shadowbound Magus Cloak":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("castleparty", "Nulgath's Gift", req.name, quant, { isTemp: req.temp });
                    break;
                case "Flux Sigil":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("castleparty", "Drakath's Gift", req.name, quant, { isTemp: req.temp });
                    break;
                case "Giftbox Ribbon":

                case "Golden Euphoria Blade":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("castleparty", "Lost Giftbox", req.name, quant, { isTemp: req.temp });
                    break;
                case "Gilded Gem":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("castleparty", "Noxus' Gift", req.name, quant, { isTemp: req.temp });
                    break;
                case "Iota of Eternity":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("castleparty", "Kathool's Gift", req.name, quant, { isTemp: req.temp });
                    break;
                case "Mana Creation Orb":

                case "Mana Orb":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("castleparty", "Legion Partycrasher", req.name, quant, { isTemp: req.temp });
                    break;
                case "Undying Essence":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("castleparty", "Sally's Gift", req.name, quant, { isTemp: req.temp });
                    break;
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(`The bot hasn't been taught how to get ${req.name}.`, undefined, {
                        messageBox: shouldStop,
                        stopBot: shouldStop,
                    });
                    break;
                }
            }
        };
        Adv.startBuyAllMerge("castleparty", 2627, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool("96136", "Arcane Guardian", 'Mode: [select] only\nShould the bot buy "Arcane Guardian" ?', false),
        option.bool("94831", "Warden of Hours", 'Mode: [select] only\nShould the bot buy "Warden of Hours" ?', false),
        option.bool(
            "93782",
            "Shadowbound Magus",
            'Mode: [select] only\nShould the bot buy "Shadowbound Magus" ?',
            false,
        ),
        option.bool(
            "103778",
            "Refined Classic Paladin",
            'Mode: [select] only\nShould the bot buy "Refined Classic Paladin" ?',
            false,
        ),
        option.bool(
            "103786",
            "Refined Heraldic Paladin",
            'Mode: [select] only\nShould the bot buy "Refined Heraldic Paladin" ?',
            false,
        ),
        option.bool(
            "103787",
            "Refined Auric Paladin",
            'Mode: [select] only\nShould the bot buy "Refined Auric Paladin" ?',
            false,
        ),
        option.bool("73894", "Gold Triumph Axe", 'Mode: [select] only\nShould the bot buy "Gold Triumph Axe" ?', false),
        option.bool(
            "95357",
            "Bejeweled Bounty Bow",
            'Mode: [select] only\nShould the bot buy "Bejeweled Bounty Bow" ?',
            false,
        ),
        option.bool(
            "103783",
            "Paladin's Tribute Cape",
            'Mode: [select] only\nShould the bot buy "Paladin\'s Tribute Cape" ?',
            false,
        ),
        option.bool(
            "93788",
            "Shadowbound Magus Rune Cloak",
            'Mode: [select] only\nShould the bot buy "Shadowbound Magus Rune Cloak" ?',
            false,
        ),
        option.bool(
            "93790",
            "Dominating Shadowbinder Sigil",
            'Mode: [select] only\nShould the bot buy "Dominating Shadowbinder Sigil" ?',
            false,
        ),
        option.bool(
            "96148",
            "Arcane Evolution Blades",
            'Mode: [select] only\nShould the bot buy "Arcane Evolution Blades" ?',
            false,
        ),
        option.bool(
            "96151",
            "Asclepius Creation Staff",
            'Mode: [select] only\nShould the bot buy "Asclepius Creation Staff" ?',
            false,
        ),
        option.bool(
            "95350",
            "Royal Fortune Greatswords",
            'Mode: [select] only\nShould the bot buy "Royal Fortune Greatswords" ?',
            false,
        ),
        option.bool(
            "73895",
            "Gold Triumph Axes",
            'Mode: [select] only\nShould the bot buy "Gold Triumph Axes" ?',
            false,
        ),
        option.bool(
            "103785",
            "Refined Classic Destiny Blades",
            'Mode: [select] only\nShould the bot buy "Refined Classic Destiny Blades" ?',
            false,
        ),
        option.bool(
            "96398",
            "Golden Alteon Statue",
            'Mode: [select] only\nShould the bot buy "Golden Alteon Statue" ?',
            false,
        ),
        option.bool(
            "96399",
            "Golden Tribute Pool",
            'Mode: [select] only\nShould the bot buy "Golden Tribute Pool" ?',
            false,
        ),
        option.bool(
            "96400",
            "Golden Tribute Pool of Honor",
            'Mode: [select] only\nShould the bot buy "Golden Tribute Pool of Honor" ?',
            false,
        ),
        option.bool(
            "96402",
            "Castle Dragon Statue",
            'Mode: [select] only\nShould the bot buy "Castle Dragon Statue" ?',
            false,
        ),
        option.bool(
            "96403",
            "Festive Dragon Statue",
            'Mode: [select] only\nShould the bot buy "Festive Dragon Statue" ?',
            false,
        ),
        option.bool(
            "96404",
            "Giftwrapped Dragon Statue",
            'Mode: [select] only\nShould the bot buy "Giftwrapped Dragon Statue" ?',
            false,
        ),
        option.bool(
            "73892",
            "Gold Jamboree Top Hat",
            'Mode: [select] only\nShould the bot buy "Gold Jamboree Top Hat" ?',
            false,
        ),
        option.bool(
            "73893",
            "Gold Jubilee Top Hat",
            'Mode: [select] only\nShould the bot buy "Gold Jubilee Top Hat" ?',
            false,
        ),
        option.bool(
            "93783",
            "Shadowbound Magus Hair",
            'Mode: [select] only\nShould the bot buy "Shadowbound Magus Hair" ?',
            false,
        ),
        option.bool(
            "93784",
            "Shadowbound Magus Locks",
            'Mode: [select] only\nShould the bot buy "Shadowbound Magus Locks" ?',
            false,
        ),
        option.bool(
            "93785",
            "Shadowbound Magus Hood",
            'Mode: [select] only\nShould the bot buy "Shadowbound Magus Hood" ?',
            false,
        ),
        option.bool(
            "94832",
            "Warden of Hours Scarf",
            'Mode: [select] only\nShould the bot buy "Warden of Hours Scarf" ?',
            false,
        ),
        option.bool(
            "94833",
            "Warden of Hours Cowl",
            'Mode: [select] only\nShould the bot buy "Warden of Hours Cowl" ?',
            false,
        ),
        option.bool(
            "94834",
            "Warden of Hours Morph",
            'Mode: [select] only\nShould the bot buy "Warden of Hours Morph" ?',
            false,
        ),
        option.bool(
            "94835",
            "Warden of Hours Visage",
            'Mode: [select] only\nShould the bot buy "Warden of Hours Visage" ?',
            false,
        ),
        option.bool(
            "94836",
            "Warden of Hours Hair",
            'Mode: [select] only\nShould the bot buy "Warden of Hours Hair" ?',
            false,
        ),
        option.bool(
            "94837",
            "Warden of Hours Locks",
            'Mode: [select] only\nShould the bot buy "Warden of Hours Locks" ?',
            false,
        ),
        option.bool(
            "96137",
            "Arcane Guardian Morph",
            'Mode: [select] only\nShould the bot buy "Arcane Guardian Morph" ?',
            false,
        ),
        option.bool(
            "96138",
            "Arcane Guardian Visage",
            'Mode: [select] only\nShould the bot buy "Arcane Guardian Visage" ?',
            false,
        ),
        option.bool(
            "96139",
            "Arcane Founder Morph",
            'Mode: [select] only\nShould the bot buy "Arcane Founder Morph" ?',
            false,
        ),
        option.bool(
            "96140",
            "Arcane Founder Visage",
            'Mode: [select] only\nShould the bot buy "Arcane Founder Visage" ?',
            false,
        ),
        option.bool(
            "96141",
            "Arcane Spectacles Morph",
            'Mode: [select] only\nShould the bot buy "Arcane Spectacles Morph" ?',
            false,
        ),
        option.bool(
            "96142",
            "Arcane Spectacles Visage",
            'Mode: [select] only\nShould the bot buy "Arcane Spectacles Visage" ?',
            false,
        ),
        option.bool(
            "96143",
            "Arcane Founder Hair",
            'Mode: [select] only\nShould the bot buy "Arcane Founder Hair" ?',
            false,
        ),
        option.bool(
            "96144",
            "Arcane Founder Locks",
            'Mode: [select] only\nShould the bot buy "Arcane Founder Locks" ?',
            false,
        ),
        option.bool(
            "103788",
            "Auric Destiny Helm",
            'Mode: [select] only\nShould the bot buy "Auric Destiny Helm" ?',
            false,
        ),
        option.bool(
            "103779",
            "Refined Classic Helm",
            'Mode: [select] only\nShould the bot buy "Refined Classic Helm" ?',
            false,
        ),
        option.bool(
            "103780",
            "Refined Destiny Helm",
            'Mode: [select] only\nShould the bot buy "Refined Destiny Helm" ?',
            false,
        ),
        option.bool(
            "103781",
            "Refined Classic Visor",
            'Mode: [select] only\nShould the bot buy "Refined Classic Visor" ?',
            false,
        ),
        option.bool(
            "103782",
            "Refined Paladin Morph",
            'Mode: [select] only\nShould the bot buy "Refined Paladin Morph" ?',
            false,
        ),
        option.bool(
            "79358",
            "Lore's Legendary Hero Rune",
            'Mode: [select] only\nShould the bot buy "Lore\'s Legendary Hero Rune" ?',
            false,
        ),
        option.bool(
            "96152",
            "Arcane Evolution Spear",
            'Mode: [select] only\nShould the bot buy "Arcane Evolution Spear" ?',
            false,
        ),
        option.bool(
            "96150",
            "Asclepius Ether Staff",
            'Mode: [select] only\nShould the bot buy "Asclepius Ether Staff" ?',
            false,
        ),
        option.bool(
            "95355",
            "Royal Fortune Staff",
            'Mode: [select] only\nShould the bot buy "Royal Fortune Staff" ?',
            false,
        ),
        option.bool(
            "95349",
            "Royal Fortune Greatsword",
            'Mode: [select] only\nShould the bot buy "Royal Fortune Greatsword" ?',
            false,
        ),
        option.bool(
            "96147",
            "Arcane Evolution Blade",
            'Mode: [select] only\nShould the bot buy "Arcane Evolution Blade" ?',
            false,
        ),
        option.bool(
            "73897",
            "Radiant Euphoria Blade",
            'Mode: [select] only\nShould the bot buy "Radiant Euphoria Blade" ?',
            false,
        ),
        option.bool(
            "103784",
            "Refined Classic Destiny Blade",
            'Mode: [select] only\nShould the bot buy "Refined Classic Destiny Blade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CastlePartyGifts.select,
});

export default function main(): void {
    const script = new CastlePartyGifts();
    Core.bankingBlackList.push(
        "Castle Courtyard Pool",
        "Dark Descent Rune",
        "Dark Descent Sigil",
        "Darkness Rune",
        "Dominating Shadowbinder",
        "Flux Sigil",
        "Giftbox Ribbon",
        "Gilded Gem",
        "Gleaming Ore",
        "Golden Castle Pool",
        "Golden Euphoria Blade",
        "Iota of Eternity",
        "Mana Creation Orb",
        "Mana Orb",
        "Noble Ether Staff",
        "Royal Fortune Sword",
        "Royal Fortune Swords",
        "Shadowbound Magus Cloak",
        "Undying Essence",
    );
    Core.setOptions();
    CaPa.storyline();
    script.buyAllMerge();
    Core.setOptions(false);
}
