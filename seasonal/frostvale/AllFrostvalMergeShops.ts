/*
name: All Frostval Merge Shops
description: This script will get all items from all Frostval merge shops.
tags: frostval, frostvale, merge, all, shops, shop, seasonal
*/
// Port of Scripts/Seasonal/Frostvale/AllFrostvalMergeShops.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { BowJanglesMerge } from "./BowJanglesMerge";
import { CarolingMerge } from "./CarolingMerge";
import { FimbulTombMerge } from "./FimbulTombMerge";
import { FrostvalgalaMerge } from "./FrostvalgalaMerge";
import { FrozenSoulMerge } from "./FrozenSoulMerge";
import { GlacialTombMerge } from "./GlacialTombMerge";
import { GundaharsStashMerge } from "./GundaharsStashMerge";
import { HelsgroveMerge } from "./HelsgroveMerge";
import { HuntressMerge } from "./HuntressMerge";
import { SkadePassMerge } from "./SkadePassMerge";
import { SnowviewMerge } from "./SnowviewMerge";
import { SnowviewRaceMerge } from "./SnowviewRaceMerge";
import { UnsungNecropolisMerge } from "./UnsungNecropolisMerge";
import { WinterHorrorWarRewardsMerge } from "./WinterHorrorWarRewardsMerge";

export class AllFrostvalMergeShops {
    private readonly _merges: [Name: string, Run: (arg0: mergeOptionsEnum) => void][] = [
        ["Bow Jangles", (mode) => new BowJanglesMerge().buyAllMerge(undefined, mode)],
        ["Caroling", (mode) => new CarolingMerge().buyAllMerge(undefined, mode)],
        ["Fimbul Tomb", (mode) => new FimbulTombMerge().buyAllMerge(undefined, mode)],
        ["Winter Horror War", (mode) => new WinterHorrorWarRewardsMerge().buyAllMerge(undefined, mode)],
        ["Unsung Necropolis", (mode) => new UnsungNecropolisMerge().buyAllMerge(undefined, mode)],
        ["Snowview", (mode) => new SnowviewMerge().buyAllMerge(undefined, mode)],
        ["Snowview Race", (mode) => new SnowviewRaceMerge().buyAllMerge(undefined, mode)],
        ["SkadePass", (mode) => new SkadePassMerge().buyAllMerge(undefined, mode)],
        ["Huntress", (mode) => new HuntressMerge().buyAllMerge(undefined, mode)],
        ["Helsgrove", (mode) => new HelsgroveMerge().buyAllMerge(undefined, mode)],
        ["Gundahar's Stash", (mode) => new GundaharsStashMerge().buyAllMerge(undefined, mode)],
        ["Glacial Tomb", (mode) => new GlacialTombMerge().buyAllMerge(undefined, mode)],
        ["Frozen Soul", (mode) => new FrozenSoulMerge().buyAllMerge(undefined, mode)],
        ["Frostvalgala", (mode) => new FrostvalgalaMerge().buyAllMerge(undefined, mode)],
    ];

    doAllMerges(option: mergeOptionsEnum): void {
        for (const [name, run] of this._merges) {
            Core.logger(`Starting ${name} Merge Shop`);
            run(option);
            Core.logger(`Finished ${name} Merge Shop`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "AllFrostvalMergeShops",
    [Core.skipOptions, option.bool("acOnly", "AC Only Mode", "True = AC only, False = All items", false)],
    true,
);

export default function main(): void {
    const script = new AllFrostvalMergeShops();
    Core.setOptions();

    const acOnly = bot.config!.get<boolean>("acOnly");
    const mode = acOnly ? mergeOptionsEnum.acOnly : mergeOptionsEnum.all;

    script.doAllMerges(mode);

    Core.setOptions(false);
}
