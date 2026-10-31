/*
name: Finding Fragments
description: Does the "Finding Fragments with Blinding [weapon] of Destiny" for the quest rewards.
tags: finding fragments, blinding light fragments, spirit, orb, loyal, bright, brilliant, blinding, aura
*/
// Port of Scripts/Good/BLoD/FindingFragments.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../../core/CoreBots";
import { CoreBLOD, WeaponOfDestiny } from "./CoreBLOD";

const BLOD = new CoreBLOD();

export class FindingFragments_Any {
    optionStorage = "FindingFragmentsV2";

    findingFragments(weapon: WeaponOfDestiny = WeaponOfDestiny.Blade): void {
        const quest =
            weapon === WeaponOfDestiny.Bow
                ? 2174
                : weapon === WeaponOfDestiny.Daggers
                  ? 2175
                  : weapon === WeaponOfDestiny.Mace
                    ? 2176
                    : weapon === WeaponOfDestiny.Scythe
                      ? 2177
                      : weapon === WeaponOfDestiny.Broadsword
                        ? 2178
                        : weapon === WeaponOfDestiny.Blade
                          ? 2179
                          : 0;
        for (const item of Core.ensureLoad(quest).rewards) {
            BLOD.findingFragments(weapon, item.name, item.maxStack);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "FindingFragments_Any",
    [
        option.choice(
            "questID",
            "Weapon Type",
            "Select which quest variant you want to do",
            choices(WeaponOfDestiny),
            WeaponOfDestiny[WeaponOfDestiny.Blade],
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new FindingFragments_Any();
    Core.bankingBlackList.push(
        "Blinding Light Fragments",
        "Spirit Orb",
        "Loyal Spirit Orb",
        "Bright Aura",
        "Brilliant Aura",
        "Blinding Aura",
    );
    Core.setOptions();

    script.findingFragments(configEnum("questID", WeaponOfDestiny, WeaponOfDestiny.Daggers));

    Core.setOptions(false);
}
