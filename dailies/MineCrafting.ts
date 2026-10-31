/*
name: Mine Crafting Daily
description: Automatically does the MineCrafting quest for you and picks what metals are needed.
tags: daily, mine, crafting, metal, barium, copper, silver, aluminum, gold, iron, platinum, BLOD
*/
// Port of Scripts/Dailies/MineCrafting.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";
import { CoreBLOD } from "../good/blod/CoreBLOD";

const Daily = new CoreDailies();
const BLOD = new CoreBLOD();

export class MineCrafting {
    doMinecrafting(): void {
        BLOD.unlockMineCrafting();

        if (Daily.checkDailyv2(2091)) {
            if (!Core.checkInventory("Blinding Light of Destiny", undefined, { toInv: false })) {
                Core.logger("Blinding Light of Destiny not owned yet getting metals");
                Daily.mineCrafting(["Barium", "Copper", "Silver"], 1, { toBank: true });
            } else if (!Core.checkInventory("Necrotic Sword of Doom", undefined, { toInv: false })) {
                Core.logger("NSoD not owned yet getting metals");
                Daily.mineCrafting(["Barium"], 4, { toBank: true });
            } else {
                Core.logger("BLoD & NSoD owned, getting extra metals.");
                Daily.mineCrafting(["Aluminum", "Barium", "Gold", "Iron", "Copper", "Silver", "Platinum"], 1, {
                    toBank: true,
                });
            }
        }
        Core.logger("Finished MineCrafting, Checking HardCore Metals(mem)");
        if (!Core.isMember || Daily.checkDailyv2(2090)) {
            Core.logger(
                !Core.isMember
                    ? "Membership required for SDK + HardCoreMetals stopping."
                    : "Daily already complete, try tomarrow.",
            );
            return;
        }

        if (!Core.checkInventory("Sepulchure's DoomKnight Armor", undefined, { toInv: false })) {
            const hardcoreMetals = new Map([
                ["Rhodium", 2],
                ["Beryllium", 1],
                ["Chromium", 2],
            ]);

            for (const metal of hardcoreMetals) {
                if (!Daily.checkDailyv2(2098, [metal[0]], { any: false, shouldUnBank: false })) {
                    return;
                }

                Daily.hardCoreMetals([metal[0]], metal[1], { toBank: true });
            }
        } else {
            Daily.hardCoreMetals(
                ["Arsenic", "Beryllium", "Chromium", "Palladium", "Rhodium", "Rhodium", "Thorium", "Mercury"],
                1,
                { toBank: true },
            );
        }
    }
}

export default function main(): void {
    const script = new MineCrafting();
    Core.setOptions();

    script.doMinecrafting();

    Core.setOptions(false);
}
