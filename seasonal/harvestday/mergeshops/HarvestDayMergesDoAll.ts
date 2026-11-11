/*
name: Harvest Day Merges Do All
description: Runs all Harvest Day merge shop scripts in this folder.
tags: harvestday, harvest, merge, doall
*/
// Port of Scripts/Seasonal/HarvestDay/MergeShops/HarvestDayMergesDoAll.cs.

import { bot, choices, defineScriptOptions, option, type ScriptOption } from "turu";
import { mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { Core, configOr } from "../../../core/CoreBots";
import { AutumnMerge } from "./AutumnMerge";
import { EbilCorpCafeMerge } from "./EbilCorpCafeMerge";
import { EbilHQMerge } from "./EbilCorpHQMerge";
import { FreeasaBirdMerge } from "./FreeasaBirdMerge";
import { HarvestDayParadeMerge } from "./HarvestDayParadeMerge";
import { HarvestMerge } from "./HarvestMerge";
import { ManaHarvestMerge } from "./ManaHarvestMerge";
import { MoglinFeastMerge } from "./MoglinFeastMerge";
import { NightmareHarvestMerge } from "./NightmareHarvestMerge";
import { NightmareHarvestWarMerge } from "./NightmareHarvestWarMerge";
import { RobinasHarvestMerge } from "./RobinasHarvestMerge";

export enum HarvestDayMergesDoAllMode {
    all = 0,
    acOnly = 1,
    mergeMats = 2,
    select = 3,
}

export class HarvestDayMergesDoAll {
    static readonly generic = [
        Core.skipOptions,
        option.choice(
            "mode",
            "Purchase mode for all shops",
            "Choose one purchase mode to apply to every Harvest Day merge shop.",
            choices(HarvestDayMergesDoAllMode),
            "all",
        ),
    ];

    // Every shop's Select options, each under a header.
    static readonly select = [
        ...HarvestDayMergesDoAll.mergeShopSelectOptions("Autumn", AutumnMerge.select),
        ...HarvestDayMergesDoAll.mergeShopSelectOptions("Ebil Corp Cafe", EbilCorpCafeMerge.select),
        ...HarvestDayMergesDoAll.mergeShopSelectOptions("Ebil Corp HQ", EbilHQMerge.select),
        ...HarvestDayMergesDoAll.mergeShopSelectOptions("Free as a Bird", FreeasaBirdMerge.select),
        ...HarvestDayMergesDoAll.mergeShopSelectOptions("Harvest Day Parade", HarvestDayParadeMerge.select),
        ...HarvestDayMergesDoAll.mergeShopSelectOptions("Harvest", HarvestMerge.select),
        ...HarvestDayMergesDoAll.mergeShopSelectOptions("Mana Harvest", ManaHarvestMerge.select),
        ...HarvestDayMergesDoAll.mergeShopSelectOptions("Moglin Feast", MoglinFeastMerge.select),
        ...HarvestDayMergesDoAll.mergeShopSelectOptions("Nightmare Harvest", NightmareHarvestMerge.select),
        ...HarvestDayMergesDoAll.mergeShopSelectOptions("Nightmare Harvest War", NightmareHarvestWarMerge.select),
        ...HarvestDayMergesDoAll.mergeShopSelectOptions("Robina's Harvest", RobinasHarvestMerge.select),
    ];

    getMergeShopActions(): (() => void)[] {
        const buyMode = this.getBuyMode();
        return [
            () => new AutumnMerge().buyAllMerge(null, buyMode),
            () => new EbilCorpCafeMerge().buyAllMerge(null, buyMode),
            () => new EbilHQMerge().buyAllMerge(null, buyMode),
            () => new FreeasaBirdMerge().buyAllMerge(null, buyMode),
            () => new HarvestDayParadeMerge().buyAllMerge(null, buyMode),
            () => new HarvestMerge().buyAllMerge(null, buyMode),
            () => new ManaHarvestMerge().buyAllMerge(null, buyMode),
            () => new MoglinFeastMerge().buyAllMerge(null, buyMode),
            () => new NightmareHarvestMerge().buyAllMerge(null, buyMode),
            () => new NightmareHarvestWarMerge().buyAllMerge(null, buyMode),
            () => new RobinasHarvestMerge().buyAllMerge(null, buyMode),
        ];
    }

    private getBuyMode(): mergeOptionsEnum {
        // C# Bot.Config?.Get<HarvestDayMergesDoAllMode>("Generic", "mode") ?? all.
        const name = configOr("Generic", "mode", "all");
        const mode =
            typeof HarvestDayMergesDoAllMode[name as keyof typeof HarvestDayMergesDoAllMode] === "number"
                ? HarvestDayMergesDoAllMode[name as keyof typeof HarvestDayMergesDoAllMode]
                : HarvestDayMergesDoAllMode.all;
        return HarvestDayMergesDoAll.toBuyMode(mode);
    }

    private static toBuyMode(mode: HarvestDayMergesDoAllMode): mergeOptionsEnum {
        return mode === HarvestDayMergesDoAllMode.acOnly
            ? mergeOptionsEnum.acOnly
            : mode === HarvestDayMergesDoAllMode.mergeMats
              ? mergeOptionsEnum.mergeMats
              : mode === HarvestDayMergesDoAllMode.select
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

export const scriptOptions = defineScriptOptions("HarvestDayMergesDoAll", [], true, {
    Generic: HarvestDayMergesDoAll.generic,
    Select: HarvestDayMergesDoAll.select,
});

export default function main(): void {
    const script = new HarvestDayMergesDoAll();
    Core.bankingBlackList.push(
        "Fallen Leaf",
        "Gold Flake",
        "Gnarled Wood",
        "Blight Bone",
        "Turdraken Carver",
        "Harvest Rifle",
        "Turdraken Carvers",
        "Vintage Shotgun",
        "Cranberry Shoulder Imp",
        "Nightmare Medal ",
        "Earplug ",
        "Golden Leaves",
        "Persimmon Branch",
        "Fall Fruit Basket",
        "Fae Dust",
        "Fall Fae Assassin Morph",
        "Fall Fae Assassin Visage",
        "Emergency Rations",
        "Glossly Chestnut Waves",
        "Glossy Chestnut Locks",
        "Goredon's Zard Sauce",
        "Harvest Golem Parfait",
        "Ultra Turdrakogiblet",
        "Wretched Rider Meat",
        "Overgourd Seed",
        "Autumnal Civilian",
        "Maple Leaf",
        "Burnt Feather",
        "Autumnal Civilian Hair",
        "Autumnal Locks",
        "Scarbucks Pumpkin Spice Latte",
        "Scarbucks Pumpkin Pie",
        "Iron Ore",
        "TurKing Claw",
        "Guncraft Shadowslayer Big Iron",
        "Guncraft Shadowslayer Big Irons ",
        "Pink Balloon Scrap",
        "Green Balloon Scrap",
        "Red Balloon Scrap ",
        "Stymphalian's Bronze Feather",
        "Tin Can of ???",
        "PACVEC Mach 1.0",
        "PACVEC Helm",
        "PACVEC Visor",
        "PACVEC Guard",
        "PACVEC Battle Wings",
        "PACVEC Battle Hammer",
        "PACVEC Railgun",
        "PACVEC Alien",
        "EbilCoin",
        "Ebil Operative",
        "Ebil Operative Hair + Mask",
        "Ebil Operative Protective Gear",
        "Ebil Operative Hair + Muffler",
        "Ebil Operative Hair + Scarf",
        "Ebil Operative Edgy Hair + Mask",
        "Ebil Operative Edgy Protective Gear",
        "Ebil Operative Edgy Hair + Scarf",
        "Ebil Operative Edgy Hair + Muffler",
        "Ebil Operative Mask Helm",
        "Ebil Operative Helm + Scarf",
        "Ebil Operative Hood + Mask",
        "Ebil Operative Crossed Baton Blades",
        "Ebil Operative Cape",
        "Ebil Operative Baton Blade",
        "Ebil Operative Death Blade",
        "Ebil Operative Long Baton",
        "Ebil Operative Tactical Rifle",
    );

    Core.setOptions();

    for (const buy of script.getMergeShopActions()) {
        if (bot.shouldExit) {
            break;
        }

        buy();
    }

    Core.setOptions(false);
}
