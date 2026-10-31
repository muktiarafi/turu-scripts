/*
name: ArchfiendDragonEgg[Mem]
description: null
tags: null
*/
// Port of Scripts/Nation/Various/ArchfiendDragonEgg[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, SkillUseMode } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreHollowborn } from "../../hollowborn/CoreHollowborn";

const HB = new CoreHollowborn();

export class ArchfiendDragonEgg {
    getAFDE(): void {
        if (!Core.isMember) {
            return;
        }

        if (Core.checkInventory("ArchFiend Baby Dragon Pet")) {
            return;
        }

        Core.addDrop("ArchFiend Baby Dragon Pet");

        Core.ensureAccept(7296);
        Core.buyItem("Airstorm", 357, "Breath of Life");
        Core.huntMonster("queenspire", "Fire Guardian Dragon", "Fire Guardian Dragon Soul", undefined, {
            isTemp: false,
        });
        HB.freshSouls(1, 10);
        //why the fuck was the class buffed!?
        const usethis =
            bot.inventory.items
                .concat(...bot.bank.items)
                .find((n) => n.name === "Yami no Ronin" || n.name.startsWith("Chaos Slayer")) ?? null;
        if (usethis != null) {
            Core.equip(usethis.id);
            Core.equip(...Core.farmGear);
            if (usethis.name === "Yami no Ronin") {
                bot.skills.startSkills("1 | 4", -1, SkillUseMode.UseIfAvailable);
            }
        } else {
            Core.equipClass(ClassType.Dodge);
        }
        Core.huntMonster("Underlair", "ArchFiend DragonLord", "Fiendish Brimstone", undefined, { isTemp: false });
        Core.buyItem("Ariapet", 12, "ArchFiend Dragon Egg");
        Core.ensureComplete(7296);
        bot.wait.forPickup("ArchFiend Baby Dragon Pet");
        Core.equipClass(ClassType.Solo);
    }
}

export default function main(): void {
    const script = new ArchfiendDragonEgg();
    Core.setOptions();

    script.getAFDE();

    Core.setOptions(false);
}
