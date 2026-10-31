/*
name: Enhance Equipped [Selectable]
description: This script will enhance equipped gear with selected enhancements.
tags: enhance, enh, equipped, equip, gear, selectable, select
*/
// Port of Scripts/Enhancement/EnhanceEquipped[Selectable].cs.

import { choices, defineScriptOptions, option } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../core/CoreAdvanced";
import { configEnum, Core } from "../core/CoreBots";

const Adv = new CoreAdvanced();

export class EnhanceEquippedSelect {
    doEnhanceEquippedSelect(): void {
        if (Core.cboBool("DisableAutoEnhance") === true) {
            Core.logger(
                "This bot requires you to have Auto-Enhance enabled, please enable it in Options > CoreBots",
                undefined,
                { messageBox: true, stopBot: true },
            );
        }

        const type = configEnum("type", EnhancementType, EnhancementType.Fighter) ?? null;
        const cSpecial = configEnum("cSpecial", CapeSpecial, CapeSpecial.None) ?? null;
        const hSpecial = configEnum("hSpecial", HelmSpecial, HelmSpecial.None) ?? null;
        const wSpecial = configEnum("wSpecial", WeaponSpecial, WeaponSpecial.None) ?? null;

        Adv.enhanceEquipped(type, { cSpecial, hSpecial, wSpecial });
    }
}

export const scriptOptions = defineScriptOptions("EnhanceEquipSelect", [
    option.choice(
        "type",
        "Enhancement Type",
        "The type of enhancement to use",
        choices(EnhancementType),
        EnhancementType[EnhancementType.Lucky],
    ),
    option.choice(
        "cSpecial",
        "Cape Special",
        "The special enhancement to use on the cape",
        choices(CapeSpecial),
        CapeSpecial[CapeSpecial.None],
    ),
    option.choice(
        "hSpecial",
        "Helm Special",
        "The special enhancement to use on the helm",
        choices(HelmSpecial),
        HelmSpecial[HelmSpecial.None],
    ),
    option.choice(
        "wSpecial",
        "Weapon Special",
        "The special enhancement to use on the weapon",
        choices(WeaponSpecial),
        WeaponSpecial[WeaponSpecial.None],
    ),
]);

export default function main(): void {
    const script = new EnhanceEquippedSelect();
    Core.setOptions(undefined, { disableClassSwap: true });

    script.doEnhanceEquippedSelect();

    Core.setOptions(false);
}
