/*
name: Mogloween Merges Do All
description: Runs all Mogloween merge shop scripts in this folder.
tags: mogloween, merge, doall
*/
// Port of Scripts/Seasonal/Mogloween/MergeShops/MogloweenMergesDoAll.cs.

import { bot, choices, defineScriptOptions, option, type ScriptOption } from "turu";
import { mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { Core, configOr } from "../../../core/CoreBots";
import { AlnswickCastleMerge } from "./AlnswickCastleMerge";
import { CandiedCostumesMerge } from "./CandiedCostumesMerge";
import { ChromaCandyMerge } from "./ChromaCandyMerge";
import { CrescentMerge } from "./CrescentMerge";
import { ElodeasCandyHaulMerge } from "./ElodeasCandyHaulMerge";
import { FeastoftheDepths } from "./FeastoftheDepthsMerge";
import { HuntersReward } from "./HuntersReward";
import { MogGLOWweenMerge } from "./Mog-GLOW-weenMerge";
import { MogloweenSeasonalMerge } from "./MogloweenSeasonalMerge";
import { TricktownMerge } from "./TricktownMerge";
import { UngourdlyGearMerge } from "./UngourdlyGearMerge";
import { VampireLordMerge } from "./VampireLordMerge";
import { WalpurgaWitchWares } from "./WalpurgaWitchWares";
import { WitchsCharms } from "./WitchsCharms";
import { MoonlightKhopeshMerge } from "../MoonlightKhopeshMerge";

export enum MogloweenMergesDoAllMode {
    all = 0,
    acOnly = 1,
    mergeMats = 2,
    select = 3,
}

export class MogloweenMergesDoAll {
    static readonly generic = [
        Core.skipOptions,
        option.choice(
            "mode",
            "Purchase mode for all shops",
            "Choose one purchase mode to apply to every Mogloween merge shop.",
            choices(MogloweenMergesDoAllMode),
            "all",
        ),
        option.bool(
            "mogloweenBuyUndeadWarrior",
            "Buy Undead Warrior and join the Legion",
            "When enabled, the script may buy Undead Warrior, join the Legion, and farm Legion Tokens. When disabled, it skips all Legion items and actions.",
            false,
        ),
    ];

    // Every shop's Select options, each under a header.
    static readonly select = [
        ...MogloweenMergesDoAll.mergeShopSelectOptions("Alnswick Castle", AlnswickCastleMerge.select),
        ...MogloweenMergesDoAll.mergeShopSelectOptions("Candied Costumes", CandiedCostumesMerge.select),
        ...MogloweenMergesDoAll.mergeShopSelectOptions("Chroma Candy", ChromaCandyMerge.select),
        ...MogloweenMergesDoAll.mergeShopSelectOptions("Crescent", CrescentMerge.select),
        ...MogloweenMergesDoAll.mergeShopSelectOptions("Elodea's Candy Haul", ElodeasCandyHaulMerge.select),
        ...MogloweenMergesDoAll.mergeShopSelectOptions("Feast of the Depths", FeastoftheDepths.select),
        ...MogloweenMergesDoAll.mergeShopSelectOptions("Hunter's Reward", HuntersReward.select),
        ...MogloweenMergesDoAll.mergeShopSelectOptions("Mog-GLOW-ween", MogGLOWweenMerge.select),
        ...MogloweenMergesDoAll.mergeShopSelectOptions("Mogloween Seasonal", MogloweenSeasonalMerge.select),
        ...MogloweenMergesDoAll.mergeShopSelectOptions("Moonlight Khopesh", MoonlightKhopeshMerge.select),
        ...MogloweenMergesDoAll.mergeShopSelectOptions("Tricktown", TricktownMerge.select),
        ...MogloweenMergesDoAll.mergeShopSelectOptions("Ungourdly Gear", UngourdlyGearMerge.select),
        ...MogloweenMergesDoAll.mergeShopSelectOptions("Vampire Lord", VampireLordMerge.select),
        ...MogloweenMergesDoAll.mergeShopSelectOptions("Walpurga Witch Wares", WalpurgaWitchWares.select),
        ...MogloweenMergesDoAll.mergeShopSelectOptions("Witch's Charms", WitchsCharms.select),
    ];

    getMergeShopActions(): (() => void)[] {
        const buyMode = this.getBuyMode();
        return [
            () => new AlnswickCastleMerge().buyAllMerge(null, buyMode),
            () => new CandiedCostumesMerge().buyAllMerge(null, buyMode),
            () => new ChromaCandyMerge().buyAllMerge(null, buyMode),
            () => new CrescentMerge().buyAllMerge(null, buyMode),
            () => new ElodeasCandyHaulMerge().buyAllMerge(null, buyMode),
            () => new FeastoftheDepths().buyAllMerge(null, buyMode),
            () => new HuntersReward().buyAllMerge(null, buyMode),
            () => new MogGLOWweenMerge().buyAllMerge(null, buyMode),
            () => new MogloweenSeasonalMerge().buyAllMerge(null, buyMode),
            () => new MoonlightKhopeshMerge().buyAllMerge(null, buyMode),
            () => new TricktownMerge().buyAllMerge(null, buyMode),
            () => new UngourdlyGearMerge().buyAllMerge(null, buyMode),
            () => new VampireLordMerge().buyAllMerge(null, buyMode),
            () => new WalpurgaWitchWares().buyAllMerge(null, buyMode),
            () => new WitchsCharms().buyAllMerge(null, buyMode),
        ];
    }

    private getBuyMode(): mergeOptionsEnum {
        // C# Bot.Config?.Get<MogloweenMergesDoAllMode>("Generic", "mode") ?? all.
        const name = configOr("Generic", "mode", "all");
        const mode =
            typeof MogloweenMergesDoAllMode[name as keyof typeof MogloweenMergesDoAllMode] === "number"
                ? MogloweenMergesDoAllMode[name as keyof typeof MogloweenMergesDoAllMode]
                : MogloweenMergesDoAllMode.all;
        return MogloweenMergesDoAll.toBuyMode(mode);
    }

    private static toBuyMode(mode: MogloweenMergesDoAllMode): mergeOptionsEnum {
        return mode === MogloweenMergesDoAllMode.acOnly
            ? mergeOptionsEnum.acOnly
            : mode === MogloweenMergesDoAllMode.mergeMats
              ? mergeOptionsEnum.mergeMats
              : mode === MogloweenMergesDoAllMode.select
                ? mergeOptionsEnum.select
                : mergeOptionsEnum.all;
    }

    private static mergeShopSelectOptions(shopName: string, selectOptions: readonly ScriptOption[]): ScriptOption[] {
        // C# makes the header a transient Option<string>: a label, never read.
        return [
            option.text(
                `header_${shopName.replace(/[^\p{L}\p{N}]/gu, "")}`,
                `========== ${shopName.toUpperCase()} MERGE SHOP ==========`,
                `Select items from the ${shopName} merge shop.`,
                " ",
            ),
            ...selectOptions,
        ];
    }
}

export const scriptOptions = defineScriptOptions("MogloweenMergesDoAll", [], true, {
    Generic: MogloweenMergesDoAll.generic,
    Select: MogloweenMergesDoAll.select,
});

export default function main(): void {
    const script = new MogloweenMergesDoAll();
    Core.bankingBlackList.push(
        "Candy Dragon Egg",
        "Jiangshi",
        "Jiangshi Hair",
        "Jiangshi Locks",
        "Jiangshi Hat",
        "Jiangshi Cap",
        "Jiangshi Talisman Hair",
        "Jiangshi Talisman Locks",
        "Jiangshi Bandages",
        "MarshMeowllows",
        "Horehound Bits",
        "Kitty Cordials",
        "Gummy Brains",
        "Gold Voucher 25k",
        "Tactical Agent Alpha",
        "Tactical Agent Bravo",
        "Tactical Agent Bravo Beard",
        "Tactical Agent Bravo Locks",
        "Tactical Alpha Rifle",
        "Tactical Alpha Rifles",
        "Backup Ol Reliable Zombie Buster",
        "Orange Dye",
        "Green Dye",
        "Yellow Dye",
        "Black Dye",
        "Purple Dye",
        "Pink Dye ",
        "Royce's Direclaw",
        "Spectral Lycan",
        "Spectral Lycan's Hood",
        "Spectral Lycan's Morph",
        "Spectral Lycan's Backfur",
        "Howling Spectral Lycan",
        "Spectral Ground Flames",
        "Spectral Lycan's Spear",
        "Spectral Lycan's Claws ",
        "Nudibranch Roe",
        "Barnacle Rash",
        "Shrimp Noodle Pack",
        "Dzeza Welcome Pack",
        "Dzeza Coconuts",
        "Desiccated Bulbs",
        "Head of Hair",
        "Bucket of Molars",
        "Thok's War Armor",
        "Arcana's Vesture",
        "Metrea's Garb",
        "Juvania's Robes",
        "Great Calabaza Blade",
        "Great Calabaza Blades",
        "Pumpkin King's Revenge",
        "Dual Pumpkin King's Revenge",
        "Pumpkin Fever Staff",
        "Kabocha King Naginata",
        "Pumpkin King's Wrath",
        "Dual Pumpkin King's Wrath",
        "Pumpkin Fever Axe",
        "Pumpkin Fever Axes",
        "Thok's Hair",
        "Arcana's Locks",
        "Metrea's Locks",
        "Juvania's Locks",
        "Acromegalia Seed",
        "Depths Scale",
        "Darkovian Nobility Hair",
        "Darkovian Nobility Locks",
        "Darkovian Pup Hair",
        "Darkovian Pup Locks",
        "Silver Stake",
        "Glowball ",
        "Candy Corn",
        "Box-o-Chocolates",
        "Lol-E-Pop",
        "Ghostly Cape",
        "Cursed Bone Club",
        "Ivy Blade",
        "Blister's Chainsaw",
        "Medusa Curse",
        "Sinister Pumpkin Sickles",
        "Great Pumpkin King Sword",
        "Legion Token",
        "Diamond of Nulgath ",
        "Treats",
        "Ghastly Gummy ",
        "Blood Moon Token ",
        "Gothic Guest Hair",
        "Gothic Guest Locks",
        "Hollyhock Brew",
        "Owl's Dark Guise",
        "Poltergeistcorn Snack",
        "Poltergeistcorn Snacks",
        "Roosting Owl",
        "Rufous Wisdom Staff",
        "Sinema Snack",
        "Sinema Snacks",
        "Stikini Witch Visage",
        "Strikini Witch Morph",
        "Tiny Pink Princess Cupcake",
        "Tiny Pink Princess Cupcakes",
        "Upsizer",
        "Luna Dial",
        "Silverblood Blade",
        "Sventura",
        "Witch Princess' Hat",
    );

    // C# Get<bool>(SkipOptions) finds the option in any group; it's in Generic here.
    if (bot.config.has("Generic", Core.skipOptions.name) && !bot.config.get<boolean>("Generic", Core.skipOptions.name))
        bot.config.configure();

    Core.setOptions();

    for (const buy of script.getMergeShopActions()) {
        buy();
    }

    Core.setOptions(false);
}
