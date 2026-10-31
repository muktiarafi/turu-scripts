/*
name: Eternal Dragon Drops
description: Farms "all drops" From Mob: "Eternal Dragon".
tags: eternal dragon, drops
*/
// Port of Scripts/Other/EternalDragonDrops.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { ClassType, Core } from "../core/CoreBots";

export class EternalDragonDrops {
    getDrops(): void {
        const MemDrops = ["Dark Embrace Of The Queen", "ShadowFlame Aura"];

        const NonMemDrops = [
            "Dark Stars",
            "Embrace of the Queen",
            "Enchanted Dragon's Battle Gear",
            "Monster Queen's Locks",
            "Monster Queen's Malicious Morph",
            "Monster Queen's Wings",
            "Requiescat Regina",
            "Requiescat Regina Cane",
            "Requiescat Regina Hair",
            "Requiescat Regina Locks",
            "ShadowFlame Portal",
            "Timestream Ravager's Sigil",
        ];

        if (Core.checkInventory(NonMemDrops)) {
            Core.logger("You already have the items");
            return;
        }

        if (Core.isMember) {
            Core.addDrop(...MemDrops);
        }
        Core.addDrop(...NonMemDrops);

        Core.equipClass(ClassType.Solo);

        Core.logger("Starting to get drops");
        //Can't Solo section
        if (!bot.config!.get<boolean>("CanSolo")) {
            while (!bot.shouldExit && !Core.checkInventory(NonMemDrops)) {
                for (const item of NonMemDrops) {
                    Core.huntMonster("deadlines", "Eternal Dragon", item, undefined, {
                        isTemp: false,
                        publicRoom: true,
                    });
                }
            }
        } else {
            while (!bot.shouldExit && !Core.checkInventory(NonMemDrops)) {
                for (const item of NonMemDrops) {
                    Core.huntMonster("deadlines", "Eternal Dragon", item, undefined, { isTemp: false });
                }
            }
        }
    }
}

export const scriptOptions = defineScriptOptions("EternalDragonDrops", [
    Core.skipOptions,
    option.bool("CanSolo", "Can solo boss?", "unchecking this will take you to public room", false),
]);

export default function main(): void {
    const script = new EternalDragonDrops();
    Core.setOptions();

    script.getDrops();

    Core.setOptions(false);
}
