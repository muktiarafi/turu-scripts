/*
name: Yulgar’s Dual Wield Drop Off Merge
description: This bot will farm the items belonging to the selected mode for the Yulgar’s Dual Wield Drop Off Merge [1312] in /nostalgiaquest
tags: yulgar’s, dual, wield, drop, off, merge, nostalgiaquest, boom, went, dynamite, thewicked, overlords, doomblade, blessed, coffee, cup, party, slasher, birthday, rapier, skulls, frostbite, a, rock, phoenix, nulgath, shadow, spear, guardian, virtue, leviasea, iron, dreadsaw, blood, destruction, painsaw, eidolon, hanzamune, dragon, koi, ugly, stick, balrog, legendary, magma, saw, overfiend, bone, honor, guards, ceremonial, legion, alteons, pride, ddog, sea, serpent, eternity, blinding, light, destiny, crystal, claymore, dark, soulreaper, grumpy, warhammer, maximillians, whip, warpforce, war, shovel, k, godly, mace, ancients, grand, inquisitor, kneecapper, morning, star, black, knight, cruel, midnight, platinum, big, golden, hydra, crusader, bloodriver, breaker, reignbringer, balors, cruelty, default, mighty, dragons, single, butcher, knife, mystic, pencil, endless, scribbles, kroms, brutality, abaddons, terror, awe, burning, abezeth, necrotic, doom, burn, it, down, dragonblade, shadowreaper, cyseros, potato, kuros, wrath, lilith, katana, mammoth, crusher, prismatic, corpse, maker, excavated, glaive, fate, hex, shadowworn, bane, hollowborn, oblivion, revontheus
*/
// Port of Scripts/Other/MergeShops/YulgarsDualWieldDropOffMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { YulgarsDualWieldMerge } from "./YulgarsDualWieldMerge";

const Adv = new CoreAdvanced();
const YDWM = new YulgarsDualWieldMerge();

export class YulgarsDualWieldDropOffMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
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
                case "Dual Boom Went The Dynamite":

                case "Dual TheWicked":

                case "Dual Overlord's DoomBlade":

                case "Dual Blessed Coffee Cup":

                case "Dual Party Slasher Birthday Sword":

                case "Dual Rapier of Skulls":

                case "Dual Frostbite":

                case "Dual Rocks":

                case "Dual Phoenix Blade of Nulgath":

                case "Dual Shadow Spear of Nulgath":

                case "Dual Guardian of Virtue":

                case "Dual Leviasea Sword":

                case "Dual Iron Dreadsaw":

                case "Dual Blood Axe Of Destruction":

                case "Dual PainSaw of Eidolon":

                case "Dual Hanzamune Dragon Koi Blade":

                case "Dual Ugly Stick":

                case "Dual Balrog Blade":

                case "Dual Legendary Magma Sword":

                case "Dual Dragon Saw":

                case "Dual Overfiend Blade of Nulgath":

                case "Dual Bone Sword":

                case "Dual Honor Guard's Blade":

                case "Dual Ceremonial Legion Blade":

                case "Dual Alteon's Pride":

                case "Dual Ddog Sea Serpent Sword":

                case "Dual Eternity Blade":

                case "Dual Blinding Light of Destiny":

                case "Dual Crystal Claymore":

                case "Dual Dark Crystal Claymore":

                case "Dual Soulreaper of Nulgath":

                case "Dual Grumpy Warhammer":

                case "Dual Crystal Phoenix Blade of Nulgath":

                case "Dual Maximillian's Whip":

                case "Dual WarpForce War Shovel 20K":

                case "Dual Godly Mace of the Ancients":

                case "Dual Mace of the Grand Inquisitor":

                case "Dual KneeCappers":

                case "Dual Morning Stars":

                case "Dual Axe of the Black Knight":

                case "Dual Cruel Axe of Midnight":

                case "Dual Platinum Axe of Destiny":

                case "Dual Star Sword":

                case "Dual Big 100K":

                case "Dual Golden Phoenix Sword":

                case "Dual Hydra Blades":

                case "Dual Crusader Sword":

                case "Dual Bloodrivers":

                case "Dual Star Sword Breaker":

                case "Dual ReignBringers":

                case "Dual Balor's Cruelty":

                case "Dual Default Sword":

                case "Dual Iron Spears":

                case "Dual Mighty Sword Of The Dragons":

                case "Butcher Knife":

                case "Dual Pencil of Endless Scribbles":

                case "Dual Krom's Brutalities":

                case "Dual Abaddon's Terrors":

                case "Dual Blades of Awe":

                case "Dual Burning Blades Of Abezeth":

                case "Dual Necrotic Swords of Doom":

                case "Dual Burn it Down Staves":

                case "Phoenix Blades":

                case "Dual Shadow Terror Axes":

                case "Dual DragonBlades of Nulgath":

                case "Dual ShadowReapers Of Doom":

                case "Cysero's Potatoes":

                case "Dual Kuro's Wrath":

                case "Dual Mammoth Crusher Blade":

                case "Dual Lilith Katana":

                case "Dual Light Prismatic Katana":

                case "Dual Corpse Maker of Nulgath":

                case "Dual Excavated Glaive: Sword":

                case "Dual Golden Blade of Fate":

                case "Dual Hex Blade of Nulgath":

                case "Dual Shadowworn":

                case "Dual Bane of Nulgath":

                case "Dual Hollowborn Oblivion Blade":

                case "Dual Katana of Revontheus":
                    YDWM.buyAllMerge(req.name);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("nostalgiaquest", 1312, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "12060",
            "Boom Went The Dynamite",
            'Mode: [select] only\nShould the bot buy "Boom Went The Dynamite" ?',
            false,
        ),
        option.bool("13041", "TheWicked", 'Mode: [select] only\nShould the bot buy "TheWicked" ?', false),
        option.bool(
            "10150",
            "Overlord's DoomBlade",
            'Mode: [select] only\nShould the bot buy "Overlord\'s DoomBlade" ?',
            false,
        ),
        option.bool(
            "36618",
            "Blessed Coffee Cup",
            'Mode: [select] only\nShould the bot buy "Blessed Coffee Cup" ?',
            false,
        ),
        option.bool(
            "2033",
            "Party Slasher Birthday Sword",
            'Mode: [select] only\nShould the bot buy "Party Slasher Birthday Sword" ?',
            false,
        ),
        option.bool("19980", "Rapier of Skulls", 'Mode: [select] only\nShould the bot buy "Rapier of Skulls" ?', false),
        option.bool("6522", "Frostbite", 'Mode: [select] only\nShould the bot buy "Frostbite" ?', false),
        option.bool("9430", "A Rock", 'Mode: [select] only\nShould the bot buy "A Rock" ?', false),
        option.bool(
            "4836",
            "Phoenix Blade of Nulgath",
            'Mode: [select] only\nShould the bot buy "Phoenix Blade of Nulgath" ?',
            false,
        ),
        option.bool(
            "5048",
            "Shadow Spear of Nulgath",
            'Mode: [select] only\nShould the bot buy "Shadow Spear of Nulgath" ?',
            false,
        ),
        option.bool(
            "5828",
            "Guardian of Virtue",
            'Mode: [select] only\nShould the bot buy "Guardian of Virtue" ?',
            false,
        ),
        option.bool("7667", "Leviasea Sword", 'Mode: [select] only\nShould the bot buy "Leviasea Sword" ?', false),
        option.bool("33164", "Iron Dreadsaw", 'Mode: [select] only\nShould the bot buy "Iron Dreadsaw" ?', false),
        option.bool(
            "36465",
            "Blood Axe Of Destruction",
            'Mode: [select] only\nShould the bot buy "Blood Axe Of Destruction" ?',
            false,
        ),
        option.bool(
            "5757",
            "PainSaw of Eidolon",
            'Mode: [select] only\nShould the bot buy "PainSaw of Eidolon" ?',
            false,
        ),
        option.bool(
            "2238",
            "Hanzamune Dragon Koi Blade",
            'Mode: [select] only\nShould the bot buy "Hanzamune Dragon Koi Blade" ?',
            false,
        ),
        option.bool("815", "Ugly Stick", 'Mode: [select] only\nShould the bot buy "Ugly Stick" ?', false),
        option.bool("71", "Balrog Blade", 'Mode: [select] only\nShould the bot buy "Balrog Blade" ?', false),
        option.bool(
            "1006",
            "Legendary Magma Sword",
            'Mode: [select] only\nShould the bot buy "Legendary Magma Sword" ?',
            false,
        ),
        option.bool("26", "Dragon Saw", 'Mode: [select] only\nShould the bot buy "Dragon Saw" ?', false),
        option.bool(
            "6138",
            "Overfiend Blade of Nulgath",
            'Mode: [select] only\nShould the bot buy "Overfiend Blade of Nulgath" ?',
            false,
        ),
        option.bool("47", "Bone Sword", 'Mode: [select] only\nShould the bot buy "Bone Sword" ?', false),
        option.bool(
            "14126",
            "Honor Guard's Blade",
            'Mode: [select] only\nShould the bot buy "Honor Guard\'s Blade" ?',
            false,
        ),
        option.bool(
            "16431",
            "Ceremonial Legion Blade",
            'Mode: [select] only\nShould the bot buy "Ceremonial Legion Blade" ?',
            false,
        ),
        option.bool("2774", "Alteon's Pride", 'Mode: [select] only\nShould the bot buy "Alteon\'s Pride" ?', false),
        option.bool(
            "4766",
            "Ddog Sea Serpent Sword",
            'Mode: [select] only\nShould the bot buy "Ddog Sea Serpent Sword" ?',
            false,
        ),
        option.bool("23689", "Eternity Blade", 'Mode: [select] only\nShould the bot buy "Eternity Blade" ?', false),
        option.bool(
            "14467",
            "Blinding Light of Destiny",
            'Mode: [select] only\nShould the bot buy "Blinding Light of Destiny" ?',
            false,
        ),
        option.bool("1151", "Crystal Claymore", 'Mode: [select] only\nShould the bot buy "Crystal Claymore" ?', false),
        option.bool(
            "1152",
            "Dark Crystal Claymore",
            'Mode: [select] only\nShould the bot buy "Dark Crystal Claymore" ?',
            false,
        ),
        option.bool(
            "4765",
            "Soulreaper of Nulgath",
            'Mode: [select] only\nShould the bot buy "Soulreaper of Nulgath" ?',
            false,
        ),
        option.bool("1236", "Grumpy Warhammer", 'Mode: [select] only\nShould the bot buy "Grumpy Warhammer" ?', false),
        option.bool(
            "6137",
            "Crystal Phoenix Blade of Nulgath",
            'Mode: [select] only\nShould the bot buy "Crystal Phoenix Blade of Nulgath" ?',
            false,
        ),
        option.bool(
            "2045",
            "Maximillian's Whip",
            'Mode: [select] only\nShould the bot buy "Maximillian\'s Whip" ?',
            false,
        ),
        option.bool(
            "1301",
            "WarpForce War Shovel 20K",
            'Mode: [select] only\nShould the bot buy "WarpForce War Shovel 20K" ?',
            false,
        ),
        option.bool(
            "866",
            "Godly Mace of the Ancients",
            'Mode: [select] only\nShould the bot buy "Godly Mace of the Ancients" ?',
            false,
        ),
        option.bool(
            "537",
            "Mace of the Grand Inquisitor",
            'Mode: [select] only\nShould the bot buy "Mace of the Grand Inquisitor" ?',
            false,
        ),
        option.bool("10483", "KneeCapper", 'Mode: [select] only\nShould the bot buy "KneeCapper" ?', false),
        option.bool("55", "Morning Star", 'Mode: [select] only\nShould the bot buy "Morning Star" ?', false),
        option.bool(
            "1546",
            "Axe of the Black Knight",
            'Mode: [select] only\nShould the bot buy "Axe of the Black Knight" ?',
            false,
        ),
        option.bool(
            "1545",
            "Cruel Axe of Midnight",
            'Mode: [select] only\nShould the bot buy "Cruel Axe of Midnight" ?',
            false,
        ),
        option.bool(
            "820",
            "Platinum Axe of Destiny",
            'Mode: [select] only\nShould the bot buy "Platinum Axe of Destiny" ?',
            false,
        ),
        option.bool("74", "Star Sword", 'Mode: [select] only\nShould the bot buy "Star Sword" ?', false),
        option.bool("25", "Big 100K", 'Mode: [select] only\nShould the bot buy "Big 100K" ?', false),
        option.bool(
            "2090",
            "Golden Phoenix Sword",
            'Mode: [select] only\nShould the bot buy "Golden Phoenix Sword" ?',
            false,
        ),
        option.bool("57", "Hydra Blade", 'Mode: [select] only\nShould the bot buy "Hydra Blade" ?', false),
        option.bool("680", "Crusader Sword", 'Mode: [select] only\nShould the bot buy "Crusader Sword" ?', false),
        option.bool("2421", "Bloodriver", 'Mode: [select] only\nShould the bot buy "Bloodriver" ?', false),
        option.bool(
            "2256",
            "Star Sword Breaker",
            'Mode: [select] only\nShould the bot buy "Star Sword Breaker" ?',
            false,
        ),
        option.bool("53", "ReignBringer", 'Mode: [select] only\nShould the bot buy "ReignBringer" ?', false),
        option.bool("441", "Balor's Cruelty", 'Mode: [select] only\nShould the bot buy "Balor\'s Cruelty" ?', false),
        option.bool("1", "Default Sword", 'Mode: [select] only\nShould the bot buy "Default Sword" ?', false),
        option.bool("94", "Iron Spear", 'Mode: [select] only\nShould the bot buy "Iron Spear" ?', false),
        option.bool(
            "22359",
            "Mighty Sword Of The Dragons",
            'Mode: [select] only\nShould the bot buy "Mighty Sword Of The Dragons" ?',
            false,
        ),
        option.bool(
            "41804",
            "Single Butcher Knife",
            'Mode: [select] only\nShould the bot buy "Single Butcher Knife" ?',
            false,
        ),
        option.bool(
            "1008",
            "Mystic Pencil of Endless Scribbles",
            'Mode: [select] only\nShould the bot buy "Mystic Pencil of Endless Scribbles" ?',
            false,
        ),
        option.bool("370", "Krom's Brutality", 'Mode: [select] only\nShould the bot buy "Krom\'s Brutality" ?', false),
        option.bool("2307", "Abaddon's Terror", 'Mode: [select] only\nShould the bot buy "Abaddon\'s Terror" ?', false),
        option.bool("17585", "Blade of Awe", 'Mode: [select] only\nShould the bot buy "Blade of Awe" ?', false),
        option.bool(
            "41453",
            "Burning Blade Of Abezeth",
            'Mode: [select] only\nShould the bot buy "Burning Blade Of Abezeth" ?',
            false,
        ),
        option.bool(
            "30629",
            "Necrotic Sword of Doom",
            'Mode: [select] only\nShould the bot buy "Necrotic Sword of Doom" ?',
            false,
        ),
        option.bool("868", "Burn it Down", 'Mode: [select] only\nShould the bot buy "Burn it Down" ?', false),
        option.bool("300", "Phoenix Blade", 'Mode: [select] only\nShould the bot buy "Phoenix Blade" ?', false),
        option.bool(
            "1961",
            "Shadow Terror Axe",
            'Mode: [select] only\nShould the bot buy "Shadow Terror Axe" ?',
            false,
        ),
        option.bool(
            "5483",
            "DragonBlade of Nulgath",
            'Mode: [select] only\nShould the bot buy "DragonBlade of Nulgath" ?',
            false,
        ),
        option.bool(
            "17488",
            "ShadowReaper Of Doom",
            'Mode: [select] only\nShould the bot buy "ShadowReaper Of Doom" ?',
            false,
        ),
        option.bool("85139", "Cysero's Potato", 'Mode: [select] only\nShould the bot buy "Cysero\'s Potato" ?', false),
        option.bool("369", "Kuro's Wrath", 'Mode: [select] only\nShould the bot buy "Kuro\'s Wrath" ?', false),
        option.bool("6133", "Lilith Katana", 'Mode: [select] only\nShould the bot buy "Lilith Katana" ?', false),
        option.bool(
            "456",
            "Mammoth Crusher Blade",
            'Mode: [select] only\nShould the bot buy "Mammoth Crusher Blade" ?',
            false,
        ),
        option.bool(
            "2715",
            "Light Prismatic Katana",
            'Mode: [select] only\nShould the bot buy "Light Prismatic Katana" ?',
            false,
        ),
        option.bool(
            "4764",
            "Corpse Maker of Nulgath",
            'Mode: [select] only\nShould the bot buy "Corpse Maker of Nulgath" ?',
            false,
        ),
        option.bool(
            "38412",
            "Excavated Glaive: Sword",
            'Mode: [select] only\nShould the bot buy "Excavated Glaive: Sword" ?',
            false,
        ),
        option.bool(
            "38356",
            "Golden Blade of Fate",
            'Mode: [select] only\nShould the bot buy "Golden Blade of Fate" ?',
            false,
        ),
        option.bool(
            "5052",
            "Hex Blade of Nulgath",
            'Mode: [select] only\nShould the bot buy "Hex Blade of Nulgath" ?',
            false,
        ),
        option.bool("20878", "Shadowworn", 'Mode: [select] only\nShould the bot buy "Shadowworn" ?', false),
        option.bool("5529", "Bane of Nulgath", 'Mode: [select] only\nShould the bot buy "Bane of Nulgath" ?', false),
        option.bool(
            "52597",
            "Hollowborn Oblivion Blade",
            'Mode: [select] only\nShould the bot buy "Hollowborn Oblivion Blade" ?',
            false,
        ),
        option.bool(
            "13027",
            "Katana of Revontheus",
            'Mode: [select] only\nShould the bot buy "Katana of Revontheus" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: YulgarsDualWieldDropOffMerge.select,
});

export default function main(): void {
    const script = new YulgarsDualWieldDropOffMerge();
    Core.bankingBlackList.push(
        "Dual Boom Went The Dynamite",
        "Dual TheWicked",
        "Dual Overlord's DoomBlade",
        "Dual Blessed Coffee Cup",
        "Dual Party Slasher Birthday Sword",
        "Dual Rapier of Skulls",
        "Dual Frostbite",
        "Dual Rocks",
        "Dual Phoenix Blade of Nulgath",
        "Dual Shadow Spear of Nulgath",
        "Dual Guardian of Virtue",
        "Dual Leviasea Sword",
        "Dual Iron Dreadsaw",
        "Dual Blood Axe Of Destruction",
        "Dual PainSaw of Eidolon",
        "Dual Hanzamune Dragon Koi Blade",
        "Dual Ugly Stick",
        "Dual Balrog Blade",
        "Dual Legendary Magma Sword",
        "Dual Dragon Saw",
        "Dual Overfiend Blade of Nulgath",
        "Dual Bone Sword",
        "Dual Honor Guard's Blade",
        "Dual Ceremonial Legion Blade",
        "Dual Alteon's Pride",
        "Dual Ddog Sea Serpent Sword",
        "Dual Eternity Blade",
        "Dual Blinding Light of Destiny",
        "Dual Crystal Claymore",
        "Dual Dark Crystal Claymore",
        "Dual Soulreaper of Nulgath",
        "Dual Grumpy Warhammer",
        "Dual Crystal Phoenix Blade of Nulgath",
        "Dual Maximillian's Whip",
        "Dual WarpForce War Shovel 20K",
        "Dual Godly Mace of the Ancients",
        "Dual Mace of the Grand Inquisitor",
        "Dual KneeCappers",
        "Dual Morning Stars",
        "Dual Axe of the Black Knight",
        "Dual Cruel Axe of Midnight",
        "Dual Platinum Axe of Destiny",
        "Dual Star Sword",
        "Dual Big 100K",
        "Dual Golden Phoenix Sword",
        "Dual Hydra Blades",
        "Dual Crusader Sword",
        "Dual Bloodrivers",
        "Dual Star Sword Breaker",
        "Dual ReignBringers",
        "Dual Balor's Cruelty",
        "Dual Default Sword",
        "Dual Iron Spears",
        "Dual Mighty Sword Of The Dragons",
        "Butcher Knife",
        "Dual Pencil of Endless Scribbles",
        "Dual Krom's Brutalities",
        "Dual Abaddon's Terrors",
        "Dual Blades of Awe",
        "Dual Burning Blades Of Abezeth",
        "Dual Necrotic Swords of Doom",
        "Dual Burn it Down Staves",
        "Phoenix Blades",
        "Dual Shadow Terror Axes",
        "Dual DragonBlades of Nulgath",
        "Dual ShadowReapers Of Doom",
        "Cysero's Potatoes",
        "Dual Kuro's Wrath",
        "Dual Lilith Katana",
        "Dual Mammoth Crusher Blade",
        "Dual Light Prismatic Katana",
        "Dual Corpse Maker of Nulgath",
        "Dual Excavated Glaive: Sword",
        "Dual Golden Blade of Fate",
        "Dual Hex Blade of Nulgath",
        "Dual Shadowworn",
        "Dual Bane of Nulgath",
        "Dual Hollowborn Oblivion Blade",
        "Dual Katana of Revontheus",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
