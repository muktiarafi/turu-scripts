/*
name: Sepulchure's Dark DoomBlade
description: This script will get Sepulchure's Dark DoomBlade.
tags: sepulchure, doomblade, dark doomblade, doom seal, darkness shard, undead doomblade, doom blade
*/
// Port of Scripts/Other/Weapons/SepulchuresDarkDoomBlade.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { DarknessShard } from "../materials/DarknessShard";

const DS = new DarknessShard();

export class GetSDDB {
    getWeapon(): void {
        if (
            Core.checkInventory("Sepulchure's Dark DoomBlade") ||
            (!Core.checkInventory("Sepulchure's Dark DoomBlade") &&
                !Core.checkInventory("Sepulchure's Undead DoomBlade"))
        ) {
            Core.logger(
                "You already own this weapon or you don't have the required weapon (Sepulchure's Undead DoomBlade).",
            );
            return;
        }

        Core.addDrop(...Core.questRewards(6397));

        // Dark Doomblade (6397)
        Core.ensureAccept(6397);
        Core.huntMonster("ebondungeon", "Elite Dungeon Guard", "Doom Seal", 13, { isTemp: false });
        DS.getShard(1);
        Core.ensureComplete(6397);
    }
}

export default function main(): void {
    const script = new GetSDDB();
    Core.setOptions();

    script.getWeapon();

    Core.setOptions(false);
}
